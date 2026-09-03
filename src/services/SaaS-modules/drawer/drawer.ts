import axios from 'axios';

export const getMenuPermissionAPI = async (
  empId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Auth/GetMenuListPermissionWiseApps?EmployeeId=${empId}`,
    );
    return res?.data;
  } catch (error: any) {
    return error?.response?.status;
  }
};
