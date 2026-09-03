package com.peopledesk

import android.Manifest
import android.app.AlarmManager
import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.util.Log
import androidx.annotation.NonNull
import androidx.annotation.RequiresApi
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.swmansion.rnscreens.fragment.restoration.RNScreensFragmentFactory

class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        supportFragmentManager.fragmentFactory = RNScreensFragmentFactory()
        super.onCreate(savedInstanceState)

        // Request microphone permission before starting VoIP service
        // checkAndRequestPermissions()

        // handleIntent(intent)
    }

    /**
     * Returns the name of the main component registered from JavaScript. This is used to schedule
     * rendering of the component.
     */
    override fun getMainComponentName(): String = "PeopleDesk"

    /**
     * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
     * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
     */
    override fun createReactActivityDelegate(): ReactActivityDelegate =
        DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)


    // override fun onNewIntent(intent: Intent?) {
    //     super.onNewIntent(intent)
    //     setIntent(intent)
    //     handleIntent(intent)
    // }

    private fun handleIntent(intent: Intent?) {
        if (intent?.getBooleanExtra("from_call_notification", false) == true) {

            val reactContext = reactInstanceManager.currentReactContext
            if (reactContext != null) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit("CALL_NOTIFICATION_CLICKED", "")
            }
        }
    }


    /**
     * Checks and requests SCHEDULE_EXACT_ALARMS permission for Android 12+
     */
    private fun checkExactAlarmPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = getSystemService(Context.ALARM_SERVICE) as AlarmManager
            if (!alarmManager.canScheduleExactAlarms()) {
                Log.w("MainActivity", "⚠️ Exact alarm permission not granted, requesting...")
                requestExactAlarmPermission()
            } else {
                Log.d("MainActivity", "✅ Exact alarm permission already granted")
            }
        }
    }

    /**
     * Request SCHEDULE_EXACT_ALARMS permission for Android 12+
     */
    @RequiresApi(Build.VERSION_CODES.S)
    private fun requestExactAlarmPermission() {
        try {
            val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
            startActivity(intent)
            Log.d("MainActivity", "📋 Opened exact alarm permission settings")
        } catch (e: Exception) {
            Log.e("MainActivity", "❌ Failed to open exact alarm settings: ${e.message}")
            // Fallback: show a dialog explaining why the permission is needed
            showExactAlarmPermissionDialog()
        }
    }

    /**
     * Show dialog explaining why exact alarm permission is needed
     */
    private fun showExactAlarmPermissionDialog() {
        AlertDialog.Builder(this)
            .setTitle("Background Service Restart")
            .setMessage("This app needs the 'Schedule Exact Alarms' permission to automatically restart location tracking if the app is closed by the system. This ensures continuous tracking during office hours.")
            .setPositiveButton("Open Settings") { _, _ ->
                openAppSettings()
            }
            .setNegativeButton("Later", null)
            .show()
    }

    /**
     * Open app settings for manual permission granting
     */
    private fun openAppSettings() {
        try {
            val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS).apply {
                data = Uri.fromParts("package", packageName, null)
            }
            startActivity(intent)
        } catch (e: Exception) {
            Log.e("MainActivity", "❌ Failed to open app settings: ${e.message}")
        }
    }

    /**
     * Checks and requests required permissions before starting VoIP service.
     */
    @RequiresApi(Build.VERSION_CODES.P)
    private fun checkAndRequestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.RECORD_AUDIO,
            Manifest.permission.FOREGROUND_SERVICE
        )

        val permissionsToRequest = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }.toTypedArray()

        if (permissionsToRequest.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                permissionsToRequest,
                REQUEST_MICROPHONE_PERMISSION
            )
        } else {
            startVoIPService()
        }
    }

    /**
     * Starts the VoIP service in the foreground to keep the app alive.
     */
    private fun startVoIPService() {
//        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//            val serviceIntent = Intent(this, com.voice.VoIPService::class.java)
//            ContextCompat.startForegroundService(this, serviceIntent)
//            // Log.d("MainActivity", "VoIP Service started successfully")
//        }
    }

    /**
     * Handle permission results for RNCallKeep
     */
    override fun onRequestPermissionsResult(
        requestCode: Int,
        @NonNull permissions: Array<String>,
        @NonNull grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)

        when (requestCode) {
            REQUEST_MICROPHONE_PERMISSION -> {
                // Handle microphone permission results
                if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    startVoIPService()
                } else {
                    Log.w("MainActivity", "Microphone permission denied")
                }
            }

//            RNCallKeepModule.REQUEST_READ_PHONE_STATE -> {
//                // Delegate permission results to RNCallKeep
//                RNCallKeepModule.onRequestPermissionsResult(requestCode, permissions, grantResults)
//            }
        }
    }

    /**
     * Optional: Check exact alarm permission when app resumes
     */
    override fun onResume() {
        super.onResume()
        // Re-check exact alarm permission when user returns to app
        // if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
        //     checkExactAlarmPermission()
        // }
    }

    companion object {
        private const val REQUEST_MICROPHONE_PERMISSION = 1001
    }

}
