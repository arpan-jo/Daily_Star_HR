import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../common/constant/Themes';
import HrCoreApplicationMainIndex from '../modules/arl-core-modules/hr-core/application/HrCoreApplicationMainIndex';
import HrCoreApprovalsMainIndex from '../modules/arl-core-modules/hr-core/approvals/HrCoreApprovalsMainIndex';
import HrCoreDashboardMainIndex from '../modules/arl-core-modules/hr-core/dashboard/HrCoreDashboardMainIndex';
import useThemeId from '../hooks/useThemeId';
import { t } from '../common/constant/i18n';

// export type HrCoreBottomTabScreens = keyof HrCoreBottomTabScreensParams;

// export interface BottomTabScreenProps<T extends HrCoreBottomTabScreens> {
//   navigation: CompositeNavigationProp<
//     MaterialBottomTabNavigationProp<HrCoreBottomTabScreensParams, T>,
//     CompositeNavigationProp<
//       DrawerNavigationProp<DrawerScreensParams>,
//       NativeStackNavigationProp<RootStackScreensParams>
//     >
//   >;
//   route: RouteProp<HrCoreBottomTabScreensParams, T>;
// }

const { Navigator, Screen } = createMaterialBottomTabNavigator();

const HrCoreBottomTab = () => {
  // Re-render on theme change so the tab tints below pick up the new
  // palette without remounting the navigator (which would reset the route).
  useThemeId();
  const { bottom } = useSafeAreaInsets();

  return (
    <Navigator
      sceneAnimationEnabled={true}
      initialRouteName="Dashboard"
      activeColor={COLORS.primary}
      inactiveColor={COLORS.graySubText}
      barStyle={{
        backgroundColor: COLORS.white,
        height: bottom > 0 ? 76 + bottom : 76,
      }}
      safeAreaInsets={{ bottom: bottom > 0 ? bottom : 10 }}
      labeled={true}
      shifting={false}
    >
      <Screen
        name="Dashboard"
        component={HrCoreDashboardMainIndex}
        options={{
          tabBarLabel: t('tab.dashboard'),
          tabBarIcon: ({ color, focused }: any) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="Application"
        component={HrCoreApplicationMainIndex}
        options={{
          tabBarLabel: t('tab.application'),
          tabBarIcon: ({ color, focused }: any) => (
            <Icon
              name={focused ? 'text-box' : 'text-box-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Screen
        name="Approval"
        component={HrCoreApprovalsMainIndex}
        options={{
          tabBarLabel: t('tab.approval'),
          tabBarIcon: ({ color, focused }: any) => (
            <Icon
              name={focused ? 'calendar-check' : 'calendar-check-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export default HrCoreBottomTab;
