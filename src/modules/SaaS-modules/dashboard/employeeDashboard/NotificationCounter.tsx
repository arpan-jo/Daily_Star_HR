import notifee from '@notifee/react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../../../common/constant/Themes';

const NotificationCounter = ({
  notificationCounter,
  setNorificationCounter,
}: any | null | undefined) => {
  const navigation = useNavigation();

  const count = +notificationCounter > 100 ? '99+' : notificationCounter;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={async () => {
        notifee
          .setBadgeCount(0)
          .then(() => console.log('Badge count removed!'));
        await setNorificationCounter(0);
        await notifee.cancelAllNotifications();
        navigation.navigate('NotificationIndex');
      }}>
      {notificationCounter > 0 ? (
        <View style={styles.notiBox}>
          <Text style={styles.notiStyle}>{count}</Text>
        </View>
      ) : null}

      <View style={styles.info}>
        <MIcon
          name={
            notificationCounter > 0 ? 'notifications-active' : 'notifications'
          }
          size={25}
          color={COLORS.white}
        />
      </View>
    </TouchableOpacity>
  );
};

export default NotificationCounter;

const styles = StyleSheet.create({
  info: {
    marginRight: 20,
  },
  notiBox: {
    backgroundColor: 'red',
    height: 23,
    width: 23,
    borderRadius: 50,
    position: 'absolute',
    top: -10,
    zIndex: 9999,
    justifyContent: 'center',
    marginLeft: 13,
  },
  notiStyle: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
  },
});
