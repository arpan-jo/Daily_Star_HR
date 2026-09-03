import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
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
import {PeopleDeskAllDDLMasterData} from '../../../../common/api/api';
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
import {MovementLandingType} from '../../../../interfaces/movement/movement';
import {useRootStore} from '../../../../stores/rootStore';
import LeaveApplicationBalance from '../leave-application/LeaveApplicationBalance';
import {_todayDateTime} from '../../../../common/services/todayDate';
import {approvalCommonStyle} from '../../approval/ApprovalMainIndexFromSupDash';

const edges: Edge[] = ['right', 'bottom', 'left'];

const MovementApplicationMainIndex = ({route}: any) => {
  const empLeaveData = route?.params?.empLeaveData;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState();
  const [movementLandingData, setMovementLandingData] =
    useState<MovementLandingType[]>();

  // current Yaer
  let currentYear = _todayDateTime().getFullYear();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const fromDate = `${currentYear}-01-01`;
      const toDate = `${currentYear}-12-31`;

      const api_params = {
        url: PeopleDeskAllDDLMasterData,
        data: {
          TableName: 'MovementApplication',
          AccountId:
            empLeaveData?.profileData?.empEmployeeBankDetail?.intAccountId ||
            userInfo?.intAccountId,
          BusinessUnitId:
            empLeaveData?.intBusinessUnitId || userInfo?.intBusinessUnitId,
          intId:
            empLeaveData?.leaveApplication?.intEmployeeId ||
            userInfo?.intEmployeeId,
          FromDate: fromDate,
          ToDate: toDate,
          EmpId:
            empLeaveData?.leaveApplication?.intEmployeeId ||
            userInfo?.intEmployeeId,
          MovementTypeId: '',
          ApplicationDate: '',
          StatusId: 0,
        },
      };

      const res = await httpRequest(api_params, setIsLoading);

      const modifiedData = res?.map((item: any) => {
        const getRandomColor = () => {
          return '#' + Math.random().toString(16).slice(-6);
        };

        return {
          ...item,
          bgColor: getRandomColor(),
        };
      });

      setMovementLandingData(modifiedData);
    },
    [isFocused],
  );

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnPress={() =>
        //@ts-ignore
        navigation.navigate('CreateEditMovementApplication', {
          movementDetails: {
            AccountId:
              empLeaveData?.profileData?.empEmployeeBankDetail?.intAccountId,
            BusinessUnitId: empLeaveData?.intBusinessUnitId,
            EmployeeId: empLeaveData?.EmployeeId,
            isMovementCreate: true,
          },
        })
      }
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Movement Application"
        />
      }
      style={styles.container}>
      {movementLandingData && movementLandingData?.length > 0 ? (
        <View>
          {movementLandingData?.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                //@ts-ignore
                navigation.navigate('MovementApplicationDetails', {
                  movementDetails: {...item, empLeaveData},
                })
              }
              key={index?.toString()}
              style={styles.leaveCard}>
              <View style={styles.leaveTextPart}>
                <MIcon name="directions-car" size={30} color={COLORS.primary} />
                <View style={styles.paddingLeft}>
                  <Text style={styles.titleTxt}>{item?.MovementType}</Text>
                  <Text style={styles.date}>{`${date_formater(
                    item?.FromDate,
                  )} - ${date_formater(item?.ToDate)}`}</Text>
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
        <View style={styles.noDataContainer}>
          <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
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

      <LeaveApplicationBalance
        refRBSheet={refRBSheet}
        employeeId={
          empLeaveData?.EmployeeId ||
          empLeaveData?.leaveApplication?.intEmployeeId ||
          userInfo?.intEmployeeId
        }
      />
    </ContainerNew>
  );
};

export default MovementApplicationMainIndex;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, backgroundColor: COLORS.white},

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
  paddingLeft: {paddingLeft: 10},
  noDataContainer: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImg: {
    width: 130,
    height: 90,
  },
  loadingIndicator: {
    paddingTop: 30,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
  ...approvalCommonStyle,
});
