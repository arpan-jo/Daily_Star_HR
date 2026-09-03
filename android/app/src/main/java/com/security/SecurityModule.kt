package com.security


import android.app.Activity
import android.view.WindowManager
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.*

class SecurityModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "SecurityModule"
    }

    @ReactMethod
    fun enableSecureFlag() {
        val activity: Activity? = reactContext.currentActivity
        activity?.runOnUiThread {
            activity.window.setFlags(
                WindowManager.LayoutParams.FLAG_SECURE,
                WindowManager.LayoutParams.FLAG_SECURE
            )
        }
    }

    @ReactMethod
    fun disableSecureFlag() {
        val activity: Activity? = reactContext.currentActivity
        activity?.runOnUiThread {
            activity.window.clearFlags(WindowManager.LayoutParams.FLAG_SECURE)
        }
    }
}