package com.peopledesk

import android.Manifest
import android.annotation.SuppressLint
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothDevice
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresPermission
import androidx.core.content.ContextCompat

interface BluetoothDeviceListener {
    fun onDeviceFound(name: String, address: String, isPaired: Boolean)
    fun onBondStateChanged(address: String, bondState: Int)
}


class BluetoothModule(private val context: Context, private val listener: BluetoothDeviceListener?) {

    private val bluetoothAdapter: BluetoothAdapter? = BluetoothAdapter.getDefaultAdapter()
    private var discoveryReceiver: BroadcastReceiver? = null

    
    init {
        Log.d("MqttService ", "BluetoothModule")
        registerDiscoveryReceiver()
    }

    fun hasBluetoothPermission(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            // For Android 12 (API 31) and above, check BLUETOOTH_SCAN
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.BLUETOOTH_SCAN
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            // For Android 11 (API 30) and below, check ACCESS_FINE_LOCATION
            // Note: ACCESS_FINE_LOCATION also implicitly covers ACCESS_COARSE_LOCATION
            ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_FINE_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        }
    }

   

    @SuppressLint("MissingPermission")
    fun startDiscovery() {
        try{
            bluetoothAdapter?.let { adapter ->
                if (adapter.isDiscovering) {
                    adapter.cancelDiscovery()
                }
                adapter.startDiscovery()
            }
            
        } catch (e: Exception) {
            Log.e("MqttService", "startDiscovery Error  ${e.message}")
        }
    }

    @SuppressLint("MissingPermission")
    fun cancelDiscovery() {
        try{
            bluetoothAdapter?.cancelDiscovery()
        }catch(e: Exception){
            Log.e("MqttService", "cancelDiscovery Error  ${e.message}")
        }
    }

    private fun registerDiscoveryReceiver() {
        if (discoveryReceiver != null) return

        discoveryReceiver = object : BroadcastReceiver() {
            @SuppressLint("MissingPermission")
            override fun onReceive(context: Context, intent: Intent) {
                val action = intent.action

                when (action) {
                    BluetoothDevice.ACTION_FOUND -> {
                        val device: BluetoothDevice? = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                        val rssi = intent.getShortExtra(BluetoothDevice.EXTRA_RSSI, Short.MIN_VALUE)

                        device?.let {
                            if (it.bluetoothClass?.majorDeviceClass == 512 && rssi >= -75) {
                                listener?.onDeviceFound(it.name, it.address, isPairedDevice(it))
                            }
                        }
                    }

                    BluetoothDevice.ACTION_BOND_STATE_CHANGED -> {
                        val device: BluetoothDevice? = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE)
                        device?.let {
                            listener?.onBondStateChanged(it.address, it.bondState)
                        }
                    }
                }
            }
        }

        val filter = IntentFilter().apply {
            addAction(BluetoothDevice.ACTION_FOUND)
            addAction(BluetoothDevice.ACTION_BOND_STATE_CHANGED)
        }

        context.registerReceiver(discoveryReceiver, filter)
    }

    @RequiresPermission(Manifest.permission.BLUETOOTH_CONNECT)
    private fun isPairedDevice(device: BluetoothDevice): Boolean {
        return bluetoothAdapter?.bondedDevices?.any { it.address == device.address } ?: false
    }
}
