import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import AIcon from 'react-native-vector-icons/AntDesign';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  CreateExpenceRegisterApps,
  DeleteExpenseById,
  DeleteExpenseRegisterRow,
  GetExpenseById} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomTextNew from '../../../../common/components/CustomText';
import {useToast} from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {datetimeToDate} from '../../../../common/services/datetimeToDate';
import {ExpenseDetailsType} from '../../../../interfaces/expense/expense';
import {useRootStore} from '../../../../stores/rootStore';
import {_todayDateTime} from '../../../../common/services/todayDate';
import dayjs from 'dayjs';

const edges: Edge[] = ['right', 'bottom', 'left'];

// const getMonthDateRange = (item: any, currentYear: any) => {
//   const selectedYear = item?.previous ? currentYear - 1 : currentYear;

//   const selectedMonthIndex = item?.value - 1;

//   // const toDate = new Date(selectedYear, selectedMonthIndex, 25);

//   const endDate = dayjs(
//     new Date(selectedYear, selectedMonthIndex, 25),
//   ).toDate();

//   let fromMonthIndex = selectedMonthIndex - 1;
//   let fromYear = selectedYear;

//   if (fromMonthIndex < 0) {
//     fromMonthIndex = 11;
//     fromYear = selectedYear - 1;
//   }

//   // const fromDate = new Date(fromYear, fromMonthIndex, 26);
//   const startDate = dayjs(new Date(fromYear, fromMonthIndex, 25)).toDate();

//   return {endDate, startDate};
// };
export const getMonthDateRange = (item: any, currentYear: any) => {
  const year = item?.previous ? currentYear - 1 : currentYear;
  const monthIndex = item?.value - 1;

  // End date → 25th
  const endDate = dayjs()
    .year(year)
    .month(monthIndex)
    .date(25)
    .startOf('day')
    .format('YYYY-MM-DD');

  // Start date → 26th of previous month
  const startDate = dayjs()
    .year(year)
    .month(monthIndex)
    .subtract(1, 'month')
    .date(26)
    .startOf('day')
    .format('YYYY-MM-DD');

  return {startDate, endDate};
};

