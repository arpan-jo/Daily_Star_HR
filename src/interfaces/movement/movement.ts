export interface MovementLandingType {
  MovementId: number;
  MovementTypeId: number;
  MovementType: string;
  Reason: string;
  Location: string;
  EmployeeId: number;
  FromDate: string;
  ToDate: string;
  ApplicationDate: string;
  FromTimeAMPM: string;
  ToTimeAMPM: string;
  FromTime: string;
  ToTime: string;
  Status: string;
  bgColor: string;
}

export interface MovementDDLType {
  MovementTypeId: number;
  MovementType: string;
}

export interface MovementApprovalType {
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  leaveType?: null;
  movementType?: string;
  dateRange: string;
  status: string;
  isActive: boolean;
  movementApplication: MovementApplication;
  businessUnitId: number;
  profileUrlId: number;
}
export interface MovementType {
  MovementId: number;
  MovementTypeId: number;
  MovementType: string;
  Reason: string;
  Location: string;
  EmployeeId: number;
  FromDate: string;
  ToDate: string;
  ApplicationDate: string;
  FromTimeAMPM: string;
  ToTimeAMPM: string;
  FromTime: string;
  ToTime: string;
  Status: string;
  CurrentStage?: string;
}
export interface MovementApplication {
  intApplicationId: number;
  intEmployeeId: number;
  intMovementTypeId: number;
  dteFromDate: string;
  dteToDate: string;
  tmeFromTime: string;
  tmeToTime: string;
  strLocation: string;
  strReason: string;
  intAccountId: number;
  intBusinessUnitId: number;
  isActive: boolean;
  intCreatedBy: number;
  dteCreatedAt: string;
  intUpdatedBy?: number | null;
  dteUpdatedAt: string;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
}
