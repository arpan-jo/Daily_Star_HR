import axios from 'axios';
import {commonURL} from '../../../../App';
import {_todayDate} from '../../../common/services/todayDate';

export const getSupervisorDashboard = async (
  empId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Dashboard/MidLevelDashboard?EmployeeId=${empId}&BusinessUnitId=${buId}`,
    );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmpMonthBasedAttendance = async (
  empId: number | null | undefined,
  yearId: number | null | undefined,
  monthId: number | null | undefined,
  setIsLoading: any,
  dashboardData: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `emp/Dashboard/MonthAndYearBasedAttendanceSummary?EmployeeId=${empId}&YearId=${yearId}&MonthId=${monthId}`,
    );

    const modified = {
      ...dashboardData?.employeeDashboardViewModel,
      monthName: res?.data?.monthName,
      workingDays: res?.data?.workingDays,
      presentDays: res?.data?.presentDays,
      absentDays: res?.data?.absentDays,
    };

    setIsLoading(false);
    return modified;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getSupPendingApplication = async (
  empId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `emp/Dashboard/PendigDataSetForDashboard?intEmployeeId=${empId}&intBusinessUnitId=${buId}`,
    );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

//new api
export const getSupervisorDashboardData = async (
  empId: number | null | undefined,
  accId: number | null | undefined,
  setIsLoading: any,
  userInfo: any,
) => {
  try {
    const payload = {
      attendanceDate: _todayDate(),
      pageNo: 1,
      pageSize: 1000,
      isHeaderNeed: true,
      searchTxt: '',
      departmentList: [],
      designationList: [],
      sectionList: [],
    };
    setIsLoading(true);
    const res =
      userInfo?.strUrl === commonURL
        ? await axios.post('/Dashboard/MidLevelDashboard', payload)
        : await axios.get(
            `/Dashboard/MidLevelDashboard?EmployeeId=${empId}&AccountId=${accId}`,
          );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
