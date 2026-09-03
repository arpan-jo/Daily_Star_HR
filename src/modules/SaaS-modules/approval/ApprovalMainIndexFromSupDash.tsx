import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {commonURL} from '../../../../App';
import {
  GetPendingApprovalDashboard,
  PendingApprovalDashboard,
  WorkplaceWithRoleExtension,
} from '../../../common/api/api';
import ContainerNew from '../../../common/components/Container';
import CustomDropDownNew from '../../../common/components/CustomDropDown';
import CustomHeader from '../../../common/components/CustomHeader';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS, SIZES} from '../../../common/constant/Themes';
import {httpRequest} from '../../../common/constant/httpRequest';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../common/services/getColor';
import {ApprovalMenuType} from '../../../interfaces/approval/approval';
import {useRootStore} from '../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ApprovalMainIndexFromSupDash = () => {
  const [isLoadAgain, setIsLoadAgain] = useState(false);
  const {userInfo, userInfoSave} = useRootStore();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const netInfo = useNetInfo();
  const isFoucused = useIsFocused();
  const [approvalMenu, setApprovalMenu] = useState<ApprovalMenuType[]>();
  const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<any[]>();
  const {control, setValue, reset} = useForm();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsLoadAgain(false);
      getMenuData();
      getWorkplaceData();
    },
    [isFoucused, isLoadAgain],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const defaultValuesForUpdate = {
        workPlace: {
          value: userInfo?.intWorkplaceId,
          label: userInfo?.strWorkplace,
        },
      };
      reset(defaultValuesForUpdate);
    },
    [isFoucused],
  );

  useEffect(() => {
    NetInfo.refresh().then(state => {
      if (state.isConnected && !approvalMenu) {
        getMenuData();
      }
      if (!state.isConnected) {
        getMenuData();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!approvalMenu, isFoucused, netInfo?.isConnected]);

  const getMenuData = async () => {
    const payloadForAll = {
      accountId: userInfo?.intAccountId,
      employeeId: userInfo?.intEmployeeId,
      isAdmin: userInfo?.isOfficeAdmin,
      iAmFromWeb: false,
      iAmFromApps: true,
    };
    const api_params = {
      url:
        commonURL === userInfo?.strUrl
          ? GetPendingApprovalDashboard
          : PendingApprovalDashboard,
      data:
        commonURL === userInfo?.strUrl
          ? {
              ...payloadForAll,
              workplaceGroupId:
                userInfo?.intWorkplaceGroupId ||
                userInfo?.originalWorkplaceGroupId,
              workplaceId: userInfo?.intWorkplaceId,
              businessUnitId: userInfo?.intBusinessUnitId,
            }
          : payloadForAll,
    };
    const res = await httpRequest(api_params, setIsLoading);
    setApprovalMenu(res);
  };

  const iconName = (item: ApprovalMenuType) => {
    if (
      item?.pipelineCode === 'BABBAPBANDNQNARQ' ||
      item?.applicationTypeId === 8
    ) {
      return 'luggage';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNNAO' ||
      item?.applicationTypeId === 14
    ) {
      return 'directions-car';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNNAP' ||
      item?.applicationTypeId === 15
    ) {
      return 'schedule-send';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNNAQ' ||
      item?.applicationTypeId === 9
    ) {
      return 'receipt';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNBQC' ||
      item?.applicationTypeId === 6
    ) {
      return 'request-page';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNBQP' ||
      item?.applicationTypeId === 7
    ) {
      return 'receipt-long';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNONP' ||
      item?.applicationTypeId === 17
    ) {
      return 'person-pin-circle';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNONC' ||
      item?.applicationTypeId === 10
    ) {
      return 'map';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNNAC' ||
      item?.applicationTypeId === 11
    ) {
      return 'perm-contact-calendar';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNOBE' ||
      item?.applicationTypeId === 12
    ) {
      return 'business-center';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNOND' ||
      item?.applicationTypeId === 3
    ) {
      return 'request-page';
    }
    if (
      item?.pipelineCode === 'BABBAPBANDNQNOPR' ||
      item?.applicationTypeId === 13
    ) {
      return 'map';
    }
  };

  const getWorkplaceData = async () => {
    if (commonURL === userInfo?.strUrl) {
      const params = {
        url: WorkplaceWithRoleExtension,
        data: {
          accountId: userInfo?.intAccountId,
          businessUnitId: userInfo?.intBusinessUnitId,
          workplaceGroupId:
            userInfo?.intWorkplaceGroupId || userInfo?.originalWorkplaceGroupId,
          empId: userInfo?.intEmployeeId,
        },
      };
      const resss = await httpRequest(params, () => {});
      const modifiedData = resss?.map((item: any) => {
        return {
          ...item,
          value: item?.intWorkplaceId,
          label: item?.strWorkplace,
        };
      });
      setSelectedWorkplaceId(modifiedData);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      header={<CustomHeader onBackPress={navigation.goBack} title="Approval" />}
      style={styles.container}>
      <View
        style={{
          height: SIZES.height,
        }}>
        <View style={{height: 50, marginBottom: 10}}>
          <CustomDropDownNew
            control={control}
            data={selectedWorkplaceId}
            name="workPlace"
            label="Workplace"
            placholder="Choose"
            onChange={(options: any) => {
              setValue('workPlace', options);
              const updtedLoginInfo = {
                ...userInfo,
                intWorkplaceId: options?.value || userInfo?.intWorkplaceId,
                strWorkplace: options?.label || userInfo?.strWorkplace,
              };
              //@ts-ignore
              userInfoSave(updtedLoginInfo);
              setIsLoadAgain(true);
            }}
            rules={{required: true}}
          />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View>
            {isLoading ? (
              <ActivityIndicator
                color={COLORS.primary}
                size={'small'}
                style={styles.activityIndicatorStyle}
              />
            ) : null}
            {approvalMenu?.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNARQ' ||
                    item?.applicationTypeId === 8
                  ) {
                    navigation.navigate('LeaveApprovalMainIndex', item);
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNNAO' ||
                    item?.applicationTypeId === 14
                  ) {
                    navigation.navigate('MovementApprovalMainIndex', item);
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNNAQ' ||
                    item?.applicationTypeId === 9
                  ) {
                    navigation.navigate('LoanApprovalMainIndex', item);
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNONP' ||
                    item?.applicationTypeId === 17
                  ) {
                    navigation.navigate(
                      'RemoteAttendanceApprovalMainIndex',
                      item,
                    );
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNNAP' ||
                    item?.applicationTypeId === 15
                  ) {
                    navigation.navigate('OvertimeApprovalMainIndex');
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNBQP' ||
                    item?.applicationTypeId === 7
                  ) {
                    navigation.navigate('IOUAdjustmentApprovalMainIndex');
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNBQC' ||
                    item?.applicationTypeId === 6
                  ) {
                    navigation.navigate('IOUApprovalMainIndex', item);
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNNAC' ||
                    item?.applicationTypeId === 11
                  ) {
                    navigation.navigate(
                      'AttendanceAdjustmentApprovalMainIndex',
                      item,
                    );
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNONC' ||
                    item?.applicationTypeId === 10
                  ) {
                    navigation.navigate(
                      'LocationAndDeviceApprovalMainIndex',
                      item,
                    );
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNOBE' ||
                    item?.applicationTypeId === 12
                  ) {
                    navigation.navigate('MarketVisitApprovalMainIndex', item);
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNOND' ||
                    item?.applicationTypeId === 3
                  ) {
                    navigation.navigate('ExpenseApprovalMainIndex');
                  }
                  if (
                    item?.pipelineCode === 'BABBAPBANDNQNOPR' ||
                    item?.applicationTypeId === 13
                  ) {
                    navigation.navigate('AssignedLocationApprovalMain', item);
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
                    <Text style={styles.titleTxt}>
                      {commonURL === userInfo?.strUrl
                        ? item?.applicationType || item?.menuName || ''
                        : item?.menuName || ''}
                    </Text>
                  </View>
                </View>

                <View>
                  <Text
                    style={[
                      styles.status,
                      {
                        color: getStatusColor('Approved'),
                        backgroundColor: getStatusBgColor('Approved'),
                      },
                    ]}>
                    {commonURL === userInfo?.strUrl
                      ? item?.pendingApprovalCount || item?.totalCount || '0'
                      : item?.totalCount || ''}
                  </Text>
                </View>
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

export default ApprovalMainIndexFromSupDash;
export const approvalCommonStyle = StyleSheet.create({
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
  },
  iconPart: {
    width: 40,
    backgroundColor: COLORS.borderBottom,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingTop: 6,
  },

  paddingLeft: {
    paddingLeft: 8,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  alignCenter: {
    alignSelf: 'center',
  },
  fastImg: {
    width: 130,
    height: 90,
  },
  activityIndicatorStyle: {
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
  },
  ...approvalCommonStyle,
});
