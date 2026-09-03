import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

export const TrackOnOrOfModel = types.model('TrackOnOrOf', {
  isTrackOn: types.maybeNull(types?.boolean),
  isDriverOnRunning: types.maybeNull(types?.boolean),
  vehicleId: types.maybeNull(types.number),
  driverId: types.maybeNull(types.number),
  tripId: types.maybeNull(types.number),
});

export type TrackOnOrOfModelType = SnapshotOrInstance<typeof TrackOnOrOfModel>;
export type TrackOnOrOfType = Instance<typeof TrackOnOrOfModel>;
