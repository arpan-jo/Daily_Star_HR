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
import {commonURL} from '../../../../../App';
import {GetIOULanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import {getIOULanding} from '../../../../services/SaaS-modules/iou/ios';
import {useRootStore} from '../../../../stores/rootStore';
import {_todayDateTime} from '../../../../common/services/todayDate';
import {approvalCommonStyle} from '../../approval/ApprovalMainIndexFromSupDash';

// import { IOUApplicationLandingType } from '~/type/iou/iou';
const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const IOUApplicationMainIndex = ({route}: props) => {
  // current Yaer
  let currentYear = _todayDateTime().getFullYear();
  const employeeData = route?.params?.employeeData;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState();
  const isFocused = useIsFocused();
  const [iouLandingData, setIOULandingData] = useState<any[]>();
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
      if (userInfo?.strUrl === commonURL) {
        const commonIOUParams = {
          url: GetIOULanding,
          data: {
            businessUnitId: userInfo?.intBusinessUnitId,
            workplaceGroupId: userInfo?.intWorkplaceGroupId,
            fromDate: currentYear + '-01-01',
            toDate: currentYear + '-12-31',
            workplaceId: userInfo?.intWorkplaceId,
            intIOUId: 0,
            pageNo: 1,
            pageSize: 1000,
          },
        };
        const resCommon = await httpRequest(commonIOUParams, setIsLoading);

        const modifyRes = resCommon?.iouApplicationLandings?.map(
          (item: any) => {
            return {
              ...item,
              strIOUCode: item?.iouCode,
              dteApplicationDate: item?.applicationDate,
              Status: item?.status,
              numAdjustedAmount: item?.numAdjustedAmount,
              numAmount: item?.numAmount,
              numApprovedAmount: item?.numApprovedAmount,
              numPayableAmount: item?.numPayableAmount,
              numReceivableAmount: item?.numReceivableAmount,
              strDiscription: item?.discription,
              dteFromDate: item?.dteFromDate,
              dteToDate: item?.dteToDate,
              numIOUAmount: item?.numIOUAmount,
              intIOUId: item?.iouId,
            };
          },
        );
        setIOULandingData(modifyRes);
      } else {
        const res = await getIOULanding(
          accountId,
          bussinessUnitId,
          employeeId,
          setIsLoading,
          currentYear,
          // _firstDateOfMonth(),
          // _lastDateOfMonth()
        );
        setIOULandingData(res);
      }
    },
    [isFocused],
  );

  // const onSubmit = async (data: any) => {
  //   const fromDate = dayjs(data?.fromDate && data?.fromDate);
  //   const toDate = dayjs(data?.toDate && data?.toDate);
  //   if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
  //     toaster.show({ message: 'Invalid date duration', type: 'error' });
  //   } else {
  //     const res = await getIOULanding(
  //       accountId,
  //       bussinessUnitId,
  //       employeeId,
  //       setIsLoading,
  //       data?.fromDate?.split?.('T')?.[0] ? data?.fromDate : dateFormater(data?.fromDate),
  //       data?.toDate?.split?.('T')?.[0] ? data?.toDate : dateFormater(data?.toDate)
  //     );
  //     setIOULandingData(res);
  //   }
  // };

  // const { control, handleSubmit, setValue } = useForm({
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
        navigation.navigate('CreateEditIOUApplication', {
          iouDetails: {
            employeeId: employeeData?.EmployeeId,
          },
        })
      }
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="IOU Requests"
          // components={
          //   <CustomButton
          //     btnText={'View'}
          //     onPress={handleSubmit(onSubmit)}
          //     style={styles.btn}
          //     textStyle={styles.btnText}
          //   />
          // }
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

      {iouLandingData && iouLandingData?.length > 0 ? (
        <View>
          {iouLandingData?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                //@ts-ignore
                navigation.navigate('IOUApplicationDetails', {
                  iouDetails: item,
                })
              }
              style={styles.leaveCard}>
              <View style={styles.leaveTextPart}>
                <MIcon name="request-page" size={30} color={COLORS.primary} />
                <View style={styles.paddingLeft}>
                  <Text style={styles.titleTxt}>{item?.strIOUCode}</Text>
                  <Text style={styles.date}>
                    Application Date: {date_formater(item?.dteApplicationDate)}
                  </Text>
                </View>
              </View>

              <View>
                <Text
                  style={[
                    styles.status,
                    {
                      color: getStatusColor(item?.Status),
                      backgroundColor: getStatusBgColor(item?.Status),
                    },
                  ]}>
                  {item?.Status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.notData}>
          <FastImage source={IMAGES.NoDataImage} style={styles.noDataImage} />
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={styles.paddingTop}
        />
      ) : null}
    </ContainerNew>
  );
};

export default IOUApplicationMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },

  date: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
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
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  notData: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  noDataImage: {
    width: 130,
    height: 90,
  },
  paddingLeft: {
    paddingLeft: 8,
  },
  paddingTop: {
    paddingTop: 30,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
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

  ...approvalCommonStyle,
});
