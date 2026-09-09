import {StyleSheet} from 'react-native';
import {COLORS} from '../../../common/constant/Themes';

export const rqDetailsStyle = StyleSheet.create({
  mainDetails: {
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    padding: 16,
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
  },
  topBottomTextContainer: {
    paddingLeft: 12,
  },
  topBoxItemText: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.newGray,
  },
  chipStyle: {
    fontSize: 11,
    color: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 50,
    fontWeight: '500',
  },
  rfqItemContainer: {
    marginTop: 4,
  },
  rfqItemBox: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.newGray,
  },
  addIcon: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '500',
    paddingLeft: 8,
  },
  addedItemContainer: {
    paddingTop: 8,
  },
  otherInfoContainer: {
    marginVertical: 8,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  mBottom8: {
    marginBottom: 8,
  },
  bBottomWidth0: {
    borderBottomWidth: 0,
  },
  btmBtnStyle: {
    width: '92%',
    elevation: 0,
  },
});
