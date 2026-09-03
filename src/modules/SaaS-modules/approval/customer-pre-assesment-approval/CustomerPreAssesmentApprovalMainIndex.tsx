/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import { StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useForm} from 'react-hook-form';
import {TouchableOpacity} from 'react-native';
import dayjs from 'dayjs';
import {useRootStore} from '../../../../stores/rootStore';
import {
  _firstDateOfMonth,
  _todayDate} from '../../../../common/services/todayDate';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import Column from '../../../../common/components/Column';
import {date_formater} from '../../../../common/services/dateFormater';
import {COLORS} from '../../../../common/constant/Themes';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import LoadingContainer from '../../../../common/components/Loading';
import DateRange from '../../../../common/components/DateRange';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import NoData from '../../../../common/components/NoData';
import {GetCustomerPreAssessmentApprovalInfo} from '../../../../common/api/api';
import {erpiBOSURL} from '../../../../../App';
import {httpRequest} from '../../../../common/constant/httpRequest';
import Row from '../../../../common/components/Row';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
const edges: Edge[] = ['right', 'bottom', 'left'];

const CustomerPreAssesmentApprovalMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {sbu, userInfo} = useRootStore();
  const [_isSearch, _setIsSearch] = useState(false);
  const [searchQuery, _setSearchQuery] = useState('');
  const [customerPreAssesmentLanding, setCustomerPreAssesmentLanding] =
    useState<any[]>([]);
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
  //  https://localhost:44318/partner/CustomerPreAssesment/GetCustomerPreAssessmentApprovalInfo?
  //  businessUnitId=4&districtId=0&thanaId=0&fromDate=2025-01-01&toDate=2025-12-30&pageNo=1&pageSize=100&
  // search=01865411882&employeeId=4566&approvedBy=Supervisor&approvalStatus=Pending
  const onSubmit = async () => {
    const params = {
      url: GetCustomerPreAssessmentApprovalInfo,
      data: {
        businessUnitId: sbu?.businessUnitId || 0,
        districtId: 0,
        thanaId: 0,
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
    setCustomerPreAssesmentLanding((prev: any) =>
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
        navigation.navigate('CustomerPreAssessmentApprovalDetails', {
          details: item,
          approvalStatus: watch('status')?.label || '',
        })
      }>
      <Column style={styles.topRow}>
        <Column style={{flex: 1}}>
          <Text style={styles.employeeName}>{item?.strCustomerName}</Text>
          <Text style={styles.designation}>{item?.strMobileNumber}</Text>
          <Text style={styles.businessUnit}>{item?.strCustomerAddress}</Text>
        </Column>
      </Column>

      <Column style={styles.infoRow}>
        {/* <Icon name="car" size={18} color={COLORS.graySubText} /> */}
        <Text style={styles.infoText}>
          {item?.dteAssessmentDate
            ? date_formater(item?.dteAssessmentDate)
            : ''}
        </Text>
      </Column>

      <Column style={styles.infoRow}>
        {/* <Icon name="map-marker-distance" size={18} color={COLORS.graySubText} /> */}
        <Text style={styles.infoText}>
          Monthly Collection: {item?.decMonthCollectionAmount} | Score:{' '}
          {item?.numMonthCollectionAmountScore}
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
        {/* <Text style={styles.netPayableText}>
          Total Cost: {calculateTotalCost(item) || '0'}
        </Text> */}
        {/* <Text style={styles.netPayableText}>
          Net Payable: {calculateNetPayable(item) || '0'}
        </Text> */}
      </Column>
    </Column>
  );

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Customer Pre Assessment Approval"
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
          toDateOnChange={() => setCustomerPreAssesmentLanding([])}
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
                setCustomerPreAssesmentLanding([]);
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

        {customerPreAssesmentLanding?.length > 0 ? (
          <View>
            <CustomFlatList
              contentContainerStyle={{
                paddingBottom: 150,
              }}
              data={customerPreAssesmentLanding}
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

export default CustomerPreAssesmentApprovalMainIndex;
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
  netPayableRow: {marginTop: 10},
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
});
