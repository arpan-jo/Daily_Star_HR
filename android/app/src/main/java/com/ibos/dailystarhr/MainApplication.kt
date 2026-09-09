package com.ibos.dailystarhr

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

import com.printer.PocketPrinterPackage
import com.security.SecurityPackage
import com.ibos.dailystarhr.liveKit.LiveKitServicePackage;

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Manually added packages that cannot be autolinked
          // add(StepCounterPackage())
          // add(VoicePackage())
          // add(BarcodeScannerPackage())
          // add(VoIPServiceModule())
          // add(RNPermissionsPackage())
          // add(RNCallKeepPackage())

          add(PocketPrinterPackage())
          add(SecurityPackage())
          add(UnifiedMotionActivityPackage())
          add(BiometricsPackage())
          add(MqttPackage())
          add(LiveKitServicePackage())
          add(ApkInfoPackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
  }
}
