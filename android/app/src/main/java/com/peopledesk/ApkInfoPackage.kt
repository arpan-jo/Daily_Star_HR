package net.thedailystar

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class ApkInfoPackage : ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext)
            : List<NativeModule> = listOf(ApkInfoModule(reactContext))

    override fun createViewManagers(reactContext: ReactApplicationContext)
            : List<ViewManager<*, *>> = emptyList()
}
