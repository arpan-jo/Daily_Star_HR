/* eslint-disable react/no-unstable-nested-components */
import NetInfo from '@react-native-community/netinfo';
import {
  createDrawerNavigator,
  DrawerScreenProps,
} from '@react-navigation/drawer';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import ArlBottomTab from './ArlBottomTab';
import CustomDrawer from './CustomDrawer';
import { RootStackScreensParams } from './RootStackScreensParams';
// import {RootStackScreensParams} from './RootStack';

export type ARLDrawerScreensParams = {
  ArlBottomTab: undefined;
};

export type ARLDrawerScreens = keyof ARLDrawerScreensParams;

export type ARLDrawerScreenProp<T extends ARLDrawerScreens> =
  CompositeScreenProps<
    DrawerScreenProps<ARLDrawerScreensParams, T>,
    NativeStackScreenProps<RootStackScreensParams>
  >;

const {Navigator, Screen} = createDrawerNavigator<ARLDrawerScreensParams>();

const ARLDrawer = () => {
  const unsubscribe = NetInfo.addEventListener(() => {});
  // Unsubscribe
  unsubscribe();

  return (
    <Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        lazy: true,
        drawerStyle: styles.drawer,
        swipeEnabled: false,
      }}>
      <Screen
        name="ArlBottomTab"
        component={ArlBottomTab}
        options={{drawerIcon: () => 'dashboard', title: 'Bottom Tab'}}
      />
    </Navigator>
  );
};

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
});

export default ARLDrawer;
