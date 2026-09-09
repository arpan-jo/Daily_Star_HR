import NetInfo from '@react-native-community/netinfo';
import {
  DrawerScreenProps,
  createDrawerNavigator} from '@react-navigation/drawer';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { Fragment, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { arlURL, commonURL } from '../../App';
import EmptyScreen from '../common/components/EmptyScreen';
import DashboardIndex from '../modules/SaaS-modules/SaaS_Main_Index';
import ApplicationMainIndex from '../modules/SaaS-modules/application/ApplicationMainIndex';
import ApprovalMainIndex from '../modules/SaaS-modules/approval/ApprovalMainIndex';
import DocumentManagementIndex from '../modules/SaaS-modules/document-management/documentManagement';
import EmployeeDirectoryMainIndex from '../modules/SaaS-modules/employee-directory/EmployeeDirectoryMainIndex';
import EmpManagementMainIndex from '../modules/SaaS-modules/employeeManagement/EmpManagementMainIndex';
import { getMenuPermissionAPI } from '../services/SaaS-modules/drawer/drawer';
import { useRootStore } from '../stores/rootStore';
import CustomDrawer from './CustomDrawer';
import { RootStackScreensParams } from './RootStackScreensParams';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import {
  GetPendingApprovalDashboard,
  PendingApprovalDashboard} from '../common/api/api';
import { httpRequest } from '../common/constant/httpRequest';
import { clearAllStorage } from '../common/services/clearStorage';
import { refreshTokenApi } from '../services/auth/login';
import axios from 'axios';

export type DrawerScreensParams = {
  ['Management Dashboard']: undefined;
  ['Supervisor Dashboard']: undefined;
  ['Attendance Calendar']: undefined;
  Dashboard: undefined;
  Home: undefined;
  ['Employee Attendance']: undefined;
  ['Attendance Tracking']: undefined;
  Leave: undefined;
  Movement: undefined;
  Employee: undefined;
  Profile: undefined;
  Notification: undefined;
  ['Employee Directory']: undefined;
  Chat: undefined;
  ['Cafeteria Management']: undefined;
  ['Time Sheet']: undefined;
  ['Employee Management']: undefined;
  ['Document Management']: undefined;
  ['Training & Development']: undefined;
  ['Provident & Fund']: undefined;
  ['Grievance Management']: undefined;
  Application: undefined;
  Approval: undefined;
};

export type DrawerScreens = keyof DrawerScreensParams;

export type DrawerScreenProp<T extends DrawerScreens> = CompositeScreenProps<
  DrawerScreenProps<DrawerScreensParams, T>,
  NativeStackScreenProps<RootStackScreensParams>
>;

// const {Navigator, Screen} = createDrawerNavigator<DrawerScreensParams>();
const { Navigator, Screen } = createDrawerNavigator();

const Drawer = () => {
  const navigation = useNavigation<any>();
  const {
    userInfo,
    menuTab,
    menuTabSave: _menuTabSave,
    userInfoSave,
    userMenu,
    userMenuSave,
  } = useRootStore();
  const isFocused = useIsFocused();
  const [topMenu, setTopMenu] = useState<any[]>([]);
  const [approvalNum, setApprovaNum] = useState(0);
  const [isRefresh, setIsRefresh] = useState(false);

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    // console.log('from MOBX===> ', JSON.stringify(userMenu, null, 2));
    if (userMenu?.length > 0) {
      setTopMenu(userMenu);
      return;
    }
    try {
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
      // console.log('API RES===>', JSON.stringify(menuRes, null, 2));
      setTopMenu(menuRes);
      if (menuRes?.length > 0) {
        userMenuSave(menuRes);
      }
    } catch (error) {
      console.error('Failed to fetch menu:', error);
    }
  }, []);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const payloadForAll = {
        accountId: userInfo?.intAccountId,
        employeeId: userInfo?.intEmployeeId,
        isAdmin: userInfo?.isOfficeAdmin,
        iAmFromWeb: false,
        iAmFromApps: true,
      };
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? GetPendingApprovalDashboard
            : PendingApprovalDashboard,
        data:
          commonURL === userInfo?.strUrl
            ? {
                ...payloadForAll,
                workplaceGroupId:
                  userInfo?.intWorkplaceGroupId ||
                  userInfo?.originalWorkplaceGroupId,
                workplaceId: userInfo?.intWorkplaceId,
                businessUnitId: userInfo?.intBusinessUnitId,
              }
            : payloadForAll,
      };
      const res = await httpRequest(api_params, () => {});
      // const mod = res?.length && res?.map((item: any) => item?.totalCount);
      // if (mod?.length) {
      //   const sum = Object?.values(mod)?.reduce((pre, cur) => pre + cur);
      //   setApprovaNum(sum);
      // }

      if (Array?.isArray(res)) {
        let sum = 0,
          sumVersion2 = 0;

        for (const { totalCount = 0, pendingApprovalCount = 0 } of res) {
          sum += totalCount;
          sumVersion2 += pendingApprovalCount;
        }

        setApprovaNum(commonURL === userInfo?.strUrl ? sumVersion2 : sum);
      }

      if (res === 401) {
        const payload = {
          accessToken: userInfo?.token,
          refreshToken: userInfo?.refreshToken,
        };
        const refreshRes = await refreshTokenApi(payload);
        if (refreshRes?.accessToken) {
          setIsRefresh(true);
          axios.defaults.headers.common.Authorization = `Bearer ${refreshRes?.accessToken}`;
          const updtedLoginInfo = {
            ...userInfo,
            token: refreshRes?.accessToken,
            refreshToken: refreshRes?.refreshToken,
          };
          //@ts-ignore
          userInfoSave(updtedLoginInfo);
        } else {
          clearAllStorage();
          navigation.navigate('Login');
        }
      }
    },
    [isFocused, menuTab?.isLoad === true, isRefresh],
  );
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async state => {
      if (state?.isConnected && userMenu.length === 0) {
        try {
          const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
          setTopMenu(menuRes);
          if (menuRes?.length > 0) {
            userMenuSave(menuRes);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });

    return () => unsubscribe();
  }, [userInfo, userMenu?.length, userMenuSave]);
  // useEffect(() => {
  //   //Runs only on the first render
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [menuTab?.isLoad === true]);

  // const unsubscribe = NetInfo.addEventListener(async state => {
  //   if (state?.isConnected && menuTab?.isLoad) {
  //     const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
  //     setTopMenu(menuRes);
  //     menuTabSave({
  //       isLoad: false,
  //     });
  //   }
  // });
  // // Unsubscribe
  // unsubscribe();
  return (
    <Navigator
      drawerContent={pro => {
        const props = {
          ...pro,
          approvalNum,
        };
        return <CustomDrawer props={props} />;
      }}
      screenOptions={{
        headerShown: false,
        lazy: true,
        drawerStyle: styles.drawer,
      }}
    >
      {topMenu?.length > 0 ? (
        topMenu?.map((item: any, index) => (
          <Fragment key={index}>
            {item.label?.trim() === 'Dashboard' ? (
              <Screen
                name={userInfo?.strUrl !== arlURL ? 'Dashboard' : 'Home'}
                component={DashboardIndex}
                options={{ drawerIcon: () => 'dashboard' }}
              />
            ) : null}

            {item?.label?.trim() === 'Application' ? (
              <Screen
                name="Application"
                component={ApplicationMainIndex}
                options={{
                  drawerIcon: () => 'wysiwyg',
                }}
              />
            ) : null}

            {item?.label?.trim() === 'Employee Directory' ? (
              <Screen
                name="Employee Directory"
                component={EmployeeDirectoryMainIndex}
                options={{ drawerIcon: () => 'contacts' }}
              />
            ) : null}

            {item?.label?.trim() === 'Approval' ? (
              <Screen
                name="Approval"
                component={ApprovalMainIndex}
                options={{ drawerIcon: () => 'pending-actions' }}
              />
            ) : null}

            {item?.label?.trim() === 'Employee Management' ? (
              <Screen
                name="Employee Management"
                component={EmpManagementMainIndex}
                options={{ drawerIcon: () => 'groups' }}
              />
            ) : null}

            {item?.label === 'Document Management' ? (
              <Screen
                name="Document Management"
                component={DocumentManagementIndex}
                options={{ drawerIcon: () => 'file-present' }}
              />
            ) : null}
          </Fragment>
        ))
      ) : (
        <>
          {userInfo?.strUrl !== arlURL && userInfo?.intBusinessUnitId === 4 ? (
            <Screen
              name={userInfo?.strUrl !== arlURL ? 'Dashboard' : 'Home'}
              component={DashboardIndex}
              options={{ drawerIcon: () => 'dashboard' }}
            />
          ) : (
            <Screen
              name="Dashboard"
              component={EmptyScreen}
              options={{ drawerIcon: () => 'dashboard' }}
            />
          )}
        </>
      )}
    </Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default Drawer;
