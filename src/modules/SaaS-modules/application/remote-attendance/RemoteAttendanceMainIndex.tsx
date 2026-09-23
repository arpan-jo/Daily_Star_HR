import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';
import { launchCamera } from 'react-native-image-picker';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import VersionCheck from 'react-native-version-check';
import { useRootStore } from '../../../../stores/rootStore';
import {
  AttendanceSetupType,
  PunchLandDataType,
} from '../../../../interfaces/attendance/attendance';
import {
  attendanceStatus,
  getAttendanceSetup,
  remoteAttendancePunchList,
  uploadImageNewApi,
} from '../../../../services/SaaS-modules/attendance/attendance';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { getImageURL } from '../../../../common/services/getImage';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { date_formater } from '../../../../common/services/dateFormater';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { useForm } from 'react-hook-form';

import { getLocationName } from '../../../../common/constant/GetLocationName';
import { getDistanceInMeters } from '../../../../common/services/getDistanceInMeters';
import FaceCaptureForRemoteAttandance from './FaceCaptureForRemoteAttandance';
import axios from 'axios';

const edges: Edge[] = ['right', 'bottom', 'left'];
const d = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

interface props {
  route?: any;
}
// Below this, a new GPS fix is treated as the same spot and not published to
// state. Well under the 50m reverse-geocode cache radius, so the displayed
// address still refreshes as soon as it can actually change.
const MIN_PUBLISH_MOVE_METERS = 10;

