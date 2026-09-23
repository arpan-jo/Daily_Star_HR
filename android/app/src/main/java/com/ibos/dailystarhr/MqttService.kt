package net.thedailystar

import android.app.*
import android.content.*
import android.location.Location
import android.os.*
import android.util.Log
import com.facebook.react.ReactApplication
import com.facebook.react.bridge.ReactApplicationContext
import com.google.android.gms.location.*
import com.google.android.gms.location.ActivityRecognition
import com.google.android.gms.location.ActivityRecognitionClient
import com.google.android.gms.location.ActivityRecognitionResult
import com.google.android.gms.location.DetectedActivity
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import java.util.*

class MqttService : Service(), BluetoothDeviceListener {

    companion object {
        var instance: MqttService? = null
        private var currentActivity: String = "Unknown"

        /** Fallback when the JS template carries no distanceToLocationSync. */
        const val DEFAULT_MIN_DISTANCE_M = 10f

        // Office-hours fallback when the template carries no window (6AM–6PM).
        const val DEFAULT_FROM_MINUTES = 6 * 60
        const val DEFAULT_TO_MINUTES = 18 * 60

        /** Matches the intent-filter LocationReciever is registered for. */
        const val ACTION_RESTART = "net.thedailystar.RESTART_MQTT"

        private const val NOTIF_ID = 1
        private const val WINDOW_CHECK_INTERVAL_MS = 60_000L
        private const val SELF_HEAL_INTERVAL_MS = 15 * 60_000L
        private const val TASK_REMOVED_RESTART_MS = 5_000L
        private const val RESTART_REQUEST_CODE = 4201

        fun updateActivity(activity: String) {
            currentActivity = activity
        }
    }

    // MQTT — sourced from .env via BuildConfig, not hardcoded here.
    // ponytail: BuildConfig strings are still recoverable from the APK. The only real
    // fix is short-lived per-session broker credentials issued by the backend.
    private val serverUri = BuildConfig.MQTT_SERVER_URI
    private val username = BuildConfig.MQTT_USERNAME
    private val password = BuildConfig.MQTT_PASSWORD

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationRequest: LocationRequest
    private var locationCallback: LocationCallback? = null
    private var lastPublishedLocation: Location? = null

    private var activityClient: ActivityRecognitionClient? = null
    private var activityPendingIntent: PendingIntent? = null

    private lateinit var bluetoothModule: BluetoothModule
    private val handler = Handler(Looper.getMainLooper())

    // Was 45s of scanning per 60s — the radio was effectively always on for as long as
    // tracking was enabled. A short scan every 5 min is enough to log nearby paired
    // devices. ponytail: raise SCAN_INTERVAL further if battery still shows up.
    private val SCAN_INTERVAL = 5 * 60_000L
    private val SCAN_DURATION = 12_000L
    private var isScanLoopRunning = false
    private var isWindowLoopRunning = false

    private var deviceList = JSONArray()
    private val deviceAddressSet = mutableSetOf<String>()

    private var publishData = ""
    private var publishDataVehicle = ""

    override fun onCreate() {
        super.onCreate()
        instance = this

        createNotificationChannel()

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)

        locationRequest = LocationRequest.Builder(
            Priority.PRIORITY_HIGH_ACCURACY,
            30_000L
        )
            .setMinUpdateIntervalMillis(30_000L)
            .setMinUpdateDistanceMeters(2f)
            .build()

        setupActivityRecognition()

        bluetoothModule = BluetoothModule(this, this)

        Log.d("MqttService", "Service created")
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        // If the OS refuses the foreground start (Android 12+ background-start
        // restriction, or a missing location permission on 14+), we must NOT keep
        // running: a started service with no notification is killed with
        // RemoteServiceException a few seconds later. Bail cleanly instead.
        try {
            startForeground(
                NOTIF_ID,
                buildNotification("Your location is being shared with the company during office hours")
            )
        } catch (e: Exception) {
            Log.e("MqttService", "Foreground start refused — stopping service", e)
            stopSelf()
            return START_NOT_STICKY
        }

        // Ask to be restarted if the process is killed while tracking is meant to be on.
        // Rescheduled on every onStartCommand, so the chain sustains itself.
        scheduleSelfHeal(SELF_HEAL_INTERVAL_MS)

        // The window loop owns starting/stopping GPS — don't start it unconditionally
        // here, or tracking would run outside office hours.
        startWindowLoop()

