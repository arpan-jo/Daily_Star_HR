import notifee from '@notifee/react-native';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  GetAllNotificationByUser,
  MarkAsSeen,
  MillRulesApproval,
} from '../../../common/api/api';
import ContainerNew from '../../../common/components/Container';
import CustomFlatList from '../../../common/components/CustomFlatList';
import CustomHeader from '../../../common/components/CustomHeader';
import NoData from '../../../common/components/NoData';
import { httpRequest } from '../../../common/constant/httpRequest';
import { COLORS } from '../../../common/constant/Themes';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import { AllNotificationDetailsType } from '../../../interfaces/notification/notification';
import { useRootStore } from '../../../stores/rootStore';
import CustomTextNew from '../../../common/components/CustomText';
import { _todayDateTime } from '../../../common/services/todayDate';

import { useToast } from '../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'bottom', 'left'];

const NotificationIndex = () => {
  const route = useRoute();
  //@ts-ignore
  const leaveDetails = route?.params?.leaveDetails;
  const { userInfo } = useRootStore();
  const navigation = useNavigation();
  const [allNotifications, setAllNotifications] =
    useState<AllNotificationDetailsType[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isFocused = useIsFocused();
  const [_isModalShow, _setIsModalShow] = useState(false);
  const [singleItem, setSingleItem] = useState('');
  const toaster = useToast();
  // console.log(JSON.stringify(singleItem, null, 2));
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      await notifee.cancelAllNotifications();
      geAlltNotification();
    },
    [currentPage, isFocused],
  );

  const geAlltNotification = async () => {
    if (leaveDetails?.notificationId) {
      const api_params = {
        url: MarkAsSeen,
        data: {
          notificationId: leaveDetails?.notificationId,
          employeeId: userInfo?.intEmployeeId,
          accountId: userInfo?.intAccountId,
        },
        method: 'put',
        isPostOrPutWithParams: true,
      };
      const _res = await httpRequest(api_params, () => {});
    }
    const api_params = {
      url: GetAllNotificationByUser,
      data: {
        employeeId: userInfo?.intEmployeeId,
        accountId: userInfo?.intAccountId,
        pageSize: 30,
        pageNo: currentPage,
        // isSeen=true / false/ null
        isSeen: '',
      },
      // isConsole: true,
    };
    const res = await httpRequest(api_params, setIsLoading);

    const modifiedResponse = res?.map((item: any) => {
      return {
        ...item,
        isSeen: item?.isSeenRealTimeNotify,
        notifyTitle:
          item?.strRealTimeNotifyTitle?.trim() || item.notifyTitle?.trim(),
        notificationMaster: {
          ...item?.notificationMaster,
          ...item?.notification,
          ...item?.leaveApplication,
          intFeatureTableAutoId:
            item?.notification?.intFeatureTableAutoId ||
            item?.notificationMaster?.intFeatureTableAutoId ||
            item?.leaveApplication?.intApplicationId,
          intDocumentFileId: item?.leaveApplication?.intDocumentFileId,
          intEmployeeId:
            item?.intEmployeeId ||
            item?.notificationMaster?.intEmployeeId ||
            item?.leaveApplication?.intEmployeeId,
          isSeen: item?.notification?.isSeenRealTimeNotify,
        },
      };
    });
    setAllNotifications((prevData: any) =>
      currentPage === 1 ? modifiedResponse : [...prevData, ...modifiedResponse],
    );
  };

  const getIcon = (ic: string) => {
    if (ic === 'Leave Application') {
      return 'luggage';
    } else if (ic === 'Movement Application') {
      return 'directions-car';
    } else if (ic === 'Meet Me') {
      return 'notifications';
    } else {
      return 'settings';
    }
  };

  const isMarkSeen = async (item: any) => {
    const api_params = {
      url: MarkAsSeen,
      data: {
        notificationId: item?.id || item?.intId,
        employeeId: userInfo?.intEmployeeId,
        accountId: userInfo?.intAccountId,
      },
      method: 'put',
      isPostOrPutWithParams: true,
    };
    const _res = await httpRequest(api_params, () => {});
    geAlltNotification();
  };

  const getDaysDifference = createdAt => {
    const today = _todayDateTime();
    const createdDate = new Date(createdAt);
    const difference = Math.floor(
      (today - createdDate) / (1000 * 60 * 60 * 24),
    );
    return difference;
  };

  const formatNotificationText = createdAt => {
    const daysDifference = getDaysDifference(createdAt);

    if (daysDifference === 0) {
      return 'Today';
    } else if (daysDifference <= 7) {
      return 'Last 7 days';
    } else {
      return 'Earlier';
    }
  };

  const findNotificationIndices = () => {
    let firstIndexWithin7Days = -1;
    let firstIndexEarlier = -1;
    let firstTodayIndex = -1;

    allNotifications?.some((item, index) => {
      const daysDifference = getDaysDifference(item.dteCreateAt);
      if (daysDifference === 1 && firstTodayIndex === -1) {
        firstTodayIndex = index;
      }
      if (daysDifference <= 7 && firstIndexWithin7Days === -1) {
        firstIndexWithin7Days = index;
      }
      if (daysDifference > 7 && firstIndexEarlier === -1) {
        firstIndexEarlier = index;
      }

      return firstIndexWithin7Days !== -1 && firstIndexEarlier !== -1;
    });

    return { firstIndexWithin7Days, firstIndexEarlier, firstTodayIndex };
  };

  const _milRule = async (status, id) => {
    const payload = {
      ruleId: singleItem?.notificationMaster?.intFeatureTableAutoId,
      approvalStatus: id,
      approvalStatusName: status,
      approvedBy: userInfo?.intEmployeeId,
    };
    const api_params = {
      url: MillRulesApproval,
      data: payload,
      method: 'post',
      // isConsole: true,
      // isConsoleParams: true,
      // isEncrypted: true,
    };
    const res = await httpRequest(api_params, () => {});
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode === 200
    ) {
      toaster.show({
        message:
          res?.message || `${id === 1 ? 'Approve' : 'Reject'} Successfully`,
        type: 'success',
      });
      setSingleItem('');
      navigation.goBack();
    } else {
      setSingleItem('');
      toaster.show({
        message: res?.message || 'Something Went Wrong!',
        type: 'warning',
      });
    }
  };

  const renderItem = ({ item, index }: any) => {
    const navigateToScreen = () => {
      if (item?.notifyTitle?.trim() === 'Leave Application') {
        isMarkSeen(item);
        navigation.navigate('LeaveNewApprovalDetails', {
          leaveDetails: item,
        });
      } else if (item?.notifyTitle?.trim() === 'Movement Application') {
        isMarkSeen(item);
        navigation.navigate('MovementNewApprovalDetails', {
          leaveDetails: item,
        });
      } else if (item?.feature?.trim() === 'emp_meeting_agenda') {
        isMarkSeen(item);
        navigation.navigate('ApprovalsMeetingAgenda', {
          meetingDetails: item,
          meetingId: item.notificationMaster?.intFeatureTableAutoId,
          agendaId: item.notificationMaster?.intEmployeeId,
          notifyTitle: item.notifyTitle,
        });
      } else if (
        item?.module?.trim() === 'MillRule' ||
        item?.module?.trim() === 'Mill Rule'
      ) {
        // setSingleItem(item);
        isMarkSeen(item);
        // setIsModalShow(true);
        navigation.navigate('MillRuleApproval', item);
      } else if (item?.notifyTitle === 'Social Engagement') {
        Linking.openURL(
          item?.strRealTimeNotifyDetails?.trim() || item.notifyDetails?.trim(),
        );
      } else {
        isMarkSeen(item);
      }
    };

    const _isWithinLastSevenDays = givenDate => {
      const given = new Date(givenDate);
      const todayDate = _todayDateTime();
      const timeDifference = todayDate - given;
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      return dayDifference <= 7 && dayDifference >= 0;
    };

    return (
      <View key={index}>
        {/* {!isWithinLastSevenDays(item?.createdAt) ? (
          <CustomTextNew text={'hello'} />
        ) : null} */}

        {index === findNotificationIndices()?.firstIndexWithin7Days ||
        index === findNotificationIndices()?.firstIndexEarlier ||
        index === findNotificationIndices()?.firstTodayIndex ? (
          <View style={{ marginLeft: 16, paddingVertical: 5 }}>
            <CustomTextNew
              text={`${formatNotificationText(item?.dteCreateAt)}`}
              lineHight={20}
              txtColor={COLORS.black}
              txtWeight={'500'}
            />
          </View>
        ) : null}

        <TouchableOpacity
          onPress={navigateToScreen}
          style={[
            styles.box,
            {
              backgroundColor:
                !allNotifications[index]?.isSeen ||
                !allNotifications[index]?.notificationMaster?.isSeen
                  ? COLORS.lightPrimary2
                  : COLORS.white,
            },
          ]}
        >
          <View style={styles.imagePart}>
            <View
              style={[
                styles.icon,
                {
                  backgroundColor:
                    !allNotifications[index]?.isSeen ||
                    !allNotifications[index]?.notificationMaster?.isSeen
                      ? COLORS.lightPrimary2
                      : COLORS.bar,
                },
              ]}
            >
              <MIcon
                name={getIcon(
                  item?.strRealTimeNotifyTitle?.trim() ||
                    item.notifyTitle?.trim(),
                )}
                size={25}
                color={COLORS.iconColor}
              />
            </View>
          </View>
          <View style={[styles.txtPart]}>
            <View style={styles.textPart}>
              <View
                style={{
                  width: '70%',
                }}
              >
                <Text style={[styles.title]}>
                  {item?.strRealTimeNotifyTitle?.toUpperCase() ||
                    item.notifyTitle?.toUpperCase()}
                </Text>
              </View>
              <View
                style={{
                  width: '30%',
                  alignItems: 'flex-end',
                }}
              >
                <Text style={styles.time}>{item.timeDifference}</Text>
              </View>
            </View>
            <Text style={styles.txtDetails}>
              {item?.strRealTimeNotifyDetails?.trim() ||
                item.notifyDetails?.trim()}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.bar} />
      </View>
    );
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <CustomHeader onBackPress={navigation.goBack} title="Notification" />
      }
    >
      <NoData data={allNotifications?.length} />
      <View style={styles.main}>
        <CustomFlatList
          data={allNotifications}
          RenderItems={renderItem}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          isLoading={isLoading}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
        />
      </View>

      {/* <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => milRule('Approve', 1)}
        onCancelPressCallApi={() => milRule('Reject', 2)}
        cancelText="Reject"
        modalText={'Are you want to approve or reject?'}
        deleteText={'Approve'}
      /> */}
    </ContainerNew>
  );
};

export default NotificationIndex;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  box: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  imagePart: {
    width: '15%',
  },
  txtPart: {
    width: '85%',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textNewColor,
    lineHeight: 18,
  },
  txtDetails: {
    fontSize: 14,
    color: COLORS.graySubText,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textNewColor,
    lineHeight: 18,
  },
  bar: { height: 1, backgroundColor: COLORS.lightGray5 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  textPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
