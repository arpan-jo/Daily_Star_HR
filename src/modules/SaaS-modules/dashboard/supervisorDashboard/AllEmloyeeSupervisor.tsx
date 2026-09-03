'use client';

import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  StyleSheet,
  Text,
  UIManager,
  View,
  ScrollView} from 'react-native';
import type {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import SearchHeader from '../../../../common/components/SearchHeader';
import {COLORS, SIZES} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {_todayDateTime} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';
import EmployeeCard from './common/components/EmployeeCard';
import NoDataComponent from './common/components/NoDataComponent';
import {useEmployeeData} from './common/hooks/useEmployeeData';

const edges: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AllEmloyeeSupervisor = () => {
  const navigation = useNavigation();
  const _isFocused = useIsFocused();
  const {userInfo: _userInfo} = useRootStore(); // Use useRootStore
  const [isSearch, setIsSearch] = useState(true);

  const {
    empList,
    isLoading,
    searchTerm,
    setSearchTerm,
    toggleEmployeeExpansion,
  } = useEmployeeData();

  const date = _todayDateTime(); // Use _todayDateTime

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
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
              title="My Employees"
            />
          )}
        </>
      }
      style={[styles.container]}>
      <View style={{marginTop: !isSearch ? 90 : 0}}>
        {isLoading && (
          <ActivityIndicator size={'large'} color={COLORS.primary} />
        )}
        <View style={styles.head}>
          <Text style={styles.headText}>
            {date_formater(
              //@ts-ignore
              date,
            )}
          </Text>
          <Text style={styles.headText}>
            Total employee {empList?.length || 0}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.empPart}>
            {empList && empList.length > 0 ? (
              empList.map((item, index) => (
                <EmployeeCard
                  key={index}
                  item={item}
                  index={index}
                  onToggleExpand={toggleEmployeeExpansion}
                  showEmployeeCode={false}
                />
              ))
            ) : (
              <NoDataComponent />
            )}
          </View>
        </ScrollView>
      </View>

      {!isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={searchTerm}
          setInputText={setSearchTerm}
        />
      )}
    </ContainerNew>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: SIZES.height,
    flex: 1,
    paddingBottom: 36,
  },
  head: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  empPart: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 200 : 150,
  },
  headText: {
    lineHeight: 20,
    fontSize: 14,
    color: COLORS.textNewColor,
  },
});

export default AllEmloyeeSupervisor;
