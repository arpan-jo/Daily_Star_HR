// components/TopBarItem.tsx
import React from 'react';
import {StyleSheet} from 'react-native';
import Row from './Row'; // update path as needed
import {COLORS} from '../constant/Themes';
import CustomTextNew from './CustomText';

type Props = {
  item: {title: string; isActive: boolean};
  index: number;
  onPress: (index: number) => void;
};

const TopBarItem = ({item, index, onPress}: Props) => {
  return (
    <Row
      isPressOn={false}
      onCardPress={() => onPress(index)}
      key={index}
      style={[
        styles.box,
        {
          borderBottomWidth: item?.isActive ? 4 : 0,
        },
      ]}>
      <CustomTextNew
        txtStyle={[
          styles.headText,
          {
            color: item?.isActive ? COLORS.white : COLORS.lightGray,
          },
        ]}
        text={item?.title}
      />
    </Row>
  );
};

const styles = StyleSheet.create({
  headText: {
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
    paddingBottom: 10,
  },
  box: {
    borderBottomColor: COLORS.white,
    paddingHorizontal: 12,
  },
});

export default TopBarItem;
