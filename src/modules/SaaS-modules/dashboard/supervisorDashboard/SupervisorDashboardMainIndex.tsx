import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {
  GetPendingApprovalDashboard,
  PendingApprovalDashboard,
} from '../../../../common/api/api';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import type {SupervisorDashboardDataType} from '../../../../interfaces/dashboard/supervisorDashboard';
import {getSupervisorDashboardData} from '../../../../services/SaaS-modules/dashboard/supervisorDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import EmployeeCard from './common/components/EmployeeCard';
import NoDataComponent from './common/components/NoDataComponent';
import {useEmployeeData} from './common/hooks/useEmployeeData';

const SupervisorDashboardMainIndex = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [approvalNum, setApprovaNum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [supDashData, setSupDashData] = useState<SupervisorDashboardDataType>();

  const {
    empList,
    isLoading: empLoading,
    toggleEmployeeExpansion,
  } = useEmployeeData({limitToFive: true});

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }

    // Fetch dashboard data
    const res = await getSupervisorDashboardData(
      userInfo?.intEmployeeId,
      userInfo?.intAccountId,
      setIsLoading,
      userInfo,
    );
    setSupDashData(res);

    // Fetch approval data
    const isCommonURL = commonURL === userInfo?.strUrl;
    const payloadForAll = {
      accountId: userInfo?.intAccountId,
      employeeId: userInfo?.intEmployeeId,
      isAdmin: userInfo?.isOfficeAdmin,
      iAmFromWeb: false,
      iAmFromApps: true,
    };

    const api_params = {
      url: isCommonURL ? GetPendingApprovalDashboard : PendingApprovalDashboard,
      data: isCommonURL
        ? {
            ...payloadForAll,
            workplaceGroupId:
              userInfo?.intWorkplaceGroupId ||
              userInfo?.originalWorkplaceGroupId,
            workplaceId: userInfo?.intWorkplaceId,
            businessUnitId: userInfo?.intBusinessUnitId,
          }
        : payloadForAll,
    };

    const resss = await httpRequest(api_params, setIsLoading);

    if (Array.isArray(resss)) {
      let sum = 0,
        sumVersion2 = 0;
      for (const {totalCount = 0, pendingApprovalCount = 0} of resss) {
        sum += totalCount;
        sumVersion2 += pendingApprovalCount;
      }
      setApprovaNum(isCommonURL ? sumVersion2 : sum);
    }
  }, []);

  const DashboardCard = ({
    icon,
    title,
    backgroundColor = COLORS.primary,
    data,
  }: {
    icon: string;
    title: string;
    backgroundColor?: string;
    data: Array<{label: string; value: number | string}>;
  }) => (
    <View style={styles.box}>
      <View style={styles.headPart}>
        <View style={[styles.applicationIconBox, {backgroundColor}]}>
          <MIcon name={icon} size={25} color={COLORS.white} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <View style={styles.text}>
            <Text style={styles.day}>{item.label}</Text>
            <Text style={styles.dayCount}>{item.value}</Text>
          </View>
          {index < data.length - 1 && <View style={styles.bar} />}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <>
      {(isLoading || empLoading) && (
        <ActivityIndicator
          size={'large'}
          color={COLORS.primary}
          style={styles.activityIndicatorStyle}
        />
      )}

      <View style={styles.main}>
        <DashboardCard
          icon="assignment-ind"
          title="Today Attendance"
          data={[
            {
              label: 'Present',
              value: supDashData?.midLevelDashboardViewModel?.todayPresent || 0,
            },
            {
              label: 'Late',
              value: supDashData?.midLevelDashboardViewModel?.todayLate || 0,
            },
            {
              label: 'Absent',
              value: supDashData?.midLevelDashboardViewModel?.todayAbsent || 0,
            },
          ]}
        />

        <DashboardCard
          icon="luggage"
          title="Leave"
          backgroundColor={COLORS.leave}
          data={[
            {
              label: 'Today',
              value: supDashData?.midLevelDashboardViewModel?.todayLeave || 0,
            },
            {
              label: 'Tomorrow',
              value:
                supDashData?.midLevelDashboardViewModel?.tommorrowLeave || 0,
            },
            {
              label: 'Yesterday',
              value:
                supDashData?.midLevelDashboardViewModel?.yesterdayLeave || 0,
            },
          ]}
        />

        <DashboardCard
          icon="directions-car"
          title="Movement"
          backgroundColor={COLORS.movement}
          data={[
            {
              label: 'Today',
              value:
                supDashData?.midLevelDashboardViewModel?.todayMovement || 0,
            },
            {
              label: 'Tomorrow',
              value:
                supDashData?.midLevelDashboardViewModel?.tommorrowMovement || 0,
            },
            {
              label: 'Yesterday',
              value:
                supDashData?.midLevelDashboardViewModel?.yesterdayMovement || 0,
            },
          ]}
        />

        <View style={styles.box}>
          <View style={styles.approval}>
            <View>
              <Text style={styles.count}>{approvalNum}</Text>
              <Text style={styles.status}>Approval</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ApprovalMainIndexFromSupDash')
              }
              style={styles.approvalButton}>
              <Text style={styles.btnText}>GO TO APPROVAL</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.spaceBar} />

      <View style={styles.empPart}>
        <Text style={styles.headTitle}>My Employees</Text>
        <View>
          {empList && empList.length > 0 ? (
            empList.map((item, index) => (
              <EmployeeCard
                key={index}
                item={item}
                index={index}
                onToggleExpand={toggleEmployeeExpansion}
              />
            ))
          ) : (
            <NoDataComponent />
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('AllEmloyeeSupervisor')}
        style={styles.bottomText}>
        <Text style={styles.textBtm}>View my all employees</Text>
        <MIcon name="arrow-forward" size={25} color={'#667085'} />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  main: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingTop: 10,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingLeft: 16,
  },
  applicationIconBox: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  headPart: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 18,
  },
  box: {
    borderWidth: 1,
    borderColor: COLORS.white,
    backgroundColor: COLORS.white,
    elevation: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  day: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  dayCount: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
  },
  bar: {
    height: 1,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  approval: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  approvalButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.primary,
  },
  count: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    color: COLORS.textNewColor,
  },
  status: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  spaceBar: {
    height: 8,
    marginVertical: 16,
    backgroundColor: COLORS.bar,
  },
  empPart: {
    paddingHorizontal: 16,
  },
  headTitle: {
    fontWeight: '600',
    lineHeight: 28,
    fontSize: 18,
    color: COLORS.textNewColor,
  },
  bottomText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 18,
    alignItems: 'center',
  },
  textBtm: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    color: COLORS.graySubText,
    paddingRight: 12,
  },
  activityIndicatorStyle: {
    zIndex: 99999,
    position: 'absolute',
    alignSelf: 'center',
  },
});

export default SupervisorDashboardMainIndex;
