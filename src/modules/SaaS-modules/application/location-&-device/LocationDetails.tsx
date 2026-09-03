import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet} from 'react-native';
import MapView, {Circle, Marker} from 'react-native-maps';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../stores/rootStore';
import {getLocation} from '../../../../common/services/getLocation';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';

import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface Props {
  route?: any;
}

const RegLocationDetails = ({route}: Props) => {
  const regLocaitonData = route?.params?.regLocaitonData;

  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();

  const [_, setLocation] = useState(null);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      getLocation(setLocation);
    },
    [userInfo, isFocused],
  );

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
          title="Reg. Location Details"
        />
      }>
      {/* body part */}

      <ScrollView>
        {Number(regLocaitonData?.strLongitude) &&
        Number(regLocaitonData?.strLatitude) ? (
          <MapView
            provider="google"
            initialRegion={{
              latitude: Number(regLocaitonData?.strLatitude),
              longitude: Number(regLocaitonData?.strLongitude),
              latitudeDelta: 0.010202,
              longitudeDelta: 0.000111,
            }}
            style={styles.mapView}>
            <Marker
              coordinate={{
                latitude: Number(regLocaitonData?.strLatitude),
                longitude: Number(regLocaitonData?.strLongitude),
              }}
            />

            <Circle
              center={{
                latitude: Number(regLocaitonData?.strLatitude),
                longitude: Number(regLocaitonData?.strLongitude),
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

export default RegLocationDetails;

const styles = StyleSheet.create({
  mapView: {
    width: SIZES.width / 1.001,
    height: SIZES.height / 1.1,
    marginTop: Platform?.OS === 'ios' ? -90 : -70,
  },
});
