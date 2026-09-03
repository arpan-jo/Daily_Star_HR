// @ts-check
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import FontIcon from 'react-native-vector-icons/Fontisto';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRootStore } from '../../stores/rootStore';
import {
  GetEmployeeNearbyLocation,
  GetEmployeeSubordinateLocation,
  GetNearByPartner,
  GetVehicleNearbyLocation,
  LighterVesselLocationTracking,
  ShippingLocationTracking,
  truck_api_token,
} from '../api/api';
import { httpRequest } from '../constant/httpRequest';
import { COLORS } from '../constant/Themes';
import useThemeId from '../../hooks/useThemeId';
import { startMotionUpdates } from '../constant/UnifiedMotionActivity';
import CustomInputNew from './CustomInput';
import LoadingContainer from './Loading';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type MapTab =
  | 'nearby'
  | 'myTeam'
  | 'customer'
  | 'supplier'
  | 'vehicle'
  | 'truck'
  | 'ship'
  | 'lighter'
  | 'search';

type MotionActivity =
  | 'in_vehicle'
  | 'walking'
  | 'on_foot'
  | 'running'
  | ''
  | string;

interface LocationItem {
  strLatitude?: string;
  strlatitude?: string;
  strLongitude?: string;
  strlongitude?: string;
  strVehicleNo?: string;
  vesselname?: string;
  strActivity?: string;
  strEmployeeName?: string;
  strBusinessPartnerName?: string;
  strDriverName?: string;
  intEmployeeId?: number | string;
  strBusinessPartnerCode?: string;
  strPersonalMobile?: string;
  strContactNumber?: string;
  strDriverMobile?: string;
  dteCreatedAt?: string;
  // Truck API fields
  Latitude?: number;
  Longitude?: number;
  VehicleNo?: string;
  DateTime?: string;
}

