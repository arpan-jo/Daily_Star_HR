import axios from 'axios';

export const attendanceStatus = async (
  payload: any,
  setIsLoading: any,
  cb: any,
) => {
  try {
    cb();
    const res = await axios.post('/TimeSheet/RemoteAttendance', payload);
    if (res?.data?.statusCode === 200) {
      setIsLoading(false);
      return res?.data;
    }
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const remoteAttendancePunchListDetails = async (
  intId: number | null | undefined,
  date: string | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendancePunchList&intId=${intId}&ApplicationDate=${date}&BusinessUnitId=${buId}`,
    );
    if (res?.status === 200) {
      setIsLoading(false);
      return res?.data;
    }
  } catch (_error) {
    setIsLoading(false);
  }
};
export const remoteAttendancePunchList = async (
  intId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendancePunchList&intId=${intId}&BusinessUnitId=${buId}`,
    );

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

// export const getLocationData = async (payload: any, setIsLoading: any) => {
//   try {
//     setIsLoading(true);
//     const res = await axios.post('/ApprovalPipeline/RemoteAttendanceLanding', payload);
//     setIsLoading(false);
//     return res?.data?.listData;
//   } catch (error) {
//     setIsLoading(false);
//   }
// };

// export const locationRegister = async (payload: any, setLoading: any) => {
//   try {
//     setLoading(true);
//     const res = await axios.post('/TimeSheet/RemoteAttendanceRegistration', payload);
//     setLoading(false);
//     return res?.data;
//   } catch (error) {
//     setLoading(false);
//     //@ts-ignore
//     return error?.response?.data;
//   }
// };

// export const locationApproval = async (payload: any, setLoading: any) => {
//   try {
//     setLoading(true);
//     const res = await axios.post('/ApprovalPipeline/RemoteAttendanceApproval', payload);
//     setLoading(false);
//     return res;
//   } catch (error) {
//     setLoading(false);
//     //@ts-ignore
//     return error?.response?.data;
//   }
// };

// export const remoteLocatinListForEmployee = async (
//   intId: number | null | undefined,
//   setIsLoading: any
// ) => {
//   try {
//     setIsLoading(true);
//     const res = await axios.get(
//       `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendanceRegistrationListByEmployeeId&intId=${intId}`
//     );
//     if (res?.status === 200) {
//       setIsLoading(false);
//       return res?.data;
//     }
//   } catch (error) {

//     setIsLoading(false);
//   }
// };

export const getTimeAdjustmentLanding = async (
  buId: number | null | undefined,
  intId: number | null | undefined,
  yearId: number | null | undefined,
  monthId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/TimeSheetAllLanding?PartType=MonthlyAttendanceSummaryByEmployeeId&BuninessUnitId=${buId}&intId=${intId}&intYear=${yearId}&intMonth=${monthId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createAttendanceAdjustment = async (payload: any) => {
  try {
    const res = await axios.post('/Employee/ManualAttendance', payload);
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const addLocation = async (payload: any, setLoading: any) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/TimeSheet/RemoteAttendanceRegistration',
      payload,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const addMasterLocation = async (payload: any, setLoading: any) => {
  try {
    setLoading(true);

    const res = await axios.post(
      '/TimeSheet/MasterLocationRegistration',
      payload,
    );

    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getAttendanceApprovalLanding = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/ManualAttendanceLandingEngine',
      payload,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const postAttendanceApproval = async (payload: any, setLoading: any) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/ManualAttendanceApprovalEngine',
      payload,
    );
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getRegisteredLocationList = async (
  accId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendanceLocationRegistrationList&AccountId=${accId}&intId=${intId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
export const getRegisteredAdminLocationList = async (
  accId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/TimeSheet/GetMasterLocationByAccountId?AcccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getRegisteredDeviceList = async (
  accId: number | null | undefined,
  intId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendanceDeviceRegistrationList&AccountId=${accId}&intId=${intId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getAttendanceLocationApprovallLanding = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/RemoteAttendanceLocationNDeviceLanding',
      payload,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getMasterLocationApprovallLanding = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/MasterLocationAssaignLandingEngine',
      payload,
    );
    setLoading(false);
    return res?.data?.listData;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const attendanceLocationApprovall = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/RemoteAttendanceLocationNDeviceApproval',
      payload,
    );
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const masterLocationApprovall = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/MasterLocationAssaignApprovalEngine',
      payload,
    );
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getAttendanceSetup = async (
  accId: number | null | undefined,
  buId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/PeopleDeskAllLanding?TableName=RemoteAttendanceSetupConfigByAccountId&AccountId=${accId}&BusinessUnitId=${buId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const remoteAttendanceApprovallLanding = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      'ApprovalPipeline/RemoteAttendanceLanding',
      payload,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const remoteAttendanceApprovall = async (
  payload: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/RemoteAttendanceApproval',
      payload,
    );
    setLoading(false);
    return res;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const uploadImageNewApi = async (
  accId: number | null | undefined,
  tableReferrence: string | null | undefined,
  documentTypeId: number | null | undefined,
  buId: number | null | undefined,
  userId: number | null | undefined,
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
      `/Document/UploadFile?accountId=${accId}&tableReferrence=${tableReferrence}&documentTypeId=${documentTypeId}&businessUnitId=${buId}&createdBy=${userId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    return data?.data?.[0];
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};
//
export const deleteDevice = async (
  empId: any,
  deviceId: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/DeleteRegisteredDeviceByEmployeeIDNDeviceId?EmployeeId=${empId}&strDeviceId=${deviceId}`,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const deleteLocation = async (
  empId: any,
  attRegId: any,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axios.get(
      `/Employee/DeleteRegisteredLocationByEmployeeIDAttendanceRegisterId?EmployeeId=${empId}&attendanceRegisterId=${attRegId}`,
    );
    setLoading(false);
    return res?.data;
  } catch (error) {
    setLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};
