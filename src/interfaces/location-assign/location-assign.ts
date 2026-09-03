export interface LocaionAssignedType {
  employeeInfo: EmployeeInfo;
  resultList?: ResultListEntity[] | null;
}
export interface EmployeeInfo {
  intEmployeeBasicInfoId: number;
  strEmployeeName: string;
  strEmployeeCode: string;
  strReferenceId: string;
  intEmployeeImageUrlId: number;
  intDesignationId: number;
  strDesignation: string;
  intDepartmentId: number;
  strDepartment: string;
  intSupervisorId: number;
  strSupervisorName: string;
  intLineManagerId: number;
  strLinemanager: string;
  strCardNumber: string;
  intDottedSupervisorId: number;
  strDottedSupervisorName: string;
  isActive: boolean;
  isUserInactive: boolean;
  intWorkplaceId: number;
  strWorkplaceName: string;
  intWorkplaceGroupId: number;
  strWorkplaceGroupName: string;
  intBusinessUnitId: number;
  strBusinessUnitName: string;
  intAccountId: number;
  strAccountName: string;
  intEmploymentTypeId: number;
  strEmploymentType: string;
  role: string;
}
export interface ResultListEntity {
  strLocationCode?: null;
  isChecked: boolean;
  strAddress: string;
  locationName: string;
  locationLog: string;
  strStatus: string;
  strLongitude: string;
  strLatitude: string;
  isActive: boolean;
  intMasterLocationId: number;
}
