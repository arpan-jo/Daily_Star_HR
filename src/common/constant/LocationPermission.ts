import {PermissionsAndroid, Platform} from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {requestPushNotificationPermission} from '../../services/SaaS-modules/notification/notification';

export async function LocationPermission() {
  const permission = [];
  const permissionStatus: Record<string, boolean> = {};
  try {
    if (Platform.OS === 'android') {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      ];

      const results = await Promise.all(
        permissions.map(permission => PermissionsAndroid.check(permission)),
      );

      permissions.forEach((permission, index) => {
        permissionStatus[permission] = results[index];
      });

      console.log('PermissionsAndroid.check => ', results, permissionStatus);

      // Step 1: Request foreground (fine) location
      let isFineGranted = permissionStatus[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION];

      if (!isFineGranted) {
        const fineGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to publish location updates.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        permission.push(fineGranted);
        isFineGranted = fineGranted === PermissionsAndroid.RESULTS.GRANTED;
      }

      if (!isFineGranted) {
        console.log('❌ Fine location denied');
        return false;
      }

      // Step 2: Request background location if Android 10+
      if (
        Platform.Version >= 29 &&
        !permissionStatus[
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        ]
      ) {
        const backgroundGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: 'Background Location Permission',
            message:
              'We need background location access to keep publishing location even when the app is closed.',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        permission.push(backgroundGranted);
        // if (backgroundGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        //   console.log(
        //     '⚠️ Background location denied, service may stop in background',
        //   );
        //   return false;
        // }
      }

      // Step 3: Request notification permission for Android 13+
      if (
        !permissionStatus[PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS]
      ) {
        requestPushNotificationPermission();
        //   const notificationGranted = await PermissionsAndroid.request(
        //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        //     {
        //       title: 'Notification Permission',
        //       message:
        //         'This app needs notification permission to send you important alerts.',
        //       buttonNegative: 'Cancel',
        //       buttonPositive: 'OK',
        //     },
        //   );
        //   permission.push(notificationGranted)

        //   // if (notificationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
        //   //   console.log('❌ Notification permission denied');
        //   //   return false;
        //   // }
      }

      return Object.values(permission).every(
        v => v === PermissionsAndroid.RESULTS.GRANTED,
      );
    } else if (Platform.OS === 'ios') {
      // Request notification permission for iOS
      const notifResult = await PushNotificationIOS.requestPermissions();
      if (!notifResult?.alert) {
        console.log('❌ Notification permission denied on iOS');
        return false;
      }
      // Location permission for iOS is handled by RN libs (e.g., react-native-permissions)
      return true;
    }
  } catch (err) {
    console.log('❌ Permission error', err);
    return false;
  }
}
