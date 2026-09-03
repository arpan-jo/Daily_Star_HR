import axios from 'axios';
import {crmURL} from '../../../../App';

const axiosInstance = axios.create({
  baseURL: crmURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const cRMLeadLandingForPeopledesk = async (
  type: string,
  empId: number | undefined | null,
  setLoading: any,
) => {
  try {
    setLoading(true);
    const res = await axiosInstance.get(
      `/crm/Lead/CRMLeadLandingForPeopledesk?type=${type}&peopledeskEmpId=${empId}&viewOrder=desc&pageNo=1&pageSize=500`,
    );
    setLoading(false);
    return res?.data?.data;
  } catch (_error) {
    setLoading(false);
  }
};

export const cRMLeadAccountSaveForPeopledesk = async (
  setIsloading: any,
  payload: any,
) => {
  try {
    setIsloading(true);
    const res = await axiosInstance.post(
      '/crm/Lead/CRMLeadAccountSaveForPeopledesk',
      payload,
    );
    setIsloading(false);
    return res?.data;
  } catch (error) {
    setIsloading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};
