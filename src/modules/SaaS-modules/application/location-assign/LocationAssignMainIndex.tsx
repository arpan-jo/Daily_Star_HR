import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import EnIcon from 'react-native-vector-icons/Entypo';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {EmployeeWiseLocation} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {directionFromLatLong} from '../../../../common/services/directionFromLatLong';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import {LocaionAssignedType} from '../../../../interfaces/location-assign/location-assign';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const LocationAssignMainIndex = ({route}: any) => {
  const {employeeData} = route?.params;
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState();
  const isFocused = useIsFocused();
  const [locationAssignLandingData, setLocationAssignLandingData] =
    useState<LocaionAssignedType>();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const api_params = {
        url: EmployeeWiseLocation,
        data: {
          AccountId: userInfo?.intAccountId,
          EmployeeId: employeeData?.EmployeeId,
        },
      };
      const res = await httpRequest(api_params, setIsLoading);
      setLocationAssignLandingData(res);
    },
    [isFocused],
  );

  const landData = locationAssignLandingData?.resultList?.filter(
    item => item?.strStatus,
  );

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          infoIconPress={() =>
            //@ts-ignore
            // refRBSheet?.current?.open()

            setModalVisible(true)
          }
          title="Location Assign"
        />
      }
      style={styles.container}>
      <View
        style={{
          height: SIZES.height,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {landData && landData?.length > 0 ? (
            <View>
              {landData?.map((item, index) => (
                <TouchableOpacity
                  disabled
                  key={index}
                  // onPress={() =>
                  //   navigation.navigate('LeaveApplicationDetails', {
                  //     leaveDetails: { ...item, empLeaveData },
                  //   })
                  // }
                  style={styles.leaveCard}>
                  <View style={styles.leaveTextPart}>
                    <MIcon name="map" size={30} color={COLORS.primary} />
                    <View style={styles.paddingLeft}>
                      <Text style={styles.titleTxt}>{item?.locationName}</Text>
                      <Text style={styles.location}>{item?.strAddress}</Text>
                      <View style={styles.latLng}>
                        <Text style={styles.cmnTxt2}>
                          {`${Number(item?.strLatitude).toFixed(5)}° `}{' '}
                          {directionFromLatLong(item?.strLatitude, 0)}
                        </Text>
                        <View style={styles.bar2} />
                        <Text style={styles.cmnTxt2}>
                          {`${Number(item?.strLongitude).toFixed(5)}° `}
                          {directionFromLatLong(0, item?.strLongitude)}
                        </Text>
                      </View>

                      <View>
                        <Text
                          style={[
                            styles.status,
                            {
                              color: getStatusColor(item?.strStatus),
                              backgroundColor: getStatusBgColor(
                                item?.strStatus,
                              ),
                            },
                          ]}>
                          {item?.strStatus}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noImgContainer}>
              <FastImage source={IMAGES.NoDataImage} style={styles.fastImg} />
              <Text style={styles.noDataText}>No data found</Text>
            </View>
          )}

          {isLoading ? (
            <ActivityIndicator
              size={'large'}
              color={COLORS.primary}
              style={styles.loadingIndicator}
            />
          ) : null}

          <View style={styles.paddingBottom} />
        </ScrollView>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate('CreateEditNewLocationAssign', {
            locationAssignData: locationAssignLandingData,
            profileData: employeeData,
          })
        }
        style={[
          styles.appBtn,
          {
            marginTop:
              Platform.OS === 'ios' ? SIZES.height / 1.33 : SIZES.height / 1.28,
          },
        ]}
        activeOpacity={0.6}>
        <Icon name="plus" size={25} color={COLORS.white} />
      </TouchableOpacity>

      {/* <AllLocationsSheet
        refRBSheet={refRBSheet}
        locationData={locationAssignLandingData?.resultList}
      /> */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <EnIcon name="cross" size={33} style={styles.imageCancelIcon} />
            </TouchableOpacity>

            <View style={styles.modalCard}>
              <Text style={styles.title}>All Locations</Text>
              <FlatList
                removeClippedSubviews
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={locationAssignLandingData?.resultList}
                renderItem={({item, index}) => (
                  <View key={index}>
                    <View style={styles.card}>
                      <Text style={styles.locationTxt}>
                        {item?.locationName}
                      </Text>
                      <Text style={styles.addressTxt}>{item?.strAddress}</Text>
                      <View style={styles.latLng}>
                        <Text style={styles.cmnTxt2}>
                          {`${Number(item?.strLatitude).toFixed(5)}° `}{' '}
                          {directionFromLatLong(item?.strLatitude, 0)}
                        </Text>
                        <View style={styles.bar2} />
                        <Text style={styles.cmnTxt2}>
                          {`${Number(item?.strLongitude).toFixed(5)}° `}
                          {directionFromLatLong(0, item?.strLongitude)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bar} />
                  </View>
                )}
                //@ts-ignore
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ContainerNew>
  );
};

export default LocationAssignMainIndex;

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: 16, backgroundColor: COLORS.white},
  leaveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 8,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  status: {
    marginVertical: 10,
    fontSize: 12,
    lineHeight: 18,
    width: 100,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    overflow: 'hidden',
    textAlign: 'center',
  },
  location: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    marginTop: 6,
  },

  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    marginLeft: SIZES.width / 1.3,
    overflow: 'hidden',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  paddingLeft: {
    paddingLeft: 12,
  },
  noImgContainer: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImg: {
    width: 130,
    height: 90,
  },
  loadingIndicator: {
    paddingTop: 30,
  },
  paddingBottom: {
    paddingBottom: 200,
  },
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalView: {
    height: SIZES.height / 1.2,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    paddingHorizontal: 20,
    paddingTop: 5,
    width: SIZES.width / 1.1,
  },
  imageCancelIcon: {
    paddingLeft: 10,
    textAlign: 'right',
  },

  modalCard: {
    height: SIZES.height / 1.4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.blackish,
    paddingBottom: 25,
  },
  bar: {
    height: 1,
    backgroundColor: COLORS.borderBottom,
    marginVertical: 10,
  },
  card: {
    flexDirection: 'column',
  },
  locationTxt: {
    color: COLORS.textNewColor,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  addressTxt: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    marginTop: 5,
  },

  // latLng: {
  //   flexDirection: 'row',
  //   paddingVertical: 6,
  // },
  // cmnTxt2: {
  //   color: COLORS.graySubText,
  //   fontSize: 14,
  //   fontWeight: '500',
  // },
  // bar2: {
  //   width: 2,
  //   backgroundColor: COLORS.graySubText,
  //   marginHorizontal: 20,
  // },
});
