import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import {
  getStatusBgColor,
  getStatusColor,
} from '../../../../common/services/getColor';
import { useRootStore } from '../../../../stores/rootStore';
import {
  AttendanceAdjustmentFilterType,
  TimeAdjustmentType,
} from '../../../../interfaces/attendance/attendance';
// OLD API service (kept for reference, replaced by AttendanceAdjustmentFilter)
// import { getTimeAdjustmentLanding } from '../../../../services/SaaS-modules/attendance/attendance';
import CustomHeader from '../../../../common/components/CustomHeader';
import { COLORS } from '../../../../common/constant/Themes';
import { date_formater } from '../../../../common/services/dateFormater';
import { IMAGES } from '../../../../common/constant/Index';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { AttendanceAdjustmentFilter } from '../../../../common/api/api';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { _todayDate } from '../../../../common/services/todayDate';

const edges: Edge[] = ['right', 'bottom', 'left'];

export const getColor = (
  isPresent: boolean,
  isLate: boolean,
  isAbsent: boolean,
  isOffday: boolean,
  isHoliday: boolean,
  isLeave: boolean,
  isMovement: boolean,
) => {
  if (isPresent && !isLate) {
    return COLORS.primary;
  }
  if (isLate) {
    return '#B54708';
  }
  if (isAbsent) {
    return '#D92D20';
  }
  if (isLeave) {
    return '#BA24D5';
  }
  if (isMovement) {
    return '#155EEF';
  }
  if (isOffday) {
    return '#667085';
  }
  if (isHoliday) {
    return '#4E5BA6';
  }
};

interface props {
  route?: any;
}

