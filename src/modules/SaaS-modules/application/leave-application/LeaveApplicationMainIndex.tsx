import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {LeaveLandingType} from '../../../../interfaces/leave/leave';
import {getLeaveLanding} from '../../../../services/SaaS-modules/leave/leave';
import {useRootStore} from '../../../../stores/rootStore';
import LeaveBalanceSheet from './LeaveBalanceSheet';
import {_todayDateTime} from '../../../../common/services/todayDate';
import {commonURL} from '../../../../../App';
import {Delete, GetAll} from '../../../../common/api/api';
import dayjs from 'dayjs';
import {httpRequest} from '../../../../common/constant/httpRequest';
import LeaveBalanceSheetCommon from './LeaveBalanceSheetCommon';
import Column from '../../../../common/components/Column';

import Row from '../../../../common/components/Row';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {approvalCommonStyle} from '../../approval/ApprovalMainIndexFromSupDash';

const edges: Edge[] = ['right', 'bottom', 'left'];

const LeaveApplicationMainIndex = ({route}: any) => {
  const empLeaveData = route?.params?.empLeaveData;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const refRBSheet = useRef();
  const [isLoading, setIsLoading] = useState();
  const isFocused = useIsFocused();
  const [leaveLandingData, setLeaveLandingData] =
    useState<LeaveLandingType[]>();
  const [commonLeaveLandingData, setCommonLeaveLandingData] = useState<any[]>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [applicationId, setApplicationId] = useState('');
  // current Yaer
  let currentYear = _todayDateTime().getFullYear();
  const toaster = useToast();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (commonURL === userInfo?.strUrl) {
        getLandingData();
      } else {
        const res = await getLeaveLanding(
          empLeaveData?.EmployeeId ||
            empLeaveData?.leaveApplication?.intEmployeeId ||
            userInfo?.intEmployeeId,
          setIsLoading,
          currentYear,
        );
        setLeaveLandingData(res);
      }
    },
    [isFocused],
  );

  const getLandingData = async () => {
    const firstDate = dayjs().startOf('year').format('YYYY-MM-DD');
    const lastDate = dayjs().endOf('year').format('YYYY-MM-DD');
    const api_params = {
      url: GetAll,
      data: {
        employeeId:
          empLeaveData?.EmployeeId ||
          empLeaveData?.leaveApplication?.intEmployeeId ||
          userInfo?.intEmployeeId,
        leaveTypeList: [],
        approvalStatusList: [],
        fromDate: firstDate,
        toDate: lastDate,
      },
      method: 'post',
    };
    const res = await httpRequest(api_params, setIsLoading);
    const list = res?.employeeLeaveApplicationListDto || [];
    setCommonLeaveLandingData(list);
  };
  const isEditable = (status: string | undefined | null): boolean => {
    let modStatus = status?.trim()?.toLowerCase();
    if (modStatus === 'approved') {
      return false;
    } else if (modStatus === 'rejected') {
      return false;
    } else {
      return true;
    }
  };

  const handleDelete = async () => {
    if (applicationId?.length === 0) {
      return;
    }
    const api_params = {
      url: Delete,
      data: {applicationId: applicationId},
      method: 'delete',
      isPostOrPutWithParams: true,
    };

    const response = await httpRequest(api_params, () => {});

    if (
      response?.statusCode === 200 ||
      response?.StatusCode === 200 ||
      response?.statuscode === 200
    ) {
      toaster.show({
        message:
          response?.Message || response?.message || 'Deleted successfully!',
        type: 'success',
      });
      await getLandingData();
      setApplicationId('');
    } else {
      toaster.show({
        type: 'warning',
        message:
          response?.Message || response?.message || 'Something Went Wrong!',
      });
    }
    setIsModalShow(false);
  };

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnPress={() => {
        if (commonURL !== userInfo?.strUrl) {
          //@ts-ignore
          navigation.navigate('CreateEditLeaveApplication', {
            leaveDetails: {
              AccountId:
                empLeaveData?.profileData?.empEmployeeBankDetail?.intAccountId,
              BusinessUnitId: empLeaveData?.intBusinessUnitId,
              EmployeeId: empLeaveData?.EmployeeId,
              isLeaveCreate: true,
            },
          });
        } else {
          navigation.navigate('CreateEditForCommon', {
            leaveDetails: {
              AccountId:
                empLeaveData?.profileData?.empEmployeeBankDetail?.intAccountId,
              BusinessUnitId: empLeaveData?.intBusinessUnitId,
              EmployeeId: empLeaveData?.EmployeeId,
              isLeaveCreate: true,
            },
          });
        }
      }}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          infoIconPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          title="Leave Application"
        />
      }
      style={styles.container}>
      {commonURL === userInfo?.strUrl ? (
        <>
          {commonLeaveLandingData && commonLeaveLandingData?.length > 0 ? (
            <Column style={{margin: 1}} colWidth={'100%'}>
              {commonLeaveLandingData?.map((item, index) => (
                <Column
                  key={index}
                  isCard
                  colWidth={'100%'}
                  isPressOn={!isEditable(item?.approvalStatus)}
                  onCardPress={() =>
                    //@ts-ignore
                    navigation.navigate('CreateEditForCommon', {
                      leaveDetails: {...item, empLeaveData},
                    })
                  }>
                  <Row justify="space-between">
                    <Column colWidth={'70%'}>
                      <Text style={styles.titleTxt}>{item?.leaveType}</Text>
                      <Text style={styles.date}>
                        {`${date_formater(item?.dteFromDate)} - ${date_formater(item?.dteToDate)}`}
                      </Text>
                    </Column>

                    <Column colWidth={'30%'}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor: getStatusBgColor(
                              item?.approvalStatus,
                            ),
                          },
                        ]}>
                        <Text
                          style={[
                            styles.statusText,
                            {color: getStatusColor(item?.approvalStatus)},
                          ]}>
                          {item?.approvalStatus}
                        </Text>
                      </View>
                      {isEditable(item?.approvalStatus) ? (
                        <TouchableOpacity
                          style={styles.deleteButton}
                          onPress={() => {
                            setApplicationId(item?.leaveApplicationId);
                            setIsModalShow(true);
                          }}>
                          <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                      ) : null}
                    </Column>
                  </Row>
                </Column>
              ))}
            </Column>
          ) : (
            <View style={styles.noImgContainer}>
              <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          )}
        </>
      ) : (
        <>
          {leaveLandingData && leaveLandingData?.length > 0 ? (
            <View>
              {leaveLandingData?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() =>
                    //@ts-ignore
                    navigation.navigate('LeaveApplicationDetails', {
                      leaveDetails: {...item, empLeaveData},
                    })
                  }
                  style={styles.leaveCard}>
                  <View style={styles.leaveTextPart}>
                    <MIcon name="luggage" size={30} color={COLORS.primary} />
                    <View style={styles.paddingLeft}>
                      <Text style={styles.titleTxt}>{item?.LeaveType}</Text>
                      <Text style={styles.date}>{`${date_formater(
                        item?.AppliedFromDate,
                      )} - ${date_formater(item?.AppliedToDate)}`}</Text>
                    </View>
                  </View>

                  <View>
                    <Text
                      style={[
                        styles.status,
                        {
                          color: getStatusColor(item?.ApprovalStatus),
                          backgroundColor: getStatusBgColor(
                            item?.ApprovalStatus,
                          ),
                        },
                      ]}>
                      {item?.ApprovalStatus}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noImgContainer}>
              <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          )}
        </>
      )}

      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={styles.loadingIndicator}
        />
      ) : null}

      {commonURL === userInfo?.strUrl ? (
        <LeaveBalanceSheetCommon
          refRBSheet={refRBSheet}
          employeeId={
            empLeaveData?.EmployeeId ||
            empLeaveData?.leaveApplication?.intEmployeeId ||
            userInfo?.intEmployeeId
          }
          // for common project
          workplaceGroupId={
            empLeaveData?.intWorkplaceGroupId ||
            empLeaveData?.leaveApplication?.intWorkplaceGroupId ||
            userInfo?.intWorkplaceGroupId
          }
          buId={userInfo?.intBusinessUnitId}
        />
      ) : (
        <LeaveBalanceSheet
          refRBSheet={refRBSheet}
          employeeId={
            empLeaveData?.EmployeeId ||
            empLeaveData?.leaveApplication?.intEmployeeId ||
            userInfo?.intEmployeeId
          }
          // for common project
          workplaceGroupId={
            empLeaveData?.intWorkplaceGroupId ||
            empLeaveData?.leaveApplication?.intWorkplaceGroupId ||
            userInfo?.intWorkplaceGroupId
          }
          buId={userInfo?.intBusinessUnitId}
        />
      )}

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => handleDelete()}
        modalText={'Are you sure you want delete this?'}
        deleteText={'Yes, Confirm'}
      />
    </ContainerNew>
  );
};

export default LeaveApplicationMainIndex;

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
  paddingLeft: {paddingLeft: 8},
  noImgContainer: {alignSelf: 'center', paddingTop: 50},
  fastImg: {width: 130, height: 90},
  loadingIndicator: {paddingTop: 30},
  paddingBottom: {paddingBottom: 200},

  statusBadge: {
    width: 85,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'center',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  deleteButton: {
    backgroundColor: '#FF8587', // You can replace with lighter tone like '#FFBDBD'
    width: 85,
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: 5,
  },
  deleteButtonText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '500',
  },
  ...approvalCommonStyle,
});
