export interface LocationLandingType {
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  leaveType?: null;
  dateRange?: null;
  status: string;
  application: Application;
}
export interface Application {
  intAttendanceRegId: number;
  intEmployeeId: number;
  strEmployeeName: string;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  dteInsertDate: string;
  strInsertBy: string;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
}

export interface PunchLandDataType {
  intAutoId: number;
  intAttendanceRegId: number;
  intEmployeeId: number;
  dteAttendanceDate: string;
  tmAttendanceTime: string;
  strInOutStatus: string;
  CheckInOut: string;
  strAddress: string;
  strPlaceName: string;
  strLongitude: string;
  strLatitude: string;
  intRealTimeImage?: number;
  strVisitingCompany?: string;
  strVisitingLocation?: string;
  strRemarks?: string;
  AttendanceSummaryId?: number;
}

export interface AttendanceLandDataType {
  longitude: number;
  latitude: number;
}

export interface EmpLocationDataType {
  intAttendanceRegId: number;
  intEmployeeId: number;
  strEmployeeName: string;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  dteInsertDate: string;
  strInsertBy: string;
  IsActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  Status: string;
}

export interface TimeAdjustmentType {
  ApplicationStatus: string;
  intAutoId: number;
  intDayId: number;
  intMonthId: number;
  intYear: number;
  dteAttendanceDate: string;
  intEmployeeId: number;
  isPresent: boolean;
  isAbsent: boolean;
  isLeave: boolean;
  isLeaveWithPay: boolean;
  isMovement: boolean;
  isHoliday: boolean;
  isOffday: boolean;
  isLate: boolean;
  tmeLateHour?: null;
  isEarlyLeave: boolean;
  tmeEarlyLeaveHour?: null;
  tmeAttendanceHour?: null;
  tmeExtraHour?: null;
  tmeShiftOverTime?: null;
  intPunchCount?: null;
  intCalendarTypeId: number;
  strCalendarType: string;
  intCalendarId: number;
  strCalendarName: string;
  dteNextChangeDate: string;
  dteStartTime: string;
  dteExtendedStartTime: string;
  dteLastStartTime: string;
  dteEndTime: string;
  tmeInTime?: null;
  tmeLastOutTime?: null;
  numMinWorkHour: number;
  isProcess: boolean;
  dteProcessDateTime?: null;
  strWorkingHours?: null;
  isWorkingDayCal: number;
  intRosterGroupId: number;
  strRosterGroupName: string;
  intCreatedBy: number;
  dteCreatedAt: string;
  isAutoGenerate: boolean;
  isManual?: null;
  dteGenerateDate: string;
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
  dteConfirmationDate?: null;
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
  dteCreatedAt1: string;
  intCreatedBy1: number;
  dteUpdatedAt: string;
  intUpdatedBy: number;
  strReferenceId: string;
  intWorkplaceGroupId: number;
  dteContactFromDate?: null;
  dteContactToDate?: null;
  intId?: null;
  intEmployeeId1?: null;
  intAttendanceSummaryId?: null;
  dteAttendanceDate1?: null;
  timeInTime?: null;
  timeOutTime?: null;
  strCurrentStatus?: null;
  strRequestStatus?: null;
  strRemarks?: null;
  isActive1?: null;
  intCreatedBy2?: null;
  dteCreatedAt2?: null;
  intUpdatedBy1?: null;
  dteUpdatedAt1?: null;
  intPipelineHeaderId?: null;
  intCurrentStage?: null;
  intNextStage?: null;
  strStatus?: null;
  isPipelineClosed?: null;
  isReject?: null;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  InTime?: null;
  OutTime?: null;
}

// Response shape of the new landing api => /Employee/AttendanceAdjustmentFilter
// (replaces TimeSheetAllLanding => TimeAdjustmentType)
export interface AttendanceAdjustmentFilterType {
  AutoId?: number;
  AttendanceDate?: string;
  EmployeeId?: number;
  EmployeeName?: string;
  EmployeeCode?: string;
  DepartmentId?: number;
  DepartmentName?: string;
  DesignationId?: number;
  DesignationName?: string;
  SupervisorId?: number;
  SupervisorName?: string;
  LineManagerId?: number;
  LineManagerName?: string;
  WorkplaceId?: number;
  WorkplaceName?: string;
  WorkplaceGroupId?: number;
  WorkplaceGroupName?: string;
  EmploymentStatusId?: number;
  EmploymentTypeName?: string;
  isPresent?: boolean;
  isAbsent?: boolean;
  isLeave?: boolean;
  isLeaveWithPay?: boolean;
  isMovement?: boolean;
  isHoliday?: boolean;
  isOffday?: boolean;
  isLate?: boolean;
  isEarlyLeave?: boolean;
  PunchCount?: number;
  CalendarType?: string;
  CalendarId?: number;
  CalendarName?: string;
  NextChangeDate?: string;
  StartTime?: string;
  ExtendedStartTime?: string;
  LastStartTime?: string;
  EndTime?: string;
  MinWorkHour?: number;
  RosterGroupId?: number;
  RosterGroupName?: string;
  RequestStatus?: string | null;
  ManualAttendanceId?: number | null;
  CalenderStartTime?: string;
  CalenderEndTime?: string;
  OverTimeCalednder?: string;
  OverTimeCalednder1?: string;
  LateMin?: string;
  actualAttendanceStatus?: string;
  WorkingHours?: string;
  ApplicationStatus?: string;
  OverTime?: string;
  BreakTime?: number;
}