const CreateEditExpenseApplication = () => {
  const lastDayofMonth = new Date(
    _todayDateTime().getFullYear(),
    _todayDateTime().getMonth() + 1,
    0,
  ).getDate();
  const params = useRoute();
  //@ts-ignore
  const expenseId = params?.params?.expenseId;
  const navigation = useNavigation();
  const toster = useToast();
  const {userInfo, sbu} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<any>([]);
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const toaster = useToast();

  const currentMonth = _todayDateTime().getMonth() + 1;
  const currentYear = _todayDateTime().getFullYear();
  const appliedForDDL = [
    {
      value: 1,
      label: `January ${currentYear}`,
      previous: false,
    },
    {
      value: 2,
      label: `February ${currentYear}`,
      previous: false,
    },
    {
      value: 3,
      label: `March ${currentYear}`,
      previous: false,
    },
    {
      value: 4,
      label: `April ${currentYear}`,
      previous: false,
    },
    {
      value: 5,
      label: `May ${currentYear}`,
      previous: false,
    },
    {
      value: 6,
      label: `June ${currentYear}`,
      previous: false,
    },
    {
      value: 7,
      label: `July ${currentYear}`,
      previous: false,
    },
    {
      value: 8,
      label: `August ${currentYear}`,
      previous: false,
    },
    {
      value: 9,
      label: `September ${currentYear}`,
      previous: false,
    },
    {
      value: 10,
      label: `October ${currentYear}`,
      previous: false,
    },
    {
      value: 11,
      label: `November ${currentYear}`,
      previous: false,
    },
    {
      value: 12,
      label: `December ${currentYear}`,
      previous: false,
    },
    {
      value: 7,
      label: `July ${currentYear - 1}`,
      previous: true,
    },
    {
      value: 8,
      label: `August ${currentYear - 1}`,
      previous: true,
    },
    {
      value: 9,
      label: `September ${currentYear - 1}`,
      previous: true,
    },
    {
      value: 10,
      label: `October ${currentYear - 1}`,
      previous: true,
    },
    {
      value: 11,
      label: `November ${currentYear - 1}`,
      previous: true,
    },
    {
      value: 12,
      label: `December ${currentYear - 1}`,
      previous: true,
    },
  ];
  const [expenseGroupData, setExpenseGroupData] = useState([
    {
      expenseGroupType: 'TA/DA',
      isActive: true,
      apiString: 'TaDa',
    },
    {
      expenseGroupType: 'Other',
      isActive: false,
      apiString: 'Other',
    },
  ]);
  const [startDate, setStartDate] = useState(
    expenseGroupData[0]?.isActive
      ? getMonthDateRange(appliedForDDL[currentMonth - 1], currentYear)
          ?.startDate
      : `${currentYear}-${currentMonth}-01`,
  );

  const [emdDate, setEndDate] = useState(
    expenseGroupData[0]?.isActive
      ? getMonthDateRange(appliedForDDL[currentMonth - 1], currentYear)?.endDate
      : `${currentYear}-${currentMonth}-${lastDayofMonth}`,
  );
  // const [startDate, setStartDate] = useState(
  //   `${currentYear}-${currentMonth}-01`,
  // );
  // const [emdDate, setEndDate] = useState(
  //   `${currentYear}-${currentMonth}-${lastDayofMonth}`,
  // );
  const [expenseDetails, setExpenseDetails] = useState<ExpenseDetailsType>();

  const {control, handleSubmit, setValue, reset, getValues} = useForm({
    defaultValues: {
      appliedFor: appliedForDDL[currentMonth - 1],
      // startDate: `${currentYear}-${currentMonth}-01`,
      startDate:
        expenseGroupData[0]?.isActive && sbu?.businessUnitId !== 184
          ? getMonthDateRange(appliedForDDL[currentMonth - 1], currentYear)
              ?.startDate
          : `${currentYear}-${currentMonth}-01`,
      // endDate: `${currentYear}-${currentMonth}-${lastDayofMonth}`,
      endDate:
        expenseGroupData[0]?.isActive && sbu?.businessUnitId !== 184
          ? getMonthDateRange(appliedForDDL[currentMonth - 1], currentYear)
              ?.endDate
          : `${currentYear}-${currentMonth}-${lastDayofMonth}`,
      expenseGroup: {
        expenseGroupType: 'TA/DA',
        isActive: true,
        apiString: 'TaDa',
      },
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (expenseId) {
        const api_params = {
          url: GetExpenseById,
          data: {ExpenseId: expenseId},
          baseURL: erpPeopleDeskURL,
          // isConsole: true,
        };
        const res = await httpRequest(api_params, () => {});
        setExpenseDetails(res?.[0]);

        const modObjRow = res?.[0]?.objRow?.map((item: any) => {
          return {
            ...item,
            expenseDate: datetimeToDate(item?.expenseDate)?.split('T')?.[0],
            rowId: item?.expenseRowId || 0,
            expenseId: expenseId || 0,
            attachmentText: item?.attachmentText || '',
            // rate: item?.numRate,
            // amount: item?.numAmount,
          };
        });
        setExpenseList(modObjRow);

        if (res?.[0]) {
          const defaultValuesForUpdate = {
            expenseGroup: {
              expenseGroupType: res?.[0]?.objHeader?.expenseGroup,
              isActive: true,
              apiString: res?.[0]?.objHeader?.expenseGroup,
            },
            startDate: res?.[0]?.objHeader?.fromDate,
            endDate: res?.[0]?.objHeader?.toDate,
            comments: res?.[0]?.objHeader?.comments,
            appliedFor: {
              value: new Date(res?.[0]?.objHeader?.fromDate).getMonth() + 1,
              label: `${new Date(res?.[0]?.objHeader?.fromDate).toLocaleString(
                'default',
                {month: 'long'},
              )} ${new Date(res?.[0]?.objHeader?.fromDate).getFullYear()}`,
            },
          };
          reset(defaultValuesForUpdate);
          setStartDate(res?.[0]?.objHeader?.fromDate);
          setExpenseGroupData(prevState => {
            const temp = [...prevState];
            temp?.map(it => {
              it.isActive = false;
            });
            temp?.map(it => {
              if (it?.apiString === res?.[0]?.objHeader?.expenseGroup) {
                it.isActive = true;
              }
            });
            return temp;
          });
        }
      }
    },
    [expenseId],
  );

  const sumOfAmount = () => {
    let sum = 0;
    expenseList?.forEach((expense: any) => {
      sum += expense?.amount || expense?.numAmount || 0;
    });

    return sum;
  };

  const handleCreateExpense = (data: any) => {
    if (expenseList?.length === 0) {
      toster.show({
        message: 'Please select expense item!',
        type: 'warning',
      });
    } else {
      callCreateApi(data, true);
    }
  };

  const handleCreateExpense2 = (data: any) => {
    if (expenseList?.length === 0) {
      toster.show({
        message: 'Please select expense item!',
        type: 'warning',
      });
    } else {
      callCreateApi(data, false);
    }
  };

  const callCreateApi = async (data: any, IsBillSubmitted: boolean) => {
    const payload = {
      objHeader: {
        expenseId: expenseId || 0,
        expenseCode: expenseDetails?.objHeader?.expenseCode || '',
        IsBillSubmitted: IsBillSubmitted, // false for draft
        accountId: userInfo?.intAccountId,
        businessUnitId: sbu?.businessUnitId,
        actionBy: userInfo?.intErpUserId,
        businessUnitName: sbu?.businessUnitName,
        sbuid: sbu?.sbuId,
        sbuname: sbu?.businessUnitName,
        countryId: 18,
        countryName: 'Bangladesh',
        currencyId: 141,
        currencyName: 'Taka',
        expenseForId: userInfo?.intEmployeeId,
        dteFromDate: datetimeToDate(data?.startDate),
        dteToDate: datetimeToDate(data?.endDate),
        projectId: 0,
        projectName: '',
        costCenterId: 0,
        costCenterName: '',
        instrumentId: 0,
        instrumentName: '',
        disbursementCenterId: 0,
        disbursementCenterName: '',
        vehicleId: '',
        numTotalAmount: sumOfAmount(),
        comments: data?.comments,
        numTotalApprovedAmount: 0,
        adjustmentAmount: 0,
        pendingAmount: 0,
        plantId: 0,
        expenseGroup: data?.expenseGroup?.apiString,
        internalAccountId: 0,
        paymentCompleteBy: 0,
      },
      objRow:
        expenseList?.length > 0
          ? expenseList?.map((iteee: any) => {
              return {
                rowId: iteee?.rowId || 0,
                expenseId: iteee?.expenseId || expenseId || 0,
                costCenterId: iteee?.costCenterId,
                costCenterName: iteee?.costCenterName,
                profitCenterId: iteee?.profitCenterId,
                profitCenterName: iteee?.profitCenterName,
                costElementId: iteee?.costElementId,
                costElementName: iteee?.costElementName,
                dteExpenseDate: datetimeToDate(iteee?.expenseDate),
                expenseDate: datetimeToDate(iteee?.expenseDate),
                businessTransactionId: iteee?.businessTransactionId,
                businessTransactionName: iteee?.businessTransactionName,
                numQuantity: iteee?.numQuantity,
                numRate: iteee?.numRate || iteee?.rate,
                numAmount: iteee?.numAmount || iteee?.amount,
                expenseLocation: iteee?.expenseLocation,
                comments: iteee?.comments || '',
                driverName: iteee?.driverName || '',
                driverId: iteee?.driverId,
                attachmentLink: iteee?.attachmentLink || '',
                subGlaccountHeadId: iteee?.subGlaccountHeadId,
                subGlaccountHeadName: iteee?.subGlaccountHeadName,
                attachmentText: iteee?.attachmentText || '',
              };
            })
          : [],
      jwtToken: '',
    };

    const api_params = {
      url: CreateExpenceRegisterApps,
      data: payload,
      method: 'post',
      baseURL: erpPeopleDeskURL,
      isConsole: true,
      isConsoleParams: true,
    };

    const res = await httpRequest(api_params, setIsLoading);
    if (res?.statuscode === 200) {
      reset();
      toster.show({
        message: 'Expense successfully created.',
        type: 'success',
      });
      navigation.goBack();
    }
    if (
      res?.statuscode === 500 ||
      res?.statuCode === 500 ||
      res?.StatuCode === 500
    ) {
      toster.show({message: res?.message, type: 'error'});
    }
  };

  const itemRemoveHandler = async (index: number, item: any) => {
    if (item?.expenseRowId && expenseId) {
      const api_params = {
        url: DeleteExpenseRegisterRow,
        data: {
          ExpenseRowId: item?.expenseRowId,
        },
        method: 'put',
        baseURL: erpPeopleDeskURL,

        isPostOrPutWithParams: true,
      };
      const res = await httpRequest(api_params, () => {});
      if (res?.statuscode === 200 || res?.statusCode === 200) {
        const filtered = expenseList?.filter(
          (it: any, i: number) => i !== index,
        );
        setExpenseList(filtered);
        toaster.show({
          message: res?.message || 'Delete successfully!',
          type: 'success',
        });
      } else {
        toaster.show({
          message: res?.message || 'Something went wrong',
          type: 'warning',
        });
      }
    } else {
      const filtered = expenseList?.filter((it: any, i: number) => i !== index);
      setExpenseList(filtered);
    }
  };

  const handleDeleteExpense = async () => {
    const api_params = {
      url: DeleteExpenseById,
      data: {ExpenseId: expenseId},
      method: 'post',
      baseURL: erpPeopleDeskURL,
      isPostOrPutWithParams: true,
      isEncrypted: true,
    };

    const response = await httpRequest(api_params, () => {});

    if (
      response?.statusCode === 200 ||
      response?.StatusCode === 200 ||
      response?.statuscode === 200
    ) {
      toaster.show({
        message: 'Deleted successfully!',
        type: 'success',
      });
      navigation.goBack();
    } else {
      toaster.show({
        type: 'warning',
        message: 'Something Went Wrong!',
      });
    }
  };
  return (
    <ContainerNew
      edges={edges}
      isBottomDoubleButton={isLoading ? false : true}
      firstBtnTxt={expenseId ? 'Update Draft' : 'Save as Draft'}
      firstBtnStyle={styles.firstBtnStyle}
      firstBtnTxtStyle={styles.firstBtnTxtStyle}
      firstBtmBtnPress={handleSubmit(handleCreateExpense2)}
      secondBtnTxt={'Bill Submit'}
      secondBtmBtnPress={handleSubmit(handleCreateExpense)}
      header={
        <CustomHeader
          title="New Expense"
          alterIcon={expenseId ? 'delete' : ''}
          alterIconPress={() => setIsModalShow(true)}
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <View style={styles.ph10}>
        <Row direction="column" rowStyle={styles.p16} isCard>
          <CustomTextNew
            padTop={10}
            txtColor={COLORS.primary}
            text="Expense Group"
          />
          <Row rowStyle={styles.mt10}>
            {expenseGroupData?.map((item, index) => (
              <Row
                rowWidth="auto"
                key={index}
                isPressOn={expenseList?.length > 0 ? true : false}
                onCardPress={() => {
                  const temp = [...expenseGroupData];
                  temp?.map(it => {
                    it.isActive = false;
                  });
                  temp[index].isActive = true;
                  setExpenseGroupData(temp);
                  //@ts-ignore
                  setValue('expenseGroup', item);

                  const modStartDate =
                    temp?.[0]?.isActive && sbu?.businessUnitId !== 184
                      ? getMonthDateRange(getValues('appliedFor'), currentYear)
                          ?.startDate
                      : `${currentYear}-${getValues('appliedFor')?.value}-01`;
                  const modEndDate =
                    temp?.[0]?.isActive && sbu?.businessUnitId !== 184
                      ? getMonthDateRange(getValues('appliedFor'), currentYear)
                          ?.endDate
                      : `${currentYear}-${
                          getValues('appliedFor')?.value
                        }-${new Date(
                          _todayDateTime().getFullYear(),
                          getValues('appliedFor')?.value,
                          0,
                        ).getDate()}`;

                  setValue('startDate', modStartDate);
                  setValue('endDate', modEndDate);
                  setStartDate(modStartDate);
                  setEndDate(modEndDate);
                }}
                rowStyle={[
                  {
                    backgroundColor: item?.isActive
                      ? COLORS.lightPrimary2
                      : COLORS.white,
                    borderColor: item?.isActive
                      ? COLORS.primary
                      : COLORS.graySubText,
                  },
                  styles.btnStyle,
                ]}>
                <CustomTextNew lineHight={20} text={item.expenseGroupType} />
              </Row>
            ))}
          </Row>
          <CustomTextNew
            padTop={10}
            txtSize={16}
            txtWeight={500}
            lineHight={24}
            text="Expense Duration"
          />
          <Row align="center">
            <Column
              colStyle={[
                styles.mr10,
                {
                  marginTop: Platform.OS === 'ios' ? 20 : 1,
                },
              ]}>
              <CustomTextNew padTop={6} subTxt text="Applicable for" />
            </Column>

            <Column colWidth={Platform.OS === 'android' ? '38%' : '42%'}>
              <CustomDropDownNew
                isIconShow={false}
                control={control}
                data={appliedForDDL}
                name="appliedFor"
                placholder="Month"
                isDisable={expenseList?.length > 0 ? true : false}
                boxStyle={styles.wrapperStyle}
                onChange={async (valueOption: any) => {
                  setValue('appliedFor', valueOption);

                  if (
                    expenseGroupData[0]?.isActive &&
                    sbu?.businessUnitId !== 184
                  ) {
                    const startDateRange = getMonthDateRange(
                      valueOption,
                      currentYear,
                    )?.startDate;
                    const endDateRange = getMonthDateRange(
                      valueOption,
                      currentYear,
                    )?.endDate;
                    setValue('startDate', startDateRange);
                    setValue('endDate', endDateRange);
                    setStartDate(startDateRange);
                    setEndDate(endDateRange);
                  } else {
                    setValue(
                      'startDate',
                      `${valueOption?.previous ? currentYear - 1 : currentYear}-${
                        valueOption?.value
                      }-01`,
                    );
                    setValue(
                      'endDate',
                      `${valueOption?.previous ? currentYear - 1 : currentYear}-${
                        valueOption?.value
                      }-${new Date(
                        _todayDateTime().getFullYear(),
                        valueOption?.value,
                        0,
                      ).getDate()}`,
                    );
                    setEndDate(
                      `${valueOption?.previous ? currentYear - 1 : currentYear}-${
                        valueOption?.value
                      }-${new Date(
                        _todayDateTime().getFullYear(),
                        valueOption?.value,
                        0,
                      ).getDate()}`,
                    );
                    setStartDate(
                      `${valueOption?.previous ? currentYear - 1 : currentYear}-${
                        valueOption?.value
                      }-01`,
                    );
                  }
                }}
                selectedItemStyle={styles.selectedItem}
              />
            </Column>
            <Column align="center" colStyle={styles.arrowIcon}>
              <AIcon
                name={Platform.OS === 'ios' ? 'right' : 'caretdown'}
                size={12}
                color={COLORS.textGray}
              />
            </Column>
          </Row>
          <Row justify="space-between" rowStyle={styles.mv10}>
            <Column colWidth={'48%'}>
              <CustomDatePickerNew
                name="startDate"
                label="Start Date"
                control={control}
                minimumDate={startDate}
                maximumDate={emdDate}
                rules={{required: true}}
                isDisable={
                  expenseGroupData?.[0]?.isActive
                    ? true
                    : expenseList?.length > 0
                      ? true
                      : false
                }
                // isDisable={expenseList?.length > 0  ? true : false}
                onChange={(d: string) => {
                  //@ts-ignore
                  setValue('startDate', d);
                  setStartDate(d);
                }}
              />
            </Column>
            <Column colWidth={'48%'}>
              <CustomDatePickerNew
                name="endDate"
                label="End Date"
                control={control}
                rules={{required: true}}
                isDisable={
                  expenseGroupData?.[0]?.isActive
                    ? true
                    : expenseList?.length > 0
                      ? true
                      : false
                }
                // isDisable={expenseList?.length > 0 ? true : false}
                minimumDate={startDate}
                maximumDate={emdDate}
                onChange={(d: string) => {
                  //@ts-ignore
                  setValue('endDate', d);
                  setEndDate(d);
                }}
              />
            </Column>
          </Row>
          <Row justify="space-between" rowStyle={styles.mv10}>
            <Column colWidth={'100%'}>
              <CustomInputNew
                multiline
                setValue={setValue}
                control={control}
                name="comments"
                label="Comments"
                rules={{required: true}}
              />
            </Column>
          </Row>
        </Row>

        <Row direction="column" rowStyle={styles.p16} isCard>
          <Row justify="space-between" rowStyle={styles.mv10}>
            <Column>
              <CustomTextNew
                txtSize={16}
                txtWeight={500}
                lineHight={24}
                text="Expense List"
              />
              <CustomTextNew
                subTxt
                txtSize={12}
                lineHight={16}
                text="You can add multiple expense"
              />
            </Column>

            <Column>
              <Row
                isPressOn={false}
                onCardPress={() => {
                  if (getValues('startDate') && getValues('endDate')) {
                    //@ts-ignore
                    navigation.navigate('AddExpense', {
                      setExpenseList,
                      minDate: getValues('startDate'),
                      maxDate: getValues('endDate'),
                    });
                  } else {
                    toster.show({
                      message: 'Please select start and end date!',
                      type: 'warning',
                    });
                  }
                }}
                rowStyle={styles.addBtn}>
                <MIcon name="add" color={COLORS.primary} size={18} />
                <CustomTextNew
                  padLeft={8}
                  txtSize={14}
                  txtWeight={500}
                  lineHight={20}
                  text="Add"
                  txtColor={COLORS.primary}
                />
              </Row>
            </Column>
          </Row>

          {expenseList?.length > 0 ? (
            <Row justify="center" rowStyle={styles.amountRow}>
              <CustomTextNew
                text={`Total expense ${expenseList?.length || 0}`}
                lineHight={20}
                txtWeight={'500'}
                txtColor={COLORS.primary}
              />

              <Column colStyle={styles.borderLeft}>
                <CustomTextNew
                  text={`Amount BDT ${sumOfAmount() || 0} `}
                  lineHight={20}
                  txtWeight={'500'}
                  txtColor={COLORS.primary}
                />
              </Column>
            </Row>
          ) : null}

          <Row direction="column" rowStyle={styles.addedItemContainer}>
            {expenseList?.length > 0 && (
              <>
                {expenseList?.map((item: any, index: number) => (
                  <Column colWidth="100%" key={index}>
                    <Row rowStyle={styles.addedItem}>
                      <Column
                        colWidth="5.5%"
                        isPressOn={false}
                        onCardPress={() => itemRemoveHandler(index, item)}>
                        <MCIcon
                          name="close-circle-outline"
                          style={styles.itemCancelIcon}
                        />
                      </Column>
                      <Column
                        colWidth="90%"
                        colStyle={styles.addedItemTextContainer}
                        isPressOn={false}
                        onCardPress={() => {
                          //@ts-ignore
                          navigation.navigate('AddExpense', {
                            expenseId: expenseId,
                            expenseItemIndex: index,
                            expenseList,
                            setExpenseList,
                            expenseItem: item,
                            minDate: getValues('startDate'),
                            maxDate: getValues('endDate'),
                          });
                        }}>
                        {/* <CustomTextNew
                          text={`${date_formater(
                            item?.expenseDate,
                          )} — Amount BDT ${item?.numAmount || item?.amount}`}
                          lineHight={22}
                        /> */}
                        <View>
                          <Text style={{color: COLORS.graySubText}}>
                            {date_formater(item?.expenseDate)}— Amount{' '}
                            <Text style={styles.amountTxt}>
                              BDT {item?.numAmount || item?.amount}
                            </Text>
                          </Text>
                        </View>

                        <CustomTextNew
                          subTxt
                          text={`Cost Element: ${item?.costElementName}`}
                          lineHight={20}
                        />
                        <CustomTextNew
                          subTxt
                          numberOfLines={1}
                          text={`Description: ${item?.comments}`}
                          lineHight={20}
                        />
                        {/* <CustomTextNew
                          subTxt
                          text={`Cost Center: ${item?.costCenterName}`}
                          lineHight={20}
                        />
                        <CustomTextNew
                          subTxt
                          text={`Profit Center: ${item?.profitCenterName}`}
                          lineHight={20}
                        /> */}
                      </Column>
                    </Row>
                  </Column>
                ))}
              </>
            )}
          </Row>
        </Row>
        <Row justify="flex-end" rowStyle={styles.pv50} />
      </View>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={handleDeleteExpense}
        modalText={'Are you sure, you want to delete this?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default CreateEditExpenseApplication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
  },
  firstBtnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  firstBtnTxtStyle: {
    color: COLORS.primary,
  },
  ph10: {
    paddingHorizontal: 10,
  },
  p16: {
    padding: 16,
  },
  mt10: {
    marginTop: 10,
  },
  btnStyle: {
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
  },
  addBtn: {
    borderColor: COLORS.primary,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 16,
    paddingVertical: 6,
    borderRadius: 100,
  },
  amountRow: {
    backgroundColor: '#DAFCDE',
    paddingVertical: 4,
    paddingHorizontal: 8,
    color: COLORS.statusBar,
    marginTop: 8,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.offDay,
    paddingLeft: 8,
    marginLeft: 8,
  },
  addedItemContainer: {
    paddingBottom: 2,
  },
  addedItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.iconGrayBackground,
  },

  itemCancelIcon: {
    fontSize: 18,
    color: COLORS.absent,
    marginTop: 4,
  },
  addedItemTextContainer: {
    marginLeft: 8,
  },
  pv50: {
    paddingVertical: 50,
  },
  wrapperStyle: {
    borderWidth: 0,
    height: Platform.OS === 'android' ? 28 : 40,
  },
  selectedItem: {
    color: COLORS.textNewColor,
    fontSize: 14,
    paddingLeft: 4,
  },
  arrowIcon: {
    marginLeft: -10,
    zIndex: -1,
  },
  mv10: {
    marginVertical: 10,
  },
  mr10: {
    marginRight: 10,
  },
  selectedEmpCon: {
    paddingTop: 16,
    paddingBottom: 6,
    borderBottomColor: '#E4E9F2',
    borderBottomWidth: 1.7,
  },
  respondsTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.primary,
  },
  resPersonCon: {
    marginTop: 8,
  },
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 32,
    height: 32,
    alignSelf: 'center',
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    marginRight: 8,
  },
  empNameTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textNewColor,
    paddingLeft: 8,
  },
  pRight4: {
    paddingRight: 4,
  },
  subTxtItlic: {
    fontStyle: 'italic',
    color: COLORS.textGray,
    fontSize: 10,
    fontWeight: '400',
  },
  amountTxt: {
    fontWeight: '500',
    color: COLORS.black,
    lineHeight: 20,
  },
});
