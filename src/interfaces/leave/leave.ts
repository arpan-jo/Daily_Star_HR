export interface LeaveLandingType {
  intApplicationId: number;
  LeaveTypeId: number;
  LeaveType: string;
  DocumentFileUrl: number;
  TotalDays: number;
  Reason: string;
  AddressDuetoLeave: string;
  AppliedFromDate: string;
  AppliedToDate: string;
  ApplicationDate: string;
  ApprovalStatus: string;
  bgColor: string;
}

export interface LeaveHistoryType {
  LeaveBalanceId: number;
  LeaveTypeId: number;
  LeaveTypeCode: string;
  LeaveType: string;
  RemainingDays: number;
  LeaveTakenDays: number;
  BalanceDays: number;
  CarryForwardBalance: number;
  RemainingDaysForApp: number;
  LeaveTakenDaysForApp: number;
  BalanceDaysForApp: number;
}

export interface LeaveApprovalType {
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  leaveType: string;
  dateRange: string;
  status: string;
  isActive: boolean;
  businessUnitId: number;
  profileUrlId: number;
  leaveApplication: LeaveApplicationType;
}
export interface LeaveApplicationType {
  intApplicationId: number;
  intLeaveTypeId: number;
  intEmployeeId: number;
  intAccountId: number;
  intBusinessUnitId: number;
  dteApplicationDate: string;
  dteFromDate: string;
  dteToDate: string;
  intDocumentFileId: number;
  strReason: string;
  strAddressDuetoLeave: string;
  isPayable?: null;
  isPaid: boolean;
  isActive: boolean;
  intCreatedBy: number;
  dteCreatedAt: string;
  intUpdatedBy?: null;
  dteUpdatedAt?: null;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
}

export interface LeaveTypeDDLType {
  LeaveTypeId: number;
  LeaveType: string;
}

export interface ModifyLeaveTypeDDLType {
  LeaveTypeId: number;
  LeaveType: string;
  value: number;
  label: string;
}

export interface CreateLeaveApplicationType {
  partId: number | null | undefined;
  leaveApplicationId: number | null | undefined;
  leaveTypeId: number;
  employeeId: number;
  accountId: number;
  businessUnitId: number;
  applicationDate: string;
  appliedFromDate: string;
  appliedToDate: string;
  documentFile?: string;
  leaveReason: string;
  addressDuetoLeave: string;
  insertBy: string;
}
export interface LeaveType {
  LeaveId: number;
  LeaveTypeId: number;
  LeaveType: string;
  Reason: string;
  EmployeeId: number;
  FromDate: string;
  ToDate: string;
  ApplicationDate: string;
  FromDate1: string;
  ToDate1: string;
  Status: string;
  strAddressDuetoLeave: string;
  CurrentStage?: string;
}
