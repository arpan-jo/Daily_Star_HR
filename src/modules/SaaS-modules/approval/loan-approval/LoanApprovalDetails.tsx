import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  ApproveApplications,
  LoanApplicationApproval,
} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {date_formater} from '../../../../common/services/dateFormater';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import {overtimeStyle} from '../../application/overtime-application/OvertimeApplicationDetails';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}
const LoanApprovalDetails = ({route}: props) => {
  const navigation = useNavigation();
  const loanDetails = route?.params?.loanDetails;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    const payload = [
      {
        applicationId: loanDetails?.intLoanApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];
    let payloadForV2 = [
      {
        configHeaderId: loanDetails?.configHeaderId,
        approvalTransactionId: loanDetails?.id,
        applicationId: loanDetails?.intLoanApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: loanDetails?.applicationTypeId,
      },
    ];
    const api_params = {
      // url: LoanApplicationApproval,
      url:
        commonURL === userInfo?.strUrl
          ? ApproveApplications
          : LoanApplicationApproval,
      data: commonURL === userInfo?.strUrl ? payloadForV2 : payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    if (res) {
      navigation.goBack();
      toaster.show({message: res?.message || res, type: 'success'});
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
            loanDetails?.application?.strStatus === 'Pending' ? true : false
          }
          title="Loan Details"
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
              leaveDetails: {
                EmployeeId: loanDetails?.application?.intEmployeeId,
              },
              isFromApproval: true,
            })
          }>
          <View style={styles.card}>
            <View style={styles.cardImageText}>
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />

              <View style={styles.cardText}>
                <Text style={styles.name}>{loanDetails?.strEmployeeName}</Text>
                {/* <Text style={styles.cardCommonText}>---</Text> */}
                <Text style={styles.cardCommonText}>
                  {loanDetails?.application?.intEmployeeId}
                </Text>
                <Text style={styles.cardCommonText}>
                  {loanDetails?.strDesignation}
                </Text>
                <Text style={styles.cardCommonText}>
                  {loanDetails?.strDepartment}
                </Text>
              </View>
            </View>
            <MIcon name="arrow-forward" size={25} color={'#667085'} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Loan application Details */}

      <View style={styles.topSectionBottomPart}>
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
              {date_formater(loanDetails?.application?.dteApplicationDate)}
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
            <Text style={styles.valueText}>{loanDetails?.strLoanType}</Text>
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
            <Text style={styles.subText}>Effective Date</Text>
            <Text style={styles.valueText}>
              {date_formater(loanDetails?.application?.dteEffectiveDate)}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <Icons
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Loan Amount</Text>
            <Text style={styles.valueText}>
              {'৳ '}
              {loanDetails?.intLoanAmount}
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
            <Text style={styles.subText}>Installment Number</Text>
            <Text style={styles.valueText}>
              {loanDetails?.intNumberOfInstallment}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <Icons
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Amount Per Installment</Text>
            <Text style={styles.valueText}>
              {'৳ '}
              {loanDetails?.application?.intNumberOfInstallmentAmount}
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
              {loanDetails?.waitingStage ||
                loanDetails?.WaitingStage ||
                loanDetails?.currentStage}
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
              {loanDetails?.application?.strStatus}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="subject"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={[styles.textRightPart, styles.borderBtmWidth]}>
            <Text style={styles.subText}>Description</Text>
            <Text style={styles.valueText}>
              {loanDetails?.application?.strDescription}
            </Text>
          </View>
        </View>
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveOrReject(false, 'Approve')}
        modalText={'Are you sure to approve Loan application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => approveOrReject(true, 'Reject')}
        modalText={'Are you sure to reject Loan application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default LoanApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 45,
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
    marginTop: 10,
    borderColor: COLORS.white,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
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
  topSectionBottomPart: {
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 24,
    marginTop: 12,
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
  ...overtimeStyle,
});