        return START_STICKY
    }

    // ---------------- OFFICE-HOURS WINDOW ----------------

    /**
     * JS normalises the office-hours config into minutes-of-day plus an isWorkingDay
     * flag before saving the template, so this stays a plain integer comparison and
     * keeps working on later days without the app being reopened.
     */
    private fun shouldTrackNow(): Boolean {
        if (publishData.isEmpty()) return false

        val json = try {
            JSONObject(publishData)
        } catch (e: JSONException) {
            Log.e("MqttService", "Bad publish template", e)
            return false
        }

        if (!json.optBoolean("isWorkingDay", false)) return false

        val from = json.optInt("workingFromMinutes", DEFAULT_FROM_MINUTES)
        val to = json.optInt("workingToMinutes", DEFAULT_TO_MINUTES)

        val now = Calendar.getInstance().let {
            it.get(Calendar.HOUR_OF_DAY) * 60 + it.get(Calendar.MINUTE)
        }

        // A window where from > to spans midnight (e.g. a night shift).
        return if (from <= to) now in from until to else now >= from || now < to
    }

    private fun startWindowLoop() {
        if (isWindowLoopRunning) return
        isWindowLoopRunning = true
        handler.post(windowRunnable)
    }

    private val windowRunnable = object : Runnable {
        override fun run() {
            applyTrackingWindow()
            handler.postDelayed(this, WINDOW_CHECK_INTERVAL_MS)
        }
    }

    /** Turn the radios on at the start of the office-hours window and off at the end. */
    private fun applyTrackingWindow() {
        // Read the template but do NOT connect here: holding the MQTT keepalive open
        // all night outside office hours costs battery for nothing.
        refreshTemplate()

        val shouldTrack = shouldTrackNow()
        val isTracking = locationCallback != null

        if (shouldTrack && !isTracking) {
            Log.d("MqttService", "⏱️ Entering office hours — tracking on")
            ensureMqttConnected()
            startPublishing()
            startBluetoothSafely()
            updateNotification("Your location is being shared with the company during office hours")
        } else if (!shouldTrack && isTracking) {
            Log.d("MqttService", "⏱️ Outside office hours — tracking paused")
            stopPublishing()
            stopBluetoothScanning()
            lastPublishedLocation = null
            updateNotification("Tracking paused — outside office hours")
        }

        // Outside the window we hold the MQTT connection open only for as long as it
        // takes buffered points to flush, then drop it. Runs every tick, so a drain
        // that could not complete at clock-out is retried until it does.
        if (!shouldTrack) MqttSingleton.disconnectIfDrained()
    }

    // ---------------- KILL-MODE RECOVERY ----------------

    /**
     * Swiping the app away can take the process with it on many OEM builds. Schedule a
     * restart broadcast; LocationReciever brings the service back. Scheduling is done
     * here while the app is still alive, and the alarm firing later is what grants the
     * Android 12+ exemption to start a foreground service from the background.
     */
    override fun onTaskRemoved(rootIntent: Intent?) {
        super.onTaskRemoved(rootIntent)
        Log.d("MqttService", "Task removed — scheduling restart")
        scheduleSelfHeal(TASK_REMOVED_RESTART_MS)
    }

    private fun restartPendingIntent(): PendingIntent = PendingIntent.getBroadcast(
        this,
        RESTART_REQUEST_CODE,
        Intent(this, LocationReciever::class.java).setAction(ACTION_RESTART),
        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
    )

    private fun scheduleSelfHeal(delayMs: Long) {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        val firesAt = System.currentTimeMillis() + delayMs
        try {
            val canBeExact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S ||
                    alarmManager.canScheduleExactAlarms()
            if (canBeExact) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, firesAt, restartPendingIntent(),
                )
            } else {
                // ponytail: inexact fallback. Without the exact-alarm grant the OS may
                // also refuse the background foreground-service start, in which case
                // tracking resumes only when the app is next opened.
                Log.w("MqttService", "No exact-alarm permission — falling back to inexact")
                alarmManager.setAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP, firesAt, restartPendingIntent(),
                )
            }
        } catch (e: Exception) {
            Log.e("MqttService", "Could not schedule self-heal alarm", e)
        }
    }

    private fun cancelSelfHeal() {
        val alarmManager = getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return
        try {
            alarmManager.cancel(restartPendingIntent())
        } catch (e: Exception) {
            Log.e("MqttService", "Could not cancel self-heal alarm", e)
        }
    }

    // ---------------- LOCATION ----------------

    private fun startPublishing() {
        if (locationCallback != null) return

        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val location = result.lastLocation ?: return

                try {
                    // refreshes publishData from prefs, so the gate below sees the
                    // distance the app is currently configured with
                    ensureMqttConnected()

                    if (publishData.isEmpty()) return

                    val json = JSONObject(publishData)

                    val minDistance = json
                        .optDouble("distanceToLocationSync", DEFAULT_MIN_DISTANCE_M.toDouble())
                        .toFloat()
                    val last = lastPublishedLocation
                    if (last != null && last.distanceTo(location) < minDistance) return

                    json.put("latitude", location.latitude.toString())
                    json.put("longitude", location.longitude.toString())
                    json.put("createDateTime", Date().toString())
                    json.put("stractivity", currentActivity)
                    json.put("strdevicelog", deviceList.toString())

                    safePublish("iboslimited", json.toString())
                    lastPublishedLocation = location

                } catch (e: Exception) {
                    Log.e("MqttService", "Publish error", e)
                }
            }
        }

        try {
            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback!!,
                Looper.getMainLooper()
            )
        } catch (e: SecurityException) {
            Log.e("MqttService", "Location permission missing")
        }
    }

    private fun stopPublishing() {
        locationCallback?.let {
            fusedLocationClient.removeLocationUpdates(it)
            locationCallback = null
        }
    }

    // ---------------- MQTT ----------------

    /** Re-read the JS template. Cheap, and safe to call outside office hours. */
    private fun refreshTemplate() {
        val prefs = getSharedPreferences("mqtt_prefs", MODE_PRIVATE)
        publishData = prefs.getString("jsonData", "") ?: ""
        publishDataVehicle = prefs.getString("jsonDataVehicle", "") ?: ""
    }

    private fun ensureMqttConnected() {
        refreshTemplate()

        if (!MqttSingleton.isConnected()) {
            MqttSingleton.connect(serverUri, username, password) { e, m ->
                Log.d("MQTT", "$e → $m")
            }
        }
    }

    /**
     * Publish unconditionally: MqttSingleton buffers while offline and flushes on
     * reconnect. Gating on isConnected() here silently discarded every point
     * recorded during a network blip.
     */
    private fun safePublish(topic: String, message: String) {
        MqttSingleton.publish(topic, message)
    }

    // ---------------- BLUETOOTH ----------------

    private fun startBluetoothSafely() {
        // onStartCommand runs on every startService() call — without this guard each one
        // posted another scan loop, so the loops multiplied for the life of the service.
        if (isScanLoopRunning) return
        try {
            if (bluetoothModule.hasBluetoothPermission()) {
                isScanLoopRunning = true
                handler.post(scanRunnable)
            }
        } catch (e: Exception) {
            Log.e("MqttService", "Bluetooth error", e)
        }
    }

    private fun stopBluetoothScanning() {
        isScanLoopRunning = false
        handler.removeCallbacks(scanRunnable)
        try {
            bluetoothModule.cancelDiscovery()
        } catch (e: Exception) {
            Log.e("MqttService", "Bluetooth cancel error", e)
        }
    }

    private val scanRunnable = object : Runnable {
        override fun run() {
            // Fresh set per scan. Publishes between scans report the previous scan's
            // devices rather than an empty list.
            deviceList = JSONArray()
            deviceAddressSet.clear()

            bluetoothModule.startDiscovery()
            handler.postDelayed({ bluetoothModule.cancelDiscovery() }, SCAN_DURATION)
            handler.postDelayed(this, SCAN_INTERVAL)
        }
    }

    override fun onDeviceFound(name: String, address: String, isPaired: Boolean) {
        if (!isPaired || deviceAddressSet.contains(address)) return

        deviceAddressSet.add(address)
        val obj = JSONObject()
        obj.put("name", name)
        obj.put("address", address)
        deviceList.put(obj)
    }

    override fun onBondStateChanged(address: String, bondState: Int) {}

    // ---------------- ACTIVITY ----------------

    private fun setupActivityRecognition() {
        activityClient = ActivityRecognition.getClient(this)

        val intent = Intent(this, MqttActivityReceiver::class.java)
        activityPendingIntent = PendingIntent.getBroadcast(
            this, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
        )

        activityClient?.requestActivityUpdates(5000L, activityPendingIntent!!)
    }

    class MqttActivityReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            if (!ActivityRecognitionResult.hasResult(intent)) return
            val result = ActivityRecognitionResult.extractResult(intent) ?: return
            val act = result.mostProbableActivity ?: return

            if (act.confidence >= 30) {
                updateActivity(
                    when (act.type) {
                        DetectedActivity.WALKING -> "Walking"
                        DetectedActivity.IN_VEHICLE -> "In vehicle"
                        DetectedActivity.STILL -> "Still"
                        else -> "Unknown"
                    }
                )
            }
        }
    }

    // ---------------- CLEANUP ----------------

    override fun onDestroy() {
        super.onDestroy()
        stopPublishing()
        bluetoothModule.cancelDiscovery()
        handler.removeCallbacksAndMessages(null)
        isScanLoopRunning = false
        isWindowLoopRunning = false

        // onDestroy only runs on an explicit stop (stopService/stopSelf), never when the
        // process is killed — so cancelling here means "tracking was turned off", while a
        // killed process still has its restart alarm pending.
        cancelSelfHeal()

        // these two outlived the service and kept draining battery after tracking stopped
        activityPendingIntent?.let { activityClient?.removeActivityUpdates(it) }
        if (instance === this) instance = null
    }

    override fun onBind(intent: Intent?): IBinder? = null

    // ---------------- NOTIFICATION ----------------

    /** Keep the ongoing notification honest about whether we are actually tracking. */
    private fun updateNotification(text: String) {
        try {
            getSystemService(NotificationManager::class.java)
                ?.notify(NOTIF_ID, buildNotification(text))
        } catch (e: Exception) {
            Log.e("MqttService", "Notification update failed", e)
        }
    }

    private fun buildNotification(text: String): Notification {
        return Notification.Builder(this, "mqtt_channel")
            .setContentTitle("Employee Tracking Active")
            .setContentText(text)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "mqtt_channel",
                "MQTT Service",
                NotificationManager.IMPORTANCE_LOW
            )
            channel.setSound(null, null)
            channel.enableVibration(false)

            getSystemService(NotificationManager::class.java)
                .createNotificationChannel(channel)
        }
    }
}