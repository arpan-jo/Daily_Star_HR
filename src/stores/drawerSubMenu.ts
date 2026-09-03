import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const DrawerSubMenuStore = types.model('DrawerSubMenuStore', {
  name: types.maybeNull(types.string || types.undefined),
});

export type DrawerSubMenuType = Instance<typeof DrawerSubMenuStore>;
export type DrawerSubMenuSnapshotType = SnapshotOut<typeof DrawerSubMenuStore>;
