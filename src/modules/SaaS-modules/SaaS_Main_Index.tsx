import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BackHandler,
  Image,
  Linking,
  NativeModules,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  default as Icon,
  default as MIcon,
} from 'react-native-vector-icons/MaterialIcons';
import { arlURL, commonURL, rscURL } from '../../../App';
import {
  EmployeeDashboard,
  EmployeeDashboardApps,
  EmployeeLeaveBalanceList,
  GetDashboardRole,
  GetPendingApplications,
  GetTodayInformation,
  PeopleDeskAllDDL,
} from '../../common/api/api';
import AppUpdate from '../../common/components/AppUpdate';
import ContainerNew from '../../common/components/Container';
import CustomButtonNew from '../../common/components/CustomButton';
import CustomHeader from '../../common/components/CustomHeader';
import CustomInputNew from '../../common/components/CustomInput';
import { useToast } from '../../common/components/CustomToast';
import { IMAGES } from '../../common/constant/Index';
import { COLORS, SIZES } from '../../common/constant/Themes';
import { httpRequest } from '../../common/constant/httpRequest';
import RBSheet from '../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import { clearAllStorage } from '../../common/services/clearStorage';
import { date_formater } from '../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../common/services/getColor';
import { getImageURL } from '../../common/services/getImage';
import { timeFormaterToPmAm } from '../../common/services/timeFormater';
import { _todayDate, _todayDateTime } from '../../common/services/todayDate';
import { SBUType } from '../../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import { EmployeeContactType } from '../../interfaces/contact/contact';
import {
  AllPolicyType,
  DashboardRolesEntity,
  EmpDashboardDataType,
  NoticeType,
} from '../../interfaces/dashboard/employeeDashboard';
import { DrawerScreenProp } from '../../navigations/Drawer';
import {
  createBookMarked,
  createMeetMe,
  createThumsDown,
  getContactLanding,
  getSwitchBoardData,
} from '../../services/SaaS-modules/contact/contact';
import {
  getAllAnnouncement,
  getAllNotificationCount,
  getAllPolicyList,
} from '../../services/SaaS-modules/dashboard/employeeDashboard';
import { getMenuPermissionAPI } from '../../services/SaaS-modules/drawer/drawer';
import {
  GetFCMToken,
  NotificationListner,
  createFCMToken,
  deleteDeviceIdForMultipleId,
  getPushNotificationDeviceId,
  notificationListeners,
} from '../../services/SaaS-modules/notification/notification';
import { refreshTokenApi } from '../../services/auth/login';
import { useRootStore } from '../../stores/rootStore';
import AttendanceCalendarIndex from './attendance-calendar/AttendanceCalendar';
import AllApplication from './dashboard/employeeDashboard/AllApplication';
import NotificationCounter from './dashboard/employeeDashboard/NotificationCounter';
import ManagerDashboardMainIndex from './dashboard/managerDashboard/ManagerDashboardMainIndex';
import SupervisorDashboardMainIndex from './dashboard/supervisorDashboard/SupervisorDashboardMainIndex';
import { LeaveBalanceItemTs } from '../../interfaces/leave/common-leave/common-leave';

const edges: Edge[] = ['right', 'bottom', 'left'];
interface DashMenuType {
  isTrue: boolean;
  name: string;
}

const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const { SecurityModule } = NativeModules || {};

// leaveUtils.ts

const formatLeaveDataForCommonURL = (
  response: any,
  commonURL: string,
  userInfo: any,
): any => {
  if (
    userInfo?.strUrl !== commonURL ||
    !response?.employeeDashboardViewModel?.leaveBalanceHistoryList
  ) {
    return response;
  }

  const originalList =
    response?.employeeDashboardViewModel?.leaveBalanceHistoryList;

  const transformedList = originalList
    .map((item: any) => ({
      ...item,
      LeaveBalanceId: 0,
      LeaveTypeId: item?.intLeaveTypeId,
      LeaveTypeCode: '',
      LeaveType: item?.strLeaveType,
      RemainingDays: item?.intAllocatedLveInDay - item?.intTakenLveInDay,
      LeaveTakenDays: item?.intTakenLveInDay,
      BalanceDays: 0,
      CarryForwardBalance: 0,
      RemainingDaysForApp: 0,
      LeaveTakenDaysForApp: 0,
      BalanceDaysForApp: 0,
    }))
    .filter((item: any) => item?.isLveBalanceShowForSelfService);
  return {
    ...response,
    employeeDashboardViewModel: {
      ...response.employeeDashboardViewModel,
      leaveBalanceHistoryList: transformedList,
    },
  };
};

