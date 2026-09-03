import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';

//@ts-ignore
import {LoanCRUD} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {date_formater} from '../../../../common/services/dateFormater';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const LoanApplicationDetails = () => {
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const route = useRoute();
  const toaster = useToast();
  //@ts-ignore
  const {loanDetails} = route?.params;
  const [isModalShow, setIsModalShow] = useState(false);

  const deleteHandler = async () => {
    const payload = {
      partType: 'LoanDelete',
      intAccountId: userInfo?.intAccountId,
      loanApplicationId: loanDetails?.loanApplicationId,
      employeeId: loanDetails?.employeeId,
      loanTypeId: loanDetails?.loanTypeId,
      loanAmount: loanDetails?.loanAmount,
      numberOfInstallment: loanDetails?.numberOfInstallment,
      createdBy: loanDetails?.intCreatedBy,
      numberOfInstallmentAmount: loanDetails?.numberOfInstallmentAmount,
      description: loanDetails?.Description1,
      fileUrl: loanDetails?.fileUrl,
      applicationDate: loanDetails?.applicationDate,
      approveBy: loanDetails?.approveBy,
      approveLoanAmount: loanDetails?.approveLoanAmount,
      approveNumberOfInstallment: loanDetails?.approveNumberOfInstallment,
      effectiveDate: loanDetails?.effectiveDate,
      rejectBy: loanDetails?.rejectBy,
      referenceNo: loanDetails?.referenceNo,
      isActive: false,
      insertByUserId: loanDetails?.insertByUserId,
      insertDateTime: loanDetails?.insertDateTime,
      updateByUserId: loanDetails?.updateByUserId,
      isApprove: false,
      isReject: false,
      remainingBalance: loanDetails?.remainingBalance,
    };

    const api_params = {
      url: LoanCRUD,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});

    setIsModalShow(!isModalShow);
    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
    if (res?.StatusCode === 500) {
      toaster.show({message: res?.Message, type: 'error'});
    }
  };
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Loan Details"
          // deleteIcon={
          //   loanDetails?.applicationStatus?.trim().toLowerCase() === 'pending' ? 'delete' : ''
          // }
          // deleteIconPress={() => setIsModalShow(true)}
          alterIcon={
            loanDetails?.applicationStatus?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateEditLoanApplication', {
              loanDetails: loanDetails,
            })
          }
        />
      }
      style={styles.container}>
      <View>
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
              {date_formater(loanDetails?.applicationDate)}
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
            <Text style={styles.subText}>Loan Type</Text>
            <Text style={styles.valueText}>
              {loanDetails?.loanType || '---'}
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
            <Text style={styles.subText}>Effective Date</Text>
            <Text style={styles.valueText}>
              {date_formater(loanDetails?.effectiveDate)}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <McIcon
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Loan Amount</Text>
            <Text style={styles.valueText}>{loanDetails?.loanAmount}</Text>
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
              {loanDetails?.numberOfInstallment}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <McIcon
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Amount Per Installment</Text>
            <Text style={styles.valueText}>
              {loanDetails?.numberOfInstallmentAmount}
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
              {loanDetails?.applicationStatus}
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
            <Text style={styles.subText}>Loan Status</Text>
            <Text style={styles.valueText}>
              {loanDetails?.installmentStatus}
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
          <View style={[styles.textRightPart, styles.borderBottom]}>
            <Text style={styles.subText}>Description</Text>
            <Text style={styles.valueText}>{loanDetails?.description}</Text>
          </View>
        </View>
        {/* <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon name="today" size={25} color={COLORS.iconColor} style={styles.centerText} />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Reschedule Date</Text>
            <Text style={styles.valueText}>{date_formater(loanDetails?.Reschedule)}</Text>
          </View>
        </View> */}
        {/* <View style={styles.box}>
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
            <Text style={styles.valueText}>{loanDetails?.fileUrl}</Text>
          </View>
        </View> */}
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => deleteHandler()}
        modalText={'Are you sure to delete the loan application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default LoanApplicationDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  subText: {
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  valueText: {
    fontSize: 14,
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

  borderBottom: {borderBottomWidth: 0},
});
