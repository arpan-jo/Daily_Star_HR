import axios from 'axios';

export const getTopLevelDashboard = async (
  empId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);

    const res = await axios.get(
      `emp/Dashboard/TopLevelDashboard?EmployeeId=${empId}&BusinessUnitId=${buId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getAttendancePercent = async (
  accId: number | null | undefined,
  dayId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/AttendanceGraphData?AccountId=${accId}&intDay=${dayId}`,
    );

    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getSalaryRange = async (accId: number | null | undefined) => {
  try {
    const res = await axios.get(
      `/Dashboard/EmployeeCountBySalaryRange?AccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getSalaryRangeByEmpId = async (
  accId: number | null | undefined,
  minSalary: number | null | undefined,
  maxSalary: number | null | undefined,
) => {
  try {
    const max = maxSalary && +maxSalary;
    const min = minSalary && +minSalary;
    const res = await axios.get(
      `/Dashboard/EmployeeCountBySalaryRange?AccountId=${accId}&MinSalary=${min}&MaxSalary=${max}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getMonthWiseLeaveTakenData = async (
  yearId: number | null | undefined,
  accId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/MonthWiseLeaveTakenGraph?IntYear=${yearId}&IntAccountId=${accId}`,
    );
    const iouData = await getMonthWiseIOUData(yearId, accId);
    const combineData = merge(res?.data, iouData);
    return combineData;
  } catch (_error) {
    return [];
  }
};

export const getMonthWiseIOUData = async (
  yearId: number | null | undefined,
  accId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/MonthWiseIOUGraph?IntYear=${yearId}&IntAccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {}
};

const merge = (arr1: any, arr2: any) => {
  return arr1.map((item: any, i: number) => {
    if (item.monthId === arr2[i].monthId) {
      return Object.assign({}, item, arr2[i]);
    }
  });
};

export const getTopLabelDashboardData = async (
  empId: number | null | undefined,
  accId: number | null | undefined,
  buId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/TopLevelDashboard?EmployeeId=${empId}&IntAccountId=${accId}&BusinessUnitId=${buId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getInternAndProbationData = async (
  accId: number | null | undefined,
  yearId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/InternNProbationPeriodGraphData?AccountId=${accId}&Year=${yearId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getTurnoverByDepartment = async (
  accId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/EmployeeTurnOverRatio?&IntAccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getEmployeeStatusData = async (
  accId: number | null | undefined,
  yearId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/EmployeeStatusGraph?IntYear=${yearId}&IntAccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};

export const getTurnoverRatioGrapData = async (
  accId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Dashboard/LastFiveYearEmployeeTurnOverRatio?IntAccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {
    return [];
  }
};
