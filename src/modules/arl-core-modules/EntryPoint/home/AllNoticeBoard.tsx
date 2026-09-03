import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {COLORS, IMAGES} from '../../../../common/constant/Index';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {NoticeType} from '../../../../interfaces/dashboard/employeeDashboard';
import {getAllAnnouncement} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../stores/rootStore';
const currentYear = dayjs().year();

const AllNoticeBoard = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [allNoticeBoard, setAllNoticeBoard] = useState<NoticeType[]>();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const allNottice = await getAllAnnouncement(
        userInfo?.intAccountId,
        userInfo?.intEmployeeId,
        userInfo?.intBusinessUnitId,
        currentYear,
        userInfo?.intWorkplaceGroupId,
      );
      if (allNottice) {
        setAllNoticeBoard(allNottice);
      }
    },
    [isFocused],
  );
  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}> Notice Board </Text>
      {allNoticeBoard && allNoticeBoard?.length > 0 ? (
        <>
          {allNoticeBoard?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() =>
                //@ts-ignore
                navigation.navigate('NoticeDetails', {
                  item: item,
                })
              }>
              <View style={styles.fDRow}>
                <FastImage
                  source={IMAGES.NoticeImage}
                  style={styles.noticeImageStyle}
                />
                <View style={styles.w88}>
                  <Text style={styles.notificationTitle}>{item?.strTitle}</Text>
                  <Text style={styles.noticeSubText}>
                    {date_formater(item?.dteCreatedAt)}
                  </Text>
                  <View
                    style={[styles.borderBottomWidth, styles.mVertical10]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </>
      ) : (
        <View style={styles.alignSelfCenter}>
          <FastImage
            source={IMAGES.NoDataImage}
            style={styles.fastImageStyle}
          />
          <Text style={styles.noDataText}> No data found </Text>
        </View>
      )}
    </View>
  );
};

export default observer(AllNoticeBoard);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  containerMargin: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  leaveType: {
    width: '40%',
    paddingLeft: 16,
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
  noticeImageStyle: {
    width: 30,
    height: 30,
    marginRight: 12,
  },
  w88: {
    width: '88%',
  },
  notificationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  noticeSubText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    color: COLORS.graySubText,
    maxWidth: '88%',
  },
  fastImageStyle: {
    width: 130,
    height: 90,
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  mVertical10: {
    marginVertical: 10,
  },
  alignSelfCenter: {
    alignSelf: 'center',
  },
});
