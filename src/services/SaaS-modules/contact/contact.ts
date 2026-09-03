import axios from 'axios';

export const getContactLanding = async (
  accId: any,
  buId: number | null | undefined,
  // intId = 0,
  setIsLoading: any,
  searchText: string,
  _empId: null | number | undefined,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=EmployeeContactInfoWeb&AccountId=${accId}&BusinessUnitId=${buId}&intId=&SearchTxt=${searchText}&SearchText=${searchText}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getSwitchBoardData = async (
  empId: null | number | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);

    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=GetSwitchBoard&EmpId=${empId}`,
    );
    setIsLoading(false);

    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmpDdlData = async (
  accId: null | number | undefined,
  buId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/MasterData/PeopleDeskAllLanding?TableName=${'BusinessUnit'}&AccountId=${accId}&BusinessUnitId=${buId}&intId=${
        intId || 0
      }`,
    );
    setIsLoading(false);
    const data = res?.data?.map((item: any) => {
      return {
        value: item?.BusinessUnitId,
        label: item?.BusinessUnitName,
      };
    });
    return data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createMeetMe = async (
  accId: null | number | undefined,
  senderId: number | null | undefined,
  recvName: any,
  recvId: number | null | undefined,
  agenda: string | null | undefined,
  schedule: string | null | undefined,
  reset: any,
) => {
  try {
    const payload = {
      accountId: accId,
      sendByEmployeeId: senderId,
      sendByEmployeeName: recvName,
      recByEmployeeId: recvId,
      agenda: agenda,
      schedule: schedule,
    };
    const res = await axios.post('/Notification/SendMeetMeNotify', payload);
    reset();
    return res?.data;
  } catch (_error) {
    reset();
  }
};
export const createBookMarked = async (
  empId: null | number | undefined,
  bmId: number | null | undefined,
  isActive: boolean,
  cb: any,
) => {
  try {
    const payload = [
      {
        employeeId: empId,
        bookmarkedEmployeeId: bmId,
        isActive: !isActive,
      },
    ];
    const res = await axios.post('/Employee/CreateDirectoryBookmark', payload);
    cb();
    return res?.data;
  } catch (_error) {}
};

export const createThumsDown = async (
  empId: null | number | undefined,
  bmId: number | null | undefined,
  isActive: boolean,
  cb: any,
) => {
  try {
    const payload = [
      {
        employeeId: empId,
        bookmarkedEmployeeId: bmId,
        isActive: !isActive,
      },
    ];
    const res = await axios.post(
      '/Employee/CreateDirectoryThumbsDown',
      payload,
    );
    cb();
    return res?.data;
  } catch (_error) {}
};

export const getContactBook = async (
  empId: null | number | undefined,
  accountId: null | number | undefined,
  buId: number | null | undefined,
  empTypeId: number | null | undefined,
  departmentId: number | null | undefined,
  skillCategory: string | null | undefined,
  SkillProficiencyLevel: string | null | undefined,
  filterType: string | null | undefined,
  searchText: string | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/SearchEmployeeDirectory?EmpId=${empId}&AccountId=${accountId}&BusinessUnitId=${buId}&EmploymentTypeId=${empTypeId}&DepartmentId=${departmentId}&skillCategory=${skillCategory}&SkillProficiencyLevel=${SkillProficiencyLevel}&filterType=${filterType}&strSearchText=${searchText}`,
    );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmployeeSkillCategoryList = async (
  intAccountId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/EmployeeSkillCategoryDDL?AccountID=${intAccountId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getBusinessUnitList = async (
  accountId: number | null | undefined,
  buId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=BusinessUnit&AccountId=${accountId}&BusinessUnitId=${buId}&intId=${intId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmpDepartmentList = async (
  accountId: number | null | undefined,
  buId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmpDepartment&AccountId=${accountId}&BusinessUnitId=${buId}&intId=${intId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getEmploymentTypeList = async (
  orgId: number | null | undefined,
  buId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=EmploymentType&AccountId=${orgId}&BusinessUnitId=${buId}&intId=${intId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