interface MapLocModalProps {
  modalShow: boolean;
  setModalShow: (visible: boolean) => void;
  location?: { latitude: number; longitude: number };
  idForLocation?: number | string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_LAT = 23.8103; // Dhaka fallback
const DEFAULT_LNG = 90.4125;

const normalizeLat = (loc: LocationItem): number =>
  Number(loc?.strlatitude ?? loc?.strLatitude ?? DEFAULT_LAT);

const normalizeLng = (loc: LocationItem): number =>
  Number(loc?.strlongitude ?? loc?.strLongitude ?? DEFAULT_LNG);

/** Map truck API response shape to the internal LocationItem shape */
const normalizeTruckItem = (item: any): LocationItem => ({
  ...item,
  strLatitude: String(item?.Latitude ?? ''),
  strLongitude: String(item?.Longitude ?? ''),
  strVehicleNo: item?.VehicleNo,
  dteCreatedAt: item?.DateTime ? item.DateTime.replace(' ', 'T') : '',
});

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface MarkerIconProps {
  loc: LocationItem;
  activeTab: MapTab;
  color: string;
}

const LocationMarkerIcon: React.FC<MarkerIconProps> = ({
  loc,
  activeTab,
  color,
}) => {
  if (loc?.vesselname) {
    return <Icon name="directions-boat" size={24} color={color} />;
  }
  if (activeTab === 'lighter') {
    return <FontIcon name="ship" size={24} color={color} />;
  }
  if (activeTab === 'truck' || loc?.strVehicleNo) {
    return <MIcon name="truck" size={24} color={color} />;
  }

  const activity = loc?.strActivity?.trim();
  if (activity === 'In vehicle') {
    return <Icon name="directions-car" size={24} color={color} />;
  }
  if (activity === 'Running') {
    return <Icon name="directions-run" size={24} color={color} />;
  }
  if (activity === 'Walking') {
    return <Icon name="directions-walk" size={24} color={color} />;
  }
  if (activity === 'On bicycle') {
    return <MIcon name="bicycle" size={24} color={color} />;
  }

  return <Icon name="boy" size={24} color={color} />;
};

/** Icon for the current-user marker (blue), driven by device motion */
const SelfMarkerIcon: React.FC<{ activity: MotionActivity }> = ({
  activity,
}) => {
  const a = activity?.trim();
  if (a === 'in_vehicle') {
    return <Icon name="directions-car" size={24} color={COLORS.blue} />;
  }
  if (a === 'walking' || a === 'on_foot') {
    return <Icon name="directions-walk" size={24} color={COLORS.blue} />;
  }
  if (a === 'running') {
    return <Icon name="directions-run" size={24} color={COLORS.blue} />;
  }
  return <Icon name="boy" size={24} color={COLORS.blue} />;
};

interface CalloutCardProps {
  loc: LocationItem;
}

const CalloutCard: React.FC<CalloutCardProps> = ({ loc }) => {
  const phone =
    loc?.strPersonalMobile || loc?.strContactNumber || loc?.strDriverMobile;

  const handleCall = () => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`).catch(() =>
      console.warn('Call failed', JSON.stringify(loc, null, 2)),
    );
  };

  const name =
    loc?.strEmployeeName ||
    loc?.strBusinessPartnerName ||
    loc?.strDriverName ||
    loc?.vesselname ||
    'Unknown';

  const id = loc?.intEmployeeId || loc?.strBusinessPartnerCode || '';

  return (
    <Callout tooltip onPress={handleCall}>
      <TouchableOpacity style={styles.calloutCard} activeOpacity={0.8}>
        <Text style={styles.calloutName}>
          {`${name}${id ? ` [${id}]` : ''}`}
        </Text>
        {loc?.strVehicleNo ? (
          <Text style={styles.calloutDetail}>{loc.strVehicleNo}</Text>
        ) : null}
        {phone ? <Text style={styles.calloutDetail}>{phone}</Text> : null}
        {loc?.dteCreatedAt ? (
          <Text style={styles.calloutDetail}>
            {dayjs(loc.dteCreatedAt).format('DD-MM-YYYY, hh:mm A')}
          </Text>
        ) : null}
      </TouchableOpacity>
    </Callout>
  );
};

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const MapLocModal: React.FC<MapLocModalProps> = ({
  modalShow,
  setModalShow,
  location,
  idForLocation,
}) => {
  const isFocused = useIsFocused();
  const { userInfo } = useRootStore();
  const [empLocation, setEmpLocation] = useState<LocationItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<MapTab>('nearby');
  const [activity, setActivity] = useState<MotionActivity>('');

  const { control, setValue } = useForm<{ employee: string }>();
  const mapRef = useRef<MapView>(null);

  // ---------- Motion tracking ----------
  useEffect(() => {
    let stopUpdates: (() => void) | undefined;

    const init = async () => {
      stopUpdates = await startMotionUpdates((data: any) => {
        setActivity(data?.activity ?? '');
      });
      await fetchNearby();
    };

    init();
    return () => stopUpdates?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to "nearby" tab whenever the modal regains focus
  useEffect(() => {
    if (isFocused && modalShow) {
      setActiveTab('nearby');
    }
  }, [isFocused, modalShow, idForLocation]);

  // ---------- Data fetchers ----------

  const fetchNearby = async () => {
    const params = {
      url: GetEmployeeNearbyLocation,
      data: { EmployeeId: idForLocation || userInfo?.intEmployeeId },
    };
    const res = await httpRequest(params, setIsLoading);

    if (!Array.isArray(res)) {
      console.warn('fetchNearby: unexpected response', res);
      setEmpLocation([]);
      return;
    }

    // Remove the self-entry (first item) and cap at 100
    const trimmed = res.slice(1, 101);
    setEmpLocation(trimmed);
  };

  const fetchMyTeam = async () => {
    const res = await httpRequest(
      {
        url: GetEmployeeSubordinateLocation,
        data: { EmployeeId: idForLocation || userInfo?.intEmployeeId },
      },
      () => {},
    );
    setEmpLocation(Array.isArray(res) ? res : []);
  };

  const fetchPartners = async (partnerType: 1 | 2, search?: string) => {
    const res = await httpRequest(
      {
        url: GetNearByPartner,
        data: {
          PartnerType: partnerType,
          intId: search ? 0 : userInfo?.intBusinessUnitId,
          ...(search ? { Search: search } : {}),
        },
        baseURL: 'https://erp.peopledesk.io',
      },
      () => {},
    );
    setEmpLocation(Array.isArray(res) ? res : []);
  };

  const fetchVehicles = async () => {
    const res = await httpRequest(
      {
        url: GetVehicleNearbyLocation,
        data: { vehicleId: 0, businessUnitId: 0 },
        baseURL: 'https://erp.peopledesk.io',
      },
      () => {},
    );
    setEmpLocation(Array.isArray(res) ? res : []);
  };

  const fetchTrucks = async () => {
    // Step 1: get a short-lived token (credentials kept server-side via env)
    const resToken = await httpRequest(
      {
        url: truck_api_token,
        data: {
          username: process.env.TRUCK_API_USER,
          password: process.env.TRUCK_API_PASS,
        },
        method: 'post',
        baseURL: 'https://akij.vftracker.com',
      },
      () => {},
    );

    if (!resToken?.token) {
      console.warn('fetchTrucks: no token received');
      return;
    }

    try {
      const response = await axios({
        url: 'https://akij.vftracker.com/location_api/api/execute',
        method: 'POST',
        timeout: 10_000,
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${resToken.token}`,
        },
        data: '""',
      });

      const trucks: LocationItem[] = (response?.data?.device_details ?? []).map(
        normalizeTruckItem,
      );

      setEmpLocation(trucks);
    } catch (err: any) {
      console.error(
        'fetchTrucks API failed:',
        err?.response?.data ?? err?.message,
      );
    }
  };

  const fetchShips = async () => {
    const res = await httpRequest(
      { url: ShippingLocationTracking, baseURL: 'https://erp.peopledesk.io' },
      () => {},
    );
    setEmpLocation(Array.isArray(res) ? res : []);
  };

  const fetchLighters = async () => {
    const res = await httpRequest(
      {
        url: LighterVesselLocationTracking,
        baseURL: 'https://erp.peopledesk.io',
      },
      () => {},
    );
    setEmpLocation(Array.isArray(res) ? res : []);
  };

  // ---------- Tab press handlers ----------

  const handleTabPress = async (tab: MapTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'nearby':
        await fetchNearby();
        break;
      case 'myTeam':
        await fetchMyTeam();
        break;
      case 'customer':
        await fetchPartners(2);
        break;
      case 'supplier':
        await fetchPartners(1);
        break;
      case 'vehicle':
        await fetchVehicles();
        break;
      case 'truck':
        await fetchTrucks();
        break;
      case 'ship':
        await fetchShips();
        break;
      case 'lighter':
        await fetchLighters();
        break;
      case 'search':
        // Search tab shows an input; data loads on keystroke
        break;
    }
  };

  const handleSearchToggle = () => {
    setActiveTab(prev => (prev === 'search' ? 'nearby' : 'search'));
    if (activeTab === 'search') fetchNearby();
  };

  const handleClose = async () => {
    setModalShow(false);
    setActiveTab('nearby');
    await fetchNearby();
  };

  // ---------- Zoom ----------

  const handleZoom = (zoomIn: boolean) => {
    mapRef.current?.getCamera().then(cam => {
      cam.zoom += zoomIn ? 1 : -1;
      mapRef.current?.animateCamera(cam, { duration: 300 });
    });
  };

  // ---------- Map region ----------

  const initialRegion = {
    latitude: location?.latitude ?? normalizeLat(empLocation[0] ?? {}),
    longitude: location?.longitude ?? normalizeLng(empLocation[0] ?? {}),
    latitudeDelta: 0.5,
    longitudeDelta: 0.5,
  };

  const showSelfMarker =
    activeTab === 'nearby' ||
    activeTab === 'myTeam' ||
    activeTab === 'customer' ||
    activeTab === 'supplier';

  const isLoaded = !isLoading || empLocation.length > 0;

  // ---------- Render ----------

  return (
    <Modal
      animationType="fade"
      transparent
      visible={modalShow}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        {/* ── Map ── */}
        {isLoaded ? (
          <MapView
            ref={mapRef}
            style={styles.mapView}
            provider="google"
            initialRegion={initialRegion}
          >
            {/* Self / current-user marker (blue) */}
            {showSelfMarker && location?.latitude ? (
              <Marker
                coordinate={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                }}
              >
                <SelfMarkerIcon activity={activity} />
              </Marker>
            ) : null}

            {/* Nearby / partner markers (red) */}
            {empLocation.map((loc, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: normalizeLat(loc),
                  longitude: normalizeLng(loc),
                }}
              >
                <LocationMarkerIcon
                  loc={loc}
                  activeTab={activeTab}
                  color={COLORS.red}
                />
                <CalloutCard loc={loc} />
              </Marker>
            ))}
          </MapView>
        ) : (
          <LoadingContainer isLoading={isLoading} />
        )}

        {/* ── Close button ── */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <MIcon name="close" size={30} color={COLORS.red} />
        </TouchableOpacity>

        {/* ── Search overlay ── */}
        {activeTab === 'search' && (
          <View style={styles.searchBox}>
            <CustomInputNew
              inputMainStyle={styles.searchInput}
              control={control}
              name="employee"
              placeholder="Enter partner code"
              label="Search by code"
              onChange={async (text: string) => {
                setValue('employee', text);
                if (text.length > 2) {
                  await fetchPartners(2, text);
                }
              }}
            />
          </View>
        )}

        {/* ── Bottom tab bar ── */}
        {activeTab !== 'search' && (
          <View style={styles.bottomControls}>
            <TabButton
              icon={<MIcon name="axis-arrow" size={28} />}
              active={activeTab === 'nearby'}
              onPress={() => handleTabPress('nearby')}
            />
            <TabButton
              icon={<MIcon name="account-multiple-outline" size={28} />}
              active={activeTab === 'myTeam'}
              onPress={() => handleTabPress('myTeam')}
            />
            <TabButton
              icon={<MIcon name="human-capacity-increase" size={28} />}
              active={activeTab === 'customer'}
              onPress={() => handleTabPress('customer')}
            />
            <TabButton
              icon={<MIcon name="factory" size={28} />}
              active={activeTab === 'supplier'}
              onPress={() => handleTabPress('supplier')}
            />
            <TabButton
              icon={<MIcon name="car" size={28} />}
              active={activeTab === 'vehicle'}
              onPress={() => handleTabPress('vehicle')}
            />
            <TabButton
              icon={<MIcon name="truck" size={28} />}
              active={activeTab === 'truck'}
              onPress={() => handleTabPress('truck')}
            />
            <TabButton
              icon={<Icon name="directions-boat" size={28} />}
              active={activeTab === 'ship'}
              onPress={() => handleTabPress('ship')}
            />

            <TabButton
              icon={<FontIcon name="ship" size={24} />}
              active={activeTab === 'lighter'}
              onPress={() => handleTabPress('lighter')}
            />
          </View>
        )}

        {/* ── Right-side controls (zoom + search + lighter) ── */}
        <View style={styles.sideControls}>
          <TouchableOpacity
            onPress={() => handleZoom(true)}
            style={styles.zoomButton}
          >
            <Text style={styles.zoomText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleZoom(false)}
            style={styles.zoomButton}
          >
            <Text style={styles.zoomText}>−</Text>
          </TouchableOpacity>

          <View style={styles.sideSpacer} />

          <TabButton
            icon={<MIcon name="account-search-outline" size={28} />}
            active={activeTab === 'search'}
            onPress={handleSearchToggle}
          />
          <View style={{ height: 6 }} />
        </View>
      </View>
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// TabButton helper
// ---------------------------------------------------------------------------

interface TabButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ icon, active, onPress }) => {
  useThemeId(); // repaint on theme change
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.mapButton, active && { borderColor: COLORS.primary }]}
    >
      {React.cloneElement(icon as React.ReactElement, {
        color: active ? COLORS.primary : COLORS.black,
      })}
    </TouchableOpacity>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  mapView: {
    flex: 1,
  },

  // Close
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: COLORS.white,
    borderRadius: 25,
    padding: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  // Search
  searchBox: {
    position: 'absolute',
    top: 14,
    left: 70,
    width: 250,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.darkGray,
  },

  // Callout
  calloutCard: {
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 8,
    width: 280,
    elevation: 4,
  },
  calloutName: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 2,
  },
  calloutDetail: {
    color: 'black',
    fontSize: 13,
    marginTop: 1,
  },

  // Bottom tab bar
  bottomControls: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 70,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 12,
  },

  // Right side controls
  sideControls: {
    position: 'absolute',
    right: 12,
    bottom: 24,
    alignItems: 'center',
    gap: 6,
  },
  sideSpacer: {
    height: 10,
  },

  // Buttons
  mapButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  mapButtonActive: {
    backgroundColor: '#EEF4FF',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  // Zoom
  zoomButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  zoomText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.black,
    lineHeight: 28,
  },
});

export default observer(MapLocModal);
