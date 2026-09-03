export interface EmpDashboardDataType {
  employeeDashboardViewModel: EmployeeDashboardViewModel;
  midLevelDashboardViewModel?: null;
  topLevelDashboardViewModel?: null;
}
export interface EmployeeDashboardViewModel {
  employeeId: number;
  employeeName: string;
  attendanceStatus: string;
  workingPeriod: string;
  checkIn: string;
  checkOut: string;
  myPendingApplicationCount?: null;
  serviceLength: string;
  joiningDate: string;
  confirmationDate?: null;
  calendarName: string;
  calendarStartTime: string;
  calendarEndTime: string;
  defaultDashboardId?: null;
  userRole: string;
  dashboardRoles?: DashboardRolesEntity[] | null;
  supervisor: string;
  lineManagerEnroll?: number;
  supervisorEnroll?: number;
  intSupervisorImageUrlId: number;
  dottedSupervisor: string;
  intDottedSupervisorImageUrlId: number;
  lineManager: string;
  intLineManagerImageUrlId: number;
  monthName: string;
  workingDays?: null;
  presentDays?: null;
  lateDays?: null;
  absentDays?: null;
  movementDays?: null;
  leaveDays?: null;
  balanceMaxValue: number;
  balanceMinValue: number;
  takenMaxValue: number;
  takenMinValue: number;
  employeeCode: string;
  departmentName: string;
  designationName: string;
  employmentType: string;
  employeeProfileUrlId: number;
  leaveBalanceHistoryList?: LeaveBalanceHistoryListEntity[] | null;
  attendanceSummaryViewModel: AttendanceSummaryViewModel;
  applicationPendingViewModels?: ApplicationPendingViewModelsEntity[] | null;
}
export interface DashboardRolesEntity {
  value: number;
  label: string;
}
export interface LeaveBalanceHistoryListEntity {
  leaveBalanceId: number;
  leaveTypeId: number;
  leaveTypeCode: string;
  leaveType: string;
  remainingDays: number;
  leaveTakenDays: number;
  balanceDays: number;
  remainingDaysForApp: number;
  leaveTakenDaysForApp: number;
  balanceDaysForApp: number;
  intBalanceLveInDay: number;
  intTakenLveInDay: number;
  strLeaveType: number;
}
export interface AttendanceSummaryViewModel {
  workingDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  movementDays: number;
  leaveDays: number;
  attendanceDailySummaryViewModel?:
    | AttendanceDailySummaryViewModelEntity[]
    | null;
  timeAttendanceDailySummaries?: TimeAttendanceDailySummariesEntity[] | null;
}
export interface AttendanceDailySummaryViewModelEntity {
  dayName: string;
  dayNumber: number;
  presentStatus: string;
}
export interface TimeAttendanceDailySummariesEntity {
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
  intPunchCount: number;
  intCalendarTypeId: number;
  strCalendarType: string;
  intCalendarId: number;
  strCalendarName: string;
  dteNextChangeDate: string;
  dteStartTime: string;
  dteExtendedStartTime: string;
  dteLastStartTime: string;
  dteEndTime: string;
  tmeInTime?: string | null;
  tmeLastOutTime?: string | null;
  numMinWorkHour: number;
  isProcess: boolean;
  dteProcessDateTime?: null;
  strWorkingHours?: string | null;
  isWorkingDayCal: number;
  intRosterGroupId: number;
  strRosterGroupName: string;
  intCreatedBy: number;
  dteCreatedAt: string;
  isAutoGenerate: boolean;
  isManual?: null;
  dteGenerateDate: string;
}
export interface ApplicationPendingViewModelsEntity {
  applicationType: string;
  applicationDate: string;
  approvalStatus: string;
}

//notice
export interface NoticeType {
  intAnnouncementId: number;
  intAccountId: number;
  intBusinessUnitId: number;
  strTitle: string;
  strDetails: string;
  intTypeId: number;
  strTypeName: string;
  dteExpiredDate: string;
  intCreatedBy: number;
  dteCreatedAt: string;
  isActive: boolean;
}

