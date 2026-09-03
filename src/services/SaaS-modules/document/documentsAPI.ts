import axios from 'axios';
import {AllDocumentLandingType} from '../../../interfaces/document/document';

export const getDocCategoryDDL = async (accId: number | null | undefined) => {
  try {
    const res = await axios.get(
      `/EmployeeDocument/GetDocumentCategoryDDL?AccountId=${accId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const createDoucument = async (payload: any) => {
  try {
    const res = await axios.post(
      '/EmployeeDocument/CRUDEmployeeDocument',
      payload,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getSelfDocumentList = async (
  empId: number | null | undefined,
  setIsLoading?: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/EmployeeDocument/GetSelfDocumentList?EmployeeId=${empId}`,
    );
    setIsLoading(false);
    const modifiedData = res?.data?.map((item: AllDocumentLandingType) => {
      return {
        ...item,
        isShow: false,
      };
    });

    return modifiedData;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const sendOrApproveDoucument = async (payload: any) => {
  try {
    const res = await axios.post('/EmployeeDocument/SendThisDocument', payload);
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};
