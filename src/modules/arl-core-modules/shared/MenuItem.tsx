import type React from 'react';
import {StyleSheet} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../common/components/Column';
import CustomTextNew from '../../../common/components/CustomText';
import Row from '../../../common/components/Row';
import {COLORS} from '../../../common/constant/Themes';

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
  textColor?: string;
  iconColor?: string;
  showBorder?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  showArrow = true,
  textColor,
  iconColor = '#667085',
  showBorder = true,
}) => {
  return (
    <Row rowStyle={styles.paddingHorizontalAndVertical} isPressOn={false}>
      <Column colWidth="100%">
        <Column
          isPressOn={false}
          onCardPress={onPress}
          colWidth="100%"
          style={styles.colDirection}>
          <Column colWidth="10%">
            <MIcon
              name={icon}
              style={[styles.iconStyles, {color: iconColor}]}
            />
          </Column>
          <Column colWidth="85%" colStyle={styles.colMarginTop}>
            <Row justify="space-between">
              <CustomTextNew text={title} txtColor={textColor} />
              {showArrow && (
                <MIcon name="arrow-forward-ios" color={textColor || '#000'} />
              )}
            </Row>
          </Column>
        </Column>
        {showBorder && <Column style={styles.bottomBorder} />}
      </Column>
    </Row>
  );
};

const styles = StyleSheet.create({
  paddingHorizontalAndVertical: {
    paddingHorizontal: 16,
  },
  colDirection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  bottomBorder: {
    height: 1,
    backgroundColor: COLORS.iconGrayBackground,
    marginTop: 10,
  },
  iconStyles: {
    fontSize: 24,
  },
  colMarginTop: {
    marginTop: 4,
  },
});

export default MenuItem;
