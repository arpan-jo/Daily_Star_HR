import axios from 'axios';

export const getEmployeeDetails = async (
  empId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/Employee/EmployeeProfileView?employeeId=${empId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};
export const uploadProfileImages = async (
  accountId: any,
  empId: any,
  buId: any,
  userId: any,
  formData: any,
  setIsLoading: any,
) => {
  try {
    const file = {
      uri: formData?.uri,
      name: formData?.fileName,
      type: formData?.type,
    };
    let formDat = new FormData();
    formDat?.append('files', file);
    setIsLoading(true);
    const data = await axios.post(
      `/Document/UploadProfilePicture?accountId=${accountId}&employeeId=${empId}&tableReferrence=EmployeePhotoIdentity&documentTypeId=1&businessUnitId=${buId}&createdBy=${empId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    setIsLoading(false);
    return data?.data?.[0];
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createSwitchLink = async (payload: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    const res = await axios.post('/Employee/UpdateEmployeeProfile', payload);
    setIsLoading(false);
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getSocialMediaDDL = async () => {
  try {
    const res = await axios.get(
      '/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=SocialMediaListDDL',
    );

    if (res?.data) {
      const data = res?.data?.map((item: any) => {
        return {
          ...item,
          value: item?.value,
          label: item?.label,
        };
      });

      return data;
    }
  } catch (_error) {}
};
