/* eslint-disable react-native/no-inline-styles */
import {useIsFocused} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useCallback, useState} from 'react';

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

import {DrawerScreenProps} from '@react-navigation/drawer';
import Container from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';
import SearchHeader from '../../../common/components/SearchHeader';
import {IMAGES} from '../../../common/constant/Index';
import { COLORS} from '../../../common/constant/Themes';
import {getImageURL} from '../../../common/services/getImage';
import {EmployeeContactType} from '../../../interfaces/contact/contact';

import {useRootStore} from '../../../stores/rootStore';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {httpRequest} from '../../../common/constant/httpRequest';
import {PeopleDeskAllLanding} from '../../../common/api/api';
import {commonURL} from '../../../../App';
import CustomFlatList from '../../../common/components/CustomFlatList';
import LoadingContainer from '../../../common/components/Loading';

const edges: Edge[] = ['right', 'bottom', 'left'];
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const EmpManagementMainIndex = observer<
  DrawerScreenProps<'Employee Management'>
>(({navigation}) => {
  const {userInfo} = useRootStore();
  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLandingData();
      // handleEmpDdlData();
      // reset();
    },
    [isFocused, currentPage, searchQuery, !isSearch],
  );
  // const {control, setValue, reset} = useForm({
  //   defaultValues: {
  //     businessUnit: {
  //       value: userInfo?.intBusinessUnitId,
  //       label: userInfo?.strBusinessUnit,
  //     },
  //   },
  // });

  const getLandingData = async () => {
    const mainApiParams = {
      TableName: 'EmployeeContactInfo',
      AccountId: userInfo?.intAccountId,
      BusinessUnitId: userInfo?.intBusinessUnitId,
      EmpId: userInfo?.intEmployeeId,
      SearchText: searchQuery || '',
    };
    const commonApiParams = {
      ...mainApiParams,
      workplaceGroupId: userInfo?.intWorkplaceGroupId,
      pageNo: currentPage,
      pageSize: 30,
      SearchTxt: searchQuery || '',
    };

    const api_params = {
      url: PeopleDeskAllLanding,
      data: userInfo?.strUrl === commonURL ? commonApiParams : mainApiParams,
    };
    const res = await httpRequest(api_params, setIsLoading);
    setContactData((prev: any) =>
      currentPage === 1 ? res : [...prev, ...res],
    );
  };

  // const handleEmpDdlData = async () => {
  //   const res = await getEmpDdlData(
  //     userInfo?.intAccountId,
  //     userInfo?.intBusinessUnitId,
  //     userInfo?.intEmployeeId,
  //     setIsLoading,
  //   );
  //   setEmpDdlData(res);
  // };

  const renderItem = useCallback(
    ({item}: any) => {
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
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
    },
    [navigation],
  );

  return (
    <Container
      isScrollView={false}
      edges={edges}
      header={
        <>
          {!isSearch && (
            <CustomHeader
              onLeftMenuPress={navigation.toggleDrawer}
              alterIcon={'search'}
              alterIconPress={() => {
                setCurrentPage(1);
                setContactData([]);
                setIsSearch(!isSearch);
                LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              }}
              title="Employee Management"
            />
          )}
        </>
      }
      style={styles.container}>
      <View
        style={{
          marginTop: isSearch ? 98 : 0,
        }}>
        <LoadingContainer isLoading={isLoading} />
        {contactData && contactData?.length > 0 ? (
          <CustomFlatList
            contentContainerStyle={styles.flatlistCont}
            data={contactData}
            RenderItems={renderItem}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            isStickyHeader={true}
            isLoading={isLoading}
          />
        ) : null}
        {/* <FlatList
          ListFooterComponentStyle={{paddingBottom: 50}}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          initialNumToRender={10}
          data={employeeName.length === 0 ? contactData : contactData2}
          ListFooterComponent={() => <View />}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <>
              {EmpDdlData?.length > 1 && (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    marginBottom: 2,
                  }}>
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
                        <Image
                          source={IMAGES.NoImage}
                          style={styles.empImage}
                        />
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
          )}
          //@ts-ignore
          keyExtractor={(item, index) => index}
        /> */}
      </View>

      {isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={searchQuery}
          setInputText={setSearchQuery}
        />
      )}
    </Container>
  );
});

export default EmpManagementMainIndex;

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
  flatlistCont: {
    paddingBottom: 100,
  },
});
