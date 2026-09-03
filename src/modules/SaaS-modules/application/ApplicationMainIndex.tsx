import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import { IMAGES } from '../../../common/constant/Index';
import { COLORS } from '../../../common/constant/Themes';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import { LeaveMenuType } from '../../../interfaces/application/application';
import { getMenuPermissionAPI } from '../../../services/SaaS-modules/drawer/drawer';
import { useRootStore } from '../../../stores/rootStore';
import { getBgColorByLabel, getIconByLabel } from './ApplicationCommonFunction';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ApplicationMainIndex = observer<DrawerScreenProps<'Leave'>>(
  ({ navigation }) => {
    const { userInfo, userMenu } = useRootStore();
    const isFocused = useIsFocused();
    const [leaveMenu, setLeaveMenu] = useState<LeaveMenuType[]>();
    const [isShowUp] = useState(false);
    const netInfo = useNetInfo();

    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        getMenuData();
      },
      [isFocused, userInfo],
    );

    useEffect(() => {
      NetInfo.refresh().then(state => {
        if (state.isConnected && !leaveMenu) {
          getMenuData();
        }
        if (!state.isConnected) {
          getMenuData();
        }
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [!leaveMenu, isFocused, netInfo?.isConnected]);

    const getMenuData = async () => {
      //menu load form mobx
      if (userMenu?.length > 0) {
        const modifiedRes = userMenu?.filter(
          (item: any) => item?.label === 'Application',
        );
        const filteredMenu = modifiedRes?.[0]?.childList?.filter(
          (item: any) =>
            item?.label?.trim() !== 'IOU Adjustment' &&
            item?.label?.trim() !== 'Overtime' &&
            item?.label?.trim() !== 'Location Assign',
        );
        setLeaveMenu(filteredMenu);
        return;
      }
      //menu load form api
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
      const modifiedRes = menuRes?.filter(
        (item: any) => item?.label === 'Application',
      );
      const filteredMenu = modifiedRes?.[0]?.childList?.filter(
        (item: any) =>
          item?.label?.trim() !== 'IOU Adjustment' &&
          item?.label?.trim() !== 'Overtime' &&
          item?.label?.trim() !== 'Location Assign',
      );
      setLeaveMenu(filteredMenu);
    };

    return (
      <ContainerNew
        edges={edges}
        isScrollView={false}
        header={
          <CustomHeader
            onLeftMenuPress={navigation.toggleDrawer}
            title="Application"
            // components={
            //   <TouchableOpacity style={styles.buttonArrow} onPress={() => setIsShowUp(!isShowUp)}>
            //     <MIcon
            //       name={isShowUp ? 'arrow-circle-down' : 'arrow-circle-up'}
            //       size={26}
            //       color={COLORS.white}
            //     />
            //   </TouchableOpacity>
            // }
          />
        }
        style={styles.container}
      >
        {/* {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'small'}
          style={{
            position: 'absolute',
            zIndex: 999999,
            alignContent: 'center',
            alignSelf: 'center',
            backgroundColor: COLORS.white,
            borderWidth: 1,
            borderColor: COLORS.white,
            borderRadius: 100,
            padding: 10,
            justifyContent: 'center',
            elevation: 10,
            flex: 1,
          }}
        />
      ) : null} */}
        <View
          style={[
            styles.applicationContainer,
            !isShowUp ? styles.paddingDown : {},
          ]}
        >
          {leaveMenu?.map((item, index) => (
            <View key={index} style={styles.appCard}>
              <TouchableOpacity
                style={styles.appTouchBox}
                onPress={() => {
                  if (item?.label?.trim() === 'Leave') {
                    navigation.navigate('LeaveApplicationMainIndex', {
                      empLeaveData: { isLeaveCreate: true },
                    });
                  }
                  if (item?.label?.trim() === 'Movement') {
                    navigation.navigate('MovementApplicationMainIndex', {
                      empLeaveData: { isMovementCreate: true },
                    });
                  }
                  if (item?.label?.trim() === 'Remote Attendance') {
                    navigation.navigate('RemoteAttendanceMainIndex');
                  }
                  if (item?.label?.trim() === 'IOU') {
                    navigation.navigate('IOUApplicationMainIndex');
                  }
                  if (item?.label?.trim() === 'Loan') {
                    navigation.navigate('LoanApplicationMainIndex');
                  }
                  if (item?.label?.trim() === 'Attendance Adjustment') {
                    navigation.navigate('AttendanceAdjustmentMainIndex');
                  }
                  if (item?.label === 'Location & Device') {
                    navigation.navigate('LocationAndDeviceMainIndex');
                  }
                  if (item?.label?.trim() === 'Expense') {
                    navigation.navigate('ExpenseApplicationMainIndex');
                  }
                  if (item?.label === 'e-Presence') {
                    navigation.navigate('LocationAndDeviceMainIndex');
                  }
                  if (item?.label?.trim() === 'Market Visit') {
                    navigation.navigate('MarketVisitMainIndex');
                  }
                }}
              >
                <View
                  style={[
                    styles.applicationIconBox,
                    {
                      backgroundColor: getBgColorByLabel(item?.label),
                    },
                  ]}
                >
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

        {leaveMenu?.length === 0 || !leaveMenu ? (
          <View style={styles.alignCenter}>
            <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        ) : null}
      </ContainerNew>
    );
  },
);

export default ApplicationMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  applicationContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  paddingDown: {
    // paddingTop:
    // Platform.OS === 'ios' ? SIZES.height / 1.7 : SIZES.height / 1.58,
  },
  // footerSection: { alignSelf: 'center', paddingTop: 18, paddingBottom: 2 },
  // footerButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // footerText: {
  //   fontSize: 16,
  //   lineHeight: 20,
  //   fontWeight: '500',
  //   color: COLORS.textNewColor,
  // },
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
  appCard: { width: '25%' },
  appTouchBox: { alignItems: 'center' },

  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },

  alignCenter: { alignSelf: 'center' },
  fastImg: { width: 130, height: 90 },
});
