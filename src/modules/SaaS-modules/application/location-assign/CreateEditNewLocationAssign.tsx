import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Checkbox} from 'react-native-paper';
import {Edge} from 'react-native-safe-area-context';
import {CreateNUpdateEmployeeWiseLocationAssaign} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS, IMAGES} from '../../../../common/constant/Index';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {directionFromLatLong} from '../../../../common/services/directionFromLatLong';
import {getImageURL} from '../../../../common/services/getImage';
import {
  EmployeeInfo,
  ResultListEntity} from '../../../../interfaces/location-assign/location-assign';
import {useRootStore} from '../../../../stores/rootStore';
import {createEditStyle} from '../movement-application/CreateEditMovementApplication';

const edges: Edge[] = ['right', 'bottom', 'left'];

const CreateEditNewLocationAssign = () => {
  const route = useRoute();
  //@ts-ignore
  const {locationAssignData} = route?.params;
  const employeeInfo: EmployeeInfo = locationAssignData?.employeeInfo;
  const locationD: ResultListEntity[] = locationAssignData?.resultList;
  const navigation = useNavigation();
  const toaster = useToast();
  const [_isLoading, _setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<ResultListEntity[]>();
  const {userInfo} = useRootStore();

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    const data = locationD?.map(item => {
      return {
        ...item,
        isActive: item?.strStatus ? true : false,
      };
    });
    setLocationData(data);
  }, []);

  const onSubmit = async () => {
    const payload = {
      intEmployeeId: employeeInfo?.intEmployeeBasicInfoId,
      intAccountId: employeeInfo?.intAccountId,
      strEmployeeName: employeeInfo?.strEmployeeName,
      intActionBy: userInfo?.intEmployeeId,
      listLocations: locationData?.map(item => {
        return {
          masterLocationId: item?.intMasterLocationId,
          isCreate: item?.isActive,
        };
      }),
    };

    const api_params = {
      url: CreateNUpdateEmployeeWiseLocationAssaign,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});

    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
    if (res?.StatusCode === 500) {
      toaster.show({message: res?.Message, type: 'error'});
    }
  };

  const handleCheckbox = (i: number) => {
    if (locationData) {
      const modifiedData = [...locationData];
      modifiedData[i].isActive = !modifiedData?.[i]?.isActive;
      setLocationData(modifiedData);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="New Location Assign"
        />
      }
      style={styles.container}>
      <ScrollView style={styles.padding} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={styles.width25}>
            {employeeInfo ? (
              <FastImage
                source={{
                  uri: getImageURL(employeeInfo?.intEmployeeImageUrlId),
                }}
                style={styles.profileImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />
            )}
          </View>
          <View style={styles.width75}>
            <Text style={styles.employeeName}>
              {employeeInfo?.strEmployeeName}
            </Text>
            <Text style={styles.empSubData}>
              {employeeInfo?.strDesignation}
            </Text>
            <Text style={styles.empSubData}>
              {employeeInfo?.strEmployeeCode}
            </Text>
          </View>
        </View>
        {locationData && locationData?.length > 0 ? (
          <View style={Platform.OS === 'android' ? styles.inputMain : {}}>
            {locationData?.length > 0 &&
              locationData?.map((item: ResultListEntity, index: number) => (
                <View style={styles.leaveTextPart} key={index}>
                  <View>
                    <Checkbox
                      disabled={
                        item?.strStatus?.toLowerCase() === 'process'
                          ? true
                          : false
                      }
                      value={item?.isActive}
                      onValueChange={() => handleCheckbox(index)}
                      style={styles.checkbox}
                      tintColors={{true: 'green', false: 'green'}}
                      tintColor={COLORS.white}
                      onCheckColor={COLORS.white}
                      onTintColor={COLORS.white}
                    />
                  </View>

                  <View style={styles.paddingLeft}>
                    <Text style={styles.titleTxt}>{item?.locationName}</Text>
                    <Text style={styles.location}>{item?.strAddress}</Text>

                    <View style={styles.latLng}>
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.strLatitude).toFixed(5)}° `}{' '}
                        {directionFromLatLong(item?.strLatitude, 0)}
                      </Text>
                      <View style={styles.bar2} />
                      <Text style={styles.cmnTxt2}>
                        {`${Number(item?.strLongitude).toFixed(5)}° `}
                        {directionFromLatLong(0, item?.strLongitude)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        ) : null}
      </ScrollView>
      {locationData && locationData?.length > 0 && (
        <CustomButtonNew
          btnText="Apply"
          onBtnPress={() => onSubmit()}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnText}
        />
      )}
    </ContainerNew>
  );
};

export default CreateEditNewLocationAssign;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 50,
    backgroundColor: COLORS.white,
  },

  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  location: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    marginTop: 6,
  },

  paddingLeft: {
    paddingLeft: 12,
    width: '95%',
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    paddingTop: 10,
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  checkbox: {
    alignSelf: 'center',
    height: 30,
    width: 30,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    color: COLORS.textNewColor,
  },
  empSubData: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  profileImage: {
    width: 62,
    height: 62,
    borderRadius: 100,
  },
  width75: {
    width: '75%',
  },
  width25: {
    width: '25%',
  },
  profileContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  padding: {
    height: Platform.OS === 'ios' ? '84%' : '87%',
  },
  latLng: {
    flexDirection: 'row',
    paddingVertical: 6,
  },
  cmnTxt2: {
    color: COLORS.graySubText,
    fontSize: 14,
    fontWeight: '500',
  },
  bar2: {
    width: 2,
    backgroundColor: COLORS.graySubText,
    marginHorizontal: 20,
  },

  ...createEditStyle,
});
