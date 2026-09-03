export interface AttendancePercentType {
  todayPresentPercentage: number;
  todayLatePercentage: number;
  todayAbsentPercentage: number;
  attendanceDonutChartData?: AttendanceDonutChartDataEntity[] | null;
  totalEmployeeCount: number;
}
export interface AttendanceDonutChartDataEntity {
  name: string;
  value: number;
}

export interface LeaveIOUType {
  monthId: number;
  leaveCount: number;
  iou: number;
}

export interface ManagementDashboardDataType {
  employeeDashboardViewModel?: null;
  midLevelDashboardViewModel?: null;
  topLevelDashboardViewModel: TopLevelDashboardViewModel;
}
export interface TopLevelDashboardViewModel {
  todayAttendanceViewModel?: null;
  leaveStatusViewModel: LeaveStatusViewModel;
  movementStatusViewModel: MovementStatusViewModel;
  upcomingBirthdayEmployeeList?: UpcomingBirthdayEmployeeListEntity[] | null;
  departmentWiseEmployeeSalaryCount?: DepartmentWiseEmployeeSalaryCountEntity[] | null;
  lastFiveYearsTurnoversViewModel?: null;
}
export interface LeaveStatusViewModel {
  todayLeave: number;
  tommorrowLeave: number;
  yesterdayLeave: number;
  todayLeavePercentage: number;
  tommorrowLeavePercentage: number;
  yesterdayLeavePercentage: number;
}
export interface MovementStatusViewModel {
  todayMovement: number;
  tommorrowMovement: number;
  yesterdayMovement: number;
  todayMovementPercentage: number;
  tommorrowMovementPercentage: number;
  yesterdayMovementPercentage: number;
}
export interface UpcomingBirthdayEmployeeListEntity {
  employeeId: number;
  employeeName: string;
  supervisor?: null;
  lineManager?: null;
  dateOfBirth: string;
  profileUrl?: null;
  department: string;
  designation: string;
}
export interface DepartmentWiseEmployeeSalaryCountEntity {
  departmentId: number;
  department: string;
  employeeCount: number;
  salary: number;
}
export interface InternProbationType {
  internBellowThreeMonth: number;
  internAboveThreeMonth: number;
  probationBellowSixMonth: number;
  probationAboveSixMonth: number;
}

export interface TurnoverByDepartmentType {
  totalEmployee: number;
  totalLeft: number;
  turnoverRate: number;
  departmentWiseTurnoverRateViewModel?: DepartmentWiseTurnoverRateViewModelEntity[] | null;
}
export interface DepartmentWiseTurnoverRateViewModelEntity {
  departmentId: number;
  departmentName: string;
  lastYearEmployee: number;
  currentYearEmployee: number;
  turnoverRatio: number;
}

export interface EmployeeStatusGraphDataType {
  totalEmployee: number;
  totalMale: number;
  malePercentage: number;
  totalFemale: number;
  femalePercentage: number;
  employeeStatusGraphs?: EmployeeStatusGraphsEntity[] | null;
}
export interface EmployeeStatusGraphsEntity {
  graphText: string;
  graphValue: number;
}

export interface SalaryRangeDataType {
  fixedMinimumSalary: number;
  fixedMaximumSalary: number;
  minimumSalary: number;
  maximumSalary: number;
  numberOfEmployee: number;
}
export interface TurnoverRatioGrapDataType {
  years: number;
  yearlyTurnover: number;
}