const faceClient = axios.create({
  baseURL: 'https://face.ibos.io/api',
  // Without this a stalled connection leaves the camera mounted behind a
  // "Verifying face..." overlay that the user cannot dismiss.
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
});
const RemoteAttendanceMainIndex = observer(({ route }: props) => {
  const employeeData = route?.params?.employeeData;

  const navigation = useNavigation();
  const { userInfo, cacheLocation, cacheLocationSave } = useRootStore();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const [location2, setLocation2] = useState<any>(null);
  const lastPublishedRef = useRef<{
    latitude: number;
    longitude: number;
  } | null>(null);
  // `mocked` lives on GeoPosition, not on GeoPosition.coords, and location2
  // only ever holds coords - so it has to be tracked separately.
  const [isMockLocation, setIsMockLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [attendanceSts, setAttendanceSts] = useState<any>();
  const [locationPunchData, setLocationPunchData] =
    useState<PunchLandDataType[]>();
  const [attendanceSetup, setAttendanceSetup] = useState<AttendanceSetupType>();
  // Payload-only values. Refs so the async payload builders read the resolved
  // value instead of whatever the closure captured at mount.
  const attendanceSetupRef = useRef<AttendanceSetupType | undefined>(undefined);
  const deviceUniqueIdRef = useRef('');
  const deviceNameRef = useRef('');
  const { control, handleSubmit, setValue, reset, watch } = useForm({});
  const [showFaceCapture, setShowFaceCapture] = useState(false);
  const [verifiedEmployeeName, setVerifiedEmployeeName] = useState<
    string | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const [faceVerifyLoading, setFaceVerifyLoading] = useState(false);
  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  useAsyncEffect(
    async isMounted => {
      // isFocused also flips to false on navigate-away, which used to re-run
      // this entire cascade on the way out.
      if (!isFocused || !isMounted()) {
        return;
      }

      VersionCheck.needUpdate()
        .then(res => {
          if (res?.isNeeded && res?.storeUrl) {
            return Linking.openURL(res.storeUrl);
          }
        })
        .catch(err => console.log('version check failed', err));

      getLocation();

      // Must resolve before the status call below: that payload carries the
      // device id, and it used to be sent empty on every mount because these
      // were still unset. Refs, not state, because nothing renders them and
      // the callbacks outlived the screen.
      try {
        const [uniqueId, name] = await Promise.all([
          DeviceInfo.getUniqueId(),
          DeviceInfo.getDeviceName(),
        ]);
        deviceUniqueIdRef.current = uniqueId;
        deviceNameRef.current = name;
      } catch (err) {
        console.log('device info failed', err);
      }

      const res = await getAttendanceSetup(
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );
      if (!isMounted()) return;

      attendanceSetupRef.current = res?.[0];
      setAttendanceSetup(res?.[0]);

      // Now that the setup and device id are known, the status call sends a
      // complete payload.
      await attdcBtn();
      if (!isMounted()) return;

      const attDncePunch = await remoteAttendancePunchList(
        employeeId,
        userInfo?.intBusinessUnitId,
        setIsLoading2,
      );

      if (attDncePunch && isMounted()) {
        setLocationPunchData(attDncePunch);
      }
    },
    [userInfo, isFocused],
  );

  const attdcBtn = async (partId?: number) => {
    // No getLocation() here: it resolves asynchronously, so the gate below and
    // the payload would still read the previous fix. watchPosition is what
    // keeps location2 current.
    if (!location2?.longitude && partId === 2) {
      toaster.show({ message: 'Check GPS', type: 'error' });
      return;
    }

    const payload = {
      // part-id 1 = status check
      partId: partId || 1,
      accountId: userInfo?.intAccountId,
      employeeId: employeeId,
      longitude: partId === 2 ? location2?.longitude?.toString() : '',
      latitude: partId === 2 ? location2?.latitude?.toString() : '',
      realTimeImageId: 0,
      deviceId: attendanceSetupRef.current?.isDeviceRegNeed ? deviceUniqueIdRef.current : '',
      deviceName: attendanceSetupRef.current?.isDeviceRegNeed ? deviceNameRef.current : '',
      visitingLocation: watch('location') || '',
      isMarket: false,
    };
    // The callback fires before the POST and the payload above is already
    // built, so refreshing the fix here could never affect it. watchPosition
    // keeps location2 current anyway.
    const attDnce = await attendanceStatus(payload, setIsLoading, () => {});
    // if (attDnce?.statusCode === 500) {
    //   toaster.show({ message: attDnce?.message, type: 'error' });
    // }
    if (partId) {
      if (attDnce?.statusCode === 500) {
        toaster.show({ message: attDnce?.message, type: 'error' });
      }
    }
    if (attDnce?.statusCode === 200) {
      const attDncePunch = await remoteAttendancePunchList(
        employeeId,
        userInfo?.intBusinessUnitId,
        setIsLoading2,
      );
      if (attDncePunch) {
        setLocationPunchData(attDncePunch);
      }
      setAttendanceSts(attDnce);
    }
  };

  const remoteAttendence = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      toaster.show({ message: 'Turn on locaiton.', type: 'error' });
      return;
    } else {
      if (attendanceSetup?.isRealTimeImageNeed) {
        setShowFaceCapture(true);
        // getLocation();
        // handleUploadProfileImage();
      } else {
        getLocation();
        // 2 for check-in-out. Awaited: it already refetches the punch list on
        // success, so the extra fetch that used to follow raced the POST and
        // rendered the pre-punch list.
        await attdcBtn(2);
      }
    }
  };

  // const handleUploadProfileImage = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     includeBase64: false,
  //     selectionLimit: 1,
  //     maxWidth: 1000,
  //     maxHeight: 1000,
  //     quality: 0.7,
  //   };
  //   launchCamera(options, async res => {
  //     getLocation();
  //     upload(res);
  //   });
  // };

  // const upload = async (res: any) => {
  //   const response = await uploadImageNewApi(
  //     userInfo?.intAccountId,
  //     'RemoteAttendance',
  //     32,
  //     userInfo?.intBusinessUnitId,
  //     userInfo?.intEmployeeId,
  //     res?.assets?.[0],
  //   );
  //   if (response) {
  //     const payload = {
  //       partId: 2,
  //       accountId: userInfo?.intAccountId,
  //       employeeId: employeeId,
  //       longitude: location2?.longitude?.toString() || '',
  //       latitude: location2?.latitude?.toString() || '',
  //       realTimeImageId: response?.globalFileUrlId,
  //       deviceId: attendanceSetupRef.current?.isDeviceRegNeed ? deviceUniqueIdRef.current : '',
  //       deviceName: attendanceSetupRef.current?.isDeviceRegNeed ? deviceNameRef.current : '',
  //       visitingLocation: watch('location') || '',
  //       isMarket: false,
  //     };
  //     const attDnce = await attendanceStatus(payload, setIsLoading, () =>
  //       getLocation(),
  //     );
  //     if (attDnce?.statusCode === 500) {
  //       toaster.show({ message: attDnce?.message, type: 'error' });
  //     }
  //     if (attDnce?.statusCode === 200) {
  //       const attDncePunch = await remoteAttendancePunchList(
  //         employeeId,
  //         userInfo?.intBusinessUnitId,
  //         setIsLoading2,
  //       );
  //       if (attDncePunch) {
  //         setLocationPunchData(attDncePunch);
  //         const payload2 = {
  //           partId: 1,
  //           accountId: userInfo?.intAccountId,
  //           employeeId: employeeId,
  //           longitude: '',
  //           latitude: '',
  //           realTimeImageId: 0,
  //           isMarket: false,
  //         };
  //         const attDnces = await attendanceStatus(payload2, setIsLoading, () =>
  //           getLocation(),
  //         );
  //         setAttendanceSts(attDnces);
  //       }
  //     }
  //   }
  // };

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

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();
    if (!hasPermission) {
      Alert.alert(
        'Location Permission',
        'Make sure your app has approved Location permission.',
      );
      return;
    } else {
      Geolocation.getCurrentPosition(
        position => {
          if (position?.mocked) {
            Alert.alert(
              'Fake Location Detected',
              'Mock location is not allowed. Please turn off mock location and try again.',
            );
            lastPublishedRef.current = null;
            setIsMockLocation(true);
            setLocation2(null);
            return;
          }
          setIsMockLocation(false);
          setLocation2(position?.coords);
        },
        error => {
          setLocation2(null);
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
    }
  };

  React.useEffect(() => {
    let watchId: number | null = null;

    const startWatching = async () => {
      const hasPermission = await hasLocationPermission();
      if (!hasPermission) return;

      watchId = Geolocation.watchPosition(
        position => {
          if (position?.mocked) {
            lastPublishedRef.current = null;
            setIsMockLocation(true);
            setLocation2(null);
            return;
          }
          setIsMockLocation(false);
          const coords = position?.coords;
          if (!coords) return;

          // distanceFilter is 0, so this fires every ~2s with a brand new
          // coords object. Publishing each one re-renders the map, the punch
          // list, the reverse-geocode effect and the face-capture child (which
          // rebuilds the camera frame processor). Only publish real movement.
          const last = lastPublishedRef.current;
          if (
            last &&
            getDistanceInMeters(
              last.latitude,
              last.longitude,
              coords.latitude,
              coords.longitude,
            ) < MIN_PUBLISH_MOVE_METERS
          ) {
            return;
          }
          lastPublishedRef.current = {
            latitude: coords.latitude,
            longitude: coords.longitude,
          };
          setLocation2(coords);
        },
        error => {
          setLocation2(null);
          console.log(error);
        },
        {
          accuracy: {
            android: 'high',
            ios: 'best',
          },
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: 5000,
          fastestInterval: 2000,
          forceRequestLocation: true,
        },
      );
    };

    if (isFocused) {
      startWatching();
    }

    return () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }
    };
  }, [isFocused]);

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

  const verifyFace = async (base64Image: string) => {
    try {
      const payload = {
        image: base64Image,
        user_id: userInfo?.intEmployeeId?.toString(),
      };
      const response = await faceClient.post('/v1/check-attendance', payload);
      return response?.data;
    } catch (error: any) {
      // Must keep the same shape as the success body. Returning a bare string
      // here meant the caller's `verifyRes?.message` was always undefined, so
      // the server's actual reason was replaced by a generic message.
      return {
        isAttendance: false,
        message:
          error?.response?.data?.details ||
          error?.response?.data?.message ||
          'Face verification failed',
      };
    }
  };
  const handleFaceCaptured = async (base64Image: string) => {
    if (isMockLocation) {
      toaster.show({
        message: 'Mock location is not allowed. Please turn off mock location.',
        type: 'error',
      });
      setShowFaceCapture(false);
      return;
    }
    setFaceVerifyLoading(true);

    // Step 1: verify face
    const verifyRes = await verifyFace(base64Image);

    if (!verifyRes?.isAttendance) {
      setFaceVerifyLoading(false);
      setFailureMessage(
        verifyRes?.message || verifyRes?.Message || 'Face Verification Failed!',
      );
      setVerificationFailed(true);
      return;
    }

    // Step 2: record attendance
    const loc = location2 as any;
    const payload = {
      partId: 2,
      accountId: userInfo?.intAccountId,
      employeeId: employeeId,
      longitude: loc?.longitude?.toString() || '',
      latitude: loc?.latitude?.toString() || '',
      realTimeImageId: 0,
      deviceId: attendanceSetupRef.current?.isDeviceRegNeed ? deviceUniqueIdRef.current : '',
      deviceName: attendanceSetupRef.current?.isDeviceRegNeed ? deviceNameRef.current : '',
      isMarket: false,
      intWorkplaceGroupId: userInfo?.intWorkplaceGroupId,
    };

    const attDnce = await attendanceStatus(payload, setIsLoading, () => {});
    setFaceVerifyLoading(false);
    if (!attDnce || attDnce?.statusCode !== 200) {
      setFailureMessage(attDnce?.message || 'Attendance recording failed!');
      setVerificationFailed(true);
      return;
    }

    // Both succeeded — show congratulations
    const empName =
      verifyRes?.name ||
      verifyRes?.employee_name ||
      userInfo?.strDisplayName ||
      'Employee';
    const prevStatus = attendanceSts?.message;
    const attMsg =
      prevStatus === 'AO' ? 'Check-out Successful!' : 'Attendance successful';

    setSuccessMessage(attMsg);
    setVerifiedEmployeeName(empName);
  };

  const handleSuccessDismiss = async () => {
    setShowFaceCapture(false);
    setVerifiedEmployeeName(null);
    setSuccessMessage(null);
    // Refreshes status and, on success, the punch list too — so the second
    // fetch that used to run here was a duplicate GET racing this one.
    await attdcBtn();
  };

  const handleErrorDismiss = useCallback(() => {
    setVerificationFailed(false);
    setFailureMessage(null);
  }, []);

  // Stable identities, so memoising the camera child actually holds.
  const handleFaceError = useCallback(
    (msg: string) => {
      setShowFaceCapture(false);
      toaster.show({
        message: msg || 'Face detection Failed',
        type: 'error',
      });
    },
    [toaster],
  );

  const handleFaceCancel = useCallback(() => setShowFaceCapture(false), []);

  // Shared by the Marker and the Circle, so they get one identity per fix
  // instead of two new objects per render.
  const mapCoordinate = useMemo(
    () => ({
      latitude: location2?.latitude,
      longitude: location2?.longitude,
    }),
    [location2?.latitude, location2?.longitude],
  );

  if (showFaceCapture) {
    return (
      <FaceCaptureForRemoteAttandance
        onFaceCaptured={handleFaceCaptured}
        isVerifying={faceVerifyLoading}
        verifiedEmployeeName={verifiedEmployeeName}
        successMessage={successMessage}
        verificationFailed={verificationFailed}
        failureMessage={failureMessage}
        onSuccessDismiss={handleSuccessDismiss}
        onErrorDismiss={handleErrorDismiss}
        onError={handleFaceError}
        onCancel={handleFaceCancel}
      />
    );
  }

  return (
    <ContainerNew
      edges={edges}
      header={
        <>
          <CustomHeader
            onBackPress={navigation.goBack}
            title={''}
            dateTime
          // components={
          //   <>
          //     <TouchableOpacity
          //       style={{
          //         marginRight: 20,
          //       }}
          //       onPress={() => {
          //         getLocation(setLocation);
          //         setIsRefresh(true);
          //       }}
          //     >
          //       <MIcon name="refresh" color={COLORS.white} size={30} />
          //     </TouchableOpacity>
          //   </>
          // }
          />
        </>
      }
      style={styles.contain}
    >
      <View style={styles.main}>
        {location2?.latitude ? (
          <>
            <MapView
              // showsTraffic={true}
              showsUserLocation={true}
              loadingEnabled={true}
              provider="google"
              initialRegion={{
                latitude: location2?.latitude,
                longitude: location2?.longitude,
                latitudeDelta: 0.0001,
                longitudeDelta: 0.0100133333,
              }}
              style={styles.mapView}
            >
              <Marker coordinate={mapCoordinate} />

              <Circle
                center={mapCoordinate}
                radius={200}
                strokeWidth={1.5}
                strokeColor={COLORS.primary}
                fillColor={'rgba(230,238,255,0.5)'}
              />
            </MapView>

            {
              <TouchableOpacity
                disabled={isLoading ? true : false}
                activeOpacity={0.7}
                onPress={() => remoteAttendence()}
                style={[
                  styles.btn,
                  {
                    backgroundColor:
                      attendanceSts?.message === 'AO'
                        ? COLORS.yellow
                        : COLORS?.primary,
                  },
                ]}
              >
                <Text style={[styles.checkIn]}>
                  {attendanceSts?.message === 'AO' ? 'Check Out' : 'Check In'}
                </Text>
              </TouchableOpacity>
            }
          </>
        ) : null}

        <View style={styles.checkInOutHistory}>
          {isLoading2 ? (
            <ActivityIndicator size={'large'} color={COLORS.primary} />
          ) : null}
          {locationPunchData?.map((item, index) => (
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
                <Text style={styles.addressTxt}>{item?.strAddress}</Text>
              </View>
            </View>
          ))}

          <View style={styles.padBottom} />
        </View>
      </View>
    </ContainerNew>
  );
});

