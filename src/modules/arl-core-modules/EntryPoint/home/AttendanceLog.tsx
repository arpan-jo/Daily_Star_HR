/* eslint-disable react-native/no-inline-styles */
import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  GetAttendanceSummary,
  PeopleDeskAllLanding} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import LoadingContainer from '../../../../common/components/Loading';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';
import {useRootStore} from '../../../../stores/rootStore';
import {Pressable} from 'react-native';
import CustomTextNew from '../../../../common/components/CustomText';
import {ScrollView} from 'react-native';

const edges: Edge[] = ['right', 'bottom', 'left'];
interface PropsTs {
  route: any;
}

const topBarItem = [
  {
    title: 'ATTENDANCE LOG',
    isActive: true,
  },
  {
    title: 'OVERTIME LOG',
    isActive: false,
  },
];

const formatOvertimeHour = (hourValue: any) => {
  const hour = Math.floor(hourValue);
  const minute = Math.round((hourValue - hour) * 60);
  return `${hour} hour ${minute.toString().padStart(2, '0')} minute`;
};

const AttendanceLog = ({route: {_params}}: PropsTs) => {
  const navigation = useNavigation();

  const {userInfo} = useRootStore();
  const [topTabName, setTopTabName] = useState(0);
  const [topBar, setTopBar] = useState(topBarItem);
  const [attendanceDetails, setAllDayDetailsData] = useState<any>();
  const [overtimeDetails, setOvertimeDetails] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (topTabName === 1) {
        const api_paramss = {
          url: PeopleDeskAllLanding,
          data: {
            TableName: 'OvertimeCumulativeHour',
            intId: userInfo?.intEmployeeId,
          },
        };
        const otRes = await httpRequest(api_paramss, setIsLoading);
        setOvertimeDetails(otRes);
      } else {
        const api_paramss = {
          url: GetAttendanceSummary,
          data: {employeeId: userInfo?.intEmployeeId},
        };
        const ress = await httpRequest(api_paramss, setIsLoading);
        setAllDayDetailsData(ress);
      }
    },
    [topBar, topTabName],
  );

  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });

    setTopBar(temp);
    setTopTabName(ind);
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <>
          <CustomHeader
            onBackPress={navigation.goBack}
            title="Attendance Log"
          />
        </>
      }
      style={styles.main}>
      <View>
        <LoadingContainer isLoading={isLoading} />

        <View style={styles.head}>
          {topBar?.map((item, index) => (
            <View
              key={index}
              style={[
                styles.box,
                {
                  borderBottomWidth: item?.isActive ? 4 : 0,
                },
              ]}>
              <Pressable onPress={() => handleTopBar(index)}>
                <CustomTextNew
                  txtStyle={[
                    styles.headText,
                    {
                      color: item?.isActive ? COLORS.primary : COLORS.textGray,
                    },
                  ]}
                  text={item?.title}
                />
              </Pressable>
            </View>
          ))}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          // need bottom 2 or 3 list of object doesnot show need style for this issue
          contentContainerStyle={{paddingBottom: 160}}>
          <View style={styles.appContainer}>
            <>
              {topTabName === 0 ? (
                <>
                  {attendanceDetails?.timeAttendanceDailySummaries?.length >
                    0 &&
                    attendanceDetails?.timeAttendanceDailySummaries?.map(
                      (item: any, index: any) => (
                        <View key={index} style={styles.logStyle}>
                          <View>
                            <Text style={styles.dateStyle}>
                              {date_formater(item?.dteAttendanceDate)}
                            </Text>
                            <View style={styles.fontContainer}>
                              <View style={{paddingRight: 10}}>
                                <Text style={styles.checkInTxt}>Check In</Text>
                                <Text style={styles.itemTime}>
                                  {timeFormaterToPmAm(item?.tmeInTime)}
                                </Text>
                              </View>
                              <MIcon
                                name="north"
                                size={26}
                                color={COLORS.iconColor}
                              />
                            </View>
                          </View>

                          <View style={styles.workingHourContainer} />
                          <View>
                            <View style={styles.workingSubContainer}>
                              <Text style={styles.workingHourTxt}>
                                {item?.strWorkingHours || 'N/A'}
                              </Text>
                            </View>
                            <View style={styles.checkOutContainer}>
                              <View style={{paddingRight: 10}}>
                                <Text style={styles.checkoutTxt}>
                                  Check Out
                                </Text>
                                <Text style={styles.checkoutFormater}>
                                  {timeFormaterToPmAm(item?.tmeLastOutTime)}
                                </Text>
                              </View>
                              <MIcon
                                name="south"
                                size={26}
                                color={COLORS.iconColor}
                              />
                            </View>
                          </View>
                        </View>
                      ),
                    )}
                </>
              ) : (
                <>
                  {overtimeDetails?.length > 0 &&
                    overtimeDetails?.map((item: any, index: any) => (
                      <View key={index} style={styles.logStyle}>
                        <View>
                          <Text style={styles.dateStyle}>
                            {date_formater(item?.dteOverTimeDate)}
                          </Text>
                          <View style={styles.fontContainerOT}>
                            <View>
                              <Text style={styles.checkoutTxt}>
                                OverTime Hours
                              </Text>
                              <Text style={styles.itemTime}>
                                {` ${formatOvertimeHour(item?.numOverTimeHour)}`}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.workingHourContainer} />
                        <View>
                          <View style={styles.commulativeContainer}>
                            <Text style={styles.checkoutTxt}>Total Hours</Text>
                            <Text style={styles.checkoutFormater}>
                              {`${formatOvertimeHour(item?.cumulativeHour)}`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                </>
              )}
            </>
          </View>
        </ScrollView>
      </View>
    </ContainerNew>
  );
};

export default AttendanceLog;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.white,
    // paddingTop: 16,
  },
  logStyle: {
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
  },
  appContainer: {marginHorizontal: 16},
  dateStyle: {
    fontSize: 14,
    lineHeight: 18,
    color: COLORS.textNewColor,
  },
  fontContainer: {flexDirection: 'row', paddingTop: 21},
  checkInTxt: {
    fontSize: 14,
    lineHeight: 18,
    color: '#2E90FA',
  },
  itemTime: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  workingHourContainer: {
    height: 40,
    backgroundColor: COLORS.borderBottom,
    width: 1,
  },
  workingSubContainer: {
    backgroundColor: COLORS.lightGray3,
    borderRadius: 16,
  },
  workingHourTxt: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  checkOutContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  checkoutTxt: {
    fontSize: 14,
    lineHeight: 18,
    color: '#F79009',
  },
  checkoutFormater: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  head: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    alignContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    elevation: 2,
  },
  headText: {
    fontSize: 14.5,
    lineHeight: 20,
    fontWeight: '500',
    paddingBottom: 10,
  },
  box: {
    borderBottomColor: COLORS.primary,
    paddingHorizontal: 10,
  },
  fontContainerOT: {flexDirection: 'row', paddingTop: 4},
  commulativeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    fontWeight: '500',
    lineHeight: 18,
    fontSize: 14,
    color: COLORS.textNewColor,
    textAlign: 'center',
    marginTop: 16,
  },
});
