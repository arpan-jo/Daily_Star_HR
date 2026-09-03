/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {erpiBOSURL} from '../../../../../App';
import {GetSalesForceAssessmentApprovalInfo} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import DateRange from '../../../../common/components/DateRange';
import LoadingContainer from '../../../../common/components/Loading';
import NoData from '../../../../common/components/NoData';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {
  _firstDateOfMonth,
  _todayDate} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const SalesForceAssesmentApprovalMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {sbu, userInfo} = useRootStore();
  const [_isSearch, _setIsSearch] = useState(false);
  const [searchQuery, _setSearchQuery] = useState('');
  const [salesForceAssesmentLanding, setSalesForceAssesmentLanding] = useState<
    any[]
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const {handleSubmit, watch, control, setValue} = useForm({
    defaultValues: {
      fromDate: _firstDateOfMonth(),
      toDate: _todayDate(),
      status: {label: 'Pending', value: 'Pending'},
    },
  });

  //get data
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      // onSubmit();
    },
    [searchQuery, currentPage],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (!searchQuery) {
        // Fetch data without search query
        onSubmit();
      }
    },
    [isFocused],
  );
  // https://localhost:44357/oms/SalesForceAssessment/GetSalesForceAssessmentApprovalInfo?
  // businessUnitId=4&fromDate=2025-01-01&toDate=2025-12-30&pageNo=1&pageSize=100&employeeId=1236&
  // approvedBy=Supervisor&approvalStatus=Pending
  const onSubmit = async () => {
    const params = {
      url: GetSalesForceAssessmentApprovalInfo,
      data: {
        businessUnitId: sbu?.businessUnitId || 0,
        fromDate: dayjs(watch('fromDate')).format('YYYY-MM-DD'),
        toDate: dayjs(watch('toDate')).format('YYYY-MM-DD'),
        pageNo: currentPage,
        pageSize: 100,
        search: searchQuery,
        employeeId: userInfo?.intEmployeeId || 0,
        approvedBy: 'Supervisor',
        approvalStatus: watch('status')?.label || '',
      },
      baseURL: erpiBOSURL,
      isConsole: true,
    };
    const res = await httpRequest(params, setIsLoading);
    setSalesForceAssesmentLanding((prev: any) =>
      currentPage === 1 ? res?.data : [...prev, ...res?.data],
    );
  };

  const renderItem = ({item}: {item: any}) => (
    <Column
      isCard
      colWidth="100%"
      colStyle={styles.card1}
      isPressOn={false}
      onCardPress={() =>
        navigation.navigate('SalesForceAssessmentDetails', {
          details: item,
          isFromApproval: true,
          approvalStatus: watch('status')?.label || '',
        })
      }>
      <Column style={styles.topRow}>
        <Column style={{flex: 1}}>
          <Text style={styles.employeeName}>
            {item?.strSalesPersonName || ''}
          </Text>
          <Text style={styles.designation}>{item?.unitName}</Text>
          <Text style={styles.businessUnit}>{item?.strRegionName}</Text>
        </Column>
      </Column>

      <Column style={styles.infoRow}>
        {/* <Icon name="car" size={18} color={COLORS.graySubText} /> */}
        <Text style={styles.infoText}>
          {item?.dteToDate ? date_formater(item?.dteToDate) : ''}
        </Text>
      </Column>

      <Column style={styles.infoRow}>
        {/* <Icon name="map-marker-distance" size={18} color={COLORS.graySubText} /> */}
        <Text style={styles.infoText}>
          Market Coverage: {item?.decMarketCoveragePercent + ' %'} | Coll Rec
          Amount: {item?.decCollectionReceivedAmount}
        </Text>
      </Column>

      <Column style={styles.expenseRow}>
        <Column style={styles.expenseItem}>
          <Icon
            name="scoreboard-outline"
            size={18}
            color={COLORS.graySubText}
          />
          <Text style={styles.infoText}>
            Total Score: {item?.numGrandTotalScore}
          </Text>
        </Column>

        <Column style={styles.expenseItem}>
          <Icon name="credit-card" size={18} color={COLORS.graySubText} />
          <Text style={styles.infoText}>Grade: {item?.strGrade}</Text>
        </Column>

        {/* <Column style={styles.expenseItem}>
          <Icon name="road-variant" size={18} color={COLORS.graySubText} />
          <Text style={styles.infoText}>Toll: {item?.numTollAmount}</Text>
        </Column> */}
      </Column>

      <Column style={styles.netPayableRow}>
        {item?.isRejected ? (
          <Text
            style={
              item?.isRejected
                ? styles.netPayableReject
                : styles.netPayableTextPending
            }>
            {item?.isRejected ? 'Rejected' : ''}
          </Text>
        ) : (
          <>
            <Text
              style={
                item?.isApprovedBySupervisor
                  ? styles.netPayableTextApproved
                  : styles.netPayableTextPending
              }>
              Supervisor:{' '}
              {item?.isApprovedBySupervisor ? 'Approved' : 'Pending'}
            </Text>
            <Text
              style={
                item?.isApprovedByAdmin
                  ? styles.netPayableTextApproved
                  : styles.netPayableTextPending
              }>
              Admin: {item?.isApprovedByAdmin ? 'Approved' : 'Pending'}
            </Text>
          </>
        )}
      </Column>
    </Column>
  );

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Sales Force Assessment Approval"
        />
      }
      style={styles.container}>
      {/* tab body */}
      <LoadingContainer isLoading={isLoading} />
      <Column style={styles.appContainer}>
        <DateRange
          control={control}
          setValue={setValue}
          fromDate="fromDate"
          labelFromDate="From Date"
          toDate="toDate"
          labelToDate="To Date"
          isOneRow={true}
          fromDateOnChange={() => console.log('from date changed')}
          toDateOnChange={() => setSalesForceAssesmentLanding([])}
          minToDate={watch('fromDate')?.toString()}
          maxFromDate={watch('toDate')?.toString()}
        />

        <Row>
          <Column colWidth={'50%'}>
            <CustomDropDownNew
              control={control}
              name={'status'}
              data={[
                {label: 'Pending', value: 'Pending'},
                {label: 'Approved', value: 'Approved'},
                {label: 'Rejected', value: 'Rejected'},
              ]}
              placholder="Select Status"
              onChange={(opt: any) => {
                setValue('status', opt);
                setSalesForceAssesmentLanding([]);
              }}
            />
          </Column>
          <Column colWidth={'48%'}>
            <Column style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.arrowIcon}
                onPress={handleSubmit(onSubmit)}>
                <Icon name="arrow-right-thin" size={25} color={COLORS.white} />
              </TouchableOpacity>
            </Column>
          </Column>
        </Row>

        {/* </Row> */}

        {salesForceAssesmentLanding?.length > 0 ? (
          <View>
            <CustomFlatList
              contentContainerStyle={{
                paddingBottom: 150,
              }}
              data={salesForceAssesmentLanding}
              RenderItems={renderItem}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              isLoading={isLoading}
            />
          </View>
        ) : (
          // need screen center no data found
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 100,
            }}>
            <NoData />
          </View>
        )}
      </Column>
    </ContainerNew>
  );
};

