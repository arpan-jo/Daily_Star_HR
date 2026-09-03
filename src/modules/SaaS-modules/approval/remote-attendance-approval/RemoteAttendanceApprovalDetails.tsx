/* eslint-disable react-native/no-inline-styles */
import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { date_formater } from '../../../../common/services/dateFormater';
import {
  getStatusColor,
  getStatusBgColor} from '../../../../common/services/getColor';
import { getImageURL } from '../../../../common/services/getImage';
import { getLocation } from '../../../../common/services/getLocation';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { PunchLandDataType } from '../../../../interfaces/attendance/attendance';
import {
  remoteAttendanceApprovall,
  remoteAttendancePunchListDetails} from '../../../../services/SaaS-modules/attendance/attendance';
import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { commonURL } from '../../../../../App';
import { ApproveApplications } from '../../../../common/api/api';
import { httpRequest } from '../../../../common/constant/httpRequest';

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

const RemoteAttendanceApprovalDetails = ({ route }: props) => {
  const navigation = useNavigation();
  const attDetails = route?.params?.attDetails;
  const [_isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const isFocused = useIsFocused();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isShowMore, setIsShowMore] = useState(false);
  const [imageURL, setImageURL] = useState<number | undefined>(0);
  const [locationPunchData, setLocationPunchData] =
    useState<PunchLandDataType[]>();

  const lat =
    +attDetails?.application?.strLatitude ||
    //@ts-ignore
    (location?.latitude !== undefined && location?.latitude);
  const lng =
    +attDetails?.application?.strLongitude ||
    //@ts-ignore
    (location?.longitude !== undefined && location?.longitude);

  // const lat = 23.75586;
  // const lng = 90.36445;

  const { userInfo } = useRootStore();
  const toaster = useToast();
  //@ts-ignore
  const activeTabName = route?.params?.activeTabName;

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    const payload = [
      {
        applicationId: attDetails?.application?.intRemoteAttendanceId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];

    const paylaodForV2 = [
      {
        configHeaderId: attDetails?.configHeaderId,
        approvalTransactionId: attDetails?.id,
        applicationId: attDetails?.application?.intRemoteAttendanceId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: attDetails?.applicationTypeId,
        isAdmin: activeTabName === 'adminApproval' ? true : false,
      },
    ];

    if (commonURL === userInfo?.strUrl) {
      const api_params = {
        url: ApproveApplications,
        data: paylaodForV2,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      if (res) {
        toaster.show({ message: res?.message || res?.data, type: 'success' });
        navigation.goBack();
      }
      if (res?.StatusCode === 500) {
        toaster.show({ message: res?.data, type: 'error' });
      }
    } else {
      const res = await remoteAttendanceApprovall(payload, setIsLoading);

      if (res) {
        toaster.show({ message: res?.data, type: 'success' });
        navigation.goBack();
      }
      if (res?.StatusCode === 500) {
        toaster.show({ message: res?.data, type: 'error' });
      }
    }

    // const res = await remoteAttendanceApprovall(payload, setIsLoading);
    // if (res) {
    //   navigation.goBack();
    //   toaster.show({message: res?.data, type: 'success'});
    // }
    // if (res?.StatusCode === 500) {
    //   toaster.show({message: res?.data, type: 'error'});
    // }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLocation(setLocation);
      const attDncePunch = await remoteAttendancePunchListDetails(
        attDetails?.application?.intEmployeeId,
        attDetails?.application?.dteAttendanceDate,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );
      setLocationPunchData(attDncePunch);
    },
    [userInfo, isFocused],
  );

  // const polylineLatLng = locationPunchData?.map(item => {
  //   return {
  //     latitude: +item?.strLatitude,
  //     longitude: +item?.strLongitude,
  //   };
  // });

  const polylineLatLng = useMemo(() => {
    const list = locationPunchData ?? [];
    const data = list?.length === 1 ? [list[0], list[0]] : list;

    return data?.map(item => ({
      latitude: +item?.strLatitude || 0,
      longitude: +item?.strLongitude || 0,
    }));
  }, [locationPunchData]);

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          statusText={
            attDetails?.application?.strStatus === 'Pending' ? true : false
          }
          title="Remote Attendance Details"
        />
      }
      style={styles.container}
    >
      <View>
        {/* Head Card */}
        <View style={{ paddingVertical: 16 }}>
          <View style={styles.headBox}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.touchCard}
              onPress={() =>
                //@ts-ignore
                navigation.navigate('AllEmployeeDetails', {
                  leaveDetails: {
                    EmployeeId: attDetails?.application?.intEmployeeId,
                  },
                  isFromApproval: true,
                })
              }
            >
              <View style={styles.card2}>
                <View style={styles.cardImageText}>
                  <FastImage
                    source={IMAGES.NoImage}
                    style={styles.profileImage}
                  />

                  <View style={styles.cardText}>
                    <Text style={styles.name}>{attDetails?.employeeName}</Text>
                    <Text style={styles.cardCommonText}>
                      {attDetails?.employmentType}
                    </Text>
                    <Text style={styles.cardCommonText}>
                      {attDetails?.application?.intEmployeeId}
                    </Text>
                    <Text style={styles.cardCommonText}>
                      {attDetails?.designation}
                    </Text>
                    <Text style={styles.cardCommonText}>
                      {attDetails?.department}
                    </Text>
                  </View>
                </View>
                <MIcon name="arrow-forward" size={25} color={'#667085'} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.card]}>
          <TouchableOpacity onPress={() => setIsShowMore(!isShowMore)}>
            <View style={[styles.rowSpaceBetween, styles.cardPadHorizontal]}>
              <View style={styles.rowFlexStart}>
                <Text style={styles.empName}>
                  {date_formater(attDetails?.application?.dteAttendanceDate)}
                </Text>
                <View style={[styles.status, styles.leftMargin]}>
                  <Text
                    style={[
                      styles.statusTxt,
                      {
                        color: getStatusColor(attDetails?.status),
                        backgroundColor: getStatusBgColor(attDetails?.status),
                      },
                    ]}
                  >
                    {attDetails?.status}
                  </Text>
                </View>
              </View>

              <MIcon
                name={!isShowMore ? 'expand-more' : 'expand-less'}
                size={30}
                color={COLORS.primary}
              />
            </View>
          </TouchableOpacity>

          {!isShowMore ? (
            <View>
              <View>
                {location &&
                polylineLatLng?.[0]?.latitude &&
                polylineLatLng?.[0]?.longitude ? (
                  <MapView
                    showsCompass={true}
                    rotateEnabled={true}
                    showsBuildings={true}
                    maxZoomLevel={19.5}
                    zoomEnabled={true}
                    provider="google"
                    initialRegion={{
                      latitude: polylineLatLng?.[0]?.latitude ?? lat, //
                      longitude: polylineLatLng?.[0]?.longitude ?? lng, //
                      latitudeDelta: 0.010202,
                      longitudeDelta: 0.000111,
                    }}
                    style={styles.mapView}
                  >
                    {polylineLatLng && polylineLatLng?.length > 0 && (
                      <Polyline
                        lineCap="round"
                        coordinates={polylineLatLng || []}
                        strokeColor="gray"
                        strokeColors={['gray', 'gray', 'gray', 'gray']}
                        strokeWidth={3}
                        geodesic={true}
                        lineJoin="round"
                        lineDashPattern={[0.2]}
                      />
                    )}
                    {polylineLatLng && polylineLatLng?.length > 0
                      ? polylineLatLng?.map((item, index) => (
                          <Marker
                            key={index}
                            title={index === 0 ? 'First Check-In' : ''}
                            pinColor={index === 0 ? 'blue' : 'red'}
                            coordinate={{
                              latitude: item?.latitude || lat,
                              longitude: item?.longitude || lng,
                            }}
                            tracksViewChanges={true}
                          />
                        ))
                      : null}
                  </MapView>
                ) : (
                  <ActivityIndicator size="large" />
                )}
              </View>

              {locationPunchData?.map((item, index) => (
                <View key={index} style={[styles.card, styles.padAndMargin]}>
                  <View style={styles.rowSpaceBetween}>
                    <View style={styles.flexRow}>
                      <View
                        style={[
                          styles.iconBox,
                          {
                            backgroundColor:
                              item?.CheckInOut === 'Check out'
                                ? '#FFFAEB'
                                : '#E6F9E9',
                          },
                        ]}
                      >
                        <MIcon
                          name="place"
                          size={15}
                          color={
                            item?.CheckInOut === 'Check out'
                              ? COLORS.yellow
                              : COLORS.primary
                          }
                        />
                      </View>
                      <Text
                        style={[
                          styles.empName,
                          { width: item?.intRealTimeImage ? '66%' : '90%' },
                        ]}
                      >
                        {attDetails?.employeeName}
                      </Text>
                    </View>
                    {item?.intRealTimeImage ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setImageURL(item?.intRealTimeImage);
                            setIsModalShow(true);
                          }}
                        >
                          <View style={styles.photoButton}>
                            <Icon
                              name="image-outline"
                              size={18}
                              color={COLORS.primary}
                            />
                            <Text style={styles.photo}>Photo</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null}
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
                  <Text style={styles.addressTxt}>
                    {item?.strAddress || '---'}
                  </Text>
                  <View style={[styles.rowSpaceBetween, styles.marginTop]}>
                    <Text style={styles.normalTxt}>Waiting Stage</Text>

                    <View style={styles.status}>
                      <Text style={styles.timeTxt}>
                        {attDetails?.waitingStage || attDetails?.currentStage}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
              <View style={styles.button}>
                <View>
                  <CustomButtonNew
                    btnText={'Reject'}
                    onBtnPress={() => approveOrReject(true, 'Reject')}
                    btnstyle={styles.btn3}
                    btnTextStyle={styles.btnText3}
                  />
                </View>
                <CustomButtonNew
                  btnText={'Approve'}
                  onBtnPress={() => approveOrReject(false, 'Approve')}
                  btnstyle={styles.btn2}
                  btnTextStyle={styles.btnText2}
                />
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <Modal visible={isModalShow} transparent={true} animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <View style={styles.headPart}>
              <View />
              <View>
                <Text style={styles.attached}>Attendance Attached Image</Text>
              </View>
              <View>
                <TouchableOpacity onPress={() => setIsModalShow(!isModalShow)}>
                  <Icon
                    name="close"
                    size={25}
                    color={COLORS.white}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {!imageURL ? (
              <ActivityIndicator size={'large'} color={COLORS.primary} />
            ) : null}
            <Image
              source={{
                uri: getImageURL(imageURL),
              }}
              style={styles.image}
            />
          </View>
        </View>
      </Modal>
    </ContainerNew>
  );
};

export default RemoteAttendanceApprovalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    // paddingVertical: 8,
  },
  cardPadHorizontal: {
    paddingHorizontal: 10,
  },
  card: {
    borderWidth: 0.8,
    // marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
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
  },
  status: {
    borderRadius: 100,
    paddingVertical: 1,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  // txtPart: {
  //   flex: 1,
  //   paddingLeft: 16,
  // },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
  // divider: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: COLORS.iconGrayBackground,
  //   marginVertical: 8,
  // },
  flexRow: {
    flexDirection: 'row',
  },
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
  },
  dividerHorizontal: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.textNewColor,
  },
  dividerVartical: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    marginVertical: 8,
  },
  btn2: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
    marginHorizontal: 8,
  },
  btnText2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  btnText3: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textColor,
  },
  btn3: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
    marginHorizontal: 8,
    backgroundColor: '#F2F4F7',
    borderWidth: 1,
    borderColor: COLORS.offDay,
  },
  button: { flexDirection: 'row', justifyContent: 'center' },
  mapView: { width: SIZES.width / 1.1, height: 300, marginVertical: 15 },
  padAndMargin: { marginHorizontal: 10, paddingHorizontal: 16, marginTop: 8 },
  photoButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignItems: 'center',
  },
  leftMargin: { marginLeft: 10 },
  photo: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.primary,
    paddingLeft: 5,
  },

  headBox: {
    marginHorizontal: 1,
    borderColor: COLORS.white,
    elevation: 5,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  touchCard: {
    padding: 16,
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 50,
  },
  cardImageText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  cardText: {
    width: '80%',
    paddingHorizontal: 10,
  },
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
  card2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.lightGray,
  },
  image: {
    width: '100%',
    height: Platform?.OS === 'ios' ? '70%' : '70%',
    // height: '100%',
    // resizeMode: 'contain',
    backgroundColor: 'white',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  headPart: {
    backgroundColor: COLORS.primary,
    height: 50,
    paddingTop: 15,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingLeft: 16,
    marginTop: Platform?.OS === 'ios' ? 50 : 0,
  },
  attached: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
    letterSpacing: 0.8,
    alignSelf: 'center',
  },
  icon: {
    paddingRight: 16,
    paddingLeft: 10,
    paddingBottom: 8,
  },
  normalTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  timeTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 20,
  },
  marginTop: {
    marginTop: 4,
  },
});
