import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Platform} from 'react-native';
import {deleteDeviceFCM} from '../../services/SaaS-modules/notification/notification';
import {mmkv} from '../../stores/rootStore';
import {clearProfileCache} from './profileCache';

export const clearAllStorage = async () => {
  try {
    mmkv.clearAll();
    clearProfileCache();
    const newToken = await messaging().getToken();
    await deleteDeviceFCM(newToken);
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys?.length > 0) {
      if (Platform.OS === 'android') {
        await AsyncStorage.clear();
      }
      if (Platform.OS === 'ios') {
        await AsyncStorage.multiRemove(asyncStorageKeys);
      }
    }
    const isGoogelLogin = await GoogleSignin.isSignedIn();

    if (isGoogelLogin) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
  } catch (error) {
    console.log('clearAllStorage error:', error);
  }
};
