import {StyleSheet} from 'react-native';
import {commonApprovalMainIndexStyle} from '../../../../common/commonStyle/commonApprovalMainIndexStyle';
import {COLORS} from '../../../../common/constant/Themes';

export const commonPRLanStyle = StyleSheet.create({
  ...commonApprovalMainIndexStyle,
  sbu: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  cardText: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
  },
});

