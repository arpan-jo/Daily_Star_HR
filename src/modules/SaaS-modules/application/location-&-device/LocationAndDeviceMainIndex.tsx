import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { FloatingAction } from 'react-native-floating-action';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import { useToast } from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { directionFromLatLong } from '../../../../common/services/directionFromLatLong';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { getLocation } from '../../../../common/services/getLocation';
import {
  RegDeviceLandType,
  RegisteredAdminLocationType,
  RegisteredLocationType,
} from '../../../../interfaces/attendance/attendance';
import {
  addLocation,
  addMasterLocation,
  deleteDevice,
  deleteLocation,
  getAttendanceSetup,
  getRegisteredAdminLocationList,
} from '../../../../services/SaaS-modules/attendance/attendance';
import { useRootStore } from '../../../../stores/rootStore';
import { PeopleDeskAllLanding } from '../../../../common/api/api';
import { commonURL } from '../../../../../App';
import { httpRequest } from '../../../../common/constant/httpRequest';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const LocationAndDeviceMainIndex = ({ route }: props) => {
  const employeeData = route?.params?.employeeData;

  const navigation = useNavigation();
  const toaster = useToast();
  const { userInfo } = useRootStore();
  const [deviceName, setDeviceName] = useState('');
  const [deviceUniqueId, setDeviceUniqueId] = useState('');
  const [isLoading, setIsLoading] = useState();
  const isFocused = useIsFocused();
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [isModalShow3, setIsModalShow3] = useState(false);
  const [isModalShow4, setIsModalShow4] = useState(false);
  const [registerLocaitonData, setRegisterLocationData] =
    useState<RegisteredLocationType[]>();
  const [registerAdminLocaitonData, setRegisterAdminLocaitonData] =
    useState<RegisteredAdminLocationType[]>();
  const [registerDeviceData, setRegisterDeviceData] =
    useState<RegDeviceLandType[]>();
  const [deviceUniqueId2, setDeviceUniqueId2] = useState('');
  const [empId, setEmpId] = useState<number>();
  const [attRegId, setAttRegId] = useState<number>();
  const [masterLocId, setMasterLocId] = useState<number>();
  const [isClicked, setIsClicked] = useState(false);
  const [attendanceSetup, setAttendanceSetup] = useState<any>(null);

  //@ts-ignore
  const lat = location?.latitude !== undefined && location?.latitude;
  //@ts-ignore
  const lng = location?.longitude !== undefined && location?.longitude;
  // const lat = 23.75586;
  // const lng = 90.36445;

  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  // setTimeout(() => {
  //   getLocation(setLocation);
  // }, 3000);
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLocation(setLocation);

      DeviceInfo.getUniqueId().then(uniqueId => {
        setDeviceUniqueId(uniqueId);
      });

      DeviceInfo.getDeviceName().then(name => {
        setDeviceName(name);
      });
      const setupRes = await getAttendanceSetup(
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );
      setAttendanceSetup(setupRes?.[0]);
      getLocationAndDevice();
    },
    [isFocused, employeeId],
  );

  const actions = [
    {
      text: 'Add Location',
      icon: (
        <View style={styles.icon}>
          <MIcon name="map" size={20} color={COLORS.movement} />
        </View>
      ),
      name: 'addLocation',
      position: 2,
    },
    {
      text: 'Device Registration',
      icon: (
        <View style={styles.icon}>
          <MIcon name="phone-android" size={20} color={COLORS.movement} />
        </View>
      ),
      name: 'deviceRegistration',
      position: 1,
    },

    ...(attendanceSetup?.isRealTimeImageNeed
      ? [
        {
          text: 'Face Registration',
          icon: (
            <View style={styles.icon}>
              <MIcon name="face" size={20} color={COLORS.movement} />
            </View>
          ),
          name: 'faceRegistration',
          position: 3,
        },
      ]
      : []),
  ];

  const onSubmit = async () => {
    setModalVisible(!modalVisible);
    const payload = {
      //partId 2 === location and 1 === device
      partId: 1,
      attendanceRegId: 0,
      intAccountId:
        employeeData?.profileData?.employeeProfileLandingView?.intAccountId ||
        userInfo?.intAccountId,
      employeeId: employeeId,
      employeeName: employeeData?.EmployeeName || userInfo?.strDisplayName,
      longitude: lng?.toString(),
      latitude: lat?.toString(),
      placeName: '',
      address: '',
      insertBy: employeeId,
      deviceId: deviceUniqueId,
      deviceName: deviceName,
      isHomeOffice: false,
      isLocationRegister: false,
    };

    const res = await addLocation(payload, setIsLoading);
    if (res?.statusCode === 200) {
      getLocation(setLocation);
      // const ress = await getRegisteredLocationList(
      //   userInfo?.intAccountId,
      //   employeeId,
      //   setIsLoading,
      // );
      const commonParams = {
        AccountId: userInfo?.intAccountId,
        intId: employeeId,
      };
      const api_paramsLocation = {
        url: PeopleDeskAllLanding,
        data:
          userInfo?.strUrl === commonURL
            ? {
              ...commonParams,
              BusinessUnitId: userInfo?.intBusinessUnitId,
              WorkplaceGroupId: userInfo?.intWorkplaceGroupId,
              TableName: 'RemoteAttendanceLocationRegistrationList',
            }
            : {
              ...commonParams,
              TableName: 'RemoteAttendanceLocationRegistrationList',
            },
      };
      const ress = await httpRequest(api_paramsLocation, setIsLoading);
      setRegisterLocationData(ress);

      const resAdminLocation = await getRegisteredAdminLocationList(
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );

      setRegisterAdminLocaitonData(resAdminLocation);

      // const dres = await getRegisteredDeviceList(
      //   userInfo?.intAccountId,
      //   employeeId,
      //   setIsLoading,
      // );

      const api_params = {
        url: PeopleDeskAllLanding,
        data:
          userInfo?.strUrl === commonURL
            ? {
              ...commonParams,
              BusinessUnitId: userInfo?.intBusinessUnitId,
              TableName: 'RemoteAttendanceDeviceRegistrationList',
            }
            : {
              ...commonParams,
              TableName: 'RemoteAttendanceDeviceRegistrationList',
            },
      };
      const dres = await httpRequest(api_params, setIsLoading);
      setRegisterDeviceData(dres);
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
    // if (res?.StatusCode === 500) {
    //   toaster.show({ message: res?.Message, type: 'error' });
    // }
  };

  const handleDeleteDevice = async () => {
    const res = await deleteDevice(empId, deviceUniqueId2, setIsLoading);
    if (res?.statusCode === 200) {
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
    if (res?.StatusCode === 500) {
      toaster.show({ message: res?.Message, type: 'error' });
    }
    getLocationAndDevice();
  };

  const handleDeleteLocation = async () => {
    const res = await deleteLocation(empId, attRegId, setIsLoading);
    if (res?.statusCode === 200) {
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
    if (res?.StatusCode === 500) {
      toaster.show({ message: res?.Message, type: 'error' });
    }
    getLocationAndDevice();
  };

  const handleMasterLocation = async () => {
    const masterLocationPayload = {
      //intMasterLocationId 0 = create, 1 = update
      intMasterLocationId: masterLocId,
      intAccountId: userInfo?.intAccountId,
      intBusinessId: userInfo?.intBusinessUnitId,
      strLongitude: '',
      strLatitude: '',
      strPlaceName: '',
      strAddress: '',
      isActive: false,
      actionBy: userInfo?.intEmployeeId,
    };
    const res = await addMasterLocation(masterLocationPayload, setIsLoading);
    if (res?.statusCode === 200) {
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
    if (res?.StatusCode === 500) {
      toaster.show({ message: res?.Message, type: 'error' });
    }

    getLocationAndDevice();
  };

  const getLocationAndDevice = async () => {
    // const resLocation = await getRegisteredLocationList(
    //   userInfo?.intAccountId,
    //   employeeId,
    //   setIsLoading,
    // );
    const commonParams = {
      AccountId: userInfo?.intAccountId,
      intId: employeeId,
    };
    const api_paramsLocation = {
      url: PeopleDeskAllLanding,
      data:
        userInfo?.strUrl === commonURL
          ? {
            ...commonParams,
            BusinessUnitId: userInfo?.intBusinessUnitId,
            WorkplaceGroupId: userInfo?.intWorkplaceGroupId,
            TableName: 'RemoteAttendanceLocationRegistrationList',
          }
          : {
            ...commonParams,
            TableName: 'RemoteAttendanceLocationRegistrationList',
          },
    };
    const resLocation = await httpRequest(api_paramsLocation, setIsLoading);
    setRegisterLocationData(resLocation);
    // const commonParams = {
    //
    //   AccountId: userInfo?.intAccountId,
    //   intId: userInfo?.intEmployeeId,
    // };
    const api_params = {
      url: PeopleDeskAllLanding,
      data:
        userInfo?.strUrl === commonURL
          ? {
            ...commonParams,
            BusinessUnitId: userInfo?.intBusinessUnitId,
            TableName: 'RemoteAttendanceDeviceRegistrationList',
          }
          : {
            ...commonParams,
            TableName: 'RemoteAttendanceDeviceRegistrationList',
          },
    };
    const dres = await httpRequest(api_params, setIsLoading);
    setRegisterDeviceData(dres);

    const resAdminLocation = await getRegisteredAdminLocationList(
      userInfo?.intAccountId,
      userInfo?.intBusinessUnitId,
      setIsLoading,
    );
    setRegisterAdminLocaitonData(resAdminLocation);
  };

  // const requestCameraPermission = async (): Promise<boolean> => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   }
  //   return true;
  // };
  // const takeFrontPhoto = () => {
  //   return new Promise((resolve, reject) => {
  //     const options = {
  //       mediaType: 'photo',
  //       cameraType: 'front',
  //       quality: 0.8,
  //       saveToPhotos: false,
  //       includeBase64: true,
  //     };

  //     launchCamera(options, response => {
  //       if (response.didCancel) {
  //         reject('User cancelled camera');
  //       } else if (response.errorCode) {
  //         reject(response.errorMessage);
  //       } else if (response.assets && response.assets.length > 0) {
  //         resolve(response.assets[0]);
  //       } else {
  //         reject('Unknown error');
  //       }
  //     });
  //   });
  // };

  // const handleFaceRegistration = async () => {
  //   try {
  //     const hasPermission = await requestCameraPermission();
  //     if (!hasPermission) {
  //       toaster.show({ message: 'Camera permission denied', type: 'error' });
  //       return;
  //     }

  //     const photo = await takeFrontPhoto();
  //     console.log('photo is ', JSON.stringify(photo, null, 2));
  //   } catch (error) {
  //     toaster.show({
  //       message: typeof error === 'string' ? error : 'Something went wrong!',
  //       type: 'error',
  //     });
  //   }
  // };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <CustomHeader
          withoutBar
          onBackPress={navigation.goBack}
          title="Location & Device"
        />
      }
      style={styles.container}
    >
      <LoadingContainer isLoading={isLoading} />
      {userInfo?.isOfficeAdmin ? (
        <View style={styles.headPart}>
          <View
            style={[
              styles.head,
              {
                borderBottomColor: isClicked ? COLORS.primary : COLORS.white,
              },
            ]}
          >
            <TouchableOpacity
              disabled={!isClicked ? true : false}
              onPress={() => isClicked && setIsClicked(!isClicked)}
            >
              <Text
                style={[
                  styles.headText,
                  !isClicked
                    ? styles.isLocationClickedFalse
                    : styles.isLocationClickedTrue,
                ]}
              >
                MY ASSIGN
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              styles.head,
              {
                borderBottomColor: !isClicked ? COLORS.primary : COLORS.white,
              },
            ]}
          >
            <TouchableOpacity
              disabled={isClicked ? true : false}
              onPress={() => !isClicked && setIsClicked(!isClicked)}
            >
              <Text
                style={[
                  styles.headText,
                  isClicked
                    ? styles.isDeviceClickedFalse
                    : styles.isDeviceClickedTrue,
                ]}
              >
                ADMIN LOCATION
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <View
        style={[styles.body, { marginTop: !userInfo?.isOfficeAdmin ? 24 : 0 }]}
      >
        <ScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {!isClicked ? (
            <>
              {/* my assign part */}
              <Text style={[styles.locDevice, styles.padLeft]}>Device</Text>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                horizontal
                style={[styles.pad]}
              >
                {registerDeviceData?.length > 0 &&
                  registerDeviceData?.map((item, index) => (
                    <View
                      key={index}
                      style={[
                        styles.card,
                        styles.cardWidth,
                        styles.marginRight,
                      ]}
                    >
                      <View style={[styles.cardInsideWidth]}>
                        <View>
                          <View style={styles.deviceIcon}>
                            <View style={styles.iconPart}>
                              <MIcon
                                name={'phone-android'}
                                size={25}
                                color={'#0086C9'}
                              />
                            </View>
                            <View
                              style={[
                                styles.status,
                                {
                                  backgroundColor: getStatusBgColor(
                                    item?.Status,
                                  ),
                                },
                                styles.height,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.statusTxt,
                                  {
                                    color: getStatusColor(item?.Status),
                                  },
                                ]}
                              >
                                {item?.Status}
                              </Text>
                            </View>
                          </View>

                          <View>
                            <Text style={styles.deviceName}>
                              {item?.strDeviceName}
                            </Text>
                            <Text style={styles.deviceName2}>
                              {item?.strDeviceId}
                            </Text>
                          </View>
                        </View>

                        <View>
                          {userInfo?.isSupNLMORManagement ? (
                            <View style={styles.rowSpaceBetween}>
                              <TouchableOpacity
                                onPress={() => {
                                  setEmpId(item?.intEmployeeId);
                                  setDeviceUniqueId2(item?.strDeviceId);
                                  setIsModalShow3(true);
                                }}
                                style={styles.closeIcon}
                              >
                                <Text style={styles.closeIconText}>Delete</Text>
                              </TouchableOpacity>

                              {employeeData?.EmployeeId ? (
                                <>
                                  {userInfo?.intEmployeeId ===
                                    employeeData?.EmployeeId ? (
                                    <>
                                      {deviceUniqueId !== item?.strDeviceId ? (
                                        <Text style={styles.expTxt}>
                                          Expired
                                        </Text>
                                      ) : null}
                                    </>
                                  ) : null}
                                </>
                              ) : (
                                <>
                                  {deviceUniqueId !== item?.strDeviceId ? (
                                    <Text style={styles.expTxt}>Expired</Text>
                                  ) : null}
                                </>
                              )}
                              {/* {userInfo?.intEmployeeId ===
                              employeeData?.EmployeeId ? (
                                <>
                                  {deviceUniqueId !== item?.strDeviceId ? (
                                    <Text style={styles.expTxt}>Expired</Text>
                                  ) : null}
                                </>
                              ) : null} */}
                            </View>
                          ) : (
                            <>
                              {deviceUniqueId !== item?.strDeviceId ? (
                                <Text style={styles.expTxt}>Expired</Text>
                              ) : null}
                            </>
                          )}
                        </View>
                      </View>
                    </View>
                  ))}

                <View style={styles.paddingRight} />
              </ScrollView>
              {registerDeviceData?.length === 0 ? (
                <View style={styles.notImage}>
                  <FastImage source={IMAGES.NoDataImage} style={styles.image} />
                  <Text style={styles.noDataText}>No data found</Text>
                </View>
              ) : null}
              <View style={styles.bar} />
              <View style={[styles.pad, styles.padBtm]}>
                <Text style={styles.locDevice}>Location</Text>
                {registerLocaitonData?.length > 0 &&
                  registerLocaitonData?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => {
                        //@ts-ignore
                        navigation.navigate('RegLocationDetails', {
                          regLocaitonData: item,
                        });
                      }}
                      style={styles.card}
                      key={index}
                    >
                      <View>
                        <MIcon
                          //@ts-ignore
                          name={'map'}
                          size={30}
                          color={COLORS.primary}
                        />
                      </View>
                      <View style={styles.txtPart}>
                        <Text style={styles.empName}>{item?.strAddress}</Text>
                        <View style={styles.latLng}>
                          <Text style={styles.cmnTxt2}>
                            {`${Number(item?.strLatitude).toFixed(5)}° `}{' '}
                            {directionFromLatLong(item?.strLatitude, 0)}
                          </Text>
                          <View style={styles.bar2} />
                          <Text style={styles.cmnTxt2}>
                            {`${Number(item?.strLongitude).toFixed(5)}° `}
                            {directionFromLatLong(0, item?.strLongitude)}
                          </Text>
                        </View>
                        <View style={styles.locDelete}>
                          <View>
                            {userInfo?.isSupNLMORManagement ? (
                              <TouchableOpacity
                                onPress={() => {
                                  setEmpId(item?.intEmployeeId);
                                  setAttRegId(item?.intAttendanceRegId);
                                  setIsModalShow2(true);
                                }}
                                style={styles.closeIcon}
                              >
                                {/* <MIcon name={'close'} size={30} color={COLORS.red} /> */}
                                <Text style={styles.closeIconText}>Delete</Text>
                              </TouchableOpacity>
                            ) : null}
                          </View>
                          <View
                            style={[
                              styles.status,
                              {
                                backgroundColor: getStatusBgColor(item?.Status),
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusTxt,
                                {
                                  color: getStatusColor(item?.Status),
                                },
                              ]}
                            >
                              {item?.Status}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                {registerLocaitonData?.length === 0 ? (
                  <View style={styles.notImage}>
                    <FastImage
                      source={IMAGES.NoDataImage}
                      style={styles.image}
                    />
                    <Text style={styles.noDataText}>No data found</Text>
                  </View>
                ) : null}
              </View>
            </>
          ) : (
            // admin location part
            <View style={[styles.pad, styles.padBtm]}>
              {registerAdminLocaitonData?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => {
                    //@ts-ignore
                    navigation.navigate('RegLocationDetails', {
                      regLocaitonData: item,
                    });
                  }}
                  style={styles.card}
                  key={index}
                >
                  <View>
                    <MIcon
                      //@ts-ignore
                      name={'map'}
                      size={30}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.txtPart}>
                    <Text style={styles.empName}>{item?.strPlaceName}</Text>
                    <View style={styles.latLng}>
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.strLatitude).toFixed(5)}° `}{' '}
                        {directionFromLatLong(item?.strLatitude, 0)}
                      </Text>
                      <View style={styles.bar2} />
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.strLongitude).toFixed(5)}° `}
                        {directionFromLatLong(0, item?.strLongitude)}
                      </Text>
                    </View>
                    <View style={styles.locDelete}>
                      <View>
                        {userInfo?.isSupNLMORManagement ? (
                          <TouchableOpacity
                            onPress={() => {
                              setMasterLocId(item?.intMasterLocationId);
                              setIsModalShow4(true);
                            }}
                            style={styles.closeIcon}
                          >
                            <Text style={styles.closeIconText}>Delete</Text>
                          </TouchableOpacity>
                        ) : null}
                      </View>
                      <View
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusBgColor(item?.strStatus),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusTxt,
                            {
                              color: getStatusColor(item?.strStatus),
                            },
                          ]}
                        >
                          {item?.strStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {registerAdminLocaitonData?.length === 0 ? (
                <View style={styles.notImage}>
                  <FastImage source={IMAGES.NoDataImage} style={styles.image} />
                  <Text style={styles.noDataText}>No data found</Text>
                </View>
              ) : null}
            </View>
          )}
        </ScrollView>
      </View>

      {!isClicked ? (
        <>
          {!modalVisible ? (
            <FloatingAction
              position="right"
              color={COLORS.primary}
              actions={isClicked ? [actions?.[0]] : actions}
              overlayColor={'rgba(255, 255, 255, 0.96)'}
              onPressItem={name => {
                getLocation(setLocation);

                if (name === 'addLocation') {
                  //@ts-ignore
                  navigation.navigate('AddLocationIndex', {
                    employeeData: employeeData,
                    isAdminLocation: isClicked,
                  });
                }
                if (name === 'deviceRegistration') {
                  setModalVisible(true);
                }
                if (name === 'faceRegistration') {
                  navigation.navigate('FaceRegistrationIndex');
                }
              }}
            />
          ) : null}
        </>
      ) : (
        <View>
          <TouchableOpacity
            style={styles.customFloatButton}
            onPress={() =>
              //@ts-ignore
              navigation.navigate('AddLocationIndex', {
                employeeData: employeeData,
                isAdminLocation: isClicked,
              })
            }
          >
            <MIcon name="add" size={25} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Device Registration</Text>
            <Text style={styles.cmnTxt}>
              Are you sure, you want to register your device for online
              attendence?
            </Text>
            <Text style={styles.cmnTxt}>Device: {deviceName}</Text>
            <Text style={styles.cmnTxt}>Device ID: {deviceUniqueId}</Text>
            <View style={styles.footerButton}>
              <Pressable
                style={[styles.button]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => onSubmit()}
              >
                <Text style={styles.textStyle}>Register</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <CustomModalNew
        setIsModalShow={setIsModalShow3}
        isModalShow={isModalShow3}
        onPressCallApi={() => handleDeleteDevice()}
        modalText={'Are you sure to delete the registered Device?'}
        deleteText={'Confirm'}
      />

      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => handleDeleteLocation()}
        modalText={'Are you sure to delete the registered Location?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow4}
        isModalShow={isModalShow4}
        onPressCallApi={() => handleMasterLocation()}
        modalText={'Are you sure to delete the Master Location?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default LocationAndDeviceMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {},
  buttonClose: {
    paddingLeft: 30,
  },
  textStyle: {
    color: '#0086C9',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  modalText: {
    marginBottom: 5,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500',
  },
  icon: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 100,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  empName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  txtPart: {
    flex: 1,
    paddingLeft: 16,
  },
  statusTxt: {
    textAlign: 'center',
    borderRadius: 100,
    paddingBottom: 2,
  },
  status: {
    width: 80,
    paddingVertical: 1,
    borderRadius: 100,
    justifyContent: 'center',
  },
  cmnTxt: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  footerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 25,
  },
  iconPart: {
    width: 40,
    backgroundColor: '#E0F2FE',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
  deviceIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardWidth: { width: 180 },
  cardInsideWidth: {
    width: 160,
    justifyContent: 'space-between',
  },
  deviceName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingTop: 10,
  },
  deviceName2: {
    fontSize: 12,
    color: COLORS.graySubText,
    paddingTop: 5,
  },
  bar: { height: 8, backgroundColor: COLORS.bar, marginVertical: 16 },
  latLng: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  cmnTxt2: {
    color: COLORS.graySubText,
    fontSize: 14,
    fontWeight: '500',
  },
  bar2: {
    width: 2,
    backgroundColor: COLORS.graySubText,
    marginHorizontal: 20,
  },
  pad: {
    paddingHorizontal: 16,
  },
  locDevice: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.graySubText,
    paddingBottom: 10,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  image: { width: 130, height: 90 },
  marginRight: {
    marginRight: 20,
  },
  height: {
    height: 25,
  },
  padLeft: {
    paddingLeft: 16,
  },
  notImage: {
    alignSelf: 'center',
    marginTop: 20,
  },
  padBtm: {
    paddingBottom: 200,
  },
  paddingRight: {
    paddingRight: 50,
  },
  closeIcon: {
    backgroundColor: '#ffa4a4',
    width: 60,
    borderRadius: 4,
    marginTop: 6,
  },
  closeIconText: {
    textAlign: 'center',
    paddingVertical: 5,
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  locDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headPart: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    paddingTop: 25.78,
    paddingBottom: 0.7,
    elevation: 5,
  },
  headText: {
    paddingBottom: 15,
    paddingLeft: 20,
    fontWeight: '700',
    fontSize: 14,
    alignItems: 'center',
    lineHeight: 20,
  },
  head: {
    width: '48%',
    borderBottomWidth: 3,
  },
  isLocationClickedTrue: {
    color: '#BFE7CA',
  },
  isLocationClickedFalse: {
    color: COLORS.white,
  },
  isDeviceClickedTrue: {
    color: '#BFE7CA',
  },
  isDeviceClickedFalse: {
    color: COLORS.white,
  },
  customFloatButton: {
    backgroundColor: COLORS.primary,
    height: 55,
    width: 55,
    bottom: 30,
    right: 30,
    borderRadius: 100,
    touchableOpacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    elevation: 5,
  },
  body: {
    flex: 1,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expTxt: {
    fontSize: 12.5,
    color: COLORS.red,
    fontWeight: '600',
  },
});
