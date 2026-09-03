import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import {
  GetMarketVisitingCompanyList,
  PeopleDeskAllLanding
} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import { useToast } from '../../../../common/components/CustomToast';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { getLatitudeLongitude } from '../../../../common/constant/latitudeLogitude';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { date_formater } from '../../../../common/services/dateFormater';
import { getImageURL } from '../../../../common/services/getImage';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import {
  AttendanceSetupType,
  PunchLandDataType
} from '../../../../interfaces/attendance/attendance';
import {
  attendanceStatus,
  getAttendanceSetup,
  uploadImageNewApi
} from '../../../../services/SaaS-modules/attendance/attendance';
import { useRootStore } from '../../../../stores/rootStore';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import { _todayDate } from '../../../../common/services/todayDate';
import { remoteAttendenceStyle } from '../remote-attendance/RemoteAttendanceMainIndex';

import { getLocationName } from '../../../../common/constant/GetLocationName';

const chkInClr = COLORS.statusBar;
const d = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const MarketVisitMainIndex = ({ route }: props) => {
  const employeeData = route?.params?.employeeData;
  const [companyDDL, setCompanyDDL] = useState<any>([]);
  const navigation = useNavigation();
  const { userInfo, cacheLocation, cacheLocationSave } = useRootStore();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const [location2, setLocation2] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceSetup, setAttendanceSetup] = useState<AttendanceSetupType>();
  const [locationPunchData, setLocationPunchData] =
    useState<PunchLandDataType[]>();
  const [isLoading2, setIsLoading2] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceUniqueId, setDeviceUniqueId] = useState('');
  const [attendanceSts, setAttendanceSts] = useState<any>();
  const [isTyping, setIsTyping] = useState(false);
  const { control, handleSubmit, setValue, reset, watch: _watch } = useForm({});
  const accountId =
    employeeData?.profileData?.employeeProfileLandingView?.intAccountId ||
    userInfo?.intAccountId;
  const _empName = employeeData?.EmployeeName || userInfo?.strDisplayName;
  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      setIsLoading2(false);
      DeviceInfo.getUniqueId().then(uniqueId => {
        setDeviceUniqueId(uniqueId);
      });

      DeviceInfo.getDeviceName().then(name => {
        setDeviceName(name);
      });
      getLatitudeLongitude(setLocation2);
      const payload = {
        // part-id 1 = status check, 2 = checkin-checkout
        partId: 1,
        accountId: accountId,
        employeeId: employeeId,
        //@ts-ignore
        longitude: location2?.longitude?.toString(),
        //@ts-ignore
        latitude: location2?.latitude?.toString(),
        realTimeImageId: 0,
        deviceId: attendanceSetup?.isDeviceRegNeed ? deviceUniqueId : '',
        deviceName: attendanceSetup?.isDeviceRegNeed ? deviceName : '',
        isMarket: true,
        visitingCompany: '',
        visitingLocation: '',
        remarks: '',
      };
      attdcBtn(payload, 1);
      const res = await getAttendanceSetup(
        accountId,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );
      setAttendanceSetup(res?.[0]);

      const api_params = {
        url: PeopleDeskAllLanding,
        data: {
          TableName: 'MarketAttendancePunchList',
          intId: employeeId,
          businessUnitId: userInfo?.intBusinessUnitId,
        },
      };
      const attDncePunch = await httpRequest(api_params, setIsLoading2);
      if (attDncePunch) {
        setLocationPunchData(attDncePunch);
        attdcBtn(payload, 1);
      }
      getCompanyList();
    },
    [userInfo, isFocused],
  );

  const getCompanyList = async () => {
    const api_params = {
      url: GetMarketVisitingCompanyList,
      data: {
        employeeId: employeeId,
        date: _todayDate(),
      },
    };
    const res = await httpRequest(api_params, () => { });
    if (res?.length > 0) {
      const finalData = [
        { label: 'Enter Company Name...', value: 'type' },
        ...res,
      ];
      setCompanyDDL(finalData);
    } else {
      const finalData = [{ label: 'Enter Company Name...', value: 'type' }];
      setCompanyDDL(finalData);
    }
  };

  const onSubmit = async (data: any) => {
    const companyName = isTyping ? data?.companyInput : data?.companyDDL?.label;
    const companyId = isTyping ? 0 : data?.companyDDL?.value;
    if (!companyName) {
      toaster.show({
        message: 'Please select or enter a company name.',
        type: 'warning',
      });
      return;
    }

    const payload = {
      // part-id 1 = status check
      partId: 1,
      accountId: accountId,
      employeeId: employeeId,
      //@ts-ignore
      longitude: location2?.longitude?.toString(),
      //@ts-ignore
      latitude: location2?.latitude?.toString(),
      realTimeImageId: 0,
      deviceId: attendanceSetup?.isDeviceRegNeed ? deviceUniqueId : '',
      deviceName: attendanceSetup?.isDeviceRegNeed ? deviceName : '',
      isMarket: true,
      visitingCompany: companyName || '',
      visitingCompanyId: companyId || 0,
      visitingLocation: data?.location,
      remarks: data?.remarks || '',
    };
    await remoteAttendence(payload);
    attdcBtn(payload, 1);
  };

  const attdcBtn = async (payloadd: any, partId?: number) => {
    getLatitudeLongitude(setLocation2);
    const payload = {
      // // part-id 1 = status check
      ...payloadd,
      partId: partId || 1,
    };
    const attDnce = await attendanceStatus(payload, setIsLoading, () => {
      reset();
      getLatitudeLongitude(setLocation2);
    });
    if (partId) {
      if (attDnce?.statusCode === 500) {
        toaster.show({ message: attDnce?.message, type: 'error' });
      }
    }
    if (attDnce?.statusCode === 200) {
      const api_params = {
        url: PeopleDeskAllLanding,
        data: {
          TableName: 'MarketAttendancePunchList',
          intId: employeeId,
          businessUnitId: userInfo?.intBusinessUnitId,
        },
      };
      const attDncePunch = await httpRequest(api_params, setIsLoading2);
      if (attDncePunch) {
        setLocationPunchData(attDncePunch);
      }
      setAttendanceSts(attDnce);
    }
  };

  const remoteAttendence = async (payload: any) => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'Make sure your app has approved Location permission.',
      );
      return;
    }
    if (attendanceSetup?.isRealTimeImageNeed) {
      getLatitudeLongitude(setLocation2);
      handleUploadProfileImage(payload);
    } else {
      getLatitudeLongitude(setLocation2);
      // 2 for check-in-out
      attdcBtn(payload, 2);
      const api_params = {
        url: PeopleDeskAllLanding,
        data: {
          TableName: 'MarketAttendancePunchList',
          intId: employeeId,
          businessUnitId: userInfo?.intBusinessUnitId,
        },
      };
      const attDncePunch = await httpRequest(api_params, setIsLoading2);
      if (attDncePunch) {
        setLocationPunchData(attDncePunch);
        attdcBtn(payload, 0);
      }
    }
  };

  const handleUploadProfileImage = (payload: any) => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.7,
    };
    launchCamera(options, async res => {
      upload(res, payload);
    });
  };

  const upload = async (res: any, payloadd: any) => {
    const response = await uploadImageNewApi(
      accountId,
      'RemoteAttendance',
      32,
      userInfo?.intBusinessUnitId,
      employeeId,
      res?.assets?.[0],
    );
    if (response) {
      const payload = {
        ...payloadd,
        partId: 2,
        realTimeImageId: response?.globalFileUrlId,
      };
      const attDnce = await attendanceStatus(payload, setIsLoading, () => {
        reset();
        getLatitudeLongitude(setLocation2);
      });

      if (attDnce?.statusCode === 500) {
        toaster.show({ message: attDnce?.message, type: 'error' });
      }
      if (attDnce?.statusCode === 200) {
        const api_params = {
          url: PeopleDeskAllLanding,
          data: {
            TableName: 'MarketAttendancePunchList',
            intId: employeeId,
            businessUnitId: userInfo?.intBusinessUnitId,
          },
        };
        const attDncePunch = await httpRequest(api_params, setIsLoading2);
        if (attDncePunch) {
          setLocationPunchData(attDncePunch);
          const payload2 = {
            ...payloadd,
            partId: 1,
          };
          const attDnces = await attendanceStatus(
            payload2,
            setIsLoading,
            () => {
              reset();
              getLatitudeLongitude(setLocation2);
            },
          );
          setAttendanceSts(attDnces);
        }
      }
    }
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
          { text: 'Go to Settings', onPress: openSetting },
          { text: "Don't Use Location", onPress: () => { } },
        ],
      );
    }
    return false;
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

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (location2?.latitude && location2?.longitude) {
        // const identity = getRequestIdentity();
        // const api_params2 = {
        //   url: '/reverse.php',
        //   data: {
        //     format: 'jsonv2',
        //     zoom: 18,
        //     lat: location2?.latitude,
        //     lon: location2?.longitude,
        //   },
        //   baseURL: openMap,
        //   referer: identity?.referer || userInfo?.strUrl,
        //   userAgent: identity?.userAgent || 'PeopleDesk/19.7.3(arpan@ibos.io)',
        // };
        // const res2 = await httpRequest(api_params2, () => {});
        // setValue('location', res2?.display_name);

        const locationName = await getLocationName({
          latitude: location2?.latitude,
          longitude: location2?.longitude,
          cacheLocation,
          cacheLocationSave,
          userInfo,
        });
        setValue('location', locationName || '');
      }
    },
    [location2],
  );

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          headerColor={true}
          onBackPress={() => navigation.goBack()}
          title="Market Visiting"
          components={
            <TouchableOpacity
              disabled={isLoading2 ? true : false}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.9}
              style={[
                styles.regButton,
                {
                  backgroundColor:
                    attendanceSts?.message === 'AO' ? COLORS.yellow : chkInClr,
                },
              ]}
            >
              <Text style={styles.reg}>
                {attendanceSts?.message === 'AO' ? 'Check Out' : 'Check In'}
              </Text>
            </TouchableOpacity>
          }
        />
      }
    >
      {/* body part */}
      <View style={styles.body}>
        {isTyping ? (
          <View style={styles.bodyInner}>
            <CustomInputNew
              isImportant
              selectionColor={COLORS.white}
              setValue={setValue}
              control={control}
              name="companyInput"
              label="Company"
              rules={{ required: false }}
              inputMainStyle={styles.inputMain}
              labelStyle={styles.labelStyle}
              textInputStyle={styles.textInputStyle}
            />
            <TouchableOpacity
              style={styles.undoBtn}
              onPress={() => {
                setIsTyping(false);
                setValue('companyInput', '');
              }}
            >
              <Fontisto name="undo" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.bodyInner}>
            <CustomDropDownNew
              control={control}
              data={companyDDL}
              isImportant
              name="companyDDL"
              label="Company"
              onChange={(options: any) => {
                if (options?.value === 'type') {
                  setIsTyping(true);
                  setValue('companyDDL', '');
                } else {
                  setIsTyping(false);
                  setValue('companyDDL', options);
                }
              }}
              selectedItemStyle={{
                color: COLORS.white,
                paddingHorizontal: 10,
              }}
              labelStyle={styles.labelStyle}
              boxStyle={{
                width: '35%',
                backgroundColor: COLORS.primary,
              }}
              rules={{ required: false }}
            />
          </View>
        )}

        <View style={[styles.bodyInner, {
        }]}>
          <CustomInputNew
            isImportant
            selectionColor={COLORS.white}
            control={control}
            name="location"
            label="Location"
            rules={{ required: true }}
            setValue={setValue}
            disabled
            multiline
            inputMainStyle={[styles.inputMain,]}
            labelStyle={styles.labelStyle}
            textInputStyle={styles.textInputStyle}
          />

        </View>

        <View style={styles.marginBottom}>
          <CustomInputNew
            selectionColor={COLORS.white}
            setValue={setValue}
            control={control}
            name="remarks"
            label="Remarks"
            inputMainStyle={styles.inputMain}
            labelStyle={styles.labelStyle}
            textInputStyle={styles.textInputStyle}
          />
        </View>
      </View>

      {
        //@ts-ignore
        location2?.latitude ? (
          <MapView
            loadingEnabled={true}
            provider="google"
            initialRegion={{
              //@ts-ignore
              latitude: location2?.latitude,
              //@ts-ignore
              longitude: location2?.longitude,
              latitudeDelta: 0.0001,
              longitudeDelta: 0.0100133333,
            }}
            style={styles.mapView}
          >
            <Marker
              coordinate={{
                //@ts-ignore
                latitude: location2?.latitude,
                //@ts-ignore
                longitude: location2?.longitude,
              }}
            />

            <Circle
              center={{
                //@ts-ignore
                latitude: location2?.latitude,
                //@ts-ignore
                longitude: location2?.longitude,
              }}
              radius={200}
              strokeWidth={0.001}
              strokeColor={COLORS.primary}
              fillColor={'rgba(230,238,255,0.5)'}
            />
          </MapView>
        ) : null
      }

      <View style={styles.checkInOutHistory}>
        {isLoading ? (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        ) : null}
        {locationPunchData?.length > 0 &&
          locationPunchData?.map((item, index) => (
            <View key={index} style={styles.card4}>
              {item?.intRealTimeImage ? (
                <View
                  style={[
                    styles.width20,
                    item?.intRealTimeImage
                      ? styles.isRealTimeImageTrue
                      : styles.isRealTimeImageFalse,
                  ]}
                >
                  <FastImage
                    source={{
                      uri: getImageURL(item?.intRealTimeImage),
                    }}
                    style={styles.managerImage}
                  />
                </View>
              ) : null}
              <View
                style={
                  item?.intRealTimeImage ? styles.width65 : styles.width100
                }
              >
                <View style={styles.flexRow}>
                  <View style={styles.iconBox}>
                    <MIcon
                      name="place"
                      size={15}
                      color={
                        item?.CheckInOut === 'Check in'
                          ? COLORS.primary
                          : COLORS.yellow
                      }
                      style={styles.centerIcon}
                    />
                  </View>
                  <Text style={styles.empName}>{item?.CheckInOut}</Text>
                </View>

                <View style={styles.rowFlexStart}>
                  <Text style={styles.dateTimeTxt}>
                    {timeFormaterToPmAm(item?.tmAttendanceTime)}
                  </Text>
                  <View style={styles.dividerHorizontal} />
                  <Text style={styles.dateTimeTxt}>
                    {date_formater(item?.dteAttendanceDate)}
                  </Text>
                  <View style={styles.dividerHorizontal} />
                  <Text style={styles.dateTimeTxt}>
                    {d?.[dayjs(item?.dteAttendanceDate).day()]}
                  </Text>
                </View>
                <View style={styles.dividerVartical} />

                <View
                  style={[
                    styles.rowFlexStart,
                    {
                      width: '100%',
                    },
                  ]}
                >
                  <View
                    style={{
                      width: '20%',
                    }}
                  >
                    <Text style={[styles.addressTxt]}>
                      {item?.strVisitingCompany}
                    </Text>
                  </View>
                  <View style={styles.dividerHorizontal} />
                  <View
                    style={{
                      width: '78%',
                      paddingLeft: 6,
                    }}
                  >
                    <Text style={styles.addressTxt}>
                      {item?.strVisitingLocation}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}

        <View style={styles.padBottom} />
      </View>
    </ContainerNew>
  );
};

export default MarketVisitMainIndex;

const styles = StyleSheet.create({
  mapView: { width: SIZES.width / 1.001, height: 260 },
  reg: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 0.1,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  inputMain: {
    backgroundColor: COLORS.primary,
    paddingTop: 8,
    borderRadius: 6,
  },
  regButton: {
    backgroundColor: COLORS.statusBar,
    borderRadius: 100,
    marginVertical: 5,
    marginRight: 10,
  },
  labelStyle: {
    color: '#CDF5DB',
    paddingHorizontal: 10,
  },
  textInputStyle: {
    color: COLORS.white,
    paddingHorizontal: 32,
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  body: {
    backgroundColor: '#1F843C',
    paddingTop: 20,
    paddingHorizontal: 16,
  },

  checkInOutHistory: {
    marginBottom: Platform.OS === 'ios' ? 35 : 0.1,
    paddingHorizontal: 16,
    marginTop: 20,
  },

  width48: {
    width: '48%',
  },
  bodyInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  marginBottom: {
    marginBottom: 20,
  },
  undoBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    // backgroundColor: 'coral',
  },
  ...remoteAttendenceStyle,
});
