/* eslint-disable react-native/no-inline-styles */

import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useRef} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  Linking,
  ListRenderItemInfo,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomButtonNew from '../../../common/components/CustomButton';
import CustomInputNew from '../../../common/components/CustomInput';
import ContainerNew from '../../../common/components/Container';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {arlURL} from '../../../../App';
import CustomHeader from '../../../common/components/CustomHeader';
import SearchHeader from '../../../common/components/SearchHeader';
import {IMAGES} from '../../../common/constant/Index';
import {COLORS, SIZES} from '../../../common/constant/Themes';
import {getImageURL} from '../../../common/services/getImage';
import {EmployeeContactType} from '../../../interfaces/contact/contact';
import {
  getContactLanding,
  createMeetMe,
  createBookMarked,
  createThumsDown,
  getSwitchBoardData} from '../../../services/SaaS-modules/contact/contact';
import {useRootStore} from '../../../stores/rootStore';

import RBSheet from '../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useEmployeeContacts} from '../../../hooks/useEmployeeContacts';
import {
  createMeetMeMessage,
  dialContact,
  toggleClickByIndex} from '../../../common/constant/empdirectory';
import {empDirectoryCommon} from '../../arl-core-modules/EmployeeDirectory';

const edges: Edge[] = ['right', 'bottom', 'left'];
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EmployeeDirectoryFromHome = observer<
  DrawerScreenProps<'Employee Directory'>
