import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MapView, {Marker, Circle} from 'react-native-maps';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {getImageURL} from '../../../../common/services/getImage';
import {attendanceLocationApprovall} from '../../../../services/SaaS-modules/attendance/attendance';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import {commonURL} from '../../../../../App';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {ApproveApplications} from '../../../../common/api/api';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const LocationAndDeviceApprovalDetails = ({route}: props) => {
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const locationDetails = route?.params?.locationDetails;
  const navigation = useNavigation();

  const [_isLoading, setIsLoading] = useState(false);

  const lat = +locationDetails?.application?.strLatitude;
  const lng = +locationDetails?.application?.strLongitude;

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    if (commonURL === userInfo?.strUrl) {
      const payloadForV2 = [
        {
          configHeaderId: locationDetails?.configHeaderId,
          approvalTransactionId: locationDetails?.id,
          applicationId: locationDetails?.application?.intAttendanceRegId,
          approverEmployeeId: userInfo?.intEmployeeId,
          isApprove: isApproveOrReject === 'Approve' ? true : false,
          isReject: isApproveOrReject === 'Reject' ? true : false,
          actionBy: userInfo?.intEmployeeId,
          // isAdmin: userInfo?.isOfficeAdmin,
          //@ts-ignore
          applicationTypeId: locationDetails?.applicationTypeId,
        },
      ];
      const api_params = {
        url: ApproveApplications,
        data: payloadForV2,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      if (res) {
        navigation.goBack();
        toaster.show({message: res?.message || res, type: 'success'});
      }
    } else {
      const payload = [
        {
          applicationId: locationDetails?.application?.intAttendanceRegId,
          approverEmployeeId: userInfo?.intEmployeeId,
          isReject: isReject,
          accountId: userInfo?.intAccountId,
          isAdmin: userInfo?.isOfficeAdmin,
        },
      ];
      const res = await attendanceLocationApprovall(payload, setIsLoading);
      if (res) {
        navigation.goBack();
        toaster.show({message: res?.data, type: 'success'});
      }
    }
  };
  return (
    <ContainerNew
      edges={edges}
      header={
        <>
          <CustomHeader
            onLeftCrossPress={() => navigation.goBack()}
            statusText={
              locationDetails?.application?.strStatus === 'Pending'
                ? true
                : false
            }
            title="Location / Device Details"
          />
        </>
      }
      style={styles.container}>
      <View style={styles.paddingVartical}>
        <View style={styles.headBox}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AllEmployeeDetails', {
                leaveDetails: {
                  EmployeeId: locationDetails?.application?.intEmployeeId,
                },
                isFromApproval: true,
              })
            }
            activeOpacity={0.6}
            style={styles.touchCard}>
            <View style={styles.card}>
              <View style={styles.cardImageText}>
                {locationDetails?.imageURL ? (
                  <FastImage
                    source={{
                      uri: getImageURL(locationDetails?.imageURL),
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
                    {locationDetails?.employeeName}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {locationDetails?.employmentType}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {locationDetails?.designation}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {locationDetails?.department}
                  </Text>
                </View>
              </View>
              <MIcon name="arrow-forward" size={25} color={'#667085'} />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.marginTop} />

        <View style={styles.itemSection}>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="today"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Application Date</Text>
              <Text style={styles.valueText}>
                {date_formater(locationDetails?.application?.dteInsertDate)}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name={
                  locationDetails?.application?.isLocationRegister
                    ? 'map'
                    : 'ad-units'
                }
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>
                {locationDetails?.application?.isLocationRegister
                  ? 'Location'
                  : 'Device'}
              </Text>
              <Text style={styles.valueText}>
                {locationDetails?.application?.isLocationRegister
                  ? locationDetails?.application?.strAddress
                  : locationDetails?.application?.strDeviceName}
              </Text>
              {!locationDetails?.application?.isLocationRegister ? (
                <Text style={styles.valueText}>
                  {locationDetails?.application?.isLocationRegister
                    ? locationDetails?.application?.strAddress
                    : locationDetails?.application?.strDeviceId}
                </Text>
              ) : null}
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="pending-actions"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Waiting Stage</Text>

              <Text style={styles.valueText}>
                {locationDetails?.waitingStage ||
                  locationDetails?.WaitingStage ||
                  locationDetails?.currentStage}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="pending-actions"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={[styles.textRightPart, styles.borderBtmWidth]}>
              <Text style={styles.subText}>Status</Text>
              <Text style={styles.valueText}>{locationDetails?.status}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.flexCenter}>
        <View>
          <CustomButtonNew
            btnText={'Reject'}
            onBtnPress={() => approveOrReject(true, 'Reject')}
            btnstyle={styles.btn1}
            btnTextStyle={styles.btnText1}
          />
        </View>

        <CustomButtonNew
          btnText={'Approve'}
          onBtnPress={() => approveOrReject(false, 'Approve')}
          btnstyle={styles.btn2}
          btnTextStyle={styles.btnText2}
        />
      </View>

      <ScrollView>
        {lat && lng ? (
          <MapView
            provider="google"
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.00001,
              longitudeDelta: 0.01000133333,
            }}
            style={styles.mapView}>
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
            />
            <Circle
              center={{
                latitude: lat,
                longitude: lng,
              }}
              radius={200}
              strokeWidth={1.5}
              strokeColor={COLORS.primary}
              fillColor={'rgba(230,238,255,0.5)'}
            />
          </MapView>
        ) : null}
      </ScrollView>
    </ContainerNew>
  );
};

export default LocationAndDeviceApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  headBox: {
    marginHorizontal: 16,
    borderColor: COLORS.white,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  touchCard: {padding: 16},
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 50,
  },
  card: {flexDirection: 'row', justifyContent: 'space-between', width: '100%'},
  cardImageText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  cardText: {width: '80%', paddingHorizontal: 10},
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
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },

  subText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  centerText: {textAlign: 'center'},
  textRightPart: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    paddingBottom: 8,
    marginBottom: 9,
  },

  btn1: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 8,
    backgroundColor: '#F2F4F7',
    borderWidth: 1,
    borderColor: COLORS.offDay,
  },
  btn2: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginHorizontal: 8,
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textColor,
  },
  btnText2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  paddingVartical: {
    paddingVertical: 16,
  },
  itemSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flexCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  borderBtmWidth: {
    borderBottomWidth: 0,
  },
  marginTop: {marginTop: 10},
  mapView: {
    width: SIZES.width / 1.001,
    height: SIZES.height / 1.5,
    marginTop: -50,
  },
});
