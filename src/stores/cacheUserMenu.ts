import {
  Instance,
  types,
  IAnyModelType,
  SnapshotOrInstance,
  SnapshotOut,
} from 'mobx-state-tree';

export const UserMenuModel: IAnyModelType = types.model('UserMenuList', {
  id: types.identifierNumber,
  label: types.maybeNull(types?.string),
  parentId: types.maybeNull(types?.number),
  to: types.maybeNull(types?.string),
  icon: types.maybeNull(types?.string),
  isFirstLabel: types.maybeNull(types?.boolean),
  isSecondLabel: types.maybeNull(types?.boolean),
  isThirdLabel: types.maybeNull(types?.boolean),
  thirdLabelSl: types.maybeNull(types?.string),
  childList: types.optional(
    types.array(types.late((): IAnyModelType => UserMenuModel)),
    [],
  ),
});

export type UserMenuModelType = SnapshotOrInstance<typeof UserMenuModel>;
export type UserMenuType = Instance<typeof UserMenuModel>;
export type UserMenuSnapshotType = SnapshotOut<typeof UserMenuModel>;
