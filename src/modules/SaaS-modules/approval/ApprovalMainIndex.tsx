import NetInfo, {useNetInfo} from '@react-native-community/netinfo';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  GetPendingApprovalDashboard,
  PendingApprovalDashboard,
  WorkplaceWithRoleExtension} from '../../../common/api/api';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS, SIZES} from '../../../common/constant/Themes';
import {httpRequest} from '../../../common/constant/httpRequest';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  getStatusBgColor,
  getStatusColor} from '../../../common/services/getColor';
import {ApprovalMenuType} from '../../../interfaces/approval/approval';
import {useRootStore} from '../../../stores/rootStore';
import {commonURL} from '../../../../App';
import CustomDropDownNew from '../../../common/components/CustomDropDown';
import {useForm} from 'react-hook-form';
import {approvalCommonStyle} from './ApprovalMainIndexFromSupDash';
import Row from '../../../common/components/Row';
import TopBarItem from '../../../common/components/TabBaritem';
import LoadingContainer from '../../../common/components/Loading';

const edges: Edge[] = ['right', 'bottom', 'left'];
const topBarItem = [
  {
    title: 'Common Approval',
    isActive: true,
    isForAll: true,
    nameForApi: 'commonApproval',
  },
  {
    title: 'Admin Approval',
    isActive: false,
    isForAll: false,
    nameForApi: 'adminApproval',
  },
];
const ApprovalMainIndex = observer<DrawerScreenProps<'Approval'>>(
  ({navigation}) => {
    const {userInfo, userInfoSave} = useRootStore();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadAgain, setIsLoadAgain] = useState(false);
    const isFoucused = useIsFocused();
    const [approvalMenu, setApprovalMenu] = useState<ApprovalMenuType[]>();
    const [selectedWorkplaceId, setSelectedWorkplaceId] = useState<any[]>();
    const [topBar, setTopBar] = useState(topBarItem);
    const netInfo = useNetInfo();
    const {control, setValue, reset} = useForm();

    const handleTopBar = (ind: any) => {
      const mod = [...topBar];
      const temp = mod?.map((item: any, index: any) => {
        return {
          ...item,
          isActive: ind === index ? true : false,
        };
      });
      setTopBar(temp);
      setApprovalMenu([]);
    };
    useEffect(() => {
      if (userInfo) {
        const mod = [...topBar];
        const temp = mod?.map((item: any, _index: any) => {
          return {
            ...item,
            isForAll:
              item?.nameForApi === 'adminApproval'
                ? userInfo?.isOfficeAdmin
                : true,
          };
        });
        setTopBar(temp);
      }
    }, [userInfo]);

    useAsyncEffect(
      async isMounted => {
        if (!isMounted()) {
          return null;
        }
        setIsLoadAgain(false);
        getMenuData();
        getWorkplaceData();
      },
      [isFoucused, isLoadAgain, topBar],
    );
    console.log('workplace id', selectedWorkplaceId);
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
    }, [!approvalMenu, isFoucused, netInfo?.isConnected, topBar]);

    // Need uncomment for v2
    const getMenuData = async () => {
      const payloadForAll = {
        accountId: userInfo?.intAccountId,
        employeeId: userInfo?.intEmployeeId,
        isAdmin: userInfo?.isOfficeAdmin,
        iAmFromWeb: false,
        iAmFromApps: true,
      };
      const commonAPIParams = {
        accountId: userInfo?.intAccountId,
        businessUnitId: userInfo?.intBusinessUnitId,
        workplaceGroupId:
          userInfo?.intWorkplaceGroupId || userInfo?.originalWorkplaceGroupId,
        workplaceId: userInfo?.intWorkplaceId,
        employeeId: userInfo?.intEmployeeId,
        isAdmin: topBar[0]?.isActive ? false : true,
      };
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? GetPendingApprovalDashboard
            : PendingApprovalDashboard,
        data: commonURL === userInfo?.strUrl ? commonAPIParams : payloadForAll,
      };
      const res = await httpRequest(api_params, setIsLoading);
      setApprovalMenu(res || []);
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
      if (item?.applicationTypeId === 4) {
        return 'money';
      }
      if (item?.applicationTypeId === 20) {
        return 'money';
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
              userInfo?.intWorkplaceGroupId ||
              userInfo?.originalWorkplaceGroupId,
            empId: userInfo?.intEmployeeId,
          },
          isConsole: true,
        };
        const resss = await httpRequest(params, () => {});
        console.log('workplace api response', JSON.stringify(resss, null, 2));
        const modifiedData = resss?.map((item: any) => {
          return {
            ...item,
            value: item?.intWorkplaceId,
            label: item?.strWorkplace,
          };
        });
        console.log('workplace data', modifiedData);
        setSelectedWorkplaceId(modifiedData);
      }
    };

    return (
      <ContainerNew
        isRefresh={false}
        edges={edges}
        header={
          <CustomHeader
            onLeftMenuPress={navigation.toggleDrawer}
            title="Approval"
          />
        }
        style={styles.container}>
        <LoadingContainer isLoading={isLoading} />
        <Row style={styles.toptabstyle}>
          {topBar?.map(
            (item, index) =>
              item?.isForAll && (
                <TopBarItem
                  item={item}
                  index={index}
                  onPress={handleTopBar}
                  key={index?.toString()}
                />
              ),
          )}
        </Row>
        <View style={styles.bodyContainer}>
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
              {approvalMenu?.length > 0 ? (
                approvalMenu?.map((item, index) => (
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
                        navigation.navigate(
                          'MarketVisitApprovalMainIndex',
                          item,
                        );
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
                        navigation.navigate(
                          'AssignedLocationApprovalMain',
                          item,
                        );
                      }
                      if (
                        // item?.pipelineCode === 'BABBAPBANDNQNOPR' ||
                        item?.applicationTypeId === 4
                      ) {
                        navigation.navigate('IncrementApprovalMainIndex', item);
                      }
                      if (
                        // item?.pipelineCode === 'BABBAPBANDNQNOPR' ||
                        item?.applicationTypeId === 20
                      ) {
                        navigation.navigate(
                          'SalaryGenerateApprovalMainIndex',
                          item,
                        );
                      }
                    }}
                    key={index?.toString()}
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
                          ? item?.pendingApprovalCount ||
                            item?.totalCount ||
                            '0'
                          : item?.totalCount || ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.alignCenter}>
                  <FastImage
                    source={IMAGES.NoDataImage}
                    style={styles.fastImg}
                  />
                  <Text style={styles.noDataText}>No data found</Text>
                </View>
              )}

              {/* {approvalMenu?.length === 0 || !approvalMenu ? (
                <View style={styles.alignCenter}>
                  <FastImage
                    source={IMAGES.NoDataImage}
                    style={styles.fastImg}
                  />
                  <Text style={styles.noDataText}>No data found</Text>
                </View>
              ) : null} */}
            </View>

            <View style={styles.paddingBottom} />
          </ScrollView>
        </View>
      </ContainerNew>
    );
  },
);

export default ApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    // backgroundColor: COLORS.white,
    // paddingTop: 6,
  },
  bodyContainer: {
    height: SIZES.height,
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
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },

  ...approvalCommonStyle,
});
