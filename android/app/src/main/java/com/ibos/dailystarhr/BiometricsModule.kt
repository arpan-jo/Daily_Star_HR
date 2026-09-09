package com.ibos.dailystarhr


import androidx.biometric.BiometricPrompt
import androidx.biometric.BiometricManager
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner

import com.facebook.react.bridge.*

class BiometricsModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext),
    LifecycleEventListener,
    DefaultLifecycleObserver {

    private var pendingPromise: Promise? = null
    private var pendingReason: String? = null
    private var hostActivity: FragmentActivity? = null

    init {
        reactContext.addLifecycleEventListener(this)
    }

    override fun getName() = "Biometrics"

    // -------------------------
    // React Native lifecycle
    // -------------------------

    override fun onHostResume() {
        val activity = reactContext.currentActivity
        if (activity is FragmentActivity) {
            hostActivity = activity
            activity.lifecycle.addObserver(this)
        }
    }

    override fun onHostPause() {
        hostActivity?.lifecycle?.removeObserver(this)
        hostActivity = null
    }

    override fun onHostDestroy() {
        clear()
    }

    // -------------------------
    // Android lifecycle
    // -------------------------

    override fun onResume(owner: LifecycleOwner) {
        showPromptIfPending()
    }

    // -------------------------
    // JS exposed methods
    // -------------------------

    @ReactMethod
    fun isAvailable(promise: Promise) {
        val manager = BiometricManager.from(reactContext)
        promise.resolve(
            manager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_STRONG
            ) == BiometricManager.BIOMETRIC_SUCCESS
        )
    }

    @ReactMethod
    fun authenticate(reason: String, promise: Promise) {
        if (pendingPromise != null) {
            promise.reject("IN_PROGRESS", "Authentication already running")
            return
        }

        pendingPromise = promise
        pendingReason = reason

        showPromptIfPending()
    }

    // -------------------------
    // Core biometric logic
    // -------------------------

    private fun showPromptIfPending() {
        val activity = hostActivity ?: return
        val promise = pendingPromise ?: return
        val reason = pendingReason ?: return

        activity.runOnUiThread {

            val executor = ContextCompat.getMainExecutor(reactContext)

            val promptInfo = BiometricPrompt.PromptInfo.Builder()
                .setTitle("Verify it's you")
                .setSubtitle(reason)
                .setNegativeButtonText("Cancel")
                .build()

            val biometricPrompt = BiometricPrompt(
                activity,
                executor,
                object : BiometricPrompt.AuthenticationCallback() {

                    override fun onAuthenticationSucceeded(
                        result: BiometricPrompt.AuthenticationResult
                    ) {
                        resolveOnce(true)
                    }

                    override fun onAuthenticationError(
                        errorCode: Int,
                        errString: CharSequence
                    ) {
                        rejectOnce(errorCode.toString(), errString.toString())
                    }

                    override fun onAuthenticationFailed() {}
                }
            )

            biometricPrompt.authenticate(promptInfo)
        }
    }

    private fun resolveOnce(value: Boolean) {
        pendingPromise?.resolve(value)
        clear()
    }

    private fun rejectOnce(code: String, message: String) {
        pendingPromise?.reject(code, message)
        clear()
    }

    private fun clear() {
        pendingPromise = null
        pendingReason = null
    }
}

