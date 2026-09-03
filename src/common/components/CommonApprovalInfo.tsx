import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../constant/Themes';

interface ApprovalDetailItemProps {
  iconName: string;
  label: string;
  value?: string | number | null;
  isLink?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  show?: boolean;
}

const ApprovalDetails: React.FC<ApprovalDetailItemProps> = ({
  iconName,
  label,
  value = '-',
  isLink = false,
  onPress,
  show = true,
}) => {
  if (!show) return null;

  const Container: React.ElementType = isLink ? TouchableOpacity : View;

  return (
    <Container onPress={onPress} activeOpacity={0.7}>
      <View style={styles.box}>
        <View style={styles.iconBox}>
          <MIcon
            name={iconName}
            size={25}
            color={COLORS.iconColor}
            style={styles.centerText}
          />
        </View>
        <View style={styles.textRightPart}>
          <Text style={styles.subText}>{label}</Text>
          <Text style={[styles.valueText, isLink && {color: COLORS.movement}]}>
            {value ?? '-'}
          </Text>
        </View>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  centerText: {textAlign: 'center'},
  textRightPart: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    paddingBottom: 8,
    marginBottom: 9,
  },
  subText: {
    fontSize: 13,
    color: COLORS.textGray,
  },
  valueText: {
    fontSize: 15,
    color: COLORS.textNewBold,
    fontWeight: '500',
  },
});

export default ApprovalDetails;
