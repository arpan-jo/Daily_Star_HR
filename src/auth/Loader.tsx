import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { arlURL } from '../../App';
import { COLORS, IMAGES, SIZES } from '../common/constant/Index';
import delay from '../common/services/delay';
import { RootStackScreenProps } from '../navigations/RootStack';
import { useRootStore } from '../stores/rootStore';
// import BootSplash from 'react-native-bootsplash';
import FastImage from 'react-native-fast-image';
import { wasOpenedFromNotification } from '../services/SaaS-modules/notification/notificationLaunch';

const Loader = observer<RootStackScreenProps<'Loader'>>(
  ({ navigation, route: _route }) => {
    const { hydrate, hydrated, userInfo } = useRootStore();

    // useEffect(() => {
    //   (async () => {
    //     try {
    //       const isVisible = await BootSplash.isVisible();
    //       if (isVisible) {
    //         await delay(500);
    //         await BootSplash.hide({fade: true});
    //         hydrate();
    //       } else if (!hydrated) {
    //         hydrate();
    //       }
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   })();
    // }, [hydrate, hydrated]);

    useEffect(() => {
      hydrate();
      if (hydrated) {
        delay(1000).then(() => {
          if (Platform.OS === 'ios' || wasOpenedFromNotification()) {
            if (userInfo?.token) {
              if (userInfo?.strUrl !== arlURL) {
                navigation.replace('EmpDrawer');
              } else {
                if (userInfo?.intUserTypeId === 1) {
                  navigation.replace('ArlDrawer');
                } else if (userInfo?.intUserTypeId === 2) {
                  navigation.replace('SupDrawer');
                }
              }
            } else {
              navigation.replace('Login');
            }
          } else {
            setTimeout(() => {
              if (userInfo?.token) {
                if (userInfo?.strUrl !== arlURL) {
                  navigation.replace('EmpDrawer');
                } else {
                  // if (Platform.OS === 'android') {
                  //   navigation.replace('Login');
                  // } else {
                  if (userInfo?.intUserTypeId === 1) {
                    navigation.replace('ArlDrawer');
                  } else if (userInfo?.intUserTypeId === 2) {
                    navigation.replace('SupDrawer');
                  }
                  // }
                }
              } else {
                navigation.replace('Login');
              }
            }, 8000);
          }
        });
      }
    }, [navigation, hydrated]);

    return (
      <View style={styles.center}>
        <FastImage style={styles.logo} source={IMAGES.animtaedLogo} />
      </View>
    );
  },
);

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    flex: 1,
    height: SIZES.height,
  },
  logo: {
    // height: SIZES.height / 3.2,
    // width: SIZES.width,
    height: 400,
    width: 400,
    alignSelf: 'center',
  },
});

export default Loader;
