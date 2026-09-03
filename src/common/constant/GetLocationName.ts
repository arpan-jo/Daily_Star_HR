import { httpRequest } from './httpRequest';
import { getRequestIdentity } from './OpenMapIdentity';
import { openMap } from '../../../App';
import { CacheLocationType } from '../../stores/cacheLocation';
import { getDistanceInMeters } from '../services/getDistanceInMeters';

const NEARBY_RADIUS_METERS = 50;

interface GetLocationNameParams {
  latitude: number;
  longitude: number;
  cacheLocation?: CacheLocationType | null;
  cacheLocationSave: (entry: {
    latitude: number;
    longitude: number;
    locationName: string;
  }) => void;
  userInfo?: any;
}

export const getLocationName = async ({
  latitude,
  longitude,
  cacheLocation,
  cacheLocationSave,
  userInfo,
}: GetLocationNameParams): Promise<string> => {
  try {
    if (
      latitude === undefined ||
      longitude === undefined ||
      latitude === null ||
      longitude === null
    ) {
      return '';
    }

    // =========================
    // CACHE CHECK
    // =========================
    if (
      cacheLocation?.latitude &&
      cacheLocation?.longitude &&
      cacheLocation?.locationName
    ) {
      const distance = getDistanceInMeters(
        latitude,
        longitude,
        cacheLocation?.latitude,
        cacheLocation?.longitude,
      );

      if (distance <= NEARBY_RADIUS_METERS) {
        console.log(
          `📍 CACHE HIT (${distance.toFixed(1)}m) → ${
            cacheLocation?.locationName
          }`,
        );

        return cacheLocation?.locationName;
      }
    }

    // =========================
    // API CALL
    // =========================
    const identity = getRequestIdentity();

    const apiParams = {
      url: '/reverse.php',
      data: {
        format: 'jsonv2',
        zoom: 18,
        lat: latitude,
        lon: longitude,
      },
      baseURL: openMap,
      referer: identity?.referer || userInfo?.strUrl,
      userAgent: identity?.userAgent || 'PeopleDesk/19.7.3(arpan@ibos.io)',
    };

    const res = await httpRequest(apiParams, () => {});
    console.log('location api hit', res);

    const locationName = res?.display_name || '';

    // =========================
    // SAVE CACHE
    // =========================
    if (locationName) {
      cacheLocationSave({
        latitude,
        longitude,
        locationName,
      });
    }

    return locationName;
  } catch (error) {
    console.log('❌ reverse-geocode failed:', error);
    return '';
  }
};
