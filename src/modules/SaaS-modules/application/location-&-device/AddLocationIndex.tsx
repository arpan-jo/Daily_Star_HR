import CheckBox from '@react-native-community/checkbox';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';
import { Edge } from 'react-native-safe-area-context';
import { useRootStore } from '../../../../stores/rootStore';

import {
  addLocation,
  addMasterLocation} from '../../../../services/SaaS-modules/attendance/attendance';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import { directionFromLatLong } from '../../../../common/services/directionFromLatLong';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { getLatitudeLongitude } from '../../../../common/constant/latitudeLogitude';


import Row from '../../../../common/components/Row';

import { getLocationName } from '../../../../common/constant/GetLocationName';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const AddLocationIndex = ({ route }: props) => {
  const employeeData = route?.params?.employeeData;
  const isAdminLocation = route?.params?.isAdminLocation;
  const navigation = useNavigation();
  const { userInfo, cacheLocation, cacheLocationSave } = useRootStore();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const [location, setLocation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  //@ts-ignore
  const lat = location?.latitude !== undefined && location?.latitude;
  //@ts-ignore
  const lng = location?.longitude !== undefined && location?.longitude;

  const accountId =
    employeeData?.profileData?.employeeProfileLandingView?.intAccountId ||
    userInfo?.intAccountId;
  const empName = employeeData?.EmployeeName || userInfo?.strDisplayName;
  const employeeId = employeeData?.EmployeeId || userInfo?.intEmployeeId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      getLatitudeLongitude(setLocation);
    },
    [userInfo, isFocused],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (location?.latitude && location?.longitude) {
        // const identity = getRequestIdentity();
        // const api_params2 = {
        //   url: '/reverse.php',
        //   data: {
        //     format: 'jsonv2',
        //     zoom: 18,
        //     lat: location?.latitude,
        //     lon: location?.longitude,
        //   },
        //   baseURL: openMap,
        //   referer: identity?.referer || userInfo?.strUrl,
        //   userAgent: identity?.userAgent || 'PeopleDesk/19.7.3(arpan@ibos.io)',
        // };
        // const res2 = await httpRequest(api_params2, () => {});

        const locationName = await getLocationName({
          latitude: location?.latitude,
          longitude: location?.longitude,
          cacheLocation,
          cacheLocationSave,
          userInfo,
        });

        setValue('locationLog', locationName);
        setValue('location', locationName);
      }
    },
    [location],
  );

  const { control, handleSubmit, setValue } = useForm({});

  const onSubmit = async (data: any) => {
    const payload = {
      //partId 2 === location and 1 === device
      partId: 2,
      attendanceRegId: 0,
      intAccountId: accountId,
      employeeId: employeeId,
      employeeName: empName,
      longitude: lng?.toString(),
      latitude: lat?.toString(),
      placeName: data?.location,
      address: data?.location,
      insertBy: employeeId,
      deviceId: '',
      deviceName: '',
      isHomeOffice: toggleCheckBox,
      isLocationRegister: true,
    };

    const masterLocationPayload = {
      //intMasterLocationId 0 = create, 1 = update
      intMasterLocationId: 0,
      intAccountId: accountId,
      intBusinessId: userInfo?.intBusinessUnitId,
      strLongitude: lng?.toString(),
      strLatitude: lat?.toString(),
      strPlaceName: data?.location,
      strAddress: data?.locationLog,
      isActive: true,
      actionBy: employeeId,
      workplaceGroupId: userInfo?.intWorkplaceGroupId,
      workplaceId: userInfo?.intWorkplaceId,
    };

    if (lat && lng) {
      if (isAdminLocation) {
        const res = await addMasterLocation(
          masterLocationPayload,
          setIsLoading,
        );
        manageRes(res);
      } else {
        const res = await addLocation(payload, setIsLoading);
        manageRes(res);
      }
      function manageRes(res: any) {
        if (res?.statusCode === 200) {
          toaster.show({ message: res?.message, type: 'success' });
          navigation.goBack();
        }
        if (res?.statusCode === 500) {
          toaster.show({ message: res?.message, type: 'error' });
        }
        if (res?.StatusCode === 500) {
          toaster.show({ message: res?.Message, type: 'error' });
        }
      }
    } else {
      toaster.show({ message: 'Check GPS', type: 'error' });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          headerColor={true}
          onLeftCrossPress={() => {
            navigation.goBack();
          }}
          title="Add Location"
          components={
            <TouchableOpacity
              disabled={isLoading}
              onPress={handleSubmit(onSubmit)}
              activeOpacity={0.9}
              style={[styles.regButton, { paddingHorizontal: 13 }]}
            >
              <Row align="center">
                {isLoading ? <ActivityIndicator /> : <></>}
                <Text style={styles.reg}>Register</Text>
              </Row>
            </TouchableOpacity>
          }
        />
      }
    >
      {/* body part */}
      <View style={styles.body}>
        <View>
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="location"
            label="Location Name"
            disabled
            multiline
            rules={{ required: true }}
            inputMainStyle={styles.inputMain}
            labelStyle={styles.labelStyle}
            textInputStyle={styles.textInputStyle}
          />
          <CustomInputNew
            setValue={setValue}
            control={control}
            name="locationLog"
            label="Location Log"
            disabled
            multiline
            rules={{ required: true }}
            inputMainStyle={styles.inputMain}
            labelStyle={styles.labelStyle}
            textInputStyle={styles.textInputStyle}
          />
        </View>

        {lat && lng && (
          <View style={styles.latLng}>
            <Text style={styles.cmnTxt}>
              {`${Number(lat).toFixed(5)}° `} {directionFromLatLong(lat, 0)}
            </Text>
            <View style={styles.bar} />
            <Text style={styles.cmnTxt}>
              {`${Number(lng).toFixed(5)}° `}
              {directionFromLatLong(0, lng)}
            </Text>
          </View>
        )}

        {isAdminLocation || (
          <View style={styles.checkbox}>
            <CheckBox
              disabled={false}
              value={toggleCheckBox}
              onValueChange={() => setToggleCheckBox(!toggleCheckBox)}
              tintColors={{ true: 'black', false: 'white' }}
              tintColor={COLORS.white}
              onCheckColor={COLORS.white}
              onTintColor={COLORS.white}
            />
            <Text style={styles.home}>Home Office Address</Text>
          </View>
        )}
      </View>

      <ScrollView>
        {location ? (
          <MapView
            provider="google"
            initialRegion={{
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.010202,
              longitudeDelta: 0.000111,
            }}
            style={styles.mapView}
          >
            <Marker
              coordinate={{
                latitude: lat,
                longitude: lng,
              }}
            />

            <Circle
              center={{
                latitude: lat,
                longitude: lng,
              }}
              radius={200}
              strokeWidth={1.5}
              strokeColor={COLORS.primary}
              fillColor={'rgba(230,238,255,0.5)'}
            />
          </MapView>
        ) : null}
      </ScrollView>
    </ContainerNew>
  );
};

