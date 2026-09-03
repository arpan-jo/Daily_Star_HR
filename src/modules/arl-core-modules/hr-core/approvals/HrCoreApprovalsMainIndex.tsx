import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {SmarARLMenuType} from '../../../../interfaces/ARL-Core/ARLMenutype';
import {getMenuData} from '../../../../services/arl-core-modules/services';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {approvalCommonStyle} from '../../../SaaS-modules/approval/ApprovalMainIndexFromSupDash';

const edges: Edge[] = ['right', 'left'];

const HrCoreApprovalsMainIndex = () => {
  const {userInfo} = useRootStore();
  const [, setIsLoading] = useState(false);
  const isFoucused = useIsFocused();
  const [approvalMenu, setApprovalMenu] = useState<SmarARLMenuType[]>();
  const netInfo = useNetInfo();
  const navigation = useNavigation();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getMenuDataApi();
    },
    [isFoucused],
  );

  useEffect(() => {
    NetInfo.refresh().then(state => {
      if (state.isConnected && !approvalMenu) {
        getMenuDataApi();
      }
      if (!state.isConnected) {
        getMenuDataApi();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!approvalMenu, isFoucused, netInfo?.isConnected]);

  const getMenuDataApi = async () => {
    const menuData = await getMenuData(userInfo?.intUserId, setIsLoading);
    const res = menuData
      ?.filter((it: any) => it?.label === 'Approval')?.[0]
      ?.childList?.filter((ite: any) => ite?.label === 'HR Approvals');
    console.log(
      'res?.[0]?.childList',
      JSON.stringify(res?.[0]?.childList, null, 2),
    );
    setApprovalMenu(res?.[0]?.childList);
  };

  const iconName = (item: any) => {
    if (item?.label?.trim() === 'Leave') {
      return 'luggage';
    }
    if (item?.label?.trim() === 'Movement') {
      return 'directions-car';
    }
    if (item?.label?.trim() === 'Overtime') {
      return 'schedule-send';
    }
    if (item?.label?.trim() === 'Loan') {
      return 'receipt';
    }
    if (item?.label?.trim() === 'IOU') {
      return 'request-page';
    }
    if (item?.label?.trim() === 'IOU Adjust') {
      return 'receipt-long';
    }
    if (item?.label?.trim() === 'Remote Att.') {
      return 'person-pin-circle';
    }
    if (item?.label?.trim() === 'e-Presence') {
      return 'map';
    }
    if (item?.label?.trim() === 'Att. Adjust') {
      return 'perm-contact-calendar';
    }
    if (item?.label?.trim() === 'Market Visit') {
      return 'business-center';
    }
    if (item?.label?.trim() === 'Expense') {
      return 'request-page';
    }
    if (item?.label?.trim() === 'Master Location') {
      return 'map';
    }
    if (item?.label?.trim() === 'Advance Exp') {
      return 'request-page';
    }
  };

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          alterIcon={'widgets'}
          alterIconPress={() => navigation.goBack()}
          title="HR Core"
        />
      }
      style={styles.container}>
      <View
        style={{
          height: SIZES.height,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View>
            {approvalMenu?.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (item?.label?.trim() === 'Leave') {
                    navigation.navigate('LeaveApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Movement') {
                    navigation.navigate('MovementApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Loan') {
                    navigation.navigate('LoanApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Remote Att.') {
                    navigation.navigate('RemoteAttendanceApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Overtime') {
                    navigation.navigate('OvertimeApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'IOU Adjust') {
                    navigation.navigate('IOUAdjustmentApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'IOU') {
                    navigation.navigate('IOUApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Att. Adjust') {
                    navigation.navigate(
                      'AttendanceAdjustmentApprovalMainIndex',
                    );
                  }
                  if (item?.label?.trim() === 'e-Presence') {
                    navigation.navigate('LocationAndDeviceApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Market Visit') {
                    navigation.navigate('MarketVisitApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Expense') {
                    navigation.navigate('ExpenseApprovalMainIndex');
                  }
                  if (item?.label?.trim() === 'Master Location') {
                    navigation.navigate('AssignedLocationApprovalMain');
                  }
                  if (item?.label?.trim() === 'Advance Exp') {
                    navigation.navigate('AdvanceExpenseApprovalMainIndex');
                  }
                }}
                key={index}
                style={styles.leaveCard}>
                <View style={styles.leaveTextPart}>
                  <View style={styles.iconPart}>
                    <MIcon
                      //@ts-ignore
                      name={iconName(item)}
                      size={25}
                      color={COLORS.primary}
                    />
                  </View>
                  <View style={styles.paddingLeft}>
                    <Text style={styles.titleTxt}>{item?.label}</Text>
                  </View>
                </View>

                {/* <View>
                  <Text
                    style={[
                      styles.status,
                      {
                        color: getStatusColor('Approved'),
                        backgroundColor: getStatusBgColor('Approved'),
                      },
                    ]}
                  >
                    {item?.totalCount}
                  </Text>
                </View> */}
              </TouchableOpacity>
            ))}

            {approvalMenu?.length === 0 || !approvalMenu ? (
              <View style={styles.alignCenter}>
                <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
                <Text style={styles.noDataText}>No data found</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.paddingBottom} />
        </ScrollView>
      </View>
    </ContainerNew>
  );
};

export default HrCoreApprovalsMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingTop: 6,
  },

  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
  paddingLeft: {paddingLeft: 8},
  alignCenter: {alignSelf: 'center'},
  fastImg: {width: 130, height: 90},
  ...approvalCommonStyle,
});
