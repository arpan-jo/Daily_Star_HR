import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

export const SelectedBusinessUnitModel = types.model('SelectedBusinessUnit', {
  businessUnitId: types.maybeNull(types?.number),
  businessUnitName: types.maybeNull(types?.string),
  sbuId: types.maybeNull(types?.number),
});

export type SelectedBusinessUnitModelType = SnapshotOrInstance<
  typeof SelectedBusinessUnitModel
>;
export type SelectedBusinessUnitType = Instance<
  typeof SelectedBusinessUnitModel
>;
