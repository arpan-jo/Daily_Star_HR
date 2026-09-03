import axios from 'axios';

export const getMenuData = async (
  userId: number | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.post(
      `/SmartARL/GetMenuListPermissionWise?userId=${userId}`,
    );
    // console.log(JSON.stringify(res?.data, null, 2));
    if (res?.status === 200) {
      setIsLoading(false);
      return res?.data;
    }
  } catch (error: any) {
    return error?.response;
  }
};

export const getDistanceFromLatLonInMeters = (
  lat1: any,
  lon1: any,
  lat2: any,
  lon2: any,
) => {
  if (Number(lat1) && Number(lon1) && Number(lat2 || 0) && Number(lon2 || 0)) {
    const R = 6371e3; // Radius of Earth in meters
    const dLat = ((+lat2 - +lat1) * Math.PI) / 180;
    const dLon = ((+lon2 - +lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((+lat1 * Math.PI) / 180) *
        Math.cos((+lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c || 0; // Distance in meters
    return d;
  } else {
    return 0;
  }
};
