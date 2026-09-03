/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SIZES, COLORS} from '../../../../common/constant/Themes';
import {getMenuPermissionAPI} from '../../../../services/SaaS-modules/drawer/drawer';
import {useRootStore} from '../../../../stores/rootStore';
import DocInboxApproval from './docInboxApproval';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const DocInboxIndex = () => {
  const {userInfo} = useRootStore();
  const [isSelect, setIsSelect] = useState(true);
  const isFocused = useIsFocused();
  const refRBSheet = useRef();
  const [profileTopTab, setProfileTopTab] = useState([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);
      const modLeave = menuRes?.filter(
        (item: any) => item?.label === 'Document Management',
      );
      const profileMenu = modLeave[0]?.childList[1]?.childList?.map(
        (item: any, index: any) => {
          return {
            ...item,
            isShow: index === 0 ? true : false,
          };
        },
      );
      setProfileTopTab(profileMenu);
      setIsSelect(true);
    },
    [isFocused],
  );

  const topTabPress = async (index: any) => {
    setIsSelect(!isSelect);
    const modLeave = [...profileTopTab];
    const leaveMenu = modLeave?.map((item: any, ind: any) => {
      return {
        ...item,
        isShow: ind === index ? true : false,
      };
    });
    //@ts-ignore
    setProfileTopTab(leaveMenu);
  };
  return (
    <View style={{height: SIZES.height}}>
      <View style={styles.head}>
        {profileTopTab?.map((item: any, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            disabled={item?.isShow && item?.isShow}
            onPress={() => topTabPress(index)}
            style={[
              styles.headTab,
              {
                borderBottomWidth: item?.isShow ? 2 : 0,
                borderBottomColor: item?.isShow
                  ? COLORS.activeText
                  : COLORS.transparentText,
              },
            ]}>
            <Text
              style={[
                styles.text,
                {
                  color: item?.isShow
                    ? COLORS.activeText
                    : COLORS.transparentText,
                  fontWeight: item?.isShow ? 'bold' : 'normal',
                },
              ]}>
              {item?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.bar} />

      <ScrollView>
        {isSelect ? (
          <DocInboxApproval refRBSheet={refRBSheet} title="Approval" />
        ) : (
          <DocInboxApproval refRBSheet={refRBSheet} title="View" />
        )}
      </ScrollView>
    </View>
  );
};

export default DocInboxIndex;

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
  },
  headTab: {
    marginRight: 10,
  },
  text: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  bar: {height: 6, backgroundColor: COLORS.lightGray7, marginTop: 2},
});
