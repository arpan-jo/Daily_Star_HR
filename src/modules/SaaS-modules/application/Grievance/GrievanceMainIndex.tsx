import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

import {GetMyGrievances} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import DateRange from '../../../../common/components/DateRange';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {_todayDate} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const topBarItem = [
  {
    title: 'My Grievance',
    isActive: true,
    nameForApi: 'myGrievance',
  },
  {
    title: 'Assigned To Me',
    isActive: false,
    nameForApi: 'assignedToMe',
  },
];

const GrievanceMainIndex = () => {
  const _isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [grievanceData, setGrievanceData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [topBar, setTopBar] = useState(topBarItem);

  const {handleSubmit, control, setValue, watch} = useForm({
    defaultValues: {
      fromDate: _todayDate(),
      toDate: _todayDate(),
    },
  });

  const onSubmit = async () => {
    const api_params = {
      url: GetMyGrievances,
      data: {
        fromDate: dayjs(watch('fromDate')).format('YYYY-MM-DD'),
        toDate: dayjs(watch('toDate')).format('YYYY-MM-DD'),
        businessUnitId: userInfo?.intBusinessUnitId,
        employeeId: topBar[1]?.isActive ? 0 : userInfo?.intEmployeeId,
        assignedToId: topBar[0]?.isActive ? 0 : userInfo?.intEmployeeId,
      },
    };
    const res = await httpRequest(api_params, setIsLoading);
    setGrievanceData(res);
  };

  const renderItem = ({item}: any) => (
    <Row
      rowWidth="100%"
      isCard
      direction="column"
      justify="space-between"
      isPressOn={false}
      onCardPress={() => {
        navigation.navigate('GrievanceCreate', {
          grievanceData: item,
        });
      }}>
      <View style={styles.cardHeader}>
        <CustomTextNew
          text={
            item?.dteIncidentDate ? date_formater(item?.dteIncidentDate) : 'N/A'
          }
          style={styles.businessName}
        />
      </View>
      <View style={styles.cardHeader}>
        <CustomTextNew
          text={item?.strBusinessUnitName ? item?.strBusinessUnitName : 'N/A'}
          style={styles.businessName}
        />
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew text={item?.strRole || ''} />
          </Column>
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew text={`${item?.strGrievanceType || 'N/A'}`} />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew text={`${item?.strEmployee || 'N/A'}`} />
          </Column>
        </Row>
        {topBar[1]?.isActive ? (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew text={`${item?.strMisconduct || 'N/A'}`} />
            </Column>
          </Row>
        ) : (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={` ${item?.strCategory ? item?.strCategory : ''}`}
                txtSize={14}
              />
            </Column>
          </Row>
        )}
        {topBar[1]?.isActive ? (
          <Row direction="row" justify="space-between">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={` Created By ${item?.dteCreatedDate ? item?.strCreatedUser : ''}`}
                txtSize={14}
              />
            </Column>
          </Row>
        ) : null}
        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={` Created At ${item?.dteCreatedDate ? date_formater(item?.dteCreatedDate) : ''}`}
              txtSize={14}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={` ${item?.strDescription ? item?.strDescription : ''}`}
              txtSize={14}
            />
          </Column>
        </Row>
      </View>
    </Row>
  );
  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
    setGrievanceData([]);
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton
      singleFloatBtmBtnPress={() => navigation.navigate('GrievanceCreate')}
      header={
        <CustomHeader title="Grievance" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <Row style={styles.head}>
        {topBar?.map((item, index) => (
          <TopBarItem
            item={item}
            index={index}
            onPress={handleTopBar}
            key={index?.toString()}
          />
        ))}
      </Row>
      <Column colStyle={styles.appContainer}>
        <DateRange
          control={control}
          setValue={setValue}
          fromDate="fromDate"
          labelFromDate="From Date"
          toDate="toDate"
          labelToDate="To Date"
          isOneRow={true}
          fromDateOnChange={() => setGrievanceData([])}
          toDateOnChange={() => setGrievanceData([])}
          minToDate={watch('fromDate')?.toString()}
          maxFromDate={watch('toDate')?.toString()}
        />
      </Column>

      <Column style={styles.btnContainer}>
        <TouchableOpacity
          style={styles.arrowIcon}
          onPress={handleSubmit(onSubmit)}>
          <CustomTextNew text={'View'} txtColor={COLORS.white} />
        </TouchableOpacity>
      </Column>

      {grievanceData?.length !== 0 ? (
        <CustomFlatList
          contentContainerStyle={styles.flatlistCont}
          data={grievanceData}
          RenderItems={renderItem}
          isLoading={isLoading}
        />
      ) : null}
    </ContainerNew>
  );
};

export default observer(GrievanceMainIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  flatlistCont: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    // paddingBottom: 10,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.graySubText,
    flex: 1,
  },
  cardContent: {
    marginBottom: 10,
  },
  approveTxt: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  pendingTxt: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: '500',
  },
  appContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: COLORS.white,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  arrowIcon: {
    height: 45,
    width: '90%',
    borderRadius: 45 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  head: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
