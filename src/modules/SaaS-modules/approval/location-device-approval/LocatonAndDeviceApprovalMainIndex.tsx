import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {directionFromLatLong} from '../../../../common/services/directionFromLatLong';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';
import {ListDataEntity} from '../../../../interfaces/attendance/attendance';

import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  GetAllPendingApplicationsForApproval,
  RemoteAttendanceLocationNDeviceLanding} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {commonURL} from '../../../../../App';

const edges: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LocationAndDeviceApprovalMainIndex = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const route = useRoute();

  //@ts-ignore
  const locAndDevApp = route?.params;
  const [registerLocaitonData, setRegisterLocationData] =
    useState<ListDataEntity[]>();

  const [registerDeviceData, setRegisterDeviceData] =
    useState<ListDataEntity[]>();

  const payloadForLand = {
    applicationStatus: 'Pending',
    isAdmin: userInfo?.isOfficeAdmin,
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
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      // const api_params = {
      //   url: RemoteAttendanceLocationNDeviceLanding,
      //   data:
      // commonURL === userInfo?.strUrl
      //   ? {
      //       ...payloadForLand,
      //       BusinessUnitId: userInfo?.intBusinessUnitId,
      //       // for common new approval api  v2
      //       applicationTypeId: locAndDevApp?.applicationTypeId,
      //       employeeId: userInfo?.intEmployeeId,
      //       // for common new approval api  v2
      //     }
      //   : payloadForLand,
      //   method: 'post',
      // };
      // const res = await httpRequest(api_params, setIsLoading);

      // const location = res?.listData?.filter(
      //   (item: any) => item?.application?.isLocationRegister,
      // );
      // setRegisterLocationData(location);
      // const device = res?.listData?.filter(
      //   (item: any) => item?.application?.isLocationRegister === false,
      // );
      // setRegisterDeviceData(device);
      getLandingDataApi();
    },
    [isFocused],
  );

  const [items, setItems] = useState([
    {
      id: 1,
      title: 'LOCATION',
      isClicked: true,
    },
    {
      id: 2,
      title: 'DEVICE',
      isClicked: false,
    },
    // {
    //   id: 3,
    //   title: 'ADMIN LOCATION',
    //   isClicked: false,
    // },
  ]);

  const handleClicked = (id: number) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        return {...item, isClicked: true};
      } else {
        return {...item, isClicked: false};
      }
    });
    setItems(newItems);
  };

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : RemoteAttendanceLocationNDeviceLanding,
      data:
        commonURL === userInfo?.strUrl
          ? {
              ...payloadForLand,
              BusinessUnitId: userInfo?.intBusinessUnitId,
              // for common new approval api  v2
              //@ts-ignore
              applicationTypeId: locAndDevApp?.applicationTypeId,
              employeeId: userInfo?.intEmployeeId,
              // for common new approval api  v2
            }
          : payloadForLand,
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',
      // isConsole: true,
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
            intAttendanceRegId:
              item?.applicationInformation?.applicationId ||
              item?.application?.intAttendanceRegId ||
              '',
            dteInsertDate:
              item?.applicationInformation?.applicationDate ||
              item?.dteCreatedAt ||
              item?.application?.dteInsertDate ||
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
            strDeviceName:
              item?.applicationInformation?.deviceName ||
              item?.application?.strDeviceName ||
              '',
            strDeviceId:
              item?.applicationInformation?.deviceId ||
              item?.application?.strDeviceId ||
              '',
            // this is for Common Approval of V2 project
          },
          isActive: false,
        };
      });
    const location = data?.filter(
      (item: any) => item?.application?.isLocationRegister,
    );
    setRegisterLocationData(location);
    const device = data?.filter(
      (item: any) => item?.application?.isLocationRegister === false,
    );
    setRegisterDeviceData(device);
  };

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <CustomHeader
          withoutBar
          onBackPress={navigation.goBack}
          title="Location & Device Approval"
        />
      }
      style={styles.container}>
      <View style={styles.headPart}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.head,
                {
                  borderBottomColor: !item.isClicked
                    ? COLORS.primary
                    : COLORS.white,
                },
              ]}>
              <TouchableOpacity
                disabled={item.isClicked ? true : false}
                onPress={() => handleClicked(item.id)}>
                <View style={styles.navStyle}>
                  <Text
                    style={[
                      styles.headText,
                      item.isClicked
                        ? styles.isClickedFalse
                        : styles.isClickedTrue,
                    ]}>
                    {item.title}
                  </Text>
                  {/* <Text style={styles.countText}>10</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'small'}
          style={styles.activityIndicator}
        />
      ) : null}
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          style={styles.landingPart}>
          {items[0]?.isClicked ? (
            <>
              {registerLocaitonData?.map((item, index) => (
                <TouchableOpacity
                  onPress={() =>
                    //@ts-ignore
                    navigation.navigate('LocationAndDeviceApprovalDetails', {
                      locationDetails: item,
                    })
                  }
                  style={styles.card}
                  key={index}>
                  <View>
                    <View style={styles.noImageBox}>
                      <FastImage
                        source={IMAGES.NoImage}
                        style={styles.noImage}
                      />
                    </View>
                  </View>
                  <View style={styles.txtPart}>
                    <Text style={styles.empName}>{item?.employeeName}</Text>
                    <Text style={styles.empName2}>
                      {item?.application?.strAddress}
                    </Text>
                    <View style={styles.latLng}>
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.application?.strLatitude).toFixed(
                          5,
                        )}° `}{' '}
                        {directionFromLatLong(
                          item?.application?.strLatitude,
                          0,
                        )}
                      </Text>
                      <View style={styles.bar2} />
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.application?.strLongitude).toFixed(
                          5,
                        )}° `}
                        {directionFromLatLong(
                          0,
                          item?.application?.strLongitude,
                        )}
                      </Text>
                    </View>
                    <View>
                      <View
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusBgColor(
                              item?.application?.strStatus,
                            ),
                          },
                        ]}>
                        <Text
                          style={[
                            styles.statusTxt,
                            {
                              color: getStatusColor(
                                item?.application?.strStatus,
                              ),
                            },
                          ]}>
                          {item?.application?.strStatus}
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
            </>
          ) : (
            <>
              {items[1]?.isClicked ? (
                <>
                  {registerDeviceData?.map((item, index) => (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate(
                          'LocationAndDeviceApprovalDetails',
                          {
                            locationDetails: item,
                          },
                        )
                      }
                      style={styles.card}
                      key={index}>
                      <View>
                        <View style={styles.noImageBox}>
                          <FastImage
                            source={IMAGES.NoImage}
                            style={styles.noImage}
                          />
                        </View>
                      </View>
                      <View style={styles.txtPart}>
                        <Text style={styles.empName}>{item?.employeeName}</Text>
                        <Text style={[styles.cmnTxt2, styles.deviceName]}>
                          {item?.application?.strDeviceName}
                        </Text>
                        <Text style={styles.cmnTxt2}>
                          {item?.application?.strDeviceId}
                        </Text>
                        <View>
                          <View
                            style={[
                              styles.status,
                              {
                                backgroundColor: getStatusBgColor(
                                  item?.application?.strStatus,
                                ),
                              },
                            ]}>
                            <Text
                              style={[
                                styles.statusTxt,
                                {
                                  color: getStatusColor(
                                    item?.application?.strStatus,
                                  ),
                                },
                              ]}>
                              {item?.application?.strStatus}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                  {registerDeviceData?.length === 0 ? (
                    <View style={styles.noDataSection}>
                      <FastImage
                        source={IMAGES.NoDataImage}
                        style={styles.image}
                      />
                      <Text style={styles.noDataText}>No data found</Text>
                    </View>
                  ) : null}
                </>
              ) : (
                <>
                  <View style={styles.noDataSection}>
                    <FastImage
                      source={IMAGES.NoDataImage}
                      style={styles.image}
                    />
                    <Text style={styles.noDataText}>No data found</Text>
                  </View>
                </>
              )}
            </>
          )}

          <View style={styles.paddingBtm} />
        </ScrollView>
      </View>
    </ContainerNew>
  );
};

export default LocationAndDeviceApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headPart: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    paddingTop: 18,
    paddingBottom: 0.7,
  },
  headText: {
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: '700',
    fontSize: 14,
    alignItems: 'center',
    lineHeight: 20,
  },
  head: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 3,
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
  image: {width: 130, height: 90},
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
  deviceName: {
    paddingVertical: 1,
  },
  isClickedTrue: {
    color: '#BFE7CA',
  },
  isClickedFalse: {
    color: COLORS.white,
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
  navStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  paddingBtm: {
    paddingBottom: 200,
  },
  // countText: {
  //   color: COLORS.white,
  //   fontSize: 14,
  //   fontWeight: '500',
  //   backgroundColor: COLORS.statusBar,
  //   borderRadius: 100,
  //   paddingHorizontal: 8,
  //   paddingVertical: 6,
  //   marginBottom: 10,
  //   marginRight: 2,
  // },
});
