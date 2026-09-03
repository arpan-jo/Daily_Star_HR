import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidColor, AndroidImportance } from '@notifee/react-native';
import { Alert, AppState, Linking, PermissionsAndroid, Platform } from 'react-native';
import { _todayDateTime } from '../../../common/services/todayDate';

export const createFCMToken = async (payload: any) => {
  try {
    // console.log(JSON.stringify(payload, null, 2));
    const res = await axios.post(
      '/PushNotify/PushNotifyDeviceRegistration',
      payload,
    );
    // console.log(JSON.stringify(res?.data, null, 2), 'hello');
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const deleteDeviceFCM = async (fcmId: string | null | undefined) => {
  try {
    const res = await axios.get(
      `/PushNotify/DeletePushNotifyDeviceRegistration?id=${fcmId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getPushNotificationDeviceId = async (deviceId: string | null) => {
  try {
    const res = await axios.get(
      `/PushNotify/GetAllPushNotifyDeviceRegistrationByDeviceId?deviceId=${deviceId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const deleteDeviceIdForMultipleId = async (
  deviceId: string | null,
  empId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/PushNotify/DeletePushNotifyDeviceRegistrationByDeviceIdNEmpId?deviceId=${deviceId}&empId=${empId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const GetFCMToken = async (intEmployeeId: any) => {
  // await notifee.requestPermission({
  //   badge: true,
  //   sound: true,
  // });

  const authStatus = await messaging().requestPermission();
  if (authStatus === 1) {
    let fcmtoken = await AsyncStorage.getItem('fcmtoken');

    if (!fcmtoken) {
      try {
        const fcmtokenn = await messaging().getToken();
        if (fcmtokenn) {
          await AsyncStorage.setItem('fcmtoken', fcmtokenn);

          const res = await deleteDeviceFCM(fcmtoken);
          if (res.statusCode === 200 || res?.StatusCode === 200) {
            await AsyncStorage.setItem('fcmtoken', fcmtokenn);
            const payloadFCMToken = {
              intId: 0,
              intEmployeeId: intEmployeeId,
              strDeviceId: fcmtokenn,
              dteCreatedAt: _todayDateTime(),
              isActive: true,
              isIos: Platform.OS === 'ios' ? true : false,
            };
            const createFCMDevices = await createFCMToken(payloadFCMToken);
            if (createFCMDevices?.statusCode !== 200) {
              await createFCMToken(payloadFCMToken);
            }
          }
        }
      } catch (_error) { }
    } else {
      try {
        await messaging().registerDeviceForRemoteMessages();
        const newToken = await messaging().getToken();
        if (fcmtoken !== newToken) {
          const res = await deleteDeviceFCM(fcmtoken);
          if (res.statusCode === 200 || res?.StatusCode === 200) {
            await AsyncStorage.setItem('fcmtoken', newToken);
            const payloadFCMToken = {
              intId: 0,
              intEmployeeId: intEmployeeId,
              strDeviceId: newToken,
              dteCreatedAt: _todayDateTime(),
              isActive: true,
              isIos: Platform.OS === 'ios' ? true : false,
            };
            const createFCMDevices = await createFCMToken(payloadFCMToken);
            if (createFCMDevices?.statusCode !== 200) {
              await createFCMToken(payloadFCMToken);
            }
          }
        } else {
          await AsyncStorage.setItem('fcmtoken', newToken);
          const payloadFCMToken = {
            intId: 0,
            intEmployeeId: intEmployeeId,
            strDeviceId: newToken,
            dteCreatedAt: _todayDateTime(),
            isActive: true,
            isIos: Platform.OS === 'ios' ? true : false,
          };
          await createFCMToken(payloadFCMToken);
        }
      } catch (_error) { }
    }
  }
};

export async function requestBluetoothPermissions() {
  if (Platform.OS == 'ios') return true;

  try {
    if (Number(Platform.Version) >= 31) { // Android 12+
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
      return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        // PermissionsAndroid.PERMISSIONS.BLUETOOTH,
        // PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      ]);
      return Object.values(granted).every(v => v === PermissionsAndroid.RESULTS.GRANTED);
    }
  } catch (error) {
    console.log('requestBluetoothPermissions', error)
  }

}


export async function requestPushNotificationPermission(): Promise<boolean> {

  if (Platform.OS == 'ios') return true;

  const title = 'Notification Permission'
  const message = 'This app needs notification permission to send you important alerts.'

  if (Number(Platform.Version) >= 33) {

    const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

    switch (result) {
      case PermissionsAndroid.RESULTS.GRANTED:
        console.log('Permission granted')
        return true

      case PermissionsAndroid.RESULTS.DENIED:
        console.log('Permission denied')
        return false

      case PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN:
        console.log('Never ask again');
        openAppSettings(title, message);
        return false

      default:
        return false
    }

  } else {
    const settings = await notifee.getNotificationSettings();

    if (settings.authorizationStatus === 0) {
      openAppSettings(title, message)
      return false
    }
    return true
  }
  // const authStatus = await messaging().requestPermission()
  // const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
  // authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  // return enabled
};

export function openAppSettings(title: string, message: string) {
  Alert.alert(
    title,
    message,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      },
    ]
  );
}

export const NotificationListner = async (
  navigation?: any | null | undefined,
) => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage) {
      if (navigation) {
        navigation?.navigate('Loader');
      }
    }
  });
};

async function _onDisplayNotification(data: any) {
  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: data?.data?.channelId,
    name: data?.data?.name,
    sound: data?.data?.sound,
    badge: true,
    vibration: true,
    vibrationPattern: [300, 500],
    lights: true,
    lightColor: AndroidColor.RED,
    importance: AndroidImportance.HIGH,
  });

  if (Platform.OS === 'ios' && AppState.currentState === 'background') {
    // Display a notification
    await notifee.displayNotification({
      title: data?.data?.title,
      body: data?.data?.body,
      ios: {
        sound: data?.data?.soundIOS,
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
        },
      },
    });
  }
  if (Platform.OS === 'android' && AppState.currentState === 'background') {
    // Display a notification
    await notifee.displayNotification({
      title: data?.data?.title,
      body: data?.data?.body,
      android: {
        channelId,
        smallIcon: 'ic_notification',
        vibrationPattern: [300, 500],
      },
    });
  }
}

export const notificationListeners = async () => {
  const unsubscribe = messaging().onMessage(async _remoteMessage => {
    // onDisplayNotification(remoteMessage);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          JSON.stringify(remoteMessage, null, 2),
        );
      }
    });

  return unsubscribe;
};
