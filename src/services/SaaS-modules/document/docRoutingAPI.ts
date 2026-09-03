import axios from 'axios';

export const getAllDocumentRoutingList = async (
  accId: number | null | undefined,
  setIsLoading?: any,
) => {
  setIsLoading(true);
  try {
    const res = await axios.get(
      `/EmployeeDocument/GetAllDocumentRoutingList?AccountId=${accId}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createDoucumentRouting = async (payload: any) => {
  try {
    const res = await axios.post(
      '/EmployeeDocument/CreateDocumentRouting',
      payload,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};
