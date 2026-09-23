package net.thedailystar.liveKit

import android.app.*
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.core.app.NotificationCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import net.thedailystar.R
import io.livekit.android.LiveKit
import io.livekit.android.events.RoomEvent
import io.livekit.android.events.collect
import io.livekit.android.room.Room
import io.livekit.android.room.track.DataPublishReliability
import kotlinx.coroutines.*
import org.json.JSONObject

class LiveKitForegroundService : Service() {

    companion object {
        const val CHANNEL_ID = "livekit_call"
        const val NOTIFICATION_ID = 101

        const val ACTION_MIC_ON = "MIC_ON"
        const val ACTION_MIC_OFF = "MIC_OFF"
    }

    private var room: Room? = null
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    private lateinit var audioManager: AudioManager


    // ================= SERVICE =================

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreate() {
        super.onCreate()
        audioManager = getSystemService(AUDIO_SERVICE) as AudioManager
        createNotificationChannel()
        startForeground(NOTIFICATION_ID, createNotification())
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {

        when (intent?.action) {
            ACTION_MIC_ON -> enableMic(intent)
            ACTION_MIC_OFF -> disableMic(intent)
            else -> {
                val bundle = intent?.getBundleExtra("connectData")
                if (bundle != null) connectToLiveKit(bundle)
            }
        }

        return START_STICKY
    }

    override fun onDestroy() {
        serviceScope.launch { room?.disconnect() }
        releaseAudioResources()
        serviceScope.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null


    // ================= MIC CONTROL =================

    private fun enableMic(intent: Intent?) {
        serviceScope.launch {
            try {
                requestAudioFocus()
                setCommunicationMode()

                room?.localParticipant?.setMicrophoneEnabled(true)

                val speakerId = intent?.getStringExtra("speakerId")
                val speakerName = intent?.getStringExtra("speakerName")

                room?.localParticipant?.publishData(
                    """{"type":"SPEAK_STARTED","speakerId":"$speakerId","speakerName":"$speakerName"}"""
                        .toByteArray(),
                    DataPublishReliability.RELIABLE
                )
            } catch (e: Exception) {
                Log.e("LiveKitService", "Mic ON error", e)
            }
        }
    }

    private fun disableMic(intent: Intent?) {
        serviceScope.launch {
            try {
                room?.localParticipant?.setMicrophoneEnabled(false)

                // 🔥 release Android mic + audio session
                releaseAudioResources()

                val speakerId = intent?.getStringExtra("speakerId")

                room?.localParticipant?.publishData(
                    """{"type":"SPEAK_ENDED","speakerId":"$speakerId"}"""
                        .toByteArray(),
                    DataPublishReliability.RELIABLE
                )

            } catch (e: Exception) {
                Log.e("LiveKitService", "Mic OFF error", e)
            }
        }
    }


    // ================= AUDIO =================

    private fun requestAudioFocus() {
        audioManager.requestAudioFocus(
            null,
            AudioManager.STREAM_VOICE_CALL,
            AudioManager.AUDIOFOCUS_GAIN_TRANSIENT
        )
    }

    private fun setCommunicationMode() {
        audioManager.mode = AudioManager.MODE_IN_COMMUNICATION
        audioManager.isMicrophoneMute = false
    }

    private fun releaseAudioResources() {
        audioManager.mode = AudioManager.MODE_NORMAL
        audioManager.abandonAudioFocus(null)
    }


    // ================= LIVEKIT =================

    private fun connectToLiveKit(connectData: Bundle?) {
        serviceScope.launch {
            try {
                val url = connectData?.getString("url") ?: ""
                val token = connectData?.getString("token") ?: ""
                val userId = connectData?.getString("userId")

                room = LiveKit.create(applicationContext)
                room?.connect(url, token)

                // Default mic OFF
                room?.localParticipant?.setMicrophoneEnabled(false)
                room?.localParticipant?.setCameraEnabled(false)
                releaseAudioResources()

                microphoneTracking(userId)

            } catch (e: Exception) {
                Log.e("LiveKitService", "LiveKit error", e)
                stopSelf()
            }
        }
    }


    private fun microphoneTracking(myUserId: String?) {
        serviceScope.launch {
            val roomName = room?.name

            room?.events?.collect { event ->
                if (event is RoomEvent.DataReceived) {

                    val json = JSONObject(String(event.data))
                    val type = json.getString("type")
                    val speakerId = json.getString("speakerId")
                    val speakerName = json.optString("speakerName")

                    if (speakerId != myUserId) {
                        when (type) {

                            "SPEAK_STARTED" -> {
                                disableMic(null)
                                sendUiEvent(speakerId, speakerName, roomName, true)
                            }

                            "SPEAK_ENDED" -> {
                                sendUiEvent(speakerId, speakerName, "", false)
                            }
                        }
                    }
                }
            }
        }
    }


    // ================= REACT EVENT =================

    private fun sendUiEvent(
        speakerId: String,
        speakerName: String,
        roomName: String?,
        isSpeaking: Boolean
    ) {
        val reactContext =
            LiveKitServiceModule.ReactContextHolder.reactContext ?: return

        val params = Arguments.createMap().apply {
            putString("speakerName", speakerName)
            putString("speakerId", speakerId)
            putString("roomName", roomName)
            putBoolean("isSpeaking", isSpeaking)
        }

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("SpeakingListener", params)
    }


    // ================= NOTIFICATION =================

    private fun createNotification(): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Live audio call")
            .setContentText("Call running in background")
            .setSmallIcon(R.mipmap.ic_launcher)
            .setOngoing(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun createNotificationChannel() {
        val channel = NotificationChannel(
            CHANNEL_ID,
            "Audio Call",
            NotificationManager.IMPORTANCE_LOW
        )
        channel.setSound(null, null)
        channel.enableVibration(false)

        val manager = getSystemService(NotificationManager::class.java)
        manager.createNotificationChannel(channel)
    }
}
