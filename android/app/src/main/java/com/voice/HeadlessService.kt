package com.voice

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class HeadlessService : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return HeadlessJsTaskConfig(
            "voipBackgroundHandler", // Name of your JS task (defined in JavaScript)
            Arguments.createMap(),   // Optional data to pass to JS
            5000,                    // Timeout for the task (ms)
            true                     // Allow task in foreground
        )
    }
}