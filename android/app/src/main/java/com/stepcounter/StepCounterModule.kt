package com.stepcounter


import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class StepCounterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var stepCounter: Sensor? = null
    private var stepCallback: Callback? = null

    init {
        sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        stepCounter = sensorManager?.getDefaultSensor(Sensor.TYPE_STEP_COUNTER)
    }

    override fun getName(): String {
        return "StepCounterModule"
    }

    @ReactMethod
    fun startStepCounter(callback: Callback) {
        stepCallback = callback
        stepCounter?.also { stepCounter ->
            sensorManager?.registerListener(this, stepCounter, SensorManager.SENSOR_DELAY_UI)
        }
    }

    @ReactMethod
    fun stopStepCounter() {
        sensorManager?.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event?.sensor?.type == Sensor.TYPE_STEP_COUNTER) {
            val steps = event.values[0]
            val params: WritableMap = Arguments.createMap()
            params.putDouble("steps", steps.toDouble())
            stepCallback?.invoke(params)
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Do something here if sensor accuracy changes.
    }
}

