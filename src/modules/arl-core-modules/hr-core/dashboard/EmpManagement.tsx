/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Container from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import SearchHeader from '../../../../common/components/SearchHeader';
import {IMAGES} from '../../../../common/constant/Index';
import { COLORS} from '../../../../common/constant/Themes';
import {getImageURL} from '../../../../common/services/getImage';
import {EmployeeContactType} from '../../../../interfaces/contact/contact';
import {
  getEmpDdlData,
  getContactLanding} from '../../../../services/SaaS-modules/contact/contact';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import LoadingContainer from '../../../../common/components/Loading';
import CustomTextNew from '../../../../common/components/CustomText';
import Column from '../../../../common/components/Column';
import CustomFlatList from '../../../../common/components/CustomFlatList';

const edges: Edge[] = ['right', 'bottom', 'left'];
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EmpMangement = () => {
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [contactData2, setContactData2] = useState<EmployeeContactType[]>([]);
  const [employeeName, setEmployeeName] = useState('');
  const [isLoadAgain, setIsLoadAgain] = useState(false);
  const [EmpDdlData, setEmpDdlData] = useState<any>([]);

  const {control, setValue, reset: _reset, watch} = useForm({
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
      setIsLoadAgain(false);
      handleEmpDdlData();
      getContactData(watch('businessUnit')?.value);
      // setIsSearch(true);
      // reset();
    },
    [isFocused, isLoadAgain],
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
  const renderItem = ({item, index}: any) => (
    <View>
      <TouchableOpacity
        key={index}
        onPress={() => {
          setIsSearch(true);
          setEmployeeName('');
          //@ts-ignore
          navigation.navigate('AllEmployeeDetails', {
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
                <Image source={IMAGES.NoImage} style={styles.empImage} />
              </View>
            )}
          </View>
          <View style={{width: '85%', paddingLeft: 5}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}>
              <Text style={styles.titleTxt}>{item?.EmployeeName}</Text>
              <Text style={styles.code}>[ {item?.EmployeeCode} ]</Text>
            </View>
            <Text style={styles.subText}>{item?.DesignationName}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Container
      edges={edges}
      isScrollView={false}
      isRefresh={false}
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
      style={[styles.container]}>
      <View
        style={{
          marginTop: !isSearch ? 120 : 0,
        }}>
        <View style={[styles.appContainer]}>
          <LoadingContainer isLoading={isLoading} />
          <CustomFlatList
            headerComponent={
              <Column
                colWidth={'100%'}
                colStyle={{
                  backgroundColor: COLORS.white,
                }}>
                <CustomTextNew
                  text={`Total Employee: ${contactData?.length || 0}`}
                  txtWeight={'500'}
                />
                {EmpDdlData?.length > 1 && (
                  <View style={[styles.butsinessUnit, {height: 50}]}>
                    <CustomDropDownNew
                      label="Business Unit"
                      name="businessUnit"
                      onChange={(options: any) => {
                        setValue('businessUnit', options);
                        setIsLoadAgain(true);
                      }}
                      control={control}
                      data={EmpDdlData}
                    />
                  </View>
                )}
              </Column>
            }
            isStickyHeader={true}
            contentContainerStyle={styles.flatlistCont}
            data={employeeName?.length === 0 ? contactData : contactData2}
            RenderItems={renderItem}
            isLoading={isLoading}
          />
        </View>
      </View>
      {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={employeeName}
          setInputText={setEmployeeName}
        />
      )}
    </Container>
  );
};
export default EmpMangement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  appContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  loaderContainer: {
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
  butsinessUnit: {
    backgroundColor: COLORS.white,
    marginBottom: 2,
  },
  //   total: {
  //     fontSize: 14,
  //     color: COLORS.textNewColor,
  //     fontWeight: '600',
  //     paddingVertical: 8,
  //     backgroundColor: COLORS.white,
  //   },

  flatlistCont: {
    paddingBottom: 150,
  },
});
