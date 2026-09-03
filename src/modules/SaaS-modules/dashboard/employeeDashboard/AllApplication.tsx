import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { MenuType } from '../../../../interfaces/application/application';
import { getMenuPermissionAPI } from '../../../../services/SaaS-modules/drawer/drawer';
import { useRootStore } from '../../../../stores/rootStore';
import {
  getBgColorByLabel,
  getIconByLabel,
} from '../../application/ApplicationCommonFunction';

const AllApplication = () => {
  const navigation = useNavigation();
  const { userInfo, userMenu } = useRootStore();
  const isFocused = useIsFocused();
  const [applicationMenu, setApplicationMenu] = useState<any[]>([]);

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.applicationContainer}>
        {item?.map((i: MenuType, inde: number) => (
          <TouchableOpacity
            key={inde}
            style={styles.main}
            onPress={() => {
              if (i?.label === 'Directory') {
                navigation.navigate('EmployeeDirectoryFromHome');
              }
              if (i?.label === 'Meeting') {
                navigation.navigate('MeetingAgendaMainFromDash');
              }
              if (i?.label === 'Task') {
                navigation.navigate('TodoMasterMainIndex');
              }
              if (i?.label === 'Leave') {
                navigation.navigate('LeaveApplicationMainIndex', {
                  empLeaveData: { isLeaveCreate: true },
                });
              }
              if (i?.label === 'Movement') {
                navigation.navigate('MovementApplicationMainIndex', {
                  empLeaveData: { isMovementCreate: true },
                });
              }
              if (i?.label === 'Remote Attendance') {
                navigation.navigate('RemoteAttendanceMainIndex');
              }
              if (i?.label === 'IOU') {
                navigation.navigate('IOUApplicationMainIndex');
              }
              if (i?.label === 'Loan') {
                navigation.navigate('LoanApplicationMainIndex');
              }
              if (i?.label === 'Attendance Adjustment') {
                navigation.navigate('AttendanceAdjustmentMainIndex');
              }
              if (i?.label === 'Location & Device') {
                navigation.navigate('LocationAndDeviceMainIndex');
              }
              if (item?.label?.trim() === 'Expense') {
                navigation.navigate('ExpenseApplicationMainIndex');
              }
              if (i?.label === 'e-Presence') {
                navigation.navigate('LocationAndDeviceMainIndex');
              }
              if (i?.label === 'Market Visit') {
                navigation.navigate('MarketVisitMainIndex');
              }
            }}
          >
            <View
              style={[
                styles.applicationIconBox,
                {
                  backgroundColor: getBgColorByLabel(i?.label),
                },
              ]}
            >
              <MIcon
                //@ts-ignore
                name={getIconByLabel(i?.label?.trim())}
                size={30}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.applicationTitle}>{i?.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (userMenu?.length > 0) {
        const modifiedMenuRes = userMenu?.filter(
          (item: any) => item?.label === 'Application',
        );
        const filteredMenu = modifiedMenuRes?.[0]?.childList?.filter(
          (item: any) =>
            item?.label?.trim() !== 'IOU Adjustment' &&
            item?.label?.trim() !== 'Overtime' &&
            item?.label?.trim() !== 'Location Assign',
        );

        const filteredMenu2 = filteredMenu ? [...filteredMenu] : [];

        const newArr: any[] = [];

        while (filteredMenu2?.length) {
          newArr?.push(filteredMenu2?.splice(0, 4));
        }
        setApplicationMenu(newArr);
        return;
      }

      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
      const modifiedMenuRes = menuRes?.filter(
        (item: any) => item?.label === 'Application',
      );
      const filteredMenu = modifiedMenuRes?.[0]?.childList?.filter(
        (item: any) =>
          item?.label?.trim() !== 'IOU Adjustment' &&
          item?.label?.trim() !== 'Overtime' &&
          item?.label?.trim() !== 'Location Assign',
      );

      const filteredMenu2 = filteredMenu ? [...filteredMenu] : [];

      const newArr: any[] = [];

      while (filteredMenu2?.length) {
        newArr?.push(filteredMenu2?.splice(0, 4));
      }
      setApplicationMenu(newArr);
    },
    [isFocused],
  );

  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}>Applications</Text>

      <CustomFlatList
        data={applicationMenu}
        RenderItems={renderItem}
        horizontal
        showHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default AllApplication;

const styles = StyleSheet.create({
  applicationIconBox: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  applicationContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  applicationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  containerMargin: {
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: -20,
  },
  main: {
    alignItems: 'center',
    width: Platform.OS === 'ios' ? 85 : 90,
  },
  contain: {
    paddingVertical: 16,
    paddingBottom: 22,
  },
});
