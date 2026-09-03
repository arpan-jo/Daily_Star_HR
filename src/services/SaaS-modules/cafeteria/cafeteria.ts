import axios from 'axios';
import dayjs from 'dayjs';

export const foodCornerMeal = async (
  payload: any,
  setIsLoading: any,
  reset: any,
) => {
  try {
    const {
      ActionBy,
      CountMeal,
      EnrollId,
      MealFor,
      MealOption,
      Narration,
      PartId,
      ToDate,
      TypeId,
      isOwnGuest,
      isPayable,
      MealConsumePlaceId,
      vendorName,
      businessUnitId,
    } = payload;

    const date = dayjs(ToDate).format('YYYY-MM-DD');

    const res = await axios.post(
      `/Cafeteria/CafeteriaEntry?PartId=${PartId}&ToDate=${date}&EnrollId=${EnrollId}&TypeId=${TypeId}&MealOption=${MealOption}&MealFor=${MealFor}&CountMeal=${CountMeal}&isOwnGuest=${isOwnGuest}&isPayable=${isPayable}&Narration=${Narration}&ActionBy=${ActionBy}&MealConsumePlaceId=${MealConsumePlaceId}&vendorName=${vendorName}&businessUnitId=${businessUnitId}`,
    );
    setIsLoading(false);
    reset();
    return res?.data;
  } catch (error) {
    setIsLoading(false);
    //@ts-ignore
    return error?.response?.data;
  }
};

export const getDayWiseFoodList = async (
  partId: number | null | undefined,
  enrollId: number | null | undefined,
  date: string | null | undefined,
  setIsLoading: any,
) => {
  try {
    setIsLoading(true);
    console.log(
      `/Cafeteria/GetPendingAndConsumeMealReport?PartId=${partId}&EnrollId=${enrollId}`,
    );
    const res = await axios.get(
      `/Cafeteria/GetPendingAndConsumeMealReport?PartId=${partId}&EnrollId=${enrollId}&mealDate=${date}`,
    );
    setIsLoading(false);
    return res?.data;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const getPlacesDDL = async (
  accId: number | null | undefined,
  intId: number | null | undefined,
) => {
  try {
    const res = await axios.get(
      `/PeopleDeskDDL/PeopleDeskAllDDL?DDLType=mealConsume&AccountId=${accId}&intId=${intId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const getMenuList = async (empId: number | null | undefined) => {
  try {
    const res = await axios.get(
      `/Cafeteria/GetCafeteriaMenuListReport?LoginBy=${empId}`,
    );
    return res?.data;
  } catch (_error) {}
};

export const getTodaysAllMealList = async () => {
  try {
    const res = await axios.get('emp/HCMService/TodaysAllMealList');

    return res?.data;
  } catch (_error) {}
};

export const getStatusForMealIssue = async (empId: number | undefined) => {
  try {
    const res = await axios.get(
      `emp/HCMService/ManuallyMealIssue?EmployeeId=${empId}`,
    );

    return res?.data;
  } catch (_error) {}
};

// export const getMealCounterPermission = async (empId: number | undefined | null) => {
//   try {
//     const res = await axios.get(
//       `emp/MasterData/PeopleDeskAllLanding?TableName=MealConsumePermissionForApp&intId=${empId}`
//     );

//     return res?.data?.Result[0];
//   } catch (error) {}
// };
