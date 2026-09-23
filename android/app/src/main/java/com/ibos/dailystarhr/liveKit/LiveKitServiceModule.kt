package net.thedailystar.liveKit

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class LiveKitServiceModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    object ReactContextHolder {
        var reactContext: ReactApplicationContext? = null
    }

    override fun getName() = "LiveKitService"

    override fun initialize() {
        super.initialize()
        ReactContextHolder.reactContext = reactContext
//        ContextCompat.registerReceiver(
//            reactContext,
//            receiver,
//            IntentFilter("PTT_EVENT"),
//            ContextCompat.RECEIVER_NOT_EXPORTED
//        )
    }


    override fun onCatalystInstanceDestroy() {
//        reactContext.unregisterReceiver(receiver)
        super.onCatalystInstanceDestroy()
    }


    @ReactMethod
    fun startCallService(data: ReadableMap, promise: Promise) {

        try {
            // ReadableMap → HashMap
            val map = data.toHashMap()

            // HashMap → Bundle
            val bundle = Bundle()
            for ((key, value) in map) {
                when (value) {
                    is String -> bundle.putString(key, value)
                    is Boolean -> bundle.putBoolean(key, value)
                    is Int -> bundle.putInt(key, value)
                    is Double -> bundle.putDouble(key, value)
                    else -> {
                        // ignore unsupported types or handle if needed
                    }
                }
            }

            val intent = Intent(reactContext, LiveKitForegroundService::class.java).apply {
                putExtra("connectData", bundle)
            }

//            Log.d("LiveKitService ", "startCallService $data")

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                reactContext.startForegroundService(intent)
            } else {
                reactContext.startService(intent)
            }

            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("START_CALL_FAILED", e)
        }
    }

    @ReactMethod
    fun stopCallService(promise: Promise) {

        try {
            val intent = Intent(reactContext, LiveKitForegroundService::class.java)
            reactContext.stopService(intent)
            promise.resolve(true)
        } catch (e: Exception) {
            promise.reject("STOP_CALL_FAILED", e)
        }
    }

    @ReactMethod
    fun micOn(speakerId: String, speakerName: String) {
        val intent = Intent(reactContext, LiveKitForegroundService::class.java)
        intent.action = LiveKitForegroundService.ACTION_MIC_ON
        intent.putExtra("speakerId", speakerId)
        intent.putExtra("speakerName", speakerName)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    @ReactMethod
    fun micOff(speakerId: String) {
        val intent = Intent(reactContext, LiveKitForegroundService::class.java)
        intent.action = LiveKitForegroundService.ACTION_MIC_OFF
        intent.putExtra("speakerId", speakerId)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(intent)
        } else {
            reactContext.startService(intent)
        }
    }

    private val receiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {

            val speakerId = intent?.getStringExtra("speakerId") ?: return
            val speakerName = intent.getStringExtra("speakerName", ) ?: ""
            val roomName = intent.getStringExtra("roomName", ) ?: ""
            val isSpeaking = intent.getBooleanExtra("isSpeaking", false)

            sendUiEvent( speakerId, speakerName, roomName, isSpeaking)
        }
    }

    fun sendUiEvent(speakerId: String, speakerName: String,roomName: String, isSpeaking: Boolean) {
        val params = Arguments.createMap().apply {
            putString("speakerName", speakerName)
            putString("speakerId", speakerId)
            putString("roomName", roomName)
            putBoolean("isSpeaking",isSpeaking)
        }
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("SpeakingListener", params)
    }
}