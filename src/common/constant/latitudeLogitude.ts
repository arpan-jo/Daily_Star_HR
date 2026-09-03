import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {PERMISSIONS, request} from 'react-native-permissions';

export const getLatitudeLongitude = async (setState: any) => {
  const hasPermission = await hasLocationPermission();
  if (!hasPermission) {
    Alert.alert(
      'Location Permission',
      'Make sure your app has approved Location permission.',
    );
    return;
  }
  Geolocation.getCurrentPosition(
    position => {
      if (position?.mocked) {
        Alert.alert(
          'Fake Location Detected',
          'Mock location is not allowed. Please turn off mock location and try again.',
        );
        setState(null);
        return;
      }
      setState(position?.coords);
    },
    error => {
      console.log(error);
      return null;
    },
    {
      accuracy: {
        android: 'high',
        ios: 'best',
      },
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000,
      distanceFilter: 0.001,
    },
  );
};

const hasLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    const hasPermission = await hasPermissionIOS();
    return hasPermission;
  }
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  );
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  return false;
};

const hasPermissionIOS = async () => {
  const openSetting = () => {
    Linking.openSettings().catch(() => {
      Alert.alert('Unable to open settings');
    });
  };
  const status = await Geolocation.requestAuthorization('whenInUse');
  if (status === 'granted') {
    return true;
  }
  if (status === 'denied') {
    Alert.alert('Location permission denied');
  }
  if (status === 'disabled') {
    Alert.alert(
      'Turn on Location Services to allow to determine your location.',
      '',
      [
        {text: 'Go to Settings', onPress: openSetting},
        {text: "Don't Use Location", onPress: () => {}},
      ],
    );
  }
  return false;
};

export const hasCameraPermission = async () => {
  if (Platform.OS === 'ios') {
    const iosCamera = PERMISSIONS.IOS.CAMERA;
    const hasIOSPermission = await iosCameraFunc(iosCamera);

    return hasIOSPermission;
  }
  if (Platform.OS === 'android' && Platform.Version < 23) {
    return true;
  }
  const hasPermission = await PermissionsAndroid.check(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (hasPermission) {
    return true;
  }
  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
  );
  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }
  return false;
};

const iosCameraFunc = async (iosCam: any) => {
  try {
    const cameraStatus = await request(iosCam);
    if (cameraStatus === 'granted') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
};
