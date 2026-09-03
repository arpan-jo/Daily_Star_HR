import type React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, IMAGES} from '../../../../../../common/constant/Index';

const NoDataComponent: React.FC = () => (
  <View style={styles.noDataContainer}>
    <FastImage source={IMAGES.NoDataImage} style={styles.noDataImg} />
    <Text style={styles.noDataText}>No data found</Text>
  </View>
);

const styles = StyleSheet.create({
  noDataContainer: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  noDataImg: {
    width: 130,
    height: 90,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
});

export default NoDataComponent;
