import {useIsFocused, useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useRootStore} from '../../../../stores/rootStore';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  CreateOrEditFundTransferRequest,
  GetBusinessUnitByAccountDDL,
  GetFundTransferApprovaListForCreatePagination,
} from '../../../../common/api/api';
import {erpPeopleDeskURL} from '../../../../../App';
import {httpRequest} from '../../../../common/constant/httpRequest';
import Row from '../../../../common/components/Row';
import CustomTextNew from '../../../../common/components/CustomText';
import {date_formater} from '../../../../common/services/dateFormater';
import Column from '../../../../common/components/Column';
import {COLORS} from '../../../../common/constant/Themes';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import LoadingContainer from '../../../../common/components/Loading';
import DateRange from '../../../../common/components/DateRange';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomModalNew from '../../../../common/components/CustomModal';
import {_customPreviousDate} from '../../../../common/services/customPreviousDate';
import {_todayDate} from '../../../../common/services/todayDate';
const edges: Edge[] = ['right', 'bottom', 'left'];

const getStatusColor = (status: number) => {
  switch (status) {
    case 1:
      return COLORS.green; // Approved
    case 2:
      return COLORS.red; // Reject
    default:
      return COLORS.orange; // Pending // Default color
  }
};

const FundRequestApprovalMainIndex = () => {
  const [landingData, setLandingData] = useState<[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [businessUnitDDL, setBusinessUnitDDL] = useState<any>([]);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [singleRowData, setSingleRowData] = useState<any>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const toaster = useToast();
  const {handleSubmit, control, setValue, watch} = useForm({
    defaultValues: {
      fundTransferType: {value: 2, label: 'Inter Company'},
      fromDate: _customPreviousDate(3),
      toDate: _todayDate(),
      requestedUnit: '',
      receivingFromUnit: '',
      status: {value: 0, label: 'All'},
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getBusinessUnitDDLByAccountId();
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
  // https://erp.ibos.io/fino/FundManagement/GetFundTransferApprovaListForCreatePagination?
  // businessUnitId=4&intRequestTypeId=2&intRequestToUnitId=0&isApprove=0&fromDate=2025-08-01&
  // toDate=2025-09-17&viewOrder=desc&pageNo=0&pageSize=15&isCheckNApproved=false&isTreasuryApprove=false

  const onSubmit = async () => {
    const params = {
      url: GetFundTransferApprovaListForCreatePagination,
      data: {
        businessUnitId:
          //@ts-ignore
          watch('requestedUnit')?.value || sbu?.intBusinessUnitId || 0,
        intRequestTypeId: watch('fundTransferType')?.value,
        //@ts-ignore
        intRequestToUnitId: watch('receivingFromUnit')?.value || 0,
        isApprove: watch('status')?.value,

        fromDate: dayjs(watch('fromDate')).format('YYYY-MM-DD'),
        toDate: dayjs(watch('toDate')).format('YYYY-MM-DD'),
        //@ts-ignore
        isCheckNApproved: false,
        isTreasuryApprove: false,
        pageNo: currentPage,
        pageSize: 30,
        viewOrder: 'desc',
      },
      baseURL: erpPeopleDeskURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(params, setIsLoading);
    setLandingData((prev: any) =>
      currentPage === 1 ? res?.data || [] : [...prev, ...(res?.data || [])],
    );
  };

  const GetApprovedFromAPI = async (rowItem: any, action: string) => {
    const commonFileds = {
      intFundTransferRequestId: rowItem?.intFundTransferRequestId || 0,
      strRequestCode: rowItem?.strRequestCode || '',
      intRequestTypeId: rowItem?.intRequestTypeId,
      strRequestType: rowItem?.strRequestType || '',
      intRequestByUnitId: rowItem?.intRequestByUnitId || 0,
      strRequestByUnitName: rowItem?.strRequestByUnitName || '',
      intRequestToUnitId: rowItem?.intRequestToUnitId || 0,
      strRequestToUnitName: rowItem?.strRequestToUnitName || '',
      dteRequestDate: rowItem?.dteRequestDate || '',
      numAmount: rowItem?.numAmount || 0,

      strRemarks: rowItem?.strRemarks || '',
      dteExpectedDate: rowItem?.dteExpectedDate || '',
      intResponsibleEmpId: rowItem?.intResponsibleEmpId || 0,
      strResponsibleEmpName: rowItem?.strResponsibleEmpName || '',
      isActive: rowItem?.isActive ?? true,
      isApproved: action === 'Approve' ? 1 : 2, // Approve
      intApproveBy: userInfo?.intErpUserId || 0,
      dteApproveDatetime: dayjs().format('YYYY-MM-DDTHH:mm:ss.fffZ'),
      strRequestPartnerId: rowItem?.strRequestPartnerId || 0,
      strRequestPartnerName: rowItem?.strRequestPartnerName || '',
      isTransferCreated: 0, // 0 for approval
      strGivenPartnerName: rowItem?.strGivenPartnerName || '',
      strGivenstrPartnerCode: rowItem?.strGivenstrPartnerCode || '',
      strRequestPartnerCode: rowItem?.strRequestPartnerCode || '',
      intUpdateBy: userInfo?.intErpUserId || 0,
      intGivenPartnerId: rowItem?.intGivenPartnerId || 0,
    };

    const commonBankFields = {
      intRequestedBankId: rowItem.intRequestedBankId || 0,
      strRequestedBankName: rowItem.strRequestedBankName || '',
      intRequestedBankBranchId: rowItem.intRequestedBankBranchId || 0,
      strRequestedBankBranchName: rowItem.strRequestedBankBranchName || '',
      strRequestedBankAccountNumber:
        rowItem.strRequestedBankAccountNumber || '',
      strRequestedBankAccountName: rowItem.strRequestedBankAccountName || '',
      intRequestedBankAccountId: rowItem.intRequestedBankAccountId || 0,
      strRequestedBankRouting: rowItem.strRequestedBankRouting || '',
      intRequestGLId:
        rowItem?.intRequestGLId?.generalLedgerId ||
        rowItem?.intRequestGlid ||
        0,
      strRequestGlName:
        rowItem?.strRequestGlName?.generalLedgerName ||
        rowItem?.strRequestGlName ||
        '',
      strRequestGlCode:
        rowItem?.strRequestGlCode?.generalLedgerCode ||
        rowItem?.strRequestGlCode ||
        '',
      intGivenBankId: rowItem.intGivenBankId || 0,
      strGivenBankName: rowItem.strGivenBankName || '',
      intGivenBankBranchId: rowItem.intGivenBankBranchId || 0,
      strGivenBankBranchName: rowItem.strGivenBankBranchName || '',
      strGivenBankAccountNumber: rowItem.strGivenBankAccountNumber || '',
      strGivenBankAccountName: rowItem.strGivenBankAccountName || '',
      strGivenBankAccountId: rowItem?.strGivenBankAccountId || 0,
      strGivenBankRouting: rowItem?.strGivenBankRouting || '',
      intGivenGlid: rowItem?.intGivenGlid || 0,
      strGivenGlCode: rowItem?.strGivenGlCode || '',
      strGivenGlName: rowItem?.strGivenGlName || '',
    };

    const finalBankFields = {...commonBankFields};
    const commonPayload = {
      ...commonFileds,
      ...finalBankFields,
      strReceivingJournal: '',
      strSendingJournal: '',
      isFundReceived: false,
    };

    const params = {
      url: CreateOrEditFundTransferRequest,
      data: commonPayload,
      baseURL: erpPeopleDeskURL,
      method: 'POST',
    };
    //  console.log('----payload----', JSON.stringify(params, null, 2));
    const res = await httpRequest(params, () => {});
    if (
      res?.statusCode === 200 ||
      res?.statuscode === 200 ||
      res?.StatusCode === 200 ||
      res?.Statuscode === 200
    ) {
      saveLogAction({
        payload: {
          newEntity: commonPayload,
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
      setIsConfirmModal(false);
      setSingleRowData('');
    }
  };

  const renderItem = ({item}: any) => (
    <Row rowWidth="100%" isCard direction="column" justify="space-between">
      <Row direction="row" justify="space-between">
        <Column colWidth={'30%'}>
          <CustomTextNew
            text={
              item?.dteRequestDate ? date_formater(item?.dteRequestDate) : 'N/A'
            }
            txtStyle={styles.businessName}
          />
        </Column>
        {/* need status */}
        <Column
          colWidth={item?.isApproved === 0 ? '30%' : '70%'}
          colStyle={{alignItems: 'flex-end'}}>
          <CustomTextNew
            text={
              item.isApproved === 1
                ? 'Approved'
                : item.isApproved === 2
                  ? 'Rejected'
                  : 'Pending'
            }
            txtStyle={{
              ...styles.businessName,
              color: getStatusColor(item.isApproved),
            }}
          />
        </Column>
        <Column colWidth={'40%'} style={{alignItems: 'flex-end'}}>
          {item.isApproved === 0 ? (
            <TouchableOpacity
              style={{
                ...styles.status,
                backgroundColor: COLORS.primary,
              }}
              onPress={() => {
                setSingleRowData(item);
                setIsConfirmModal(true);
              }}>
              <CustomTextNew text="Approve/Reject" style={styles.approveTxt} />
            </TouchableOpacity>
          ) : null}
        </Column>
      </Row>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <Row direction="row" justify="space-between">
          <Column colWidth={'50%'}>
            <CustomTextNew text={`Code: ${item?.strRequestCode || 'N/A'}`} />
          </Column>
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Request By: ${item?.strRequestByUnitName || 'N/A'}`}
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
              text={`Request To: ${item?.strRequestToUnitName || 'N/A'}`}
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
              text={`From Account/GL: ${
                item?.strTransferBy === 'Cash To Bank'
                  ? item?.strRequestGlName
                  : item?.strTransferBy === 'Bank To Cash'
                    ? item?.strGivenBankAccountName
                    : item?.strGivenBankName || ''
              }`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            {/* if item?.lcNumber then show label with value otherwise '' */}
            <CustomTextNew
              text={`To Account/GL: ${
                item?.strTransferBy === 'Bank To Cash'
                  ? item?.strRequestGlName
                  : item?.strTransferBy === 'Cash To Bank'
                    ? item?.strGivenBankAccountName || ''
                    : item?.strRequestedBankAccountName || ''
              }`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Expect Date: ${
                item?.dteExpectedDate
                  ? date_formater(item?.dteExpectedDate)
                  : 'N/A'
              }`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Amount: ${item?.numAmount?.toFixed(2) || 0}`}
            />
          </Column>
        </Row>
        {/* Mother Vessel	Lighter Vessel	Item	QTY	Rate	Amount */}
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strResponsibleEmpName
                  ? `Responsible: ${item?.strResponsibleEmpName || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strRemarks ? `Remarks: ${item?.strRemarks || 'N/A'}` : ''
              }
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
          title="Fund Request Approval"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <Column style={styles.appContainer}>
        <Row rowStyle={{marginTop: 10}} rowWidth="100%">
          <Column colWidth="48%">
            <CustomDropDownNew
              control={control}
              name="fundTransferType"
              label="Fund Transfer Type"
              data={[{value: 2, label: 'Inter Company'}]}
              placholder="Select Fund Transfer Type"
              onChange={(val: any) => {
                setValue('fundTransferType', val);
                setLandingData([]);
              }}
              rules={{required: true}}
            />
          </Column>
          <Column colWidth="48%" colStyle={{marginLeft: 8}}>
            <CustomDropDownNew
              control={control}
              name="status"
              label="Status"
              data={[
                {value: 0, label: 'All'},
                {value: 1, label: 'Pending'},
                {value: 2, label: 'Approved'},
              ]}
              placholder="Select Status"
              onChange={(val: any) => {
                setValue('status', val);
                setLandingData([]);
              }}
              rules={{required: true}}
            />
          </Column>
        </Row>
        <DateRange
          control={control}
          setValue={setValue}
          fromDate="fromDate"
          labelFromDate="From Date"
          toDate="toDate"
          labelToDate="To Date"
          isOneRow={true}
          fromDateOnChange={() => setLandingData([])}
          toDateOnChange={() => setLandingData([])}
          minToDate={watch('fromDate')?.toString()}
          maxFromDate={watch('toDate')?.toString()}
        />
        <Row rowStyle={{marginTop: 10}} rowWidth="100%">
          <Column colWidth="48%">
            <CustomDropDownNew
              control={control}
              name="requestedUnit"
              label="Requested Unit"
              data={businessUnitDDL}
              placholder="Select Requested Unit"
              onChange={(val: any) => {
                setValue('requestedUnit', val);
                setLandingData([]);
              }}
              rules={{required: true}}
            />
          </Column>
          <Column colWidth="48%" colStyle={{marginLeft: 8}}>
            <CustomDropDownNew
              control={control}
              name="receivingFromUnit"
              label="Receiving From Unit"
              data={[{value: 0, label: 'All'}, ...businessUnitDDL]}
              placholder="Select Receiving From Unit"
              onChange={(val: any) => {
                setValue('receivingFromUnit', val);
                setLandingData([]);
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
        onPressCallApi={() => GetApprovedFromAPI(singleRowData, 'Approve')}
        cancelText="Reject"
        onCancelPressCallApi={() => GetApprovedFromAPI(singleRowData, 'Reject')}
        deleteText="Approve"
        modalText={`Are you sure to Approve / Reject this Fund Request?`}
      />
    </ContainerNew>
  );
};

export default observer(FundRequestApprovalMainIndex);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatlistCont: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  status: {
    // need background color like button
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.graySubText,
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
    color: COLORS.white,
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
    width: '90%',
    borderRadius: 45 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
