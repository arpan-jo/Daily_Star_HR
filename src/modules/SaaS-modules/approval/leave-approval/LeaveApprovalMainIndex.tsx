import CheckBox from '@react-native-community/checkbox';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { arlURL, commonURL } from '../../../../../App';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  LeaveApplicationApproval,
  LeaveApplicationLanding,
} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import { useToast } from '../../../../common/components/CustomToast';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  date_formater,
  getDay,
} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { getImageURL } from '../../../../common/services/getImage';
import { LeaveApprovalType } from '../../../../interfaces/leave/leave';
import { useRootStore } from '../../../../stores/rootStore';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import TopBarItem from '../../../../common/components/TabBaritem';
import Row from '../../../../common/components/Row';
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

const LeaveApprovalMainIndex = () => {
  const toaster = useToast();
  const route = useRoute();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
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
  const [leaveApprovalLandingData, setLeaveApprovalLandingData] = useState<
    LeaveApprovalType[]
  >([]);
  const { saveLogAction } = useAuditLogSave();
  //@ts-ignore
  const leaveLanData = route?.params;

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
    isSupOrLineManager: 0,
    approverId: userInfo?.intEmployeeId,
    workplaceGroupId: 0,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    leaveTypeId: 0,
    fromDate: '',
    toDate: '',
    accountId: userInfo?.intAccountId,
  };
  // https://devapp.peopledesk.io/api/Approval/GetAllPendingApplicationsForApproval?
  // accountId=4&businessUnitId=4&workplaceGroupId=8&workplaceId=28&applicationTypeId=8&employeeId=3509

  const payloadForLand =
    commonURL === userInfo?.strUrl
      ? {
          ...landingPayload,
          workplaceGroupId: userInfo?.intWorkplaceGroupId,
          workplaceId: userInfo?.intWorkplaceId,
          businessUnitId: userInfo?.intBusinessUnitId,
          // for common new approval api  v2
          //@ts-ignore
          applicationTypeId: leaveLanData?.applicationTypeId,
          employeeId: userInfo?.intEmployeeId,
          isAdmin: activeTabName === 'adminApproval' ? true : false,
          // for common new approval api  v2
        }
      : landingPayload;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      getLandingDataApi();
    },
    [isFocused, activeTabName],
  );
  const isTrueSingleClick = leaveApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    let modifyData = [...leaveApprovalLandingData];
    modifyData[index].isActive = !modifyData[index].isActive;
    setLeaveApprovalLandingData(modifyData);
    const isTrueSingle = modifyData?.filter(item => item?.isActive === true);
    const isFalseSingle = modifyData?.filter(item => item?.isActive === false);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
    isFalseSingle?.length ? setIsSelectAll(false) : setIsSelectAll(true);
  };

  const AllActiveDeactiveHandler = () => {
    !isSearch && setIsSearch(!isSearch);
    let modifyData = [...leaveApprovalLandingData];
    const modifyAllData = modifyData.map(item => {
      return {
        ...item,
        isActive: isSelectAll ? false : true,
      };
    });
    setLeaveApprovalLandingData(modifyAllData);
    setIsSelectAll(!isSelectAll);
    const isTrueSingle = modifyAllData?.filter(item => item?.isActive === true);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
  };

  const allDeactive = async () => {
    const newArr = leaveApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    setLeaveApprovalLandingData(newArr);
    setIsShowHeader(true);

    getLandingDataApi();
  };

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : LeaveApplicationLanding,
      data: payloadForLand,
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',
    };
    const resData = await httpRequest(api_params, setIsLoading);
    const modifiedData = resData?.listData || resData?.data || resData;

    const data =
      modifiedData &&
      modifiedData?.map((item: any) => {
        return {
          ...item,
          status: item?.applicationInformation?.status || item?.status || '',
          leaveType:
            item?.applicationInformation?.leaveType || item?.leaveType || '',
          waitingStage:
            item?.applicationInformation?.waitingStage ||
            item?.leaveApplication?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',
          employeeName:
            item?.employeeName ||
            item?.applicationInformation?.employeeName ||
            item?.strEmployeeName ||
            '',
          designation:
            item?.designation ||
            item?.applicationInformation?.designation ||
            '',
          department:
            item?.department || item?.applicationInformation?.department || '',
          leaveApplication: {
            ...item?.leaveApplication,

            // this is for Common Approval of V2 project
            ...item?.applicationInformation,
            intApplicationId:
              item?.applicationInformation?.applicationId ||
              item?.leaveApplication?.intApplicationId ||
              '',
            dteFromDate:
              item?.applicationInformation?.fromDate ||
              item?.leaveApplication?.dteFromDate ||
              '',
            dteToDate:
              item?.applicationInformation?.toDate ||
              item?.leaveApplication?.dteToDate ||
              '',
            dteApplicationDate:
              item?.applicationInformation?.applicationDate ||
              item?.leaveApplication?.dteApplicationDate ||
              '',
            strReason:
              item?.applicationInformation?.strRemarks ||
              item?.leaveApplication?.strReason ||
              '',
            strAddressDuetoLeave:
              item?.applicationInformation?.address ||
              item?.leaveApplication?.strAddressDuetoLeave ||
              '',
            intDocumentFileId:
              item?.applicationInformation?.attachmentId ||
              item?.leaveApplication?.intDocumentFileId ||
              '',
            intEmployeeId:
              item?.applicationInformation?.employeeId ||
              item?.leaveApplication?.intEmployeeId ||
              '',
            intWorkplaceGroupId:
              item?.applicationInformation?.workplaceGroupId ||
              item?.leaveApplication?.intWorkplaceGroupId ||
              '',

            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setLeaveApprovalLandingData(data);
  };
  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payload = await approveOrReject(false, 'Approve');
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : LeaveApplicationApproval,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      const resMessage = res?.message || res?.data || res?.data?.message || res;
      const resStatusCode =
        res?.statusCode ||
        res?.statuscode ||
        res?.data?.statusCode ||
        res?.data?.statuscode ||
        res;
      if (res) {
        if (arlURL === userInfo?.strUrl && resStatusCode === 200) {
          saveLogAction({
            payload: {
              newEntity: payload,
              isPeopledesk: true,
              actionType: 'Approve',
            },
          });
        }
        toaster.show({
          message: res || res?.data || res?.data?.message,
          type: resMessage?.includes('fail') ? 'error' : 'success',
        });
        allDeactive();
      }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payload = await approveOrReject(true, 'Reject');
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : LeaveApplicationApproval,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});

      const resMessage = res?.message || res?.data || res?.data?.message || res;
      const resStatusCode =
        res?.statusCode ||
        res?.statuscode ||
        res?.data?.statusCode ||
        res?.data?.statuscode ||
        res;
      if (res) {
        if (arlURL === userInfo?.strUrl && resStatusCode === 200) {
          saveLogAction({
            payload: {
              newEntity: payload,
              isPeopledesk: true,
              actionType: 'Approve',
            },
          });
        }
        toaster.show({
          message: res || res?.data || res?.data?.message,
          type: resMessage?.includes('fail') ? 'error' : 'success',
        });
        allDeactive();
      }
    }
  };

  // old
  // const approveOrReject = async (isReject: boolean) => {
  //   let payload = isTrueSingleClick?.map((item: any) => {
  //     return {
  //       applicationId: item?.leaveApplication?.intApplicationId,
  //       approverEmployeeId: userInfo?.intEmployeeId,
  //       isReject: isReject,
  //       accountId: userInfo?.intAccountId,
  //       isAdmin: userInfo?.isOfficeAdmin,
  //     };
  //   });
  //   return payload;
  // };

  // new
  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    let payload = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.leaveApplication?.intApplicationId,
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
        applicationId: item?.leaveApplication?.intApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        //@ts-ignore
        applicationTypeId: leaveLanData?.applicationTypeId,
        isAdmin: activeTabName === 'adminApproval' ? true : false,
      };
    });
    return commonURL === userInfo?.strUrl ? paylaodForV2 : payload;
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
    setIsShowHeader(true);
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
                  onBackPress={navigation.goBack}
                  title="Leave Approval"
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
      {isTrueSingleClick?.length > 0 && (
        <View style={styles.headMain}>
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

          <View style={styles.flexRow}>
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
          styles.paddingHorizontl,
        ]}
      >
        {leaveApprovalLandingData?.length > 0 ? (
          <FlatList
            removeClippedSubviews
            ListHeaderComponentStyle={styles.paddingTop}
            ListFooterComponentStyle={styles.paddingBottom}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => <View />}
            ListHeaderComponent={() => <View />}
            data={leaveApprovalLandingData}
            renderItem={({
              item,
              index,
            }: ListRenderItemInfo<LeaveApprovalType>) => (
              <View key={index}>
                <TouchableOpacity
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
                      navigation.navigate('LeaveNewApprovalDetails', {
                        leaveDetails: item,
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
                    {item?.profileUrlId ? (
                      <View
                        style={[
                          styles.noImageBox,
                          {
                            backgroundColor: COLORS.white,
                          },
                        ]}
                      >
                        <FastImage
                          source={{
                            uri: getImageURL(item?.profileUrlId),
                          }}
                          style={[styles.noImage, styles.marginTop]}
                        />
                      </View>
                    ) : (
                      <View style={styles.noImageBox}>
                        <FastImage
                          source={IMAGES.NoImage}
                          style={styles.noImage}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.flexPadding}>
                    <View style={styles.rowSpaceBetween}>
                      <Text style={[styles.empName]}>{item?.employeeName}</Text>
                    </View>
                    <View style={styles.smallTxtSection}>
                      <Text style={styles.smallTxt}>{item?.leaveType}</Text>
                      <View style={styles.datePart} />
                      <Text style={styles.smallTxt}>
                        {getDay(
                          item?.leaveApplication?.dteFromDate,
                          item?.leaveApplication?.dteToDate,
                        )}{' '}
                        Day
                      </Text>
                    </View>
                    <View style={styles.rowSpaceBetween}>
                      <View>
                        <Text style={styles.smallTxt}>
                          {date_formater(item?.leaveApplication?.dteFromDate)}
                          {' - '}
                          {date_formater(item?.leaveApplication?.dteToDate)}
                        </Text>
                      </View>

                      <View style={styles.status}>
                        <Text
                          style={[
                            {
                              color: getStatusColor('pending'),
                              backgroundColor: getStatusBgColor('pending'),
                            },
                            styles.statusTxt,
                          ]}
                        >
                          {item?.status}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {item?.isActive ? (
                    <MIcon
                      name="check-circle"
                      size={23}
                      color={COLORS.primary}
                    />
                  ) : null}
                </TouchableOpacity>
              </View>
            )}
            //@ts-ignore
            keyExtractor={(item, index) => index}
          />
        ) : (
          <View style={styles.centerPadTop}>
            <FastImage source={IMAGES.NoDataImage} style={styles.noDataImg} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        )}
        {/* {isLoading ? (
          <ActivityIndicator
            size={'large'}
            color={COLORS.primary}
            style={styles.loadingAct}
          />
        ) : null} */}
      </View>

      {/* {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={employeeName}
          setInputText={setEmployeeName}
        />
      )} */}

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveHandler()}
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Leave application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Leave application?`}
      />
    </ContainerNew>
  );
};

export default LeaveApprovalMainIndex;

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
  headMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    // marginTop: Platform?.OS === 'ios' ? 0 : 24,
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
  empName: {
    fontSize: 16,
    fontWeight: '500',
    width: '85%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  datePart: {
    height: 6,
    width: 6,
    backgroundColor: COLORS.offDay,
    marginHorizontal: 8,
    borderRadius: 100,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  flexRow: {
    flexDirection: 'row',
  },
  marginTop: {
    marginTop: 0,
  },
  marginLeft: {
    marginLeft: 8,
  },
  paddingTop: {
    paddingTop: 5,
  },
  paddingBottom: {
    paddingBottom: 50,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexPadding: {
    flex: 1,
    paddingLeft: 8,
  },
  smallTxt: {
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  centerPadTop: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  loadingAct: {
    paddingTop: 10,
  },
  paddingHorizontl: {
    paddingHorizontal: 16,
  },
  smallTxtSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  isSearchTrue: { marginTop: 0 },
  isSearchFalse: { marginTop: 90 },
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
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
