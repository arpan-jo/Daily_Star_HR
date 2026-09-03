import React from 'react';
import FastImage from 'react-native-fast-image';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {getImageURL} from '../services/getImage';
import {COLORS, IMAGES} from '../constant/Index';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
const CardContent = ({imageUrl, name, designation, department}: any) => (
  <View style={styles.card}>
    <View style={styles.cardImageText}>
      <FastImage
        source={imageUrl ? {uri: getImageURL(imageUrl)} : IMAGES.NoImage}
        style={styles.profileImage}
      />
      <View style={styles.cardText}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.cardCommonText}>{designation}</Text>
        <Text style={styles.cardCommonText}>{department}</Text>
      </View>
    </View>
    <MIcon name="arrow-forward" size={25} color={'#667085'} />
  </View>
);
const EmployeeInfoCard = ({profileData, detailsData, onPress}: any) => {
  const imageUrl =
    profileData?.employeeProfileLandingView?.intEmployeeImageUrlId ??
    detailsData?.profileUrlId;

  const name =
    profileData?.employeeProfileLandingView?.strEmployeeName ??
    detailsData?.employeeName;

  const designation =
    profileData?.employeeProfileLandingView?.strDesignation ??
    detailsData?.designation;

  const department =
    profileData?.employeeProfileLandingView?.strDepartment ??
    detailsData?.department;

  return onPress ? (
    <View style={styles.headBox}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={styles.touchCard}
        onPress={onPress}>
        <CardContent
          imageUrl={imageUrl}
          name={name}
          designation={designation}
          department={department}
        />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.headBox}>
      <CardContent
        imageUrl={imageUrl}
        name={name}
        designation={designation}
        department={department}
      />
    </View>
  );
};

export default EmployeeInfoCard;

const styles = StyleSheet.create({
  touchCard: {
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 16,
  },
  headBox: {
    marginHorizontal: 16,
    borderColor: COLORS.white,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    marginTop: 16,
  },
  cardImageText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  cardText: {
    flexShrink: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#101828',
  },
  cardCommonText: {
    fontSize: 14,
    color: '#667085',
    marginTop: 2,
  },
});
