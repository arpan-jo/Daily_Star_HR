import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';

import {useRootStore} from '../../../../stores/rootStore';
import {EmployeePaySlipReport} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import Column from '../../../../common/components/Column';
import Row from '../../../../common/components/Row';

import {COLORS} from '../../../../common/constant/Themes';
import dayjs from 'dayjs';
import CustomButtonNew from '../../../../common/components/CustomButton';
import LoadingContainer from '../../../../common/components/Loading';
import NoData from '../../../../common/components/NoData';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import {useForm} from 'react-hook-form';
const edges: Edge[] = ['right', 'bottom', 'left'];

const PaySlipDetailsARL = () => {
  const currentMonth = dayjs().month();

  const currentYear = dayjs().year();
  const monthDDL = [
    {
      value: 1,
      label: 'January',
    },
    {
      value: 2,
      label: 'February',
    },
    {
      value: 3,
      label: 'March',
    },
    {
      value: 4,
      label: 'April',
    },
    {
      value: 5,
      label: 'May',
    },
    {
      value: 6,
      label: 'June',
    },
    {
      value: 7,
      label: 'July',
    },
    {
      value: 8,
      label: 'August',
    },
    {
      value: 9,
      label: 'September',
    },
    {
      value: 10,
      label: 'October',
    },
    {
      value: 11,
      label: 'November',
    },
    {
      value: 12,
      label: 'December',
    },
  ];

  const [isModalShow, setIsModalShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deductionList, setDeductionList] = useState<any>([]);
  const [additionList, setAdditionList] = useState<any>([]);
  const [salaryInfo, setSalaryInfo] = useState<any>({});
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const {control, handleSubmit, setValue, watch} = useForm({
    defaultValues: {
      year: {
        value: currentMonth === 0 ? currentYear - 1 : currentYear,
        label: currentMonth === 0 ? currentYear - 1 : currentYear,
      },
      month: {
        value:
          currentMonth === 0
            ? monthDDL?.[currentMonth + 11]?.value
            : monthDDL?.[currentMonth + 1]?.value,
        label:
          currentMonth === 0
            ? monthDDL?.[currentMonth + 11]?.label
            : monthDDL?.[currentMonth + 1]?.label,
      },
    },
  });
  //@ts-ignore
  const empId = useRoute()?.params?.empId || userInfo?.intEmployeeId;
  console.log('currentMonth', currentMonth);
  // useAsyncEffect(
  //   async isMounted => {
  //     if (!isMounted()) {
  //       return null;
  //     }
  //   },
  //   [isFocused, month],
  // );

  const getDataFromAPI = async () => {
    const api_params = {
      url: EmployeePaySlipReport,
      data: {
        partName: 'SalaryGenerateHeaderByPayrollMonthNEmployeeId',
        intEmployeeId: empId,
        intMonthId: watch('month')?.value,
        intYearId: watch('year')?.value,
        intSalaryGenerateRequestId: 0,
      },
    };
    const res = await httpRequest(api_params, setIsLoading);
    if (res) {
      setSalaryInfo(res);

      const additions = [
        {
          title: 'Monthly Gross Salary',
          number: res?.numMonthlyGrossSalary,
        },
        {
          title: 'Motorcycle Allowance',
          number: res?.motorCycleAllowance,
        },
        {
          title: 'Special Allowance',
          number: res?.specialAllowance,
        },
        {
          title: 'Mobile Allowance',
          number: res?.numMobileAllowance,
        },

        {
          title: 'Driver/Car Allowance',
          number: res?.numDriverAllowance,
        },
        {
          title: 'Non Tab Benefit',
          number: res?.nonTabBenefit,
        },
        {
          title: 'Over Time',
          number: res?.numOverTimeAmount,
        },
        {
          title: 'Attendance Benefit',
          number: res?.attendanceBenefit,
        },
        {
          title: 'Others Addition',
          number: res?.numOthersAddition,
        },
      ];
      setAdditionList(additions);
      const deductions = [
        {
          title: 'PL Amount',
          number: res?.numPLAmount,
        },
        {
          title: 'Tax',
          number: res?.numTaxAmount,
        },
        {
          title: 'Loan',
          number: res?.numLoanAmount,
        },
        {
          title: 'PF',
          number: res?.numPFAmount,
        },
        {
          title: 'Subsidiary Lunch',
          number: res?.numLunchDeduct,
        },
        {
          title: 'Fair Price',
          number: res?.numFairPrice,
        },
        {
          title: 'Leave Without Pay (LWP)',
          number: res?.numLeaveWithoutPay,
        },
        {
          title: 'Late Punishment',
          number: res?.numLatePunishment,
        },
        {
          title: 'Absent Punishment',
          number: res?.absentPunishment,
        },
        {
          title: 'Others Deduction',
          number: res?.numOthersDeduction,
        },
      ];
      setDeductionList(deductions);
    }
  };

  const totalDeductions = deductionList?.reduce((total: any, item: any) => {
    const amount = parseFloat(item?.number) || 0;
    return total + amount;
  }, 0);

  const totalAdditions = additionList?.reduce((total: any, item: any) => {
    const amount = parseFloat(item?.number) || 0;
    return total + amount;
  }, 0);

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          title="Pay Slip"
          // alterIcon="calendar-month"
          // alterIconPress={() => setIsModalShow(true)}
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      <Row rowStyle={{paddingHorizontal: 16, marginTop: 8}}>
        <Column colWidth={'48%'}>
          <CustomDropDownNew
            control={control}
            label="Year"
            name="year"
            data={[
              {value: currentYear - 2, label: currentYear - 2},
              {value: currentYear - 1, label: currentYear - 1},
              {value: currentYear, label: currentYear},
            ]}
            onChange={(opt: any) => {
              setValue('year', opt);
              setSalaryInfo({});
            }}
            placholder="Select Year"
          />
        </Column>
        <Column colWidth={'48%'} colStyle={{marginLeft: 8}}>
          <CustomDropDownNew
            control={control}
            label="Month"
            name="month"
            data={monthDDL}
            onChange={(opt: any) => {
              setValue('month', opt);
              setSalaryInfo({});
            }}
            placholder="Select Month"
          />
        </Column>
      </Row>
      <Row
        rowStyle={{
          paddingHorizontal: 16,
          marginTop: 12,
        }}>
        <CustomButtonNew
          btnText="Show"
          onBtnPress={handleSubmit(getDataFromAPI)}
          btnstyle={{flex: 1}}
        />
      </Row>

      {salaryInfo?.numMonthlyGrossSalary ? (
        <>
          <View style={styles.padding}>
            <View style={styles.box}>
              <View style={styles.width48}>
                <Text style={styles.txtHeading}>Salary Month</Text>
                <Text style={styles.txtMain}>
                  {watch('month')?.label}, {watch('year')?.label}
                </Text>
              </View>
              <View style={styles.width48}>
                <Text style={styles.txtHeading}>Bank</Text>
                <Text style={styles.txtMain}>
                  {salaryInfo?.financialInstitution || ''}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.width48}>
                <Text style={styles.txtHeading}>Net Pay</Text>
                <Text style={styles.txtMain}>
                  {salaryInfo?.numTotalNetPayable || ''}
                  {/* {getNetpay(totalBenefits, totalDeducton)} */}
                </Text>
              </View>
            </View>
          </View>
          <Column colWidth={'100%'} colStyle={{paddingHorizontal: 16}}>
            <CustomTextNew text={'Additions'} txtSize={18} txtWeight={'500'} />
            {additionList?.length > 0
              ? additionList?.map((item: any, index: number) => (
                  <Row key={index}>
                    <Column colWidth={'60%'}>
                      <CustomTextNew
                        text={item?.title}
                        txtAlign={'left'}
                        lineHight={20}
                      />
                    </Column>
                    <Column colWidth={'40%'}>
                      <CustomTextNew
                        text={item?.number}
                        txtAlign={'right'}
                        lineHight={20}
                      />
                    </Column>
                  </Row>
                ))
              : null}
            <View
              style={{
                borderBottomWidth: 0.8,
                marginVertical: 5,
                borderBottomColor: COLORS.graySubText,
              }}
            />
            <Row>
              <Column colWidth={'60%'}>
                <CustomTextNew
                  text={'Total Benefits'}
                  txtAlign={'left'}
                  lineHight={20}
                  txtWeight={'500'}
                />
              </Column>
              <Column colWidth={'40%'}>
                <CustomTextNew
                  text={totalAdditions || ''}
                  txtAlign={'right'}
                  lineHight={20}
                  txtWeight={'500'}
                />
              </Column>
            </Row>
            <View
              style={{
                borderBottomWidth: 0.8,
                marginVertical: 5,
                borderBottomColor: COLORS.graySubText,
              }}
            />
          </Column>

          <Column
            colWidth={'100%'}
            colStyle={{paddingHorizontal: 16, marginTop: 15}}>
            <CustomTextNew text={'Deductions'} txtSize={18} txtWeight={'500'} />
            {deductionList?.length > 0
              ? deductionList?.map((item: any, index: number) => (
                  <Row key={index}>
                    <Column colWidth={'60%'}>
                      <CustomTextNew
                        text={item?.title}
                        txtAlign={'left'}
                        lineHight={20}
                      />
                    </Column>
                    <Column colWidth={'40%'}>
                      <CustomTextNew
                        text={item?.number}
                        txtAlign={'right'}
                        lineHight={20}
                      />
                    </Column>
                  </Row>
                ))
              : null}

            <View
              style={{
                borderBottomWidth: 0.8,
                marginVertical: 5,
                borderBottomColor: COLORS.graySubText,
              }}
            />

            <Row>
              <Column colWidth={'60%'}>
                <CustomTextNew
                  text={'Total Deductions'}
                  txtAlign={'left'}
                  lineHight={20}
                  txtWeight={'500'}
                />
              </Column>
              <Column colWidth={'40%'}>
                <CustomTextNew
                  text={totalDeductions?.toFixed(2) || ''}
                  txtAlign={'right'}
                  lineHight={20}
                  txtWeight={'500'}
                />
              </Column>
            </Row>
            <View
              style={{
                borderBottomWidth: 0.8,
                marginVertical: 5,
                borderBottomColor: COLORS.graySubText,
              }}
            />
          </Column>

          <Column
            colWidth={'100%'}
            colStyle={{paddingHorizontal: 16, marginTop: 15}}>
            <Row>
              <Column colWidth={'60%'}>
                <CustomTextNew
                  text={'Net pay'}
                  txtAlign={'left'}
                  lineHight={20}
                  txtSize={16}
                  txtWeight={'500'}
                />
              </Column>
              <Column colWidth={'40%'}>
                <CustomTextNew
                  text={(totalAdditions - totalDeductions)?.toFixed(2) || ''}
                  txtAlign={'right'}
                  lineHight={20}
                  txtWeight={'500'}
                />
              </Column>
            </Row>
          </Column>
        </>
      ) : (
        <NoData />
      )}

      <Modal visible={isModalShow} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setIsModalShow(!isModalShow)}>
          <View style={styles.modalWrapper}>
            <TouchableWithoutFeedback>
              <View style={styles.modal}>
                {monthDDL?.length === 0 && (
                  <View style={styles.noData}>
                    <Text style={[styles.noItem]}>No Data Found</Text>
                  </View>
                )}
                <FlatList
                  data={monthDDL}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={async () => {
                        setIsModalShow(false);
                        setSalaryInfo({});
                      }}>
                      <View>
                        <Text style={[styles.item]}>{item?.label}</Text>
                        <View style={styles.itemListWrapper} />
                      </View>
                    </TouchableOpacity>
                  )}
                  //@ts-ignore
                  keyExtractor={(item, index) => index}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ContainerNew>
  );
};

export default PaySlipDetailsARL;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '90%',
    height: Platform.OS === 'ios' ? '90%' : '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  noDataSec: {
    height: '100%',
    paddingTop: 50,
    alignItems: 'center',
  },
  noData: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noItem: {
    paddingVertical: 15,
    fontSize: 17,
  },
  item: {
    fontSize: 17,
    color: COLORS.blackish,
    paddingTop: 15,
  },
  itemListWrapper: {
    borderTopWidth: 1,
    borderColor: '#E4E9F2',
    marginTop: 8,
  },
  padding: {
    padding: 16,
  },
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'flex-start',
    marginBottom: 8,
  },
  txtHeading: {
    lineHeight: 18,
    fontSize: 12,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  txtMain: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  width48: {
    width: '48%',
  },
  headerTxt: {
    lineHeight: 24,
    fontSize: 16,
    marginBottom: 16,
    paddingRight: 12,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: COLORS.offDay,
    marginBottom: 8,
  },
  txtList: {
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400',
    color: COLORS.textNewColor,
    marginBottom: 8,
    paddingRight: 12,
  },

  btn: {
    alignSelf: 'center',
    borderColor: COLORS.primary,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 15,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
  },
});
