package com.voice

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class AnswerCallReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == "com.voice.ANSWER_CALL") {
            // Launch your main activity so that your RN bridge initializes and handles the call answer event
            val launchIntent = context?.packageManager?.getLaunchIntentForPackage(context.packageName)
            launchIntent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
            context?.startActivity(launchIntent)
        }
    }
}
