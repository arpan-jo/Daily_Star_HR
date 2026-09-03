import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS} from '../common/constant/Themes';
import ContactsIndex from '../modules/arl-core-modules/EntryPoint/home/ContactsIndext';
import DialPadWithContacts from '../modules/arl-core-modules/EntryPoint/home/DialPadWithContacts';
import useThemeId from '../hooks/useThemeId';
import {t} from '../common/constant/i18n';

const {Navigator, Screen} = createMaterialBottomTabNavigator<any>();
const CallingBottomTab = () => {
  // Re-render on theme change so the tab tints below pick up the new
  // palette without remounting the navigator (which would reset the route).
  useThemeId();
  const {bottom} = useSafeAreaInsets();

  return (
    <Navigator
      sceneAnimationEnabled={true}
      initialRouteName="Dialpad"
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
        name="Dialpad"
        component={DialPadWithContacts}
        options={{
          tabBarLabel: t('tab.dialpad'),
          tabBarIcon: ({color, focused: _focused}) => (
            <Icon name={'dialpad'} color={color} size={26} />
          ),
        }}
      />
      <Screen
        name="Contacts"
        component={ContactsIndex}
        options={{
          tabBarLabel: t('tab.contacts'),
          tabBarIcon: ({color, focused}) => (
            <Icon
              name={focused ? 'contacts' : 'contacts-outline'}
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Navigator>
  );
};

export default CallingBottomTab;