const DashboardIndex = observer<DrawerScreenProp<'Dashboard'>>(
  ({ navigation }) => {
    const {
      userInfo,
      userInfoSave,
      menuTabSave,
      dashboardProfileData,
      saveDashboardProfile,
    } = useRootStore();
    const [selectedBuUnit, setSelectedBuUnit] = useState<SBUType[]>();

    axios.defaults.headers.common.Authorization = `Bearer ${userInfo?.token}`;
    axios.defaults.baseURL = `${userInfo?.strUrl}/api`;
    const [deviceName, setDeviceName] = useState('');
    DeviceInfo.getDeviceName().then(name => setDeviceName(name));
    const versionName = DeviceInfo.getSystemVersion();
    const seChUa = 'sec-ch-ua';
    const secChUaMobile = 'sec-ch-ua-mobile';
    const secChUaPlatform = 'sec-ch-ua-platform';
    axios.defaults.headers.common.Authorization = `Bearer ${userInfo?.token}`;
    axios.defaults.baseURL = `${userInfo?.strUrl}/api`;
    DeviceInfo.getUniqueId().then(uniqueId => {
      axios.defaults.headers.common[seChUa] = uniqueId;
    });
    axios.defaults.headers.common[secChUaMobile] = deviceName;
    axios.defaults.headers.common[secChUaPlatform] =
      Platform.OS === 'android'
        ? `android${versionName}:empId${userInfo?.intEmployeeId}`
        : `ios:empId${userInfo?.intEmployeeId}`;

    const isFocused = useIsFocused();
    const toaster = useToast();
    const refRBSheet = useRef();
    const refRBSheet1 = useRef();
    const [isLoadAgain, setIsLoadAgain] = useState(false);
    const [tabName, setTabName] = useState(0);
    const [dashMenu, setDashMenu] = useState<DashMenuType[]>([]);
    const [isShow, setIsShow] = useState(false);
    const [, setIsLoading] = useState<boolean>(false);
    const [empDashboardData, setEmpDashboardData] =
      useState<EmpDashboardDataType>();
    const [allNoticeBoard, setAllNoticeBoard] = useState<NoticeType[]>();
    const [allPolicyList, setAllPolicyList] = useState<AllPolicyType[]>();
    const [notificationCounter, setNorificationCounter] = useState<number>(0);
    const [refreshing, setRefreshing] = useState(false);
    const [contactData, setContactData] = useState<EmployeeContactType[]>();
    const busId = userInfo?.intBusinessUnitId;
    const [switchBoardData, setSwitchBoardData] = useState<any>();
    const [empId, setEmpId] = useState();
    const [isDisable, setIsDisable] = useState(false);
    const [todayInfoData, setTodayInfoData] = useState<any>();
    const [allPendingApplicationData, setAllPendingApplicationData] =
      useState<any>();
    const [leaveHistoryData, setLeaveHistoryData] =
      useState<LeaveBalanceItemTs[]>();
    // current Yaer
    let currentYear = _todayDateTime().getFullYear();
    const hour = dayjs().hour();
    const netInfo = useNetInfo();
    const secure = () => {
      SecurityModule?.disableSecureFlag();
    };

    const dep =
      !empDashboardData?.employeeDashboardViewModel?.employeeId ||
      isFocused ||
      netInfo?.isConnected ||
      userInfo?.token;

    useEffect(() => {
      secure();
      NetInfo.refresh().then(state => {
        if (
          state.isConnected &&
          !empDashboardData?.employeeDashboardViewModel?.employeeId
        ) {
          importantApiCall();
        }
        if (!state.isConnected) {
          importantApiCall();
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dep]);

    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        await getContactData(busId);
        // await requestUserPermission();
        await NotificationListner(navigation);
        await GetFCMToken(userInfo?.intEmployeeId);
        importantApiCall();
        const backAction = () => {
          if (navigation.isFocused()) {
            BackHandler.exitApp();
            return true;
          }
        };
        BackHandler.addEventListener('hardwareBackPress', backAction);
        return () =>
          BackHandler.removeEventListener('hardwareBackPress', backAction);
      },
      [
        isFocused,
        currentYear,
        hour === 0,
        userInfo?.intAccountId,
        notificationCounter > 0,
        userInfo?.token,
        refreshing,
      ],
    );
    const getEmpLeaveBalanceData = async () => {
      const api_params = {
        url: EmployeeLeaveBalanceList,
        data: {
          employeeId: userInfo?.intEmployeeId,
          date: _todayDate(),
          isAdmin: userInfo?.isOfficeAdmin,
        },
      };
      const res = await httpRequest(api_params, () => {});

      const modifyRes = res?.filter(
        (item: any) => item?.status?.trim() === 'Active',
      );
      setLeaveHistoryData(modifyRes);
    };
    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        await getEmpLeaveBalanceData();
        await NotificationListner();
        await notificationListeners();
        const notiCount = await getAllNotificationCount(
          userInfo?.intEmployeeId,
          userInfo?.intAccountId,
        );
        if (notiCount) {
          setNorificationCounter(notiCount);
        } else {
          setNorificationCounter(0);
        }
      },
      [isFocused],
    );

    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        setIsLoadAgain(false);
        if (commonURL === userInfo?.strUrl) {
          const params = {
            url: PeopleDeskAllDDL,
            data: {
              DDLType: 'WorkplaceGroup',
              BusinessUnitId: userInfo?.intBusinessUnitId,
              WorkplaceGroupId:
                userInfo?.intWorkplaceGroupId ||
                userInfo?.originalWorkplaceGroupId,
              intId: userInfo?.intEmployeeId,
            },
          };
          const resss = await httpRequest(params, () => {});
          const modifiedData = resss?.map((item: any) => {
            return {
              value: item?.intWorkplaceGroupId,
              label: item?.strWorkplaceGroup,
            };
          });
          setSelectedBuUnit(modifiedData);
        }
      },
      [isFocused, isLoadAgain, refreshing],
    );

    const appName = `sendTo_people_desk_saas_${userInfo?.intAccountId}_${userInfo?.intEmployeeId}`;

    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        const connection = new HubConnectionBuilder()
          .withUrl('https://signal.peopledesk.io/NotificationHub')
          .withAutomaticReconnect()
          .configureLogging(LogLevel.None)
          .build();
        if (connection) {
          connection
            .start()
            .then(() => {
              connection.on(`${appName}`, (count: number) => {
                setNorificationCounter(preCount => preCount + count);
              });
            })
            .catch((error: any) =>
              console.log(
                'connection err ===>',
                JSON.stringify(error, null, 2),
              ),
            );
        }
      },
      [isFocused],
    );

    const menuPress = (index: number) => {
      setTabName(index);
      setIsShow(!isShow);
      const modMenu = [...dashMenu];
      const dashboardMenu = modMenu?.map((item: any, ind: any) => {
        return {
          ...item,
          isTrue: ind === index || false,
        };
      });
      setDashMenu(dashboardMenu);
    };
    const hanleRefresh = async () => {
      setRefreshing(true);
      wait(500).then(async () => {
        importantApiCall();

        if (commonURL === userInfo?.strUrl) {
          const payload = {
            accessToken: userInfo?.token,
            refreshToken: userInfo?.refreshToken,
          };
          const refreshRes = await refreshTokenApi(payload);
          if (refreshRes?.accessToken) {
            axios.defaults.headers.common.Authorization = `Bearer ${refreshRes?.accessToken}`;
            const updatedInfo = {
              ...userInfo,
              token: refreshRes?.accessToken,
              refreshToken: refreshRes?.refreshToken,
            };
            //@ts-ignore
            userInfoSave(updatedInfo);
          }
        }

        if (
          (userInfo?.intBusinessUnitId === 4 &&
            !userInfo?.intWorkplaceGroupId) ||
          (userInfo?.intBusinessUnitId === 4 && !userInfo?.intWorkplaceId)
        ) {
          const info = {
            ...userInfo,
            intWorkplaceGroupId: 8,
            strWorkplaceGroup: '10MS Ltd.',
            intWorkplaceId: 28,
            strWorkplace: '10MS Headquarters',
            originalWorkplaceGroupId: 8,
            strUrl: 'https://app.peopledesk.io',
          };
          userInfoSave(info);
          const params = {
            url: PeopleDeskAllDDL,
            data: {
              DDLType: 'WorkplaceGroup',
              BusinessUnitId: 4,
              WorkplaceGroupId: 8,
              intId: userInfo?.intEmployeeId,
            },
          };
          const resss = await httpRequest(params, () => {});
          const modifiedData = resss?.map((item: any) => {
            return {
              value: item?.intWorkplaceGroupId,
              label: item?.strWorkplaceGroup,
            };
          });
          setSelectedBuUnit(modifiedData);
        }
        // it will be deleted later end

        const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
        if (menuRes?.length > 0) {
          menuTabSave({
            isLoad: true,
          });
          if (userInfo?.strUrl !== arlURL) {
            navigation.replace('EmpDrawer');
          } else {
            if (userInfo?.intUserTypeId === 1) {
              navigation.replace('ArlDrawer');
            } else if (userInfo?.intUserTypeId === 2) {
              navigation.replace('SupDrawer');
            }
          }
        }
        setRefreshing(false);
      });
    };

    const importantApiCall = async () => {
      if (
        !userInfo?.intAccountId ||
        !userInfo?.token ||
        !userInfo?.refreshToken
      ) {
        clearAllStorage();
        navigation.navigate('Login');
      }

      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? EmployeeDashboardApps
            : EmployeeDashboard,
        data: {
          EmployeeId: userInfo?.intEmployeeId,
          BusinessUnitId: userInfo?.intBusinessUnitId,
          accountId: userInfo?.intAccountId,
        },
        // isConsole: true,
      };
      const empDashData = await httpRequest(api_params, setIsLoading);
      if (empDashData === 406) {
        clearAllStorage();
        navigation.navigate('Login');
      } else if (empDashData === 401) {
        const payload = {
          accessToken: userInfo?.token,
          refreshToken: userInfo?.refreshToken,
        };
        const refreshRes = await refreshTokenApi(payload);
        if (refreshRes?.accessToken) {
          axios.defaults.headers.common.Authorization = `Bearer ${refreshRes?.accessToken}`;

          const updatedInfo = {
            ...userInfo,
            token: refreshRes?.accessToken,
            refreshToken: refreshRes?.refreshToken,
          };
          //@ts-ignore
          userInfoSave(updatedInfo);
          const api_params2 = {
            url:
              commonURL === userInfo?.strUrl
                ? EmployeeDashboardApps
                : EmployeeDashboard,
            data: {
              EmployeeId: userInfo?.intEmployeeId,
              BusinessUnitId: userInfo?.intBusinessUnitId,
              accountId: userInfo?.intAccountId,
            },
          };
          const empDashDatas = await httpRequest(api_params2, setIsLoading);

          // //store data in mobx
          // saveDashboardProfile(empDashDatas);

          // setEmpDashboardData(empDashDatas);
          if (userInfo?.strUrl === commonURL) {
            const modData: any = formatLeaveDataForCommonURL(
              empDashDatas,
              commonURL,
              userInfo,
            );
            setEmpDashboardData(modData);
          } else {
            setEmpDashboardData(empDashDatas);
          }
        } else {
          clearAllStorage();
          navigation.navigate('Login');
        }
      } else {
        if (dashboardProfileData?.employeeDashboardViewModel) {
          console.log('load form cache');
          if (userInfo?.strUrl === commonURL) {
            const modData: any = formatLeaveDataForCommonURL(
              dashboardProfileData,
              commonURL,
              userInfo,
            );
            setEmpDashboardData(modData);
          } else {
            setEmpDashboardData(empDashData);
          }
        } else {
          const empParams = {
            url:
              commonURL === userInfo?.strUrl
                ? EmployeeDashboardApps
                : EmployeeDashboard,
            data: {
              EmployeeId: userInfo?.intEmployeeId,
              BusinessUnitId: userInfo?.intBusinessUnitId,
              accountId: userInfo?.intAccountId,
            },
          };
          const empRes = await httpRequest(empParams, setIsLoading);
          console.log('load form api');
          saveDashboardProfile(empRes);
          if (userInfo?.strUrl === commonURL) {
            const modData: any = formatLeaveDataForCommonURL(
              empRes,
              commonURL,
              userInfo,
            );
            setEmpDashboardData(modData);
          } else {
            setEmpDashboardData(empDashData);
          }
        }

        // await manageDeviceFCMToken();
        const allNottice = await getAllAnnouncement(
          userInfo?.intAccountId,
          userInfo?.intEmployeeId,
          userInfo?.intBusinessUnitId,
          currentYear,
          userInfo?.intWorkplaceGroupId,
        );
        if (allNottice) {
          setAllNoticeBoard(allNottice);
        }
        const allPolicy = await getAllPolicyList(userInfo?.intEmployeeId);
        if (allPolicy) {
          setAllPolicyList(allPolicy);
        }

        const api_paramsForDashRole = {
          url: GetDashboardRole,
          data: {
            accountId: userInfo?.intAccountId,
            employeeId: userInfo?.intEmployeeId,
          },
        };
        const resForDashRole = await httpRequest(
          api_paramsForDashRole,
          () => {},
        );
        const mn = resForDashRole?.map(
          (item: DashboardRolesEntity, index: number) => {
            return {
              isTrue: index === tabName || false,
              name: item?.label,
            };
          },
        );
        setDashMenu(mn);

        const api_params2 = {
          url: GetPendingApplications,
          data: { employeeId: userInfo?.intEmployeeId },
        };
        const pendingRes = await httpRequest(api_params2, () => {});
        setAllPendingApplicationData(pendingRes);
        const api_params = {
          url: GetTodayInformation,
          data: { employeeId: userInfo?.intEmployeeId },
        };
        const todayInfoRes = await httpRequest(api_params, () => {});
        setTodayInfoData(todayInfoRes);
      }
      setRefreshing(false);
    };

    const _manageDeviceFCMToken = async () => {
      let fcmtoken = await AsyncStorage.getItem('fcmtoken');
      const registeredDeviceId = await getPushNotificationDeviceId(fcmtoken);
      if (registeredDeviceId?.length === 0) {
        createForFCMToken();
      }
      if (registeredDeviceId?.length > 0) {
        const hasSameDeviceId = registeredDeviceId?.filter(
          (token: any) =>
            token?.strDeviceId === fcmtoken &&
            token?.intEmployeeId === userInfo?.intEmployeeId,
        );
        if (hasSameDeviceId.length === 0) {
          createForFCMToken();
        }
        const forDeleteDeviceId = registeredDeviceId?.filter(
          (token: any) =>
            token?.strDeviceId === fcmtoken &&
            token?.intEmployeeId !== userInfo?.intEmployeeId,
        );
        if (forDeleteDeviceId?.length > 0) {
          await deleteDeviceIdForMultipleId(fcmtoken, userInfo?.intEmployeeId);
        }
      }
    };
    const createForFCMToken = async () => {
      let fcmtoken = await AsyncStorage.getItem('fcmtoken');
      const payloadFCMToken = {
        intId: 0,
        intEmployeeId: userInfo?.intEmployeeId,
        strDeviceId: fcmtoken,
        dteCreatedAt: _todayDateTime(),
        isActive: true,
      };
      if (userInfo?.intEmployeeId) {
        const createFCMDevices = await createFCMToken(payloadFCMToken);
        if (createFCMDevices?.statusCode !== 200) {
          await createFCMToken(payloadFCMToken);
        }
      }
    };

    const getContactData = async (buInt: any) => {
      const res = await getContactLanding(
        userInfo?.intAccountId,
        buInt,
        setIsLoading,
        '',
        userInfo?.intEmployeeId,
      );

      const modifies1 = res?.filter((item: EmployeeContactType) => {
        return item?.isBookmarked === true;
      });
      const modifies = modifies1?.map((item: EmployeeContactType) => {
        return {
          ...item,
          isClicked: false,
        };
      });
      setContactData(modifies);
    };

    const currentTime = dayjs().format('h:mm A');
    const { control, handleSubmit, setValue, reset } = useForm({
      defaultValues: {
        agendaOfMeetMe: 'Come to meet me now',
        schedule: currentTime?.toString(),
      },
    });

    const dialCall = (phone?: String, email?: String) => {
      let phoneNumber = '';

      if (Platform.OS === 'android') {
        phoneNumber = `tel:${phone}`;
      } else {
        phoneNumber = `telprompt:${phone}`;
      }

      if (phone) {
        Linking.openURL(phoneNumber);
      } else if (email) {
        Linking.openURL(`mailto:${email}`);
      } else {
        toaster.show({ message: 'Phone no is empty.', type: 'error' });
      }
    };

    const handleClicked = (ind: number) => {
      if (contactData) {
        const empData = [...contactData];
        const modData = empData?.map((item, index) => {
          return {
            ...item,
            isClicked: ind === index ? !item?.isClicked : false,
          };
        });
        setContactData(modData);
      }
    };

    const handleSwitchBoardData = async (empIdd: number) => {
      //@ts-ignore
      setSwitchBoardData([]);
      //@ts-ignore
      refRBSheet1?.current?.open();
      const res = await getSwitchBoardData(empIdd, setIsLoading);
      setSwitchBoardData(res);
    };

    const openMap = async (ad: any) => {
      if (!ad) {
        toaster.show({ message: 'No address to show.', type: 'error' });
        return;
      }
      const scheme = Platform.select({
        ios: 'maps:0,0?q=',
        android: 'geo:0,0?q=',
      });
      const url = Platform.select({
        ios: `${scheme}@${ad}`,
        android: `${scheme}${ad}`,
      });
      //@ts-ignore
      Linking.openURL(url);
    };

    const createBookmark = async (it: any) => {
      const res = await createBookMarked(
        userInfo?.intEmployeeId,
        it?.EmployeeId,
        it?.isBookmarked,
        customCallback,
      );
      handleResponds(res);
    };

    const handleThumsDown = async (it: any) => {
      const res = await createThumsDown(
        userInfo?.intEmployeeId,
        it?.EmployeeId,
        it?.isThumbsDown,
        customCallback,
      );
      handleResponds(res);
    };

    const handleResponds = async (res: any) => {
      if (res) {
        toaster.show({ message: 'Successfull.', type: 'success' });
      } else {
      }
    };

    const customCallback = async () => {
      await getContactData(busId);
    };

    const createMeetMeMsg = async (data: any) => {
      setIsDisable(true);
      const dname = `${userInfo?.strDisplayName}, ${userInfo?.strDesignation}, ${userInfo?.strDepartment}`;
      const res = await createMeetMe(
        userInfo?.intAccountId,
        userInfo?.intEmployeeId,
        dname?.toString(),
        empId,
        data?.agendaOfMeetMe,
        data?.schedule,
        () => {
          reset();
          setIsDisable(false);
          // @ts-ignore
          refRBSheet?.current?.close();
        },
      );
      if (res) {
        setIsDisable(false);
        toaster.show({
          message: 'Message sent successfully.',
          type: 'success',
        });
      }
    };
    return (
      <ContainerNew
        isRefresh={false}
        isScrollView={false}
        edges={edges}
        header={
          <>
            <TouchableOpacity
              activeOpacity={5}
              onPress={() => setIsShow(false)}
            >
              <CustomHeader
                setRerender={setIsLoadAgain}
                isSubtitleClickable={commonURL === userInfo?.strUrl || false}
                subTitleData={selectedBuUnit}
                subtitle={
                  commonURL === userInfo?.strUrl
                    ? userInfo?.strWorkplaceGroup
                    : ''
                }
                isMoreIcon={dashMenu?.length > 1 || false}
                moreIconPress={() => setIsShow(!isShow)}
                onLeftMenuPress={() => {
                  menuTabSave({
                    isLoad: true,
                  });
                  navigation.toggleDrawer();
                }}
                title={userInfo?.strUrl !== arlURL ? 'Dashboard' : 'Home'}
                components={
                  <NotificationCounter
                    notificationCounter={notificationCounter}
                    setNorificationCounter={setNorificationCounter}
                  />
                }
              />
            </TouchableOpacity>

            {isShow ? (
              <TouchableOpacity
                onPress={() => setIsShow(!isShow)}
                style={styles.tabHead}
              >
                {dashMenu?.map((item, index) => (
                  <TouchableOpacity
                    style={[
                      styles.dashMenu,
                      {
                        backgroundColor: item?.isTrue
                          ? COLORS.lightPrimary2
                          : COLORS.white,
                      },
                    ]}
                    key={item?.name}
                    onPress={() => menuPress(index)}
                  >
                    <Text
                      style={[
                        styles.tabName,
                        {
                          fontWeight: item?.isTrue ? '600' : '400',
                        },
                      ]}
                    >
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </TouchableOpacity>
            ) : null}
          </>
        }
        style={styles.contain}
      >
        <AppUpdate />

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => hanleRefresh()}
              tintColor={COLORS.primary}
              colors={[COLORS.yellow, COLORS.primary]}
            />
          }
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => setIsShow(false)}>
            {tabName === 0 && (
              <View style={[styles.container]}>
                {/* Head Card */}
                <View style={styles.headBox}>
                  <TouchableOpacity
                    activeOpacity={isShow ? 5 : 0.6}
                    style={styles.touchCard}
                    onPress={() => {
                      if (isShow) {
                        setIsShow(!isShow);
                      } else {
                        //@ts-ignore
                        navigation.navigate('EmpolyeeSelfDetails', {
                          empDashboardData,
                        });
                      }
                    }}
                  >
                    <View style={styles.card}>
                      <View style={styles.cardImageText}>
                        {empDashboardData?.employeeDashboardViewModel
                          ?.employeeProfileUrlId ? (
                          <FastImage
                            source={{
                              uri: getImageURL(
                                empDashboardData?.employeeDashboardViewModel
                                  ?.employeeProfileUrlId,
                              ),
                            }}
                            style={styles.profileImage}
                          />
                        ) : (
                          <FastImage
                            source={IMAGES.NoImage}
                            style={styles.profileImage}
                          />
                        )}
                        <View style={styles.cardText}>
                          <Text style={styles.name}>
                            {
                              empDashboardData?.employeeDashboardViewModel
                                ?.employeeName
                            }
                          </Text>
                          <Text style={styles.cardCommonText}>
                            {
                              empDashboardData?.employeeDashboardViewModel
                                ?.employmentType
                            }
                          </Text>
                          <Text style={styles.cardCommonText}>
                            {
                              empDashboardData?.employeeDashboardViewModel
                                ?.employeeCode
                            }
                          </Text>
                          <Text style={styles.cardCommonText}>
                            {
                              empDashboardData?.employeeDashboardViewModel
                                ?.designationName
                            }
                          </Text>
                          <Text style={styles.cardCommonText}>
                            {
                              empDashboardData?.employeeDashboardViewModel
                                ?.departmentName
                            }
                          </Text>
                        </View>
                      </View>
                      <MIcon name="arrow-forward" size={25} color={'#667085'} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.bar]} />

                {/* attendance calendar section*/}
                <>
                  <AttendanceCalendarIndex allDayDetials={undefined} />
                  <View style={styles.footerSection}>
                    <TouchableOpacity
                      onPress={() => {
                        //@ts-ignore
                        navigation.navigate('AttendanceDetails', {});
                      }}
                      style={styles.footerButton}
                    >
                      <Text style={styles.footerText}>View Details</Text>
                      <MIcon name="arrow-forward" size={20} color={'#667085'} />
                    </TouchableOpacity>
                  </View>
                </>
                <View style={[styles.bar]} />

                {/* applicaiton section */}
                <AllApplication />
                <View
                  style={[
                    styles.bar,
                    {
                      marginTop: 5,
                      marginVertical: 0,
                    },
                  ]}
                />
                {userInfo?.strUrl === arlURL ? (
                  <>
                    <View
                      style={[
                        styles.bar,
                        {
                          marginTop: 5,
                          marginVertical: 0,
                        },
                      ]}
                    />

                    {/* Culture section */}
                    <View
                      style={{
                        backgroundColor: '#12B76A',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}
                      >
                        <View
                          style={{
                            width: '75%',
                          }}
                        >
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: 18,
                              lineHeight: 28,
                              fontWeight: '600',
                            }}
                          >
                            Culture
                          </Text>
                          <Text
                            style={{
                              color: COLORS.white,
                              fontSize: 14,
                              paddingTop: 6,
                            }}
                          >
                            Make a messages meaningful & measurable, recognition
                            in fuels performance and provides valuable.
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('CultureMainIndex')
                            }
                            activeOpacity={0.6}
                            style={{
                              marginTop: 8,
                              flexDirection: 'row',
                              alignItems: 'center',
                              borderWidth: 1,
                              borderColor: COLORS.white,
                              paddingVertical: 10,
                              paddingHorizontal: 16,
                              borderRadius: 100,
                              width: '55%',
                            }}
                          >
                            <Text
                              style={{
                                color: COLORS.white,
                                fontSize: 14,
                                fontWeight: '600',
                                lineHeight: 20,
                                textAlign: 'center',
                                paddingRight: 10,
                              }}
                            >
                              Get Started
                            </Text>
                            <Icon
                              name="arrow-right-alt"
                              color={COLORS.white}
                              size={25}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{
                            paddingTop: 16,
                          }}
                        >
                          <FastImage
                            source={IMAGES.RewardImage}
                            style={{
                              width: 70,
                              height: 70,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                  </>
                ) : null}

                <View style={[styles.bar, { marginTop: 0 }]} />

                {/* leave balance section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>My Leaves</Text>
                  <View style={styles.myLeavesSection}>
                    {leaveHistoryData &&
                      leaveHistoryData?.length > 0 &&
                      leaveHistoryData?.map((leaveHistory, index) => (
                        <View
                          key={index?.toString()}
                          style={[
                            styles.myLeavesBox,
                            {
                              borderBottomWidth:
                                leaveHistoryData &&
                                leaveHistoryData?.length - 1 === index
                                  ? 0
                                  : 1,
                            },
                          ]}
                        >
                          <View style={{ width: '40%', paddingLeft: 16 }}>
                            <Text style={styles.leaveText}>
                              {leaveHistory?.type || 'N/A'}
                            </Text>
                          </View>
                          <Text style={styles.leaveText}>
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.totalBalanceDays || 0}{' '}
                            </Text>
                            {'  '}
                            Available
                          </Text>

                          <Text
                            style={[styles.leaveText, { paddingRight: 16 }]}
                          >
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.totalTakenDays || 0}
                            </Text>
                            {'  '}
                            Taken
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
                <View style={[styles.bar]} />

                {/* Favourite Emp details */}
                {contactData?.length && contactData?.length > 0 ? (
                  <>
                    <View style={styles.containerMargin}>
                      <Text style={styles.myLeaveTitle}>
                        Favourite Employee
                        {userInfo?.strUrl === rscURL && (
                          <Text style={styles.myLeaveTitle}> (Hourly)</Text>
                        )}
                      </Text>
                      <>
                        {contactData?.map((item, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => {
                              if (userInfo?.strUrl) {
                                handleClicked(index);
                              }
                              // else {
                              //   handleClicked(index);
                              // }
                            }}
                            style={{
                              marginHorizontal: 2,
                              paddingHorizontal: item?.isClicked ? 8 : 0,
                              borderRadius: 10,
                              backgroundColor: item?.isClicked
                                ? '#F2F4F7'
                                : COLORS.white,
                              elevation: item?.isClicked ? 3 : 0,
                              marginBottom: item?.isClicked ? 8 : 0,
                              paddingTop: item?.isClicked ? 12 : 4,
                            }}
                          >
                            <View style={[styles.cardHead]}>
                              <View
                                style={{ flexDirection: 'row', width: '90%' }}
                              >
                                <View style={styles.imageSection}>
                                  {item?.intProfilePicFileUrlId ? (
                                    <FastImage
                                      source={{
                                        uri: getImageURL(
                                          item?.intProfilePicFileUrlId,
                                        ),
                                      }}
                                      style={styles.managerImage}
                                    />
                                  ) : (
                                    <View style={styles.noImageBox}>
                                      <Image
                                        source={IMAGES.NoImage}
                                        style={styles.managerImage}
                                      />
                                    </View>
                                  )}
                                </View>
                                <View
                                  style={{
                                    width: '82%',
                                  }}
                                >
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      marginTop: -4,
                                      width: '100%',
                                      flexWrap: 'wrap',
                                    }}
                                  >
                                    <Text style={styles.empName}>
                                      {item?.EmployeeName?.trim()}{' '}
                                    </Text>

                                    <Text>
                                      {item?.isBookmarked && (
                                        <Icon
                                          name="star"
                                          size={18}
                                          color={COLORS.late}
                                        />
                                      )}
                                    </Text>
                                  </View>

                                  <View
                                    style={[
                                      styles.cmnSubTitle,
                                      styles.paddingTop,
                                      { flexDirection: 'row' },
                                    ]}
                                  >
                                    <Text style={styles.commonTextTitle1}>
                                      {item?.DesignationName?.trim()}
                                    </Text>
                                  </View>

                                  <View
                                    style={[
                                      styles.cmnSubTitle,
                                      { paddingVertical: 2 },
                                    ]}
                                  >
                                    <Text style={styles.commonTextTitle1}>
                                      {item?.Phone || '---'}
                                    </Text>
                                  </View>
                                </View>
                              </View>
                              <View>
                                <TouchableOpacity
                                  onPress={() => {
                                    dialCall(item?.Phone, undefined);
                                  }}
                                  style={{
                                    padding: 8,
                                  }}
                                >
                                  <Icon
                                    name="call"
                                    size={23}
                                    color={COLORS.graySubText}
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                            {contactData?.length === index + 1 ? null : (
                              <View
                                style={{
                                  height: 1,
                                  backgroundColor: item?.isClicked
                                    ? '#EAECF0'
                                    : COLORS.bar,
                                  marginVertical: 8,
                                  marginHorizontal: item?.isClicked ? 16 : 0,
                                }}
                              />
                            )}
                            {item?.isClicked ? (
                              <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                style={{
                                  flexDirection: 'row',
                                  paddingLeft: '4%',
                                  paddingBottom: 10,
                                  paddingTop: 4,
                                }}
                              >
                                {userInfo?.strUrl === arlURL ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      handleSwitchBoardData(item?.EmployeeId);
                                    }}
                                    style={styles.chatAndInfo}
                                  >
                                    <MIcon
                                      name="link"
                                      size={22}
                                      color={COLORS.white}
                                      style={{
                                        transform: [{ rotate: '135deg' }],
                                      }}
                                    />
                                  </TouchableOpacity>
                                ) : null}

                                <TouchableOpacity
                                  onPress={() =>
                                    //@ts-ignore
                                    navigation.navigate('CreateAppreciate', {
                                      empDetails: item,
                                    })
                                  }
                                  style={[
                                    styles.chatAndInfo,
                                    { marginLeft: 12 },
                                  ]}
                                >
                                  <MCIcon
                                    name="thumb-up-outline"
                                    size={22}
                                    color={COLORS.white}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    handleThumsDown(item);
                                  }}
                                  style={[
                                    styles.chatAndInfo,
                                    { marginLeft: 12 },
                                  ]}
                                >
                                  <MCIcon
                                    name="thumb-down-outline"
                                    size={22}
                                    color={
                                      item?.isThumbsDown
                                        ? COLORS.yellow
                                        : COLORS.white
                                    }
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    if (item?.Phone) {
                                      Linking.openURL(
                                        `sms:${item?.Phone}?body=`,
                                      );
                                    } else {
                                      toaster.show({
                                        message: 'Phone no is empty.',
                                        type: 'error',
                                      });
                                    }
                                  }}
                                  style={[
                                    styles.chatAndInfo,
                                    { marginLeft: 12 },
                                  ]}
                                >
                                  <Icon
                                    name="chat"
                                    size={22}
                                    color={COLORS.white}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  onPress={() => {
                                    //@ts-ignore
                                    navigation.navigate(
                                      'EployeeDirectoryDetails',
                                      {
                                        employeeDetails: item || '',
                                      },
                                    );
                                  }}
                                  style={[
                                    styles.chatAndInfo,
                                    { marginLeft: 12 },
                                  ]}
                                >
                                  <Icon
                                    name="info"
                                    size={22}
                                    color={COLORS.white}
                                  />
                                </TouchableOpacity>

                                {userInfo?.strUrl === arlURL && (
                                  <>
                                    <TouchableOpacity
                                      onPress={() => createBookmark(item)}
                                      style={[
                                        styles.chatAndInfo,
                                        { marginLeft: 12 },
                                      ]}
                                    >
                                      <Icon
                                        name="star"
                                        size={22}
                                        color={
                                          item?.isBookmarked
                                            ? COLORS.late
                                            : COLORS.white
                                        }
                                      />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      onPress={() => {
                                        // @ts-ignore
                                        setEmpId(item?.EmployeeId);
                                        // @ts-ignore
                                        refRBSheet?.current?.open();
                                      }}
                                      style={[
                                        styles.chatAndInfo,
                                        {
                                          marginLeft: 12,
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        },
                                      ]}
                                    >
                                      <Icon
                                        name="notifications"
                                        size={22}
                                        color={COLORS.white}
                                      />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                      onPress={() => {
                                        openMap(item?.presentAddress);
                                      }}
                                      style={[
                                        styles.chatAndInfo,
                                        {
                                          marginLeft: 12,
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                        },
                                      ]}
                                    >
                                      <MCIcon
                                        name="map-marker"
                                        size={22}
                                        color={COLORS.white}
                                      />
                                    </TouchableOpacity>

                                    <View
                                      style={{
                                        width: 100,
                                      }}
                                    />
                                  </>
                                )}
                              </ScrollView>
                            ) : null}
                          </TouchableOpacity>
                        ))}
                      </>
                    </View>
                    <View style={[styles.bar]} />
                  </>
                ) : null}

                {/* time calendar section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>Time Calendar</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '10%' }}>
                      <MIcon
                        name="watch-later"
                        size={25}
                        color={COLORS.iconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.commonTextData}>
                        {todayInfoData?.workingPeriod || 'N/A'}
                      </Text>
                      <Text style={styles.commonTextTitle}>
                        Today Working Period
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.borderBottomWidth,
                      { marginTop: 10, marginBottom: 10 },
                    ]}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '10%' }}>
                      <MIcon
                        name="hourglass-bottom"
                        size={25}
                        color={COLORS.iconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.commonTextData}>
                        {`${timeFormaterToPmAm(
                          todayInfoData?.calendarStartTime,
                        )} - ${timeFormaterToPmAm(
                          todayInfoData?.calendarEndTime,
                        )}`}
                      </Text>
                      <Text style={styles.commonTextTitle}>
                        General Calendar
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.bar]} />

                {/* activity history section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>Activity History</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '10%' }}>
                      <MIcon
                        name="lightbulb"
                        size={25}
                        color={COLORS.iconColor}
                      />
                    </View>
                    <View>
                      <Text style={styles.commonTextData}>
                        {
                          empDashboardData?.employeeDashboardViewModel
                            ?.serviceLength
                        }
                      </Text>
                      <Text style={styles.commonTextTitle}>
                        Length of Service
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.borderBottomWidth,
                      { marginTop: 10, marginBottom: 10 },
                    ]}
                  />
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '10%' }}>
                      <MIcon name="today" size={25} color={COLORS.iconColor} />
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <View>
                        <Text style={styles.commonTextData}>
                          {date_formater(
                            empDashboardData?.employeeDashboardViewModel
                              ?.joiningDate,
                          )}
                        </Text>
                        <Text style={styles.commonTextTitle}>Joining Date</Text>
                      </View>
                      <View
                        style={{
                          borderLeftWidth: 1,
                          borderLeftColor: COLORS.borderBottom,
                          marginHorizontal: 25,
                        }}
                      />
                      <View>
                        <Text style={styles.commonTextData}>
                          {empDashboardData?.employeeDashboardViewModel
                            ?.confirmationDate
                            ? date_formater(
                                empDashboardData?.employeeDashboardViewModel
                                  ?.confirmationDate,
                              )
                            : 'N/A'}
                        </Text>
                        <Text style={styles.commonTextTitle}>
                          Confirmation Date
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[styles.bar]} />

                {/* manager list section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>My Manager</Text>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '15%' }}>
                      {empDashboardData?.employeeDashboardViewModel
                        ?.intSupervisorImageUrlId ? (
                        <FastImage
                          source={{
                            uri: getImageURL(
                              empDashboardData?.employeeDashboardViewModel
                                ?.intSupervisorImageUrlId,
                            ),
                          }}
                          style={styles.managerImage}
                        />
                      ) : (
                        <FastImage
                          source={IMAGES.NoImage}
                          style={styles.managerImage}
                        />
                      )}
                    </View>
                    <View style={{ width: '85%' }}>
                      <Text style={styles.managerTitle}>
                        {
                          empDashboardData?.employeeDashboardViewModel
                            ?.supervisor
                        }
                      </Text>
                      <Text style={styles.managerText}>Supervisor</Text>
                      <View
                        style={[
                          styles.borderBottomWidth,
                          { marginTop: 10, marginBottom: 10 },
                        ]}
                      />
                    </View>
                  </View>
                  {userInfo?.strUrl === arlURL ? (
                    <View />
                  ) : (
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ width: '15%' }}>
                        {empDashboardData?.employeeDashboardViewModel
                          ?.intDottedSupervisorImageUrlId ? (
                          <FastImage
                            source={{
                              uri: getImageURL(
                                empDashboardData?.employeeDashboardViewModel
                                  ?.intDottedSupervisorImageUrlId,
                              ),
                            }}
                            style={styles.managerImage}
                          />
                        ) : (
                          <FastImage
                            source={IMAGES.NoImage}
                            style={styles.managerImage}
                          />
                        )}
                      </View>
                      <View style={{ width: '85%' }}>
                        <Text style={styles.managerTitle}>
                          {
                            empDashboardData?.employeeDashboardViewModel
                              ?.dottedSupervisor
                          }
                        </Text>
                        <Text style={styles.managerText}>
                          Dotted Supervisor
                        </Text>
                        <View
                          style={[
                            styles.borderBottomWidth,
                            { marginTop: 10, marginBottom: 10 },
                          ]}
                        />
                      </View>
                    </View>
                  )}
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ width: '15%' }}>
                      {empDashboardData?.employeeDashboardViewModel
                        ?.intLineManagerImageUrlId ? (
                        <FastImage
                          source={{
                            uri: getImageURL(
                              empDashboardData?.employeeDashboardViewModel
                                ?.intLineManagerImageUrlId,
                            ),
                          }}
                          style={styles.managerImage}
                        />
                      ) : (
                        <FastImage
                          source={IMAGES.NoImage}
                          style={styles.managerImage}
                        />
                      )}
                    </View>
                    <View style={{ width: '85%' }}>
                      <Text style={styles.managerTitle}>
                        {
                          empDashboardData?.employeeDashboardViewModel
                            ?.lineManager
                        }
                      </Text>
                      <Text style={styles.managerText}>Line Manager</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.bar]} />

                {/* notice board section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>Notice Board</Text>
                  {allNoticeBoard && allNoticeBoard?.length > 0 ? (
                    <>
                      {allNoticeBoard?.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() =>
                            //@ts-ignore
                            navigation.navigate('NoticeDetails', {
                              item: item,
                            })
                          }
                        >
                          <View style={{ flexDirection: 'row' }}>
                            <FastImage
                              source={IMAGES.NoticeImage}
                              style={{ width: 30, height: 30, marginRight: 12 }}
                            />
                            <View style={{ width: '88%' }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  lineHeight: 20,
                                  color: COLORS.textNewColor,
                                }}
                              >
                                {item?.strTitle}
                              </Text>
                              <Text style={styles.noticeSubText}>
                                {date_formater(item?.dteCreatedAt)}
                              </Text>
                              <View
                                style={[
                                  styles.borderBottomWidth,
                                  { marginTop: 10, marginBottom: 10 },
                                ]}
                              />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </>
                  ) : (
                    <View style={{ alignSelf: 'center' }}>
                      <FastImage
                        source={IMAGES.NoDataImage}
                        style={{ width: 130, height: 90 }}
                      />
                      <Text style={styles.noDataText}>No data found</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.bar]} />

                {/* pending application section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>Pending Application</Text>
                  {allPendingApplicationData?.length > 0 ? (
                    <>
                      {allPendingApplicationData?.map(
                        (item: any, index: any) => (
                          <View
                            key={index}
                            style={{
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              borderColor: COLORS.lightGray7,
                              elevation: 3,
                              borderWidth: 1,
                              backgroundColor: COLORS.white,
                              marginVertical: 8,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  width: '75%',
                                }}
                              >
                                <View style={{ width: 45 }}>
                                  <MIcon
                                    name="pending-actions"
                                    size={30}
                                    color={COLORS.primary}
                                  />
                                </View>

                                <View style={{ width: '80%' }}>
                                  <Text
                                    style={{
                                      fontSize: 16,
                                      lineHeight: 20,
                                      color: COLORS.textNewColor,
                                    }}
                                  >
                                    {item?.applicationType}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.noticeSubText,
                                      {
                                        fontSize: 14,
                                      },
                                    ]}
                                  >
                                    {date_formater(item?.applicationDate)}
                                  </Text>
                                </View>
                              </View>

                              <View style={styles.statusPart}>
                                <Text
                                  style={[
                                    styles.status,
                                    {
                                      color: getStatusColor(
                                        item?.approvalStatus,
                                      ),
                                      backgroundColor: getStatusBgColor(
                                        item?.approvalStatus,
                                      ),
                                    },
                                  ]}
                                >
                                  {item?.approvalStatus}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ),
                      )}
                    </>
                  ) : (
                    <View style={{ alignSelf: 'center' }}>
                      <FastImage
                        source={IMAGES.NoDataImage}
                        style={{ width: 130, height: 90 }}
                      />
                      <Text style={styles.noDataText}>No data found</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.bar]} />

                {/* company policy section */}
                <View style={styles.containerMargin}>
                  <Text style={styles.myLeaveTitle}>Company Policy</Text>
                  {allPolicyList && allPolicyList?.length > 0 ? (
                    allPolicyList?.map((item, index) => (
                      <View key={index}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => {
                              const fileName =
                                item?.policyFileName?.toLowerCase() || '';
                              const isPdf = fileName.endsWith('.pdf') || false;
                              if (isPdf) {
                                navigation.navigate('PDFViewer', {
                                  fileId: item?.policyFileUrlId,
                                  fileName: item?.policyFileName,
                                });
                              } else {
                                navigation.navigate('IMGViewer', {
                                  fileId: item?.policyFileUrlId,
                                  fileName: item?.policyFileName,
                                });
                              }
                            }}
                            style={{
                              flexDirection: 'row',
                              width: '82%',
                            }}
                          >
                            <View style={{ width: '15%' }}>
                              <MIcon
                                name="assignment"
                                size={35}
                                color={COLORS.graySubText}
                              />
                            </View>

                            <View style={{ width: '100%' }}>
                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: 14,
                                  lineHeight: 20,
                                  color: COLORS.textNewColor,
                                }}
                              >
                                {item?.policyTitle}
                              </Text>

                              <Text
                                numberOfLines={1}
                                style={{
                                  fontSize: 14,
                                  lineHeight: 20,
                                  color: '#468EF2',
                                  textDecorationLine: 'underline',
                                }}
                              >
                                {item?.policyFileName}
                              </Text>

                              <View
                                style={[
                                  styles.borderBottomWidth,
                                  { marginTop: 12, marginBottom: 12 },
                                ]}
                              />
                            </View>
                          </TouchableOpacity>

                          <View style={styles.statusPart}>
                            <MIcon
                              name="chevron-right"
                              size={30}
                              color={COLORS.graySubText}
                            />
                          </View>
                        </View>
                      </View>
                    ))
                  ) : (
                    <View style={{ alignSelf: 'center' }}>
                      <FastImage
                        source={IMAGES.NoDataImage}
                        style={{ width: 130, height: 90 }}
                      />
                      <Text style={styles.noDataText}>No data found</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.bar]} />

                {/* payslip section */}
                <View style={{ flexDirection: 'row', paddingHorizontal: 16 }}>
                  <View style={styles.locationTime}>
                    <FastImage
                      source={IMAGES.PayslipImage}
                      style={{ width: 40, height: 40, alignSelf: 'center' }}
                    />
                  </View>
                  <View>
                    <Text style={styles.attendance}>My Payslip</Text>
                    <View style={styles.viewPayslip}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('PayslipDetails')}
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text style={styles.remotePunch}>View Payslip</Text>
                        <MIcon
                          name="arrow-forward"
                          size={25}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {tabName === 1 && <SupervisorDashboardMainIndex />}

            {tabName === 2 && <ManagerDashboardMainIndex />}
          </TouchableOpacity>
        </ScrollView>

        {/* <View
          style={{
            paddingBottom: 36,
          }}
        /> */}

        <RBSheet
          //@ts-ignore
          ref={refRBSheet}
          width={SIZES.width}
          height={SIZES.height / 2.5}
          duration={150}
          closeOnDragDown={true}
          animationType={'fade'}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            container: {
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: COLORS.white,
            },
          }}
        >
          <View style={styles.pHorizontal}>
            <View style={styles.sheetHeader}>
              <View />
              <TouchableOpacity
                onPress={() =>
                  // @ts-ignore
                  refRBSheet?.current?.close()
                }
              >
                <MIcon name="close" size={30} color={COLORS.transparentDark} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetFooter}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="agendaOfMeetMe"
                placeholder="Agenda Of Meet Me"
                label="Agenda Of Meet Me"
                rules={{ required: true }}
              />

              <View
                style={{
                  paddingTop: 16,
                }}
              >
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="schedule"
                  placeholder="Arrival Time"
                  label="Arrival Time"
                  rules={{ required: true }}
                />
              </View>

              <CustomButtonNew
                btnText="Send Meet Me"
                disabled={isDisable}
                onPress={handleSubmit(createMeetMeMsg)}
                style={styles.btn1}
                btnTextStyle={styles.btnText1}
              />
            </View>
          </View>
        </RBSheet>

        <RBSheet
          //@ts-ignore
          ref={refRBSheet1}
          width={SIZES.width}
          height={SIZES.height / 1.8}
          duration={150}
          closeOnDragDown={true}
          animationType={'fade'}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            container: {
              borderTopRightRadius: 24,
              borderTopLeftRadius: 24,
              backgroundColor: COLORS.white,
            },
          }}
        >
          <View style={styles.pHorizontal}>
            <View style={styles.sheetHeader}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '500',
                  color: COLORS.textNewColor,
                  paddingLeft: 8,
                  alignSelf: 'center',
                }}
              >
                Switch Board
              </Text>
              <TouchableOpacity
                onPress={() =>
                  // @ts-ignore
                  refRBSheet1?.current?.close()
                }
              >
                <MIcon name="close" size={30} color={COLORS.transparentDark} />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetFooter}>
              {switchBoardData?.length > 0 ? (
                <>
                  {switchBoardData?.map((item: any, index: number) => (
                    <>
                      {item?.strSwitchBoardLink ? (
                        <TouchableOpacity
                          onPress={() => {
                            //@ts-ignore
                            refRBSheet1?.current?.close();
                            Linking.openURL(item?.strSwitchBoardLink);
                          }}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            paddingVertical: 4,
                          }}
                        >
                          <MIcon
                            name="link"
                            size={25}
                            color={COLORS.blue}
                            style={{
                              transform: [{ rotate: '135deg' }],
                            }}
                          />
                          <Text
                            style={{
                              fontSize: 16,
                              fontWeight: '500',
                              color: COLORS.blue,
                              fontStyle: 'italic',
                              textDecorationLine: 'underline',
                              paddingLeft: 8,
                            }}
                          >
                            {item?.strSwitchBoardName}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </>
                  ))}
                </>
              ) : null}
            </View>
          </View>
        </RBSheet>
      </ContainerNew>
    );
  },
);

