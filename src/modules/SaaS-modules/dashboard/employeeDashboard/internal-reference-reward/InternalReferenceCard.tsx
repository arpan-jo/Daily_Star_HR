import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, SIZES} from '../../../../../common/constant/Themes';
import Column from '../../../../../common/components/Column';
import {IMAGES} from '../../../../../common/constant/Index';
import CustomTextNew from '../../../../../common/components/CustomText';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const InternalReferenceCard = () => {
  const nums = new Set();
  while (nums.size !== 6) {
    nums.add(Math.floor(Math.random() * 10) + 1);
  }
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
    },
    [isFocused],
  );

  return (
    <>
      <View
        style={{
          height: 2,
          backgroundColor: COLORS.bar,
        }}
      />
      <Column colStyle={styles.padding}>
        <Column style={styles.imagePart}>
          <FastImage source={IMAGES.GiftBox} style={styles.gImage} />
        </Column>
        <CustomTextNew
          text={'Internal Reference and Reward'}
          txtAlign={'center'}
          txtSize={16}
          lineHight={24}
          txtWeight={'500'}
          txtColor={COLORS.black}
        />
        <CustomTextNew
          text={
            'Make a customer for your company and earn a 5% reward from the agreement.'
          }
          txtAlign={'center'}
          txtSize={13}
          txtWeight={'400'}
          txtColor={'#667085'}
          padTop={8}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('InternalReferenceLanding')}
          style={{
            borderWidth: 1,
            borderColor: COLORS.primary,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            marginTop: 10,
            width: SIZES.width / 1.1,
          }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: COLORS.primary,
            }}>
            Make a Reference
          </Text>
        </TouchableOpacity>
      </Column>
    </>
  );
};
export default InternalReferenceCard;
const styles = StyleSheet.create({
  padding: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  gImage: {
    width: 80,
    height: 80,
    marginLeft: 10,
  },
  imagePart: {
    paddingBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