//policy
export interface AllPolicyType {
  acknowledgeCount: number;
  businessUnitId: number;
  businessUnitList: string;
  departmentList: string;
  policyCategoryId: number;
  policyCategoryName: string;
  policyCreateDate: string;
  policyFileName: string;
  policyFileUrlId: number;
  policyId: number;
  policyTitle: string;
}

//profile data Type
export interface ProfileDataType {
  empEmployeeAddress?: null[] | null;
  empEmployeeBankDetail: EmpEmployeeBankDetail;
  empEmployeeEducation?: null[] | null;
  empEmployeeJobHistory?: null[] | null;
  empEmployeePhotoIdentity: EmpEmployeePhotoIdentity;
  empEmployeeRelativesContact?: null[] | null;
  empEmployeeTraining?: null[] | null;
  empJobExperience?: null[] | null;
  empSocialMedia?: null[] | null;
  employeeProfileLandingView: EmployeeProfileLandingView;
}
export interface EmpEmployeeBankDetail {
  dteCreatedAt: string;
  dteUpdatedAt: string;
  intAccountId: number;
  intBankBranchId?: null;
  intBankOrWalletType: number;
  intBankWalletId: number;
  intBusinessUnitId: number;
  intCreatedBy: number;
  intEmployeeBankDetailsId: number;
  intEmployeeBasicInfoId: number;
  intUpdatedBy: number;
  intWorkplaceId: number;
  isActive: boolean;
  isPrimarySalaryAccount: boolean;
  strAccountName: string;
  strAccountNo: string;
  strBankWalletName: string;
  strBranchName: string;
  strDistrict: string;
  strRoutingNo: string;
  strSwiftCode?: null;
}
export interface EmpEmployeePhotoIdentity {
  dteCreatedAt: string;
  dteUpdatedAt?: null;
  intBirthIdfileUrlId?: null;
  intCreatedBy: number;
  intEmployeeBasicInfoId: number;
  intEmployeePhotoIdentityId: number;
  intNidfileUrlId?: null;
  intPassportFileUrlId?: null;
  intProfilePicFileUrlId: number;
  intProfilePicFormalFileUrlId?: null;
  intSignatureFileUrlId?: null;
  intUpdatedBy?: null;
  isActive: boolean;
  strBiography?: null;
  strBirthId?: null;
  strHobbies?: null;
  strNationality?: null;
  strNid?: null;
  strPassport?: null;
}
export interface EmployeeProfileLandingView {
  dteConfirmationDate?: null;
  dteCreatedAt: string;
  dteDateOfBirth: string;
  dteJoiningDate: string;
  dteLastWorkingDate?: null;
  dteUpdatedAt: string;
  intAccountId: number;
  intBusinessUnitId: number;
  intCalenderId: number;
  intCalenderTypeId: number;
  intCountryId?: null;
  intCreatedBy: number;
  intDepartmentId: number;
  intDesignationId: number;
  intDetailsId: number;
  intDottedSupervisorId: number;
  intEmployeeBasicInfoId: number;
  intEmployeeImageUrlId: number;
  intEmployeeStatusId: number;
  intEmploymentTypeId: number;
  intGenderId: number;
  intHrpositionId: number;
  intLineManagerId: number;
  intLinemanagerImageUrlId: number;
  intPayrollGroupId: number;
  intPayscaleGradeId: number;
  intReligionId: number;
  intSupervisorId: number;
  intSupervisorImageUrlId: number;
  intUpdatedBy: number;
  intUserId?: null;
  intUserTypeId?: null;
  intWorkplaceGroupId: number;
  intWorkplaceId: number;
  isActive: boolean;
  isRemoteAttendance: boolean;
  isSalaryHold: boolean;
  isTakeHomePay?: null;
  isUserInactive: boolean;
  strAccountName: string;
  strBloodGroup: string;
  strBusinessUnitName: string;
  strCalenderName: string;
  strCalenderType: string;
  strCardNumber: string;
  strCountry?: null;
  strDepartment: string;
  strDesignation: string;
  strDottedSupervisorName: string;
  strEmployeeCode: string;
  strEmployeeName: string;
  strEmployeeStatus: string;
  strEmploymentType: string;
  strGender: string;
  strHrpostionName: string;
  strLinemanager: string;
  strLoginId?: null;
  strMaritalStatus: string;
  strOfficeMail: string;
  strOfficeMobile?: null;
  strPassword?: null;
  strPayrollGroupName: string;
  strPayscaleGradeName: string;
  strPersonalEmail?: null;
  strPersonalMail: string;
  strPersonalMobile: string;
  strReligion: string;
  strServiceLength: string;
  strSupervisorName: string;
  strUserType?: null;
  strWorkplaceGroupName: string;
  strWorkplaceName: string;
  userStatus?: null;
  strReferenceId?: string;
}

