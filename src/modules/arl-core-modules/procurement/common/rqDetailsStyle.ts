import {StyleSheet} from 'react-native';
import {COLORS} from '../../../../common/constant/Themes';

export const rqDetailsStyle = StyleSheet.create({
  mainDetails: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  rowWrapper: {
    marginTop: 16,
  },
  rowElement: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    color: COLORS.graySubText,
    padding: 6,
    backgroundColor: COLORS.newGray,
    borderRadius: 50,
    textAlign: 'center',
  },
  topBottomTextContainer: {
    paddingLeft: 12,
    paddingTop: 2,
  },
  topBoxItemText: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.newGray,
  },
  btmBtnStyle: {
    width: '92%',
    elevation: 0,
  },
});

