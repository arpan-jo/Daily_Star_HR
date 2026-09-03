import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

export const EmpModel = types.model('CartItem', {
  id: types.identifier,
  EmployeeId: types.maybeNull(types?.number),
  EmployeeName: types.maybeNull(types?.string),
  EmployeeCode: types.maybeNull(types?.string),
  DepartmentName: types.maybeNull(types?.string),
  DesignationName: types.maybeNull(types?.string),
  Phone: types.maybeNull(types?.string),
  Email: types.maybeNull(types?.string),
  intProfilePicFileUrlId: types.maybeNull(types?.number),
  intBusinessUnitId: types.maybeNull(types?.number),
  isClicked: types.maybeNull(types.boolean),
  strBusinessUnit: types.maybeNull(types?.string),
  isBookmarked: types.maybeNull(types.boolean),
  presentAddress: types.maybeNull(types?.string),
  strReferenceId: types.maybeNull(types?.string),
  isActive: types.maybeNull(types.boolean),
  createdBy: types.maybeNull(types?.number),
  updatedBy: types.maybeNull(types?.number),
  isResponsible: types.maybeNull(types.boolean),
  attendeeAutoId: types.maybeNull(types?.number),
  officeEmail: types.maybeNull(types?.string),
  OfficeEmail: types.maybeNull(types?.string),
});

export type EmpModelType = SnapshotOrInstance<typeof EmpModel>;
export type EmpType = Instance<typeof EmpModel>;
