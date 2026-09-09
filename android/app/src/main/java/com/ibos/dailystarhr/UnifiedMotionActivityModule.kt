package com.ibos.dailystarhr

import android.app.PendingIntent
import android.content.*
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.google.android.gms.location.*
import com.google.android.gms.tasks.OnFailureListener
import com.google.android.gms.tasks.OnSuccessListener

class UnifiedMotionActivityModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var accelerometerValues = floatArrayOf(0f, 0f, 0f)
    private var gyroscopeValues = floatArrayOf(0f, 0f, 0f)
    private var latestActivity: String = "unknown"
    private var lastEmittedActivity: String = "unknown"
    private var latestPayload: WritableMap? = null
    private var isRunning = false

    private val handler = Handler(Looper.getMainLooper())
    private val sensorInterval = 200L
    private val sensorRunnable = object : Runnable {
        override fun run() {
            emitLatestPayload()
            if (isRunning) {
                handler.postDelayed(this, sensorInterval)
            }
        }
    }

    private var activityClient: ActivityRecognitionClient? = null
    private var activityPendingIntent: PendingIntent? = null

    companion object {
        private var currentActivity: String = "unknown"
        private var activityUpdateCallback: ((String) -> Unit)? = null
        
        fun setActivityUpdateCallback(callback: (String) -> Unit) {
            activityUpdateCallback = callback
            // Immediately invoke with current activity when callback is set
            callback(currentActivity)
        }
        
        fun updateActivity(activity: String) {
            if (currentActivity != activity) {
                Log.d("UnifiedMotionActivity", "Activity changed from $currentActivity to $activity")
                currentActivity = activity
                activityUpdateCallback?.invoke(activity)
            }
        }
        
        fun getCurrentActivity(): String = currentActivity
    }

    override fun getName() = "UnifiedMotionActivityModule"

    @ReactMethod
    fun addListener(eventName: String?) {
        // Required for RN 65+
    }

    @ReactMethod
    fun removeListeners(count: Int?) {
        // Required for RN 65+
    }

    @ReactMethod
    fun startUpdates() {
        if (isRunning) {
            Log.d("UnifiedMotionActivity", "Updates already running")
            return
        }

        Log.d("UnifiedMotionActivity", "Starting motion updates")
        isRunning = true
        
        try {
            // Set up the activity update callback FIRST
            Companion.setActivityUpdateCallback { activity ->
                this.latestActivity = activity
                Log.d("UnifiedMotionActivity", "Activity callback: $activity")
                // Emit immediately when activity changes
                if (activity != lastEmittedActivity) {
                    handler.post {
                        emitLatestPayload()
                    }
                }
            }

            // Initialize with current activity
            latestActivity = Companion.getCurrentActivity()

            // Register sensors
            sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
            sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)?.also { sensor ->
                sensorManager?.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
                Log.d("UnifiedMotionActivity", "Accelerometer registered")
            } ?: run {
                Log.e("UnifiedMotionActivity", "Accelerometer not available")
            }

            sensorManager?.getDefaultSensor(Sensor.TYPE_GYROSCOPE)?.also { sensor ->
                sensorManager?.registerListener(this, sensor, SensorManager.SENSOR_DELAY_NORMAL)
                Log.d("UnifiedMotionActivity", "Gyroscope registered")
            } ?: run {
                Log.e("UnifiedMotionActivity", "Gyroscope not available")
            }

            // Setup activity recognition
            setupActivityRecognition()

            // Start sensor periodic emit
            handler.post(sensorRunnable)
            Log.d("UnifiedMotionActivity", "Started all motion updates")
            
        } catch (e: Exception) {
            Log.e("UnifiedMotionActivity", "Error starting updates: ${e.message}")
            isRunning = false
        }
    }

    private fun setupActivityRecognition() {
        try {
            activityClient = ActivityRecognition.getClient(reactContext)
            
            val intent = Intent(reactContext, SmoothActivityReceiver::class.java).apply {
                action = "com.ibos.dailystarhr.ACTIVITY_RECOGNITION"
            }
            
            val flags = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            
            activityPendingIntent = PendingIntent.getBroadcast(
                reactContext,
                0,
                intent,
                flags
            )

            val task = activityClient?.requestActivityUpdates(
                2000L, // 2 second interval
                activityPendingIntent!!
            )

            task?.addOnSuccessListener {
                Log.d("UnifiedMotionActivity", "Activity recognition started successfully")
            }?.addOnFailureListener { e ->
                Log.e("UnifiedMotionActivity", "Activity recognition failed: ${e.message}")
            }

        } catch (e: Exception) {
            Log.e("UnifiedMotionActivity", "Error setting up activity recognition: ${e.message}")
        }
    }

    @ReactMethod
    fun stopUpdates() {
        if (!isRunning) {
            return
        }

        Log.d("UnifiedMotionActivity", "Stopping motion updates")
        isRunning = false
        
        try {
            sensorManager?.unregisterListener(this)
            handler.removeCallbacks(sensorRunnable)
            
            activityPendingIntent?.let { 
                activityClient?.removeActivityUpdates(it)
                Log.d("UnifiedMotionActivity", "Activity recognition stopped")
            }
            
            Companion.setActivityUpdateCallback { } // Clear callback
            Log.d("UnifiedMotionActivity", "Stopped all updates")
            
        } catch (e: Exception) {
            Log.e("UnifiedMotionActivity", "Error stopping updates: ${e.message}")
        }
    }

    @ReactMethod
    fun getUpdatedData(promise: Promise) {
        val result = Arguments.createMap().apply {
            putString("activity", latestActivity)
            putMap(
                "accelerometer",
                Arguments.createMap().apply {
                    putDouble("x", accelerometerValues[0].toDouble())
                    putDouble("y", accelerometerValues[1].toDouble())
                    putDouble("z", accelerometerValues[2].toDouble())
                }
            )
            putMap(
                "gyroscope",
                Arguments.createMap().apply {
                    putDouble("x", gyroscopeValues[0].toDouble())
                    putDouble("y", gyroscopeValues[1].toDouble())
                    putDouble("z", gyroscopeValues[2].toDouble())
                }
            )
        }
        promise.resolve(result)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        event ?: return
        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> accelerometerValues = event.values.clone()
            Sensor.TYPE_GYROSCOPE -> gyroscopeValues = event.values.clone()
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun emitLatestPayload() {
        if (!isRunning) return

        latestPayload = Arguments.createMap().apply {
            putString("activity", latestActivity)
            putMap(
                "accelerometer",
                Arguments.createMap().apply {
                    putDouble("x", accelerometerValues[0].toDouble())
                    putDouble("y", accelerometerValues[1].toDouble())
                    putDouble("z", accelerometerValues[2].toDouble())
                }
            )
            putMap(
                "gyroscope",
                Arguments.createMap().apply {
                    putDouble("x", gyroscopeValues[0].toDouble())
                    putDouble("y", gyroscopeValues[1].toDouble())
                    putDouble("z", gyroscopeValues[2].toDouble())
                }
            )
        }

        if (reactContext.hasActiveCatalystInstance()) {
            try {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("onMotionActivity", latestPayload)
                lastEmittedActivity = latestActivity
            } catch (e: Exception) {
                Log.e("UnifiedMotionActivity", "Error emitting event: ${e.message}")
            }
        }
    }

    class SmoothActivityReceiver : BroadcastReceiver() {
        override fun onReceive(context: Context, intent: Intent) {
            Log.d("SmoothActivityReceiver", "Activity update received")
            
            try {
                if (!ActivityRecognitionResult.hasResult(intent)) {
                    Log.d("SmoothActivityReceiver", "No activity result in intent")
                    return
                }

                val result = ActivityRecognitionResult.extractResult(intent)
                if (result == null) {
                    Log.d("SmoothActivityReceiver", "Failed to extract activity result")
                    return
                }

                val mostProbable = result.mostProbableActivity
                val activityType = mostProbable?.type ?: DetectedActivity.UNKNOWN
                val confidence = mostProbable?.confidence ?: 0

                val activityName = when (activityType) {
                    DetectedActivity.IN_VEHICLE -> "in_vehicle"
                    DetectedActivity.ON_BICYCLE -> "on_bicycle" 
                    DetectedActivity.ON_FOOT -> "on_foot"
                    DetectedActivity.RUNNING -> "running"
                    DetectedActivity.STILL -> "still"
                    DetectedActivity.TILTING -> "tilting"
                    DetectedActivity.WALKING -> "walking"
                    DetectedActivity.UNKNOWN -> "unknown"
                    else -> "unknown"
                }

                Log.d("SmoothActivityReceiver", "Detected: $activityName (confidence: $confidence)")

                // Log all probable activities for debugging
                val probableActivities = result.probableActivities
                for (activity in probableActivities) {
                    val name = when (activity.type) {
                        DetectedActivity.IN_VEHICLE -> "IN_VEHICLE"
                        DetectedActivity.ON_BICYCLE -> "ON_BICYCLE"
                        DetectedActivity.ON_FOOT -> "ON_FOOT" 
                        DetectedActivity.RUNNING -> "RUNNING"
                        DetectedActivity.STILL -> "STILL"
                        DetectedActivity.TILTING -> "TILTING"
                        DetectedActivity.WALKING -> "WALKING"
                        DetectedActivity.UNKNOWN -> "UNKNOWN"
                        else -> "OTHER"
                    }
                    Log.d("SmoothActivityReceiver", " - $name: ${activity.confidence}%")
                }

                // Only update if confidence is reasonable
                if (confidence >= 30) {
                    Companion.updateActivity(activityName)
                } else {
                    Log.d("SmoothActivityReceiver", "Low confidence ($confidence), keeping previous activity")
                }
                
            } catch (e: Exception) {
                Log.e("SmoothActivityReceiver", "Error processing activity: ${e.message}")
            }
        }
    }
}