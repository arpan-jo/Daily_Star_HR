package com.voip

import android.content.Context
import androidx.work.ExistingWorkPolicy
import androidx.work.OneTimeWorkRequest
import androidx.work.WorkManager
import java.util.concurrent.TimeUnit

object VoIPServiceScheduler {
    fun scheduleServiceRestart(context: Context) {
        val workRequest = OneTimeWorkRequest.Builder(RestartServiceWorker::class.java)
            .setInitialDelay(30, TimeUnit.SECONDS) // Restart every 15 minutes
            .build()
        WorkManager.getInstance(context)
            .enqueueUniqueWork("RestartVoIPService", ExistingWorkPolicy.REPLACE, workRequest)
    }
}