export default RemoteAttendanceMainIndex;
export const remoteAttendenceStyle = StyleSheet.create({
  card4: {
    flexDirection: 'row',
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 3,
  },
  iconBox: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 24,
    width: 24,
    marginRight: 8,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#E6F9E9',
  },
  flexRow: {
    flexDirection: 'row',
  },
  centerIcon: {
    justifyContent: 'center',
  },
  empName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  dateTimeTxt: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 15,
  },
  addressTxt: {
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.graySubText,
    lineHeight: 18,
    paddingRight: 8,
  },
  dividerHorizontal: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.textNewColor,
  },
  dividerVartical: {
    height: 1,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  width20: { width: '25%' },
  padBottom: { paddingBottom: 200 },
  // photoButton: {
  //   flexDirection: 'row',
  //   borderWidth: 1,
  //   borderColor: COLORS.primary,
  //   borderRadius: 100,
  //   paddingHorizontal: 10,
  //   paddingVertical: 2,
  //   alignItems: 'center',
  // },
  managerImage: {
    width: 100,
    height: 100,
  },
  // photo: {
  //   fontSize: 12,
  //   fontWeight: '500',
  //   color: COLORS.primary,
  //   paddingLeft: 5,
  // },
  isRealTimeImageTrue: {
    marginRight: 10,
    width: '32%',
  },
  isRealTimeImageFalse: {
    marginRight: 0,
    width: '20%',
  },
  width65: {
    width: '65%',
  },
  width100: {
    width: '100%',
  },
});

const styles = StyleSheet.create({
  contain: {
    backgroundColor: COLORS.white,
  },
  main: {},

  btn: {
    borderRadius: 99,
    alignSelf: 'center',
    height: 50,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    overflow: 'hidden',
    top: -25,
  },
  checkIn: {
    width: SIZES.width / 2.3,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 17,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingTop: 17,
  },

  mapView: { width: SIZES.width / 1.001, height: 420 },
  checkInOutHistory: {
    marginBottom: Platform.OS === 'ios' ? 35 : 0.1,
    paddingHorizontal: 16,
  },

  ...remoteAttendenceStyle,
});
