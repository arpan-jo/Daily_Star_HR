import { SnapshotOrInstance, types, Instance } from 'mobx-state-tree';

// Role model for dashboard
export const DashboardRoleModel = types.model('DashboardRole', {
  value: types.number,
  label: types.string,
});

// Employee Dashboard model (single profile)
export const EmployeeDashboardModel = types.model('EmployeeDashboardProfile', {
  employeeId: types.number,
  employeeName: types.maybeNull(types.string),
  employeeCode: types.maybeNull(types.string),
  departmentName: types.maybeNull(types.string),
  designationName: types.maybeNull(types.string),
  employmentType: types.maybeNull(types.string),
  employeeProfileUrlId: types.maybeNull(types.number),
  attendanceStatus: types.maybeNull(types.string),
  workingPeriod: types.maybeNull(types.string),
  checkIn: types.maybeNull(types.string),
  checkOut: types.maybeNull(types.string),
  myPendingApplicationCount: types.maybeNull(types.number),
  serviceLength: types.maybeNull(types.string),
  joiningDate: types.maybeNull(types.string),
  confirmationDate: types.maybeNull(types.string),
  calendarName: types.maybeNull(types.string),
  calendarStartTime: types.maybeNull(types.string),
  calendarEndTime: types.maybeNull(types.string),
  defaultDashboardId: types.maybeNull(types.number),
  userRole: types.maybeNull(types.string),
  dashboardRoles: types.optional(types.array(DashboardRoleModel), []),
  supervisor: types.maybeNull(types.string),
  intSupervisorImageUrlId: types.maybeNull(types.number),
  dottedSupervisor: types.maybeNull(types.string),
  intDottedSupervisorImageUrlId: types.maybeNull(types.number),
  lineManager: types.maybeNull(types.string),
  intLineManagerImageUrlId: types.maybeNull(types.number),
  monthName: types.maybeNull(types.string),
  workingDays: types.maybeNull(types.number),
  presentDays: types.maybeNull(types.number),
  lateDays: types.maybeNull(types.number),
  absentDays: types.maybeNull(types.number),
  movementDays: types.maybeNull(types.number),
  leaveDays: types.maybeNull(types.number),
  balanceMaxValue: types.maybeNull(types.number),
  balanceMinValue: types.maybeNull(types.number),
  takenMaxValue: types.maybeNull(types.number),
  takenMinValue: types.maybeNull(types.number),
  leaveBalanceHistoryList: types.maybeNull(types.frozen()),
  attendanceSummaryViewModel: types.maybeNull(types.frozen()),
  applicationPendingViewModels: types.maybeNull(types.frozen()),
});

// Full API response wrapper
export const FullDashboardResponseModel = types.model('FullDashboardResponse', {
  employeeDashboardViewModel: types.maybe(EmployeeDashboardModel),
  midLevelDashboardViewModel: types.maybe(types.frozen()),
  topLevelDashboardViewModel: types.maybe(types.frozen()),
});

// Type exports
export type EmployeeDashboardStoreType = SnapshotOrInstance<
  typeof EmployeeDashboardModel
>;
export type EmployeeDashboardSnapshotType = Instance<
  typeof EmployeeDashboardModel
>;
export type FullDashboardResponseStoreType = SnapshotOrInstance<
  typeof FullDashboardResponseModel
>;
