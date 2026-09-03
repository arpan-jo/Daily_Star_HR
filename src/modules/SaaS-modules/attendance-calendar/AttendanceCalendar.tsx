/* eslint-disable react-native/no-inline-styles */
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES } from '../../../common/constant/Themes';
import useThemeId from '../../../hooks/useThemeId';
import { AttendanceSummaryViewModel } from '../../../interfaces/dashboard/employeeDashboard';
import { useRootStore } from '../../../stores/rootStore';
import { getEmployeeAttendanceDetails } from '../../../services/SaaS-modules/dashboard/employeeDashboard';
import CustomDropDownNew from '../../../common/components/CustomDropDown';
import RBSheet from '../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import { _todayDateTime } from '../../../common/services/todayDate';
import {
  get_meeting_room_calender_modified,
  GetAttendanceSummary,
  list_user_task_modified,
  MeetingRoomDDL_v2,
} from '../../../common/api/api';
import { httpRequest } from '../../../common/constant/httpRequest';
import { observer } from 'mobx-react-lite';
import { arlURL } from '../../../../App';
import { commonMonthDDL } from '../../../common/components/MonthDDL';
import Column from '../../../common/components/Column';
import CustomButtonNew from '../../../common/components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import { PanResponder } from 'react-native';

interface _RenderItem {
  dayName: string;
  dayNumber: number;
  presentStatus: string;
}
// A function, not a const: the swatches must be read at render time or the
// legend would keep the previous theme's Present colour while the day cells
// below already show the new one.
const dayStatuses = () => [
  {
    title: 'Present',
    color: COLORS.present,
  },
  {
    title: 'Manual Present',
    color: COLORS.darkGray,
  },
  {
    title: 'Absent',
    color: COLORS.absent,
  },
  {
    title: 'Movement',
    color: COLORS.movement,
  },
  {
    title: 'Late',
    color: COLORS.late,
  },
  {
    title: 'Holiday',
    color: COLORS.holiday,
  },
  {
    title: 'Leave',
    color: COLORS.leave,
  },
  {
    title: 'Off Day',
    color: COLORS.offDay,
  },
  {
    title: 'Meeting',
    color: COLORS.maroon,
  },
  {
    title: 'Task',
    color: COLORS.maroon,
  },
];

const monthDDL = commonMonthDDL;

interface props {
  allDayDetials: AttendanceSummaryViewModel | undefined | null;
  isIconWithTitle?: boolean;
  onMonthChangeEmpDate?: any;
}

