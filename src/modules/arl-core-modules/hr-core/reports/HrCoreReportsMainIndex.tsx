import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';

const edges: Edge[] = ['right', 'left'];

const HrCoreReportsMainIndex = () => {
  const navigation = useNavigation();

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          title="Reports"
          alterIcon={'widgets'}
          alterIconPress={() => navigation.goBack()}
        />
      }
      style={styles.container}>
      <View style={styles.centerContainer}>
        <FastImage source={IMAGES.NoDataImage} style={styles.image} />
        <CustomTextNew text={'No Data Found'} txtAlign={'center'} />
      </View>
    </ContainerNew>
  );
};

export default HrCoreReportsMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingTop: 6,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 130,
    height: 90,
    marginBottom: 10,
  },
});

