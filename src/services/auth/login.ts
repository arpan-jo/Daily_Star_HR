import axios from 'axios';

export const refreshTokenApi = async (payload: any) => {
  if (!payload?.accessToken || !payload?.refreshToken) {
    return null;
  }
  try {
    const res = await axios.post('/Auth/GenerateRefreshToken', payload);
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};

export const resetPasswordApi = async (
  oldPassword: string | null | undefined,
  newPassword: string | null | undefined,
  accountId: number | null | undefined,
  loginId: string | null | undefined,
  updatedBy: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/Auth/ChangePassword?accountId=${accountId}&loginId=${loginId}&oldPassword=${oldPassword}&newPassword=${newPassword}&updatedBy=${updatedBy}`,
    );

    if (res?.status === 200) {
      return res?.data;
    }
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};
