import { useIsFocused } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  NativeModules,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import Geolocation from 'react-native-geolocation-service';

import Column from '../../../../common/components/Column';
import CustomTextNew from '../../../../common/components/CustomText';
import MapLocModal from '../../../../common/components/MapLocModal';
import Row from '../../../../common/components/Row';
import { IMAGES } from '../../../../common/constant/Index';
import { LocationPermission } from '../../../../common/constant/LocationPermission';
import { COLORS } from '../../../../common/constant/Themes';

import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { _todayDateTime } from '../../../../common/services/todayDate';
import { requestBluetoothPermissions } from '../../../../services/SaaS-modules/notification/notification';

import { getLocationName } from '../../../../common/constant/GetLocationName';
import { getDistanceInMeters } from '../../../../common/services/getDistanceInMeters';
import { minutesOfDay } from '../../../../common/services/minutesOfDay';

import { observer } from 'mobx-react-lite';
const { MqttModule } = NativeModules || {};

// one default for both the OS-level filter and the publish gate — they disagreed (0.1 vs 10)
const DEFAULT_SYNC_DISTANCE_M = 10;

// Office-hours fallback when the config has no usable window. Must match
// MqttService.DEFAULT_FROM_MINUTES / DEFAULT_TO_MINUTES.
const DEFAULT_FROM_MINUTES = 6 * 60;
const DEFAULT_TO_MINUTES = 18 * 60;