export interface PalyslipLandingType {
  intSalaryGenerateRow: number;
  intSalaryGenerateHeaderId: number;
  intEmployeeId: number;
  intPayrollElementId: number;
  strPayrollElement: string;
  numAmount: number;
  numArrear: number;
  numTotal: number;
  strPayrollElementCode?: null;
  intPayrollElementTypeId: number;
  intMonthId: number;
  intYearId: number;
  dteCreatedAt: string;
  intCreatedBy?: null;
  dteUpdatedAt?: null;
  intUpdatedBy?: null;
}
export interface PalyslipHeadDataType {
  intSalaryGenerateHeaderId: number;
  intSalaryGenerateRequestId: number;
  intSalaryPolicyId: number;
  strSalaryPolicyName: string;
  intEmployeeId: number;
  strEmployeeCode: string;
  strEmployeeName: string;
  intEmploymentTypeId: number;
  strEmploymentType: string;
  intEmployeeStatusId: number;
  strEmployeeStatus: string;
  intDepartmentId: number;
  strDepartment: string;
  intDesignationId: number;
  strDesignation: string;
  dteJoiningDate: string;
  strServiceLength: string;
  strOfficialEmail: string;
  strContactNumber?: null;
  dteDateOfBirth: string;
  strAge: string;
  dteSalaryGenerateFor: string;
  strAccountName: string;
  strPaymentBankType: string;
  intFinancialInstitutionId: number;
  strFinancialInstitution: string;
  intBankBranchId?: null;
  strBankBranchName: string;
  strRoutingNumber: string;
  strAccountNo: string;
  intTotalWorkingDays: number;
  intPayableDays: number;
  intPresent: number;
  intAbsent: number;
  intLate: number;
  intOffDay: number;
  intHoliday: number;
  intMovement: number;
  intCasualLeave: number;
  intEarnLeave: number;
  intSickLeave: number;
  intMaternityLeave: number;
  intSpecialLeave: number;
  intAnnualLeave: number;
  intLWP: number;
  intPrivilegeLeave: number;
  intOthersLeave: number;
  numPerDaySalary: number;
  numPayableSalaryCal: number;
  numGrossSalary: number;
  numOverTimeHour?: null;
  numOverTimeAmount?: null;
  numLoanAmount: number;
  intMonthId: number;
  intYearId: number;
  intAccountId: number;
  intBusinessUnitId: number;
  strBusinessUnitName: string;
  intWorkplaceGroupId: number;
  strWorkplaceGroupName: string;
  intWorkplaceId: number;
  strWorkplaceName: string;
  intPayrollGroupId: number;
  strPayrollGroupName: string;
  intPayrollPeriodId?: null;
  strPayrollPeriod?: null;
  dtePayrollGenerateFrom: string;
  dtePayrollGenerateTo: string;
  dtePayrollGenerateDateTime: string;
  intGradeId: number;
  strGrade: string;
  intSlaveId?: null;
  strSlave?: null;
  numLowerLimit: number;
  numUpperLimit: number;
  numManualSalaryAddition: number;
  numManualSalaryDeduction: number;
  intManualSalaryAdjustmentBy?: null;
  dteManualSalaryAdjustmentDateTime?: null;
  isActive: boolean;
  isApprove?: null;
  strSalaryApprovedByUser?: null;
  dteSalaryApprovedDateTime?: null;
  isReject?: null;
  strSalaryRejectByUser?: null;
  dteSalaryRejectDateTime?: null;
  isPerday: boolean;
  numTaxAmount?: null;
  numPFAmount: number;
  numPFCompany?: null;
}

export interface SalaryCodeDataType {
  SalaryCode: string;
  SalaryGenerateRequestId: number;
  SalaryType: string;
  isActive: boolean;
}
