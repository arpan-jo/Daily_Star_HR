/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';

import AttendanceCalendarIndex from '../../attendance-calendar/AttendanceCalendar';
import {
  GetTodayInformation,
  GetAttendanceSummary} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];
interface props {
  route: any;
}

const AttendanceDetails = ({route: {_params}}: props) => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [empDashboardData, setEmpDashboardData] = useState<any>();
  const [attendanceDetails, setAllDayDetailsData] = useState<any>();

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return;
    }
    const api_params = {
      url: GetTodayInformation,
      data: {employeeId: userInfo?.intEmployeeId},
    };
    const res = await httpRequest(api_params, () => {});
    setEmpDashboardData(res);

    const api_paramss = {
      url: GetAttendanceSummary,
      data: {employeeId: userInfo?.intEmployeeId},
      // isConsole: true,
    };
    const ress = await httpRequest(api_paramss, () => {});
    setAllDayDetailsData(ress);
  }, []);

  return (
    <ContainerNew
      edges={edges}
      header={
        <>
          <CustomHeader
            onBackPress={navigation.goBack}
            title="Attendance Details"
          />
        </>
      }
      style={styles.main}>
      {/* time calendar section */}
      <View style={styles.containerMargin}>
        <Text style={styles.myLeaveTitle}>Time Calendar</Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '10%'}}>
            <MIcon name="watch-later" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {empDashboardData?.workingPeriod || 'N/A'}
              {/* {empDashboardData?.employeeDashboardViewModel?.workingPeriod} */}
              {/* {time_count_down(
                empDashboardData?.employeeDashboardViewModel?.checkIn,
                empDashboardData?.employeeDashboardViewModel?.checkOut
              )} */}
            </Text>
            <Text style={styles.commonTextTitle}>Today Working Period</Text>
          </View>
        </View>
        <View
          style={[styles.borderBottomWidth, {marginTop: 10, marginBottom: 10}]}
        />
        <View style={{flexDirection: 'row'}}>
          <View style={{width: '10%'}}>
            <MIcon name="hourglass-bottom" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {`${timeFormaterToPmAm(
                empDashboardData?.calendarStartTime,
              )} - ${timeFormaterToPmAm(empDashboardData?.calendarEndTime)}`}
            </Text>
            <Text style={styles.commonTextTitle}>General Calendar</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      <AttendanceCalendarIndex
        allDayDetials={undefined}
        onMonthChangeEmpDate={() => {}}
        isIconWithTitle={true}
      />
      <View style={[styles.bar, {marginTop: 25}]} />

      <View style={{marginHorizontal: 16}}>
        <Text style={styles.myLeaveTitle}>In-Out time Details</Text>
        {/* <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
        >
          <View
            style={[
              {
                backgroundColor: COLORS.lightPrimary,
              },
              styles.status,
            ]}
          >
            <Text style={styles.statusText}>{`${
              attendanceDetails?.presentDays || 0
            } Present`}</Text>
          </View>
          <View style={[{ backgroundColor: COLORS.late }, styles.status]}>
            <Text>{`${attendanceDetails?.lateDays || 0} Late`}</Text>
          </View>
          <View style={[{ backgroundColor: COLORS.absent }, styles.status]}>
            <Text>{`${attendanceDetails?.absentDays || 0} Absent`}</Text>
          </View>
          <View style={[{ backgroundColor: COLORS.leave }, styles.status]}>
            <Text>{`${attendanceDetails?.leaveDays || 0} Leave`}</Text>
          </View>
          <View style={[{ backgroundColor: COLORS.movement }, styles.status]}>
            <Text>{`${attendanceDetails?.movementDays || 0} Movement`}</Text>
          </View>
        </View> */}

        {/* checkIn - checkout section */}
        <View
        // style={{ paddingTop: 10 }}
        >
          {attendanceDetails?.timeAttendanceDailySummaries?.length > 0 &&
            attendanceDetails?.timeAttendanceDailySummaries?.map(
              (item: any, index: any) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    width: '100%',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderRadius: 4,
                    borderColor: COLORS.borderBottom,
                    marginVertical: 6,
                    alignItems: 'center',
                  }}>
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 18,
                        color: COLORS.textNewColor,
                      }}>
                      {date_formater(item?.dteAttendanceDate)}
                    </Text>
                    <View style={{flexDirection: 'row', paddingTop: 21}}>
                      <View style={{paddingRight: 10}}>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 18,
                            color: '#2E90FA',
                          }}>
                          Check In
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 20,
                            color: COLORS.textNewColor,
                            fontWeight: '500',
                          }}>
                          {timeFormaterToPmAm(item?.tmeInTime)}
                        </Text>
                      </View>
                      <MIcon name="north" size={26} color={COLORS.iconColor} />
                    </View>
                  </View>

                  <View
                    style={{
                      height: 40,
                      backgroundColor: COLORS.borderBottom,
                      width: 1,
                    }}
                  />
                  <View>
                    <View
                      style={{
                        backgroundColor: COLORS.lightGray3,
                        borderRadius: 16,
                      }}>
                      <Text
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 5,
                          fontWeight: '500',
                          lineHeight: 18,
                          fontSize: 14,
                          color: COLORS.textNewColor,
                          textAlign: 'center',
                        }}>
                        {item?.strWorkingHours || 'N/A'}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingTop: 10,
                        alignSelf: 'center',
                      }}>
                      <View style={{paddingRight: 10}}>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 18,
                            color: '#F79009',
                          }}>
                          Check Out
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            lineHeight: 20,
                            color: COLORS.textNewColor,
                            fontWeight: '500',
                          }}>
                          {timeFormaterToPmAm(item?.tmeLastOutTime)}
                        </Text>
                      </View>
                      <MIcon name="south" size={26} color={COLORS.iconColor} />
                    </View>
                  </View>
                </View>
              ),
            )}
        </View>
      </View>
    </ContainerNew>
  );
};

export default AttendanceDetails;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.white,
    paddingTop: 16,
  },
  containerMargin: {marginHorizontal: 16},
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 10,
  },
  commonTextData: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  commonTextTitle: {
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.graySubText,
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  bar: {height: 5, backgroundColor: COLORS.bar, marginVertical: 16},
  // status: {
  //   paddingHorizontal: 16,
  //   paddingVertical: 6,
  //   marginVertical: 8,
  //   borderRadius: 8,
  //   marginRight: 8,
  //   justifyContent: 'center',
  // },
  // statusText: {
  //   fontSize: 14,
  //   lineHeight: 20,
  //   fontWeight: '500',
  //   textAlign: 'center',
  //   color: COLORS.textNewColor,
  // },
});
