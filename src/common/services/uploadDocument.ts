import axios from 'axios';

export const uploadImageWithoutBase = async (img: any, setIsLoading: any) => {
  try {
    setIsLoading(true);
    let payload = [];
    let tempData = {
      data: img,
      fileName: 'File',
    };
    payload.push(tempData);

    const res = await axios.post('/Document/UploadFileBaseSixtyFour', payload);

    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const uploadFileMultipart = async (
  accountId: any,
  empId: any,
  buId: any,
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
      `/Document/UploadFile?accountId=${accountId}&tableReferrence=EmployeeDocument&documentTypeId=36&businessUnitId=${buId}&createdBy=${empId}`,
      formDat,
      {headers: {'Content-Type': 'multipart/form-data'}},
    );
    setIsLoading(false);
    return data?.data?.[0];
  } catch (_error) {
    setIsLoading(false);
  }
};