export interface AttendanceAdjustmentApprovalLandingType {
  responseStatus: string;
  applicationStatus: string;
  currentSatageId: number;
  nextSatageId: number;
  isComplete: boolean;
  listData?: AttendanceAdjustmentApprovalLandingListDataType[] | null;
}
export interface AttendanceAdjustmentApprovalLandingListDataType {
  intId: number;
  intEmployeeId: number;
  strEmployeeName: string;
  intDepartmentId: number;
  strDepartment: string;
  strEmploymentType: string;
  intDesignationId: number;
  strDesignation: string;
  intAttendanceSummaryId: number;
  dteAttendanceDate: string;
  timeInTime?: null;
  timeOutTime?: null;
  strCurrentStatus?: null;
  strRequestStatus: string;
  strRemarks: string;
  isActive: boolean;
  application: Application;
}
export interface Application {
  intId: number;
  intEmployeeId: number;
  intAttendanceSummaryId: number;
  dteAttendanceDate: string;
  timeInTime?: null;
  timeOutTime?: null;
  strCurrentStatus?: null;
  strRequestStatus: string;
  strRemarks: string;
  isActive: boolean;
  intCreatedBy: number;
  dteCreatedAt: string;
  intUpdatedBy?: null;
  dteUpdatedAt?: null;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
}

export interface RegisteredLocationType {
  Status: string;
  dteInsertDate: string;
  dteRejectDateTime?: null;
  intAccountId: number;
  intAttendanceRegId: number;
  intCurrentStage?: null;
  intEmployeeId: number;
  intInsertBy: number;
  intNextStage?: null;
  intPipelineHeaderId?: null;
  intRejectedBy?: null;
  isActive: boolean;
  isHomeOffice: boolean;
  isLocationRegister: boolean;
  isPipelineClosed?: null;
  isReject?: null;
  strAddress: string;
  strDeviceId?: null;
  strDeviceName?: null;
  strEmployeeName: string;
  strLatitude: string;
  strLongitude: string;
  strPlaceName: string;
  strStatus?: null;
}
export interface RegisteredAdminLocationType {
  intMasterLocationId: number;
  intAccountId: number;
  intBusinessId: number;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  dteCreatedAt: string;
  intCreatedBy: number;
  dteUpdatedAt: string;
  intUpdatedBy: number;
}
export interface RegDeviceLandType {
  intAttendanceRegId: number;
  intAccountId: number;
  isLocationRegister: boolean;
  intEmployeeId: number;
  strEmployeeName: string;
  isHomeOffice: boolean;
  strLongitude?: null;
  strLatitude?: null;
  strPlaceName?: null;
  strAddress?: null;
  strDeviceId: string;
  strDeviceName: string;
  dteInsertDate: string;
  intInsertBy: number;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  Status: string;
}

export interface AttendanceLocationApprovalType {
  responseStatus: string;
  applicationStatus: string;
  currentSatageId: number;
  nextSatageId: number;
  isComplete: boolean;
  listData?: ListDataEntity[] | null;
}
export interface ListDataEntity {
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  leaveType?: null;
  dateRange?: null;
  status: string;
  application: Application;
  currentStage: string;
  waitingStage: string;
}
export interface Application {
  intAttendanceRegId: number;
  intAccountId: number;
  isLocationRegister: boolean;
  intEmployeeId: number;
  strEmployeeName: string;
  isHomeOffice: boolean;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  strDeviceId?: null;
  strDeviceName?: null;
  dteInsertDate: string;
  intInsertBy: number;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  dteAttendanceTime?: string;
}

export interface AttendanceSetupType {
  intAutoId: number;
  intAccountId: number;
  isCheckInApprovalNeed: boolean;
  isDeviceRegNeed: boolean;
  isLocationRegNeed: boolean;
  isRealTimeImageNeed: boolean;
  numMinimumValidDistance: number;
  isActive: boolean;
  dteCreateAt: string;
  intCreatedBy: number;
  dteUpdatedDate?: null;
  intUpdatedBy?: null;
}

export interface MasterLocationApprovalType {
  intMasterLocationId: number;
  intAccountId: number;
  intBusinessId: number;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  application: Application;
}
export interface Application {
  intMasterLocationId: number;
  intAccountId: number;
  intBusinessId: number;
  strLongitude: string;
  strLatitude: string;
  strPlaceName: string;
  strAddress: string;
  isActive: boolean;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
  dteCreatedAt: string;
  intCreatedBy: number;
  dteUpdatedAt: string;
  intUpdatedBy: number;
}