export default DashboardIndex;

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.white,
    flex: 1,
    zIndex: 0,
  },
  container: {
    // marginHorizontal: 10,
    marginBottom: 10,
  },
  headBox: {
    marginHorizontal: 16,
    marginTop: 16,
    borderColor: COLORS.white,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: -33,
  },
  touchCard: { padding: 16 },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 50,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardImageText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  cardText: { width: '80%', paddingHorizontal: 10 },
  name: {
    color: COLORS.textNewColor,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  cardCommonText: {
    color: COLORS.textNewColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bar: { height: 5, backgroundColor: COLORS.bar, marginVertical: 16 },
  leaveText: { fontSize: 14, lineHeight: 18, color: COLORS.textNewColor },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  myLeavesSection: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    borderRadius: 4,
    paddingVertical: 16,
  },
  myLeavesBox: {
    flexDirection: 'row',
    borderBottomColor: COLORS.borderBottom,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  containerMargin: { marginHorizontal: 16 },

  footerSection: { alignSelf: 'center', paddingTop: 18, paddingBottom: 2 },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingRight: 12,
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  commonTextData: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  commonTextTitle: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.graySubText,
  },
  commonTextTitle1: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.graySubText,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noticeSubText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  statusPart: {
    // width: '20%',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
    borderRadius: 100,
  },
  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  managerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  managerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  tabHead: {
    borderWidth: 1,
    borderColor: COLORS.white,
    width: 160,
    position: 'absolute',
    right: 0,
    backgroundColor: COLORS.white,
    elevation: 10,
    paddingVertical: 10,
    marginTop: 5,
    top: Platform.OS === 'ios' ? 45 : 45,
    borderRadius: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    zIndex: 99999,
  },
  dashMenu: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabName: { fontSize: 16, lineHeight: 25, color: COLORS.textNewColor },
  locationTime: {
    backgroundColor: COLORS.iconGrayBackground,
    width: 60,
    height: 60,
    justifyContent: 'center',
    borderRadius: 99,
    marginRight: 16,
  },
  remotePunch: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
    textAlign: 'center',
    paddingRight: 8,
  },
  attendance: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },

  viewPayslip: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    marginTop: 10,
  },

  empName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },

  cmnSubTitle: { flexDirection: 'row', alignItems: 'center' },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },

  imageSection: {
    width: '18%',
  },
  paddingTop: { paddingVertical: 3 },
  chatAndInfo: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  sheetFooter: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  pHorizontal: {
    paddingHorizontal: 16,
  },
  btn1: {
    alignSelf: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%',
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
});
