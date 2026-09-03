export interface LeaveConsumeType {
  id: number;
  name: string;
  value: number;
  label: string;
}

export interface LeaveType {
  id: number;
  policyId: number;
  name: string;
  maxLeaveInApplication: number;
  assingendConsumeTypeList: LeaveConsumeType[];
  value: number;
  label: string;
}

export interface LeaveReliver {
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  employeeNameWithCode: string;
  employmentTypeId: number;
  employmentType: string;
  designationName: string;
  designation: number;
  hrPositionId: number;
  departmentId: number;
  isLoan: boolean;
  numGrossSalary: number;
  strDesignation: string;
  strDepartment: string;
  value: number;
  label: string;
}

export interface LeaveApplicationFormTs {
  leaveType: LeaveType;
  leaveConsumeType: LeaveConsumeType;
  fromDate: string; // ISO string
  toDate: string; // ISO string
  startTime: string; // e.g. "11:30 AM"
  endTime: string; // e.g. "12:30 AM"
  leaveReliver: LeaveReliver;
  location: string;
  reason: string;
}

export interface LeaveDetails {
  takenDays: number;
  balanceDays: number;
  totalAllocatedDays: number;
  carryTakenDays: number;
  carryExpiredDays: number;
  carryBalanceDays: number;
  carryTotalAllocatedDays: number;
  expireDate: string;
}

export interface LeaveBalanceItemTs {
  type: string;
  leaveTypeId: number;
  totalTakenDays: number;
  totalBalanceDays: number;
  totalAllocatedDays: number;
  status: string;
  details: LeaveDetails;
}
