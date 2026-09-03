export interface MealListType {
  dteMeal: string;
  intEnroll: number;
  MealNo: number;
}

export interface MenuListType {
  intDayOffId: number;
  strDayName: string;
  strMenuList: string;
}
export interface TodayAllMealListType {
  employeeId: number;
  employeeName: string;
  dept: string;
  desig: string;
  responseMsg: string;
  quantity: number;
  takenQty: number;
  imgUrl: string;
}

export interface MealMenuPermisionType {
  isValid: number;
}