>(({navigation}) => {
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();

  const {userInfo} = useRootStore();
  const {
    isLoading: _isLoading,
    setIsLoading,
    contactData,
    setContactData,
    contactData2,
    setContactData2,
    isSearch,
    setIsSearch,
    employeeName,
    setEmployeeName,
    isFocused,
    isLoad,
    setIsLoad,
    empId,
    setEmpId,
    toaster,
    busId,
    switchBoardData,
    setSwitchBoardData,
  } = useEmployeeContacts();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      getContactData(busId);
      setIsSearch(true);
      setEmployeeName('');
      if (!employeeName) {
        getContactData(busId);
      }
    },
    [isFocused, isLoad === true],
  );

  const getContactData = async (buInt: any) => {
    const res = await getContactLanding(
      userInfo?.intAccountId,
      buInt,
      setIsLoading,
      employeeName,
      userInfo?.intEmployeeId,
    );
    const modifies = res?.map((item: EmployeeContactType) => {
      return {
        ...item,
        isClicked: false,
      };
    });
    if (buInt) {
      setContactData(modifies);
    } else {
      setContactData2(modifies);
    }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      if (userInfo?.strUrl === arlURL && employeeName?.length >= 3) {
        getContactData(0);
      } else if (userInfo?.strUrl === arlURL && employeeName?.length < 3) {
        setContactData2([]);
        if (contactData) {
          const temp = [...contactData];
          setContactData(temp);
        }
      }
    },
    [employeeName],
  );

  const currentTime = dayjs().format('h:mm A');
  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      agendaOfMeetMe: 'Come to meet me now',
      schedule: currentTime?.toString(),
    },
  });

  const dialCall = (phone?: string, email?: string) => {
    dialContact({phone, email, toaster});
  };

  const handleClicked = (ind: number) => {
    if (contactData) {
      const modData = toggleClickByIndex(contactData, ind);
      setContactData(modData);
    }
  };
  const handleClickedForSearch = (ind: number) => {
    if (contactData2) {
      const modData = toggleClickByIndex(contactData2, ind);
      setContactData2(modData);
    }
  };

  const createMeetMeMsg = async (data: any) => {
    await createMeetMeMessage({
      userInfo,
      empId,
      data,
      reset,
      refRBSheet,
      toaster,
      createMeetMe,
    });
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
      setIsSearch(true);
      setIsLoad(true);
      setEmployeeName('');
      toaster.show({message: 'Successfull.', type: 'success'});
    } else {
      setIsLoad(true);
      setEmployeeName('');
    }
  };

  const customCallback = async () => {
    const ress = await getContactLanding(
      userInfo?.intAccountId,
      userInfo?.intBusinessUnitId,
      setIsLoading,
      employeeName,
      userInfo?.intEmployeeId,
    );
    const modifies = ress?.map((item: EmployeeContactType) => {
      return {
        ...item,
        isClicked: false,
      };
    });
    setContactData(modifies);
  };

  const renderItem = ({
    item,
    index,
  }: ListRenderItemInfo<EmployeeContactType>) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          if (userInfo?.strUrl && !isSearch) {
            handleClickedForSearch(index);
            handleClicked(index);
          } else {
            handleClicked(index);
            setIsSearch(true);
            setEmployeeName('');
          }
        }}
        style={{
          marginHorizontal: !item?.isClicked ? 16 : 8,
          paddingHorizontal: item?.isClicked ? 8 : 0,
          borderRadius: 24,
          backgroundColor: item?.isClicked ? '#F2F4F7' : COLORS.white,
          elevation: item?.isClicked ? 5 : 0,
          marginBottom: item?.isClicked ? 8 : 0,
          paddingTop: item?.isClicked ? 8 : 0,
        }}>
        <View style={[styles.cardHead]}>
          <View style={{flexDirection: 'row', width: '90%'}}>
            <View style={styles.imageSection}>
              {item?.intProfilePicFileUrlId ? (
                <FastImage
                  source={{uri: getImageURL(item?.intProfilePicFileUrlId)}}
                  style={styles.empImage}
                />
              ) : (
                <View style={styles.noImageBox}>
                  <Image source={IMAGES.NoImage} style={styles.noImage} />
                </View>
              )}

              <View
                style={[styles.circleChat, {backgroundColor: COLORS.primary}]}
              />
            </View>
            <View
              style={{
                width: '80%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: -4,
                  width: '100%',
                  flexWrap: 'wrap',
                }}>
                <Text style={styles.empName}>
                  {item?.EmployeeName?.trim()}{' '}
                  <Text
                    style={[
                      styles.designation,
                      {fontSize: 14, color: COLORS.transparentBlack},
                    ]}>
                    ({item?.EmployeeCode?.trim()})
                  </Text>
                </Text>

                <Text>
                  {item?.isBookmarked && (
                    <Icon name="star" size={15} color={COLORS.late} />
                  )}
                </Text>
              </View>

              <View
                style={[
                  styles.cmnSubTitle,
                  styles.paddingTop,
                  {flexDirection: 'row'},
                ]}>
                <Text style={styles.designation}>
                  {item?.DesignationName?.trim()}
                </Text>
              </View>
              {userInfo?.strUrl === arlURL && !isSearch && (
                <View
                  style={[
                    styles.cmnSubTitle,
                    styles.paddingTop,
                    {flexDirection: 'row'},
                  ]}>
                  <Text style={styles.designation}>
                    {item?.strBusinessUnit?.trim()}
                  </Text>
                </View>
              )}

              <View style={[styles.cmnSubTitle, {paddingVertical: 2}]}>
                <Text style={styles.designation}>{item?.Phone || '---'}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              dialCall(item?.Phone, undefined);
            }}
            style={{padding: 8}}>
            <Icon name="call" size={25} color={COLORS.graySubText} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: item?.isClicked ? '#EAECF0' : COLORS.bar,
            marginVertical: 8,
            marginHorizontal: item?.isClicked ? 16 : 0,
          }}
        />
        {item?.isClicked ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            style={{
              flexDirection: 'row',
              paddingLeft: '4%',
              paddingBottom: 10,
            }}>
            {userInfo?.strUrl === arlURL ? (
              <TouchableOpacity
                onPress={() => {
                  handleSwitchBoardData(item?.EmployeeId);
                }}
                style={styles.chatAndInfo}>
                <MIcon
                  name="link"
                  size={25}
                  color={COLORS.white}
                  style={{
                    transform: [{rotate: '135deg'}],
                  }}
                />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={() =>
                //@ts-ignore
                navigation.navigate('CreateAppreciate', {
                  empDetails: item,
                })
              }
              style={[styles.chatAndInfo, {marginLeft: 12}]}>
              <MIcon name="thumb-up-outline" size={25} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleThumsDown(item);
              }}
              style={[styles.chatAndInfo, {marginLeft: 12}]}>
              <MIcon
                name="thumb-down-outline"
                size={22}
                color={item?.isThumbsDown ? COLORS.yellow : COLORS.white}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('SendMsgToEmployee', {});
                if (item?.Phone) {
                  Linking.openURL(`sms:${item?.Phone}?body=`);
                } else {
                  toaster.show({message: 'Phone no is empty.', type: 'error'});
                }
              }}
              style={[styles.chatAndInfo, {marginLeft: 12}]}>
              <Icon name="chat" size={25} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                navigation.navigate('EployeeDirectoryDetails', {
                  employeeDetails: item || '',
                });
              }}
              style={[styles.chatAndInfo, {marginLeft: 12}]}>
              <Icon name="info" size={25} color={COLORS.white} />
            </TouchableOpacity>

            {userInfo?.strUrl === arlURL && (
              <>
                <TouchableOpacity
                  onPress={() => createBookmark(item)}
                  style={[styles.chatAndInfo, {marginLeft: 12}]}>
                  <Icon
                    name="star"
                    size={25}
                    color={item?.isBookmarked ? COLORS.late : COLORS.white}
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
                    {
                      marginLeft: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <Icon name="notifications" size={25} color={COLORS.white} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    openMap(item?.presentAddress);
                  }}
                  style={[
                    styles.chatAndInfo,
                    {
                      marginLeft: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <MIcon name="map-marker" size={25} color={COLORS.white} />
                </TouchableOpacity>

                <View
                  style={{
                    width: 100,
                  }}
                />
              </>
            )}
          </ScrollView>
        ) : null}
      </TouchableOpacity>
    );
  };

  const handleSwitchBoardData = async (empIdd: number) => {
    setSwitchBoardData([]);
    //@ts-ignore
    refRBSheet1?.current?.open();
    const res = await getSwitchBoardData(empIdd, setIsLoading);
    setSwitchBoardData(res);
  };

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <>
          {isSearch && (
            <CustomHeader
              onLeftMenuPress={navigation.toggleDrawer}
              onBackPress={() => {
                navigation.goBack();
              }}
              alterIcon={'search'}
              alterIconPress={() => {
                setIsSearch(!isSearch);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              }}
              title="Employee Directory"
            />
          )}
        </>
      }
      style={[
        styles.container,
        {
          paddingBottom: contactData ? (!isSearch ? 0 : 0) : SIZES.height,
        },
      ]}>
      <View style={{marginTop: !isSearch ? 90 : 0}}>
        {!contactData || !contactData2 ? (
          <ActivityIndicator
            color={COLORS.primary}
            size={'small'}
            style={{
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
            }}
          />
        ) : null}
        <View>
          <FlatList
            ListFooterComponentStyle={{paddingBottom: 50}}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={20}
            data={employeeName?.length < 3 ? contactData : contactData2}
            ListHeaderComponent={() => <View />}
            ListHeaderComponentStyle={{
              paddingBottom: 10,
            }}
            ListFooterComponent={() => <View />}
            onEndReachedThreshold={0.5}
            renderItem={renderItem}
            //@ts-ignore
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>

      {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={employeeName}
          setInputText={setEmployeeName}
          // setState={() => {
          //   reset(defaultValue);
          //   getContactData(busId);
          // }}
          // isState
          // defaultValues={defaultValue}
        />
      )}

      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 2.5}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}>
        <View style={styles.pHorizontal}>
          <View style={styles.sheetHeader}>
            <View />
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.close()
              }>
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="agendaOfMeetMe"
              placeholder="Agenda Of Meet Me"
              label="Agenda Of Meet Me"
              rules={{required: true}}
            />

            <View
              style={{
                paddingTop: 16,
              }}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="schedule"
                placeholder="Arrival Time"
                label="Arrival Time"
                rules={{required: true}}
              />
            </View>

            <CustomButtonNew
              btnText="Send Meet Me"
              onBtnPress={handleSubmit(createMeetMeMsg)}
              btnstyle={styles.btn1}
              btnTextStyle={styles.btnText1}
            />
          </View>
        </View>
      </RBSheet>

      <RBSheet
        //@ts-ignore
        ref={refRBSheet1}
        width={SIZES.width}
        height={SIZES.height / 1.8}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}>
        <View style={styles.pHorizontal}>
          <View style={styles.sheetHeader}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '500',
                color: COLORS.textNewColor,
                paddingLeft: 8,
                alignSelf: 'center',
              }}>
              Switch Board
            </Text>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet1?.current?.close()
              }>
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter}>
            {switchBoardData?.length > 0 ? (
              <>
                {switchBoardData?.map((item: any, index: number) => (
                  <>
                    {item?.strSwitchBoardLink ? (
                      <TouchableOpacity
                        onPress={() => {
                          //@ts-ignore
                          refRBSheet1?.current?.close();
                          Linking.openURL(item?.strSwitchBoardLink);
                        }}
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'flex-start',
                          paddingVertical: 4,
                        }}>
                        <MIcon
                          name="link"
                          size={25}
                          color={COLORS.blue}
                          style={{
                            transform: [{rotate: '135deg'}],
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            fontWeight: '500',
                            color: COLORS.blue,
                            fontStyle: 'italic',
                            textDecorationLine: 'underline',
                            paddingLeft: 8,
                          }}>
                          {item?.strSwitchBoardName}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </>
                ))}
              </>
            ) : null}
          </View>
        </View>
      </RBSheet>
    </ContainerNew>
  );
});

export default EmployeeDirectoryFromHome;

const styles = StyleSheet.create({
  ...empDirectoryCommon,
});
