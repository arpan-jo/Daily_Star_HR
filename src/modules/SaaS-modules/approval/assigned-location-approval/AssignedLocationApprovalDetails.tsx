import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';

import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import {arlURL, commonURL} from '../../../../../App';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {
  ApproveApplications,
  MasterLocationAssaignApprovalEngine} from '../../../../common/api/api';
import {overtimeStyle} from '../../application/overtime-application/OvertimeApplicationDetails';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const AssignedLocationApprovalDetails = ({route}: props) => {
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const locationDetails = route?.params?.locationDetails;
  const navigation = useNavigation();
  const {saveLogAction} = useAuditLogSave();

  const [_isLoading, _setIsLoading] = useState(false);

  const lat = +locationDetails?.application?.strLatitude;
  const lng = +locationDetails?.application?.strLongitude;
  const activeTabName = route?.params?.activeTabName;

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    const payload = [
      {
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
        locationId: locationDetails?.intMasterLocationId,
      },
    ];
    const paylaodForV2 = {
      configHeaderId: locationDetails?.configHeaderId,
      approvalTransactionId: locationDetails?.id,
      applicationId:
        locationDetails?.notificationMaster?.intFeatureTableAutoId ||
        locationDetails?.intMasterLocationId,
      isApprove: isApproveOrReject === 'Approve' ? true : false,
      isReject: isApproveOrReject === 'Reject' ? true : false,
      actionBy: userInfo?.intEmployeeId,
      //@ts-ignore
      applicationTypeId: locationDetails?.applicationTypeId,
      isAdmin: activeTabName === 'adminApproval' ? true : false,
    };
    //old API Calling
    // const res = await masterLocationApprovall(payload,setIsLoading);
    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : MasterLocationAssaignApprovalEngine,
      data: commonURL === userInfo?.strUrl ? paylaodForV2 : payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message || res;
    const resStatusCode =
      res?.status ||
      res?.statusCode ||
      res?.statuscode ||
      res?.data?.statusCode ||
      res?.data?.statuscode ||
      res;
    if (res) {
      if (arlURL === userInfo?.strUrl && resStatusCode === 200) {
        saveLogAction({
          payload: {
            newEntity: payload,
            isPeopledesk: true,
            actionType: isApproveOrReject === 'Approve' ? 'Approve' : 'Reject',
          },
        });
      }
      toaster.show({
        message: resMessage,
        type: resMessage?.includes('fail') ? 'error' : 'success',
      });
      navigation.goBack();
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
              locationDetails?.strStatus?.toLowerCase() === 'pending'
                ? true
                : false
            }
            title="Master Location Details"
          />
        </>
      }
      style={styles.container}>
      <View style={styles.paddingVartical}>
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
                {date_formater(locationDetails?.application?.dteCreatedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name={'map'}
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Location Name</Text>
              <Text style={styles.valueText}>
                {locationDetails?.application?.strPlaceName}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name={'map'}
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Location Log</Text>
              <Text style={styles.valueText}>
                {locationDetails?.application?.strAddress}
              </Text>
            </View>
          </View>
          {/* <View style={styles.box}>
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
              <Text style={styles.valueText}>{locationDetails?.currentStage}</Text>
            </View>
          </View> */}
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
              <Text style={styles.valueText}>{locationDetails?.strStatus}</Text>
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

export default AssignedLocationApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
  mapView: {
    width: SIZES.width / 1.001,
    height: SIZES.height / 1.5,
    marginTop: -50,
  },
  ...overtimeStyle,
});
