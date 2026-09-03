import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const UserInfoStore = types.model('UserInfoStore', {
  strLoginId: types.maybeNull(types.string),
  intAccountId: types.maybeNull(types.number),
  intUrlId: types.maybeNull(types.number),
  intBusinessUnitId: types.maybeNull(types.number),
  strBusinessUnit: types.maybeNull(types.string),
  intEmployeeId: types.maybeNull(types.number),
  strDisplayName: types.maybeNull(types.string),
  intProfileImageUrl: types.maybeNull(types.number),
  intLogoUrlId: types.maybeNull(types.number),
  intDefaultDashboardId: types.maybeNull(types.number),
  intDepartmentId: types.maybeNull(types.number),
  strDepartment: types.maybeNull(types.string),
  intDesignationId: types.maybeNull(types.number),
  strDesignation: types.maybeNull(types.string),
  intUserTypeId: types.maybeNull(types.number),
  intUserType: types.maybeNull(types.string),
  intRefferenceId: types.maybeNull(types.number),
  isOfficeAdmin: types.maybeNull(types.boolean),
  isSuperuser: types.maybeNull(types.boolean),
  isLoggedIn: types.maybeNull(types.boolean),
  dteLastLogin: types.maybeNull(types.string),
  token: types.maybeNull(types.string),
  isLoggedInWithOtp: types.maybeNull(types.boolean),
  strOfficeMail: types.maybeNull(types.string),
  strPersonalMail: types.maybeNull(types.string),
  isSupNLMORManagement: types.maybeNull(types.number),
  refreshToken: types.maybeNull(types.string),
  strUrl: types.maybeNull(types.string),
  intUserId: types.maybeNull(types.number),
  intErpUserId: types.maybeNull(types.number),
  connectionKEY: types.maybeNull(types.string),
  loginEmail: types.maybeNull(types.string),
  loginPassword: types.maybeNull(types.string),
  // 1. Supervisor, 2. Line Manager, 3. Management

  intWorkplaceGroupId: types.maybeNull(types.number),
  strWorkplaceGroup: types.maybeNull(types.string),
  intWorkplaceId: types.maybeNull(types.number),
  strWorkplace: types.maybeNull(types.string),
  originalWorkplaceGroupId: types.maybeNull(types.number),

  // extra part for supplier
  message: types.maybeNull(types.string),
  evaluationCriteriaOfPms: types.maybeNull(types.string),
  workPlaceId: types.maybeNull(types.number),
  workPlaceName: types.maybeNull(types.string),
  intSupplierId: types.maybeNull(types.number),
  intCustomerId: types.maybeNull(types.number),
  isOwner: types.maybeNull(types.boolean),
  businessPartnerClass: types.maybeNull(types.string),
  voipUserId: types.maybeNull(types.string),
  voipUserPassword: types.maybeNull(types.string),

  //for voip
  isVoipRegistration: types.maybeNull(types.boolean),
  extensionNumber: types.maybeNull(types.number),
  sip: types.maybeNull(types.string),
  exp: types.maybeNull(types.string),
  wsip: types.maybeNull(types.string),
  isNewDevice: types.maybeNull(types.boolean),
});

export type UserInfoStoreType = Instance<typeof UserInfoStore>;
export type UserInfoSnapshotType = SnapshotOut<typeof UserInfoStore>;