const GpsLocationLog = ({
  locationConfig,
  clearPreviousLocations,
  previousLocationList,
  addPreviousLocation,
  trackOnOrOfFunc,
  trackOnOrOf,
  userInfo,
  cacheLocation,
  cacheLocationSave,
}: any) => {
  const [location, setLocation] = useState<any>();
  const [locationName, setLocatonName] = useState<any>();
  // ref, not state: the cleanup closure must see the *current* watch id
  const watchIdRef = useRef<number | null>(null);
  const isFocused = useIsFocused();
  const [modalShow, setModalShow] = useState(false);

  // On mount: get one-shot location and resolve name immediately (cache will hit)
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return;

      resolveInitialLocationName();
    },
    [isFocused],
  );

  // 🔥 Single effect for service lifecycle + location watching.
  // Plain useEffect: useAsyncEffect's 2-arg form silently drops the returned cleanup.
  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;

    (async () => {
      if (isWithinWorkingHour() || trackOnOrOf?.isTrackOn) {
        console.log('✅ Start conditions met - Starting real-time tracking');
        const hasPermission = await LocationPermission();
        const respo = await requestBluetoothPermissions();
        if (!hasPermission && !respo) return;
        if (!isMounted()) return;

        // Needed for tracking to survive the app being swiped away.
        await requestKillModeSurvival();
        if (!isMounted()) return;

        // 1. Connect to MQTT
        await connectForeground();
        // 2. Start MQTT background service
        const isConnected = await startService();
        if (isConnected && isMounted()) {
          // 3. Start watching position in real-time
          startWatchingPosition(isMounted);
        }
      } else {
        // Stop only the UI watcher. The service pauses its own radios outside the
        // window and must stay alive to resume at the start of the next office-hours
        // window without the app being reopened. Explicit toggle-off stops it.
        stopWatchingPosition();
        clearPreviousLocations();
      }
    })();

    // 🔑 Cleanup on unmount / dep change. Deliberately does NOT stop the service:
    // its lifetime is owned by the tracking toggle and the office-hours window, not by
    // this screen being mounted — stopping it here killed background tracking as soon
    // as the user navigated away.
    return () => {
      mounted = false;
      stopWatchingPosition();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackOnOrOf?.isTrackOn, locationConfig?.isWorkingDay, isFocused]);

  // ---- Real-time Location Watching ----
  const startWatchingPosition = (isMounted: () => boolean) => {
    // Clear any existing watcher (0 is a valid watch id — compare to null)
    stopWatchingPosition();

    watchIdRef.current = Geolocation.watchPosition(
      async position => {
        if (!isMounted()) return;

        if (position?.mocked) {
          setLocation(null);
          return;
        }

        const newLocation = position?.coords;
        if (newLocation) {
          setLocation(newLocation);

          // Check if we should send this location based on distance
          if (shouldSendLocation(newLocation)) {
            // resolve the address BEFORE publishing, else every point ships
            // the previous point's address (and '' for the first one)
            const address = await getLocationAddress(newLocation);
            if (!isMounted()) return;
            updatePublishTemplate(newLocation, address);

            // Update previous locations
            addPreviousLocation({
              id: Date.now().toString(),
              latitude: newLocation.latitude,
              longitude: newLocation.longitude,
              accuracy: newLocation.accuracy,
              timestamp: new Date().toISOString(),
              lastupdateTime: _todayDateTime(),
              ditance: haversineDistance(
                newLocation.latitude,
                newLocation.longitude,
              ),
            });
          }
        }
      },
      error => {
        console.log('❌ Location watch error:', error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: true,
        distanceFilter: locationConfig?.distanceToLocationSync || DEFAULT_SYNC_DISTANCE_M, // Minimum distance in meters between updates
        interval: 5000, // Update interval in ms
        fastestInterval: 3000, // Fastest update interval
        useSignificantChanges: false,
      },
    );

    console.log('📍 Started real-time location tracking');
  };
  const resolveInitialLocationName = () => {
    Geolocation.getCurrentPosition(
      async position => {
        if (position?.mocked) {
          Alert.alert(
            'Fake Location Detected',
            'Mock location is not allowed. Please turn off mock location and try again.',
          );
          setLocation(null);
          return;
        }
        const coords = position?.coords;
        if (coords) {
          setLocation(coords);

          const resolvedName = await getLocationName({
            latitude: coords.latitude,
            longitude: coords.longitude,
            cacheLocation,
            cacheLocationSave,
            userInfo,
          });
          if (resolvedName) setLocatonName(resolvedName);
        }
      },
      err => console.log('❌ Initial location fetch failed:', err),
      {
        enableHighAccuracy: false, // coarse is fine for cache lookup
        timeout: 5000, // fail fast on cold start
        maximumAge: 60000, // reuse any fix from the last minute
      },
    );
  };

  const stopWatchingPosition = () => {
    if (watchIdRef.current !== null) {
      Geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      console.log('📍 Stopped real-time location tracking');
    }
  };

  // ---- Check if we should send location based on distance ----
  const shouldSendLocation = (newLocation: any): boolean => {
    if (!previousLocationList?.[0]) return true; // Always send first location

    const distance = haversineDistance(
      newLocation.latitude,
      newLocation.longitude,
    );
    const minDistance =
      locationConfig?.distanceToLocationSync || DEFAULT_SYNC_DISTANCE_M;

    return distance >= minDistance;
  };

  // ---- Service functions ----
  const stopService = () => {
    // optional-chain the *call*, not just the module — `undefined.then` throws
    MqttModule?.stopService?.()
      ?.then(() => {
        console.log('🛑 MQTT Service stopped');
      })
      ?.catch(console.error);
  };

  const connectForeground = async () => {
    // const hasPermission = await LocationPermission();
    // if (!hasPermission) return;
    MqttModule.connect()
      .then(() => {
        MqttModule.subscribe('iboslimited', 1);
      })
      .catch(console.error);
  };

  /**
   * Doze exemption keeps the service alive after a swipe-away; the exact-alarm grant
   * lets it be restarted if the OS kills the process anyway. Both open a system screen
   * at most once — they resolve true when already granted.
   */
  const requestKillModeSurvival = async () => {
    try {
      await MqttModule?.requestIgnoreBatteryOptimizations?.();
      await MqttModule?.requestExactAlarmPermission?.();
    } catch (err) {
      console.log('⚠️ Kill-mode permission request skipped:', err);
    }
  };

  const startService = async (): Promise<boolean> => {
    try {
      await MqttModule?.startService();
      console.log('🚀 MQTT Service started');
      return true;
    } catch (err) {
      console.error('❌ Failed to start service:', err);
      return false;
    }
  };

  /**
   * Refresh the template MqttService publishes from — it stamps live coordinates onto
   * this and owns the actual send, foreground and background alike. Publishing here
   * as well put every point on the broker twice while the app was foregrounded.
   */
  const updatePublishTemplate = (position: any, address?: string) => {
    if (userInfo?.intEmployeeId) {
      const data = {
        employeeId: userInfo?.intEmployeeId,
        address: address || locationName || '',
        actionBy: userInfo?.intEmployeeId,
        isVehicle: false,
        latitude: position?.latitude?.toString(),
        longitude: position?.longitude?.toString(),
        createDateTime: _todayDateTime(),
        accuracy: position?.accuracy?.toFixed(2),
        speed: position?.speed,
        heading: position?.heading,
        distanceToLocationSync:
          locationConfig?.distanceToLocationSync || DEFAULT_SYNC_DISTANCE_M,
        // Office-hours window as minutes-of-day so the native service can keep
        // enforcing it every day while the app is backgrounded or killed.
        workingFromMinutes:
          minutesOfDay(locationConfig?.workingHourFrom) ?? DEFAULT_FROM_MINUTES,
        workingToMinutes:
          minutesOfDay(locationConfig?.workingHourTo) ?? DEFAULT_TO_MINUTES,
        isWorkingDay: !!locationConfig?.isWorkingDay,
      };

      MqttModule?.setPublishTemplate?.('iboslimited', JSON.stringify(data))?.catch(
        console.error,
      );
    }
  };

  const getLocationAddress = async (locationData: any) => {
    if (locationData?.latitude && locationData?.longitude) {
      // const identity = getRequestIdentity();
      // try {
      //   const api_params2 = {
      //     url: '/reverse.php',
      //     data: {
      //       format: 'jsonv2',
      //       zoom: 18,
      //       lat: location?.latitude,
      //       lon: location?.longitude,
      //     },
      //     baseURL: openMap,
      //     referer: identity?.referer || userInfo?.strUrl,
      //     userAgent: identity?.userAgent || 'PeopleDesk/19.7.3(arpan@ibos.io)',
      //   };
      //   const res = await httpRequest(api_params2, () => {});
      //   setLocatonName(res);
      // } catch (error) {
      //   console.log('❌ Reverse geocoding error:', error);
      // }
      const nameOfLocation = await getLocationName({
        latitude: locationData?.latitude,
        longitude: locationData?.longitude,
        cacheLocation,
        cacheLocationSave,
        userInfo,
      });
      setLocatonName(nameOfLocation);
      return nameOfLocation;
    }
  };

  // ---- Utils ----
  // distance from the last recorded point; 0 when there is no previous point
  const haversineDistance = (lat2: any, lon2: any) => {
    const prev = previousLocationList?.[0];
    if (!prev?.latitude || !prev?.longitude) return 0;
    return Math.round(
      getDistanceInMeters(prev.latitude, prev.longitude, lat2, lon2) || 0,
    );
  };

  const isWithinWorkingHour = () => {
    const now = dayjs();
    const from = dayjs(locationConfig?.workingHourFrom);
    const to = dayjs(locationConfig?.workingHourTo);

    const isWorkingHour = now.isAfter(from) && now.isBefore(to);
    return isWorkingHour && locationConfig?.isWorkingDay;
  };

  const toggleSwitch = () => {
    const newTrackState = !trackOnOrOf?.isTrackOn;
    trackOnOrOfFunc({
      isTrackOn: newTrackState,
      isDriverOnRunning: trackOnOrOf?.isDriverOnRunning || false,
      vehicleId: trackOnOrOf?.vehicleId || 0,
      driverId: trackOnOrOf?.driverId || 0,
      tripId: trackOnOrOf?.tripId || 0,
    });

    if (!newTrackState) {
      stopWatchingPosition();
      stopService();
    }
  };

  // Rest of your component JSX remains the same...
  return (
    <>
      <Row
        align="center"
        justify="center"
        rowStyle={[styles.paddingHorizontalAndVertical, { paddingTop: 10 }]}
      >
        <Column colWidth="15%">
          <TouchableOpacity
            disabled={!isWithinWorkingHour() ? true : false}
            // disabled={true}
            onPress={() => {
              if (Platform.OS === 'android') {
                setModalShow(true);
              }
            }}
          >
            <FastImage
              source={IMAGES.locationMap}
              resizeMode="contain"
              style={[styles.profileImage, { borderRadius: 0 }]}
            />
          </TouchableOpacity>
        </Column>
        <Column colWidth="85%" colStyle={styles.topBottomTextContainer}>
          <Column colWidth="100%">
            <Row align="center" justify="space-between">
              <Column colStyle={{ flexDirection: 'row' }}>
                <CustomTextNew
                  text={`${
                    isWithinWorkingHour() || trackOnOrOf?.isTrackOn
                      ? 'GPS ON'
                      : 'GPS OFF'
                  }`}
                  txtColor={`${
                    isWithinWorkingHour() || trackOnOrOf?.isTrackOn
                      ? COLORS.primary
                      : COLORS.textNewBold
                  }`}
                  txtWeight={'500'}
                  txtStyle={{
                    color:
                      isWithinWorkingHour() || trackOnOrOf?.isTrackOn
                        ? COLORS.primary
                        : COLORS.darkGray,
                    fontWeight: '500',
                    fontSize: 16,
                  }}
                />
              </Column>

              <Column>
                <Switch
                  trackColor={{ false: COLORS.darkGray, true: COLORS.primary }}
                  thumbColor={
                    trackOnOrOf?.isTrackOn ? COLORS.white : COLORS.lightGray
                  }
                  ios_backgroundColor={COLORS.darkGray}
                  onValueChange={toggleSwitch}
                  value={trackOnOrOf?.isTrackOn}
                />
              </Column>
            </Row>

            {isWithinWorkingHour() || trackOnOrOf?.isTrackOn ? (
              <Column colWidth="100%">
                <Row align="center" justify="space-between">
                  <Column colStyle={{ flexDirection: 'row' }}>
                    <CustomTextNew
                      text={`Accuracy: ${
                        location?.accuracy?.toFixed(2) || 'N/A'
                      }m`}
                      txtColor={COLORS.graySubText}
                    />
                    <CustomTextNew
                      text={`Distance: ${
                        previousLocationList?.[0]?.ditance || '0'
                      } Meters`}
                      txtColor={COLORS.graySubText}
                      txtStyle={{ marginLeft: 6 }}
                    />
                  </Column>
                </Row>

                <Row align="center" justify="space-between">
                  <Column colStyle={{ flexDirection: 'row' }} colWidth={'95%'}>
                    <Text
                      style={{
                        fontSize: 14,
                        lineHeight: 20,
                        paddingTop: 2,
                        color: COLORS.graySubText,
                      }}
                    >
                      Current Location |{' '}
                      <Text
                        numberOfLines={2}
                        style={{
                          fontSize: 14,
                          color: COLORS.black,
                          fontStyle: 'italic',
                        }}
                      >
                        {`${locationName || 'Getting location...'}`}
                      </Text>
                    </Text>
                  </Column>
                </Row>
              </Column>
            ) : (
              <Column colWidth="100%">
                <CustomTextNew text={'Not Tracked'} txtSize={25} />
              </Column>
            )}
          </Column>
        </Column>
      </Row>

      <MapLocModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        location={location}
      />
    </>
  );
};

// export default GpsLocationLog;
export default observer(GpsLocationLog);

const styles = StyleSheet.create({
  paddingHorizontalAndVertical: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 5,
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 50,
    backgroundColor: COLORS.iconGrayBackground,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  topBottomTextContainer: {
    paddingLeft: 16,
  },
  imgCon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  idParentContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openButton: {
    backgroundColor: '#F194FF',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
