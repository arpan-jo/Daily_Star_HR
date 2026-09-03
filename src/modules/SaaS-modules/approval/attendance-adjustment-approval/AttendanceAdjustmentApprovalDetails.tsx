import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';

import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import {
  ApproveApplications,
  ManualAttendanceApprovalEngine} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';

const edges: Edge[] = ['right', 'bottom', 'left'];

const AttendanceAdjustmentApprovalDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const {empDetails} = route?.params;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const {saveLogAction} = useAuditLogSave();
  const [_isLoading, _setIsLoading] = useState(false);
  //@ts-ignore
  const activeTabName = route?.params?.activeTabName;

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    const payload = [
      {
        applicationId: empDetails?.intId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];
    // old api calling
    // const res = await postAttendanceApproval(payload, setIsLoading);
    let paylaodForV2 = [
      {
        configHeaderId: empDetails?.configHeaderId,
        approvalTransactionId: empDetails?.id,
        applicationId: empDetails?.intId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: empDetails?.applicationTypeId,
        isAdmin: activeTabName === 'adminApproval' ? true : false,
      },
    ];
    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : ManualAttendanceApprovalEngine,
      data: commonURL === userInfo?.strUrl ? paylaodForV2 : payload,
      method: 'post',
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    if (res?.status === 200 || res?.statusCode === 200) {
      saveLogAction({
        payload: {
          newEntity: payload,
          isPeopledesk: true,
          actionType: isApproveOrReject === 'Approve' ? 'Approve' : 'Reject',
        },
      });
      toaster.show({
        message: res?.message || res?.data || res?.data?.message || res,
        type: 'success',
      });
      navigation.goBack();
    }
    if (res?.status === 500 || res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
    if (res?.StatusCode === 500) {
      toaster.show({message: res?.Message, type: 'error'});
    }
  };

  return (
    <ContainerNew
      isRefresh={false}
      edges={edges}
      isBottomDoubleButton={true}
      firstBtnTxt="Reject"
      firstBtmBtnPress={() => setIsModalShow2(true)}
      firstBtnStyle={styles.firstBtn}
      firstBtnTxtStyle={styles.firstBtnTxt}
      secondBtnTxt="Approve"
      secondBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          statusText={
            empDetails?.application?.strStatus === 'Pending' ? true : false
          }
          title="Attendance Details"
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
              leaveDetails: {EmployeeId: empDetails?.intEmployeeId},
              isFromApproval: true,
            })
          }>
          <View style={styles.card}>
            <View style={styles.cardImageText}>
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />

              <View style={styles.cardText}>
                <Text style={styles.name}>{empDetails?.strEmployeeName}</Text>
                <Text style={styles.cardCommonText}>
                  {empDetails?.strEmploymentType}
                </Text>
                <Text style={styles.cardCommonText}>
                  {empDetails?.intEmployeeId}
                </Text>
                <Text style={styles.cardCommonText}>
                  {empDetails?.strDesignation}
                </Text>
                <Text style={styles.cardCommonText}>
                  {empDetails?.strDepartment}
                </Text>
              </View>
            </View>
            <MIcon name="arrow-forward" size={25} color={'#667085'} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSection}>
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
              {date_formater(empDetails?.dteAttendanceDate)}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="navigation"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Request Attendance</Text>
            <Text style={styles.valueText}>{empDetails?.strRequestStatus}</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="navigation"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Actual Attendance</Text>
            <Text style={styles.valueText}>
              {empDetails?.application?.strStatus}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="timelapse"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>In time</Text>
            <Text style={styles.valueText}>
              {empDetails?.timeInTime || '--'}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="timelapse"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Out time</Text>
            <Text style={styles.valueText}>
              {empDetails?.timeOutTime || '--'}
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
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Waiting Stage</Text>
            <Text style={styles.valueText}>
              {empDetails?.waitingStage ||
                empDetails?.WaitingStage ||
                empDetails?.currentStage}
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
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Status</Text>
            <Text style={styles.valueText}>
              {empDetails?.application?.strStatus}
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
          <View style={[styles.textRightPart, styles.borderBtmWidth]}>
            <Text style={styles.subText}>Reason</Text>
            <Text style={styles.valueText}>
              {empDetails?.application?.strRemarks}
            </Text>
          </View>
        </View>
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveOrReject(false, 'Approve')}
        modalText={'Are you sure to approve Attendence Adjustment application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => approveOrReject(true, 'Reject')}
        modalText={'Are you sure to reject Attendence Adjustment application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default AttendanceAdjustmentApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 46,
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
  btnText2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  headBox: {
    marginHorizontal: 16,
    marginTop: 16,
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
  bottomSection: {
    paddingHorizontal: 16,
    paddingTop: 9,
    marginTop: 17,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    // position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  borderBtmWidth: {
    borderBottomWidth: 0,
  },
  padding: {
    // paddingVertical: 16,
    height: Platform.OS === 'ios' ? '84%' : '87%',
  },
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
