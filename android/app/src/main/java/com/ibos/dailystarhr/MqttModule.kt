package com.ibos.dailystarhr

import android.app.AlarmManager
import android.content.Intent
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import android.os.Build
import android.os.Build.VERSION_CODES
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import android.content.Context


class MqttModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val scope = CoroutineScope(Dispatchers.IO)
    private val prefs = reactContext.getSharedPreferences("mqtt_prefs", Context.MODE_PRIVATE)

    // From .env via BuildConfig — see MqttService for the caveat on APK extraction.
    private val serverUri: String = BuildConfig.MQTT_SERVER_URI
    private val username: String = BuildConfig.MQTT_USERNAME
    private val password: String = BuildConfig.MQTT_PASSWORD

    override fun getName(): String = "MqttModule"

    /** Send events to JS */
    private fun sendEvent(event: String, message: String) {
        val params = Arguments.createMap()
        params.putString("message", message)
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(event, params)
    }

    // ===== Foreground (direct MQTT inside RN app) =====
    // @ReactMethod
    // fun connect(serverUri: String, username: String, password: String, promise: Promise) {
    //     scope.launch {
    //         try {
    //             MqttSingleton.connect(serverUri, username, password) { event, msg ->
    //                 sendEvent(event, msg)
    //                 if (event == "connected") {    
    //                 promise.resolve(true)
    //                 }  
    //             }
              
    //         } catch (e: Exception) {
    //             Log.e("MQTT", "Connect error", e)
    //             promise.reject("MQTT_CONNECT_ERROR", e)
    //         }
    //     }
    // }

    @ReactMethod
    fun connect(promise: Promise) {
        scope.launch {
            try {

                MqttSingleton.connect(serverUri, username, password) { event, msg ->
                    sendEvent(event, msg)
                    if (event == "connected") {    
                    promise.resolve(true)
                    }  
                }
              
            } catch (e: Exception) {
                Log.e("MQTT", "Connect error", e)
                promise.reject("MQTT_CONNECT_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun subscribe(topic: String, qos: Int, promise: Promise) {
        scope.launch {
            try {
                MqttSingleton.subscribe(topic, qos)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("MQTT_SUBSCRIBE_ERROR", e)
            }
        }
    }

    @ReactMethod
    fun unsubscribe(topic: String, promise: Promise) {
        scope.launch {
            try {
                MqttSingleton.unsubscribe(topic)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("MQTT_UNSUBSCRIBE_ERROR", e)
            }
        }
    }

    private fun prefsKeyFor(topic: String) =
        if (topic == "iboslimitedvehicle") "jsonDataVehicle" else "jsonData"

    /**
     * Store the JSON template MqttService stamps live coordinates onto, and make sure
     * the service is running. Does NOT publish: MqttService owns the periodic GPS
     * stream, so publishing here too put duplicate points on the broker.
     */
    @ReactMethod
    fun setPublishTemplate(topic: String, message: String, promise: Promise) {
        scope.launch {
            try {
                prefs.edit().putString(prefsKeyFor(topic), message).apply()
                startTrackingService()
                promise.resolve(true)
            } catch (e: Exception) {
                Log.e("MqttModule", "❌ setPublishTemplate failed: ${e.message}", e)
                promise.reject("MQTT_TEMPLATE_ERROR", e)
            }
        }
    }

    /**
     * Drop just one topic's template. Use this to end a single tracked activity (e.g. a
     * vehicle trip) — calling stopService() instead tears down the shared service and
     * clears every template, which also stopped the employee's own GPS tracking.
     */
    @ReactMethod
    fun clearPublishTemplate(topic: String, promise: Promise) {
        scope.launch {
            try {
                prefs.edit().remove(prefsKeyFor(topic)).apply()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("MQTT_TEMPLATE_ERROR", e)
            }
        }
    }

    /** One-off event publish. For the periodic GPS stream use setPublishTemplate. */
    @ReactMethod
    fun publish(topic: String, message: String, promise: Promise) {
        scope.launch {
            try {
                prefs.edit().putString(prefsKeyFor(topic), message).apply()
                Log.d("MqttModule", "📤 publish() called — topic=$topic")

                startTrackingService()

                // Buffered by MqttSingleton when offline, so this no longer drops.
                MqttSingleton.publish(topic, message)
                promise.resolve(MqttSingleton.isConnected())
            } catch (e: Exception) {
                Log.e("MqttModule", "❌ Error in publish(): ${e.message}", e)
                promise.reject("MQTT_PUBLISH_ERROR", e)
            }
        }
    }

    /**
     * Start (or re-deliver to) the tracking service. From Android 12 the OS rejects
     * background foreground-service starts; that must not crash the caller.
     */
    private fun startTrackingService() {
        val intent = Intent(reactContext, MqttService::class.java).apply {
            putExtra("action", "START_PUBLISHING")
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent)
            } else {
                reactContext.startService(intent)
            }
        } catch (e: Exception) {
            // ForegroundServiceStartNotAllowedException on API 31+ when backgrounded
            Log.w("MqttModule", "⚠️ Could not start tracking service: ${e.message}")
        }
    }


    @ReactMethod
    fun disconnect(promise: Promise) {
        scope.launch {
            try {
                MqttSingleton.disconnect()
                prefs.edit().clear().apply()
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("MQTT_DISCONNECT_ERROR", e)
            }
        }
    }

    // ===== Kill-mode survival =====

    /**
     * Doze/battery optimisation is the main reason tracking dies after the app is
     * swiped away. Resolves true if we are already exempt, otherwise opens the system
     * prompt and resolves false.
     */
    @ReactMethod
    fun requestIgnoreBatteryOptimizations(promise: Promise) {
        try {
            val pm = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
            if (pm.isIgnoringBatteryOptimizations(reactContext.packageName)) {
                promise.resolve(true)
                return
            }
            val intent = Intent(
                Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                Uri.parse("package:${reactContext.packageName}"),
            ).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
            promise.resolve(false)
        } catch (e: Exception) {
            Log.e("MqttModule", "Battery optimisation request failed: ${e.message}")
            promise.reject("BATTERY_OPT_ERROR", e)
        }
    }

    /**
     * Exact alarms are what allow the tracking service to be restarted from the
     * background on Android 12+. Resolves true if already granted, otherwise opens
     * the settings screen and resolves false.
     */
    @ReactMethod
    fun requestExactAlarmPermission(promise: Promise) {
        try {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
                promise.resolve(true)
                return
            }
            val am = reactContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            if (am.canScheduleExactAlarms()) {
                promise.resolve(true)
                return
            }
            val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            reactContext.startActivity(intent)
            promise.resolve(false)
        } catch (e: Exception) {
            Log.e("MqttModule", "Exact alarm request failed: ${e.message}")
            promise.reject("EXACT_ALARM_ERROR", e)
        }
    }

    // ===== Background Service =====
    @ReactMethod
    fun startService(promise: Promise) {
        try {
            startTrackingService()
            promise.resolve("Service started")
        } catch (e: Exception) {
            promise.reject("START_SERVICE_ERROR", e)
        }
    }

    @ReactMethod
    fun stopService(promise: Promise) {
        try {
            // 1️⃣ Stop the service
            val intent = Intent(reactApplicationContext, MqttService::class.java)
            reactApplicationContext.stopService(intent)

            // 2️⃣ Stop foreground notification if it’s a foreground service
            val service = MqttService.instance
            service?.stopForeground(true)
            service?.stopSelf()

            // 3️⃣ Optionally, clear any references to the service
            MqttService.instance = null
            prefs.edit().clear().apply()
            promise.resolve("Service totally stopped")
        } catch (e: Exception) {
            promise.reject("STOP_SERVICE_ERROR", e)
        }
    }

    // @ReactMethod
    // fun getSubscribedTopics(promise: Promise) {
    //     promise.resolve(Arguments.fromList(subscribedTopics.toList()))
    // }
    }