export default SalesForceAssesmentApprovalMainIndex;
const styles = StyleSheet.create({
  container: {
    //  flex: 1,
  },
  appContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  listContainer: {paddingHorizontal: 16},
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  datePickerWrapper: {flex: 1},
  buttonWrapper: {width: 80},
  ColumnButton: {
    paddingVertical: 12,
    borderRadius: 10,
  },
  card1: {marginBottom: 10},
  topRow: {flexDirection: 'row', alignItems: 'center'},
  employeeName: {fontSize: 14, fontWeight: '600', color: COLORS.black},
  designation: {fontSize: 13, color: COLORS.graySubText},
  businessUnit: {fontSize: 13, color: COLORS.graySubText},
  infoRow: {flexDirection: 'row', alignItems: 'center', marginTop: 6},
  infoText: {fontSize: 13, color: COLORS.graySubText},
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  expenseItem: {flexDirection: 'row', alignItems: 'center'},
  netPayableText: {fontSize: 14, fontWeight: '600', color: COLORS.black},
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  arrowIcon: {
    height: 45,
    width: '90%',
    borderRadius: 45 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  netPayableRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  netPayableReject: {fontSize: 14, fontWeight: '600', color: COLORS.redish},
  netPayableTextApproved: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.green,
  },
  netPayableTextPending: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
  },
});