const AttendanceAdjustmentMainIndex = ({ route }: props) => {
  const employeeData = route?.params?.employeeData;

  const currentYear = dayjs().year();
  const currentMonth = dayjs().month();
  const monthName = dayjs().format('MMMM');
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const [isLoading, setIsLoading] = useState();
  // list can hold both old (TimeAdjustmentType) & new (AttendanceAdjustmentFilterType) shape
  const [attAdjustLanding, setAttAdjustLanding] =
    useState<Array<TimeAdjustmentType & AttendanceAdjustmentFilterType>>();
  const isFocused = useIsFocused();

  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;
  const buId =
    employeeData?.profileData?.employeeProfileLandingView?.intBusinessUnitId ||
    userInfo?.intBusinessUnitId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      /* ---------------------- OLD API (commented out) ----------------------
      const res = await getTimeAdjustmentLanding(
        buId,
        employeeId,
        currentYear,
        currentMonth + 1,
        setIsLoading,
      );
      setAttAdjustLanding(res);
      --------------------------------------------------------------------- */
      await getAttendanceAdjustmentUpdated();
    },
    [isFocused, employeeData?.EmployeeId],
  );

  const getAttendanceAdjustmentUpdated = async () => {
    const payload = {
      employeeId: employeeId,
      workplaceGroupId: userInfo?.intWorkplaceGroupId,
      accountId: userInfo?.intAccountId,
      businessUnitId: buId,
      yearId: currentYear,
      monthId: currentMonth + 1,
      applicationDate: null,
      attendanceStatus: 'all',
      punchStatus: 'all',
      attendanceDate: _todayDate(),
      dteAttendanceFromDate: _todayDate(),
      attendanceToDate: null,
      jobTypeId: 0,
      pageNo: 1,
      pageSize: 25,
    };
    const api_params = {
      url: AttendanceAdjustmentFilter,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, setIsLoading);
    setAttAdjustLanding(res || []);
  };

  return (
    <ContainerNew
      edges={edges}
      isRefresh={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Attendance Adjustment"
        />
      }
      style={styles.container}
    >
      {attAdjustLanding && attAdjustLanding?.length > 0 ? (
        <View>
          <Text style={styles.stackBarTitle}>{monthName}</Text>
          {attAdjustLanding?.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                if (item?.ApplicationStatus) {
                  //@ts-ignore
                  navigation.navigate('AttendanceAdjustmentDetails', {
                    attDetails: item,
                  });
                }
              }}
              key={index}
              style={styles.leaveCard}
            >
              <View style={styles.leaveTextPart}>
                <View style={styles.dateContainer}>
                  <MIcon
                    name="perm-contact-calendar"
                    size={30}
                    color={COLORS.primary}
                  />
                  <View style={styles.middleTxt}>
                    <View style={styles.flexRow}>
                      <Text style={styles.titleTxt}>
                        {`${date_formater(
                          item?.dteAttendanceDate || item?.AttendanceDate,
                        )} (${dayjs(
                          item?.dteAttendanceDate || item?.AttendanceDate,
                        ).format('ddd')})`}
                      </Text>

                      <Text
                        style={[
                          styles.status,
                          {
                            color: getStatusColor(item?.ApplicationStatus),
                            backgroundColor: getStatusBgColor(
                              item?.ApplicationStatus,
                            ),
                          },
                        ]}
                      >
                        {item?.ApplicationStatus}
                      </Text>
                    </View>
                    <View style={styles.bottomTxt}>
                      <Text style={styles.textBottom}>
                        In {item?.InTime || '---'}
                      </Text>
                      <View style={styles.divider} />
                      <Text style={styles.textBottom}>
                        Out {item?.OutTime || '---'}
                      </Text>

                      <>
                        <View style={styles.divider} />
                        <View>
                          <Text
                            style={[
                              styles.textBottom,
                              {
                                color: getColor(
                                  item?.isPresent,
                                  item?.isLate,
                                  item?.isAbsent,
                                  item?.isOffday,
                                  item?.isHoliday,
                                  item?.isLeave,
                                  item?.isMovement,
                                ),
                              },
                            ]}
                          >
                            {item?.isLate && ' Late |'}
                            {item?.isPresent && !item?.isLate && ' Present |'}
                            {item?.isAbsent && ' Absent |'}
                            {item?.isOffday && ' Off Day |'}
                            {item?.isHoliday && ' Holiday |'}
                            {item?.isLeave && ' Leave |'}
                            {item?.isMovement && ' Movement |'}
                          </Text>
                        </View>
                      </>
                    </View>
                    {item?.ApplicationStatus === 'Pending' ? (
                      <Text style={styles.textRequest}>
                        Request send for{' '}
                        {item?.strRequestStatus || item?.RequestStatus}{' '}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View>
                  {(item.isLate && !item?.ApplicationStatus) ||
                  (item?.isAbsent && !item?.ApplicationStatus) ? (
                    <View>
                      <MIcon
                        onPress={() => {
                          navigation.navigate('CreateAttendanceAdjustment', {
                            application: item,
                          });
                        }}
                        style={styles.plusBtn}
                        name="add"
                        size={25}
                        color={COLORS.iconColor}
                      />
                    </View>
                  ) : null}
                </View>
              </View>

              {/* <View>
                    <Text
                      style={[
                        styles.status,
                        {
                          color: getStatusColor(item?.ApplicationStatus),
                          backgroundColor: getStatusBgColor(item?.ApplicationStatus),
                        },
                      ]}
                    >
                      {item?.ApplicationStatus}
                    </Text>
                  </View> */}
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noData}>
          <FastImage source={IMAGES.NoDataImage} style={styles.fastImage} />
          <Text style={styles.noDataText}>No data found</Text>
        </View>
      )}
      {isLoading ? (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={styles.loadingActivity}
        />
      ) : null}

      <View style={styles.paddingBotton} />
    </ContainerNew>
  );
};

export default AttendanceAdjustmentMainIndex;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: COLORS.white },
  leaveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 8,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  bottomTxt: {
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 8,
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 12,
    marginLeft: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
  noData: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  fastImage: { width: 130, height: 90 },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  middleTxt: {
    marginLeft: 20,
  },
  textBottom: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  textRequest: {
    paddingTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  divider: {
    borderLeftWidth: 1,
    marginHorizontal: 5,
    borderLeftColor: COLORS.graySubText,
  },
  stackBarTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
    paddingTop: 16,
  },
  plusBtn: {
    display: 'flex',
    alignSelf: 'center',
    padding: 16,
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  paddingBotton: {
    paddingBottom: 200,
  },
  loadingActivity: {
    paddingTop: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '85%',
    alignItems: 'center',
  },
});
