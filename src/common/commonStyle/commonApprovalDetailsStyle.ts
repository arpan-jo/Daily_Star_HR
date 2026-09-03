import {StyleSheet} from 'react-native';
import {COLORS} from '../constant/Themes';

export const commonApprovalDetailsStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  firstBtn: {
    backgroundColor: COLORS.newGray,
    borderColor: COLORS.offDay,
    borderWidth: 1,
  },
  firstBtnTxt: {
    color: COLORS.textColor,
    fontWeight: '600',
  },
});
