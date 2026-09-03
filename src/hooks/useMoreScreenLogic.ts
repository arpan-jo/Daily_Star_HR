import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {useState} from 'react';
import VersionCheck from 'react-native-version-check';
import {EmployeeDashboard} from '../common/api/api';
import {httpRequest} from '../common/constant/httpRequest';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import {clearAllStorage} from '../common/services/clearStorage';
import type {EmpDashboardDataType} from '../interfaces/dashboard/employeeDashboard';
import {
  GetFCMToken,
  NotificationListner,
  deleteDeviceIdForMultipleId,
  notificationListeners} from '../services/SaaS-modules/notification/notification';
import {useRootStore} from '../stores/rootStore';

export const useMoreScreenLogic = (navigation: any) => {
  const isFocused = useIsFocused();
  const {userInfo, logout, userInfoSave: _userInfoSave} = useRootStore();

  const [empDashboardData, setEmpDashboardData] =
    useState<EmpDashboardDataType>();
  const [url, setUrl] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  // Version check logic
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;

      VersionCheck.needUpdate().then(async res => {
        if (res?.isNeeded) {
          setUrl(res.storeUrl);
          setIsUpdate(true);
        } else {
          setUrl('');
          setIsUpdate(false);
        }
      });
    },
    [isFocused],
  );

  // Employee dashboard and notification setup
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;

      if (userInfo?.intEmployeeId && userInfo?.intBusinessUnitId) {
        const api_params = {
          url: EmployeeDashboard,
          data: {
            EmployeeId: userInfo?.intEmployeeId,
            BusinessUnitId: userInfo?.intBusinessUnitId,
          },
        };
        const empDashData = await httpRequest(api_params, () => {});
        setEmpDashboardData(empDashData);
      }

      await NotificationListner();
      await notificationListeners();
      GetFCMToken(userInfo?.intEmployeeId);
      await NotificationListner(navigation);
    },
    [isFocused],
  );

  // Logout function
  const clearAll = async () => {
    try {
      const fcmtoken = await AsyncStorage.getItem('fcmtoken');
      await deleteDeviceIdForMultipleId(fcmtoken, userInfo?.intEmployeeId);
      clearAllStorage();
      logout();

      // userInfoSave({
      //   loginEmail: userInfo?.loginEmail,
      //   loginPassword: userInfo?.loginPassword,
      // });
      // navigation.reset({
      //   index: 0,
      //   routes: [{name: 'Login'}],
      // });
      navigation.replace('Login');
    } catch (_e) {
      // clear error
    }
  };

  return {
    empDashboardData,
    url,
    isUpdate,
    clearAll,
    userInfo,
  };
};
