import {Alert, Linking, PermissionsAndroid, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

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

export const hasLocationPermission = async () => {
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
    {
      title: 'Location Permission',
      message:
        'We need access to your location so you can use the map feature.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );

  if (status === PermissionsAndroid.RESULTS.GRANTED) {
    return true;
  }

  return false;
};

export const getLocation = async (setter: any, weather?: boolean) => {
  const hasPermission = await hasLocationPermission();

  if (!hasPermission) {
    return;
  }

  Geolocation.getCurrentPosition(
    position => {
      if (position?.mocked) {
        Alert.alert(
          'Fake Location Detected',
          'Mock location is not allowed. Please turn off mock location and try again.',
        );
        setter(null);
        return;
      }
      if (weather) {
        getWeatherInfo(
          position?.coords?.latitude,
          position?.coords?.longitude,
          setter,
        );
      } else {
        //@ts-ignore
        setter(position?.coords);
      }
    },
    error => {
      setter(null);
      console.log(error);
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

const getWeatherInfo = async (
  lat: number | undefined,
  lon: number | undefined,
  setWeatherInfo: any,
) => {
  const API_KEY = '0dda2b433573f2cbc9365830ccdbe194';
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
    );
    setWeatherInfo(res?.data?.main);
  } catch (error) {
    console.log('getWeatherInfo err', error);
  }
};
