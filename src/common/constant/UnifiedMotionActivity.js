import {
  NativeModules,
  NativeEventEmitter,
  PermissionsAndroid,
  Platform,
} from 'react-native';

const {UnifiedMotionActivityModule} = NativeModules || {};
const emitter = UnifiedMotionActivityModule
  ? new NativeEventEmitter(UnifiedMotionActivityModule)
  : null;

export async function requestMotionPermissions() {
  if (Platform.OS === 'android' && Platform.Version >= 29) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION,
        {
          title: 'Activity Recognition Permission',
          message: 'This app needs access to detect your physical activity',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.error('Permission error:', err);
      return false;
    }
  }
  return true; // Permission not required for older Android versions
}

export function startMotionUpdates(callback) {
  // Request permission first, then start
  requestMotionPermissions().then(granted => {
    if (granted) {
      if (!UnifiedMotionActivityModule) {
        console.log('UnifiedMotionActivityModule is not available');
        return;
      }
      UnifiedMotionActivityModule.startUpdates();
      if (!emitter) {
        console.log('Motion activity emitter is not available');
        return;
      }
      const subscription = emitter.addListener('onMotionActivity', data => {
        // console.log('Motion Activity Data:', data);
        callback(data);
      });

      return () => {
        UnifiedMotionActivityModule.stopUpdates();
        subscription.remove();
      };
    } else {
      console.error('Activity recognition permission denied');
      callback({
        activity: 'unknown',
        accelerometer: {x: 0, y: 0, z: 0},
        gyroscope: {x: 0, y: 0, z: 0},
      });
    }
  });
}

export async function getLatestMotionData() {
  try {
    if (!UnifiedMotionActivityModule) {
      console.log('UnifiedMotionActivityModule is not available');
      return null;
    }
    return await UnifiedMotionActivityModule.getUpdatedData();
  } catch (e) {
    console.error('Error getting motion data:', e);
    return null;
  }
}
