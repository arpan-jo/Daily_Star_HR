import { Instance, SnapshotOrInstance, types } from 'mobx-state-tree';

export const PreviousLocationsModel = types.model('PreviousLocation', {
  id: types.identifier,
  latitude: types.maybe(types.number),
  longitude: types.maybe(types.number),
  altitude: types.maybe(types.string),
  accuracy: types.maybe(types.number),
  lastupdateTime: types.frozen(),
  itance: types.optional(types.number, 0),
  createDateTime: types.maybeNull(types.Date),
  timestamp: types.maybeNull(types.string),
});

export type PreviousLocationModelType = SnapshotOrInstance<
  typeof PreviousLocationsModel
>;
export type PreviousLocationType = Instance<typeof PreviousLocationsModel>;
