import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {arlURL, commonURL, rscURL} from '../../../../../App';
import {
  ApproveApplications,
  EmployeeProfileView,
  LeaveApplicationApproval,
  MarkAsSeen,
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
import {LeaveType} from '../../../../interfaces/leave/leave';
import {useRootStore} from '../../../../stores/rootStore';
import LeaveBalanceSheet from '../../application/leave-application/LeaveBalanceSheet';

import CommonImageViewer from '../../../../common/components/CommonImageViewer';
import LeaveBalanceSheetCommon from '../../application/leave-application/LeaveBalanceSheetCommon';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';

const edges: Edge[] = ['right', 'bottom', 'left'];

const LeaveNewApprovalDetails = () => {
  const refRBSheet = useRef();
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const leaveDetails = route?.params?.leaveDetails;
  //@ts-ignore
  const activeTabName = route?.params?.activeTabName;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [details, setLeaveDetails] = useState<LeaveType>();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [isViewerVisible, setViewerVisible] = useState(false);
  const [attachmentUrl, setAttachmentUrl] = useState<any>('');
  const {saveLogAction} = useAuditLogSave();

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
          TableName: 'LeaveApplicationGetByEmployeeIdAndApplicationId',
          intId:
            leaveDetails?.notificationMaster?.intFeatureTableAutoId ||
            //from push notification
            leaveDetails?.intId,
          EmpId:
            leaveDetails?.notificationMaster?.intEmployeeId ||
            //from push notification
            +leaveDetails?.empId,
          businessUnitId: userInfo?.intBusinessUnitId,
        },
      };
      const res = await httpRequest(api_params, () => {});
      setLeaveDetails(res?.[0]);

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

  const approveHandler = async () => {
    const payload = await approveOrReject(false, 'Approve');

    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : LeaveApplicationApproval,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message || res;
    const resStatusCode =
      res?.status ||
      res?.statusCode ||
      res?.statuscode ||
      res?.resStatusCode ||
      res?.data?.statusCode ||
      res?.data?.statuscode ||
      res;
    if (resStatusCode === 200) {
      if (arlURL === userInfo?.strUrl) {
        saveLogAction({
          payload: {
            newEntity: payload,
            isPeopledesk: true,
            actionType: 'Approve',
          },
        });
      }
      navigation.goBack();
      toaster.show({
        message: resMessage,
        type: 'success',
      });
    } else {
      toaster.show({
        message: resMessage,
        type: 'error',
      });
    }
  };
  const rejectHandler = async () => {
    const payload = await approveOrReject(true, 'Reject');

    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : LeaveApplicationApproval,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message || res;
    const resStatusCode =
      res?.status ||
      res?.statusCode ||
      res?.statuscode ||
      res?.resStatusCode ||
      res?.data?.statusCode ||
      res?.data?.statuscode ||
      res;
    if (resStatusCode === 200) {
      if (arlURL === userInfo?.strUrl) {
        saveLogAction({
          payload: {
            newEntity: payload,
            isPeopledesk: true,
            actionType: 'Reject',
          },
        });
      }
      navigation.goBack();
      toaster.show({
        message: resMessage,
        type: 'success',
      });
    } else {
      toaster.show({
        message: resMessage,
        type: 'error',
      });
    }
  };
  // console.log(
  //   'leaveDetails',
  //   JSON.stringify(
  //     JSON.parse(leaveDetails?.strJsonData).ConfigHeaderId,
  //     null,
  //     2,
  //   ),
  // );

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
        leaveDetails?.leaveApplication?.intApplicationId,
      approverEmployeeId: userInfo?.intEmployeeId,
      isReject: isReject,
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
        leaveDetails?.leaveApplication?.intApplicationId ||
        leaveDetails?.intApplicationId ||
        leaveDetails?.applicationId,
      isApprove: isApproveOrReject === 'Approve' ? true : false,
      isReject: isApproveOrReject === 'Reject' ? true : false,
      actionBy: userInfo?.intEmployeeId,
      applicationTypeId:
        leaveDetails?.applicationTypeId ||
        notificationData?.ApplicationTypeId ||
        notificationData?.applicationTypeId,
      isAdmin: activeTabName === 'adminApproval' ? true : false,
    };
    // modPayload.push(payload);
    modPayload.push(commonURL === userInfo?.strUrl ? paylaodForV2 : payload);

    if (modPayload?.length > 0) {
      return modPayload;
    }
  };

  const attachmentOnClick = async (fileId: number) => {
    let url = '';
    if (commonURL === userInfo?.strUrl) {
      url = `https://app.peopledesk.io/api/Document/DownloadFile?id=${fileId}`;
    } else {
      url = `https://arl.peopledesk.io/api/Document/DownloadFile?id=${fileId}`;
    }

    try {
      const response = await fetch(url, {
        method: 'GET',
      });

      const contentType = response.headers.get('Content-Type')?.toLowerCase();

      if (contentType?.includes('application/pdf')) {
        navigation.navigate('PDFViewer', {
          fileId: fileId,
          fileName: `Attachment`,
        });
      } else {
        setAttachmentUrl(fileId);
        setViewerVisible(true);
      }
    } catch (error) {
      console.error('Error checking file type:', error);
    }
  };

  return (
    <ContainerNew
      isRefresh={false}
      edges={edges}
      isBottomDoubleButton={
        details?.Status?.trim() === 'Pending' ||
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
          title="Leave Details"
          infoIconPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          // statusText={leaveDetails?.leaveApplication?.strStatus || ''}
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
                {/* <Text style={styles.cardCommonText}>
                  {leaveDetails?.notificationMaster?.intEmployeeId ||
                    leaveDetails?.leaveApplication?.intEmployeeId}
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

      <View style={styles.textPart}>
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
                details?.ApplicationDate ||
                  leaveDetails?.leaveApplication?.dteApplicationDate,
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
            <Text style={styles.subText}>Leave Type</Text>
            <Text style={styles.valueText}>
              {details?.LeaveType || leaveDetails?.leaveType}
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
                details?.FromDate ||
                  leaveDetails?.leaveApplication?.dteFromDate,
              )}
              {' - '}
              {date_formater(
                details?.ToDate || leaveDetails?.leaveApplication?.dteToDate,
              )}
            </Text>
          </View>
        </View>

        {userInfo?.strUrl === rscURL &&
        leaveDetails?.leaveApplication?.numLeaveTime ? (
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
              <Text style={styles.subText}>Total Hours</Text>
              <Text style={styles.valueText}>
                {leaveDetails?.leaveApplication?.numLeaveTime
                  ? leaveDetails?.leaveApplication?.numLeaveTime / 60
                  : 0}
              </Text>
            </View>
          </View>
        ) : null}

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
                details?.FromDate ||
                  leaveDetails?.leaveApplication?.dteFromDate,
                details?.ToDate || leaveDetails?.leaveApplication?.dteToDate,
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
              {details?.Reason || leaveDetails?.leaveApplication?.strReason}
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
              {details?.strAddressDuetoLeave ||
                leaveDetails?.leaveApplication?.strAddressDuetoLeave}
            </Text>
          </View>
        </View>
        {details?.Status === 'Approved' ||
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
                {details?.waitingStage ||
                  details?.WaitingStage ||
                  leaveDetails?.waitingStage ||
                  leaveDetails?.WaitingStage ||
                  details?.CurrentStage ||
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
              {details?.Status || leaveDetails?.status}
            </Text>
          </View>
        </View>

        {leaveDetails?.leaveApplication?.intDocumentFileId ? (
          <TouchableOpacity
            onPress={() =>
              attachmentOnClick(
                leaveDetails?.leaveApplication?.intDocumentFileId,
              )
            }>
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
        modalText={'Are you sure to approve Leave application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={'Are you sure to reject Leave application?'}
        deleteText={'Confirm'}
      />

      {commonURL === userInfo?.strUrl ? (
        <LeaveBalanceSheetCommon
          refRBSheet={refRBSheet}
          employeeId={
            leaveDetails?.notificationMaster?.intEmployeeId ||
            leaveDetails?.leaveApplication?.intEmployeeId ||
            leaveDetails?.empId
          }
          workplaceGroupId={
            leaveDetails?.notificationMaster?.intWorkplaceGroupId ||
            leaveDetails?.leaveApplication?.intWorkplaceGroupId ||
            userInfo?.intWorkplaceGroupId
          }
          buId={userInfo?.intBusinessUnitId}
        />
      ) : (
        <LeaveBalanceSheet
          refRBSheet={refRBSheet}
          employeeId={
            leaveDetails?.notificationMaster?.intEmployeeId ||
            leaveDetails?.leaveApplication?.intEmployeeId
          }
          workplaceGroupId={
            leaveDetails?.notificationMaster?.intWorkplaceGroupId ||
            leaveDetails?.leaveApplication?.intWorkplaceGroupId ||
            userInfo?.intWorkplaceGroupId
          }
          buId={userInfo?.intBusinessUnitId}
        />
      )}

      <CommonImageViewer
        isVisible={isViewerVisible}
        onClose={() => setViewerVisible(false)}
        imageUrl={
          commonURL === userInfo?.strUrl
            ? `https://app.peopledesk.io/api/Document/DownloadFile?id=${attachmentUrl}`
            : `https://arl.peopledesk.io/api/Document/DownloadFile?id=${attachmentUrl}`
        }
      />
    </ContainerNew>
  );
};

export default LeaveNewApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 50,
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
    marginTop: 16,
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
  padding: {
    height: Platform.OS === 'ios' ? '84%' : '87%',
  },
  bottomButton: {
    // position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: 0,
    paddingBottom: 28,
    paddingTop: 10,
  },
  textPart: {paddingHorizontal: 16, paddingBottom: 100, paddingTop: 16},
  firstBtn: {
    backgroundColor: COLORS.newGray,
    borderColor: COLORS.offDay,
    borderWidth: 1,
  },
  firstBtnTxt: {
    color: COLORS.textColor,
    fontWeight: '600',
  },
});
