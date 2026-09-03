import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS, SIZES} from '../../../../../common/constant/Themes';
import {IMAGES} from '../../../../../common/constant/Index';

const EsgManagementMainIndex = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.main}>
      <View style={styles.textPart}>
        <Text style={styles.title}>ESG Score</Text>
        <Text style={styles.subTitle}>
          Unlocking continuous performance excellence
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // navigation.navigate('PerformanceLand');
            // performance route updated
            // navigation.navigate('PerformanceEntry');
            navigation.navigate('EsgManagement');
          }}>
          <Text style={styles.performance}>View Details</Text>
          <Icon
            name="arrow-right-alt"
            color={COLORS.white}
            size={25}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.imagePart}>
        <FastImage source={IMAGES.performance} style={styles.gImage} />
      </View>
    </View>
  );
};

export default EsgManagementMainIndex;
export const esgCommonIndex = StyleSheet.create({
  main: {
    backgroundColor: '#4E5BA6',
    padding: 16,
    flexDirection: 'row',
  },
  textPart: {
    width: '73.5%',
  },
  title: {
    color: COLORS.white,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },
  subTitle: {
    color: COLORS.white,
    lineHeight: 18,
    fontSize: 12,
    paddingVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
    width: SIZES.width / 2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  performance: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  icon: {
    paddingLeft: 10,
  },
  gImage: {
    width: 100,
    height: 60,
  },
  imagePart: {
    alignSelf: 'flex-end',
    paddingBottom: 25,
  },
});
const styles = StyleSheet.create({
  ...esgCommonIndex,
});
