import {StyleSheet, Platform} from 'react-native';
import {COLORS} from '../constant/Themes';

export const commonApprovalMainIndexStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  paddingHorizontl: {
    paddingHorizontal: 16,
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
  marginLeft: {
    marginLeft: 8,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 0.8,
    marginTop: 8,
    borderColor: COLORS.offDay,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderRadius: 3,
  },
});
