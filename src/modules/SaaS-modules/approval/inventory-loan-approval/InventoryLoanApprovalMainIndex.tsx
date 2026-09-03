import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  GetBusinessPartnerbyIdDDL,
  GetBusinessUnitByAccountDDL,
  GetLoanItemLanding,
  ItemInventoryLoanTransaction,
} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import DateRange from '../../../../common/components/DateRange';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {useRootStore} from '../../../../stores/rootStore';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import {useToast} from '../../../../common/components/CustomToast';
import CustomModalNew from '../../../../common/components/CustomModal';
const edges: Edge[] = ['right', 'bottom', 'left'];

const InventoryLoanApprovalMainIndex = () => {
  const [landingData, setLandingData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [businessUnitDDL, setBusinessUnitDDL] = useState<any>([]);
  const [businessPartnerDDL, setBusinessPartnerDDL] = useState<any>([]);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [singleRowData, setSingleRowData] = useState<any>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const toaster = useToast();
  const {handleSubmit, control, setValue, watch} = useForm({
    defaultValues: {
      fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      toDate: dayjs().endOf('month').format('YYYY-MM-DD'),
      businessUnit: '',
      businessPartner: '',
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getBusinessUnitDDLByAccountId();
      getBusinessPartnerDDLById(sbu?.businessUnitId);
    },
    [isFocused],
  );

  const getBusinessUnitDDLByAccountId = async () => {
    const params = {
      url: GetBusinessUnitByAccountDDL,
      data: {
        AccountId: userInfo?.intAccountId,
      },
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(params, () => {});
    setBusinessUnitDDL(res || []);
  };
  const getBusinessPartnerDDLById = async (businessUnitId: any) => {
    const params = {
      url: GetBusinessPartnerbyIdDDL,
      data: {
        AccountId: userInfo?.intAccountId,
        BusinessUnitId: businessUnitId,
        PartnerTypeId: 4,
      },
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(params, () => {});
    setBusinessPartnerDDL(res || []);
  };

  const onSubmit = async () => {
    const params = {
      url: GetLoanItemLanding,
      data: {
        AccountId: userInfo?.intAccountId,
        //@ts-ignore
        BusinessUnitId: watch('businessUnit')?.value || 0,
        fromDate: dayjs(watch('fromDate')).format('YYYY-MM-DD'),
        toDate: dayjs(watch('toDate')).format('YYYY-MM-DD'),
        //@ts-ignore
        partnerId: watch('businessPartner')?.value || 0,
        PageNo: currentPage,
        pageSize: 30,
        viewOrder: 'asc',
      },
      baseURL: erpPeopleDeskURL,
      // isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(params, setIsLoading);
    setLandingData((prev: any) =>
      currentPage === 1 ? res?.data || [] : [...prev, ...(res?.data || [])],
    );
  };

  const GetApprovedFromAPI = async (rowItem: any) => {
    const payload = {
      LoanId: rowItem?.loanId,
      ItemRate: rowItem?.itemRate || 0,
      NumAmount: rowItem?.itemAmount || 0,
      ActionById: userInfo?.intErpUserId,
    };
    const params = {
      url: ItemInventoryLoanTransaction,
      data: payload,
      baseURL: erpPeopleDeskURL,
      isPostOrPutWithParams: true,
    };
    // console.log('----payload----', JSON.stringify(params, null, 2));
    const res = await httpRequest(params, () => {});
    if (
      res?.statusCode === 200 ||
      res?.statuscode === 200 ||
      res?.StatusCode === 200 ||
      res?.Statuscode === 200
    ) {
      saveLogAction({
        payload: {
          newEntity: payload,
          isPeopledesk: true,
          actionType: 'Approve',
        },
      });
      toaster.show({
        message: res?.message || 'Approved Successfully',
        type: 'success',
      });
      onSubmit();
      setIsConfirmModal(false);
      setSingleRowData('');
    } else {
      toaster.show({
        message: 'Something went wrong!',
        type: 'error',
      });
    }
  };

  const renderItem = ({item}: any) => (
    <Row rowWidth="100%" isCard direction="column" justify="space-between">
      {/* Card Header */}
      <View style={styles.cardHeader}>
        {/* <Entypo name="shop" size={20} color={COLORS.graySubText} /> */}
        <CustomTextNew
          text={item?.transDate ? date_formater(item?.transDate) : 'N/A'}
          style={styles.businessName}
        />
        <TouchableOpacity
          onPress={() => {
            setSingleRowData(item);
            setIsConfirmModal(true);
          }}>
          <CustomTextNew text={'Approve Here'} txtStyle={styles.approveTxt} />
        </TouchableOpacity>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew text={`BU: ${item?.sbuName || 'N/A'}`} />
          </Column>
          {/* <Column colWidth={'50%'}>
            <CustomTextNew
              text={`Address: ${item?.dealerAddress || 'N/A'}`}
              txtAlign={'right'}
            />
          </Column> */}
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`BU Partner: ${item?.businessPartnerName || 'N/A'}`}
            />
          </Column>
          {/* <Column colWidth={'50%'}>
            <CustomTextNew
              text={`Credit Limit: ${item?.presentCreditLimitAmount || 0}`}
              txtAlign={'right'}
            />
          </Column> */}
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Loan & Transaction Type: ${item?.intLoanTypeName + (item?.transTypeName ? ` (${item?.transTypeName})` : '') || 0}`}
            />
          </Column>
          {/* <Column>
            <CustomTextNew
              text={`Depot: ${item?.presentDepo || 'N/A'}`}
              txtAlign={'right'}
            />
          </Column> */}
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Warehouse: ${item?.wareHouseName || 'N/A'}`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            {/* if item?.lcNumber then show label with value otherwise '' */}
            <CustomTextNew
              text={
                item?.lcNumber ? `LC Number: ${item?.lcNumber || 'N/A'}` : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.shipmentName
                  ? `Shipment Name: ${item?.shipmentName || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.surveyReportNo
                  ? `Survey Report No: ${item?.surveyReportNo || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        {/* Mother Vessel	Lighter Vessel	Item	QTY	Rate	Amount */}
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.motherVessel
                  ? `Mother Vessel: ${item?.motherVessel || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.lighterVessel
                  ? `Lighter Vessel: ${item?.lighterVessel || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew text={`Item: ${item?.itemName || 'N/A'}`} />
          </Column>
        </Row>
        <Row direction="row" justify="space-between">
          <Column colWidth={'50%'}>
            <CustomTextNew
              text={`QTY: ${item?.itemQty ? item?.itemQty?.toFixed(2) : 0}`}
              txtSize={16}
              txtColor={COLORS.primary}
            />
          </Column>
          <Column colWidth={'50%'}>
            <CustomTextNew
              text={`Rate: ${item?.itemRate?.toFixed(4) || 0}`}
              txtSize={16}
              txtColor={COLORS.primary}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Amount: ${item?.itemAmount?.toFixed(2) || 0}`}
              txtSize={16}
              txtColor={COLORS.primary}
            />
          </Column>
        </Row>
      </View>
    </Row>
  );

  return (
    <ContainerNew
      edges={edges}
      // isFloatBottomButton
      // singleFloatBtmBtnPress={() =>
      //   navigation.navigate('InventoryLoanApprovalMainIndexCreate')
      // }
      header={
        <CustomHeader
          title="Inventory Loan Approval"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      {/* <View style={styles.headeFilter}>
        <Row rowWidth="100%" style={{marginBottom: 10}}>
          <Column colWidth="48%">
            <CustomDatePickerNew
              name="fromDate"
              label="From Date"
              control={control}
              rules={{required: true}}
              setValue={setValue}
            />
          </Column>
          <Column colWidth="48%">
            <CustomDatePickerNew
              control={control}
              name="toDate"
              label="To Date"
              setValue={setValue}
              rules={{required: true}}
            />
          </Column>
        </Row>
        <Row rowWidth="100%" style={{marginBottom: 10}}>
          <Column colWidth="48%">
            <CustomDropDownNew
              control={control}
              name="businessUnit"
              label="Business Unit"
              data={businessUnitDDL}
              placholder="Select Business Unit"
              onChange={(val: any) => {
                setValue('businessUnit', val);
                setSelectedBusinessUnit(val?.value);
              }}
            />
          </Column>
          <Column colWidth="48%">
            <CustomDropDownNew
              control={control}
              name="businessPartner"
              label="Business Partner"
              data={businessPartnerDDL}
              placholder="Select Business Partner"
              onChange={(val: any) => {
                setValue('businessPartner', val);
                setSelectedBusinessPartner(val);
              }}
            />
          </Column>
        </Row>
      </View> */}
      <Column style={styles.appContainer}>
        <DateRange
          control={control}
          setValue={setValue}
          fromDate="fromDate"
          labelFromDate="From Date"
          toDate="toDate"
          labelToDate="To Date"
          isOneRow={true}
          minToDate={watch('fromDate')?.toString()}
          maxFromDate={watch('toDate')?.toString()}
        />
        <Row rowStyle={{marginTop: 10}} rowWidth="100%">
          <Column colWidth="48%">
            <CustomDropDownNew
              control={control}
              name="businessUnit"
              label="Business Unit"
              data={[{value: 0, label: 'All'}, ...businessUnitDDL]}
              placholder="Select Business Unit"
              onChange={(val: any) => {
                setValue('businessUnit', val);
              }}
              rules={{required: true}}
            />
          </Column>
          <Column colWidth="48%" colStyle={{marginLeft: 8}}>
            <CustomDropDownNew
              control={control}
              name="businessPartner"
              label="Business Partner"
              data={[{value: 0, label: 'All'}, ...businessPartnerDDL]}
              placholder="Select Business Partner"
              onChange={(val: any) => {
                setValue('businessPartner', val);
              }}
              rules={{required: true}}
            />
          </Column>
        </Row>
        <Column style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.arrowIcon}
            onPress={handleSubmit(onSubmit)}>
            <MaterialIcons
              name="arrow-forward"
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </Column>
        {/* </Row> */}
      </Column>
      {landingData?.length !== 0 ? (
        <CustomFlatList
          contentContainerStyle={styles.flatlistCont}
          data={landingData}
          RenderItems={renderItem}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          isLoading={isLoading}
        />
      ) : null}
      <CustomModalNew
        setIsModalShow={setIsConfirmModal}
        isModalShow={isConfirmModal}
        onPressCallApi={() => GetApprovedFromAPI(singleRowData)}
        modalText={`Are you sure to approve this Loan application?`}
      />
    </ContainerNew>
  );
};

export default observer(InventoryLoanApprovalMainIndex);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headeFilter: {
    paddingHorizontal: 16,
    paddingVertical: 10,
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
  detailText: {
    fontSize: 14,
    color: COLORS.graySubText,
    flex: 1,

    flexWrap: 'wrap',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    paddingTop: 5,
  },
  registrationDate: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginLeft: 8,
  },
  rowStyle: {
    paddingTop: 16,
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
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  btnContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 6,
  },
  arrowIcon: {
    height: 45,
    width: '80%',
    borderRadius: 45 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
