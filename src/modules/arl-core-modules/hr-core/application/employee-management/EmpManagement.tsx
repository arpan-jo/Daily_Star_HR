/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutAnimation,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../../stores/rootStore';
import {EmployeeContactType} from '../../../../../interfaces/contact/contact';
import {
  getContactLanding,
  getEmpDdlData,
} from '../../../../../services/SaaS-modules/contact/contact';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import {COLORS, SIZES} from '../../../../../common/constant/Themes';
import CustomDropDownNew from '../../../../../common/components/CustomDropDown';
import {getImageURL} from '../../../../../common/services/getImage';
import {IMAGES} from '../../../../../common/constant/Index';
import SearchHeader from '../../../../../common/components/SearchHeader';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EmpManagement = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [contactData2, setContactData2] = useState<EmployeeContactType[]>([]);
  const [employeeName, setEmployeeName] = useState('');

  const [EmpDdlData, setEmpDdlData] = useState<any>([]);

  const {control, setValue, reset} = useForm({
    defaultValues: {
      businessUnit: {
        value: userInfo?.intBusinessUnitId,
        label: userInfo?.strBusinessUnit,
      },
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      handleEmpDdlData();
      getContactData(userInfo?.intBusinessUnitId);
      setIsSearch(true);
      reset();
    },
    [isFocused, userInfo],
  );

  const handleEmpDdlData = async () => {
    const res = await getEmpDdlData(
      userInfo?.intAccountId,
      userInfo?.intBusinessUnitId,
      userInfo?.intEmployeeId,
      setIsLoading,
    );
    setEmpDdlData(res);
  };

  const getContactData = async (buInt: any) => {
    const res = await getContactLanding(
      userInfo?.intAccountId,
      buInt,
      setIsLoading,
      '',
      userInfo?.intEmployeeId,
    );
    setContactData(res);
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (contactData) {
        let regex = new RegExp(employeeName?.toLowerCase());
        let copyEmployeeData = [...contactData];
        let newData = copyEmployeeData?.filter(item =>
          regex?.test(item?.EmployeeName?.toLowerCase()),
        );
        setContactData2(newData);
      }
    },
    [employeeName],
  );

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <>
          {isSearch && (
            <CustomHeader
              onBackPress={navigation.goBack}
              alterIcon={'search'}
              alterIconPress={() => {
                setIsSearch(!isSearch);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              }}
              title="Employee Management"
            />
          )}
        </>
      }
      style={[
        styles.container,
        {
          paddingBottom: contactData ? (!isSearch ? 0 : 0) : SIZES.height,
        },
      ]}>
      <View
        style={{
          marginTop: !isSearch ? 90 : 0,
        }}>
        {isLoading ? (
          <ActivityIndicator
            color={COLORS.primary}
            size={'small'}
            style={styles.loaderStyle}
          />
        ) : null}

        <FlatList
          ListFooterComponentStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={10}
          data={employeeName.length === 0 ? contactData : contactData2}
          ListFooterComponent={() => <View />}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <>
              <Text
                style={[
                  styles.total,
                  {
                    paddingBottom: EmpDdlData?.length > 1 ? 2 : 10,
                  },
                ]}>
                Total Employees {contactData?.length}
              </Text>

              {EmpDdlData?.length > 1 && (
                <View style={styles.unitStyle}>
                  <CustomDropDownNew
                    label="Business Unit"
                    name="businessUnit"
                    onChange={(options: any) => {
                      setValue('businessUnit', options);
                      getContactData(options?.value);
                    }}
                    control={control}
                    data={EmpDdlData}
                  />
                </View>
              )}
            </>
          )}
          renderItem={({
            item,
            index,
          }: ListRenderItemInfo<EmployeeContactType>) => (
            <View>
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setIsSearch(true);
                  setEmployeeName('');
                  //@ts-ignore
                  navigation.navigate('EmpMngAllEmp', {
                    leaveDetails: item,
                  });
                }}
                style={styles.leaveCard}>
                <View style={styles.leaveTextPart}>
                  <View>
                    {item?.intProfilePicFileUrlId ? (
                      <FastImage
                        source={{
                          uri: getImageURL(item?.intProfilePicFileUrlId),
                        }}
                        style={styles.empImage}
                      />
                    ) : (
                      <View>
                        <Image
                          source={IMAGES.NoImage}
                          style={styles.empImage}
                        />
                      </View>
                    )}
                  </View>
                  <View style={styles.nameContainer}>
                    <View style={styles.employeeStyle}>
                      <Text style={styles.titleTxt}>{item?.EmployeeName}</Text>
                      <Text style={styles.code}>[ {item?.EmployeeCode} ]</Text>
                    </View>
                    <Text style={styles.subText}>{item?.DesignationName}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          )}
          //@ts-ignore
          keyExtractor={(item, index) => index}
        />
      </View>

      {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={employeeName}
          setInputText={setEmployeeName}
        />
      )}
    </ContainerNew>
  );
};
export default EmpManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
  },
  leaveCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 0.5,
    marginTop: 8,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.08,
    shadowRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 3,
  },
  leaveTextPart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empImage: {
    height: 45,
    width: 45,
    borderRadius: 100,
    overflow: 'hidden',
  },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  subText: {
    fontSize: 14,
    color: COLORS.textNewColor,
    paddingTop: 2,
  },
  code: {
    fontSize: 14,
    color: COLORS.textNewColor,
  },
  total: {
    fontSize: 14,
    color: COLORS.textNewColor,
    fontWeight: '600',
    paddingVertical: 8,
    backgroundColor: COLORS.white,
  },
  loaderStyle: {
    position: 'absolute',
    zIndex: 999999,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    elevation: 10,
    flex: 1,
  },
  employeeStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  unitStyle: {
    backgroundColor: COLORS.white,
    marginBottom: 2,
  },
  nameContainer: {width: '85%', paddingLeft: 5},
});
