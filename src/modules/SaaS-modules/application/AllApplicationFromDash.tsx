import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {useRootStore} from '../../../stores/rootStore';
import {LeaveMenuType} from '../../../interfaces/application/application';
import {getMenuPermissionAPI} from '../../../services/SaaS-modules/drawer/drawer';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import {getBgColorByLabel, getIconByLabel} from './ApplicationCommonFunction';
import {COLORS} from '../../../common/constant/Themes';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const AllApplicationFromDash = () => {
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [leaveMenu, setLeaveMenu] = useState<LeaveMenuType[]>();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);

      const modifiedRes = menuRes?.filter(
        (item: any) => item?.label === 'Application',
      );

      const filteredMenu = modifiedRes?.[0]?.childList?.filter(
        (item: any) =>
          item?.label !== 'IOU Adjustment' && item?.label !== 'Overtime',
      );
      setLeaveMenu(filteredMenu);
    },
    [isFocused, userInfo],
  );

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader onBackPress={navigation.goBack} title="Application" />
      }
      style={styles.container}>
      {/* applicaiton section */}
      <View style={styles.applicationContainer}>
        {leaveMenu?.map((item, index) => (
          <View key={index} style={styles.appCard}>
            <TouchableOpacity
              style={styles.appTouchBox}
              onPress={() => {
                if (item?.label === 'Leave') {
                  navigation.navigate('LeaveApplicationMainIndex', {
                    empLeaveData: {isLeaveCreate: true},
                  });
                }
                if (item?.label === 'Movement') {
                  navigation.navigate('MovementApplicationMainIndex', {
                    empLeaveData: {isMovementCreate: true},
                  });
                }
                if (item?.label === 'Remote Attendance') {
                  navigation.navigate('RemoteAttendanceMainIndex');
                }
                if (item?.label === 'IOU') {
                  navigation.navigate('IOUApplicationMainIndex');
                }
                if (item?.label === 'Loan') {
                  navigation.navigate('LoanApplicationMainIndex');
                }
                if (item?.label === 'Attendance Adjustment') {
                  navigation.navigate('AttendanceAdjustmentMainIndex');
                }
                if (item?.label === 'Location & Device') {
                  navigation.navigate('LocationAndDeviceMainIndex');
                }
                if (item?.label === 'e-Presence') {
                  navigation.navigate('LocationAndDeviceMainIndex');
                }
                if (item?.label?.trim() === 'Expense') {
                  navigation.navigate('ExpenseApplicationMainIndex');
                }
                if (item?.label?.trim() === 'Market Visit') {
                  navigation.navigate('MarketVisitMainIndex');
                }
              }}>
              <View
                style={[
                  styles.applicationIconBox,
                  {
                    backgroundColor: getBgColorByLabel(item?.label),
                  },
                ]}>
                <MIcon
                  //@ts-ignore
                  name={getIconByLabel(item?.label)}
                  size={30}
                  color={COLORS.white}
                />
              </View>
              <View>
                <Text style={styles.applicationTitle}>{item?.label}</Text>
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ContainerNew>
  );
};

export default AllApplicationFromDash;

const styles = StyleSheet.create({
  container: {
    // paddingVertical: 23,
    width: '100%',
  },
  applicationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  applicationIconBox: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 20,
  },
  applicationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  appCard: {width: '25%'},
  appTouchBox: {alignItems: 'center'},
});
