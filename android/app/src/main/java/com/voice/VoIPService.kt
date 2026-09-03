package com.voice

import android.app.*
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat

class VoIPService : Service() {
    override fun onCreate() {
        super.onCreate()
        startForegroundService()
    }

    private fun startForegroundService() {
        val channelId = "voip_channel"
        val channelName = "VoIP Calls"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notificationChannel = NotificationChannel(
                channelId,
                channelName,
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(notificationChannel)
        }

        val notification: Notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("VoIP Call Active")
            .setContentText("Your call is in progress...")
            // .setSmallIcon(R.drawable.ic_call)
            .setOngoing(true)
            .build()

        startForeground(2, notification)
    }

    private fun startHeadlessTask() {
        // Start Headless JS service to initialize React Native
        val serviceIntent = Intent(this, HeadlessService::class.java).apply {
            putExtra("callActive", true)
        }
        ContextCompat.startForegroundService(this, serviceIntent)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
        stopForeground(true)
        stopSelf()
    }
}
