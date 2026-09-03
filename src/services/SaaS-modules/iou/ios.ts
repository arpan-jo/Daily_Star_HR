import axios from 'axios';

export const getIOULanding = async (
  accId: number | null | undefined,
  buId: number | null | undefined,
  empId: number | null | undefined,
  setIsLoading: any,
  currentYear: number,
) => {
  try {
    const fromDate = `${currentYear}-01-01`;
    const toDate = `${currentYear}-12-31`;
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/GetAllIOULanding?strReportType=IOULandingByEmployeeId&intAccountId=${accId}&intBusinessUnitId=${buId}&intEmployeeId=${empId}&intIOUId=0&applicationDate=&fromDate=${fromDate}&toDate=${toDate}&status=&searchTxt=&strDocFor=`,
    );

    setIsLoading(false);

    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createIOUApplication = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const res = await axios.post('/Employee/IOUApplicationCreateEdit', payload);
    setIsLoading(false);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const iouApprovalLanding = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/IOUApplicationLanding',
      payload,
    );
    setIsLoading(false);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    console.log(JSON.stringify(error, null, 2));
    //@ts-ignore
    return error?.response?.data;
  }
};

export const IOUApplicationApproval = async (payload: any) => {
  try {
    const res = await axios.post(
      '/ApprovalPipeline/IOUApplicationApproval',
      payload,
    );

    return res;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const iouAdjustmentApprovalLanding = async (
  payload: any,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      '/ApprovalPipeline/IOUAdjustmentLanding',
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

export const IOUAdjustmentApproval = async (payload: any) => {
  try {
    const res = await axios.post(
      '/ApprovalPipeline/IOUAdjustmentApproval',
      payload,
    );

    return res;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const uploadIOUFiles = async (
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
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=IOU&documentTypeId=24&businessUnitId=${buId}&createdBy=${empId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );

    return data?.data?.[0];
  } catch (_error) {
    return [];
  }
};
