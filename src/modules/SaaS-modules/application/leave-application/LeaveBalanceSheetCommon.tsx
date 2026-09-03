import React, {useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View} from 'react-native';

import {EmployeeLeaveBalanceList} from '../../../../common/api/api';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {_todayDate} from '../../../../common/services/todayDate';
import {LeaveBalanceItemTs} from '../../../../interfaces/leave/common-leave/common-leave';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';

interface PropsTs {
  refRBSheet: any;
  employeeId: any;
  workplaceGroupId: number | null | undefined;
  buId: number | null | undefined;
}

const LeaveBalanceSheetCommon = ({
  refRBSheet,
  employeeId,
  workplaceGroupId: _workplaceGroupId,
  buId: _buId,
}: PropsTs) => {
  const [leaveHistoryData, setLeaveHistoryData] =
    useState<LeaveBalanceItemTs[]>();
  const [allLeaveHistoryData, setAllLeaveHistoryData] =
    useState<LeaveBalanceItemTs[]>();
  const {userInfo} = useRootStore();
  const [showActiveInactive, setShowActiveInactive] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      getEmpLeaveBalanceData();
    },
    [employeeId],
  );
  const getEmpLeaveBalanceData = async () => {
    const api_params = {
      url: EmployeeLeaveBalanceList,
      data: {
        employeeId: employeeId,
        date: _todayDate(),
        isAdmin: userInfo?.isOfficeAdmin,
      },
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    if (userInfo?.strUrl === commonURL && res?.length > 0) {
      setAllLeaveHistoryData(res);
      setLeaveHistoryData(res.filter((item: any) => item.status === 'Active'));
    } else {
      setAllLeaveHistoryData(res);
      setLeaveHistoryData(res);
    }
  };

  // Filter Logic
  // const filteredData = showActiveInactive
  //   ? leaveData // সব ডাটা দেখাবে
  //   : leaveData.filter(item => item.status === "Active")

  return (
    <RBSheet
      ref={refRBSheet}
      //@ts-ignore
      width={SIZES.width}
      height={SIZES.height / 1.1}
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
        {/* need a left side leave balance and right side a clickable text which is show all */}
        <View style={styles.header}>
          <Text style={styles.title}>Leave Balance</Text>
          {userInfo?.strUrl === commonURL && (
            <Text
              style={styles.showActiveInactive}
              onPress={() => {
                if (showActiveInactive) {
                  // Show only active
                  setLeaveHistoryData(
                    allLeaveHistoryData?.filter(
                      (item: any) => item.status === 'Active',
                    ),
                  );
                } else {
                  // Show all
                  setLeaveHistoryData(allLeaveHistoryData);
                }
                setShowActiveInactive(!showActiveInactive);
              }}>
              {showActiveInactive ? 'Show Active' : 'Show All(Active/Inactive)'}
            </Text>
          )}
        </View>
        <FlatList
          removeClippedSubviews
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          data={leaveHistoryData}
          renderItem={({
            item,
            index,
          }: ListRenderItemInfo<LeaveBalanceItemTs>) => (
            <View key={index}>
              <View style={styles.card}>
                <View
                  style={
                    userInfo?.strUrl === commonURL
                      ? styles.width30
                      : styles.width40
                  }>
                  <Text style={styles.type}>{item?.type || 'N/A'}</Text>
                </View>

                <View
                  style={
                    userInfo?.strUrl === commonURL
                      ? styles.width25
                      : styles.width30
                  }>
                  <Text style={[styles.cmnTxt, styles.txtRight]}>
                    <Text style={styles.boldText}>
                      {item?.totalBalanceDays || 0}{' '}
                    </Text>
                    Remaining
                  </Text>
                </View>
                <View
                  style={
                    userInfo?.strUrl === commonURL
                      ? styles.width20
                      : styles.width30
                  }>
                  <Text style={[styles.cmnTxt, styles.txtRight]}>
                    <Text style={styles.boldText}>
                      {item?.totalTakenDays || 0}{' '}
                    </Text>{' '}
                    Taken
                  </Text>
                </View>
                {userInfo?.strUrl === commonURL && (
                  <View style={styles.width20}>
                    <Text style={[styles.cmnTxt, styles.txtRight]}>
                      <Text
                        style={
                          item?.status === 'Active'
                            ? styles.activeStatus
                            : styles.inactiveStatus
                        }>
                        {item?.status || 0}{' '}
                      </Text>
                    </Text>
                  </View>
                )}
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

export default LeaveBalanceSheetCommon;

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
  bar: {height: 1, backgroundColor: COLORS.borderBottom, marginVertical: 10},
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
  txtRight: {textAlign: 'right'},
  boldText: {fontWeight: '500', color: COLORS.textNewColor},
  width40: {
    width: '40%',
  },
  width30: {
    width: '30%',
  },
  width25: {
    width: '25%',
  },
  width20: {
    width: '20%',
  },
  activeStatus: {
    color: 'green',
  },
  inactiveStatus: {
    color: 'red',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showActiveInactive: {
    color: COLORS.textNewColor,
    fontWeight: '500',
    paddingBottom: 20,
  },
});
