import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {commonURL} from '../../../../../App';
import {
  ApproveApplications,
  EmployeeProfileView,
  MarkAsSeen,
  MovementApplicationApproval,
  PeopleDeskAllLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater, getDay} from '../../../../common/services/dateFormater';
import {getImageURL} from '../../../../common/services/getImage';
import {ProfileDataType} from '../../../../interfaces/dashboard/employeeDashboard';
import {MovementType} from '../../../../interfaces/movement/movement';
import {useRootStore} from '../../../../stores/rootStore';
import CommonImageViewer from '../../../../common/components/CommonImageViewer';

const edges: Edge[] = ['right', 'bottom', 'left'];

const MovementNewApprovalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const leaveDetails = route?.params?.leaveDetails;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [moveDetails, setMoveDetails] = useState<MovementType>();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  //@ts-ignore
  const activeTabName = route?.params?.activeTabName;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (leaveDetails?.notificationId) {
        const api_params = {
          url: MarkAsSeen,
          data: {
            notificationId: leaveDetails?.notificationId,
            employeeId: userInfo?.intEmployeeId,
            accountId: userInfo?.intAccountId,
          },
          method: 'put',
          isPostOrPutWithParams: true,
        };
        const _res = await httpRequest(api_params, () => {});
      }
      const api_params = {
        url: PeopleDeskAllLanding,
        data: {
          TableName: 'MovementApplicationGetByEmployeeIdAndApplicationId',
          intId:
            leaveDetails?.notificationMaster?.intFeatureTableAutoId ||
            //from push notification
            +leaveDetails?.intId ||
            +leaveDetails?.applicationId,
          EmpId:
            leaveDetails?.notificationMaster?.intEmployeeId ||
            //from push notification
            +leaveDetails?.empId ||
            leaveDetails?.employeeId,
          businessUnitId: userInfo?.intBusinessUnitId,
        },
        isConsole: true,
      };
      const res = await httpRequest(api_params, () => {});
      setMoveDetails(res?.[0]);

      const api_params2 = {
        url: EmployeeProfileView,
        data:
          commonURL === userInfo?.strUrl
            ? {
                employeeId:
                  leaveDetails?.notificationMaster?.intEmployeeId ||
                  //from push notification
                  +leaveDetails?.empId,
                businessUnitId: userInfo?.intBusinessUnitId,
                workplaceGroupId: userInfo?.intWorkplaceGroupId,
              }
            : {
                employeeId:
                  leaveDetails?.notificationMaster?.intEmployeeId ||
                  //from push notification
                  +leaveDetails?.empId,
              },
      };
      const profileRes = await httpRequest(api_params2, () => {});
      setProfileData(profileRes);
    },
    [leaveDetails?.notificationMaster?.intFeatureTableAutoId],
  );
  console.log('leaveDetails', JSON.stringify(leaveDetails, null, 2));
  const approveHandler = async () => {
    const payload = await approveOrReject(false, 'Approve');
    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : MovementApplicationApproval,
      data: payload,
      method: 'post',
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message || res;

    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode ||
      200 ||
      res?.resStatusCode === 200
    ) {
      navigation.goBack();
      toaster.show({message: resMessage, type: 'success'});
    } else {
      toaster.show({message: resMessage, type: 'error'});
    }
  };
  const rejectHandler = async () => {
    const payload = await approveOrReject(true, 'Reject');
    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : MovementApplicationApproval,
      data: payload,
      method: 'post',
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message || res;
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode ||
      200 ||
      res?.resStatusCode === 200
    ) {
      navigation.goBack();
      toaster.show({message: resMessage, type: 'success'});
    } else {
      toaster.show({message: resMessage, type: 'error'});
    }
  };

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    const notificationData = leaveDetails?.strJsonData
      ? JSON.parse(leaveDetails?.strJsonData || {})
      : {};
    let modPayload = [];
    const payload = {
      applicationId:
        leaveDetails?.notificationMaster?.intFeatureTableAutoId ||
        leaveDetails?.movementApplication?.intApplicationId,
      approverEmployeeId: userInfo?.intEmployeeId,
      isReject: isReject,
      fromDate:
        moveDetails?.FromDate || leaveDetails?.movementApplication?.dteFromDate,
      toDate:
        moveDetails?.ToDate || leaveDetails?.movementApplication?.dteToDate,
      accountId: userInfo?.intAccountId,
      isAdmin: userInfo?.isOfficeAdmin,
    };

    const paylaodForV2 = {
      configHeaderId:
        leaveDetails?.configHeaderId ||
        notificationData?.configHeaderId ||
        notificationData?.ConfigHeaderId,
      approvalTransactionId:
        leaveDetails?.id ||
        leaveDetails?.approvalTransactionId ||
        notificationData?.ApprovalTransactionId ||
        notificationData?.approvalTransactionId,
      applicationId:
        leaveDetails?.notificationMaster?.intFeatureTableAutoId ||
        leaveDetails?.movementApplication?.intApplicationId ||
        leaveDetails?.intApplicationId ||
        leaveDetails?.applicationId,
      isApprove: isApproveOrReject === 'Approve' ? true : false,
      isReject: isApproveOrReject === 'Reject' ? true : false,
      actionBy: userInfo?.intEmployeeId,
      //@ts-ignore
      applicationTypeId:
        leaveDetails?.applicationTypeId ||
        notificationData?.ApplicationTypeId ||
        notificationData?.applicationTypeId,
      isAdmin: activeTabName === 'adminApproval' ? true : false,
    };
    // modPayload.push(payload);
    modPayload.push(commonURL === userInfo?.strUrl ? paylaodForV2 : payload);

    if (modPayload.length > 0) {
      return modPayload;
    }
  };
  return (
    <ContainerNew
      isRefresh={false}
      edges={edges}
      isBottomDoubleButton={
        moveDetails?.Status?.trim() === 'Pending' ||
        leaveDetails?.status?.trim() === 'Pending'
          ? true
          : false
      }
      firstBtnTxt="Reject"
      firstBtmBtnPress={() => setIsModalShow2(true)}
      firstBtnStyle={styles.firstBtn}
      firstBtnTxtStyle={styles.firstBtnTxt}
      secondBtnTxt="Approve"
      secondBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          title="Movement Details"
          statusText={leaveDetails?.movementApplication?.strStatus || ''}
        />
      }
      style={styles.container}>
      {/* Head Card */}
      <View style={styles.headBox}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.touchCard}
          onPress={() =>
            //@ts-ignore
            navigation.navigate('AllEmployeeDetails', {
              leaveDetails,
              isFromApproval: true,
            })
          }>
          <View style={styles.card}>
            <View style={styles.cardImageText}>
              {profileData?.employeeProfileLandingView?.intEmployeeImageUrlId ||
              leaveDetails?.profileUrlId ? (
                <FastImage
                  source={{
                    uri: getImageURL(
                      profileData?.employeeProfileLandingView
                        ?.intEmployeeImageUrlId || leaveDetails?.profileUrlId,
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
                  {profileData?.employeeProfileLandingView?.strEmployeeName ||
                    leaveDetails?.employeeName}
                </Text>
                <Text style={styles.cardCommonText}>
                  {moveDetails?.MovementType || leaveDetails?.movementType}
                </Text>
                {/* <Text style={styles.cardCommonText}>
                  {leaveDetails?.notificationMaster?.intEmployeeId ||
                    leaveDetails?.movementApplication?.intEmployeeId}
                </Text> */}
                <Text style={styles.cardCommonText}>
                  {profileData?.employeeProfileLandingView?.strDesignation ||
                    leaveDetails?.designation}
                </Text>
                <Text style={styles.cardCommonText}>
                  {profileData?.employeeProfileLandingView?.strDepartment ||
                    leaveDetails?.department}
                </Text>
              </View>
            </View>
            <MIcon name="arrow-forward" size={25} color={'#667085'} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.applicationDetails}>
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
              {date_formater(
                moveDetails?.ApplicationDate ||
                  leaveDetails?.movementApplication?.dteCreatedAt,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="tour"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Movement Type</Text>
            <Text style={styles.valueText}>
              {moveDetails?.MovementType || leaveDetails?.movementType}
            </Text>
          </View>
        </View>

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
            <Text style={styles.subText}>Date Range</Text>
            <Text style={styles.valueText}>
              {date_formater(
                moveDetails?.FromDate ||
                  leaveDetails?.movementApplication?.dteFromDate,
              )}
              {' - '}
              {date_formater(
                moveDetails?.ToDate ||
                  leaveDetails?.movementApplication?.dteToDate,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="schedule"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Duration</Text>
            <Text style={styles.valueText}>
              {getDay(
                moveDetails?.FromDate ||
                  leaveDetails?.movementApplication?.dteFromDate,
                moveDetails?.ToDate ||
                  leaveDetails?.movementApplication?.dteToDate,
              )}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="assignment"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Reason</Text>
            <Text style={styles.valueText}>
              {moveDetails?.Reason ||
                leaveDetails?.movementApplication?.strReason}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="location-on"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Loaction</Text>
            <Text style={styles.valueText}>
              {moveDetails?.Location ||
                leaveDetails?.movementApplication?.strLocation}
            </Text>
          </View>
        </View>
        {moveDetails?.Status === 'Approved' ||
        leaveDetails?.status === 'Approved' ? null : (
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
                {moveDetails?.waitingStage ||
                  moveDetails?.WaitingStage ||
                  leaveDetails?.waitingStage ||
                  leaveDetails?.WaitingStage ||
                  moveDetails?.CurrentStage ||
                  leaveDetails?.currentStage}
              </Text>
            </View>
          </View>
        )}

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
            <Text style={styles.subText}>Status</Text>
            <Text style={styles.valueText}>
              {moveDetails?.Status || leaveDetails?.status}
            </Text>
          </View>
        </View>

        {leaveDetails?.movementApplication?.intDocumentFileId ? (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.box}>
              <View style={styles.iconBox}>
                <MIcon
                  name="file-present"
                  size={25}
                  color={COLORS.iconColor}
                  style={styles.centerText}
                />
              </View>
              <View style={styles.textRightPart}>
                <Text style={styles.subText}>File</Text>

                <Text style={[styles.valueText, {color: COLORS.movement}]}>
                  Attachment
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveHandler()}
        modalText={'Are you sure to approve Movement application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={'Are you sure to reject Movement application?'}
        deleteText={'Confirm'}
      />
      <CommonImageViewer
        imageUrl={getImageURL(
          leaveDetails?.movementApplication?.intDocumentFileId &&
            leaveDetails?.movementApplication?.intDocumentFileId,
        )}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ContainerNew>
  );
};

export default MovementNewApprovalDetails;

const styles = StyleSheet.create({
  container: {backgroundColor: COLORS.white, paddingBottom: 50},
  box: {flexDirection: 'row', flexWrap: 'wrap'},
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  subText: {fontSize: 14, lineHeight: 20, color: COLORS.graySubText},
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
    marginTop: 24,
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
    marginTop: 24,
    marginHorizontal: 8,
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textColor,
  },
  btnText2: {fontSize: 14, fontWeight: '600', lineHeight: 20},

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
    marginTop: 10,
  },
  touchCard: {padding: 16},
  profileImage: {width: 66, height: 66, borderRadius: 50},
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
  padding: {height: Platform.OS === 'ios' ? '84%' : '87%'},
  bottomButton: {
    // position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 25,
    paddingBottom: 28,
    paddingTop: 10,
  },
  applicationDetails: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 16,
  },
  firstBtn: {
    backgroundColor: COLORS.newGray,
    borderColor: COLORS.offDay,
    borderWidth: 1,
  },
  firstBtnTxt: {color: COLORS.textColor, fontWeight: '600'},
});
