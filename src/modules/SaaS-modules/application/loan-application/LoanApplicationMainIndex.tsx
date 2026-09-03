import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {PeopleDeskAllLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import {LoanLandingType} from '../../../../interfaces/loan/loan';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import {_todayDateTime} from '../../../../common/services/todayDate';

//@ts-ignore

const edges: Edge[] = ['right', 'bottom', 'left'];
interface props {
  route?: any;
}

const LoanApplicationMainIndex = ({route}: props) => {
  // current Yaer
  let currentYear = _todayDateTime().getFullYear();
  const employeeData = route?.params?.employeeData;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [loanLanding, setLoanLanding] = useState<LoanLandingType[]>();
  const [isLoading, setIsLoading] = useState(false);

  // const [minDate, setMinDate] = useState('');
  // const toaster = useToast();

  const accountId =
    employeeData?.profileData?.employeeProfileLandingView?.intAccountId ||
    userInfo?.intAccountId;
  const bussinessUnitId =
    employeeData?.intBusinessUnitId || userInfo?.intBusinessUnitId;
  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const fromDate = `${currentYear}-01-01`;
      const toDate = `${currentYear}-12-31`;

      const mainApiParams = {
        TableName: 'LoanApplicationList',
        AccountId: accountId,
        BusinessUnitId: bussinessUnitId,
        FromDate: fromDate,
        ToDate: toDate,
      };
      const commonApiParams = {
        ...mainApiParams,
        WorkplaceGroupId: userInfo?.intWorkplaceGroupId,
      };

      const api_params = {
        url: PeopleDeskAllLanding,
        data: userInfo?.strUrl === commonURL ? commonApiParams : mainApiParams,
      };
      const res = await httpRequest(api_params, setIsLoading);
      const modifiedData = res?.filter(
        (item: any) => item?.employeeId === employeeId,
      );

      setLoanLanding(modifiedData);
    },
    [isFocused],
  );

  // const onSubmit = async (data: any) => {
  //   const fromDate = dayjs(data?.fromDate && data?.fromDate);
  //   const toDate = dayjs(data?.toDate && data?.toDate);

  //   if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
  //     toaster.show({ message: 'Invalid date duration', type: 'error' });
  //   } else {
  //     const res = await getAllLoanApplication(
  //       accountId,
  //       bussinessUnitId,
  //       setIsLoading,
  //       employeeId,
  //       data?.fromDate?.split?.('T')?.[0] ? data?.fromDate : dateFormater(data?.fromDate),
  //       data?.toDate?.split?.('T')?.[0] ? data?.toDate : dateFormater(data?.toDate)
  //     );
  //     setLoanLanding(res);
  //   }
  // };

  // const { control, handleSubmit, setValue, reset } = useForm({
  //   defaultValues: {
  //     fromDate: _firstDateOfMonth(),
  //     toDate: _lastDateOfMonth(),
  //   },
  // });

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnPress={() =>
        //@ts-ignore
        navigation.navigate('CreateEditLoanApplication', {
          loanDetails: {
            intEmployeeId: employeeData?.EmployeeId,
          },
        })
      }
      header={
        <CustomHeader
          // components={
          //   <CustomButton
          //     btnText={'View'}
          //     onPress={handleSubmit(onSubmit)}
          //     style={styles.btn}
          //     textStyle={styles.btnText}
          //   />
          // }
          onBackPress={navigation.goBack}
          title="Loan Request"
        />
      }
      style={styles.container}>
      {/* <View style={styles.dateContainer}>
        <View style={styles.dateWidth}>
          <CustomDatePickerNew
            isNewDesign
            name="fromDate"
            label="From Date"
            control={control}
            rules={{ required: Platform.OS === 'ios' ? false : true }}
            onChange={(d: string) => {
              setValue('fromDate', d);
              setMinDate(d);
            }}
          />
        </View>
        <View style={styles.dateWidth}>
          <CustomDatePickerNew
            isNewDesign
            name="toDate"
            label="To Date"
            control={control}
            rules={{ required: Platform.OS === 'ios' ? false : true }}
            setValue={setValue}
            minimumDate={minDate}
            onChange={(d: string) => {
              setValue('toDate', d);
            }}
          />
        </View>
      </View> */}

      {loanLanding && loanLanding?.length > 0 ? (
        <View>
          {loanLanding?.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                //@ts-ignore
                navigation.navigate('LoanApplicationDetails', {
                  loanDetails: item,
                })
              }
              key={index}
              style={styles.leaveCard}>
              <View style={styles.leaveTextPart}>
                <MIcon name="receipt" size={30} color={COLORS.primary} />
                <View style={styles.middleTxt}>
                  <Text style={styles.titleTxt}>{item?.loanType || '---'}</Text>
                  <View style={styles.bottomTxt}>
                    <Text style={styles.textBottom}>
                      Amount ৳ {item?.loanAmount}
                    </Text>
                    <View style={styles.divider} />
                    <Text style={styles.textBottom}>
                      Installment {item?.numberOfInstallment}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <Text
                  style={[
                    styles.status,
                    {
                      color: getStatusColor(item?.applicationStatus),
                      backgroundColor: getStatusBgColor(
                        item?.applicationStatus,
                      ),
                    },
                  ]}>
                  {item?.applicationStatus}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noData}>
          <FastImage source={IMAGES.NoDataImage} style={styles.fastImage} />
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={styles.loadingIndicator}
        />
      ) : null}
    </ContainerNew>
  );
};

export default LoanApplicationMainIndex;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, backgroundColor: COLORS.white},

  leaveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 8,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  bottomTxt: {
    display: 'flex',
    flexDirection: 'row',
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  middleTxt: {
    marginLeft: 20,
  },
  textBottom: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  divider: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.graySubText,
  },
  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    marginLeft: SIZES.width / 1.3,
    overflow: 'hidden',
  },
  noData: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImage: {width: 130, height: 90},
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  loadingIndicator: {paddingTop: 30},
  // dateContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   paddingTop: 4,
  //   paddingBottom: 8,
  // },
  // dateWidth: {
  //   width: '48%',
  // },

  // btn: {
  //   alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
  //   borderRadius: Platform.OS === 'ios' ? 10 : 100,
  //   paddingHorizontal: 24,
  //   paddingVertical: 10,
  //   backgroundColor: '#096529',
  //   marginRight: 10,
  // },
  // btnText: {
  //   fontSize: 14,
  //   fontWeight: '600',
  //   lineHeight: 20,
  // },
});
