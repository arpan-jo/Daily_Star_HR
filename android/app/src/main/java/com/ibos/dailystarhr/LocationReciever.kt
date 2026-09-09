package com.ibos.dailystarhr

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log

class LocationReciever : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        Log.d("LocationReciever", "Triggered by ${intent.action} — starting MqttService")

        // Boot, or the self-heal alarm scheduled by MqttService.
        if (intent.action != Intent.ACTION_BOOT_COMPLETED &&
            intent.action != MqttService.ACTION_RESTART
        ) {
            return
        }

        val serviceIntent = Intent(context, MqttService::class.java).apply {
            putExtra("action", "START_PUBLISHING")
        }

        // A broadcast receiver is background context: from Android 12 this throws
        // ForegroundServiceStartNotAllowedException, which would crash the app.
        try {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                context.startForegroundService(serviceIntent)
            } else {
                context.startService(serviceIntent)
            }
        } catch (e: Exception) {
            Log.w("LocationReciever", "Could not start MqttService: ${e.message}")
        }
    }
}