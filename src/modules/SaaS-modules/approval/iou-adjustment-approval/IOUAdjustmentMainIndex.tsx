import {useIsFocused, useNavigation} from '@react-navigation/native';
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
import ContainerNew from '../../../../common/components/Container';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomHeader from '../../../../common/components/CustomHeader';
import SearchHeader from '../../../../common/components/SearchHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusColor,
  getStatusBgColor,
} from '../../../../common/services/getColor';
import {IOUAdjustmentApprovalListDataType} from '../../../../interfaces/iou/iouAdjustment';
import {
  iouAdjustmentApprovalLanding,
  IOUAdjustmentApproval,
} from '../../../../services/SaaS-modules/iou/ios';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const IOUAdjustmentApprovalMainIndex = () => {
  const toaster = useToast();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);

  const [
    IOUAdjustmentApprovalLandingData,
    setIOUAdjustmentApprovalLandingData,
  ] = useState<IOUAdjustmentApprovalListDataType[]>();

  const payload = {
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    approverId: userInfo?.intEmployeeId,
    workplaceId: 0,
    businessUnitId: userInfo?.intBusinessUnitId,
    workplaceGroupId: 0,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: 0,
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const res = await iouAdjustmentApprovalLanding(payload, setIsLoading);
      const data =
        res?.listData &&
        res?.listData?.map((item: any) => {
          return {
            ...item,
            isActive: false,
          };
        });
      setIOUAdjustmentApprovalLandingData(data);
    },
    [userInfo, isFocused],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      let regex = new RegExp(employeeName?.toLowerCase());
      if (IOUAdjustmentApprovalLandingData) {
        let copyEmployeeData = [...IOUAdjustmentApprovalLandingData];
        let newData = copyEmployeeData?.filter(item =>
          regex?.test(item?.strEmployeeName?.toLowerCase()),
        );
        setIOUAdjustmentApprovalLandingData(newData);
        if (!employeeName) {
          const res = await iouAdjustmentApprovalLanding(payload, setIsLoading);
          const data =
            res?.listData &&
            res?.listData?.map((item: any) => {
              return {
                ...item,
                isActive: false,
              };
            });
          setIOUAdjustmentApprovalLandingData(data);
        }
      }
    },
    [employeeName],
  );

  const isTrueSingleClick = IOUAdjustmentApprovalLandingData?.filter(
    item => item?.isActive === true,
  );

  const activeDeactiveHandler = (index: number) => {
    !isSearch && setIsSearch(!isSearch);
    if (IOUAdjustmentApprovalLandingData) {
      let modifyData = [...IOUAdjustmentApprovalLandingData];
      modifyData[index].isActive = !modifyData[index].isActive;
      setIOUAdjustmentApprovalLandingData(modifyData);
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
    const newArr = IOUAdjustmentApprovalLandingData?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    if (newArr) {
      setIOUAdjustmentApprovalLandingData(newArr);
    }
    setIsShowHeader(true);
    const res = await iouAdjustmentApprovalLanding(payload, setIsLoading);
    const data =
      res?.listData &&
      res?.listData?.map((item: any) => {
        return {
          ...item,
          isActive: false,
        };
      });
    setIOUAdjustmentApprovalLandingData(data);
  };

  const approveHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(false);
      const res = await IOUAdjustmentApproval(payloadForApproveOrReject);
      if (res) {
        toaster.show({message: res?.data, type: 'success'});
        allDeactive();
      }
    }
  };
  const rejectHandler = async () => {
    if (isTrueSingleClick?.length) {
      const payloadForApproveOrReject = await approveOrReject(true);
      const res = await IOUAdjustmentApproval(payloadForApproveOrReject);
      if (res) {
        toaster.show({message: res?.data, type: 'success'});
        allDeactive();
      }
    }
  };

  const approveOrReject = async (isReject: boolean) => {
    let payloadForApproveOrReject = isTrueSingleClick?.map((item: any) => {
      return {
        applicationId: item?.application?.intIouadjustmentId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      };
    });
    return payloadForApproveOrReject;
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
                  title="IOU Adjustment Approval"
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
          <ActivityIndicator
            size={'large'}
            color={COLORS.primary}
            style={styles.paddingTop30}
          />
        ) : null}

        {IOUAdjustmentApprovalLandingData?.map((data, index) => (
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
                navigation.navigate('IOUAdjustmentApprovalDetails', {
                  iouAdjustDetails: data,
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
            ]}>
            <View>
              <View style={styles.noImageBox}>
                <FastImage source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            </View>
            <View
              style={[
                styles.txtPart,
                data?.isActive ? styles.isActiveTrue : styles.isActiveFalse,
              ]}>
              <View style={styles.rowSpaceBetween}>
                <Text style={styles.empName}>{data?.strEmployeeName}</Text>
              </View>

              <Text style={styles.normalTxt}>Adjusted ৳ {data?.iouAmount}</Text>

              <View style={styles.rowSpaceBetween}>
                <View>
                  <Text style={styles.smallTxt}>
                    Application Date:{' '}
                    {date_formater(data?.application?.dteCreatedAt)}
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
                    ]}>
                    {data?.application?.strStatus}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {IOUAdjustmentApprovalLandingData?.length === 0 ? (
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
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending IOU Adjustment application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => rejectHandler()}
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending IOU Adjustment application?`}
      />
    </ContainerNew>
  );
};

export default IOUAdjustmentApprovalMainIndex;

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
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
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
