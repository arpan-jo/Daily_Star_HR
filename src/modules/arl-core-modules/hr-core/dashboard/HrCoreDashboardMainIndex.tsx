/* eslint-disable react-native/no-inline-styles */

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Linking,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  default as Icon,
  default as MIcon,
} from 'react-native-vector-icons/MaterialIcons';
import { arlURL, rscURL } from '../../../../../App';
import { EmployeeDashboard } from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import { useToast } from '../../../../common/components/CustomToast';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { clearAllStorage } from '../../../../common/services/clearStorage';
import { date_formater } from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { getImageURL } from '../../../../common/services/getImage';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { _todayDateTime } from '../../../../common/services/todayDate';
import { EmployeeContactType } from '../../../../interfaces/contact/contact';
import {
  AllPolicyType,
  DashboardRolesEntity,
  EmpDashboardDataType,
  NoticeType,
} from '../../../../interfaces/dashboard/employeeDashboard';
import {
  createBookMarked,
  createMeetMe,
  createThumsDown,
  getContactLanding,
  getSwitchBoardData,
} from '../../../../services/SaaS-modules/contact/contact';
import {
  getAllAnnouncement,
  getAllNotificationCount,
  getAllPolicyList,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { getMenuPermissionAPI } from '../../../../services/SaaS-modules/drawer/drawer';
import {
  GetFCMToken,
  NotificationListner,
  createFCMToken,
  deleteDeviceIdForMultipleId,
  getPushNotificationDeviceId,
  notificationListeners,
} from '../../../../services/SaaS-modules/notification/notification';
import { refreshTokenApi } from '../../../../services/auth/login';
import { useRootStore } from '../../../../stores/rootStore';
import AttendanceCalendarIndex from '../../../SaaS-modules/attendance-calendar/AttendanceCalendar';
import NotificationCounter from '../../../SaaS-modules/dashboard/employeeDashboard/NotificationCounter';
import ManagerDashboardMainIndex from '../../../SaaS-modules/dashboard/managerDashboard/ManagerDashboardMainIndex';
import SupervisorDashboardMainIndex from '../../../SaaS-modules/dashboard/supervisorDashboard/SupervisorDashboardMainIndex';
import AllApplicationArl from '../../EntryPoint/home/AllApplicationArl';
import {
  openMapLocation,
  toggleClickByIndex,
} from '../../../../common/constant/empdirectory';
import { useSignalRNotification } from '../../../../hooks/useSignalRconnection';

const edges: Edge[] = ['right', 'left'];
interface DashMenuType {
  isTrue: boolean;
  name: string;
}

const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const HrCoreDashboardMainIndex = () => {
  const { userInfo, userInfoSave, menuTabSave } = useRootStore();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const [tabName, setTabName] = useState(0);
  const [dashMenu, setDashMenu] = useState<DashMenuType[]>([]);
  const [isShow, setIsShow] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [empDashboardData, setEmpDashboardData] =
    useState<EmpDashboardDataType>();
  const [allNoticeBoard, setAllNoticeBoard] = useState<NoticeType[]>();
  const [allPolicyList, setAllPolicyList] = useState<AllPolicyType[]>();
  const [notificationCounter, setNorificationCounter] = useState<number>(0);
  const [isShowload, setIsShowLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const busId = userInfo?.intBusinessUnitId;
  const [switchBoardData, setSwitchBoardData] = useState();
  const [empId, setEmpId] = useState();
  const [isDisable, setIsDisable] = useState(false);
  // current Yaer
  let currentYear = _todayDateTime().getFullYear();
  const hour = dayjs().hour();
  const netInfo = useNetInfo();

  const dep =
    !empDashboardData?.employeeDashboardViewModel?.employeeId ||
    isFocused ||
    netInfo?.isConnected ||
    userInfo?.token;

  useEffect(() => {
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
      GetFCMToken(userInfo?.intEmployeeId);
      // Request permissions (required for iOS)
      // await notifee.requestPermission({
      //   badge: true,
      //   sound: true,
      // });
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
    ],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      await NotificationListner();
      await notificationListeners();
      GetFCMToken(userInfo?.intEmployeeId);
      await NotificationListner(navigation);
      const notiCount = await getAllNotificationCount(
        userInfo?.intEmployeeId,
        userInfo?.intAccountId,
      );
      if (notiCount) {
        setNorificationCounter(notiCount);
      }
    },
    [isFocused],
  );

  useSignalRNotification(userInfo, isFocused, setNorificationCounter);

  const menuPress = (index: number) => {
    setIsShow(!isShow);
    const modMenu = [...dashMenu];
    const dashboardMenu = modMenu?.map((item: any, ind: any) => {
      return {
        ...item,
        isTrue: ind === index ? true : false,
      };
    });
    setDashMenu(dashboardMenu);
    setTabName(index);
  };

  const onRefresh = () => {
    setIsShowLoad(false);
    setRefreshing(true);
    wait(500).then(async () => {
      importantApiCall();
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
      if (menuRes?.length > 0) {
        menuTabSave({
          isLoad: true,
        });
      }
      setRefreshing(false);
    });
    setIsShowLoad(true);
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
      url: EmployeeDashboard,
      data: {
        EmployeeId: userInfo?.intEmployeeId,
        BusinessUnitId: userInfo?.intBusinessUnitId,
      },
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
        //@ts-ignore
        const updtedLoginInfo = {
          ...userInfo,
          token: refreshRes?.accessToken,
          refreshToken: refreshRes?.refreshToken,
        };
        //@ts-ignore
        userInfoSave(updtedLoginInfo);

        const api_paramsss = {
          url: EmployeeDashboard,
          data: {
            EmployeeId: userInfo?.intEmployeeId,
            BusinessUnitId: userInfo?.intBusinessUnitId,
          },
        };
        const empDashDatas = await httpRequest(api_paramsss, setIsLoading);
        setEmpDashboardData(empDashDatas);
      } else {
        clearAllStorage();
        navigation.navigate('Login');
      }
    } else {
      setEmpDashboardData(empDashData);
      await manageDeviceFCMToken();
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
      const mn = empDashData?.employeeDashboardViewModel?.dashboardRoles?.map(
        (item: DashboardRolesEntity, index: number) => {
          return {
            isTrue: index === 0 ? true : false,
            name: item?.label,
          };
        },
      );
      setDashMenu(mn);
    }
  };

  const manageDeviceFCMToken = async () => {
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
      const modData = toggleClickByIndex(contactData, ind);
      setContactData(modData);
    }
  };

  const handleSwitchBoardData = async (empIdd: number) => {
    setSwitchBoardData([]);
    //@ts-ignore
    refRBSheet1?.current?.open();
    const res = await getSwitchBoardData(empIdd, setIsLoading);
    setSwitchBoardData(res);
  };

  const openMap = async (ad: any) => {
    await openMapLocation({ address: ad, toaster });
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
      toaster.show({ message: 'Message sent successfully.', type: 'success' });
    }
  };

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <>
          <TouchableOpacity activeOpacity={5} onPress={() => setIsShow(false)}>
            <CustomHeader
              coreModulesIcon={true}
              coreModulesIconPress={() => navigation.goBack()}
              isMoreIcon={dashMenu?.length > 1 ? true : false}
              moreIconPress={() => setIsShow(!isShow)}
              title="HR Core"
              isSupport
              supportIconPress={() =>
                Linking.openURL('https://forms.gle/Cruy4CLDjWKfcphv9')
              }
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
                  key={index}
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.yellow, COLORS.primary]}
          />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {isLoading && isShowload ? (
          <ActivityIndicator
            color={COLORS.primary}
            size={'small'}
            style={{
              position: 'absolute',
              zIndex: 999999,
              alignContent: 'center',
              alignSelf: 'center',
              backgroundColor: COLORS.white,
              borderWidth: 1,
              borderColor: COLORS.white,
              borderRadius: 100,
              padding: 10,
              justifyContent: 'center',
              elevation: 10,
              flex: 1,
            }}
          />
        ) : null}
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
                <AttendanceCalendarIndex
                  allDayDetials={
                    empDashboardData?.employeeDashboardViewModel
                      ?.attendanceSummaryViewModel
                  }
                />
                <View style={styles.footerSection}>
                  <TouchableOpacity
                    onPress={() => {
                      //@ts-ignore
                      navigation.navigate('AttendanceDetails', {
                        empDashboardData,
                      });
                    }}
                    style={styles.footerButton}
                  >
                    <Text style={styles.footerText}>View Details</Text>
                    <MIcon name="arrow-forward" size={20} color={'#667085'} />
                  </TouchableOpacity>
                </View>
              </>
              <View style={[styles.bar1]} />

              {/* applicaiton section */}
              <AllApplicationArl />
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
                  {/* <CafeteriaIndex /> */}
                  <View
                    style={[
                      styles.bar,
                      {
                        marginTop: 5,
                        marginVertical: 0,
                      },
                    ]}
                  />
                  <PerformanceMainIndex />

                  <View
                    style={[
                      styles.bar,
                      {
                        marginTop: 3,
                        marginVertical: 0,
                      },
                    ]}
                  />
                </>
              ) : null}

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
                      Make a messages meaningful & measurable, recognition in
                      fuels performance and provides valuable.
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('CultureMainIndex')}
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
              <View style={[styles.bar, { marginTop: 0 }]} />

              {/* Employee management */}
              {userInfo?.isSupNLMORManagement ? (
                <>
                  <View style={{ paddingHorizontal: 16 }}>
                    <Text style={styles.myLeaveTitle}>Employee Management</Text>
                    <Text style={styles.leaveText}>
                      Happy employees, thriving company: Mastering employee
                      management.
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('EmpMangement')}
                      activeOpacity={0.6}
                      style={{
                        marginTop: 8,
                        borderWidth: 1,
                        borderColor: COLORS.primary,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 100,
                        width: '45%',
                      }}
                    >
                      <Text
                        style={{
                          color: COLORS.primary,
                          fontSize: 14,
                          fontWeight: '600',
                          lineHeight: 20,
                          textAlign: 'center',
                          paddingRight: 10,
                        }}
                      >
                        Get Started
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.bar]} />
                </>
              ) : null}

              {/* leave balance section */}
              <View style={styles.containerMargin}>
                <Text style={styles.myLeaveTitle}>
                  My Leaves
                  {userInfo?.strUrl === rscURL && (
                    <Text style={styles.myLeaveTitle}> (Hourly)</Text>
                  )}
                </Text>
                <View style={styles.myLeavesSection}>
                  {empDashboardData?.employeeDashboardViewModel?.leaveBalanceHistoryList?.map(
                    (leaveHistory, index) => (
                      <View
                        key={index}
                        style={[
                          styles.myLeavesBox,
                          {
                            borderBottomWidth:
                              empDashboardData?.employeeDashboardViewModel
                                ?.leaveBalanceHistoryList &&
                              empDashboardData?.employeeDashboardViewModel
                                ?.leaveBalanceHistoryList?.length -
                                1 ===
                                index
                                ? 0
                                : 1,
                          },
                        ]}
                      >
                        <View style={{ width: '40%', paddingLeft: 16 }}>
                          <Text style={styles.leaveText}>
                            {leaveHistory?.leaveType}
                          </Text>
                        </View>
                        <Text style={styles.leaveText}>
                          {userInfo?.strUrl === rscURL ? (
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.remainingDaysForApp || 0}
                            </Text>
                          ) : (
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.remainingDays || 0}
                            </Text>
                          )}
                          {'  '}
                          Available
                        </Text>

                        <Text style={[styles.leaveText, { paddingRight: 16 }]}>
                          {userInfo?.strUrl === rscURL ? (
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.leaveTakenDaysForApp || 0}
                            </Text>
                          ) : (
                            <Text
                              style={[styles.leaveText, { fontWeight: '500' }]}
                            >
                              {leaveHistory?.leaveTakenDays || 0}
                            </Text>
                          )}
                          {'  '}
                          Taken
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
              <View style={[styles.bar]} />

              {/* Favourite Emp details */}
              {contactData && contactData?.length > 0 ? (
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
                                  navigation.navigate('CreateAppreciate', {
                                    empDetails: item,
                                  })
                                }
                                style={[styles.chatAndInfo, { marginLeft: 12 }]}
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
                                style={[styles.chatAndInfo, { marginLeft: 12 }]}
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
                                    Linking.openURL(`sms:${item?.Phone}?body=`);
                                  } else {
                                    toaster.show({
                                      message: 'Phone no is empty.',
                                      type: 'error',
                                    });
                                  }
                                }}
                                style={[styles.chatAndInfo, { marginLeft: 12 }]}
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
                                style={[styles.chatAndInfo, { marginLeft: 12 }]}
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
                      {
                        empDashboardData?.employeeDashboardViewModel
                          ?.workingPeriod
                      }
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
                        empDashboardData?.employeeDashboardViewModel
                          ?.calendarStartTime,
                      )} - ${timeFormaterToPmAm(
                        empDashboardData?.employeeDashboardViewModel
                          ?.calendarEndTime,
                      )}`}
                    </Text>
                    <Text style={styles.commonTextTitle}>General Calendar</Text>
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
              <View style={styles.bar} />

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
                      {empDashboardData?.employeeDashboardViewModel?.supervisor}
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
                      <Text style={styles.managerText}>Dotted Supervisor</Text>
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
              <View style={styles.bar} />

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
                {empDashboardData?.employeeDashboardViewModel
                  ?.applicationPendingViewModels &&
                empDashboardData?.employeeDashboardViewModel
                  ?.applicationPendingViewModels?.length > 0 ? (
                  <>
                    {empDashboardData?.employeeDashboardViewModel?.applicationPendingViewModels?.map(
                      (item, index) => (
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
                                    color: getStatusColor(item?.approvalStatus),
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
                <Text style={styles.myLeaveTitle}>Enterprise Library</Text>
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
                            navigation.navigate('PDFViewer', {
                              fileId: item?.policyFileUrlId,
                              fileName: item?.policyFileName,
                            });
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
                      onPress={() => {
                        userInfo?.strUrl === arlURL
                          ? navigation.navigate('PayslipDetailsArl')
                          : navigation.navigate('PayslipDetails');
                      }}
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

        <View
          style={{
            paddingBottom: 36,
          }}
        />
      </ScrollView>

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
              onBtnPress={handleSubmit(createMeetMeMsg)}
              btnstyle={styles.btn1}
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
};

export default HrCoreDashboardMainIndex;

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.white,
    flex: 1,
    zIndex: -1000,
  },
  container: {
    // marginHorizontal: 10,
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
  bar: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 16,
  },
  bar1: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  leaveText: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
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

  footerSection: {
    alignSelf: 'center',
    paddingTop: 18,
    paddingBottom: 2,
  },
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
  },
  dashMenu: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  tabName: {
    fontSize: 16,
    lineHeight: 25,
    color: COLORS.textNewColor,
  },
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
