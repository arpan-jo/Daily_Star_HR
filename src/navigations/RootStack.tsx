import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import React, { lazy } from 'react';
import { RootStackScreensParams } from './RootStackScreensParams';
import { arlCoreStack } from './ArlScreenCollections';
import { saasModuleStack } from './SaasScreenCollections';

const Loader = lazy(() => import('../auth/Loader'));
const Login = lazy(() => import('../auth/Login'));

const ARLDrawer = lazy(() => import('./ArlDrawer'));
const Drawer = lazy(() => import('./Drawer'));
const HrCoreBottomTab = lazy(() => import('./HrCoreBottomTab'));
const CallingBottomTab = lazy(() => import('./CallingBottomTab'));

export const authStack = [
  { name: 'Loader', component: Loader },
  { name: 'Login', component: Login },
  { name: 'ArlDrawer', component: ARLDrawer },
  { name: 'EmpDrawer', component: Drawer },
  { name: 'HrCoreBottomTab', component: HrCoreBottomTab },
  { name: 'CallingBottomTab', component: CallingBottomTab },
];

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackScreensParams {}
  }
}
export type RootStackScreens = keyof RootStackScreensParams;

export type RootStackScreenProps<T extends RootStackScreens> =
  NativeStackScreenProps<RootStackScreensParams, T>;

const { Navigator, Screen } =
  createNativeStackNavigator<RootStackScreensParams>();

const rootStack = [...authStack, ...arlCoreStack, ...saasModuleStack];

const RootStack = () => {
  return (
    <Navigator
      initialRouteName="Loader"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {rootStack?.map((item: any, index) => (
        <Screen key={index} name={item?.name} component={item?.component} />
      ))}
    </Navigator>
  );
};

export default RootStack;
