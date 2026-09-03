import axios from 'axios';
import {LeaveTypeDDLType} from '../../../interfaces/leave/leave';

export const getLeaveLanding = async (
  empId: number | null | undefined,
  setIsLoading: any,
  currentYear: number | null | undefined,
) => {
  try {
    const fromDate = `${currentYear}-01-01`;
    const toDate = `${currentYear}-12-31`;
    setIsLoading(true);

    const res = await axios.get(
      `/LeaveMovement/GetEmployeeLeaveBalanceAndHistory?EmployeeId=${empId}&ViewType=LeaveHistory&LeaveTypeId=&ApplicationDate=&FromDate=${fromDate}&ToDate=${toDate}&StatusId=&IntYear=${currentYear}`,
    );

    setIsLoading(false);
    const modifiedRes = res?.data?.map((item: any) => {
      const getRandomColor = () => {
        return '#' + Math.random().toString(16).slice(-6);
      };
      return {
        ...item,
        bgColor: getRandomColor(),
      };
    });

    return modifiedRes;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getLeaveLHistory = async (
  empId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/LeaveMovement/GetEmployeeLeaveBalanceAndHistory?EmployeeId=${empId}&ViewType=LeaveBalance`,
    );

    setIsLoading(false);

    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getLeaveTypeDDL = async (
  accId: number | null | undefined,
  buId: number | null | undefined,
  empId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmployeeLeaveType&AccountId=${accId}&BusinessUnitId=${buId}&intId=${empId}`,
    );
    if (res?.data) {
      const data = res?.data?.map((item: LeaveTypeDDLType) => {
        return {
          ...item,
          value: item?.LeaveTypeId,
          label: item?.LeaveType,
        };
      });
      return data;
    }
  } catch (_error) {}
};

export const createLeaveApplication = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    console.log(JSON.stringify(payload, null, 2));
    setIsLoading(true);
    const res = await axios.post(
      '/LeaveMovement/CRUDLeaveApplication',
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

export const getAllEmployeeForApplication = async (
  empId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=EmployeeBasicForApp&intId=${empId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const uploadLeaveFiles = async (
  accountId: any,
  empId: any,
  buId: any,
  userId: any,
  formData: any,
) => {
  try {
    const file = {
      uri: formData?.uri,
      name: formData?.fileName,
      type: formData?.type,
    };
    let formDat = new FormData();
    formDat?.append('files', file);
    const data = await axios.post(
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=LeaveAndMovement&documentTypeId=15&businessUnitId=${buId}&createdBy=${empId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );

    return data?.data?.[0];
  } catch (_error) {
    return [];
  }
};
