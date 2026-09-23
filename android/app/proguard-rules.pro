# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native native modules (RN's own consumer rules cover core; these keep
# this app's bridge modules reachable from JS by name).
-keep class net.thedailystar.** { *; }
-keep class com.printer.**, com.security.**, com.stepcounter.**, com.voice.**, com.voip.** { *; }

# Paho MQTT — ships no consumer rules, uses reflection for persistence/callbacks.
-keep class org.eclipse.paho.** { *; }
-dontwarn org.eclipse.paho.**

# ESCPOS thermal printer
-keep class com.dantsu.escposprinter.** { *; }
-dontwarn com.dantsu.escposprinter.**
