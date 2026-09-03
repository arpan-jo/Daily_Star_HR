import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/core';
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import {Avatar, Drawer} from 'react-native-paper';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcons from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../common/components/Container';
import {COLORS, IMAGES, SIZES} from '../common/constant/Index';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import ThemePicker from '../common/components/ThemePicker';
import LanguagePicker from '../common/components/LanguagePicker';
import {t} from '../common/constant/i18n';
import {clearAllStorage} from '../common/services/clearStorage';
import {getImageURL} from '../common/services/getImage';
import {deleteDeviceIdForMultipleId} from '../services/SaaS-modules/notification/notification';
import {useRootStore} from '../stores/rootStore';

const iconProps = {
  color: '',
  size: 0,
  focused: false,
};

const CustomDrawer = observer((propsOfRoute: any) => {
  const props = propsOfRoute?.props;
  const {userInfo, userInfoSave: _userInfoSave, logout} = useRootStore();
  // const [isDark, isSystem] = useIsDarkTheme();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [sectionOne, setSectionOne] = useState();
  const [sectionTwo, setSectionTwo] = useState();
  // const [isSubMenu, setIsSubMenu] = useState(false);
  const index = props?.state?.routes?.findIndex(x => x.name === 'Approval');
  const [, _setIsLoading] = useState(false);

  const [_url, _setUrl] = useState('');
  const [_isUpdate, _setIsUpdate] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      // VersionCheck.needUpdate().then(async res => {
      //   if (res?.isNeeded) {
      //     setUrl(res.storeUrl);
      //     setIsUpdate(true);
      //   } else {
      //     setUrl('');
      //     setIsUpdate(false);
      //   }
      // });

      const approve = props?.state?.routes?.filter(x => x.name === 'Approval');
      if (approve?.length === 0) {
        setSectionOne(props?.state?.routes);
      }

      if (approve?.length === 1) {
        const index2 = props?.state?.routes?.findIndex(
          x => x.name === 'Approval',
        );
        var section1 = props?.state?.routes?.slice(0, index2);
        setSectionOne(section1);
        var section2 = props?.state?.routes?.slice(index2);
        setSectionTwo(section2);
      }
    },
    [props?.state?.routes, isFocused],
  );

  const clearAll = async () => {
    const fcmtoken = await AsyncStorage.getItem('fcmtoken');
    try {
      await deleteDeviceIdForMultipleId(fcmtoken, userInfo?.intEmployeeId);
      logout();
      clearAllStorage();
      navigation.navigate('Login');
    } catch (_e) {
      // clear error
    }
  };

  return (
    <ContainerNew style={styles.drawer} edges={['bottom', 'left']}>
      <View style={styles.dot} />

      <Drawer.Section style={styles.container}>
        {userInfo?.intProfileImageUrl ? (
          <Avatar.Image
            style={styles.avatar}
            size={56}
            source={{
              uri: getImageURL(userInfo?.intProfileImageUrl),
            }}
          />
        ) : (
          <View style={styles.noImageBox}>
            <Image source={IMAGES.NoImage} style={styles.noImage} />
          </View>
        )}
        <View style={styles.contents}>
          <Text style={styles.title2}>{userInfo?.strDisplayName}</Text>
          <Text style={styles.title}>{userInfo?.strDesignation}</Text>
          {/* <TouchableOpacity>
            <Text style={styles.viewProfile}>View profile</Text>
          </TouchableOpacity> */}
        </View>
      </Drawer.Section>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Drawer.Section>
          <Text
            style={[
              styles.sectionTitle,
              {
                paddingTop: 10,
              },
            ]}>
            General
          </Text>
          {sectionOne && sectionOne?.length > 0 ? (
            <>
              {sectionOne?.map((route, i) => {
                return (
                  <Drawer.Item
                    style={[
                      styles.drawerItem,
                      {
                        backgroundColor:
                          props?.state?.index === i
                            ? COLORS.lightPrimary2
                            : COLORS.white,
                      },
                    ]}
                    key={route.key}
                    active={props?.state?.index === i}
                    //@ts-ignore
                    label={
                      <Text style={{color: COLORS.textNewColor}}>
                        {route?.name}
                      </Text>
                    }
                    icon={() => (
                      <MIcons
                        //@ts-ignore
                        name={
                          route?.key
                            ? props?.descriptors[
                                route?.key
                              ]?.options?.drawerIcon?.(iconProps)
                            : undefined
                        }
                        size={22}
                        style={styles.itemIcon}
                      />
                    )}
                    onPress={() => {
                      if (route.name !== 'EmptyScreen') {
                        props?.navigation.navigate(route?.name);
                      }
                    }}
                  />
                );
              })}
            </>
          ) : null}
        </Drawer.Section>
        {userInfo?.isSupNLMORManagement ? (
          <Drawer.Section>
            <Text style={[styles.sectionTitle]}>Admin</Text>
            {sectionTwo && sectionTwo?.length > 0 ? (
              <>
                {sectionTwo?.map((route, i) => {
                  return (
                    <Drawer.Item
                      style={[
                        styles.drawerItem,
                        {
                          backgroundColor:
                            props?.state?.index === i + index
                              ? COLORS.lightPrimary2
                              : COLORS.white,
                        },
                      ]}
                      key={route.key}
                      active={props?.state?.index === i + index}
                      //@ts-ignore
                      label={
                        <Text style={{color: COLORS.textNewColor}}>
                          {route?.name}
                        </Text>
                      }
                      icon={() => (
                        <MIcons
                          //@ts-ignore
                          name={
                            route?.key
                              ? props?.descriptors[
                                  route?.key
                                ]?.options?.drawerIcon?.(iconProps)
                              : undefined
                          }
                          size={22}
                          style={styles.itemIcon}
                        />
                      )}
                      right={() =>
                        route.name === 'Approval' && props?.approvalNum ? (
                          <Text style={styles.rightText}>
                            {props?.approvalNum}
                          </Text>
                        ) : null
                      }
                      onPress={() => {
                        if (route?.name !== 'EmptyScreen') {
                          props?.navigation.navigate(route?.name);
                        }
                      }}
                    />
                  );
                })}
              </>
            ) : null}
          </Drawer.Section>
        ) : null}

        <View style={styles.logout}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ChangePasswordMainIndex');
            }}>
            <View style={styles.logoutIconWrapper}>
              <Icons name="key-outline" size={24} color={COLORS.textNewColor} />
              <Text
                style={[
                  styles.logoutIconText,
                  {
                    fontSize: 14,
                    color: COLORS.textNewColor,
                  },
                ]}>
                Change Password
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* {!isUpdate ? (
          <View style={[styles.logout]}>
            <TouchableOpacity
              onPress={async () => {
                Linking.openURL(url);
              }}>
              <View style={styles.logoutIconWrapper}>
                <MIcons name="update" size={24} color={COLORS.blue} />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: Platform.OS ? '500' : 'bold',
                    paddingLeft: SIZES.width / 25,
                    color: COLORS.blue,
                  }}>
                  Update Now
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null} */}

        <ThemePicker />
        <LanguagePicker />

        <View
          style={[
            styles.logout,
            {
              marginTop: 22,
              marginBottom: 35,
            },
          ]}>
          <TouchableOpacity
            onPress={async () => {
              clearAll();
            }}>
            <View style={styles.logoutIconWrapper}>
              <Icons name="logout" size={24} color={COLORS.textNewColor} />
              <Text style={styles.logoutIconText}>{t('common.logout')}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* <Drawer.Section style={styles.footer}>
        <ToggleButton.Row
          style={styles.toggle}
          onValueChange={(value) => setUserColorScheme(value as any)}
          value={currentColorScheme}
        >
          <ToggleButton style={styles.togglebtn} icon="cog" value="auto" />
          <ToggleButton style={styles.togglebtn} icon="weather-sunny" value="light" />
          <ToggleButton style={styles.togglebtn} icon="weather-night" value="dark" />
          <Text style={styles.theme}>
            {isDark ? 'Dark' : 'Light'} ({isSystem ? 'System' : 'User'})
          </Text>
        </ToggleButton.Row>
      </Drawer.Section> */}
      </ScrollView>
    </ContainerNew>
  );
});

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    paddingTop: 10,
  },
  dot: {
    backgroundColor: COLORS.primary,
    height: 15,
    width: 15,
    borderWidth: 2,
    borderColor: COLORS.deepWhite,
    marginTop: 95,
    marginLeft: 55,
    position: 'absolute',
    borderRadius: 10,
    zIndex: 99999,
  },
  container: {
    paddingTop: 50,
    position: 'relative',
  },
  contents: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  avatar: {
    backgroundColor: 'transparent',
    paddingLeft: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  title2: {
    fontSize: 16,
    color: COLORS.textNewColor,
    fontWeight: '600',
    lineHeight: 24,
  },
  // viewProfile: {
  //   fontSize: 14,
  //   fontWeight: '500',
  //   lineHeight: 20,
  //   color: COLORS.movement,
  // },
  drawerItem: {
    height: 50,
    justifyContent: 'center',
    borderTopRightRadius: 99,
    borderBottomRightRadius: 99,
    marginRight: 16,
    borderWidth: 0,
    borderColor: COLORS.lightPrimary2,
    marginLeft: 0,
    // paddingLeft: 10,
    // marginTop: -10,
  },
  itemIcon: {marginRight: -2, color: COLORS.textNewColor},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
    color: COLORS.graySubText,
    paddingLeft: 18,
    paddingBottom: 16,
  },
  logout: {marginLeft: SIZES.width / 20, marginTop: 16},
  noImageBox: {
    height: 55,
    width: 55,
    backgroundColor: COLORS.lightGray,
    borderRadius: 100,
    marginLeft: 16,
  },
  noImage: {
    height: 48,
    width: 50,
    alignSelf: 'center',
    marginTop: 6.7,
    borderRadius: 100,
  },
  // footer: {
  //   marginTop: 'auto',
  //   paddingLeft: 5,
  // },
  // toggle: {
  //   alignItems: 'center',
  //   marginLeft: 9,
  // },
  // togglebtn: {
  //   borderWidth: 0,
  // },
  // theme: {
  //   marginLeft: 9,
  // },
  logoutIconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutIconText: {
    fontSize: 16,
    fontWeight: Platform.OS ? '500' : 'bold',
    paddingLeft: SIZES.width / 25,
    color: COLORS.textNewColor,
  },
  // backSubMenu: {
  //   flexDirection: 'row',
  //   paddingVertical: 10,
  //   paddingRight: 20,
  //   justifyContent: 'space-between',
  // },
  // menu: { fontSize: 18, color: 'black', paddingVertical: 2 },
  // drwMenu: { fontSize: 16 },
  rightText: {
    color: COLORS.textNewColor,
    fontWeight: '600',
    fontSize: 14,
    paddingRight: 5,
  },
});

export default CustomDrawer;