export default AddLocationIndex;

const styles = StyleSheet.create({
  mapView: {
    width: SIZES.width / 1.001,
    height: SIZES.height / 1.1,
    marginTop: Platform?.OS === 'ios' ? -90 : -70,
  },
  reg: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    letterSpacing: 0.1,
    // paddingHorizontal: 24,
    paddingVertical: 10,
  },
  inputMain: {
    backgroundColor: COLORS.primary,
    paddingTop: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  regButton: {
    backgroundColor: COLORS.statusBar,
    borderRadius: 100,
    marginVertical: 5,
    marginRight: 10,
  },
  labelStyle: {
    color: '#CDF5DB',
    paddingHorizontal: 16,
  },
  textInputStyle: {
    color: COLORS.white,
    paddingHorizontal: 16,
    backgroundColor: COLORS.primary,
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  body: {
    backgroundColor: '#1F843C',
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  latLng: {
    flexDirection: 'row',
    paddingTop: 16,
  },
  cmnTxt: {
    color: '#CDF5DB',
    fontSize: 14,
    fontWeight: '500',
  },
  bar: {
    width: 1,
    backgroundColor: '#CDF5DB',
    marginHorizontal: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    marginLeft: Platform?.OS === 'ios' ? 0 : -5,
  },
  home: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.white,
    paddingLeft: 8,
  },
});
