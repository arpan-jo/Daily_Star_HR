import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const DrawerMenuStore = types.model('DrawerMenuStore', {
  name: types.maybeNull(types.string || types.undefined),
});

export type DrawerMenuType = Instance<typeof DrawerMenuStore>;
export type DrawerMenuSnapshotType = SnapshotOut<typeof DrawerMenuStore>;
