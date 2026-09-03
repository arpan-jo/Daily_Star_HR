import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {arlURL, rscURL} from '../../../../../App';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {EmployeeContactType} from '../../../../interfaces/contact/contact';
import {
  createBookMarked,
  createThumsDown,
  getContactLanding,
  getSwitchBoardData} from '../../../../services/SaaS-modules/contact/contact';
import {useRootStore} from '../../../../stores/rootStore';
import {useToast} from '../../../../common/components/CustomToast';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SendContact} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {toggleClickByIndex} from '../../../../common/constant/empdirectory';

const FavEmployee = ({setSwitchBoardData, setResURL2, setVCardData}: any) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const toaster = useToast();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      await getContactData(userInfo?.intBusinessUnitId);
    },
    [isFocused],
  );

  const getContactData = async (buInt: any) => {
    const res = await getContactLanding(
      userInfo?.intAccountId,
      buInt,
      () => {},
      '',
      userInfo?.intEmployeeId,
    );

    const modifies1 = res?.filter((item: EmployeeContactType) => {
      return item?.isBookmarked === true;
    });
    const modifies = modifies1?.map((item: EmployeeContactType) => {
      return {
        ...item,
        isClicked: false,
      };
    });
    setContactData(modifies);
  };

  const handleClicked = (ind: number) => {
    if (contactData) {
      const modData = toggleClickByIndex(contactData, ind);
      setContactData(modData);
    }
  };

  const createBookmark = async (it: any) => {
    const res = await createBookMarked(
      userInfo?.intEmployeeId,
      it?.EmployeeId,
      it?.isBookmarked,
      customCallback,
    );
    handleResponds(res);
  };

  const handleThumsDown = async (it: any) => {
    const res = await createThumsDown(
      userInfo?.intEmployeeId,
      it?.EmployeeId,
      it?.isThumbsDown,
      customCallback,
    );
    handleResponds(res);
  };

  const handleResponds = async (res: any) => {
    if (res) {
      toaster.show({message: 'Successfull.', type: 'success'});
    } else {
    }
  };

  const customCallback = async () => {
    await getContactData(userInfo?.intBusinessUnitId);
  };

  const dialCall = (phone?: String, email?: String) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    if (phone) {
      Linking.openURL(phoneNumber);
    } else if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      toaster.show({message: 'Phone no is empty.', type: 'error'});
    }
  };

  const handleSwitchBoardData = async (empIdd: number) => {
    setSwitchBoardData(undefined);
    //@ts-ignore
    refRBSheet1?.current?.open();
    const res = await getSwitchBoardData(empIdd, () => {});
    setSwitchBoardData(res);
  };

  const handleShareVCard = async (item: any) => {
    const api_params = {
      url: SendContact,
      data: {employee: item?.EmployeeId},
    };
    const res = await httpRequest(api_params, () => {});
    if (res) {
      setResURL2(res);
      setVCardData(item);
    }
  };

  const openMap = async (ad: any) => {
    if (!ad) {
      toaster.show({message: 'No address to show.', type: 'error'});
      return;
    }
    const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
    const url = Platform.select({
      ios: `${scheme}@${ad}`,
      android: `${scheme}${ad}`,
    });
    //@ts-ignore
    Linking.openURL(url);
  };

  return (
    <>
      {contactData?.length && contactData?.length > 0 ? (
        <>
          <View style={styles.containerMargin}>
            <Text style={styles.myLeaveTitle}>
              Favourite Employee
              {userInfo?.strUrl === rscURL && (
                <Text style={styles.myLeaveTitle}> (Hourly) </Text>
              )}
            </Text>
            <>
              {contactData?.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (userInfo?.strUrl) {
                      handleClicked(index);
                    } else {
                      handleClicked(index);
                    }
                  }}
                  style={{
                    marginHorizontal: 2,
                    paddingHorizontal: item?.isClicked ? 8 : 0,
                    borderRadius: 10,
                    backgroundColor: item?.isClicked ? '#F2F4F7' : COLORS.white,
                    elevation: item?.isClicked ? 3 : 0,
                    marginBottom: item?.isClicked ? 8 : 0,
                    paddingTop: item?.isClicked ? 12 : 4,
                  }}>
                  <View style={[styles.cardHead]}>
                    <View style={styles.rowW90}>
                      <View style={styles.imageSection}>
                        {item?.intProfilePicFileUrlId ? (
                          <FastImage
                            source={{
                              uri: getImageURL(item?.intProfilePicFileUrlId),
                            }}
                            style={styles.managerImage}
                          />
                        ) : (
                          <View style={styles.noImageBox}>
                            <Image
                              source={IMAGES.NoImage}
                              style={styles.managerImage}
                            />
                          </View>
                        )}
                      </View>
                      <View style={styles.width82}>
                        <View style={styles.empNameSection}>
                          <Text style={styles.empName}>
                            {item?.EmployeeName?.trim()}{' '}
                          </Text>

                          <Text>
                            {item?.isBookmarked && (
                              <MIcon
                                name="star"
                                size={18}
                                color={COLORS.late}
                              />
                            )}
                          </Text>
                        </View>

                        <View
                          style={[
                            styles.cmnSubTitle,
                            styles.paddingTop,
                            styles.fDRow,
                          ]}>
                          <Text style={styles.commonTextTitle1}>
                            {item?.DesignationName?.trim()}
                          </Text>
                        </View>

                        <View style={[styles.cmnSubTitle, styles.pVartical2]}>
                          <Text style={styles.commonTextTitle1}>
                            {item?.Phone || '---'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          dialCall(item?.Phone, undefined);
                        }}
                        style={styles.callIcon}>
                        <MIcon
                          name="call"
                          size={23}
                          color={COLORS.graySubText}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {contactData?.length === index + 1 ? null : (
                    <View
                      style={{
                        height: 1,
                        backgroundColor: item?.isClicked
                          ? '#EAECF0'
                          : COLORS.bar,
                        marginVertical: 8,
                        marginHorizontal: item?.isClicked ? 16 : 0,
                      }}
                    />
                  )}
                  {item?.isClicked ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      showsVerticalScrollIndicator={false}
                      style={styles.scrollStyle}>
                      {userInfo?.strUrl === arlURL ? (
                        <TouchableOpacity
                          onPress={() => {
                            handleSwitchBoardData(item?.EmployeeId);
                          }}
                          style={styles.chatAndInfo}>
                          <MIcon
                            name="link"
                            size={22}
                            color={COLORS.white}
                            style={{
                              transform: [{rotate: '135deg'}],
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                      {userInfo?.strUrl === arlURL ? (
                        <TouchableOpacity
                          onPress={() => handleShareVCard(item)}
                          style={[styles.chatAndInfo, {marginLeft: 12}]}>
                          <MCIcon name="share" size={22} color={COLORS.white} />
                        </TouchableOpacity>
                      ) : null}
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CreateAppreciate', {
                            empDetails: item,
                          })
                        }
                        style={[styles.chatAndInfo, styles.mLeft12]}>
                        <MCIcon
                          name="thumb-up-outline"
                          size={22}
                          color={COLORS.white}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          handleThumsDown(item);
                        }}
                        style={[styles.chatAndInfo, styles.mLeft12]}>
                        <MCIcon
                          name="thumb-down-outline"
                          size={22}
                          color={
                            item?.isThumbsDown ? COLORS.yellow : COLORS.white
                          }
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          // navigation.navigate('SendMsgToEmployee', {});
                          if (item?.Phone) {
                            Linking.openURL(`sms:${item?.Phone}?body=`);
                          } else {
                            toaster.show({
                              message: 'Phone no is empty.',
                              type: 'error',
                            });
                          }
                        }}
                        style={[styles.chatAndInfo, styles.mLeft12]}>
                        <MIcon name="chat" size={22} color={COLORS.white} />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          //@ts-ignore
                          navigation.navigate('EployeeDirectoryDetails', {
                            employeeDetails: item || '',
                          });
                        }}
                        style={[styles.chatAndInfo, styles.mLeft12]}>
                        <MIcon name="info" size={22} color={COLORS.white} />
                      </TouchableOpacity>

                      {userInfo?.strUrl === arlURL && (
                        <>
                          <TouchableOpacity
                            onPress={() => createBookmark(item)}
                            style={[styles.chatAndInfo, styles.mLeft12]}>
                            <MIcon
                              name="star"
                              size={22}
                              color={
                                item?.isBookmarked ? COLORS.late : COLORS.white
                              }
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            // onPress={() => createMeetMeMsg(item)}
                            onPress={() => {
                              // @ts-ignore
                              setEmpId(item?.EmployeeId);
                              // @ts-ignore
                              refRBSheet?.current?.open();
                            }}
                            style={[
                              styles.chatAndInfo,
                              styles.notificationStyle,
                            ]}>
                            <MIcon
                              name="notifications"
                              size={22}
                              color={COLORS.white}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              openMap(item?.presentAddress);
                            }}
                            style={[
                              styles.chatAndInfo,
                              styles.notificationStyle,
                            ]}>
                            <MCIcon
                              name="map-marker"
                              size={22}
                              color={COLORS.white}
                            />
                          </TouchableOpacity>

                          <View style={styles.width100} />
                        </>
                      )}
                    </ScrollView>
                  ) : null}
                </TouchableOpacity>
              ))}
            </>
          </View>
          <View style={styles.bar} />
        </>
      ) : null}
    </>
  );
};

export default observer(FavEmployee);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  rowW90: {
    flexDirection: 'row',
    width: '90%',
  },
  imageSection: {
    width: '18%',
  },
  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  noImageBox: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  width82: {
    width: '82%',
  },
  empNameSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -4,
    width: '100%',
    flexWrap: 'wrap',
  },
  empName: {
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },
  cmnSubTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paddingTop: {paddingVertical: 3},
  fDRow: {
    flexDirection: 'row',
  },
  commonTextTitle1: {
    fontSize: 14,
    lineHeight: 16,
    color: COLORS.graySubText,
  },
  pVartical2: {
    paddingVertical: 2,
  },
  callIcon: {
    padding: 8,
  },
  scrollStyle: {
    flexDirection: 'row',
    paddingLeft: '4%',
    paddingBottom: 10,
    paddingTop: 4,
  },
  chatAndInfo: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 50,
    alignItems: 'center',
    alignSelf: 'center',
  },
  mLeft12: {
    marginLeft: 12,
  },
  notificationStyle: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  width100: {
    width: 100,
  },
  bar: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 16,
  },
});
