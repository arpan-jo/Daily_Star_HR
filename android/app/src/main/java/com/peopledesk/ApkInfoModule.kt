package com.peopledesk

import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.*
import java.io.ByteArrayOutputStream

/**
 * Backs the APK Store: reads the package name declared inside an .apk file,
 * and reports which of those packages are already installed on the device.
 */
class ApkInfoModule(
    private val reactContext: ReactApplicationContext
) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "ApkInfo"

    /** Package name declared inside the APK at [path], or null if unreadable. */
    @ReactMethod
    fun readPackageName(path: String, promise: Promise) {
        try {
            val info = reactContext.packageManager.getPackageArchiveInfo(path, 0)
            promise.resolve(info?.packageName)
        } catch (e: Exception) {
            promise.resolve(null)
        }
    }

    /**
     * The subset of [packages] that is installed, each with its launcher label
     * so callers can show the app's own name rather than the .apk file name.
     * Visibility comes from the launcher <queries> filter in the manifest
     * rather than QUERY_ALL_PACKAGES, so only launchable apps are seen — which
     * is all an APK store lists.
     */
    @ReactMethod
    fun filterInstalled(packages: ReadableArray, promise: Promise) {
        val pm = reactContext.packageManager
        val installed = Arguments.createArray()
        for (i in 0 until packages.size()) {
            val name = packages.getString(i) ?: continue
            try {
                val info = pm.getPackageInfo(name, 0)
                val entry = Arguments.createMap()
                entry.putString("packageName", name)
                entry.putString(
                    "label",
                    info.applicationInfo
                        ?.let { pm.getApplicationLabel(it).toString() } ?: name
                )
                entry.putString("icon", iconDataUri(pm, name))
                installed.pushMap(entry)
            } catch (e: Exception) {
                // Not installed, or not visible to us. Either way: not shown.
            }
        }
        promise.resolve(installed)
    }

    /**
     * Starts [packageName]'s launcher activity. Resolves false when the app is
     * gone or has no launcher screen (services, plugins) rather than throwing —
     * the caller only needs to know whether to show an error.
     */
    @ReactMethod
    fun launch(packageName: String, promise: Promise) {
        try {
            val intent = reactContext.packageManager
                .getLaunchIntentForPackage(packageName)
            if (intent == null) {
                promise.resolve(false)
                return
            }
            promise.resolve(start(intent))
        } catch (e: Exception) {
            promise.resolve(false)
        }
    }

    /**
     * Shows the system uninstall dialog for [packageName]. Resolving true only
     * means the dialog opened — the user can still cancel, so the caller has to
     * recheck the install state afterwards rather than assume it is gone.
     * Rejects with the real reason so the screen can show it: silently
     * resolving false here is what made this impossible to diagnose.
     */
    @ReactMethod
    fun uninstall(packageName: String, promise: Promise) {
        try {
            val intent = Intent(
                Intent.ACTION_DELETE,
                Uri.parse("package:$packageName")
            )
            promise.resolve(start(intent))
        } catch (e: Exception) {
            promise.reject("uninstall_failed", "${e.javaClass.simpleName}: ${e.message}", e)
        }
    }

    /**
     * The app's launcher icon as a PNG data URI, so JS can show the real icon
     * instead of a generic placeholder. Rendered through a Canvas rather than
     * read as a resource: modern icons are adaptive drawables built from two
     * layers, and there is no single bitmap file to hand over.
     */
    private fun iconDataUri(pm: PackageManager, packageName: String): String? {
        return try {
            val icon = pm.getApplicationIcon(packageName)
            val size = 144 // ~48dp at xxhdpi; the tiles are 44dp
            val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
            icon.setBounds(0, 0, size, size)
            icon.draw(Canvas(bitmap))
            val out = ByteArrayOutputStream()
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out)
            bitmap.recycle()
            "data:image/png;base64," +
                Base64.encodeToString(out.toByteArray(), Base64.NO_WRAP)
        } catch (e: Exception) {
            null // no icon is a missing tile image, not a failed lookup
        }
    }

    /**
     * Prefers the foreground activity: system dialogs like the uninstaller are
     * unreliable when started from the application context on some OEM builds.
     */
    private fun start(intent: Intent): Boolean {
        val activity = reactContext.currentActivity
        if (activity != null) {
            activity.startActivity(intent)
            return true
        }
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        reactContext.startActivity(intent)
        return true
    }
}
