package com.voip

import android.content.Intent
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class VoIPServiceModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "VoIPServiceModule" // Name used in JS
    }

    @ReactMethod
    fun startVoIPService() {
        val serviceIntent = Intent(reactContext, VoIPForegroundService::class.java)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(serviceIntent)
        } else {
            reactContext.startService(serviceIntent)
        }
    }

    @ReactMethod
    fun stopVoIPService() {
        val serviceIntent = Intent(reactContext, VoIPForegroundService::class.java)
        reactContext.stopService(serviceIntent)
    }
}
