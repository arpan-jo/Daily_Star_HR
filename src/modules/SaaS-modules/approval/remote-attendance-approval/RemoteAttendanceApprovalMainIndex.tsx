import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import ContainerNew from '../../../../common/components/Container';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomHeader from '../../../../common/components/CustomHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import { date_formater } from '../../../../common/services/dateFormater';
import {
  getStatusColor,
  getStatusBgColor,
} from '../../../../common/services/getColor';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { AttendanceLocationApprovalType } from '../../../../interfaces/attendance/attendance';
import { remoteAttendanceApprovall } from '../../../../services/SaaS-modules/attendance/attendance';
import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  RemoteAttendanceLanding,
} from '../../../../common/api/api';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { commonURL } from '../../../../../App';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
const topBarItem = [
  {
    title: 'Common Approval',
    isActive: true,
    nameForApi: 'commonApproval',
    isForAll: true,
  },
  {
    title: 'Admin Approval',
    isActive: false,
    nameForApi: 'adminApproval',
    isForAll: false,
  },
];
const RemoteAttendanceApprovalMainIndex = () => {
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const toaster = useToast();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  // Opens on the tab the approval dashboard was on, so the list matches the
  // count that was tapped; the tabs below still switch it from here.
  const initialTabName =
    (route?.params as any)?.activeTabName || 'commonApproval';
  const [topBar, setTopBar] = useState(() =>
    topBarItem.map(tab => ({
      ...tab,
      isActive: tab?.nameForApi === initialTabName,
    })),
  );
  const [activeTabName, setActiveTabName] = useState(initialTabName);

  //@ts-ignore
  const remAttnApp = route?.params;

  const [remoteAttendance, setRemoteAttendance] =
    useState<AttendanceLocationApprovalType>();

  const payload = {
    applicationStatus: 'Pending',
    isAdmin:
      userInfo?.strUrl !== commonURL
        ? userInfo?.isOfficeAdmin
        : activeTabName === 'adminApproval'
          ? true
          : false,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    isSupervisor: false,
    isLineManager: false,
    isUserGroup: false,
    approverId: userInfo?.intEmployeeId,
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: userInfo?.intEmployeeId,
    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
    // for common new approval api  v2
    //@ts-ignore
    applicationTypeId: remAttnApp?.applicationTypeId,
    employeeId: userInfo?.intEmployeeId,
    // isAdmin: activeTabName === 'adminApproval' ? true : false,
    // for common new approval api  v2
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
        return;
      }
      // const res = await remoteAttendanceApprovallLanding(payload, setIsLoading);
      // const data = res?.listData.map((item: any) => {
      //   return {
      //     ...item,
      //     isActive: false,
      //   };
      // });
      // setRemoteAttendance(data);
      getLandingDataApi();
    },
    [isFocused, userInfo, activeTabName],
  );

  const isTrueSingleClick = remoteAttendance?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    // !isSearch && setIsSearch(!isSearch);
    if (remoteAttendance) {
      let modifyData = [...remoteAttendance];
      modifyData[index].isActive = !modifyData[index].isActive;
      setRemoteAttendance(modifyData);
      const isTrueSingle = modifyData?.filter(item => item?.isActive === true);
      const isFalseSingle = modifyData?.filter(
        item => item?.isActive === false,
      );
      isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
      isFalseSingle?.length ? setIsSelectAll(false) : setIsSelectAll(true);
    }
  };

  const AllActiveDeactiveHandler = () => {
    !isSearch && setIsSearch(!isSearch);
    if (remoteAttendance?.length) {
      let modifyData = [...remoteAttendance];
      const modifyAllData = modifyData.map(item => {
        return {
          ...item,
          isActive: isSelectAll ? false : true,
        };
      });
      setRemoteAttendance(modifyAllData);
      setIsSelectAll(!isSelectAll);
      const isTrueSingle = modifyAllData?.filter(
        item => item?.isActive === true,
      );
      isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
    }
  };

  const allDeactive = async () => {
    const newArr = remoteAttendance?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    if (newArr) {
      setRemoteAttendance(newArr);
    }
    setIsShowHeader(true);
    // const res = await remoteAttendanceApprovallLanding(payload, setIsLoading);
    // const data = res?.listData.map((item: any) => {
    //   return {
    //     ...item,
    //     isActive: false,
    //   };
    // });
    // setRemoteAttendance(data);
    getLandingDataApi();
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(false, 'Approve');
      if (commonURL === userInfo?.strUrl) {
        const api_params = {
          url: ApproveApplications,
          data: payload,
          method: 'post',
        };
        const res = await httpRequest(api_params, () => {});
        if (res) {
          toaster.show({ message: res?.message || res?.data, type: 'success' });
          allDeactive();
        }
      } else {
        const res = await remoteAttendanceApprovall(
          payloadForApproveOrReject,
          setIsLoading,
        );
        if (res) {
          toaster.show({ message: res?.data, type: 'success' });
          allDeactive();
        }
      }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(true, 'Approve');
      if (commonURL === userInfo?.strUrl) {
        const api_params = {
          url: ApproveApplications,
          data: payload,
          method: 'post',
        };
        const res = await httpRequest(api_params, () => {});
        if (res) {
          toaster.show({ message: res?.message || res?.data, type: 'success' });
          allDeactive();
        }
      } else {
        const res = await remoteAttendanceApprovall(
          payloadForApproveOrReject,
          setIsLoading,
        );

        if (res) {
          toaster.show({ message: res?.data, type: 'success' });
          allDeactive();
        }
      }
    }
  };

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    let payloadForApproveOrReject = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.application?.intRemoteAttendanceId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      };
    });

    let paylaodForV2 = isTrueSingleClick?.map((item: any) => {
      return {
        configHeaderId: item?.configHeaderId,
        approvalTransactionId: item?.id,
        applicationId: item?.application?.intRemoteAttendanceId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: remAttnApp?.applicationTypeId,
        isAdmin: activeTabName === 'adminApproval' ? true : false,
      };
    });
    // return payloadForApproveOrReject;
    return commonURL === userInfo?.strUrl
      ? paylaodForV2
      : payloadForApproveOrReject;
  };
  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : RemoteAttendanceLanding,
      data: payload,
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',
      // isConsole: true,
      // isConsoleParams: true,
    };
    const resData = await httpRequest(api_params, setIsLoading);
    const modifiedData = resData?.listData || resData?.data || resData;

    const data =
      modifiedData &&
      modifiedData?.map((item: any) => {
        return {
          ...item,

          strRequestStatus:
            item?.applicationInformation?.strRequestStatus ||
            item?.strRequestStatus ||
            '',
          waitingStage:
            item?.applicationInformation?.waitingStage ||
            item?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',

          intId:
            item?.applicationInformation?.applicationId ||
            item?.application?.intId,
          intEmployeeId:
            item?.applicationInformation?.employeeId ||
            item?.application?.intEmployeeId ||
            '',
          employeeName:
            item?.applicationInformation?.employeeName ||
            item?.employeeName ||
            '',
          employmentType:
            item?.applicationInformation?.employeeTypeName ||
            item?.employmentType ||
            '',
          designation:
            item?.applicationInformation?.designation ||
            item?.designation ||
            '',
          department:
            item?.applicationInformation?.department || item?.department || '',
          timeInTime:
            item?.applicationInformation?.tmeStartTime ||
            item?.timeInTime ||
            '',
          timeOutTime:
            item?.applicationInformation?.tmeEndTime || item?.timeOutTime || '',

          status: item?.applicationInformation?.status || item?.status || '',
          application: {
            ...item?.application,

            // this is for Common Approval of V2 project
            ...item?.applicationInformation,
            intRemoteAttendanceId:
              item?.applicationInformation?.applicationId ||
              item?.application?.intRemoteAttendanceId ||
              '',
            dteAttendanceDate:
              item?.applicationInformation?.dteAttendanceDate ||
              item?.application?.dteAttendanceDate ||
              '',
            dteApplicationDate:
              item?.applicationInformation?.applicationDate ||
              item?.application?.dteApplicationDate ||
              '',
            strRemarks:
              item?.applicationInformation?.strRemarks ||
              item?.application?.strRemarks ||
              '',
            intEmployeeId:
              item?.applicationInformation?.employeeId ||
              item?.application?.intEmployeeId ||
              '',
            intWorkplaceGroupId:
              item?.applicationInformation?.workplaceGroupId ||
              item?.application?.intWorkplaceGroupId ||
              '',
            dteAttendanceTime:
              item?.applicationInformation?.startTime ||
              item?.application?.dteAttendanceTime ||
              '',
            strLatitude:
              item?.applicationInformation?.latitude ||
              item?.application?.strLatitude ||
              '',
            strLongitude:
              item?.applicationInformation?.longitude ||
              item?.application?.strLongitude ||
              '',
            strStatus:
              item?.applicationInformation?.status ||
              item?.application?.strStatus ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setRemoteAttendance(data);
  };
  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
    setActiveTabName(mod[ind]?.nameForApi);
    !isSearch && setIsSearch(!isSearch);
    setIsShowHeader(true);
  };
  return (
    <ContainerNew
      isScrollView={false}
      isPaddingBottom={false}
      edges={isShowHeader ? edges2 : Platform.OS === 'ios' ? edges2 : edges1}
      header={
        <>
          {isShowHeader && (
            <>
              {isSearch && (
                <CustomHeader
                  // alterIcon={'search'}
                  // alterIconPress={() => {
                  //   setIsSearch(!isSearch);
                  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                  // }}
                  onBackPress={navigation.goBack}
                  title="Remote Attendance Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}
    >
      {userInfo?.strUrl === commonURL && (
        <>
          <Row style={styles.toptabstyle}>
            {topBar?.map(
              (item, index) =>
                // if isForAll is true then show the tab
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
        </>
      )}
      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View style={styles.headMain}>
          {/* <View style={styles.closeIconHead}>
            <TouchableOpacity onPress={() => allDeactive()}>
              <MIcon name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.singleClickText}>{isTrueSingleClick?.length}</Text>
          </View> */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              disabled={false}
              value={isSelectAll}
              onValueChange={AllActiveDeactiveHandler}
              style={styles.checkbox}
              tintColors={{ true: 'white', false: 'white' }}
              tintColor={COLORS.white}
              onCheckColor={COLORS.white}
              onTintColor={COLORS.white}
            />
            <Text style={styles.label}>All</Text>
          </View>

          <View style={styles.approvehead}>
            <TouchableOpacity
              onPress={() => setIsModalShow2(true)}
              style={styles.approveOrReject}
            >
              <Text style={styles.rejectApproveText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsModalShow(true)}
              style={[styles.approveOrReject, styles.marginLeft]}
            >
              <Text style={styles.rejectApproveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'small'}
          style={styles.loaderStyle}
        />
      ) : null}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.paddingHorizantal}
      >
        {remoteAttendance?.length > 0 &&
          remoteAttendance?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onLongPress={() => {
                activeDeactiveHandler(index);
              }}
              onPress={() => {
                if (
                  isTrueSingleClick !== undefined &&
                  isTrueSingleClick?.length > 0
                ) {
                  activeDeactiveHandler(index);
                } else {
                  navigation.navigate('RemoteAttendanceApprovalDetails', {
                    attDetails: item,
                    activeTabName: activeTabName,
                  });
                }
              }}
            >
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: item?.isActive
                      ? COLORS.lightPrimary2
                      : COLORS.white,
                  },
                ]}
              >
                <View>
                  <View style={styles.noImageBox}>
                    <FastImage source={IMAGES.NoImage} style={styles.noImage} />
                  </View>
                </View>
                <View style={styles.txtPart}>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.empName}>{item?.employeeName}</Text>
                    <Text style={styles.smallTxt}>
                      {
                        date_formater(
                          item?.application?.dteAttendanceDate,
                        )?.split(',')?.[0]
                      }
                    </Text>
                  </View>

                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.normalTxt}>{item?.status} Request</Text>

                    <View style={styles.status}>
                      <Text
                        style={[
                          styles.statusTxt,
                          {
                            color: getStatusColor(item?.status),
                            backgroundColor: getStatusBgColor(item?.status),
                          },
                        ]}
                      >
                        {item?.status}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.normalTxt}>Waiting Stage</Text>

                    <View style={styles.status}>
                      <Text style={styles.timeTxt}>
                        {item?.waitingStage || item?.currentStage}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.rowSpaceBetween}>
                    <View style={styles.flexRow}>
                      <View>
                        {/* <Text style={styles.smallTxt}>First Check In</Text> */}
                        <Text style={styles.smallTxt}>Attendance Time</Text>
                        <Text style={styles.timeTxt}>
                          {timeFormaterToPmAm(
                            item?.application?.dteAttendanceTime,
                          )}
                        </Text>
                      </View>
                      <MIcon name="north" size={20} color={COLORS.iconColor} />
                    </View>
                    {item?.isActive ? (
                      <MIcon
                        name="check-circle"
                        size={23}
                        color={COLORS.primary}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        {remoteAttendance?.length === 0 ? (
          <View style={styles.noDataBox}>
            <FastImage source={IMAGES.NoDataImage} style={styles.image} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        ) : null}

        <View style={styles.padBottom} />
      </ScrollView>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveHandler()}
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Remort Attendence application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Remort Attendence application?`}
      />
    </ContainerNew>
  );
};

export default RemoteAttendanceApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  noImage: {
    marginTop: 6,
    height: 45,
    width: 45,
    alignSelf: 'center',
  },
  status: {
    borderRadius: 100,
    paddingVertical: 1,
    alignSelf: 'flex-end',
    overflow: 'hidden',
  },
  normalTxt: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  smallTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empName: {
    fontSize: 16,
    width: '75%',
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  timeTxt: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 20,
  },
  txtPart: {
    flex: 1,
    paddingLeft: 16,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    marginVertical: 8,
  },
  flexRow: {
    flexDirection: 'row',
  },
  image: { width: 130, height: 90 },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataBox: {
    alignSelf: 'center',
    paddingTop: 20,
  },
  padBottom: {
    paddingBottom: 30,
  },
  loaderStyle: {
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
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  checkbox: {
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  label: {
    marginTop: 4,
    marginStart: 8,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
  },
  headMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    paddingTop: Platform?.OS === 'ios' ? 60 : 8,
  },

  approveOrReject: {
    backgroundColor: COLORS.statusBar,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
  },
  rejectApproveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  marginLeft: {
    marginLeft: 8,
  },
  approvehead: {
    flexDirection: 'row',
  },
  paddingHorizantal: { paddingHorizontal: 16 },
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
