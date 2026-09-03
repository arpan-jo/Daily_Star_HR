import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcons from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'rn-fetch-blob';
import CustomButtonNew from '../../../../common/components/CustomButton';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import {
  PalyslipLandingType,
  SalaryCodeDataType,
  PalyslipHeadDataType,
} from '../../../../interfaces/dashboard/employeeDashboard';
import {
  getSalaryCode,
  getSalaryPaySlip,
  getSalaryPaySlipBonux,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { useRootStore } from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

import { numberWithCommas } from '../../../../common/constant/numberWithComma';
import { fileService } from '../../../../services/file.service';
import { useToast } from '../../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'bottom', 'left'];

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

const PayslipDetails = () => {
  const currentMonth = dayjs().month() - 1;
  const currentYear = dayjs().year();
  //  const monthId = currentMonth + 1;
  const yearId = currentYear;
  const [isModalShow, setIsModalShow] = useState(false);
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const isFocused = useIsFocused();
  const [paySlipData, setPaySlipData] = useState<PalyslipLandingType[]>();
  const [month, setMonth] = useState({
    value: monthDDL?.[currentMonth]?.value,
    label: monthDDL?.[currentMonth]?.label,
  });
  const [salaryCode, setSalaryCode] = useState<SalaryCodeDataType[]>();
  const [payHeadData, setPayHeadData] = useState<PalyslipHeadDataType[]>();
  const [salaryIndex, setSalaryIndex] = useState(0);

  const empId = userInfo?.intEmployeeId;
  const toaster = useToast();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const salCode = await getSalaryCode(
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
        userInfo?.intWorkplaceGroupId,
        userInfo?.intEmployeeId,
        month?.value,
        yearId,
      );
      setSalaryCode(salCode);
      if (salCode?.[0]?.SalaryGenerateRequestId) {
        const data = await getSalaryPaySlip(
          empId,
          month?.value,
          yearId,
          salCode?.[0]?.SalaryGenerateRequestId,
          userInfo?.intBusinessUnitId,
          userInfo?.intWorkplaceGroupId,
        );
        setPaySlipData(data);
        const res = await getSalaryPaySlipBonux(
          empId,
          month?.value,
          yearId,
          salCode?.[0]?.SalaryGenerateRequestId,
          userInfo?.intBusinessUnitId,
          userInfo?.intWorkplaceGroupId,
        );
        setPayHeadData(res);
      }
    },
    [isFocused, month],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (salaryCode?.[salaryIndex]?.SalaryGenerateRequestId) {
        const data = await getSalaryPaySlip(
          empId,
          month?.value,
          yearId,
          salaryCode?.[salaryIndex]?.SalaryGenerateRequestId,
          userInfo?.intBusinessUnitId,
          userInfo?.intWorkplaceGroupId,
        );

        setPaySlipData(data);
        const res = await getSalaryPaySlipBonux(
          empId,
          month?.value,
          yearId,
          salaryCode?.[salaryIndex]?.SalaryGenerateRequestId,
          userInfo?.intBusinessUnitId,
          userInfo?.intWorkplaceGroupId,
        );
        setPayHeadData(res);
      }
    },
    [salaryIndex],
  );

  const downloadFile = async () => {
    const paySlipUrl = `${axios.defaults.baseURL}/PdfAndExcelReport/EmployeePaySlipReport?partName=SalaryGenerateHeaderByPayrollMonthNEmployeeId&intEmployeeId=${userInfo?.intEmployeeId}&intMonthId=${month?.value}&intSalaryGenerateRequestId=${salaryCode?.[salaryIndex]?.SalaryGenerateRequestId}&intYearId=${yearId}&isDownload=true`;

    const response = await fileService.FileDownload({
      fullUrl: paySlipUrl,
      fileName: `Payslip ${month?.label}`,
      token: userInfo?.token!,
    });
    toaster.show({
      message: response?.message,
      type: response?.status ? 'success' : 'error',
    });

    // const { config, fs, ios } = RNFetchBlob;

    // let PictureDir =
    //   Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.DownloadDir;

    // // Construct file name
    // let fileName = `${payHeadData?.[0]?.strEmployeeCode || ''}_${month?.label}_${currentYear}_payslip.pdf`;
    // let filePath = `${PictureDir}/${fileName}`;

    // let options = {
    //   indicator: true,
    //   fileCache: true,
    //   appendExt: '.pdf',
    //   addAndroidDownloads: {
    //     useDownloadManager: true,
    //     notification: true,
    //     path: filePath,
    //     description: 'document',
    //   },
    //   path: filePath,
    // };

    // config(options)
    //   .fetch('GET', image_URL, {
    //     Authorization: `Bearer ${userInfo?.token}`,
    //   })
    //   .then(res => {
    //     if (res?.data && Platform.OS === 'android') {
    //       Alert.alert('', 'Your payslip download complete', [
    //         { text: 'OK', onPress: () => console.log('OK Pressed') },
    //       ]);
    //     }
    //     if (res?.data && Platform.OS === 'ios') {
    //       fs.writeFile(filePath, res.data, 'base64')
    //         .then(() => {
    //           // Preview the document
    //           ios.previewDocument(res.data);
    //         })
    //         .catch(err => {
    //           console.error('File write error:', err);
    //         });
    //     }
    //   });
  };

  const previousMonth = () => {
    setMonth({
      value: month?.value - 1,
      label: monthDDL[month?.value - 2]?.label,
    });
  };

  const nextMonth = () => {
    setMonth({ value: month?.value + 1, label: monthDDL[month?.value]?.label });
  };

  const benefits =
    paySlipData &&
    paySlipData?.length > 0 &&
    paySlipData?.filter(item => item?.intPayrollElementTypeId);

  const deduction =
    paySlipData?.length &&
    paySlipData?.filter(item => !item?.intPayrollElementTypeId);
  const tax = payHeadData?.[0]?.numTaxAmount || 0;
  const pf = payHeadData?.[0]?.numPFAmount || 0;
  const loan = payHeadData?.[0]?.numLoanAmount || 0;
  // const overtime = payHeadData?.[0]?.numOverTimeAmount || 0;ss

  const absentAmount =
    (payHeadData?.[0]?.intAbsent || 0) *
    (payHeadData?.[0]?.numPerDaySalary || 0);

  const totalBen =
    benefits &&
    benefits?.length &&
    benefits?.map(item => item?.numAmount)?.reduce?.((p, c) => p + c);
  // const totalBenefits = overtime + (totalBen || 0);
  const totalBenefits = totalBen || 0;
  const totalDeduc =
    deduction &&
    deduction?.length &&
    deduction?.map(item => item?.numAmount)?.reduce?.((p, c) => p + c);

  const totalDeducton = tax + loan + pf + (totalDeduc || 0);

  const getNetpay = (benfit: number | undefined, deduct = 0) => {
    if (benfit) {
      const deductAmmount =
        userInfo?.intBusinessUnitId === 1 ? deduct + absentAmount : deduct;
      const netPay = benfit - deductAmmount;
      const finalAmount = Math.round(netPay);
      return numberWithCommas(finalAmount);
    }
  };

  const handleSalaryCode = (index: number) => {
    if (salaryCode) {
      const copyData = [...salaryCode];
      const modifyData = copyData?.map((item, i) => {
        return {
          ...item,
          isActive: i === index ? true : false,
        };
      });
      setSalaryIndex(index);
      setSalaryCode(modifyData);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <CustomHeader
          headerColor={true}
          onBackPress={navigation?.goBack}
          title="Pay Slip"
          alterIcon="today"
          alterIconPress={() => setIsModalShow(true)}
        />
      }
      style={styles.container}
    >
      {salaryCode && salaryCode?.length > 1 ? (
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={styles.salaryCodeContainer}
        >
          <View style={styles.flexRowCenter}>
            {salaryCode?.map((item, index) => (
              <CustomButtonNew
                disabled={item?.isActive ? true : false}
                key={index}
                btnText={item?.SalaryCode}
                onBtnPress={() => handleSalaryCode(index)}
                btnstyle={[item?.isActive ? styles.activeBtn : styles.btn1]}
                btnTextStyle={styles.btnText1}
              />
            ))}
          </View>
        </ScrollView>
      ) : null}
      {salaryCode && salaryCode?.length > 0 ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.padding}>
              <View style={styles.box}>
                <View style={styles.width48}>
                  <Text style={styles.txtHeading}>Salary Month</Text>
                  <Text style={styles.txtMain}>
                    {month?.label}, {currentYear}
                  </Text>
                </View>
                <View style={styles.width48}>
                  <Text style={styles.txtHeading}>Pay Mode</Text>
                  <Text style={styles.txtMain}>
                    {payHeadData?.[0]?.strPaymentBankType}
                  </Text>
                </View>
              </View>
              <View style={styles.box}>
                <View style={styles.width48}>
                  <Text style={styles.txtHeading}>Net Pay</Text>
                  <Text style={styles.txtMain}>
                    {getNetpay(totalBenefits, totalDeducton)}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <View style={styles.padding}>
                <Text style={styles.headerTxt}>Additions</Text>

                {benefits && benefits?.length > 0 ? (
                  benefits?.map((item, index) => (
                    <View key={index} style={styles.rowSpaceBetween}>
                      <Text style={styles.txtList}>
                        {item?.strPayrollElement || 'N/A'}
                      </Text>
                      <Text style={styles.txtList}>
                        {numberWithCommas(item?.numAmount) || 'N/A'}
                      </Text>
                    </View>
                  ))
                ) : (
                  <></>
                )}
                {/* <View style={styles.rowSpaceBetween}>
                  <Text style={styles.txtList}>Overtime</Text>
                  <Text style={styles.txtList}>{overtime || 0}</Text>
                </View> */}

                <View style={styles.divider} />

                <View style={styles.rowSpaceBetween}>
                  <Text style={styles.txtList}>Total Benefits</Text>
                  <Text style={styles.txtList}>
                    {totalBenefits
                      ? numberWithCommas(Math.round(totalBenefits))
                      : 0}
                  </Text>
                </View>
                <View style={styles.divider} />
              </View>

              <Text style={[styles.headerTxt, styles.padHorizon]}>
                Deductions
              </Text>

              <View style={styles.padHorizon}>
                <View>
                  {deduction && deduction?.length > 0 ? (
                    deduction?.map((item, index) => (
                      <View key={index} style={styles.rowSpaceBetween}>
                        <Text style={styles.txtList}>
                          {item?.strPayrollElement}
                        </Text>
                        <Text style={styles.txtList}>
                          {numberWithCommas(item?.numAmount)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <></>
                  )}

                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.txtList}>Tax</Text>
                    <Text style={styles.txtList}>{tax || 0}</Text>
                  </View>

                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.txtList}>Loan</Text>
                    <Text style={styles.txtList}>{loan || 0}</Text>
                  </View>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.txtList}>Provident Fund</Text>
                    <Text style={styles.txtList}>{pf || 0}</Text>
                  </View>

                  <View style={styles.divider} />
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.txtList}>Total Deductions</Text>
                    <Text style={styles.txtList}>
                      {totalDeducton ? numberWithCommas(totalDeducton) : 0}
                    </Text>
                  </View>
                  <View style={styles.divider} />
                </View>
              </View>

              <View style={styles.padding}>
                <View style={styles.rowSpaceBetween}>
                  <Text style={styles.headerTxt}>Net Pay</Text>
                  <Text style={styles.headerTxt}>
                    {getNetpay(totalBenefits, totalDeducton)}
                  </Text>
                </View>
              </View>

              <View style={styles.buttonSection}>
                <TouchableOpacity
                  disabled={month?.value === 1}
                  style={styles.alignCenter}
                  onPress={() => previousMonth()}
                >
                  <MIcons
                    name="arrow-back-ios"
                    size={20}
                    color={COLORS.iconColor}
                  />
                </TouchableOpacity>

                <CustomButtonNew
                  bgColor={'#F2F4F7'}
                  btnText={'Download Payslip'}
                  onBtnPress={() => downloadFile()}
                  btnstyle={styles.btn}
                  btnTextStyle={styles.btnText}
                />
                <TouchableOpacity
                  disabled={month?.value === currentMonth + 1}
                  style={styles.alignCenter}
                  onPress={() => nextMonth()}
                >
                  <MIcons
                    name="arrow-forward-ios"
                    size={20}
                    color={COLORS.iconColor}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.paddingBottom} />
          </ScrollView>
        </>
      ) : (
        <View style={styles.noDataSec}>
          <FastImage source={IMAGES.NoDataImage} style={styles.noDataImg} />
          <Text style={styles.noDataText}>
            No Payslip found in{' '}
            <Text style={styles.noDataMonth}>
              {month?.label}, {currentYear}
            </Text>
          </Text>
        </View>
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
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={async () => {
                        setIsModalShow(false);
                        setMonth(item);

                        const salCode = await getSalaryCode(
                          userInfo?.intAccountId,
                          userInfo?.intBusinessUnitId,
                          userInfo?.intWorkplaceGroupId,
                          userInfo?.intEmployeeId,
                          item?.value,
                          yearId,
                        );
                        setSalaryCode(salCode);

                        const data = await getSalaryPaySlip(
                          empId,
                          item?.value,
                          yearId,
                          salCode?.[0]?.SalaryGenerateRequestId,
                          userInfo?.intBusinessUnitId,
                          userInfo?.intWorkplaceGroupId,
                        );
                        setPaySlipData(data);

                        const res = await getSalaryPaySlipBonux(
                          empId,
                          item?.value,
                          yearId,
                          salCode?.[0]?.SalaryGenerateRequestId,
                          userInfo?.intBusinessUnitId,
                          userInfo?.intWorkplaceGroupId,
                        );
                        setPayHeadData(res);
                      }}
                    >
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

export default PayslipDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
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
  padHorizon: {
    paddingHorizontal: 16,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  alignCenter: {
    alignSelf: 'center',
  },
  buttonSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 40,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  btn1: {
    alignSelf: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    backgroundColor: COLORS.newGray,
    borderColor: COLORS.offDay,
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: '#344054',
  },
  salaryCodeContainer: {
    backgroundColor: '#1F843C',
    height: 75,
    paddingTop: 5,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
  noDataMonth: {
    fontSize: 14,
    fontWeight: '600',
  },
  activeBtn: {
    alignSelf: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.offDay,
    backgroundColor: COLORS.lightPrimary2,
  },
});
