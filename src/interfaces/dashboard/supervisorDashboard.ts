export interface SupervisorDashboardDataType {
  employeeDashboardViewModel?: null;
  midLevelDashboardViewModel: MidLevelDashboardViewModel;
  topLevelDashboardViewModel?: null;
}
export interface MidLevelDashboardViewModel {
  todayPresent: number;
  todayLate: number;
  todayAbsent: number;
  todayMovement: number;
  yesterdayMovement: number;
  tommorrowMovement: number;
  todayLeave: number;
  yesterdayLeave: number;
  tommorrowLeave: number;
  employeeAttandanceListViewModels?: EmployeeAttandanceListViewModelsEntity[] | null;
  employeeQryProfileAllList?: EmployeeQryProfileAllListEntity[] | null;
}
export interface EmployeeAttandanceListViewModelsEntity {
  employeeId: number;
  employeeName: string;
  departmentId: number;
  departmant: string;
  designationId: number;
  designation: string;
  inTime?: string | null;
  outTime?: string | null;
  status: string;
  employeeCode: string;
  employeeProfileUrlId: number;
  strWorkingHours: string;
  isClicked: boolean;
}
export interface EmployeeQryProfileAllListEntity {
  employeeBasicInfo: EmployeeBasicInfo;
  businessUnit: BusinessUnit;
  departmentId: number;
  departmentName: string;
  designationId: number;
  designationName: string;
  supervisorId: number;
  supervisorName: string;
  intSupervisorImageUrlId?: null;
  dottedSupervisorId?: null;
  dottedSupervisorName?: null;
  intDottedSupervisorImageUrlId?: null;
  lineManagerId: number;
  lineManagerName: string;
  intLineManagerImageUrlId?: null;
  employmentTypeId: number;
  employmentTypeName: string;
  workplaceGroupId: number;
  workplaceGroupName: string;
}
export interface EmployeeBasicInfo {
  intEmployeeBasicInfoId: number;
  strEmployeeCode: string;
  strCardNumber: string;
  strEmployeeName: string;
  intGenderId: number;
  strGender: string;
  intReligionId: number;
  strReligion: string;
  strMaritalStatus: string;
  strBloodGroup: string;
  intDepartmentId: number;
  intDesignationId: number;
  dteDateOfBirth: string;
  dteJoiningDate: string;
  dteConfirmationDate?: string | null;
  dteLastWorkingDate?: null;
  intSupervisorId: number;
  intLineManagerId: number;
  intDottedSupervisorId: number;
  isSalaryHold: boolean;
  isActive: boolean;
  isUserInactive: boolean;
  isRemoteAttendance: boolean;
  intWorkplaceId: number;
  intBusinessUnitId: number;
  intEmploymentTypeId: number;
  strEmploymentType: string;
  intAccountId: number;
  dteCreatedAt: string;
  intCreatedBy: number;
  dteUpdatedAt: string;
  intUpdatedBy: number;
  strReferenceId: string;
  intWorkplaceGroupId: number;
}
export interface BusinessUnit {
  intBusinessUnitId: number;
  strBusinessUnit: string;
  strShortCode: string;
  strAddress: string;
  strLogoUrlId: number;
  intDistrictId: number;
  strDistrict: string;
  strEmail: string;
  strWebsiteUrl: string;
  strCurrency: string;
  isActive: boolean;
  intAccountId: number;
  dteCreatedAt: string;
  intCreatedBy: number;
  dteUpdatedAt: string;
  intUpdatedBy: number;
}
