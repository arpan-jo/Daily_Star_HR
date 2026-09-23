import CheckBox from '@react-native-community/checkbox';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
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
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { commonURL } from '../../../../../App';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  IOUApplicationLanding,
} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import { useToast } from '../../../../common/components/CustomToast';
import SearchHeader from '../../../../common/components/SearchHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { date_formater } from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { IOUApprvalLandingListDataEntity } from '../../../../interfaces/iou/iou';
import { IOUApplicationApproval } from '../../../../services/SaaS-modules/iou/ios';
import { useRootStore } from '../../../../stores/rootStore';
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
const IOUApprovalMainIndex = () => {
  const toaster = useToast();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const route = useRoute();
  //@ts-ignore
  const iouApprovalData = route?.params;
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

  const [IOUApprovalLandingData, setIOUApprovalLandingData] =
    useState<IOUApprvalLandingListDataEntity[]>();

  const landingPayload = {
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    approverId: userInfo?.intEmployeeId,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: 0,
    workplaceGroupId: userInfo?.intWorkplaceGroupId,

    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
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
          applicationTypeId: iouApprovalData?.applicationTypeId,
          employeeId: userInfo?.intEmployeeId,
          isAdmin: activeTabName === 'adminApproval' ? true : false,
          // for common new approval api  v2
        }
      : landingPayload;
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
      getLandingDataApi();
      // const api_params = {
      //   url: IOUApplicationLanding,
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
      // setIOUApprovalLandingData(data);
    },
    [userInfo, isFocused, topBar],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      let regex = new RegExp(employeeName?.toLowerCase());
      if (IOUApprovalLandingData) {
        let copyEmployeeData = [...IOUApprovalLandingData];
        let newData = copyEmployeeData?.filter(item =>
          regex?.test(item?.employeeName?.toLowerCase()),
        );
        setIOUApprovalLandingData(newData);
        if (!employeeName) {
          getLandingDataApi();
          // const api_params = {
          //   url: IOUApplicationLanding,
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
          // setIOUApprovalLandingData(data);
        }
      }
    },
    [employeeName, topBar],
  );

  const isTrueSingleClick = IOUApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    if (IOUApprovalLandingData) {
      let modifyData = [...IOUApprovalLandingData];
      modifyData[index].isActive = !modifyData[index].isActive;
      setIOUApprovalLandingData(modifyData);
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
    let modifyData = IOUApprovalLandingData ? [...IOUApprovalLandingData] : [];
    const modifyAllData = modifyData.map(item => {
      return {
        ...item,
        isActive: isSelectAll ? false : true,
      };
    });
    setIOUApprovalLandingData(modifyAllData);
    setIsSelectAll(!isSelectAll);
    const isTrueSingle = modifyAllData?.filter(item => item?.isActive === true);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
  };

  const allDeactive = async () => {
    const newArr = IOUApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    if (newArr) {
      setIOUApprovalLandingData(newArr);
    }
    setIsShowHeader(true);
    getLandingDataApi();
    // const api_params = {
    //   url: IOUApplicationLanding,
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
    // setIOUApprovalLandingData(data);
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(false, 'Approve');
      if (commonURL === userInfo?.strUrl) {
        const api_params = {
          url: ApproveApplications,
          data: payloadForApproveOrReject,
          method: 'post',
        };
        const res = await httpRequest(api_params, () => {});
        const resMessage =
          res?.message || res?.data || res?.data?.message || res;
        if (res) {
          toaster.show({
            message: resMessage,
            type: resMessage?.includes('fail') ? 'error' : 'success',
          });
          allDeactive();
        }
      } else {
        const res = await IOUApplicationApproval(payloadForApproveOrReject);
        if (res) {
          toaster.show({ message: res?.data, type: 'success' });
          allDeactive();
        }
      }
      // const res = await IOUApplicationApproval(payloadForApproveOrReject);
      // if (res) {
      //   toaster.show({message: res?.data, type: 'success'});
      //   allDeactive();
      // }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(true, 'Reject');
      if (commonURL === userInfo?.strUrl) {
        const api_params = {
          url: ApproveApplications,
          data: payloadForApproveOrReject,
          method: 'post',
        };
        const res = await httpRequest(api_params, () => {});
        const resMessage =
          res?.message || res?.data || res?.data?.message || res;
        if (res) {
          toaster.show({
            message: resMessage,
            type: resMessage?.includes('fail') ? 'error' : 'success',
          });
          allDeactive();
        }
      } else {
        const res = await IOUApplicationApproval(payloadForApproveOrReject);
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
        applicationId: item?.application?.intIouid,
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
        isAdmin: activeTabName === 'adminApproval' ? true : false,
        //@ts-ignore
        applicationTypeId: iouApprovalData?.applicationTypeId,
      };
    });
    return commonURL === userInfo?.strUrl
      ? paylaodForV2
      : payloadForApproveOrReject;
  };

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : IOUApplicationLanding,
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
          status: item?.applicationInformation?.status || item?.status || '',
          strLoanType:
            item?.applicationInformation?.strLoanType ||
            item?.strLoanType ||
            '',
          waitingStage:
            item?.applicationInformation?.waitingStage ||
            item?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',
          intLoanApplicationId:
            item?.applicationInformation?.applicationId ||
            item?.intLoanApplicationId ||
            '',
          employeeName:
            item?.applicationInformation?.employeeName ||
            item?.employeeName ||
            '',
          employmentType: '',
          designation:
            item?.applicationInformation?.designation ||
            item?.designation ||
            '',
          department:
            item?.applicationInformation?.department ||
            item?.strDepartment ||
            '',
          intLoanAmount:
            item?.applicationInformation?.intLoanAmount ||
            item?.intLoanAmount ||
            '',
          intNumberOfInstallment:
            item?.applicationInformation?.intNumberOfInstallment ||
            item?.intNumberOfInstallment ||
            '',

          application: {
            ...item?.application,

            // this is for Common Approval of V2 project
            intNumberOfInstallmentAmount:
              item?.applicationInformation?.intNumberOfInstallmentAmount ||
              item?.intNumberOfInstallmentAmount ||
              '',
            dteEffectiveDate:
              item?.applicationInformation?.dteEffectiveDate ||
              item?.application?.dteEffectiveDate ||
              '',
            ...item?.applicationInformation,
            intIouid:
              item?.applicationInformation?.applicationId ||
              item?.application?.intIouid ||
              '',
            dteApplicationDate:
              item?.applicationInformation?.applicationDate ||
              item?.application?.dteApplicationDate ||
              '',
            intDocumentFileId:
              item?.applicationInformation?.attachmentId ||
              item?.application?.intDocumentFileId ||
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
            strDiscription:
              item?.applicationInformation?.strRemarks ||
              item?.application?.strDescription ||
              '',
            numAdjustedAmount:
              item?.applicationInformation?.numAdjustedAmount ||
              item?.application?.numAdjustedAmount ||
              '',
            numPayableAmount:
              item?.applicationInformation?.numPayableAmount ||
              item?.application?.numPayableAmount ||
              '',
            numReceivableAmount:
              item?.applicationInformation?.numReceivableAmount ||
              item?.application?.numReceivableAmount ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setIOUApprovalLandingData(data);
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
      isScrollView={true}
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
                  title="IOU Approval"
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
      <View
        style={[
          isSearch ? styles.isSearchTrue : styles.isSearchFalse,
          styles.horizontalPad,
        ]}
      >
        {IOUApprovalLandingData &&
          IOUApprovalLandingData?.map((data, index) => (
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
                  navigation.navigate('IOUApprovalDetails', {
                    iouDetails: data,
                  });
                }
              }}
              style={[
                styles.card,
                {
                  backgroundColor: data?.isActive
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

                  data?.isActive ? styles.isActiveTrue : styles.isActiveFalse,
                ]}
              >
                <View style={styles.rowSpaceBetween}>
                  <Text style={styles.empName}>{data?.employeeName}</Text>
                </View>

                <View style={styles.flexRow}>
                  <Text style={styles.normalTxt}>
                    {data?.application?.strIoucode}
                  </Text>
                  <View style={styles.dividerHorizontal} />
                  <Text style={styles.normalTxt}>
                    ৳{data?.application?.numIouamount}
                  </Text>
                </View>

                <View style={styles.rowSpaceBetween}>
                  <View>
                    <Text style={styles.smallTxt}>
                      Application Date:
                      {date_formater(data?.application?.dteApplicationDate)}
                    </Text>
                  </View>

                  <View style={styles.status}>
                    <Text
                      style={[
                        styles.statusTxt,
                        {
                          color: getStatusColor(data?.application?.strStatus),
                          backgroundColor: getStatusBgColor(
                            data?.application?.strStatus,
                          ),
                        },
                      ]}
                    >
                      {data?.application?.strStatus}
                    </Text>
                  </View>
                </View>
              </View>
              {data?.isActive ? (
                <MIcon name="check-circle" size={23} color={COLORS.primary} />
              ) : null}
            </TouchableOpacity>
          ))}

        {IOUApprovalLandingData?.length === 0 ? (
          <View style={styles.noData}>
            <FastImage source={IMAGES.NoDataImage} style={styles.fastImage} />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        ) : null}
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
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending IOU application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending IOU application?`}
      />
    </ContainerNew>
  );
};

export default IOUApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    // paddingVertical: 8,
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
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },

  dividerHorizontal: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.textNewColor,
  },

  flexRow: {
    flexDirection: 'row',
  },
  noData: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImage: {
    width: 130,
    height: 90,
  },
  paddingTop30: {
    paddingTop: 30,
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
  isActiveTrue: { paddingLeft: 8 },
  isActiveFalse: { paddingLeft: 16 },
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
