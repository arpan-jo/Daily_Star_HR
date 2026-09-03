import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {getContactLandingForMeeting} from '../../../../services/SaaS-modules/agenda-meeting/agendaMeeting';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const EmployeeSelect = () => {
  const navigation = useNavigation();
  const propsdata = useRoute();
  //@ts-ignore
  const setResponsePerson = propsdata?.params?.setResponsePerson;
  const setValue = propsdata?.params?.setValue;

  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [isLoading, _setIsLoading] = useState(false);
  const [allEmployee, setAllEmployee] = useState<any>([]);
  const [allEmployee2, setAllEmployee2] = useState<any>([]);
  const isShowLength = allEmployee?.filter((it: any) => it?.isResponsible);
  const isShowLength2 = allEmployee2?.filter((it: any) => it?.isResponsible);
  const [employeeName, setEmployeeName] = useState('');

  const busId = userInfo?.intBusinessUnitId;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      setEmployeeName('');
      if (!employeeName) {
        getContactData(busId);
      }
    },
    [isFocused],
  );

  useEffect(() => {}, [isLoading]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (employeeName?.length >= 3) {
        getContactData(0);
      } else if (employeeName?.length < 3) {
        setAllEmployee2([]);
        if (allEmployee) {
          const temp = [...allEmployee];
          setAllEmployee(temp);
        }
      } else {
      }
    },
    [employeeName],
  );

  const getContactData = async (buInt: any) => {
    const ress = await getContactLandingForMeeting(
      userInfo?.intAccountId,
      buInt,
      () => {},
      employeeName,
      userInfo?.intEmployeeId,
    );
    const modifies = ress?.map(item => {
      return {
        ...item,
        isResponsible: false,
      };
    });
    if (buInt) {
      setAllEmployee(modifies);
    } else {
      setAllEmployee2(modifies);
    }
  };

  const addEmpHandler = (item: any, index: number) => {
    const temp =
      employeeName?.length === 0 ? [...allEmployee] : [...allEmployee2];
    const d = temp?.map((i, ind) => {
      return {
        ...i,
        isResponsible: index === ind ? !i?.isResponsible : false,
      };
    });
    employeeName?.length === 0 ? setAllEmployee(d) : setAllEmployee2(d);
  };

  const RenderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => addEmpHandler(item, index)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 5,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: COLORS.iconGrayBackground,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <View style={styles.noImageBox1}>
            {item?.intProfilePicFileUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(item?.intProfilePicFileUrlId),
                }}
                style={styles.noImage1}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.noImage1} />
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                fontWeight: '400',
                color: COLORS.black,
                marginHorizontal: 5,
              }}>
              {item?.EmployeeName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontWeight: '400',
                color: COLORS.textGray,
                marginHorizontal: 5,
              }}>
              {item?.DesignationName}
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 16,
                fontWeight: '400',
                color: COLORS.textGray,
                marginHorizontal: 5,
              }}>
              {item?.strBusinessUnit}
            </Text>
          </View>
        </View>

        {item?.isResponsible && (
          <View
            style={{
              borderRadius: 100,
              backgroundColor: COLORS.primary,
              padding: 2,
            }}>
            <Icon name="check" size={14} color={COLORS.white} />
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const handleEmp = () => {
    const temp =
      employeeName?.length === 0 ? [...allEmployee] : [...allEmployee2];
    const isTrue = temp?.filter(item => item?.isResponsible);
    setResponsePerson(isTrue);
    setValue('responsePerson', isTrue);
    navigation.goBack();
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isFloatBottomButton={
        isShowLength?.length > 0 || isShowLength2?.length > 0 ? true : false
      }
      singleFloatBtmBtnStyle={styles.btmBtnStyle}
      btnText={'Add'}
      singleFloatBtmBtnPress={() => handleEmp()}
      header={
        <CustomHeader
          onBackPress={() => {
            navigation.goBack();
          }}
          title={'Select Employee'}
        />
      }
      style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: SIZES.width / 1.11,
          paddingTop: 10,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: COLORS.white,
            paddingHorizontal: 18,
            paddingVertical: 2,
            borderBottomWidth: 1,
            borderColor: COLORS.iconGrayBackground,
            borderWidth: 1,
          }}>
          <View>
            <Icon name="search" size={26} color={COLORS.textGray} />
          </View>
          <TextInput
            onChangeText={text => {
              setEmployeeName(text);
            }}
            value={employeeName}
            placeholder="Search"
            style={{
              marginLeft: 10,
              width: '90%',
              color: COLORS.textNewColor,
              height: 45,
            }}
          />
        </View>
      </View>

      <View style={{}}>
        <FlatList
          ListFooterComponentStyle={{paddingBottom: 150}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={15}
          data={employeeName?.length === 0 ? allEmployee : allEmployee2}
          ListHeaderComponent={() => <View />}
          ListHeaderComponentStyle={{
            paddingBottom: 10,
          }}
          ListFooterComponent={() => (
            <View
              style={{
                paddingVertical: 100,
              }}
            />
          )}
          onEndReachedThreshold={0.5}
          renderItem={({item, index}) => (
            <RenderItem item={item} index={index} />
          )}
          //@ts-ignore
          keyExtractor={(item, index) => index}
        />
      </View>
    </ContainerNew>
  );
};

export default EmployeeSelect;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  noImageBox1: {
    height: 40,
    width: 40,
    borderRadius: 100,
    overflow: 'hidden',
    marginRight: 5,
    marginVertical: 6,
    backgroundColor: '#DCDCDC',
    paddingTop: 3,
  },
  noImage1: {
    height: 37,
    width: 37,
    alignSelf: 'center',
  },
  btmBtnStyle: {
    width: '95%',
    elevation: 0,
  },
});
