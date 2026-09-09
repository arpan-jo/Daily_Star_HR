import {StyleSheet} from 'react-native'; // adjust path if needed
import {COLORS} from '../../../common/constant/Themes';
import {Platform} from 'react-native';

export const commonPRLanStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  // heading tab
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 16,
  },
  cardText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.graySubText,
    paddingVertical: 2,
  },
  iconStyle: {
    paddingRight: 4,
  },
  dotIcon: {
    paddingHorizontal: 4,
  },
  sbu: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  headMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    alignItems: 'center',
    paddingVertical: 8,
    // marginTop: Platform?.OS === 'ios' ? -300 : 24,
    paddingTop: Platform?.OS === 'ios' ? 60 : 10,
  },
  approveOrReject: {
    backgroundColor: COLORS.statusBar,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 100,
  },
  rejectApproveText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  isSearchTrue: {marginTop: 0},
  isSearchFalse: {marginTop: 90},
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  checkbox: {
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  label: {
    marginTop: 4,
    marginStart: 8,
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.white,
  },
  flexRow: {
    flexDirection: 'row',
  },
  marginLeft: {
    marginLeft: 8,
  },
  headerContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 8,
  },
});
