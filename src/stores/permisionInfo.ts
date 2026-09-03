import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const PermisionInfoStore = types.model('PermisionInfoStore', {
  isSupervisorDashboard: types.maybeNull(types.boolean),
  isLeaveApproval: types.maybeNull(types.boolean),
  isMovementApproval: types.maybeNull(types.boolean),
  isAttendanceApproval: types.maybeNull(types.boolean),
  isManagement: types.maybeNull(types.boolean),
});

export type PermisionStoreType = Instance<typeof PermisionInfoStore>;
export type PermisionInfoSnapshotType = SnapshotOut<typeof PermisionInfoStore>;
