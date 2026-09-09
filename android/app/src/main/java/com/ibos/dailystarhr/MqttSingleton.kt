package com.ibos.dailystarhr

import android.util.Log
import org.eclipse.paho.client.mqttv3.*
import org.eclipse.paho.client.mqttv3.persist.MemoryPersistence
import javax.net.ssl.SSLSocketFactory

object MqttSingleton {

    // MqttAsyncClient, not MqttClient: the offline buffer (setBufferOpts) only exists
    // on the async client. Its calls are non-blocking, so the Thread{} wrapper is gone too.
    private var mqttClient: MqttAsyncClient? = null
    private var isConnecting = false

    /** ~14h of points at one every 30s; oldest are dropped past this. */
    private const val MAX_BUFFERED_MESSAGES = 5000
    private const val QOS_AT_LEAST_ONCE = 1

    fun connect(
        serverUri: String,
        username: String,
        password: String,
        eventCallback: (String, String) -> Unit
    ) {
        if (mqttClient?.isConnected == true) {
            eventCallback("MqttStatus", "⚠️ Already connected")
            return
        }
        if (isConnecting) {
            eventCallback("MqttStatus", "⚠️ Connection already in progress")
            return
        }

        try {
            // Clean up old client if exists
            mqttClient?.let {
                try {
                    if (it.isConnected) it.disconnect()
                    it.close()
                } catch (e: Exception) {
                    eventCallback("MqttStatus", "⚠️ Cleanup failed: ${e.message}")
                }
            }
            mqttClient = null

            val clientId = MqttClient.generateClientId()
            mqttClient = MqttAsyncClient(serverUri, clientId, MemoryPersistence())

            val options = MqttConnectOptions().apply {
                isCleanSession = true
                this.userName = username
                this.password = password.toCharArray()
                socketFactory = SSLSocketFactory.getDefault()
                connectionTimeout = 10
                keepAliveInterval = 20
                isAutomaticReconnect = true
            }

            // Buffer location points published while offline and flush them on reconnect,
            // instead of dropping them. Paho does the queueing; no custom queue needed.
            // ponytail: in-memory buffer — survives network loss, not process death.
            // Swap MemoryPersistence for MqttDefaultFilePersistence(filesDir) if points
            // must survive the service being killed.
            mqttClient?.setBufferOpts(DisconnectedBufferOptions().apply {
                isBufferEnabled = true
                bufferSize = MAX_BUFFERED_MESSAGES
                isPersistBuffer = false
                isDeleteOldestMessages = true   // drop oldest, never block the publisher
            })

            mqttClient?.setCallback(object : MqttCallback {
                override fun connectionLost(cause: Throwable?) {
                    isConnecting = false
                    eventCallback("MqttStatus", "Connection lost: ${cause?.message}")
                }

                override fun messageArrived(topic: String?, message: MqttMessage?) {
                    val msgText = message.toString()
                    eventCallback("MqttMessage", "$topic: $msgText")
                }

                override fun deliveryComplete(token: IMqttDeliveryToken?) {
                    eventCallback("MqttStatus", "Message delivered")
                }
            })

            isConnecting = true
            mqttClient?.connect(options, null, object : IMqttActionListener {
                override fun onSuccess(asyncActionToken: IMqttToken?) {
                    isConnecting = false
                    eventCallback("MqttStatus", "✅ Connected successfully")
                }

                override fun onFailure(asyncActionToken: IMqttToken?, exception: Throwable?) {
                    isConnecting = false
                    eventCallback("MqttStatus", "❌ Connect error: ${exception?.message}")
                }
            })

        } catch (e: Exception) {
            isConnecting = false
            eventCallback("MqttStatus", "❌ Setup error: ${e.message}")
        }
    }


    fun subscribe(topic: String, qos: Int) {
        mqttClient?.subscribe(topic, qos)
    }

    fun unsubscribe(topic: String) {
        try {
            mqttClient?.unsubscribe(topic)
            println("Unsubscribed from $topic")
        } catch (e: MqttException) {
            e.printStackTrace()
        }
    }


    /** QoS 1 so the broker acks; buffered while offline rather than dropped. */
    fun publish(topic: String, message: String) {
        try {
            mqttClient?.publish(
                topic,
                MqttMessage(message.toByteArray()).apply { qos = QOS_AT_LEAST_ONCE },
            )
        } catch (e: MqttException) {
            Log.e("MQTT", "❌ Publish failed (buffered=${mqttClient?.bufferedMessageCount}): ${e.message}")
        }
    }

    fun disconnect() {
        try {
            isConnecting = false  // 🔑 cancel any "in progress" state

            mqttClient?.apply {
                if (isConnected) {
                    try {
                        // async client: wait for the disconnect before close(), or close() throws
                        disconnect().waitForCompletion(2_000)
                        Log.d("MQTT", "🛑 MQTT Disconnected")
                    } catch (e: Exception) {
                        Log.e("MQTT", "❌ Error while disconnecting: ${e.message}")
                    }
                }
                try {
                    close()           // ✅ shutdown client resources
                } catch (e: Exception) {
                    Log.e("MQTT", "❌ Error while closing: ${e.message}")
                }
            }
        } catch (e: Exception) {
            Log.e("MQTT", "❌ Disconnect exception: ${e.message}")
        } finally {
            mqttClient = null        // ✅ ensure reference released
        }
    }

    fun isConnected(): Boolean {
        return mqttClient?.isConnected ?: false
    }

    /** Points published while offline and not yet flushed to the broker. */
    fun bufferedCount(): Int = try {
        mqttClient?.bufferedMessageCount ?: 0
    } catch (e: Exception) {
        0
    }

    /**
     * Disconnect only once the offline buffer has drained — disconnecting discards it,
     * which would lose location points recorded during a network outage.
     * Returns false if it held the connection open because points are still pending.
     */
    fun disconnectIfDrained(): Boolean {
        if (bufferedCount() > 0) {
            Log.d("MQTT", "⏳ Holding connection: ${bufferedCount()} points still buffered")
            return false
        }
        disconnect()
        return true
    }
}
