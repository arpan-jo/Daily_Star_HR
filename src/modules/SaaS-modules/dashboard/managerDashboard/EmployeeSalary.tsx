import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Edge} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS} from '../../../../common/constant/Themes';
import {ManagementDashboardDataType} from '../../../../interfaces/dashboard/managementDashboard';
import {getTopLabelDashboardData} from '../../../../services/SaaS-modules/dashboard/managementDashboard';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {mangerStyleCommon} from './ManagerDashboardMainIndex';

const edges: Edge[] = ['right', 'bottom', 'left'];

const EmployeeSalary = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();

  const [managementDashboard, setManagementDaashboardData] =
    useState<ManagementDashboardDataType>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const dashRes = await getTopLabelDashboardData(
        userInfo?.intEmployeeId,
        userInfo?.intAccountId,
        userInfo?.intBusinessUnitId,
      );
      setManagementDaashboardData(dashRes);
    },
    [isFocused],
  );

  const salary =
    managementDashboard?.topLevelDashboardViewModel?.departmentWiseEmployeeSalaryCount?.map(
      item => item?.salary,
    );
  const totalSalry = salary ? salary?.reduce((p, c) => p + c) : 0;
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Department Wise Employee & Salaries"
        />
      }
      style={[styles.contain]}>
      <>
        <Text style={styles.salaryTotal}>Total Salary: ৳ {totalSalry} </Text>
        {managementDashboard?.topLevelDashboardViewModel?.departmentWiseEmployeeSalaryCount?.map(
          (item, index) => (
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
                        ?.departmentWiseEmployeeSalaryCount &&
                      index ===
                        managementDashboard?.topLevelDashboardViewModel
                          ?.departmentWiseEmployeeSalaryCount?.length -
                          1
                        ? COLORS.white
                        : COLORS.bar,
                  },
                ]}
              />
            </View>
          ),
        )}
      </>
    </ContainerNew>
  );
};

export default EmployeeSalary;

const styles = StyleSheet.create({
  contain: {
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    paddingVertical: 16,
  },

  salaryTotal: {
    fontWeight: '500',
    fontSize: 15,
    color: COLORS.textNewColor,
    paddingBottom: 8,
  },
  depContainer: {
    paddingLeft: 16,
    width: '100%',
  },
  ...mangerStyleCommon,
});
