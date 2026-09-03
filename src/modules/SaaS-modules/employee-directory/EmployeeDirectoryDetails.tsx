import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Edge } from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import { IMAGES } from '../../../common/constant/Index';
import { COLORS } from '../../../common/constant/Themes';
import { getImageURL } from '../../../common/services/getImage';
import { useRootStore } from '../../../stores/rootStore';
import { useToast } from '../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'bottom', 'left'];

const EployeeDirectoryDetails = () => {
  const { userInfo: _userInfo } = useRootStore();
  const route = useRoute();
  //@ts-ignore
  const employeeDetails = route?.params?.employeeDetails;
  const toaster = useToast();

  const navigation = useNavigation();

  const dialCall = (phone?: String, email?: String) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    if (phone) {
      Linking.openURL(phoneNumber);
    } else if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      toaster.show({ message: 'Phone no is empty.', type: 'error' });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <>
          <CustomHeader
            onLeftCrossPress={() => navigation.goBack()}
            title="Employee Details"
          />
        </>
      }
      style={styles.container}
    >
      <View style={styles.cardHead}>
        <View style={styles.flexRow}>
          <View style={styles.imageSection}>
            {employeeDetails?.intProfilePicFileUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(employeeDetails?.intProfilePicFileUrlId),
                }}
                style={styles.empImage}
              />
            ) : (
              <View style={styles.noImageBox}>
                <Image source={IMAGES.NoImage} style={styles.noImage} />
              </View>
            )}

            <View
              style={[styles.circleChat, { backgroundColor: COLORS.primary }]}
            />
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.empName}>
              {employeeDetails?.EmployeeName?.trim()}
            </Text>
            <View
              style={[styles.cmnSubTitle, styles.paddingTop, styles.flexRow]}
            >
              <Text style={styles.designation}>
                {employeeDetails?.DesignationName?.trim()}
              </Text>
            </View>

            <View style={[styles.cmnSubTitle, styles.paddingTopBottom]}>
              <Text style={styles.stylePhone}>
                {employeeDetails?.Phone || '---'}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.dividerVartical} />
      <View style={styles.flexRow}>
        <MIcon
          name="business-center"
          size={25}
          color={COLORS.iconColor}
          style={styles.centerText}
        />
        <View style={styles.txtLeftMargin}>
          <Text style={styles.bottomHeaderTxt}>
            {employeeDetails?.DepartmentName || '---'}{' '}
          </Text>
          <Text style={styles.bottomMediumTxt}>Department</Text>
        </View>
      </View>
      <View style={styles.dividerVartical} />
      <TouchableOpacity
        onPress={() => {
          dialCall(employeeDetails?.Phone, undefined);
        }}
      >
        <View style={styles.flexRow}>
          <MIcon
            name="call"
            size={25}
            color={COLORS.iconColor}
            style={styles.centerText}
          />
          <View style={styles.txtLeftMargin}>
            <Text style={styles.bottomHeaderTxt}>
              {employeeDetails?.Phone || '---'}
            </Text>
            <Text style={styles.bottomMediumTxt}>Mobile Number</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.dividerVartical} />
      <TouchableOpacity
        onPress={() => {
          dialCall(undefined, employeeDetails?.Email);
        }}
      >
        <View style={styles.flexRow}>
          <MIcon
            name="email"
            size={25}
            color={COLORS.iconColor}
            style={styles.centerText}
          />
          <View style={styles.txtLeftMargin}>
            <Text style={styles.bottomHeaderTxt}>
              {employeeDetails?.Email || '---'}
            </Text>
            <Text style={styles.bottomMediumTxt}>Email</Text>
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.dividerVartical} />
      <View style={styles.flexRow}>
        <MIcon
          name="map"
          size={25}
          color={COLORS.iconColor}
          style={styles.centerText}
        />
        <View style={styles.txtLeftMargin}>
          <Text style={styles.bottomHeaderTxt}>
            {employeeDetails?.presentAddress || '---'}
          </Text>
          <Text style={styles.bottomMediumTxt}>Present Address</Text>
        </View>
      </View>
    </ContainerNew>
  );
};

export default EployeeDirectoryDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },

  empName: {
    paddingTop: 8,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 30,
    color: COLORS.textNewColor,
  },

  designation: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: 'rgba(0, 0, 0, 0.7)',
  },
  stylePhone: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.2,
    color: 'rgba(0, 0, 0, 0.7)',
    width: '55%',
  },

  cmnSubTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  noImageBox: {
    height: 55,
    width: 55,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },

  noImage: {
    height: 50,
    width: 50,
    marginTop: 6,
    alignSelf: 'center',
  },

  empImage: {
    height: 50,
    width: 50,
    borderRadius: 100,
    overflow: 'hidden',
  },

  imageSection: {
    width: '20%',
    marginTop: 11,
  },

  paddingTop: {
    paddingTop: 5,
  },

  circleChat: {
    borderWidth: 3,
    borderColor: COLORS.white,
    height: 18,
    width: 18,
    borderRadius: 10,
    overflow: 'hidden',
    zIndex: 999,
    marginTop: -13,
    marginLeft: 32,
  },

  nameSection: {
    marginLeft: 19,
  },

  dividerVartical: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    marginVertical: 8,
  },

  flexRow: {
    flexDirection: 'row',
  },

  paddingTopBottom: {
    paddingTop: 4,
    paddingBottom: 8,
  },

  centerText: {
    textAlign: 'center',
  },

  bottomHeaderTxt: {
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.textNewColor,
  },

  bottomMediumTxt: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },

  txtLeftMargin: {
    marginLeft: 18,
  },
});
