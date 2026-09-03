import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {rscURL} from '../../../../../App';
import {COLORS} from '../../../../common/constant/Themes';
import {useRootStore} from '../../../../stores/rootStore';

const MyAllLeave = ({empDashboardData}: any) => {
  const {userInfo} = useRootStore();

  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}>
        My Leaves
        {userInfo?.strUrl === rscURL && (
          <Text style={styles.myLeaveTitle}> (Hourly) </Text>
        )}
      </Text>
      <View style={styles.myLeavesSection}>
        {empDashboardData?.employeeDashboardViewModel?.leaveBalanceHistoryList?.map(
          (leaveHistory: any, index: number) => (
            <View
              key={index}
              style={[
                styles.myLeavesBox,
                {
                  borderBottomWidth:
                    empDashboardData?.employeeDashboardViewModel
                      ?.leaveBalanceHistoryList &&
                    empDashboardData?.employeeDashboardViewModel
                      ?.leaveBalanceHistoryList?.length -
                      1 ===
                      index
                      ? 0
                      : 1,
                },
              ]}>
              <View style={styles.leaveType}>
                <Text style={styles.leaveText}>{leaveHistory?.leaveType}</Text>
              </View>
              <Text style={styles.leaveText}>
                {userInfo?.strUrl === rscURL ? (
                  <Text style={styles.leaveText1}>
                    {leaveHistory?.remainingDaysForApp || 0}
                  </Text>
                ) : (
                  <Text style={styles.leaveText1}>
                    {leaveHistory?.remainingDays || 0}
                  </Text>
                )}
                {'  '}
                Available
              </Text>

              <Text style={[styles.leaveText, styles.pRight16]}>
                {userInfo?.strUrl === rscURL ? (
                  <Text style={styles.leaveText1}>
                    {leaveHistory?.leaveTakenDaysForApp || 0}
                  </Text>
                ) : (
                  <Text style={styles.leaveText1}>
                    {leaveHistory?.leaveTakenDays || 0}
                  </Text>
                )}
                {'  '}
                Taken
              </Text>
            </View>
          ),
        )}
      </View>
    </View>
  );
};

export default observer(MyAllLeave);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  leaveType: {
    width: '40%',
    paddingLeft: 16,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  myLeavesSection: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    borderRadius: 4,
    paddingVertical: 16,
  },
  myLeavesBox: {
    flexDirection: 'row',
    borderBottomColor: COLORS.borderBottom,
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leaveText: {
    fontSize: 14,
    lineHeight: 18,

    color: COLORS.textNewColor,
  },
  leaveText1: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  pRight16: {
    paddingRight: 16,
  },
});
