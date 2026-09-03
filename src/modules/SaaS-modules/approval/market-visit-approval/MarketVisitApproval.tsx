import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
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
  GetAllPendingApplicationsForApproval,
  MarketAttendanceLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';
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
const MarketVisitApprovalMainIndex = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const [isSearch, _setIsSearch] = useState(true);
  const [isShowHeader, _setIsShowHeader] = useState(true);
  const [topBar, setTopBar] = useState(topBarItem);
  const [activeTabName, setActiveTabName] = useState('commonApproval');
  const [remoteAttendance, setRemoteAttendance] = useState<any[]>();

  //@ts-ignore
  const marketVisitData = route?.params;

  const payload = {
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    isSupervisor: false,
    isLineManager: false,
    isUserGroup: false,
    approverId: userInfo?.intEmployeeId,
    departmentId: 0,
    designationId: 0,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: userInfo?.intEmployeeId,
    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
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

      // const api_params = {
      //   url: MarketAttendanceLanding,
      //   data: payload,
      //   method: 'post',
      // };
      // const res = await httpRequest(api_params, setIsLoading);

      // setRemoteAttendance(res);
      getLandingDataApi();
    },
    [isFocused, userInfo],
  );
  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : MarketAttendanceLanding,
      data:
        commonURL === userInfo?.strUrl
          ? {
              ...payload,
              // for common new approval api  v2
              //@ts-ignore
              applicationTypeId: marketVisitData?.applicationTypeId,
              employeeId: userInfo?.intEmployeeId,
              // for common new approval api  v2
            }
          : payload,
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',
    };
    const resData = await httpRequest(api_params, setIsLoading);
    const modifiedData = resData?.listData || resData?.data || resData;
    const data =
      modifiedData &&
      modifiedData?.map((item: any) => {
        return {
          ...item,
          waitingStage:
            item?.applicationInformation?.waitingStage ||
            item?.waitingStage ||
            '',
          currentStage: item?.afterApproveStatus || item?.currentStage || '',

          intEmployeeId:
            item?.applicationInformation?.employeeId ||
            item?.intEmployeeId ||
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
              item?.dteAttendanceDate ||
              '',
            intEmployeeId:
              item?.applicationInformation?.employeeId ||
              item?.application?.intEmployeeId ||
              '',
            strStatus:
              item?.applicationInformation?.status ||
              item?.application?.strStatus ||
              '',
            strLatitude:
              item?.applicationInformation?.latitude ||
              item?.application?.strLatitude ||
              '',
            strLongitude:
              item?.applicationInformation?.longitude ||
              item?.application?.strLongitude ||
              '',
            dteAttendanceTime:
              item?.applicationInformation?.startTime ||
              item?.application?.dteAttendanceTime ||
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
  };

  return (
    <ContainerNew
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
                  title="Market Visit Approval"
                />
              )}
            </>
          )}
        </>
      }
      style={styles.container}>
      <View>
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
        {remoteAttendance?.map((item: any, index: any) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate('MarketVisitApprovalDetails', {
                attDetails: item,
                activeTabName: activeTabName,
              });
            }}>
            <View style={styles.card}>
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
                      ]}>
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

                <View style={styles.rowFlexStart}>
                  <View style={styles.flexRow}>
                    <View>
                      {/* <Text style={styles.smallTxt}>First Check In</Text> */}
                      <Text style={styles.smallTxt}>Market Visit Time</Text>
                      <Text style={styles.timeTxt}>
                        {timeFormaterToPmAm(
                          item?.application?.dteAttendanceTime,
                        )}
                      </Text>
                    </View>
                    <MIcon name="north" size={20} color={COLORS.iconColor} />
                  </View>
                  {/* <View style={[styles.flexRow, styles.marginLeft]}>
                    <View>
                      <Text style={styles.smallTxt}>Last Check Out</Text>
                      <Text style={styles.timeTxt}>{{timeFormaterToPmAm(item?.)}}</Text>
                    </View>
                    <MIcon name="south" size={20} color={COLORS.iconColor} />
                  </View> */}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.padBottom} />
      </View>

      {remoteAttendance?.length === 0 ? (
        <View style={styles.noDataBox}>
          <FastImage source={IMAGES.NoDataImage} style={styles.image} />
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      ) : null}
    </ContainerNew>
  );
};

export default MarketVisitApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
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
    color: COLORS.graySubText,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empName: {
    fontSize: 16,
    width: '80%',
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
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  image: {width: 130, height: 90},
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
    paddingBottom: 200,
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
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
