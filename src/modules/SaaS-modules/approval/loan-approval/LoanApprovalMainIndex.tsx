import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  LoanApplicationApproval,
  LoanApplicationLanding,
} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import SearchHeader from '../../../../common/components/SearchHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import {LoanApprovalLandingListDataType} from '../../../../interfaces/loan/loan';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LoanApprovalMainIndex = () => {
  const toaster = useToast();
  const [employeeName, setEmployeeName] = useState('');
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [loanApprovalLandingData, setLoanApprovalLandingData] =
    useState<LoanApprovalLandingListDataType[]>();

  //@ts-ignore
  const loanApprData = route?.params;

  const landingPayload = {
    approverId: userInfo?.intEmployeeId,
    workplaceGroupId: 0,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    leaveTypeId: 0,
    fromDate: '',
    toDate: '',
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    accountId: userInfo?.intAccountId,
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
          applicationTypeId: loanApprData?.applicationTypeId,
          employeeId: userInfo?.intEmployeeId,
          // for common new approval api  v2
        }
      : landingPayload;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      // const api_params = {
      //   url: LoanApplicationLanding,
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
      // setLoanApprovalLandingData(data);
      getLandingDataApi();
    },
    [isFocused],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      let regex = new RegExp(employeeName?.toLowerCase());
      if (loanApprovalLandingData) {
        let copyEmployeeData = [...loanApprovalLandingData];
        let newData = copyEmployeeData?.filter(item =>
          regex?.test(item?.strEmployeeName?.toLowerCase()),
        );
        setLoanApprovalLandingData(newData);
        if (!employeeName) {
          // const api_params = {
          //   url: LoanApplicationLanding,
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
          // setLoanApprovalLandingData(data);
          getLandingDataApi();
        }
      }
    },
    [employeeName],
  );

  const isTrueSingleClick = loanApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    if (loanApprovalLandingData) {
      let modifyData = [...loanApprovalLandingData];
      modifyData[index].isActive = !modifyData[index].isActive;
      setLoanApprovalLandingData(modifyData);
      const isTrueSingle = modifyData?.filter(item => item?.isActive === true);
      if (isTrueSingle?.length) {
        setIsShowHeader(false);
      }
      if (!isTrueSingle?.length) {
        setIsShowHeader(true);
      }
    }
  };

  const allDeactive = async () => {
    const newArr = loanApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    if (newArr) {
      setLoanApprovalLandingData(newArr);
    }
    setIsShowHeader(true);
    // const api_params = {
    //   url: LoanApplicationLanding,
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
    // setLoanApprovalLandingData(data);
    getLandingDataApi();
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(false, 'Approve');

      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : LoanApplicationApproval,
        data: payloadForApproveOrReject,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      if (res) {
        toaster.show({message: res?.message || res, type: 'success'});
        allDeactive();
      }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(true, 'Reject');
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : LoanApplicationApproval,
        data: payloadForApproveOrReject,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      if (res) {
        toaster.show({message: res?.message || res, type: 'success'});
        allDeactive();
      }
    }
  };

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    let payloadForApproveOrReject = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.intLoanApplicationId,
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
        applicationId: item?.intLoanApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: loanApprData?.applicationTypeId,
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
          : LoanApplicationLanding,
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
          strStatus:
            item?.applicationInformation?.status || item?.strStatus || '',
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
          strEmployeeName:
            item?.applicationInformation?.employeeName ||
            item?.strEmployeeName ||
            '',
          strDesignation:
            item?.applicationInformation?.designation ||
            item?.strDesignation ||
            '',
          strDepartment:
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
            intLoanApplicationId:
              item?.applicationInformation?.applicationId ||
              item?.intLoanApplicationId ||
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
            strDescription:
              item?.applicationInformation?.strRemarks ||
              item?.application?.strDescription ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setLoanApprovalLandingData(data);
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
                  title="Loan Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}>
      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View style={styles.headMain}>
          <View style={styles.closeIconHead}>
            <TouchableOpacity onPress={() => allDeactive()}>
              <MIcon name="close" size={30} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.singleClickText}>
              {isTrueSingleClick?.length}
            </Text>
          </View>

          <View style={styles.approvehead}>
            <TouchableOpacity
              onPress={() => setIsModalShow2(true)}
              style={styles.approveOrReject}>
              <Text style={styles.rejectApproveText}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsModalShow(true)}
              style={[styles.approveOrReject, styles.marginLeft]}>
              <Text style={styles.rejectApproveText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View
        style={[
          isSearch ? styles.isSearchTrue : styles.isSearchFalse,
          styles.horizontalPad,
        ]}>
        {isLoading ? (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        ) : null}
        {loanApprovalLandingData?.map((item, index) => (
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
                navigation.navigate('LoanApprovalDetails', {
                  loanDetails: item,
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
            ]}>
            <View>
              <View style={styles.noImageBox}>
                <FastImage source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            </View>
            <View
              style={[
                styles.txtPart,
                item?.isActive ? styles.isActiveTrue : styles.isActiveFalse,
              ]}>
              <View style={styles.rowSpaceBetween}>
                <Text style={styles.empName}>{item?.strEmployeeName}</Text>
              </View>

              <Text style={styles.normalTxt}>{item?.strLoanType}</Text>

              <View style={styles.rowSpaceBetween}>
                <View>
                  <Text style={styles.smallTxt}>
                    Application Date:{' '}
                    {date_formater(item?.application?.dteApplicationDate)}
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
                    ]}>
                    {item?.application?.strStatus}
                  </Text>
                </View>
              </View>
            </View>
            {item?.isActive ? (
              <MIcon name="check-circle" size={23} color={COLORS.primary} />
            ) : null}
          </TouchableOpacity>
        ))}

        <View style={styles.padBottom} />

        {loanApprovalLandingData?.length === 0 ? (
          <View style={styles.noDataBox}>
            <FastImage source={IMAGES.NoDataImage} style={styles.image} />
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
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Loan application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Loan application?`}
      />
    </ContainerNew>
  );
};

export default LoanApprovalMainIndex;

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
    shadowOffset: {width: 0, height: 0},
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
  padBottom: {
    paddingBottom: 200,
  },
  image: {width: 130, height: 90},
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noDataBox: {alignSelf: 'center', paddingTop: 20},

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
  closeIconHead: {flexDirection: 'row', alignItems: 'center'},
  singleClickText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    paddingLeft: 10,
  },
  marginLeft: {
    marginLeft: 8,
  },
  approvehead: {flexDirection: 'row'},
  horizontalPad: {paddingHorizontal: 16},
  isSearchTrue: {marginTop: 0},
  isSearchFalse: {marginTop: 90},
  isActiveTrue: {paddingLeft: 8},
  isActiveFalse: {paddingLeft: 16},
});
