import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const MenuTabStore = types.model('MenuTabStore', {
  isLoad: types.maybeNull(types.boolean),
});

export type MenuTabType = Instance<typeof MenuTabStore>;
export type MenuTabSnapshotType = SnapshotOut<typeof MenuTabStore>;