const AttendanceCalendarIndex = ({
  allDayDetials: _allDayDetials,
  isIconWithTitle,
  onMonthChangeEmpDate: _onMonthChangeEmpDate,
}: props) => {
  useThemeId(); // repaint the legend on theme change
  const _isSwiping = useRef(false);
  const refRBSheet = useRef();
  const refRBSheetForCal = useRef();
  // const [monthValue, setMonthValue] = useState(dayjs());
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [nullDay, _setNullDay] = useState<string[]>();
  const [allDay, setAllDay] = useState<string[]>();
  let currentYear = _todayDateTime().getFullYear();
  const { userInfo } = useRootStore();
  const [monthDay, setMonthDay] = useState<number>(dayjs().month() + 1);
  const [attendanceDetails, setAllDayDetailsData] = useState<any>();
  const [dataOfCalendar, setDataOfCalendar] = useState<any>();
  const [blankDay, setBlankDay] = useState<any>([]);
  const [isShow, setIsShow] = useState(true);
  const [meetingRoomDDL, setMettingRoomDDL] = useState<any>([]);
  const [meetingCalendarData, setMeetingCalendarData] = useState<any[]>([]);
  const [taskCalendarData, setTaskCalendarData] = useState<any[]>([]);

  const navigation = useNavigation();

  const month = dayjs().format('MMMM');
  const { control, setValue, watch } = useForm({
    defaultValues: {
      months: {
        value: dayjs().month() + 1,
        label: month,
      },
      calerdarType: {
        value: 1,
        label: 'Attendance',
      },
    },
  });

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return;
    }
    const api_params = {
      url: GetAttendanceSummary,
      data: {
        employeeId: userInfo?.intEmployeeId,
        typeId: watch('calerdarType.value'),
      },
    };
    const res = await httpRequest(api_params, () => {});
    const dayName = dayjs(
      res?.attendanceDailySummaryViewModel?.[0]?.dteDate,
    ).day();

    blankDayProcess(dayName);

    allDayProcess(res?.attendanceDailySummaryViewModel?.length);
    setAllDayDetailsData(res);
    if (userInfo?.strUrl === arlURL) {
      getMettingRoomData();
    }
  }, []);

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return;
    }
    //@ts-ignore
    if (watch('calerdarType')?.value === 3 && watch('meetingRoom')?.value) {
      getMettingRoomCalender(
        //@ts-ignore
        watch('meetingRoom')?.email || watch('meetingRoom')?.Email,
      );
    }
  });
  const getMettingRoomCalender = async (calendar_id: any) => {
    const api_params = {
      url: get_meeting_room_calender_modified,
      data: {
        calendar_id: calendar_id,
        month: watch('months')?.value,
        year: dayjs().year(),
      },
      method: 'post',
      baseURL: 'https://gadmin.ibos.io',
    };
    const res = await httpRequest(api_params, () => {});
    if (res?.statusCode === 200 || res?.statuscode === 200) {
      setMeetingCalendarData(res?.data);
    }
  };

  const getTaskCalender = async () => {
    console.log('hello');

    const api_params = {
      url: list_user_task_modified,
      method: 'post',
      data: {
        email: userInfo?.loginEmail,
        month: watch('months')?.value,
        year: currentYear,
      },
      baseURL: 'https://gadmin.ibos.io',
      // isConsole: true,
      // isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    if (res?.statusCode === 200 || res?.statuscode === 200) {
      setTaskCalendarData(res?.data);
    }
  };

  const getMettingRoomData = async () => {
    const api_params = {
      url: MeetingRoomDDL_v2,
      data: {
        floorId: 0,
      },
    };
    const res = await httpRequest(api_params, () => {});
    setMettingRoomDDL([
      {
        value: userInfo?.strOfficeMail,
        label: 'Own Meeting',
        email: userInfo?.strOfficeMail,
        timeZone: null,
      },
      ...res,
    ]);
  };

  const handleMonthChange = async (mn: number) => {
    const newFullDate = `${new Date(currentYear, mn - 1, 1)}`;
    const d = dayjs(newFullDate);
    const attendanceData = await getEmployeeAttendanceDetails(
      userInfo?.intEmployeeId,
      mn,
      currentYear,
      watch('calerdarType.value'),
    );

    const dayName = dayjs(
      attendanceData?.attendanceDailySummaryViewModel?.[0]?.dteDate,
    ).day();

    const start = Number(d?.startOf('month').format('d'));
    const startNullDay = attendanceData?.attendanceDailySummaryViewModel?.[0]
      ?.dteDate
      ? dayName
      : start;
    blankDayProcess(startNullDay);

    if (attendanceData?.attendanceDailySummaryViewModel?.[0]?.dteDate) {
      allDayProcess(attendanceData?.attendanceDailySummaryViewModel?.length);
      setAllDayDetailsData(attendanceData);
    } else {
      const end = Number(d?.endOf('month').format('D'));
      allDayProcess(end);
      setAllDayDetailsData([]);
    }
  };

  const blankDayProcess = (day: any) => {
    let fakeDaysInMonth = [];
    for (let i = 1; i <= day; i++) {
      if (i < 10) {
        fakeDaysInMonth.push(`0${i}`);
      } else {
        fakeDaysInMonth.push(`${i}`);
      }
    }
    setBlankDay(fakeDaysInMonth);
  };

  const allDayProcess = (day: any) => {
    let tempAllData: any = [];
    for (let i = 1; i <= day; i++) {
      if (i < 10) {
        tempAllData.push(`0${i}`);
      } else {
        tempAllData.push(`${i}`);
      }
    }
    setAllDay(tempAllData);
  };

  const renderDayStatus = (item: any, index: number, monthDay: number) => {
    if (item?.presentStatus === 'Present') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.present,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Manual Present') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.darkGray,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Absent') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.absent,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Late') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.late,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Offday') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.offDay,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus?.trim() === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Movement') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.movement,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Holiday' || item?.isGovHoliday) {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.holiday,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.isMetting || item?.isTask) {
      return (
        <TouchableOpacity
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.maroon,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (item?.presentStatus === 'Leave') {
      return (
        <TouchableOpacity
          disabled={isShow}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            setDataOfCalendar(item);
            //@ts-ignore
            refRBSheetForCal?.current?.open();
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.leave,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color:
                    item?.presentStatus === 'Present' ||
                    item?.presentStatus === 'Offday'
                      ? COLORS.textNewColor
                      : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (userInfo?.strUrl === arlURL && item?.length > 0) {
      return (
        <TouchableOpacity
          disabled={!item?.length}
          key={index}
          style={[style.col, style.calendar]}
          onPress={() => {
            navigation.navigate('GoogleMeetingDetails', { item });
          }}
        >
          <View
            style={[
              style.dateContainer,
              {
                borderWidth:
                  dayjs().month() + 1 === monthDay &&
                  dayjs().date() === index + 1
                    ? 0.5
                    : 0,
                borderColor: COLORS.black,
                backgroundColor: COLORS.maroon,
              },
            ]}
          >
            <Text
              style={[
                style.txt,
                style.contentWrapper,
                {
                  color: item?.Title ? COLORS.textNewColor : COLORS.onColor,
                },
              ]}
            >
              {item?.dayNumber || index + 1}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View key={index} style={[style.col, style.calendar]}>
        <View
          style={[
            style.dateContainer,
            {
              borderWidth:
                dayjs().month() + 1 === monthDay && dayjs().date() === index + 1
                  ? 0.5
                  : 0,
              borderColor: COLORS.black,
            },
          ]}
        >
          <Text
            style={[
              style.contentWrapper,
              { fontSize: 16, paddingTop: 4, color: COLORS.textNewColor },
            ]}
          >
            {item?.dayNumber || index + 1}
          </Text>
        </View>
      </View>
    );
  };

  // Calendar left right swipe able
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,

      onPanResponderRelease: (_, gesture) => {
        // threshold
        if (Math.abs(gesture.dx) < 80) return;

        // 👉 Swipe Left → Next Month
        if (gesture.dx < 0) {
          setMonthDay(prev => {
            if (prev >= 12) return prev;

            const nextMonth = prev + 1;
            console.log('Swipe Left → ', monthDay, nextMonth);
            setValue('months', {
              value: nextMonth,
              label: dayjs()
                .month(nextMonth - 1)
                .format('MMMM'),
            });

            handleMonthChange(nextMonth);
            return nextMonth;
          });
        }

        // 👈 Swipe Right → Previous Month
        if (gesture.dx > 0) {
          setMonthDay(prev => {
            if (prev <= 1) return prev;

            const prevMonth = prev - 1;
            setValue('months', {
              value: prevMonth,
              label: dayjs()
                .month(prevMonth - 1)
                .format('MMMM'),
            });

            handleMonthChange(prevMonth);
            return prevMonth;
          });
        }
      },
    }),
  ).current;

  return (
    <>
      {/* {allDay && allDayDetials ? ( */}
      <>
        <View style={style.calendarWraper}>
          <View style={style.headContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
              
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '70%',
                 
                }}
              >
                <View>
                  {userInfo?.strUrl === arlURL ? (
                    <Text
                      style={[
                        style.headTitle,
                        {
                          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
                        },
                      ]}
                    >
                      Calendar
                    </Text>
                  ) : (
                    <Text
                      style={[
                        style.headTitle,
                        {
                          paddingBottom: Platform.OS === 'ios' ? 20 : 0,
                        },
                      ]}
                    >
                      Attendance Calendar
                    </Text>
                  )}
                  {userInfo?.strUrl === arlURL ? (
                    <View
                      style={{
                        width: '100%',
                        // flexDirection: 'row',
                        // alignItems: 'center',
                        // gap: 20,
                      }}
                    >
                      <Column colWidth={'100%'}>
                        <CustomDropDownNew
                          control={control}
                          data={[
                            {
                              value: 1,
                              label: 'Attendance',
                            },
                            {
                              value: 2,
                              label: 'Holiday',
                            },
                            {
                              value: 3,
                              label: 'Meeting',
                            },
                            {
                              value: 4,
                              label: 'Task',
                            },
                          ]}
                          name="calerdarType"
                          placholder="Type"
                          boxStyle={[
                            {
                              marginTop: -25,
                            },
                          ]}
                          onChange={async (valueOption: any) => {
                            console.log(valueOption);
                            // setMonthDay(valueOption?.value);
                            setValue('calerdarType', valueOption);
                            if (valueOption?.value === 4) {
                              getTaskCalender();
                            }

                            if (valueOption?.value === 1) {
                              setIsShow(true);
                            } else {
                              setIsShow(false);
                            }
                            //@ts-ignore
                            setValue('meetingRoom', '');
                            const api_params = {
                              url: GetAttendanceSummary,
                              data: {
                                employeeId: userInfo?.intEmployeeId,
                                typeId: valueOption?.value,
                              },
                              // isConsole: true,
                            };
                            const res = await httpRequest(api_params, () => {});
                            setAllDayDetailsData(res);
                          }}
                          selectedItemStyle={style.selectedItem}
                        />
                      </Column>

                      <Column colWidth={'100%'}>
                        {watch('calerdarType')?.value === 3 ? (
                          <CustomDropDownNew
                            isFullTextView={true}
                            control={control}
                            label="Room"
                            data={meetingRoomDDL}
                            name="meetingRoom"
                            placholder="select"
                            boxStyle={[
                              {
                                // marginTop: -25,
                              },
                            ]}
                            onChange={async (valueOption: any) => {
                              //@ts-ignore
                              setValue('meetingRoom', valueOption);
                              getMettingRoomCalender(
                                valueOption?.email || valueOption?.Email,
                              );
                            }}
                            selectedItemStyle={style.selectedItem}
                          />
                        ) : null}
                      </Column>
                    </View>
                  ) : null}
                </View>

                {isShow ? (
                  <View>
                    {isIconWithTitle && (
                      <TouchableOpacity
                        onPress={() =>
                          //@ts-ignore
                          refRBSheet?.current?.open()
                        }
                        style={{
                          paddingLeft: isIconWithTitle ? 10 : 0,
                          paddingTop:
                            isIconWithTitle && Platform.OS === 'android'
                              ? 16
                              : 0,
                        }}
                      >
                        <Icon
                          name="info-outline"
                          size={24}
                          color={COLORS.iconColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
              </View>

              <View
                style={{
                  height: 55,
                  right: 0,
                  paddingTop: Platform.OS === 'ios' ? 10 : 0,
                  alignSelf: 'flex-end',
                  justifyContent:"flex-end",
                  
                }}
              >
                <CustomDropDownNew
                  control={control}
                  data={monthDDL}
                  name="months"
                  placholder="Month"
                  boxStyle={{}}
                  onChange={async (valueOption: any) => {
                    setMonthDay(valueOption?.value);
                    setValue('months', valueOption);
                    handleMonthChange(valueOption?.value);
                    if (watch('calerdarType')?.value === 4) {
                      getTaskCalender();
                    }
                  }}
                  selectedItemStyle={style.selectedItem}
                />
              </View>
            </View>
          </View>
          {!isIconWithTitle && (
            <View style={style.calenderHeader}>
              {isShow ? (
                <View style={style.presentStatus}>
                  <View style={style.dayHeadStatus}>
                    <Text style={style.countStatusDay}>
                      {attendanceDetails?.presentDays || 0} Present
                    </Text>
                  </View>
                  <View style={style.dayHeadStatus}>
                    <Text style={style.countStatusDay}>
                      {attendanceDetails?.lateDays || 0} Late
                    </Text>
                  </View>
                  <View style={style.dayHeadStatus}>
                    <Text style={style.countStatusDay}>
                      {attendanceDetails?.absentDays || 0} Absent
                    </Text>
                  </View>
                </View>
              ) : null}

              {isShow ? (
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      //@ts-ignore
                      refRBSheet?.current?.open()
                    }
                    style={{ paddingRight: 5 }}
                  >
                    <Icon
                      name="info-outline"
                      size={24}
                      color={COLORS.iconColor}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          )}
          <>
            <View
              {...panResponder.panHandlers}
              style={[
                style.row,
                { paddingTop: 10, marginTop: isIconWithTitle ? -25 : 0 },
              ]}
            >
              {weekDays?.map((item, index) => {
                return (
                  <View key={index} style={[style.col, style.calendar]}>
                    <Text
                      style={[style.header, { color: COLORS.transparentBlack }]}
                    >
                      {item}
                    </Text>
                  </View>
                );
              })}
              {blankDay?.length > 0 ? (
                <>
                  {blankDay?.map((item: any, index: any) => {
                    return (
                      <View key={index} style={[style.col, style.calendar]} />
                    );
                  })}
                </>
              ) : (
                <>
                  {nullDay?.map((item, index) => {
                    return (
                      <View key={index} style={[style.col, style.calendar]} />
                    );
                  })}
                </>
              )}

              {watch('calerdarType')?.value === 3 && watch('meetingRoom')?.value
                ? meetingCalendarData?.length > 0 &&
                  meetingCalendarData?.map((item, index) => {
                    return renderDayStatus(item, index, monthDay);
                  })
                : watch('calerdarType')?.value === 4
                ? taskCalendarData?.length > 0 &&
                  taskCalendarData?.map((item, index) => {
                    return renderDayStatus(item, index, monthDay);
                  })
                : allDay?.map((item, index) => {
                    return renderDayStatus(
                      attendanceDetails?.[index] ||
                        attendanceDetails?.attendanceDailySummaryViewModel?.[
                          index
                        ] ||
                        item,
                      index,
                      monthDay,
                    );
                  })}
            </View>
            <View style={style.lastPadding} />
          </>
        </View>
      </>

      {watch('calerdarType')?.value === 3 && watch('meetingRoom') && (
        <View style={{ padding: 10, alignItems: 'flex-end' }}>
          <CustomButtonNew
            btnText="Add Meeting"
            onBtnPress={() => {
              navigation.navigate('GoogleMeetingIndex', {
                mettingRoom: watch('meetingRoom'),
                month: watch('months'),
              });
            }}
            btnstyle={{
              width: '30%',
            }}
          />
        </View>
      )}

      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 2.7}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}
      >
        <View style={style.main}>
          <Text style={style.calHeadline}>Calendar Category</Text>
          {attendanceDetails ? (
            <View style={style.dayStatus}>
              {dayStatuses().map((item, index) => (
                <View key={index} style={{ width: '50%' }}>
                  <View style={style.barStatus}>
                    <View
                      style={[
                        style.calendarCategory,
                        {
                          backgroundColor: item?.color,
                        },
                      ]}
                    >
                      <Text style={[style.title]} />
                    </View>
                    <Text style={style.status}>{item?.title}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </RBSheet>

      <RBSheet
        //@ts-ignore
        ref={refRBSheetForCal}
        width={SIZES.width}
        height={SIZES.height / 1.2}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}
      >
        <View style={style.main}>
          <Text style={style.calHeadline}>{watch('calerdarType.label')}</Text>

          <>
            {watch('calerdarType.value') === 2 ? (
              <>
                {dataOfCalendar?.holidayName?.length > 0 ? (
                  <View style={style.dayStatus}>
                    {dataOfCalendar?.holidayName?.map(
                      (item: any, index: any) => (
                        <View key={index} style={{ width: '100%' }}>
                          <Text
                            style={[
                              style.status,
                              {
                                fontWeight: '600',
                              },
                            ]}
                          >{`${index + 1}. ${item}`}</Text>
                        </View>
                      ),
                    )}
                  </View>
                ) : null}
              </>
            ) : null}

            {watch('calerdarType.value') === 3 ? (
              <>
                {dataOfCalendar?.meetingName?.length > 0 ? (
                  <View style={style.dayStatus}>
                    {dataOfCalendar?.meetingName?.map(
                      (item: any, index: any) => (
                        <View key={index} style={{ width: '100%' }}>
                          <Text
                            style={[
                              style.status,
                              {
                                fontWeight: '600',
                              },
                            ]}
                          >{`${index + 1}. ${item}`}</Text>
                        </View>
                      ),
                    )}
                  </View>
                ) : null}
              </>
            ) : null}

            {watch('calerdarType.value') === 4 ? (
              <>
                {dataOfCalendar?.taskName?.length > 0 ? (
                  <View style={style.dayStatus}>
                    {dataOfCalendar?.taskName?.map((item: any, index: any) => (
                      <View key={index} style={{ width: '100%' }}>
                        <Text
                          style={[
                            style.status,
                            {
                              fontWeight: '600',
                            },
                          ]}
                        >{`${index + 1}. ${item}`}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </>
            ) : null}
          </>
        </View>
      </RBSheet>
    </>
  );
};

export default observer(AttendanceCalendarIndex);

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    paddingHorizontal: 6,
  },
  col: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderBottom,
    paddingBottom: 4,
  },
  header: {
    fontSize: 12,
    textAlign: 'center',
    color: COLORS.textNewColor,
    lineHeight: 28,
  },
  headContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    alignItems: 'center',
    paddingBottom: 20,
  },
  headTitle: {
    color: COLORS.textNewColor,
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 16,
  },
  txt: {
    color: COLORS.textNewColor,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    // paddingTop: 0.5,
    letterSpacing: 0.6,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  calendar: {
    width: '14%',
    paddingHorizontal: '1%',
    marginVertical: '1%',
  },
  calenderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
  },
  main: { paddingTop: 15, backgroundColor: COLORS.white },
  dayStatus: { flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10 },
  title: {
    paddingHorizontal: 10,
  },
  barStatus: {
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    flexGrow: 1,
  },
  status: {
    paddingLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.1,
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  calHeadline: {
    color: COLORS.textNewBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    paddingLeft: 16,
    paddingBottom: 10,
  },
  dayHeadStatus: {
    backgroundColor: COLORS.newGray,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 10,
  },
  countStatusDay: {
    color: COLORS.textNewColor,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  wrapperStyle: {
    borderWidth: 0,
  },
  presentStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItem: {
    paddingRight: 20,
    color: COLORS.textNewColor,
    fontSize: 14,
  },
  lastPadding: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderBottom,
    marginTop: -4,
    marginRight: 10,
    marginLeft: 5,
  },
  dateContainer: {
    borderRadius: 100,
    overflow: 'hidden',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  calendarCategory: {
    overflow: 'hidden',
    width: 25,
    height: 25,
    borderRadius: 50,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  calendarWraper: {
    paddingLeft: 5,
    backgroundColor: COLORS.white,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
  },
  typeDropdownContainer: {
    width: '100%',
  },
  infoIcon: {
    paddingLeft: 10,
    paddingTop: Platform.OS === 'android' ? 16 : 0,
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 10 : 0,
  },
  monthDisplay: {
    marginHorizontal: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  monthText: {
    color: COLORS.textNewColor,
    fontSize: 16,
    fontWeight: '600',
  },
  addMeetingButton: {
    padding: 10,
    alignItems: 'flex-end',
  },
});
