import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import CheckBox from '@react-native-community/checkbox';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomHeader from '../../../../common/components/CustomHeader';
import SearchHeader from '../../../../common/components/SearchHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import { date_formater } from '../../../../common/services/dateFormater';
import {
  getStatusColor,
  getStatusBgColor,
} from '../../../../common/services/getColor';
import { AttendanceAdjustmentApprovalLandingListDataType } from '../../../../interfaces/attendance/attendance';

import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  ManualAttendanceApprovalEngine,
  ManualAttendanceLandingEngine,
} from '../../../../common/api/api';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { arlURL, commonURL } from '../../../../../App';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';
import LoadingContainer from '../../../../common/components/Loading';

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
const AttendanceAdjustmentApprovalMainIndex = () => {
  const toaster = useToast();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
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
  const { saveLogAction } = useAuditLogSave();

  //@ts-ignore
  const attAdjApp = route?.params;

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

  const landingPayload = {
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    approverId: userInfo?.intEmployeeId,
    workplaceId: 0,
    businessUnitId: userInfo?.intBusinessUnitId,
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: 0,
  };

  const payloadForLand =
    commonURL === userInfo?.strUrl
      ? {
          ...landingPayload,
          workplaceGroupId: userInfo?.intWorkplaceGroupId,
          workplaceId: userInfo?.intWorkplaceId,
          businessUnitId: userInfo?.intBusinessUnitId,
          // for common new approval api  v2
          //@ts-ignore
          applicationTypeId: attAdjApp?.applicationTypeId,
          employeeId: userInfo?.intEmployeeId,
          // for common new approval api  v2
          isAdmin: activeTabName === 'adminApproval' ? true : false,
        }
      : landingPayload;
  const [attAdjustApprovalLandingData, setAttAdjustApprovalLandingData] =
    useState<AttendanceAdjustmentApprovalLandingListDataType[]>([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      // const api_params = {
      //   url: ManualAttendanceLandingEngine,
      //   data: payloadForLand,
      //   method: 'post',
      // };
      // const res = await httpRequest(api_params, setIsLoading);

      // const data =
      //   res?.listData &&
      //   res?.listData?.map((item: any) => {
      //     return {
      //       ...item,
      //       isActive: false,
      //     };
      //   });
      // setAttAdjustApprovalLandingData(data);
      getLandingDataApi();
    },
    [userInfo, isFocused, activeTabName],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      let regex = new RegExp(employeeName?.toLowerCase());
      if (attAdjustApprovalLandingData) {
        let copyEmployeeData = [...attAdjustApprovalLandingData];
        let newData = copyEmployeeData?.filter(item =>
          regex?.test(item?.strEmployeeName?.toLowerCase()),
        );
        setAttAdjustApprovalLandingData(newData);
        if (!employeeName) {
          const api_params = {
            url: ManualAttendanceLandingEngine,
            data: payloadForLand,
            method: 'post',
          };
          const res = await httpRequest(api_params, setIsLoading);
          const data =
            res?.listData &&
            res?.listData?.map((item: any) => {
              return {
                ...item,
                isActive: false,
              };
            });
          setAttAdjustApprovalLandingData(data);
        }
      }
    },
    [employeeName],
  );

  const isTrueSingleClick = attAdjustApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    if (attAdjustApprovalLandingData) {
      let modifyData = [...attAdjustApprovalLandingData];
      modifyData[index].isActive = !modifyData[index].isActive;
      setAttAdjustApprovalLandingData(modifyData);
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
    if (attAdjustApprovalLandingData?.length) {
      let modifyData = [...attAdjustApprovalLandingData];
      const modifyAllData = modifyData.map(item => {
        return {
          ...item,
          isActive: isSelectAll ? false : true,
        };
      });
      setAttAdjustApprovalLandingData(modifyAllData);
      setIsSelectAll(!isSelectAll);
      const isTrueSingle = modifyAllData?.filter(
        item => item?.isActive === true,
      );
      isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
    }
  };

  const allDeactive = async () => {
    const newArr = attAdjustApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    if (newArr) {
      setAttAdjustApprovalLandingData(newArr);
    }
    setIsShowHeader(true);
    // const api_params = {
    //   url: ManualAttendanceLandingEngine,
    //   data: payloadForLand,
    //   method: 'post',
    // };
    // const res = await httpRequest(api_params, setIsLoading);

    // const data =
    //   res?.listData &&
    //   res?.listData?.map((item: any) => {
    //     return {
    //       ...item,
    //       isActive: false,
    //     };
    //   });
    // setAttAdjustApprovalLandingData(data);
    getLandingDataApi();
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(false, 'Approve');
      //Old Process
      // const res = await postAttendanceApproval(
      //   payloadForApproveOrReject,
      //   setIsLoading,
      // );
      // if (res) {
      //   toaster.show({message: res?.data, type: 'success'});
      //   allDeactive();
      // }

      // New Process
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : ManualAttendanceApprovalEngine,
        data: payloadForApproveOrReject,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      const resMessage = res?.message || res?.data || res?.data?.message || res;
      const resStatusCode =
        res?.status ||
        res?.statusCode ||
        res?.statuscode ||
        res?.data?.statusCode ||
        res?.data?.statuscode ||
        res;
      if (res) {
        if (arlURL === userInfo?.strUrl && resStatusCode === 200) {
          saveLogAction({
            payload: {
              newEntity: payloadForApproveOrReject,
              isPeopledesk: true,
              actionType: 'Approve',
            },
          });
        }
        toaster.show({
          message: resMessage,
          type: resMessage?.includes('fail') ? 'error' : 'success',
        });
        allDeactive();
      }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(true, 'Reject');
      // Old Process
      // const res = await postAttendanceApproval(
      //   payloadForApproveOrReject,
      //   setIsLoading,
      // );

      // if (res) {
      //   toaster.show({message: res?.data, type: 'success'});
      //   allDeactive();
      // }

      // New Process
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : ManualAttendanceApprovalEngine,
        data: payloadForApproveOrReject,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      const resMessage = res?.message || res?.data || res?.data?.message || res;
      const resStatusCode =
        res?.status ||
        res?.statusCode ||
        res?.statuscode ||
        res?.data?.statusCode ||
        res?.data?.statuscode ||
        res;
      if (res) {
        if (arlURL === userInfo?.strUrl && resStatusCode === 200) {
          saveLogAction({
            payload: {
              newEntity: payloadForApproveOrReject,
              isPeopledesk: true,
              actionType: 'Reject',
            },
          });
        }
        toaster.show({
          message: resMessage,
          type: resMessage?.includes('fail') ? 'error' : 'success',
        });
        allDeactive();
      }
    }
  };

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    //old
    let payloadForApproveOrReject = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.intId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      };
    });
    //new
    let paylaodForV2 = isTrueSingleClick?.map((item: any) => {
      return {
        configHeaderId: item?.configHeaderId,
        approvalTransactionId: item?.id,
        applicationId: item?.intId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: attAdjApp?.applicationTypeId,
      };
    });
    // commonURL === userInfo?.strUrl ? paylaodForV2 : payloadForApproveOrReject
    return commonURL === userInfo?.strUrl
      ? paylaodForV2
      : payloadForApproveOrReject;
  };
  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : ManualAttendanceLandingEngine,
      data: payloadForLand,
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
            item?.application?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',
          dteAttendanceDate:
            item?.applicationInformation?.dteAttendanceDate ||
            item?.dteAttendanceDate ||
            '',
          intId:
            item?.applicationInformation?.applicationId ||
            item?.application?.intId,
          intEmployeeId:
            item?.applicationInformation?.employeeId ||
            item?.intEmployeeId ||
            '',
          strEmployeeName:
            item?.applicationInformation?.employeeName ||
            item?.strEmployeeName ||
            '',
          strEmploymentType:
            item?.applicationInformation?.employeeTypeName ||
            item?.strEmploymentType ||
            '',
          strDesignation:
            item?.applicationInformation?.designation ||
            item?.strDesignation ||
            '',
          strDepartment:
            item?.applicationInformation?.department ||
            item?.strDepartment ||
            '',
          timeInTime:
            item?.applicationInformation?.tmeStartTime ||
            item?.timeInTime ||
            '',
          timeOutTime:
            item?.applicationInformation?.tmeEndTime || item?.timeOutTime || '',
          application: {
            ...item?.application,

            // this is for Common Approval of V2 project
            ...item?.applicationInformation,
            intId:
              item?.applicationInformation?.applicationId ||
              item?.application?.intId ||
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
            strStatus:
              item?.applicationInformation?.status ||
              item?.application?.strStatus ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setAttAdjustApprovalLandingData(data);
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
  };
  return (
    <ContainerNew
      isScrollView={false}
      edges={isShowHeader ? edges2 : Platform.OS === 'ios' ? edges2 : edges1}
      header={
        <>
          {isShowHeader && (
            <>
              {isSearch && (
                <CustomHeader
                  alterIcon={'search'}
                  alterIconPress={() => {
                    setIsSearch(!isSearch);
                    LayoutAnimation.configureNext(
                      LayoutAnimation.Presets.spring,
                    );
                  }}
                  onBackPress={navigation.goBack}
                  title="Atd. Adjustment Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}
    >
      <LoadingContainer isLoading={isLoading} />
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
              onValueChange={() => AllActiveDeactiveHandler()}
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

      <View
        style={[
          isSearch ? styles.isSearchTrue : styles.isSearchFalse,
          styles.horizontalPad,
        ]}
      >
        {attAdjustApprovalLandingData?.length > 0 ? (
          <FlatList
            ListHeaderComponentStyle={styles.paddingTop}
            ListFooterComponentStyle={styles.paddingBottom}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => <View />}
            ListHeaderComponent={() => <View />}
            data={attAdjustApprovalLandingData}
            renderItem={({ item, index }) => (
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
                    navigation.navigate('AttendanceAdjustmentApprovalDetails', {
                      empDetails: item,
                      activeTabName: activeTabName,
                    });
                  }
                }}
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
                <View
                  style={[
                    styles.txtPart,
                    item?.isActive
                      ? styles.isActivityTrue
                      : styles.isActivityFalse,
                  ]}
                >
                  <View style={styles.rowSpaceBetween}>
                    <Text style={styles.empName}>{item?.strEmployeeName}</Text>
                  </View>

                  <Text style={styles.normalTxt}>
                    {item?.strRequestStatus} Request
                  </Text>

                  <View style={styles.rowSpaceBetween}>
                    <View>
                      <Text style={styles.smallTxt}>
                        Application Date:{' '}
                        {date_formater(item?.dteAttendanceDate)}
                      </Text>
                    </View>

                    <View style={styles.status}>
                      <Text
                        style={[
                          styles.statusTxt,
                          {
                            color: getStatusColor(item?.application?.strStatus),
                            backgroundColor: getStatusBgColor(
                              item?.application?.strStatus,
                            ),
                          },
                        ]}
                      >
                        {item?.application?.strStatus}
                      </Text>
                    </View>
                  </View>
                </View>
                {item?.isActive ? (
                  <MIcon name="check-circle" size={23} color={COLORS.primary} />
                ) : null}
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <View style={styles.centerPadTop}>
            <FastImage source={IMAGES.NoDataImage} style={styles.noDataImg} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        )}
        {/* {isLoading ? (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        ) : null} */}
      </View>

      {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={employeeName}
          setInputText={setEmployeeName}
        />
      )}

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveHandler()}
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Attendence Adjustment application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Attendence Adjustment application?`}
      />
    </ContainerNew>
  );
};

export default AttendanceAdjustmentApprovalMainIndex;

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
    color: COLORS.textNewColor,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empName: {
    fontSize: 16,
    fontWeight: '500',
    width: '85%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  txtPart: {
    flex: 1,
    paddingLeft: 16,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
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
  // closeIconHead: { flexDirection: 'row', alignItems: 'center' },
  // singleClickText: { fontSize: 20, fontWeight: '600', color: COLORS.white, paddingLeft: 10 },
  marginLeft: {
    marginLeft: 8,
  },
  approvehead: { flexDirection: 'row' },
  horizontalPad: { paddingHorizontal: 16 },
  isSearchTrue: { marginTop: 0 },
  isSearchFalse: { marginTop: 90 },
  isActivityTrue: { paddingLeft: 8 },
  isActivityFalse: { paddingLeft: 16 },
  paddingBottom: {
    paddingBottom: 50,
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
  paddingTop: {
    paddingTop: 0,
  },
  centerPadTop: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
