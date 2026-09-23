import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
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
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS } from '../../../../common/constant/Themes';
import { directionFromLatLong } from '../../../../common/services/directionFromLatLong';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { MasterLocationApprovalType } from '../../../../interfaces/attendance/attendance';

import { useRootStore } from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { commonURL } from '../../../../../App';
import {
  GetAllPendingApplicationsForApproval,
  MasterLocationAssaignLandingEngine,
} from '../../../../common/api/api';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';

const edges: Edge[] = ['right', 'bottom', 'left'];

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
const AssignedLocationApprovalMain = () => {
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute();
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

  const [registerLocaitonData, setRegisterLocationData] =
    useState<MasterLocationApprovalType[]>();

  //@ts-ignore
  const masLocAppData = route?.params;

  const payload = {
    applicationStatus: 'pending',
    isAdmin: userInfo?.isOfficeAdmin,
    isSupOrLineManager: userInfo?.isSupNLMORManagement,
    isSupervisor: false,
    isLineManager: false,
    isUserGroup: false,
    approverId: userInfo?.intEmployeeId,
    applicantId: 0,
    accountId: userInfo?.intAccountId,
    intId: userInfo?.intEmployeeId,
    busineessUnit: userInfo?.intBusinessUnitId,
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
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
      // const res = await getMasterLocationApprovallLanding(
      //   payload,
      //   setIsLoading,
      // );
      // setRegisterLocationData(res);
      getLandingDataApi();
    },
    [isFocused, activeTabName],
  );

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : MasterLocationAssaignLandingEngine,
      data:
        commonURL === userInfo?.strUrl
          ? {
              ...payload,
              // for common new approval api  v2
              //@ts-ignore
              applicationTypeId: masLocAppData?.applicationTypeId,
              employeeId: userInfo?.intEmployeeId,
              isAdmin: activeTabName === 'adminApproval' ? true : false,
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
          strStatus:
            item?.applicationInformation?.status || item?.strStatus || '',
          strPlaceName:
            item?.applicationInformation?.placeName || item?.strPlaceName || '',
          intMasterLocationId:
            item?.applicationInformation?.applicationId ||
            item?.intMasterLocationId ||
            '',
          application: {
            ...item?.application,

            // this is for Common Approval of V2 project
            ...item?.applicationInformation,

            dteCreatedAt:
              item?.dteCreatedAt || item?.application?.dteCreatedAt || '',

            strStatus:
              item?.applicationInformation?.status || item?.strStatus || '',
            strAddress:
              item?.applicationInformation?.address ||
              item?.application?.strAddress ||
              '',
            strLatitude:
              item?.applicationInformation?.latitude ||
              item?.application?.strLatitude ||
              '',
            strLongitude:
              item?.applicationInformation?.longitude ||
              item?.application?.strLongitude ||
              '',
            strPlaceName:
              item?.applicationInformation?.placeName ||
              item?.strPlaceName ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    setRegisterLocationData(data);
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
      edges={edges}
      header={
        <CustomHeader
          withoutBar
          onBackPress={navigation.goBack}
          title="Master Location Approval"
        />
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
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.landingPart}
        >
          {registerLocaitonData?.map((item, index) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AssignedLocationApprovalDetails', {
                  locationDetails: item,
                  activeTabName: activeTabName,
                })
              }
              style={styles.card}
              key={index}
            >
              <View>
                <View style={styles.noImageBox}>
                  <FastImage source={IMAGES.NoImage} style={styles.noImage} />
                </View>
              </View>
              <View style={styles.txtPart}>
                <Text style={styles.empName}>{item?.strPlaceName}</Text>
                <Text style={styles.empName2}>
                  {item?.application?.strAddress}
                </Text>
                <View style={styles.latLng}>
                  <Text style={styles.cmnTxt2}>
                    {`${Number(item?.application?.strLatitude).toFixed(5)}° `}{' '}
                    {directionFromLatLong(item?.application?.strLatitude, 0)}
                  </Text>
                  <View style={styles.bar2} />
                  <Text style={styles.cmnTxt2}>
                    {`${Number(item?.application?.strLongitude).toFixed(5)}° `}
                    {directionFromLatLong(0, item?.application?.strLongitude)}
                  </Text>
                </View>
                <View>
                  <View
                    style={[
                      styles.status,
                      {
                        backgroundColor: getStatusBgColor(item?.strStatus),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTxt,
                        {
                          color: getStatusColor(item?.strStatus),
                        },
                      ]}
                    >
                      {item?.strStatus}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {registerLocaitonData?.length === 0 ? (
            <View style={styles.noDataSection}>
              <FastImage source={IMAGES.NoDataImage} style={styles.image} />
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          ) : null}

          <View style={styles.paddingBtm} />
        </ScrollView>
      </View>
    </ContainerNew>
  );
};

export default AssignedLocationApprovalMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 16,
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
  empName: {
    fontSize: 16,
    fontWeight: '500',
    width: '95%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  empName2: {
    fontSize: 14,
    fontWeight: '500',
    width: '95%',
    color: COLORS.textNewColor,
    lineHeight: 24,
  },
  txtPart: {
    flex: 1,
    paddingLeft: 16,
  },
  statusTxt: {
    textAlign: 'center',
    borderRadius: 100,
    paddingBottom: 2,
  },
  status: {
    width: 80,
    paddingVertical: 1,
    marginTop: 5,
    borderRadius: 100,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  image: { width: 130, height: 90 },
  latLng: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  cmnTxt2: {
    color: COLORS.graySubText,
    fontSize: 14,
    fontWeight: '500',
  },
  bar2: {
    width: 2,
    backgroundColor: COLORS.graySubText,
    marginHorizontal: 20,
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
  landingPart: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  noDataSection: {
    alignSelf: 'center',
    paddingTop: 20,
  },
  activityIndicator: {
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
    marginTop: 15,
  },
  paddingBtm: { paddingBottom: 200 },
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
