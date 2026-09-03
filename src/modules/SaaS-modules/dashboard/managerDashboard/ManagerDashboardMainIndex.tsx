import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import WebView from 'react-native-webview';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {getImageURL} from '../../../../common/services/getImage';
import attendanceHtml from '../../../../common/webView/attendanceDonut';
import {
  AttendancePercentType,
  InternProbationType,
  LeaveIOUType,
  ManagementDashboardDataType,
  TurnoverByDepartmentType,
} from '../../../../interfaces/dashboard/managementDashboard';
import {
  getAttendancePercent,
  getInternAndProbationData,
  getMonthWiseLeaveTakenData,
  getTopLabelDashboardData,
  getTurnoverByDepartment,
} from '../../../../services/SaaS-modules/dashboard/managementDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import EmployeeStatusGraph from './EmployeeStatusGraph';
import RangeSlider from './RangeSlider';
import TurnoverStatusGraph from './TurnoverStatusGraph';

const ManagerDashboardMainIndex = () => {
  const [sevenDays, setSeveDays] = useState(1);
  const [isModalShow, setIsModalShow] = useState(false);
  const mapRef = useRef();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {userInfo} = useRootStore();
  const [isShowLeaveIOU, setIsShowLeaveIOU] = useState(true);
  const [isR, setIsR] = useState(0);
  const [attendance, setAttendance] = useState<AttendancePercentType>();
  const [monthWiseLeaveTakenData, setMonthWiseLeaveTakenData] =
    useState<LeaveIOUType[]>();
  const [managementDashboard, setManagementDaashboardData] =
    useState<ManagementDashboardDataType>();
  const [internProbationData, setInternProbationData] =
    useState<InternProbationType>();
  const [turnoverByDepartment, setTurnoverByDepartment] =
    useState<TurnoverByDepartmentType>();

  const filteredLeaveIOU = monthWiseLeaveTakenData?.slice(0, 4);
  const filteredEmployeeSalary =
    managementDashboard?.topLevelDashboardViewModel
      ?.departmentWiseEmployeeSalaryCount &&
    managementDashboard?.topLevelDashboardViewModel?.departmentWiseEmployeeSalaryCount?.slice(
      0,
      4,
    );
  const filteredUpcomingBirthday =
    managementDashboard?.topLevelDashboardViewModel
      ?.upcomingBirthdayEmployeeList?.length &&
    managementDashboard?.topLevelDashboardViewModel
      ?.upcomingBirthdayEmployeeList?.length > 4
      ? managementDashboard?.topLevelDashboardViewModel?.upcomingBirthdayEmployeeList?.slice(
          0,
          4,
        )
      : managementDashboard?.topLevelDashboardViewModel
          ?.upcomingBirthdayEmployeeList;

  const salary =
    managementDashboard?.topLevelDashboardViewModel?.departmentWiseEmployeeSalaryCount?.map(
      item => item?.salary,
    );
  const totalSalry = salary && salary?.reduce((p, c) => p + c);
  const currentYear = dayjs().year();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const leaveRes = await getMonthWiseLeaveTakenData(
        currentYear,
        userInfo?.intAccountId,
      );
      setMonthWiseLeaveTakenData(leaveRes);
      const dashRes = await getTopLabelDashboardData(
        userInfo?.intEmployeeId,
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
      );
      setManagementDaashboardData(dashRes);

      const internProbationRes = await getInternAndProbationData(
        userInfo?.intAccountId,
        currentYear,
      );
      setInternProbationData(internProbationRes);

      const turnoverRes = await getTurnoverByDepartment(userInfo?.intAccountId);
      setTurnoverByDepartment(turnoverRes);
    },
    [isFocused],
  );

  const ddl = [
    {
      label: 'Today',
      value: 1,
    },
    {
      label: 'Yesterday',
      value: 2,
    },
    {
      label: 'Last 7 days',
      value: 3,
    },
  ];

  const {control, setValue} = useForm({
    defaultValues: {
      selectedDay: {
        value: 1,
        label: 'Today',
      },
    },
  });

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getPercentage = (
    leave: number | undefined,
    movemment: number | undefined,
    LM: string,
  ) => {
    if (!leave && !movemment) {
      return '100%';
    }
    if (LM === 'Leave') {
      return `${((100 * leave) / (leave + movemment)).toFixed(2)}%`;
    }
    if (LM === 'Movement') {
      return `${((100 * movemment) / (leave + movemment)).toFixed(2)}%`;
    }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (isR === 0) {
        const res = await getAttendancePercent(userInfo?.intAccountId, 1);
        setAttendance(res);
        const aDatas = res?.attendanceDonutChartData?.map(
          (item: {value: number; name: string}) => item?.value,
        );
        const aNames = res?.attendanceDonutChartData?.map(
          (item: {value: number; name: string}) => item?.name,
        );
        if (aDatas?.length > 0 && aNames?.length > 0) {
          mapRef?.current?.postMessage(
            JSON.stringify({
              graphValue: aDatas,
              graphText: aNames,
            }),
          );
        }
      }
      if (isR) {
        const res = await getAttendancePercent(userInfo?.intAccountId, isR);
        setAttendance(res);
        const aDatas = res?.attendanceDonutChartData?.map(
          (item: {value: number; name: string}) => {
            return item?.value;
          },
        );
        const aNames = res?.attendanceDonutChartData?.map(
          (item: {value: number; name: string}) => item?.name,
        );
        if (aDatas && aDatas?.length > 0 && aNames && aNames?.length > 0) {
          mapRef?.current?.postMessage(
            JSON.stringify({
              graphValue: aDatas,
              graphText: aNames,
            }),
          );
        }
      }
    },
    [isR, isFocused],
  );

  const getColors = (name: string) => {
    if (name?.trim() === 'Present') {
      return '#34A853';
    }
    if (name?.trim() === 'Late') {
      return '#F63D68';
    }
    if (name?.trim() === 'Absent') {
      return '#FEC84B';
    }
  };

  const days =
    sevenDays !== 7
      ? attendance?.totalEmployeeCount
      : attendance?.totalEmployeeCount * 7;

  return (
    <>
      <View style={styles.main}>
        <View style={styles.headPart}>
          <Text style={[styles.headTitle, {paddingTop: 25}]}>
            Attendance Calendar
          </Text>
          <View>
            <CustomDropDownNew
              control={control}
              data={ddl}
              name="selectedDay"
              placholder="Month"
              boxStyle={styles.wrapperStyle}
              onChange={async (valueOption: any) => {
                setValue('selectedDay', valueOption);
                setIsR(valueOption?.value);
                if (valueOption?.value === 3) {
                  setSeveDays(7);
                } else {
                  setSeveDays(1);
                }
              }}
              selectedItemStyle={styles.selectedItem}
            />
          </View>
        </View>

        <View style={{marginVertical: 20, position: 'relative'}}>
          {isR === 0 || isR === 1 ? (
            <WebView
              ref={mapRef}
              source={{
                html: attendanceHtml || '<h1></h1>',
              }}
              style={{height: 270, width: '85%', marginLeft: 25}}
              scalesPageToFit={true}
              scrollEnabled={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              androidLayerType={'hardware'}
            />
          ) : null}

          {isR === 2 ? (
            <WebView
              ref={mapRef}
              source={{
                html: attendanceHtml || '<h1></h1>',
              }}
              style={{height: 270, width: '85%', marginLeft: 25}}
              scalesPageToFit={true}
              scrollEnabled={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              androidLayerType={'hardware'}
            />
          ) : null}

          {isR === 3 ? (
            <WebView
              ref={mapRef}
              source={{
                html: attendanceHtml || '<h1></h1>',
              }}
              style={{height: 270, width: '85%', marginLeft: 25}}
              scalesPageToFit={true}
              scrollEnabled={false}
              bounces={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              androidLayerType={'hardware'}
            />
          ) : null}
        </View>

        <View>
          <View style={styles.pDays}>
            <Text style={styles.circleText}>
              {attendance?.totalEmployeeCount}
            </Text>
            <Text style={styles.txtInDonut}>Total Employee </Text>
          </View>
        </View>

        <View>
          <View style={[styles.footerSection, {marginTop: -35}]}>
            <Text style={styles.status}>Status</Text>
            <Text style={styles.status}>Employees</Text>
          </View>
          <View style={styles.bar2} />
          {attendance?.attendanceDonutChartData?.map(
            (item: {name: string; value: number}, index: any) => (
              <View key={index}>
                <View style={styles.footerSection}>
                  <View style={styles.footerSection}>
                    <View
                      style={[
                        styles.circle2,
                        {
                          backgroundColor: getColors(item?.name),
                        },
                      ]}
                    />
                    <Text style={styles.name}>{item?.name}</Text>
                  </View>
                  <View style={styles.footerSection}>
                    <Text style={styles.number}>{item?.value}</Text>
                    <Text style={styles.percentage}>
                      ({((item?.value * 100) / days).toFixed(0)} %)
                    </Text>
                  </View>
                </View>
                {index === 2 ? null : <View style={styles.bar2} />}
              </View>
            ),
          )}
        </View>

        {/* <View style={{ alignSelf: 'center', paddingTop: 30 }}>
        <FastImage source={IMAGES.NoDataImage} style={{ width: 130, height: 90 }} />
        <Text style={styles.noDataText}>No data found</Text>
      </View> */}
      </View>
      <View style={[styles.bar]} />
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle]}>Leave & Movement</Text>
        <Text style={styles.stackBarTitle}>Today</Text>
        <View style={styles.stackBarBox}>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.todayLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.todayMovement,
                'Leave',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor:
                    managementDashboard?.topLevelDashboardViewModel
                      ?.leaveStatusViewModel?.todayLeave === 0 &&
                    managementDashboard?.topLevelDashboardViewModel
                      ?.movementStatusViewModel?.todayMovement === 0
                      ? COLORS.borderBottom
                      : '#3290ED',
                },
              ]}
            />
          </View>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.todayLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.todayMovement,
                'Movement',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor: managementDashboard
                    ?.topLevelDashboardViewModel?.movementStatusViewModel
                    ?.todayMovement
                    ? '#FEC84B'
                    : COLORS.white,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 16}}>
        <Text style={styles.stackBarTitle}>Tommorow</Text>
        <View style={styles.stackBarBox}>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.tommorrowLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.tommorrowMovement,
                'Leave',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor:
                    managementDashboard?.topLevelDashboardViewModel
                      ?.leaveStatusViewModel?.tommorrowLeave === 0 &&
                    managementDashboard?.topLevelDashboardViewModel
                      ?.movementStatusViewModel?.tommorrowMovement === 0
                      ? COLORS.borderBottom
                      : '#3290ED',
                },
              ]}
            />
          </View>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.tommorrowLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.tommorrowMovement,
                'Movement',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor: managementDashboard
                    ?.topLevelDashboardViewModel?.movementStatusViewModel
                    ?.tommorrowMovement
                    ? '#FEC84B'
                    : COLORS.white,
                },
              ]}
            />
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 16}}>
        <Text style={styles.stackBarTitle}>Yesterday</Text>
        <View style={styles.stackBarBox}>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.yesterdayLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.yesterdayMovement,
                'Leave',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor:
                    managementDashboard?.topLevelDashboardViewModel
                      ?.leaveStatusViewModel?.yesterdayLeave === 0 &&
                    managementDashboard?.topLevelDashboardViewModel
                      ?.movementStatusViewModel?.yesterdayMovement === 0
                      ? COLORS.borderBottom
                      : '#3290ED',
                },
              ]}
            />
          </View>
          <View
            style={{
              width: getPercentage(
                managementDashboard?.topLevelDashboardViewModel
                  ?.leaveStatusViewModel?.yesterdayLeave,
                managementDashboard?.topLevelDashboardViewModel
                  ?.movementStatusViewModel?.yesterdayMovement,
                'Movement',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor: managementDashboard
                    ?.topLevelDashboardViewModel?.movementStatusViewModel
                    ?.yesterdayMovement
                    ? '#FEC84B'
                    : COLORS.white,
                },
              ]}
            />
          </View>
        </View>

        <View>
          <View style={[styles.stackBarBox, styles.sbarbox]}>
            <View style={[styles.stackBarBox, styles.barBottom]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: '#3290ED',
                  },
                ]}
              />
              <Text style={styles.leaveMovemnt}>Leave</Text>
            </View>
            <View style={[styles.stackBarBox, styles.barBottom]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: '#FEC84B',
                  },
                ]}
              />
              <Text style={styles.leaveMovemnt}>Movement</Text>
            </View>
          </View>

          <View style={[styles.stackBarBox, styles.sbarbox, {paddingTop: 10}]}>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.leaveStatusViewModel?.todayLeave
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.leaveStatusViewModel?.todayLeavePercentage}%) Today`}
              </Text>
            </View>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.movementStatusViewModel?.todayMovement
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.movementStatusViewModel?.todayMovementPercentage}%) Today`}
              </Text>
            </View>
          </View>

          <View style={[styles.stackBarBox, styles.sbarbox, {paddingTop: 10}]}>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.leaveStatusViewModel?.tommorrowLeave
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.leaveStatusViewModel?.tommorrowLeavePercentage}%) Tommorow`}
              </Text>
            </View>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.movementStatusViewModel?.tommorrowMovement
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.movementStatusViewModel?.tommorrowMovementPercentage}%) Tommorow`}
              </Text>
            </View>
          </View>
          <View style={[styles.stackBarBox, styles.sbarbox, {paddingTop: 10}]}>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.leaveStatusViewModel?.yesterdayLeave
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.leaveStatusViewModel?.yesterdayLeavePercentage}%) Yesterday`}
              </Text>
            </View>
            <View
              style={[
                styles.stackBarBox,
                {width: '48%', alignItems: 'center'},
              ]}>
              <Text style={styles.leaveTTY}>
                {
                  managementDashboard?.topLevelDashboardViewModel
                    ?.movementStatusViewModel?.yesterdayMovement
                }
              </Text>
              <Text style={styles.leaveTTYStatus}>
                {` (${managementDashboard?.topLevelDashboardViewModel?.movementStatusViewModel?.yesterdayMovementPercentage}%) Yesterday`}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />
      {/* employee status */}
      <View style={styles.iouLeaveSection}>
        <Text style={[styles.headTitle]}>Employee Status</Text>
        <Text style={[styles.subTitle, {paddingBottom: 10}]}>
          The result shows from {currentYear} Calender
        </Text>
        <EmployeeStatusGraph />
      </View>
      <View style={[styles.bar]} />
      {/* month wise iou and leave taken section */}
      <View style={styles.iouLeaveSection}>
        <Text style={[styles.headTitle]}>
          Month Wise Leave Taken & IOU Amount
        </Text>
        <Text style={[styles.subTitle, {paddingBottom: 10}]}>
          The result shows from {currentYear} Calender
        </Text>
        {isShowLeaveIOU ? (
          <>
            {filteredLeaveIOU?.map((item, index) => (
              <View key={index}>
                <View style={styles.iouLeave}>
                  <View>
                    <Text style={styles.month}>
                      {months?.[item?.monthId - 1]}
                    </Text>
                    <Text style={styles.leave}>
                      Leave Taken {item?.leaveCount}
                    </Text>
                  </View>
                  <Text style={styles.iouAmount}>৳ {item?.iou}</Text>
                </View>
                {index === 11 ? null : <View style={styles.lightBar} />}
              </View>
            ))}
          </>
        ) : (
          <>
            {monthWiseLeaveTakenData?.map((item, index) => (
              <View key={index}>
                <View style={styles.iouLeave}>
                  <View>
                    <Text style={styles.month}>
                      {months?.[item?.monthId - 1]}
                    </Text>
                    <Text style={styles.leave}>
                      Leave Taken {item?.leaveCount}
                    </Text>
                  </View>
                  <Text style={styles.iouAmount}>৳ {item?.iou}</Text>
                </View>
                {index === 11 ? null : <View style={styles.lightBar} />}
              </View>
            ))}
          </>
        )}
        <TouchableOpacity
          onPress={() => setIsShowLeaveIOU(!isShowLeaveIOU)}
          activeOpacity={0.7}
          style={[styles.seeAllButton, {paddingVertical: 8}]}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.white,
              paddingRight: 5,
            }}>
            {isShowLeaveIOU ? 'See All' : 'Collapse'}
          </Text>
          <Icon
            name={isShowLeaveIOU ? 'expand-more' : 'expand-less'}
            size={25}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.bar]} />
      {/* employee turnover section */}
      <View style={styles.iouLeaveSection}>
        <Text style={[styles.headTitle]}>Employee Turnover</Text>
        <Text style={[styles.subTitle, {paddingBottom: 10}]}>
          Employee turnover is the measurement of the number of employees who
          leave an organization during a specified time period.
        </Text>
        <ScrollView horizontal>
          <View
            style={[
              styles.turnoverCard,
              {
                backgroundColor: COLORS.lightPrimary2,
              },
            ]}>
            <Text style={styles.turnoverNum}>
              {turnoverByDepartment?.totalEmployee}
            </Text>
            <Text style={styles.turnoverTitle}>Total Employee</Text>
          </View>

          <View
            style={[
              styles.turnoverCard,
              {
                backgroundColor: '#EAECF5',
                marginHorizontal: 8,
              },
            ]}>
            <Text style={styles.turnoverNum}>
              {turnoverByDepartment?.totalLeft}
            </Text>
            <Text style={styles.turnoverTitle}>Employee Left</Text>
          </View>

          <View
            style={[
              styles.turnoverCard,
              {
                backgroundColor: '#FEF3F2',
              },
            ]}>
            <Text style={styles.turnoverNum}>
              {turnoverByDepartment?.turnoverRate}%
            </Text>
            <Text style={styles.turnoverTitle}>Turnover Rate</Text>
          </View>
        </ScrollView>

        <Text style={styles.turnoverHeadTitle}>
          Turnover rate by top{' '}
          {turnoverByDepartment?.departmentWiseTurnoverRateViewModel?.length}{' '}
          department
        </Text>

        {turnoverByDepartment?.departmentWiseTurnoverRateViewModel?.map(
          (item, index) => (
            <View key={index}>
              <Text style={styles.turnoverDName}>{item?.departmentName}</Text>
              <View style={styles.turnoverBar}>
                <View
                  style={{
                    backgroundColor: item?.turnoverRatio
                      ? '#0BA5EC'
                      : COLORS.bar,
                    width: item?.turnoverRatio
                      ? `${item?.turnoverRatio}%`
                      : '100%',
                  }}
                />
                <Text style={styles.turnoverBarPercentage}>
                  {item?.turnoverRatio}%
                </Text>
              </View>
            </View>
          ),
        )}
      </View>
      <View style={[styles.bar]} />

      {/* TurnoverStatusGraph */}
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle, {paddingBottom: 10}]}>
          Turnover rate by last five years
        </Text>
        <TurnoverStatusGraph />
      </View>
      <View style={[styles.bar]} />

      {/* upcoming birthday section */}
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle, {paddingBottom: 10}]}>
          Upcoming Birthday
        </Text>
        {filteredUpcomingBirthday?.map((item, index) => (
          <View key={index}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {item?.profileUrl ? (
                  <FastImage
                    source={{
                      uri: getImageURL(item?.profileUrl),
                    }}
                    style={styles.profileImage}
                  />
                ) : (
                  <FastImage
                    source={IMAGES.NoImage}
                    style={styles.profileImage}
                  />
                )}
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      lineHeight: 24,
                      color: COLORS.textNewColor,
                    }}>
                    {item?.employeeName}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      lineHeight: 18,
                      color: COLORS.graySubText,
                    }}>
                    {item?.department}
                  </Text>
                </View>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 12,
                    lineHeight: 18,
                    color: COLORS.graySubText,
                  }}>
                  {date_formater(item?.dateOfBirth).split(',')?.[0]}
                </Text>
              </View>
            </View>
            <View
              style={{
                height: filteredUpcomingBirthday?.length - 1 === index ? 0 : 1,
                width: SIZES.width / 1.25,
                marginLeft: '15%',
                backgroundColor: COLORS.bar,
                marginVertical: 8,
              }}
            />
          </View>
        ))}
        {filteredUpcomingBirthday?.length === 0 ? (
          <View style={{alignSelf: 'center'}}>
            <FastImage
              source={IMAGES.NoDataImage}
              style={{width: 130, height: 90}}
            />
            <Text style={styles.noDataText}>No data found</Text>
          </View>
        ) : null}
        {/* <TouchableOpacity
          onPress={() => navigation.navigate('EmployeeSalary')}
          activeOpacity={0.7}
          style={[styles.seeAllButton, { backgroundColor: COLORS.white }]}
        >
          <Text
            style={{ fontSize: 14, fontWeight: '600', color: COLORS.graySubText, paddingRight: 5 }}
          >
            View All Birthday
          </Text>
          <Icon name={'arrow-forward'} size={25} color={COLORS.iconColor} />
        </TouchableOpacity> */}
      </View>
      <View style={[styles.bar]} />

      {/* rangle slider */}
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle]}>Employee Count by Salary Range</Text>
        <Text style={styles.subTitle}>
          The result shows from {currentYear} calender
        </Text>
        <RangeSlider />
      </View>
      <View style={[styles.bar]} />

      {/* intern and probation section */}
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle]}>Intern & Probation</Text>
        <Text style={styles.subTitle}>
          The result shows from {currentYear} calender
        </Text>
        <Text style={styles.stackBarTitle}>Intern</Text>
        <View style={styles.stackBarBox}>
          <View
            style={{
              width: getPercentage(
                internProbationData?.internBellowThreeMonth,
                internProbationData?.internAboveThreeMonth,
                'Leave',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor:
                    internProbationData?.internBellowThreeMonth === 0 &&
                    internProbationData?.internAboveThreeMonth === 0
                      ? COLORS.borderBottom
                      : COLORS.primary,
                },
              ]}
            />
          </View>
          <View
            style={{
              width: getPercentage(
                internProbationData?.internBellowThreeMonth,
                internProbationData?.internAboveThreeMonth,
                'Movement',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor: internProbationData?.internAboveThreeMonth
                    ? '#F97066'
                    : COLORS.white,
                },
              ]}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}>
          <View style={{width: '50%'}}>
            <View
              style={[
                styles.stackBarBox,
                {marginTop: 0, borderBottomColor: COLORS.white},
              ]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: COLORS.primary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.belowAbove,
                  {fontWeight: '500', paddingRight: 5},
                ]}>
                {internProbationData?.internBellowThreeMonth} employee
              </Text>
            </View>
            <Text style={[styles.belowAbove, {paddingTop: 1}]}>
              Below 3 months
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <View
              style={[
                styles.stackBarBox,
                {marginTop: 0, borderBottomColor: COLORS.white},
              ]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: '#F97066',
                  },
                ]}
              />
              <Text
                style={[
                  styles.belowAbove,
                  {fontWeight: '500', paddingRight: 5},
                ]}>
                {internProbationData?.internAboveThreeMonth} employee
              </Text>
            </View>
            <Text style={[styles.belowAbove, {paddingTop: 1}]}>
              Above 3 months
            </Text>
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal: 16, paddingTop: 2}}>
        <Text style={styles.stackBarTitle}>Probation</Text>
        <View style={styles.stackBarBox}>
          <View
            style={{
              width: getPercentage(
                internProbationData?.probationBellowSixMonth,
                internProbationData?.probationAboveSixMonth,
                'Leave',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor:
                    internProbationData?.probationBellowSixMonth === 0 &&
                    internProbationData?.probationAboveSixMonth === 0
                      ? COLORS.borderBottom
                      : COLORS.primary,
                },
              ]}
            />
          </View>
          <View
            style={{
              width: getPercentage(
                internProbationData?.probationBellowSixMonth,
                internProbationData?.probationAboveSixMonth,
                'Movement',
              ),
            }}>
            <View
              style={[
                styles.stackBar,
                {
                  backgroundColor: internProbationData?.probationAboveSixMonth
                    ? '#F97066'
                    : COLORS.white,
                },
              ]}
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingTop: 8,
          }}>
          <View style={{width: '50%'}}>
            <View
              style={[
                styles.stackBarBox,
                {marginTop: 0, borderBottomColor: COLORS.white},
              ]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: COLORS.primary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.belowAbove,
                  {fontWeight: '500', paddingRight: 5},
                ]}>
                {internProbationData?.probationBellowSixMonth} employee
              </Text>
            </View>
            <Text style={[styles.belowAbove, {paddingTop: 1}]}>
              Below 6 months
            </Text>
          </View>
          <View style={{width: '50%'}}>
            <View
              style={[
                styles.stackBarBox,
                {marginTop: 0, borderBottomColor: COLORS.white},
              ]}>
              <View
                style={[
                  styles.circle,
                  {
                    backgroundColor: '#F97066',
                  },
                ]}
              />
              <Text
                style={[
                  styles.belowAbove,
                  {fontWeight: '500', paddingRight: 5},
                ]}>
                {internProbationData?.probationAboveSixMonth} employee
              </Text>
            </View>
            <Text style={[styles.belowAbove, {paddingTop: 1}]}>
              Above 6 months
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.bar]} />
      {/* department wise employee and salaries */}
      <View style={{paddingHorizontal: 16}}>
        <Text style={[styles.headTitle]}>
          Department Wise Employee & Salaries
        </Text>
        <Text style={[styles.subTitle, {paddingBottom: 10}]}>
          The result shows from {currentYear} calender
        </Text>
        <Text style={styles.salaryTotal}>Total Salary: ৳ {totalSalry} </Text>
        {filteredEmployeeSalary?.map((item, index) => (
          <View key={index}>
            <View style={styles.empSalary}>
              <View style={styles.empDepartment}>
                <Icon name="backup-table" size={30} color={COLORS.primary} />
                <View style={styles.depContainer}>
                  <Text style={styles.department}>{item?.department}</Text>
                  <Text style={styles.totalEmp}>
                    {item?.employeeCount}{' '}
                    <Text style={styles.emp}>Emplpyee</Text>
                  </Text>
                </View>
              </View>

              <Text style={styles.salary}>৳{item?.salary}</Text>
            </View>
            <View
              style={[
                styles.empSalaryBar,
                {
                  backgroundColor:
                    managementDashboard?.topLevelDashboardViewModel
                      ?.departmentWiseEmployeeSalaryCount && index === 3
                      ? COLORS.white
                      : COLORS.bar,
                },
              ]}
            />
          </View>
        ))}
        <TouchableOpacity
          onPress={() => navigation.navigate('EmployeeSalary')}
          activeOpacity={0.7}
          style={[
            styles.seeAllButton,
            {backgroundColor: COLORS.white, paddingBottom: 50},
          ]}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: COLORS.graySubText,
              paddingRight: 5,
            }}>
            View All
          </Text>
          <Icon name={'arrow-forward'} size={25} color={COLORS.iconColor} />
        </TouchableOpacity>
      </View>

      <Modal visible={isModalShow} transparent={true} animationType="fade">
        <View style={styles.modalWrapper}>
          <View style={styles.modal}>
            <TouchableOpacity
              onPress={() => {
                setIsR(1);
                setIsModalShow(!isModalShow);
              }}>
              <Text>Hello 1</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsR(2);
                setIsModalShow(!isModalShow);
              }}>
              <Text>Hello 2</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsR(3);
                setIsModalShow(!isModalShow);
              }}>
              <Text>Hello 3</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ManagerDashboardMainIndex;

export const mangerStyleCommon = StyleSheet.create({
  empSalary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  empDepartment: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '75%',
  },
  empSalaryBar: {
    height: 1,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  department: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    width: '89%',
  },
  emp: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  totalEmp: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  salary: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
});

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  headPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
  },
  iouLeave: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iouLeaveSection: {
    paddingHorizontal: 16,
  },
  month: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  lightBar: {height: 1, backgroundColor: COLORS.bar, marginVertical: 8},
  leave: {
    color: COLORS.graySubText,
    fontSize: 14,
    lineHeight: 20,
  },
  iouAmount: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  // noDataText: {
  //   textAlign: 'center',
  //   color: COLORS.textNewColor,
  //   paddingTop: 10,
  //   fontSize: 14,
  // },
  bar: {height: 5, backgroundColor: COLORS.bar, marginVertical: 16},
  wrapperStyle: {
    borderWidth: 0,
    // height: 30,
  },
  selectedItem: {paddingRight: 20, color: COLORS.textNewColor, fontSize: 14},
  headTitle: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 28,
    color: COLORS.textNewColor,
  },
  stackBarBox: {flexDirection: 'row', width: '100%'},
  stackBar: {width: '100%', height: 32},

  stackBarTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
    paddingBottom: 4,
    paddingTop: 8,
  },
  barBottom: {
    marginTop: 24,
    width: '48%',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bar,
    paddingBottom: 8,
  },
  sbarbox: {
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  circle: {
    height: 15,
    width: 15,
    borderRadius: 100,
    marginRight: 8,
  },
  leaveTTY: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  leaveTTYStatus: {
    fontSize: 12,
    color: COLORS.textNewColor,
  },
  leaveMovemnt: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  belowAbove: {fontSize: 12, lineHeight: 18, color: COLORS.textNewColor},
  seeAllButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
  turnoverCard: {
    paddingHorizontal: Platform?.OS === 'ios' ? 10 : 16,
    paddingVertical: 10,
  },
  turnoverNum: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  turnoverTitle: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  turnoverHeadTitle: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingTop: 16,
    paddingBottom: 6,
  },
  turnoverBar: {flexDirection: 'row', width: '90%', height: 24},
  turnoverDName: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
    paddingVertical: 6,
  },
  turnoverBarPercentage: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    paddingLeft: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    paddingTop: 10,
    fontSize: 14,
  },
  salaryTotal: {
    fontWeight: '500',
    fontSize: 15,
    color: COLORS.textNewColor,
    paddingBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
    paddingVertical: 5,
  },

  modalWrapper: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    width: '90%',
    height: Platform.OS === 'ios' ? '90%' : '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },

  pDays: {
    marginTop: -180,
    width: 100,
    alignSelf: 'center',
  },
  circleText: {
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    color: COLORS.textNewColor,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circle2: {
    height: 15,
    width: 15,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  bar2: {height: 1, backgroundColor: COLORS.bar, marginVertical: 8},
  status: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  name: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    marginLeft: 8,
  },
  number: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingRight: 5,
  },
  percentage: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  txtInDonut: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
    textAlign: 'center',
  },
  depContainer: {
    paddingLeft: 16,
    width: '100%',
  },
  ...mangerStyleCommon,
});
