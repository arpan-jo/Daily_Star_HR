export interface EmployeeContactType {
  UserId?: number;
  EmployeeId: number;
  EmployeeName: string;
  EmployeeCode: string;
  DepartmentName: string;
  DesignationName: string;
  Phone?: string;
  Email?: string;
  intProfilePicFileUrlId?: number;
  intBusinessUnitId: number;
  isClicked?: boolean;
  strBusinessUnit?: string;
  isBookmarked?: boolean;
  presentAddress?: string;
  isThumbsDown?: boolean;
}
