import axios from 'axios';
import {
  readProfileCache,
  writeProfileCache,
} from '../../../common/services/profileCache';

export const getEmployeeAttendanceDetails = async (
  empId: number | null | undefined,
  monId: number | null | undefined,
  yearId: number | null | undefined,
  typeId: number | null | undefined,
  // setIsLoading: any
) => {
  try {
    // setIsLoading(true);
    const res = await axios.get(
      `/Dashboard/GetAttendanceSummaryCalenderViewReport?EmployeeId=${empId}&Month=${monId}&Year=${yearId}&typeId=${typeId}`,
    );
    // setIsLoading(false);
    return res?.data;
  } catch (error) {
    // setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getAllAnnouncement = async (
  accId: number | null | undefined,
  empId: number | null | undefined,
  buId: number | null | undefined,
  yearId: number | null | undefined,
  workplaceGroupId: number | null | undefined,
  // setIsLoading: any
) => {
  try {
    // setIsLoading(true);
    console.log(
      `/MasterData/GetAnnouncement?employeeId=${empId}&accountId=${accId}&buId=${buId}&YearId=${yearId}&workplaceGroupId=${workplaceGroupId}`,
    );
    const res = await axios.get(
      `/MasterData/GetAnnouncement?employeeId=${empId}&accountId=${accId}&buId=${buId}&YearId=${yearId}&workplaceGroupId=${workplaceGroupId}`,
    );
    // setIsLoading(false);
    return res?.data;
  } catch (_error) {
    // setIsLoading(false);
    //@ts-ignore
    // return error?.response?.data;
  }
};

// export const getAllNotificationList = async (
//   empId: number | null | undefined,
//   accId: number | null | undefined
// ) => {
//   try {
//     const res = await axios.get(
//       `/Notification/GetNotificationCount?employeeId=${empId}&accountId=${accId}`
//     );
//     return res?.data;
//   } catch (error) {
//   }
// };

export const getAllNotificationCount = async (
  empId: number | null | undefined,
  accId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Notification/GetNotificationCount?employeeId=${empId}&accountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {
    //@ts-ignore
    // return error?.response?.data;
  }
};

export const getAllPolicyList = async (empId: number | null | undefined) => {
  try {
    const res = await axios.get(
      `/SaasMasterData/GetPolicyOnEmployeeInbox?EmployeeId=${empId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

/**
 * Cache-first. Callers get the stored profile without a request; pull-to-refresh
 * clears the entry first (see profileCache.ts), so the next call refetches and
 * stores the fresh copy. Failures are returned but never cached.
 */
export const getEmployeeSelfDetails = async (
  empId: number | null | undefined,
  setIsLoading: any,
) => {
  const cached = readProfileCache(empId);
  if (cached) {
    return cached;
  }
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${empId}`,
    );
    setIsLoading(false);
    writeProfileCache(empId, res?.data);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};
export const getJdLandData = async (empId: number | null | undefined) => {
  try {
    const res = await axios.get(
      `/Employee/EmployeeJobDescription?employeeId=${empId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const createJobDescReaction = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/Employee/SaveEmployeeJobDescriptionReact',
      payload,
    );
    setIsLoading(false);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

// getSalaryPaySlip
export const getSalaryPaySlip = async (
  empId: number | null | undefined,
  monthId: number | null | undefined,
  yearId: number | null | undefined,
  salCode: number | null | undefined,
  intBusinessUnitId: any,
  intWorkplaceGroupId: any,
) => {
  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=SalaryPaySlipByEmployeeId&intMonthId=${monthId}&intYearId=${yearId}&IntEmployeeId=${empId}&intSalaryGenerateRequestId=${salCode}&intBusinessUnitId=${intBusinessUnitId}&intWorkplaceGroupId=${intWorkplaceGroupId}`,
    );

    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getSalaryPaySlipBonux = async (
  empId: number | null | undefined,
  monthId: number | null | undefined,
  yearId: number | null | undefined,
  salCode: number | null | undefined,
  intBusinessUnitId: any,
  intWorkplaceGroupId: any,
) => {
  try {
    const res = await axios.get(
      `/Payroll/SalarySelectQueryAll?partName=SalaryGenerateHeaderByEmployeeId&intMonthId=${monthId}&intYearId=${yearId}&IntEmployeeId=${empId}&intSalaryGenerateRequestId=${salCode}&intBusinessUnitId=${intBusinessUnitId}&intWorkplaceGroupId=${intWorkplaceGroupId}`,
    );

    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getSalaryCode = async (
  accId: number | null | undefined,
  BusinessUnitId: number | null | undefined,
  WorkplaceGroupId: number | null | undefined,
  empId: number | null | undefined,
  monthId: number | null | undefined,
  yearId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=PayrollPeriodByEmployeeId&AccountId=${accId}&BusinessUnitId=${BusinessUnitId}&WorkplaceGroupId=${WorkplaceGroupId}&intId=${empId}&IntMonth=${monthId}&IntYear=${yearId}`,
    );
    const modifyData = res?.data?.map((item: any, index: number) => {
      return {
        ...item,
        isActive: index === 0 ? true : false,
      };
    });
    return modifyData;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getContactLandingForCulture = async (
  accId: null | number | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
  searchText: string,
  empId: null | number | undefined,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=CultureEmployeeContactInfo&AccountId=${accId}&BusinessUnitId=${buId}&SearchText=${searchText}&EmpId=${empId}`,
    );
    setIsLoading(false);

    const mod = res?.data?.filter((item: any) => item?.EmployeeId !== empId);
    return mod;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmployeeSkillLandingData = async (
  employeeId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/Employee/EmployeeSkills?employeeId=${employeeId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const createEmployeeSkill = async (payload: any) => {
  try {
    const response = await axios.post(
      '/Employee/SaveEmployeeEmployeeSkills',
      payload,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getEmployeeSkillCategoryDDL = async (
  accountId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/Employee/EmployeeSkillCategoryDDL?AccountID=${accountId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const employeeJobDescriptionDetails = async (
  empId: number | null | undefined,
  empRollid: number | null | undefined,
  jdId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/Employee/EmployeeJobDescriptionDetails?employeeId=${empId}&empRoleId=${empRollid}&jdId=${jdId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getReportListAgainstJD = async (
  empId: number | null | undefined,
  empRollid: number | null | undefined,
  jdId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/Employee/GetReportListAgainstJD?employeeId=${empId}&empRoleId=${empRollid}&jdId=${jdId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const saveEmployeeReportAgainstJD = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/Employee/SaveEmployeeReportAgainstJD',
      payload,
    );
    setIsLoading(false);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

// core values get api
// export const getCoreValuesLandingPagination = async (
//   accountId: number | null | undefined,
//   businessUnitId: number | null | undefined,
//   pageNo: number | null | undefined,
//   pageSize: number | null | undefined,
//   viewOrder: string,
// ) => {
//   try {
//     const response = await axios.get(
//       `/PMS/GetCoreValuesLandingPagination?accountId=${accountId}&businessUnitId=${businessUnitId}&pageNo=${pageNo}&pageSize=${pageSize}&viewOrder=${viewOrder}`,
//     );
//     return response?.data;
//   } catch (error) {
//     console.log('Core values landing api error', error);
//     return [];
//   }
// };

// getting single item details
export const getCoreValuesById = async (
  coreValueId: number | null | undefined,
  businessUnitId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/PMS/GetCoreValuesById?coreValueId=${coreValueId}&businessUnitId=${businessUnitId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getBehaviouralDetails = async (
  coreValueId: number | null | undefined,
  businessUnitId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/PMS/GetCoreValuesById?coreValueId=${coreValueId}&businessUnitId=${businessUnitId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

// competency landing get Api
// export const getCompetencyLandingPagination = async (
//   accountId: number | null | undefined,
//   businessUnitId: number | null | undefined,
//   viewOrder: string,
//   pageNo: number | null | undefined,
//   pageSize: number | null | undefined,
// ) => {
//   try {
//     const response = await axios.get(
//       `/PMS/GetCompetencyLandingPagination?accountId=${accountId}&businessUnitId=${businessUnitId}&viewOrder=${viewOrder}&pageNo=${pageNo}&pageSize=${pageSize}`,
//     );
//     return response?.data;
//   } catch (error) {
//     console.log('Core values landing api error', error);
//     return [];
//   }
// };

export const getCompetencydetailsById = async (
  competencyId: number | null | undefined,
  businessUnitId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const response = await axios.get(
      `/PMS/GetCompetencydetailsById?competencyId=${competencyId}&businessUnitId=${businessUnitId}`,
    );
    setIsLoading(false);
    return response.data;
  } catch (_error) {
    setIsLoading(false);
    return [];
  }
};
