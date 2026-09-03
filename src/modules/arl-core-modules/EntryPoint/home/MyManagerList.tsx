import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {arlURL} from '../../../../../App';
import {COLORS, IMAGES} from '../../../../common/constant/Index';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {useRootStore} from '../../../../stores/rootStore';

const MyManagerList = ({empDashboardData}: any) => {
  const isFocused = useIsFocused();
  const {userInfo} = useRootStore();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      // console.log(userInfo);
    },
    [isFocused],
  );
  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}> My Manager </Text>
      <View style={styles.fDRow}>
        <View style={styles.w15}>
          {empDashboardData?.employeeDashboardViewModel
            ?.intSupervisorImageUrlId ? (
            <FastImage
              source={{
                uri: getImageURL(
                  empDashboardData?.employeeDashboardViewModel
                    ?.intSupervisorImageUrlId,
                ),
              }}
              style={styles.managerImage}
            />
          ) : (
            <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
          )}
        </View>
        <View style={styles.w85}>
          <Text style={styles.managerTitle}>
            {empDashboardData?.employeeDashboardViewModel?.supervisor}
            {`[${empDashboardData?.employeeDashboardViewModel?.supervisorEnroll}]`}
          </Text>
          <Text style={styles.managerText}> Supervisor </Text>
          <View style={[styles.borderBottomWidth, styles.mVertical10]} />
        </View>
      </View>
      {userInfo?.strUrl === arlURL ? (
        <View />
      ) : (
        <View style={styles.fDRow}>
          <View style={styles.w15}>
            {empDashboardData?.employeeDashboardViewModel
              ?.intDottedSupervisorImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    empDashboardData?.employeeDashboardViewModel
                      ?.intDottedSupervisorImageUrlId,
                  ),
                }}
                style={styles.managerImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
            )}
          </View>
          <View style={styles.w85}>
            <Text style={styles.managerTitle}>
              {empDashboardData?.employeeDashboardViewModel?.dottedSupervisor}
            </Text>
            <Text style={styles.managerText}> Dotted Supervisor </Text>
            <View style={[styles.borderBottomWidth, styles.mVertical10]} />
          </View>
        </View>
      )}
      <View style={styles.fDRow}>
        <View style={styles.w15}>
          {empDashboardData?.employeeDashboardViewModel
            ?.intLineManagerImageUrlId ? (
            <FastImage
              source={{
                uri: getImageURL(
                  empDashboardData?.employeeDashboardViewModel
                    ?.intLineManagerImageUrlId,
                ),
              }}
              style={styles.managerImage}
            />
          ) : (
            <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
          )}
        </View>
        <View style={styles.w85}>
          <Text style={styles.managerTitle}>
            {empDashboardData?.employeeDashboardViewModel?.lineManager}
            {`[${empDashboardData?.employeeDashboardViewModel?.lineManagerEnroll}]`}
          </Text>
          <Text style={styles.managerText}> Line Manager </Text>
        </View>
      </View>
    </View>
  );
};

export default observer(MyManagerList);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  fDRow: {
    flexDirection: 'row',
  },
  w15: {
    width: '15%',
  },
  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  w85: {
    width: '85%',
  },
  managerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  managerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  mVertical10: {
    marginVertical: 10,
  },
});
