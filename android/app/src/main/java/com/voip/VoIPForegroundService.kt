package com.voip

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat

class VoIPForegroundService : Service() {
    companion object {
        private const val CHANNEL_ID = "VoIPServiceChannel"
    }

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        val notification: Notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("VoIP Service Running")
            .setContentText("Listening for incoming VoIP calls.")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .build()
        startForeground(1, notification)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val serviceChannel = NotificationChannel(
                CHANNEL_ID,
                "VoIP Foreground Service",
                NotificationManager.IMPORTANCE_HIGH
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(serviceChannel)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY // Ensures service restarts after being killed
    }

    override fun onDestroy() {
        super.onDestroy()

        // Restart service using WorkManager
        VoIPServiceScheduler.scheduleServiceRestart(applicationContext);

        // Restart service when it’s killed
        val restartService = Intent(applicationContext, VoIPForegroundService::class.java)
        startService(restartService)


    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }
}
