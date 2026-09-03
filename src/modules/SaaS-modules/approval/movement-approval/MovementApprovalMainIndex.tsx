import CheckBox from '@react-native-community/checkbox';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {commonURL} from '../../../../../App';
import {
  ApproveApplications,
  GetAllPendingApplicationsForApproval,
  MovementApplicationApproval,
  MovementApplicationLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater, getDay} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {getImageURL} from '../../../../common/services/getImage';
import {MovementApprovalType} from '../../../../interfaces/movement/movement';
import {useRootStore} from '../../../../stores/rootStore';
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
const MovementApprovalMainIndex = () => {
  const toaster = useToast();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [topBar, setTopBar] = useState(topBarItem);
  const [activeTabName, setActiveTabName] = useState('commonApproval');
  //@ts-ignore
  const movementLanData = route?.params;

  const landingPayload = {
    applicantId: 0,
    applicationStatus: 'Pending',
    approverId: userInfo?.intEmployeeId,
    departmentId: 0,
    designationId: 0,
    fromDate: '',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    toDate: '',
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
    accountId: userInfo?.intAccountId,
  };

  const payloadForLand =
    commonURL === userInfo?.strUrl
      ? {
          ...landingPayload,
          workplaceId: userInfo?.intWorkplaceId,
          businessUnitId: userInfo?.intBusinessUnitId,
          // for common new approval api  v2
          //@ts-ignore
          applicationTypeId: movementLanData?.applicationTypeId,
          employeeId: userInfo?.intEmployeeId,
          // for common new approval api  v2
          isAdmin: activeTabName === 'adminApproval' ? true : false,
        }
      : landingPayload;
  const [movementApprovalLandingData, setMovementApprovalLandingData] =
    useState<MovementApprovalType[]>([]);

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
    async (isMounted: any) => {
      if (!isMounted()) {
        return;
      }
      // const api_params = {
      //   url: MovementApplicationLanding,
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
      // setMovementApprovalLandingData(data);
      getLandingDataApi();
    },
    [isFocused, activeTabName],
  );
  const isTrueSingleClick = movementApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    let modifyData = [...movementApprovalLandingData];
    modifyData[index].isActive = !modifyData[index].isActive;
    setMovementApprovalLandingData(modifyData);
    const isTrueSingle = modifyData?.filter(item => item?.isActive === true);
    const isFalseSingle = modifyData?.filter(item => item?.isActive === false);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
    isFalseSingle?.length ? setIsSelectAll(false) : setIsSelectAll(true);
  };

  const AllActiveDeactiveHandler = () => {
    !isSearch && setIsSearch(!isSearch);
    let modifyData = [...movementApprovalLandingData];
    const modifyAllData = modifyData.map(item => {
      return {
        ...item,
        isActive: isSelectAll ? false : true,
      };
    });
    setMovementApprovalLandingData(modifyAllData);
    setIsSelectAll(!isSelectAll);
    const isTrueSingle = modifyAllData?.filter(item => item?.isActive === true);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
  };

  const allDeactive = async () => {
    const newArr = movementApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    setMovementApprovalLandingData(newArr);
    setIsShowHeader(true);
    getLandingDataApi(); // need for v2 approval
    // const api_params = {
    //   url: MovementApplicationLanding,
    //   data: payloadForLand,
    //   method: 'post',
    // };
    // const resData = await httpRequest(api_params, setIsLoading);
    // const data =
    //   resData?.listData &&
    //   resData?.listData?.map((item: any) => {
    //     return {
    //       ...item,
    //       isActive: false,
    //     };
    //   });

    // setMovementApprovalLandingData(data);
  };

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : MovementApplicationLanding,
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
          movementType:
            item?.applicationInformation?.leaveType || item?.movementType || '',
          waitingStage:
            item?.applicationInformation?.waitingStage ||
            item?.movementApplication?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',
          employeeName: item?.applicationInformation?.employeeName,
          movementApplication: {
            ...item?.movementApplication,

            // this is for Common Approval of V2 project
            ...item?.applicationInformation,
            intApplicationId:
              item?.applicationInformation?.applicationId ||
              item?.movementApplication?.intApplicationId ||
              '',
            dteFromDate:
              item?.applicationInformation?.fromDate ||
              item?.movementApplication?.dteFromDate ||
              '',
            dteToDate:
              item?.applicationInformation?.toDate ||
              item?.movementApplication?.dteToDate ||
              '',
            dteCreatedAt:
              item?.applicationInformation?.applicationDate ||
              item?.movementApplication?.dteCreatedAt ||
              '',
            strReason:
              item?.applicationInformation?.strRemarks ||
              item?.movementApplication?.strReason ||
              '',
            strLocation:
              item?.applicationInformation?.address ||
              item?.movementApplication?.strLocation ||
              '',
            intDocumentFileId:
              item?.applicationInformation?.attachmentId ||
              item?.movementApplication?.intDocumentFileId ||
              '',
            intEmployeeId:
              item?.applicationInformation?.employeeId ||
              item?.movementApplication?.intEmployeeId ||
              '',
            intWorkplaceGroupId:
              item?.applicationInformation?.workplaceGroupId ||
              item?.movementApplication?.intWorkplaceGroupId ||
              '',
            strStatus:
              item?.applicationInformation?.status ||
              item?.movementApplication?.strStatus ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setMovementApprovalLandingData(data);
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payload = await approveOrReject(false, 'Approve');
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : MovementApplicationApproval,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      const resMessage = res?.message || res?.data || res?.data?.message || res;
      if (res) {
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
      const payload = await approveOrReject(true, 'Reject');
      const api_params = {
        url:
          commonURL === userInfo?.strUrl
            ? ApproveApplications
            : MovementApplicationApproval,
        data: payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, () => {});
      if (res) {
        toaster.show({
          message: res?.message || res?.data || res?.data?.message || res,
          type: 'success',
        });
        allDeactive();
      }
    }
  };

  const approveOrReject = async (
    isReject: boolean,
    isApproveOrReject: string,
  ) => {
    let payload = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.movementApplication?.intApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        fromDate: item?.movementApplication?.dteFromDate,
        toDate: item?.movementApplication?.dteToDate,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      };
    });
    let paylaodForV2 = isTrueSingleClick?.map((item: any) => {
      return {
        configHeaderId: item?.configHeaderId,
        approvalTransactionId: item?.id,
        applicationId: item?.movementApplication?.intApplicationId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isApprove: isApproveOrReject === 'Approve' ? true : false,
        isReject: isApproveOrReject === 'Reject' ? true : false,
        actionBy: userInfo?.intEmployeeId,
        // isAdmin: userInfo?.isOfficeAdmin,
        //@ts-ignore
        applicationTypeId: movementLanData?.applicationTypeId,
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
                  // alterIcon={'search'}
                  // alterIconPress={() => {
                  //   setIsSearch(!isSearch);
                  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                  // }}
                  onBackPress={navigation.goBack}
                  title="Movement Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}>
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
      <LoadingContainer isLoading={isLoading} />
      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View>
          <View style={styles.headMain}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isSelectAll}
                onValueChange={() => AllActiveDeactiveHandler()}
                style={styles.checkbox}
                tintColors={{true: 'white', false: 'white'}}
                tintColor={COLORS.white}
                onCheckColor={COLORS.white}
                onTintColor={COLORS.white}
              />
              <Text style={styles.label}>All</Text>
            </View>

            <View style={styles.flexRow}>
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
        </View>
      )}
      <View
        style={[
          isSearch ? styles.isSearchTrue : styles.isSearchFalse,
          styles.paddingHorizontl,
        ]}>
        {movementApprovalLandingData?.length > 0 ? (
          <FlatList
            removeClippedSubviews
            ListHeaderComponentStyle={styles.paddingTop}
            ListFooterComponentStyle={styles.paddingBottom}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={() => <View />}
            ListHeaderComponent={() => <View />}
            data={movementApprovalLandingData}
            renderItem={({
              item,
              index,
            }: ListRenderItemInfo<MovementApprovalType>) => (
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
                      navigation.navigate('MovementNewApprovalDetails', {
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
                  ]}>
                  <View>
                    {item?.profileUrlId ? (
                      <View
                        style={[
                          styles.noImageBox,
                          {
                            backgroundColor: COLORS.white,
                          },
                        ]}>
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
                  {/* <View>
                <View style={styles.noImageBox}>
                  <Image source={IMAGES.NoImage} style={styles.noImage} />
                </View>
              </View> */}
                  <View style={styles.paddingLeft}>
                    <View style={styles.rowSpaceBetween}>
                      <Text style={styles.empName}>{item?.employeeName}</Text>
                    </View>
                    <View style={styles.smallTxtSection}>
                      <Text style={styles.smallTxt}>{item?.movementType}</Text>
                      <View style={styles.datePart} />
                      <Text style={styles.smallTxt}>
                        {getDay(
                          item?.movementApplication?.dteFromDate,
                          item?.movementApplication?.dteToDate,
                        )}{' '}
                        Day
                      </Text>
                    </View>
                    <View style={styles.rowSpaceBetween}>
                      <View>
                        <Text style={styles.smallTxt}>
                          {date_formater(
                            item?.movementApplication?.dteFromDate,
                          )}
                          {' - '}
                          {date_formater(item?.movementApplication?.dteToDate)}
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
                          ]}>
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
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Movement application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Movement application?`}
      />
    </ContainerNew>
  );
};

export default MovementApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 16,
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
  headMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    // marginTop: Platform?.OS === 'ios' ? -300 : 24,
    paddingTop: Platform?.OS === 'ios' ? 60 : 10,
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
  flexRowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexRow: {
    flexDirection: 'row',
  },
  selectedCount: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.white,
    paddingLeft: 10,
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
  marginTop: {
    marginTop: 0,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallTxt: {
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  statusTxt: {
    borderRadius: 100,
    paddingHorizontal: 8,
  },
  centerPadTop: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  paddingLeft: {
    flex: 1,
    paddingLeft: 8,
  },
  smallTxtSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  paddingHorizontl: {
    paddingHorizontal: 16,
  },
  isSearchTrue: {marginTop: 0},
  isSearchFalse: {marginTop: 90},
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
