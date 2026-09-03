import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../common/constant/Themes';
import HomeMainIndex from '../modules/arl-core-modules/EntryPoint/home/HomeMainIndex';
import ModulesMainIndex from '../modules/arl-core-modules/EntryPoint/modules/ModulesMainIndex';
import ArlApprovalMainIndex from '../modules/arl-core-modules/EntryPoint/approvals/ApprovalMainIndex';
import HRMoreMainIndex from '../modules/arl-core-modules/EntryPoint/more/MoreMainIndex';
import useThemeId from '../hooks/useThemeId';
import {t} from '../common/constant/i18n';

// export type ArlBottomTabScreens = keyof ArlBottomTabScreensParams;

// export interface BottomTabScreenProps<T extends ArlBottomTabScreens> {
//   navigation: CompositeNavigationProp<
//     MaterialBottomTabNavigationProp<ArlBottomTabScreensParams, T>,
//     CompositeNavigationProp<
//       DrawerNavigationProp<DrawerScreensParams>,
//       NativeStackNavigationProp<RootStackScreensParams>
//     >
//   >;
//   route: RouteProp<ArlBottomTabScreensParams, T>;
// }

// export type ArlBottomTabScreens = keyof (keyof ArlBottomTabScreensParams);

// export type BottomTabScreenProp<T extends ArlBottomTabScreens> =
//   CompositeScreenProps<
//     MaterialBottomTabScreenProps<ArlBottomTabScreensParams, T>,
//     DrawerScreenProp<'BottomTab'>
//   >;

const {Navigator, Screen} = createMaterialBottomTabNavigator<any>();
const ArlBottomTab = () => {
  // Re-render on theme change so the tab tints below pick up the new
  // palette without remounting the navigator (which would reset the route).
  useThemeId();
  const {bottom} = useSafeAreaInsets();

  return (
    <Navigator
      sceneAnimationEnabled={true}
      initialRouteName="Home"
      activeColor={COLORS.primary}
      inactiveColor={COLORS.graySubText}
      barStyle={{
        backgroundColor: COLORS.white,
        height: bottom > 0 ? 76 + bottom : 76,
      }}
      safeAreaInsets={{bottom: bottom > 0 ? bottom : 10}}
      labeled={true}
      shifting={false}>
      <Screen
        name="Home"
        component={HomeMainIndex}
        options={{
          tabBarLabel: t('tab.home'),
          tabBarIcon: ({color, focused}: any) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="Module"
        component={ModulesMainIndex}
        options={{
          tabBarLabel: t('tab.services'),
          tabBarIcon: ({color, focused}:any) => (
            <Icon
              name={focused ? 'widgets' : 'widgets-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="Approval"
        component={ArlApprovalMainIndex}
        options={{
          tabBarLabel: t('tab.approvals'),
          tabBarIcon: ({color, focused}:any) => (
            <Icon
              name={focused ? 'calendar-check' : 'calendar-check-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="More"
        component={HRMoreMainIndex}
        options={{tabBarLabel: t('tab.more'), tabBarIcon: 'menu'}}
      />
    </Navigator>
  );
};

export default ArlBottomTab;
