import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {GetTickets} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import DateRange from '../../../../common/components/DateRange';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {dateFormater} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';
import dayjs from 'dayjs';
const edges: Edge[] = ['right', 'bottom', 'left'];

export interface Ticket {
  ticketId: number;
  issueTypeId: number;
  issueTypeName: string;
  requesterId: number;
  requesterName: string;
  creatorId: number;
  creatorName: string;
  contactNo: string;
  createDate: string; // ISO format string
  delegateToId: number | null;
  delegateTo: string | null;
  investigationById: number | null;
  investigationBy: string | null;
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed' | string;
  isTicketClosed: boolean;
  rating: number | null;
  businessUnit: string;
  issueDetails: string;
  currentProcessName: string;
  currentProcessId: number;
  currentRowId: number;
}

export interface TicketListResponse {
  tickets: Ticket[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

const IssueMainIndex = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [landingData, setLandingData] = useState<TicketListResponse>();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();

  const {control, handleSubmit, setValue, watch, getValues: _getValues}: any = useForm();
  const fromDate = dayjs(watch('fromDate')).format('YYYY-MM-DD');
  const toDate = dayjs(watch('toDate')).format('YYYY-MM-DD');
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (currentPage > 1 && fromDate && toDate) {
        getLandingData();
      }
    },
    [isFocused, currentPage],
  );

  const getLandingData = async () => {
    const api_params = {
      url: GetTickets,
      data: {
        businessUnitId: userInfo?.intBusinessUnitId,
        fromDate: fromDate,
        toDate: toDate,
        searchTerm: '',
        employeeId: userInfo?.intEmployeeId,
        pageNumber: currentPage,
        pageSize: 30,
      },
    };
    const res = await httpRequest(api_params, setIsLoading);
    setLandingData((prev: any) =>
      currentPage === 1 ? res?.tickets : [...prev, ...res?.tickets],
    );
  };
  const onSubmit = (_data: any) => {
    setCurrentPage(1);
    getLandingData();
  };
  const renderItem = ({item}: {item: Ticket}) => {
    return (
      <Column colWidth={'100%'} colStyle={{paddingHorizontal: 16}}>
        <Row>
          <Column isCard colWidth={'100%'} isPressOn={true}>
            <Column colWidth={'100%'}>
              <Row rowWidth="100%" align="center" justify="space-between">
                <Column colWidth={'75%'}>
                  <CustomTextNew
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                    lineHight={20}
                    text={
                      `Create Date: ${dateFormater(item?.createDate)}` || ''
                    }
                  />
                  <CustomTextNew
                    lineHight={20}
                    txtColor={COLORS.graySubText}
                    txtWeight={'600'}
                    text={item?.issueTypeName || ''}
                  />

                  <CustomTextNew
                    lineHight={20}
                    txtColor={COLORS.graySubText}
                    text={`Requester Name: ${item?.requesterName}` || ''}
                  />
                  <CustomTextNew
                    lineHight={20}
                    txtColor={COLORS.graySubText}
                    text={`DelegateTo: ${item?.delegateTo || 'N/A'}` || ''}
                  />
                </Column>

                <Column colWidth={'25%'} align="center">
                  <TouchableOpacity
                    style={styles.outlineButton}
                    onPress={() =>
                      navigation.navigate('IssueDetails', {
                        ticketId: item?.ticketId,
                      })
                    }>
                    <Text style={styles.buttonText}>Status</Text>
                  </TouchableOpacity>
                </Column>
              </Row>
            </Column>
          </Column>
        </Row>
      </Column>
    );
  };

  return (
    <ContainerNew
      // isScrollView={false}
      edges={edges}
      isFloatBottomButton
      singleFloatBtmBtnPress={() => navigation.navigate('IssueCreate')}
      header={<CustomHeader title="Issue" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <Column colWidth={'100%'} colStyle={styles.appContainer}>
        <Column isCard colWidth={'100%'}>
          <DateRange
            control={control}
            setValue={setValue}
            fromDateOnChange={value => {
              setValue('fromDate', value);
              setLandingData([]);
              setCurrentPage(1);
            }}
            toDateOnChange={value => {
              setValue('toDate', value);
              setLandingData([]);
              setCurrentPage(1);
            }}
            fromDate="fromDate"
            labelFromDate="From Date"
            toDate="toDate"
            labelToDate="To Date"
            isOneRow={true}
            minToDate={watch('fromDate')?.toString()}
            maxFromDate={watch('toDate')?.toString()}
          />
          <Column style={styles.btnContainer}>
            <TouchableOpacity
              style={styles.arrowIcon}
              onPress={handleSubmit(onSubmit)}>
              <CustomTextNew text={'View'} txtColor={COLORS.white} />
            </TouchableOpacity>
          </Column>
        </Column>
      </Column>
      <CustomFlatList
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        data={landingData}
        RenderItems={renderItem}
        isLoading={isLoading}
      />
    </ContainerNew>
  );
};

export default observer(IssueMainIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: COLORS.primary, // iOS blue or customize
    borderRadius: 100,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  buttonText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  appContainer: {
    paddingHorizontal: 16,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  arrowIcon: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 100,
    width: '100%',
    marginTop: 5,
  },
});
