import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

export const StperModel = types.model('Steper', {
  id: types.identifier,
  step: types.maybeNull(types?.number),
  empId: types.maybeNull(types?.number),
});

export type StperModelType = SnapshotOrInstance<typeof StperModel>;
export type SteperType = Instance<typeof StperModel>;
