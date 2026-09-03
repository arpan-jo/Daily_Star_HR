import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const AudioRecordStore = types.model('AudioRecordStore', {
  isRecord: types.maybeNull(types.boolean),
});

export type AudioIsRecordType = Instance<typeof AudioRecordStore>;
export type AudioIsRecordTypeSnapshotType = SnapshotOut<
  typeof AudioRecordStore
>;
