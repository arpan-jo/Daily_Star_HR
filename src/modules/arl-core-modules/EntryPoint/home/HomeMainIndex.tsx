import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  ImageBackground,
  Linking,
  Modal,
  NativeModules,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { Edge } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import FIcon from 'react-native-vector-icons/FontAwesome';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ViewShot from 'react-native-view-shot';
import { arlURL, erpiBOSURL } from '../../../../../App';
import {
  EmployeeDashboard,
  EmployeeInfoToLocationSync,
  EmployeeInOutTime,
  GetTodayInformation,
  SendContact,
  VehicleAssignAsDriver,
} from '../../../../common/api/api';
import AppUpdate from '../../../../common/components/AppUpdate';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomImageNew from '../../../../common/components/CustomImage';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTextNew from '../../../../common/components/CustomText';
import { useToast } from '../../../../common/components/CustomToast';
import CustomVisitingCard from '../../../../common/components/CustomVisitingCard';
import Row from '../../../../common/components/Row';
import { COLORS, IMAGES, SIZES } from '../../../../common/constant/Index';
import useThemeId from '../../../../hooks/useThemeId';
import { clearProfileCache } from '../../../../common/services/profileCache';
import { httpRequest } from '../../../../common/constant/httpRequest';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { clearAllStorage } from '../../../../common/services/clearStorage';
import { date_formater } from '../../../../common/services/dateFormater';
import { getImageURL } from '../../../../common/services/getImage';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { _todayDateTime } from '../../../../common/services/todayDate';
import {
  EmpDashboardDataType,
  ProfileDataType,
} from '../../../../interfaces/dashboard/employeeDashboard';
import { createMeetMe } from '../../../../services/SaaS-modules/contact/contact';
import {
  getAllNotificationCount,
  getEmployeeSelfDetails,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {
  GetFCMToken,
  notificationListeners,
  NotificationListner,
  openAppSettings,
} from '../../../../services/SaaS-modules/notification/notification';
import { refreshTokenApi } from '../../../../services/auth/login';
import { useRootStore } from '../../../../stores/rootStore';
import AttendanceCalendarIndex from '../../../SaaS-modules/attendance-calendar/AttendanceCalendar';
import EsgManagementMainIndex from '../../../SaaS-modules/dashboard/employeeDashboard/ESG-management/EsgManagementMainIndex';
import NotificationCounter from '../../../SaaS-modules/dashboard/employeeDashboard/NotificationCounter';
import InternalReferenceCard from '../../../SaaS-modules/dashboard/employeeDashboard/internal-reference-reward/InternalReferenceCard';

import AllApplicationArl from './AllApplicationArl';
import AllNoticeBoard from './AllNoticeBoard';
import AllPolicyList from './AllPolicyList';
import FavEmployee from './FavEmployee';
import GpsLocationLog from './GpsLocationLog';
import MyAllLeave from './MyAllLeave';
import MyManagerList from './MyManagerList';
import PendingApplication from './PendingApplication';
import { LocationPermission } from '../../../../common/constant/LocationPermission';

const { SecurityModule, MqttModule } = NativeModules || {};

const edges: Edge[] = ['right', 'left'];
const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
interface AttendanceRecord {
  workingPeriod: string;
  checkIn: string;
  checkOut: string | null;
}
const HomeMainIndex = () => {
  // The themed colours below are read at render time; a module-scope
  // StyleSheet.create captures them at import and would keep the old palette.
  useThemeId();
  const [modalShow, setModalShow] = useState(false);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const {
    userInfo,
    sbu,
    userInfoSave,
    clearSupplier,
    clearEmpList,
    clearSBU,
    clearProductItem,
    clearGRNProductWithRef,
    clearPreviousLocations,
    previousLocationList,
    addPreviousLocation,
    trackOnOrOfFunc,
    trackOnOrOf,
    cacheLocation,
    cacheLocationSave,
  } = useRootStore();
  const [deviceName, setDeviceName] = useState('');
  const [isScanShow, setIsScanShow] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState<AttendanceRecord>();
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
  const [_, setIsLoading] = useState(false);
  const [empDashboardData, setEmpDashboardData] =
    useState<EmpDashboardDataType>();
  const [notificationCounter, setNorificationCounter] = useState<number>(0);
  const toaster = useToast();
  const [switchBoardData, setSwitchBoardData] = useState<any>();

  const [empId, _setEmpId] = useState();
  const [isDisable, setIsDisable] = useState(false);
  const currentTime = dayjs().format('h:mm A');
  const [profileInfo, setProfileInfo] = useState<any>('');
  const [resURL, setResURL] = useState<any>();
  const [locationConfig, setLocationConfig] = useState<any>();
  const [vCardData, setVCardData] = useState<any>();
  const [resURL2, setResURL2] = useState<any>('');
  const [todayInfoData, setTodayInfoData] = useState<any>();
  const [activeCardTab, setActiveCardTab] = useState<'ID' | 'B' | 'V'>('ID');
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isDriver, setIsDriver] = useState(false);
  const phoneNumber =
    profileData?.employeeProfileLandingView?.strOfficeMobile ||
    profileData?.employeeProfileLandingView?.strPersonalMobile;
  const emailAdrress =
    profileData?.employeeProfileLandingView?.strOfficeMail ||
    profileData?.employeeProfileLandingView?.strPersonalMail;
  const strDesignation =
    profileData?.employeeProfileLandingView?.strDesignation ||
    userInfo?.strDesignation;

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      agendaOfMeetMe: 'Come to meet me now',
      schedule: currentTime?.toString(),
    },
  });
  const nums = new Set();
  while (nums.size !== 6) {
    nums.add(Math.floor(Math.random() * 10) + 1);
  }
  const secure = () => {
    SecurityModule?.enableSecureFlag();
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (userInfo?.extensionNumber) {
        await AsyncStorage.setItem(
          'extensionNumber',
          `${userInfo?.extensionNumber}`,
        );
      }

      const profileRes = await getEmployeeSelfDetails(
        userInfo?.intEmployeeId,
        setIsLoading,
      );
      setProfileData(profileRes);

      sbu?.businessUnitId && clearSBU();
      clearSupplier();
      clearEmpList();
      clearProductItem();
      clearGRNProductWithRef();
      //  if(Platform.OS === 'android' ){
      GetFCMToken(userInfo?.intEmployeeId);
      await NotificationListner(navigation);
      await notificationListeners();
      // await requestUserPermission();

      //  }
      importantApiCall();

      const api_params = {
        url: VehicleAssignAsDriver,
        data: {
          UserId: userInfo?.intErpUserId || 0,
          EmployeeId: userInfo?.intEmployeeId || 0,
        },
        baseURL: erpiBOSURL,
      };
      const res = await httpRequest(api_params, setIsLoading);
      if (res?.trim() === 'Driver') {
        setIsDriver(true);
        await connectForeground();
        if (trackOnOrOf?.isDriverOnRunning) {
          await startService();
          const dataForDriver = {
            employeeId: userInfo?.intEmployeeId,
            createDateTime: _todayDateTime(),
            vehicleId: trackOnOrOf?.vehicleId,
            driverId: trackOnOrOf?.driverId,
            tripId: trackOnOrOf?.tripId,
            isVehicle: true,
          };
          if (MqttModule) {
            MqttModule.publish(
              'iboslimitedvehicle',
              JSON.stringify(dataForDriver),
            )
              .then(() =>
                console.log('📤 Message sent:', JSON.stringify(dataForDriver)),
              )
              .catch(console.error);
          }
        }
      } else {
        setIsDriver(false);
      }
    },
    [isFocused, trackOnOrOf?.isTrackOn],
  );

  const connectForeground = async () => {
    const hasPermission = await LocationPermission();
    if (!hasPermission) return;
    if (!MqttModule) {
      console.log('MqttModule is not available');
      return;
    }
    MqttModule.connect()
      .then(() => {
        MqttModule.subscribe('iboslimitedvehicle', 1);
      })
      .catch(console.error);
  };

  const startService = async (): Promise<boolean> => {
    try {
      if (!MqttModule) {
        console.log('MqttModule is not available');
        return false;
      }
      await MqttModule.startService();
      console.log('🚀 MQTT Service started');
      return true;
    } catch (err) {
      console.error('❌ Failed to start service:', err);
      return false;
    }
  };

  const hanleRefresh = async () => {
    // The profile is served from cache now; a refresh that did not drop it
    // would silently return the same data.
    clearProfileCache(userInfo?.intEmployeeId);
    setRefreshing(true);
    wait(500).then(async () => {
      await importantApiCall();
      setRefreshing(false);
    });
  };

  const importantApiCall = async () => {
    const api_paramss = {
      url: EmployeeDashboard,
      data: {
        EmployeeId: userInfo?.intEmployeeId,
        BusinessUnitId: userInfo?.intBusinessUnitId,
      },
    };
    const empDashDatas = await httpRequest(api_paramss, setIsLoading);
    setEmpDashboardData(empDashDatas);

    const api_paramsForLocationConfig = {
      url: EmployeeInfoToLocationSync,
      data: { employeeId: userInfo?.intEmployeeId },
    };
    const resForLocationConfig = await httpRequest(
      api_paramsForLocationConfig,
      () => {},
    );
    setLocationConfig(resForLocationConfig);

    const api_paramsss = {
      url: GetTodayInformation,
      data: { employeeId: userInfo?.intEmployeeId },
    };
    const todayInfoRes = await httpRequest(api_paramsss, () => {});
    setTodayInfoData(todayInfoRes);

    const notiCount = await getAllNotificationCount(
      userInfo?.intEmployeeId,
      userInfo?.intAccountId,
    );
    if (notiCount) {
      setNorificationCounter(notiCount);
    } else {
      setNorificationCounter(0);
    }

    const api_params = {
      url: SendContact,
      data: { employee: userInfo?.intEmployeeId },
    };
    const res = await httpRequest(api_params, () => {});

    setResURL(res);

    if (empDashDatas === 401) {
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
        setRefreshing(false);
        if (userInfo?.intUserTypeId === 1) {
          //@ts-ignore
          navigation.replace('ArlDrawer');
        } else if (userInfo?.intUserTypeId === 2) {
          //@ts-ignore
          navigation.replace('SupDrawer');
        }
      } else {
        clearAllStorage();
        navigation.navigate('Login');
      }
    }
    const profileRes = await getEmployeeSelfDetails(
      userInfo?.intEmployeeId,
      setIsLoading,
    );
    setProfileInfo(profileRes);
    const api_paramsForInTimeOutTime = {
      url: EmployeeInOutTime,
      data: { EmployeeId: userInfo?.intEmployeeId },
      // isConsole: true,
      // isConsoleParams: true,
      // isEncrypted: true,
    };
    const resForInOut = await httpRequest(api_paramsForInTimeOutTime, () => {});
    setAttendanceRecord(resForInOut);
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
      apiCall={importantApiCall}
      edges={edges}
      refreshing={refreshing}
      setRefresh={setRefreshing}
      onRefresh={hanleRefresh}
      header={
        <CustomHeader
          elevation={false}
          components={
            <NotificationCounter
              notificationCounter={notificationCounter}
              setNorificationCounter={setNorificationCounter}
            />
          }
          isSupport
          supportIconPress={() =>
            Linking.openURL('https://forms.gle/Cruy4CLDjWKfcphv9')
          }
          alterIcon={'contacts-outline'}
          alterIconPress={() => {
            navigation.navigate('EmployeeDirectoryNew');
          }}
          callIconPress={() => {
            navigation.navigate('PrejoinScreen');
          }}
          title="PeopleDesk"
        />
      }
      style={styles.container}
    >
      {userInfo?.strUrl === arlURL ? <AppUpdate /> : null}
      {/* <LoadingContainer isLoading={isLoading} /> */}

      <Column colWidth={'100%'}>
        {empDashboardData?.employeeDashboardViewModel?.employeeName ? (
          <>
            {!isScanShow ? (
              <Row direction="row" rowStyle={styles.mainRow}>
                <Row
                  align="center"
                  rowStyle={styles.paddingHorizontalAndVertical}
                >
                  <Column colWidth="15%">
                    <FastImage
                      source={
                        empDashboardData?.employeeDashboardViewModel
                          ?.employeeProfileUrlId
                          ? {
                              uri: getImageURL(
                                empDashboardData?.employeeDashboardViewModel
                                  ?.employeeProfileUrlId,
                              ),
                            }
                          : IMAGES.NoImage
                      }
                      style={styles.profileImage}
                    />

                    <Column
                      isPressOn={false}
                      onCardPress={() => {
                        // shareVcard()
                        setModalShow(true);
                      }}
                      style={{
                        alignSelf: 'center',
                        paddingTop: 5,
                      }}
                    >
                      <FIcon
                        name="vcard-o"
                        color={COLORS.primary}
                        size={22}
                        style={{
                          fontWeight: '600',
                        }}
                      />
                    </Column>
                  </Column>
                  <Column
                    colWidth="85%"
                    colStyle={styles.topBottomTextContainer}
                  >
                    <Column colWidth="95%">
                      <CustomTextNew
                        text={
                          empDashboardData?.employeeDashboardViewModel
                            ?.employeeName || ''
                        }
                        txtStyle={styles.mainTxt}
                      />
                      <Row justify="space-between" align="center">
                        <Row rowWidth="75%">
                          <CustomTextNew
                            text={
                              empDashboardData?.employeeDashboardViewModel
                                ?.designationName || ''
                            }
                            subTxt
                          />
                        </Row>
                        <Column
                          isPressOn={false}
                          onCardPress={() => {
                            //@ts-ignore
                            navigation.navigate('EmpolyeeSelfDetails', {
                              empDashboardData,
                            });
                          }}
                          colStyle={styles.columnFlex}
                        >
                          <CustomTextNew
                            text="Details"
                            txtColor={COLORS.primary}
                          />
                          <MIcon
                            name="arrow-forward-ios"
                            color={COLORS.primary}
                            size={17}
                            style={{ marginLeft: 8 }}
                          />
                        </Column>
                      </Row>
                      <Row>
                        <CustomTextNew
                          text={
                            empDashboardData?.employeeDashboardViewModel
                              ?.employmentType
                              ? empDashboardData?.employeeDashboardViewModel
                                  ?.employmentType + ','
                              : ''
                          }
                          subTxt
                        />
                        <CustomTextNew
                          text={
                            empDashboardData?.employeeDashboardViewModel?.employeeId?.toString() ||
                            ''
                          }
                          subTxt
                          padLeft={6}
                        />
                      </Row>
                      <Row>
                        <CustomTextNew
                          padTop={4}
                          text={
                            empDashboardData?.employeeDashboardViewModel
                              ?.departmentName
                              ? empDashboardData?.employeeDashboardViewModel
                                  ?.departmentName
                              : ''
                          }
                          subTxt
                        />
                      </Row>
                    </Column>
                  </Column>
                </Row>

                {/*=============== updated gps code==============  */}
                {isDriver || Platform.OS === 'ios' ? null : (
                  <GpsLocationLog
                    locationConfig={locationConfig}
                    clearPreviousLocations={clearPreviousLocations}
                    previousLocationList={previousLocationList}
                    addPreviousLocation={addPreviousLocation}
                    trackOnOrOfFunc={trackOnOrOfFunc}
                    trackOnOrOf={trackOnOrOf}
                    userInfo={userInfo}
                    cacheLocation={cacheLocation}
                    cacheLocationSave={cacheLocationSave}
                  />
                )}
              </Row>
            ) : null}
          </>
        ) : (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        )}
        {/* <HomeScreenLiveKit /> */}
        <Row rowWidth="100%" style={styles.dividerStyle} />
        {/* {userInfo?.intBusinessUnitId === 136 ? (
          <>
            {!isScanShow ? (
              <Column colWidth={'100%'}>
                <Row direction="row" rowStyle={styles.mainRow}>
                  <Row
                    align="center"
                    rowStyle={styles.paddingHorizontalAndVertical}>
                    <Column colWidth="15%">
                      <MaterialCommunityIcons
                        name="hand-heart-outline"
                        color={COLORS.primary}
                        size={48}
                      />
                    </Column>
                    <Column colWidth="85%">
                       {Platform?.OS === 'android' ? <GoogleFitComponent /> : null}
                    </Column>
                  </Row>
                </Row>
              </Column>
            ) : null}
            <Row rowWidth="100%" style={styles.dividerStyle} />
          </>
        ) : null} */}

        {!isScanShow ? (
          <AttendanceCalendarIndex allDayDetials={undefined} />
        ) : null}

        {!isScanShow ? (
          <Column colStyle={styles.officeTimeCon}>
            <CustomTextNew
              txtSize={16}
              lineHight={24}
              txtWeight={'500'}
              text="Today Office Time Log"
            />

            <Column>
              <CustomTextNew
                txtSize={12}
                lineHight={16}
                txtWeight={'400'}
                padTop={4}
                text={`In/Out records and attendance hours. Your official time policy is In-Time ${
                  empDashboardData?.employeeDashboardViewModel
                    ?.calendarStartTime &&
                  timeFormaterToPmAm(
                    empDashboardData?.employeeDashboardViewModel
                      ?.calendarStartTime,
                  )
                } and Out-time ${
                  empDashboardData?.employeeDashboardViewModel
                    ?.calendarEndTime &&
                  timeFormaterToPmAm(
                    empDashboardData?.employeeDashboardViewModel
                      ?.calendarEndTime,
                  )
                }`}
              />
            </Column>

            <Row justify="space-between" rowStyle={styles.mTop18}>
              <Row rowWidth={'45%'}>
                <Row
                  align="center"
                  justify="center"
                  rowStyle={[
                    styles.hoursBox,
                    { backgroundColor: COLORS.primary },
                  ]}
                >
                  {/* updated api bind provide by hussain bhai  */}
                  {attendanceRecord?.workingPeriod ? (
                    <CustomTextNew
                      txtSize={18}
                      lineHight={25}
                      txtColor={COLORS.white}
                      txtWeight={'600'}
                      text={attendanceRecord?.workingPeriod || ''}
                    />
                  ) : (
                    <>
                      <CustomTextNew
                        txtSize={18}
                        lineHight={25}
                        txtColor={COLORS.white}
                        txtWeight={'600'}
                        text="00"
                      />
                      <CustomTextNew
                        txtSize={12}
                        lineHight={12}
                        txtColor={COLORS.white}
                        txtWeight={'400'}
                        text="Hrs,"
                        padTop={12}
                        padLeft={4}
                      />
                      <CustomTextNew
                        txtSize={18}
                        lineHight={25}
                        txtColor={COLORS.white}
                        txtWeight={'600'}
                        text="00"
                        padLeft={4}
                      />
                      <CustomTextNew
                        txtSize={12}
                        lineHight={12}
                        txtColor={COLORS.white}
                        txtWeight={'400'}
                        text="Min"
                        padTop={12}
                        padLeft={4}
                      />
                    </>
                  )}
                </Row>
              </Row>
              <Row rowStyle={styles.barStyle} rowWidth={'.5%'} />

              <Row
                rowStyle={styles.pRight8}
                justify="space-between"
                align="center"
                rowWidth={'45%'}
              >
                <Column>
                  <CustomTextNew
                    txtSize={14}
                    lineHight={24}
                    txtWeight={'500'}
                    text={
                      (attendanceRecord?.checkIn &&
                        timeFormaterToPmAm(attendanceRecord?.checkIn)) ||
                      '--:--'
                    }
                  />
                  <CustomTextNew
                    subTxt
                    txtSize={12}
                    lineHight={16}
                    txtWeight={'400'}
                    text="In-Time"
                  />
                </Column>

                <Column>
                  <CustomTextNew
                    txtSize={14}
                    lineHight={24}
                    txtWeight={'500'}
                    text={
                      (attendanceRecord?.checkOut &&
                        timeFormaterToPmAm(attendanceRecord?.checkOut)) ||
                      '--:--'
                    }
                  />
                  <CustomTextNew
                    subTxt
                    txtSize={12}
                    lineHight={16}
                    txtWeight={'400'}
                    text="Out-Time"
                  />
                </Column>
              </Row>
            </Row>
          </Column>
        ) : null}

        <Row rowWidth="100%" style={styles.smallBar} />

        {!isScanShow ? (
          <View style={styles.footerSection}>
            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                navigation.navigate('AttendanceLog', {});
              }}
              style={styles.footerButton}
            >
              <Text style={styles.footerText}> View All Logs </Text>
              <MIcon name="chevron-right" size={20} color={'#667085'} />
            </TouchableOpacity>
          </View>
        ) : null}

        <Row rowWidth="100%" style={styles.dividerStyle} />

        {!isScanShow ? <AllApplicationArl /> : null}

        <Row rowWidth="100%" style={styles.dividerStyle} />

        <Row rowWidth="100%" style={styles.dividerStyle} />
        {userInfo?.strUrl === arlURL ? (
          <>
            <Row rowWidth="100%" style={styles.dividerStyle} />

            {!isScanShow ? <InternalReferenceCard /> : null}

            <Row rowWidth="100%" style={styles.dividerStyle} />

            <Row rowWidth="100%" style={styles.dividerStyle} />
            {!isScanShow ? <EsgManagementMainIndex /> : null}
            <Row rowWidth="100%" style={styles.dividerStyle} />
            {/* Employee management */}
            {userInfo?.isSupNLMORManagement && !isScanShow ? (
              <View style={{ paddingHorizontal: 16 }}>
                <Text style={styles.myLeaveTitle}>Employee Management</Text>
                <Text style={styles.leaveText}>
                  Happy employees, thriving company: Mastering employee
                  management.
                </Text>

                <TouchableOpacity
                  onPress={() => navigation.navigate('EmpMangement')}
                  activeOpacity={0.6}
                  style={[
                    {
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: COLORS.primary,
                      paddingVertical: 10,
                      paddingHorizontal: 16,
                      borderRadius: 100,
                      width: '40%',
                    },
                  ]}
                >
                  <Text
                    style={[
                      {
                        color: COLORS.primary,
                        fontSize: 14,
                        fontWeight: '500',
                      },
                    ]}
                  >
                    {' '}
                    Get Started{' '}
                  </Text>
                  <MIcon
                    name="arrow-right-alt"
                    color={COLORS.primary}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </>
        ) : null}
        <Row rowWidth="100%" style={styles.dividerStyle} />

        {!isScanShow ? (
          <View style={styles.cultureSection}>
            <View style={styles.rowSpaceBetween}>
              <View style={styles.w75}>
                <Text style={styles.cultureTitle}> Culture </Text>
                <Text style={styles.cultureSubTitle}>
                  Make a messages meaningful & measurable, recognition in fuels
                  performance and provides valuable.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('CultureMainIndex')}
                  activeOpacity={0.6}
                  style={styles.getStartedButton}
                >
                  <Text style={styles.getStartedText}> Get Started </Text>
                  <MIcon
                    name="arrow-right-alt"
                    color={COLORS.white}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.pT16}>
                <FastImage
                  source={IMAGES.RewardImage}
                  style={styles.rewardImage}
                />
              </View>
            </View>
          </View>
        ) : null}

        {/*================= share market section start here ================= */}

        <Row rowWidth="100%" style={styles.dividerStyle} />
        <View style={[styles.cultureSection, { backgroundColor: '#0e7490' }]}>
          <View style={styles.rowSpaceBetween}>
            <View style={styles.w75}>
              <Text style={styles.cultureTitle}> Private Share Exchange </Text>
              <Text style={styles.cultureSubTitle}>
                Investing in Company share, grow with your company.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('ShareExchangeMainIndex')}
                activeOpacity={0.6}
                style={[styles.getStartedButton, { width: '60%' }]}
              >
                <Text style={styles.getStartedText}>Buy/Sell Share</Text>
                <MIcon name="arrow-right-alt" color={COLORS.white} size={25} />
              </TouchableOpacity>
            </View>
            <View style={styles.pT16}>
              <MIcon name="currency-exchange" size={55} color={COLORS.white} />
            </View>
          </View>
        </View>
        {/*================= share market section end here ================= */}
        <View style={[styles.bar, { marginTop: 0 }]} />

        {/*  My Leaves */}

        {!isScanShow ? (
          <MyAllLeave empDashboardData={empDashboardData} />
        ) : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* Favourite Emp details */}

        {!isScanShow ? (
          <FavEmployee
            resURL2={resURL2}
            setSwitchBoardData={setSwitchBoardData}
            setVCardData={setVCardData}
          />
        ) : null}

        {/* time calendar section */}
        {!isScanShow ? (
          <View style={styles.containerMargin}>
            <Text style={styles.myLeaveTitle}> Time Calendar </Text>
            <View style={styles.fDRow}>
              <View style={styles.w10}>
                <MIcon name="watch-later" size={25} color={COLORS.iconColor} />
              </View>
              <View>
                <Text style={styles.commonTextData}>
                  {todayInfoData?.workingPeriod || 'N/A'}
                </Text>
                <Text style={styles.commonTextTitle}>
                  {' '}
                  Today Working Period{' '}
                </Text>
              </View>
            </View>
            <View style={[styles.borderBottomWidth, styles.mVertical10]} />
            <View style={styles.fDRow}>
              <View style={styles.w10}>
                <MIcon
                  name="hourglass-bottom"
                  size={25}
                  color={COLORS.iconColor}
                />
              </View>
              <View>
                <Text style={styles.commonTextData}>
                  {`${
                    timeFormaterToPmAm(todayInfoData?.calendarStartTime) || ''
                  } - ${
                    timeFormaterToPmAm(todayInfoData?.calendarEndTime) || ''
                  }`}
                </Text>
                <Text style={styles.commonTextTitle}> General Calendar </Text>
              </View>
            </View>
          </View>
        ) : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* activity history section */}

        {!isScanShow ? (
          <View style={styles.containerMargin}>
            <Text style={styles.myLeaveTitle}> Activity History </Text>
            <View style={styles.fDRow}>
              <View style={styles.w10}>
                <MIcon name="lightbulb" size={25} color={COLORS.iconColor} />
              </View>
              <View>
                <Text style={styles.commonTextData}>
                  {empDashboardData?.employeeDashboardViewModel?.serviceLength}
                </Text>
                <Text style={styles.commonTextTitle}> Length of Service </Text>
              </View>
            </View>
            <View style={[styles.borderBottomWidth, styles.mVertical10]} />
            <View style={styles.fDRow}>
              <View style={styles.w10}>
                <MIcon name="today" size={25} color={COLORS.iconColor} />
              </View>
              <View style={styles.fDRow}>
                <View>
                  <Text style={styles.commonTextData}>
                    {date_formater(
                      empDashboardData?.employeeDashboardViewModel?.joiningDate,
                    )}
                  </Text>
                  <Text style={styles.commonTextTitle}> Joining Date </Text>
                </View>
                <View style={styles.borderLeftWidth} />
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
                    {' '}
                    Confirmation Date{' '}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* manager list section */}
        {!isScanShow ? (
          <MyManagerList empDashboardData={empDashboardData} />
        ) : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* notice board section */}
        {!isScanShow ? <AllNoticeBoard /> : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* pending application section */}

        {!isScanShow ? <PendingApplication empDashboardData={null} /> : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* company policy section */}
        {!isScanShow ? <AllPolicyList /> : null}

        {!isScanShow ? <View style={[styles.bar]} /> : null}

        {/* payslip section */}

        {!isScanShow ? (
          <View style={styles.payslipCon}>
            <View style={styles.locationTime}>
              <FastImage
                source={IMAGES.PayslipImage}
                style={styles.payslipImg}
              />
            </View>
            <View>
              <Text style={styles.attendance}> My Payslip </Text>
              <View
                style={[styles.viewPayslip, { borderColor: COLORS.primary }]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('PayslipDetails')}
                  style={styles.rowCenter}
                >
                  <Text style={[styles.remotePunch, { color: COLORS.primary }]}>
                    {' '}
                    View Payslip{' '}
                  </Text>
                  <MIcon
                    name="arrow-forward"
                    size={25}
                    color={COLORS.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}

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

              <View style={styles.pT16}>
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
              <Text style={styles.switchBoardText}> Switch Board </Text>
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
                          style={styles.switchBoardLink}
                        >
                          <MIcon
                            name="link"
                            size={25}
                            color={COLORS.blue}
                            style={{
                              transform: [{ rotate: '135deg' }],
                            }}
                          />
                          <Text style={styles.switchBoardLinkText}>
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
      </Column>
    </ContainerNew>
  );
};

export default observer(HomeMainIndex);

const styles = StyleSheet.create({
  imgCon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalImg: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalView: {
    width: 300,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 16,
  },

  mainRow: {
    flexWrap: 'wrap',
    backgroundColor: COLORS.white,
    paddingBottom: 8,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    borderWidth: 1,
    borderColor: COLORS.white,
  },

  topBottomTextContainer: {
    paddingLeft: 16,
  },
  paddingHorizontalAndVertical: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  columnFlex: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingVertical: 4,
    alignItems: 'center',
  },
  mainTxt: {
    color: COLORS.textNewColor,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
  },

  footerSection: {
    alignSelf: 'center',
    paddingVertical: 18,
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
    color: COLORS.textGray,
    paddingRight: 12,
  },
  officeTimeCon: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  mTop18: {
    marginTop: 18,
  },
  hoursBox: {
    paddingVertical: 8,
    marginVertical: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  pRight8: {
    paddingRight: 8,
  },
  barStyle: {
    backgroundColor: COLORS.bar,
    marginHorizontal: 8,
  },
  smallBar: {
    backgroundColor: COLORS.bar,
    paddingVertical: 1,
  },
  dividerStyle: {
    backgroundColor: COLORS.bar,
    paddingVertical: 4,
  },
  cultureSection: {
    backgroundColor: '#12B76A',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  w75: {
    width: '75%',
  },
  cultureTitle: {
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  cultureSubTitle: {
    color: COLORS.white,
    fontSize: 14,
    paddingTop: 6,
  },
  getStartedButton: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    width: '55%',
  },
  getStartedText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    textAlign: 'center',
    paddingRight: 10,
  },
  pT16: {
    paddingTop: 16,
  },
  rewardImage: {
    width: 70,
    height: 70,
  },
  leaveText: {
    fontSize: 14,
    lineHeight: 18,

    color: COLORS.textNewColor,
  },
  leaveText1: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
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
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
    marginTop: 4,
  },
  leaveType: {
    width: '40%',
    paddingLeft: 16,
  },

  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },

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

  empName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },

  cmnSubTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commonTextTitle1: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.graySubText,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  bar: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 16,
  },
  rowW90: {
    flexDirection: 'row',
    width: '90%',
  },
  width82: {
    width: '82%',
  },
  empNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
    width: '100%',
    flexWrap: 'wrap',
  },
  callIcon: {
    padding: 8,
  },
  scrollStyle: {
    flexDirection: 'row',
    paddingLeft: '4%',
    paddingBottom: 10,
    paddingTop: 4,
  },
  notificationStyle: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mLeft12: {
    marginLeft: 12,
  },
  width100: {
    width: 100,
  },
  switchBoardText: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingLeft: 8,
    alignSelf: 'center',
  },
  pRight16: {
    paddingRight: 16,
  },
  fDRow: {
    flexDirection: 'row',
  },
  pVartical2: {
    paddingVertical: 2,
  },
  switchBoardLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  switchBoardLinkText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blue,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    paddingLeft: 8,
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

  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  borderLeftWidth: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderBottom,
    marginHorizontal: 25,
  },
  w10: {
    width: '10%',
  },
  mVertical10: {
    marginVertical: 10,
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
  w85: {
    width: '85%',
  },
  w88: {
    width: '88%',
  },
  w15: {
    width: '15%',
  },
  noticeImageStyle: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  alignSelfCenter: {
    alignSelf: 'center',
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
  fastImageStyle: {
    width: 130,
    height: 90,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    overflow: 'hidden',
    textAlign: 'center',
    borderRadius: 100,
  },
  pendingApplicationContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderColor: COLORS.lightGray7,
    elevation: 3,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    marginVertical: 8,
  },
  pendingApplicationSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  width45: {
    width: 45,
  },
  applicationCon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '75%',
  },
  applicationTitle: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  applicationDate: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  policyTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  policyFileTxt: {
    fontSize: 14,
    lineHeight: 20,
    color: '#468EF2',
    textDecorationLine: 'underline',
  },
  policyView: {
    flexDirection: 'row',
    width: '82%',
  },
  width100p: {
    width: '100%',
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
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  payslipImg: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  payslipCon: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginVertical: 10,
    // backgroundColor: '#2E3192',
    // borderWidth: 1,

    height: 400,
    width: 300,
    alignSelf: 'center',
  },
  topContainer: {
    backgroundColor: '#2E3192',
    flex: 1,
    // padding: 5,
  },

  titleTxt: {
    color: 'blue',
    fontSize: 15,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 1,
  },
  profileImage2: {
    height: '80%',
    width: '100%',
    alignSelf: 'center',

    marginBottom: 30,
  },
  imgContainer: {
    flex: 1,
    width: 230,
    // backgroundColor: 'blue',
    alignSelf: 'center',
    marginTop: 30,
    justifyContent: 'flex-end',
  },
  content: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    // backgroundColor: 'blue',
    width: '100%',
    paddingVertical: 10,
    zIndex: 9999,
  },
  content2: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',

    width: '100%',
    height: 110,
    // opacity: 0.2,
    paddingVertical: 10,
  },
  nameTxt: {
    color: COLORS.white,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 20,
  },
  idParentContainer: {
    padding: 20,
    paddingTop: 35,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dynamicContent: {
    position: 'absolute',
    left: 40,
    bottom: 20,
  },
  qr: {
    position: 'absolute',
    right: 60,
    top: 40,
  },
  titleTxt2: {
    flex: 0.43,
    color: COLORS.black,
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
  },
  designationTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.graySubText,
    lineHeight: 20,
    fontFamily: 'DIN_Medium',
  },
  numTxt: {
    fontSize: 11.3,
    fontWeight: '500',
    color: COLORS.black,
    fontFamily: 'DIN_Medium',
    lineHeight: 20,
  },

  tabButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#007BFF',
  },
  tabText: {
    color: '#333',
    fontSize: 13,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
