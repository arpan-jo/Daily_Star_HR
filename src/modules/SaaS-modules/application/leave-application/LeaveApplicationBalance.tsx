import React, {useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View} from 'react-native';
import {LeaveHistoryType} from '../../../../interfaces/leave/leave';

import {COLORS, SIZES} from '../../../../common/constant/Themes';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {GetEmployeeLeaveBalanceAndHistory} from '../../../../common/api/api';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import {httpRequest} from '../../../../common/constant/httpRequest';

interface PropsTs {
  refRBSheet: any;
  employeeId: number | null | undefined;
}

const LeaveApplicationBalance = ({refRBSheet, employeeId}: PropsTs) => {
  const [_, setIsLoading] = useState(false);
  const {userInfo} = useRootStore();
  const [leaveHistoryData, setLeaveHistoryData] =
    useState<LeaveHistoryType[]>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const commonParams = {
        EmployeeId: employeeId,
        ViewType: 'LeaveBalance',
      };
      const apiParams = {
        url: GetEmployeeLeaveBalanceAndHistory,
        data:
          userInfo?.strUrl === commonURL
            ? {
                ...commonParams,
                WorkPlaceGroup: userInfo?.intWorkplaceGroupId,
                BusinessUnit: userInfo?.intBusinessUnitId,
              }
            : commonParams,
      };
      const res = await httpRequest(apiParams, setIsLoading);

      setLeaveHistoryData(res);
    },
    [employeeId],
  );

  return (
    <RBSheet
      ref={refRBSheet}
      //@ts-ignore
      width={SIZES.width}
      height={SIZES.height / 1.7}
      duration={150}
      closeOnDragDown={true}
      animationType={'fade'}
      keyboardAvoidingViewEnabled={true}
      customStyles={{
        container: {
          borderTopRightRadius: 24,
          borderTopLeftRadius: 24,
          backgroundColor: COLORS.white,
        },
      }}>
      <View style={styles.main}>
        <Text style={styles.title}>Leave Balance</Text>
        <FlatList
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={leaveHistoryData}
          renderItem={({item, index}: ListRenderItemInfo<LeaveHistoryType>) => (
            <View key={index}>
              <View style={styles.card}>
                <View style={styles.width40}>
                  <Text style={styles.type}>{item?.LeaveType}</Text>
                </View>

                <View style={styles.width30}>
                  <Text style={[styles.cmnTxt, styles.txtRight]}>
                    <Text style={styles.boldText}>{item?.RemainingDays}</Text>{' '}
                    Remaining
                  </Text>
                </View>
                <View style={styles.width30}>
                  <Text style={[styles.cmnTxt, styles.txtRight]}>
                    <Text style={styles.boldText}>{item?.LeaveTakenDays}</Text>{' '}
                    Taken
                  </Text>
                </View>
              </View>

              <View style={styles.bar} />
            </View>
          )}
          //@ts-ignore
          keyExtractor={(item, index) => index}
        />
      </View>
    </RBSheet>
  );
};

export default LeaveApplicationBalance;

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 20,
    zIndex: 99999,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.blackish,
    paddingBottom: 20,
  },
  bar: {
    height: 1,
    backgroundColor: COLORS.borderBottom,
    marginVertical: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  type: {
    color: COLORS.textNewColor,
    fontSize: 14,
    lineHeight: 24,
  },
  cmnTxt: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  txtRight: {
    textAlign: 'right',
  },
  boldText: {
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  width40: {
    width: '40%',
  },
  width30: {
    width: '30%',
  },
});
