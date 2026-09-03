import { SnapshotOrInstance, types, Instance } from 'mobx-state-tree';

export const CacheLocationModel = types.model('CacheLocation', {
  latitude: types.maybeNull(types.number),
  longitude: types.maybeNull(types.number),
  locationName: types.maybeNull(types.string),
});

export type CacheLocationModelType = SnapshotOrInstance<
  typeof CacheLocationModel
>;
export type CacheLocationType = Instance<typeof CacheLocationModel>;
