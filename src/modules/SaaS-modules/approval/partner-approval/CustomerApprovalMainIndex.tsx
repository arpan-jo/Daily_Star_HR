import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';


import {useRootStore} from '../../../../stores/rootStore';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

import Row from '../../../../common/components/Row';
import CustomTextNew from '../../../../common/components/CustomText';
import Column from '../../../../common/components/Column';
import LoadingContainer from '../../../../common/components/Loading';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import {COLORS} from '../../../../common/constant/Themes';
const _edges: Edge[] = ['right', 'bottom', 'left'];

const CustomerApprovalMainIndex = ({listData}: any) => {
  const [_landingData, _setLandingData] = useState<any[]>([]);
  const [isLoading, _setIsLoading] = useState(false);
  const [_isConfirmModal, _setIsConfirmModal] = useState(false);
  const [_singleRowData, _setSingleRowData] = useState<any>(null);
  //   const [selectedTab, setSelectedTab] = useState<TabOption>(tabs[0]);
  const isFocused = useIsFocused();
  const _navigation = useNavigation();
  const {userInfo: _userInfo, sbu: _sbu} = useRootStore();
  const {saveLogAction: _saveLogAction} = useAuditLogSave();
  const _toaster = useToast();
  const {handleSubmit: _handleSubmit, control: _control, setValue: _setValue, watch: _watch} = useForm();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLandingAPI();
    },
    [isFocused],
  );
  // https://businessbook.ai/business/VisitorManagement/GetAllVisitorRequest?
  // cardId=8861&statusId=0&isEmployee=true
  const getLandingAPI = async () => {
    //  const params = {
    //    url: GetAllVisitorRequest,
    //    data: {
    //      cardId: userInfo?.intEmployeeId || 0, // 4757
    //      //@ts-ignore
    //      statusId: selectedTab?.value || 0,
    //      isEmployee: true, //
    //    },
    //    baseURL: 'https://businessbook.ai',
    //    isConsole: true,
    //    isConsoleParams: true,
    //  };
    //  const res = await httpRequest(params, setIsLoading);
    //  setLandingData(res);
  };

  const _GetApprovedFromAPI = async (
    _rowItem: any,
    _actionType: 'approve' | 'reject',
  ) => {
    //  const payload = {
    //    id: rowItem?.intId || 0,
    //    statusId: actionType === 'approve' ? 1 : 2,
    //    actionById: userInfo?.intEmployeeId || 0,
    //  };
    //  const params = {
    //    url: AcceptOrRejectVisitorRequest,
    //    data: payload,
    //    baseURL: 'https://businessbook.ai',
    //    isPostOrPutWithParams: true,
    //    method: 'POST',
    //  };
    //  const res = await httpRequest(params, () => {});
    //  if (
    //    res?.statusCode === 200 ||
    //    res?.statuscode === 200 ||
    //    res?.StatusCode === 200 ||
    //    res?.Statuscode === 200
    //  ) {
    //    saveLogAction({
    //      payload: {
    //        newEntity: payload,
    //        isPeopledesk: true,
    //        actionType: 'Approve',
    //      },
    //    });
    //    toaster.show({
    //      message: res?.message || 'Approved Successfully',
    //      type: 'success',
    //    });
    //    getLandingAPI();
    //    setIsConfirmModal(false);
    //    setSingleRowData('');
    //  } else {
    //    toaster.show({
    //      message: 'Something went wrong!',
    //      type: 'error',
    //    });
    //  }
  };

  const renderItem = ({item}: any) => (
    <Row rowWidth="100%" isCard direction="column" justify="space-between">
      {/* Card Content */}
      <View style={styles.cardContent}>
        {item?.strPartnerName && (
          <Row direction="row" justify="space-between">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Partner Name:${item?.strPartnerName || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Partner Type: ${item?.strPartnerTypeName || 'N/A'}`}
            />
          </Column>
        </Row>
        {item?.strCompany && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Company Name: ${item?.strCompanyName ? item?.strCompanyName : ''}`}
                txtSize={14}
              />
            </Column>
          </Row>
        )}
        {item?.strNatureOfBusinessName && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Business Nature: ${item?.strNatureOfBusinessName || 'N/A'}`}
              />
            </Column>
          </Row>
        )}

        {item?.strTypeOfBusinessName && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Business Type: ${item?.strTypeOfBusinessName || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.numScore && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew text={`Score: ${item?.numScore || 'N/A'}`} />
            </Column>
          </Row>
        )}

        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Existing Partner: ${item?.isExistingPartner ? 'Yes' : 'No'}`}
            />
          </Column>
        </Row>
        {item?.strBankName && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew text={`Bank: ${item?.strBankName || 'N/A'}`} />
            </Column>
          </Row>
        )}
        {item?.strBankBranchName && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Bank Branch: ${item?.strBankBranchName || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strRoutingNumber && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Routing No: ${item?.strRoutingNumber || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strAccountNumber && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Account No: ${item?.strAccountNumber || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strReferenceEmployeeName && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Reference Employee: ${item?.strReferenceEmployeeName || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strEmailAddress && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Email: ${item?.strEmailAddress || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strMobileNumber && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Mobile: ${item?.strMobileNumber || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strOfficeAddress && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Office Address: ${item?.strOfficeAddress || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
        {item?.strWarehouseAddress && (
          <Row direction="row">
            <Column colWidth={'100%'}>
              <CustomTextNew
                text={`Warehouse: ${item?.strWarehouseAddress || 'N/A'}`}
              />
            </Column>
          </Row>
        )}
      </View>
    </Row>
  );

  return (
    <View style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      {listData?.length !== 0 ? (
        <CustomFlatList
          contentContainerStyle={styles.flatlistCont}
          data={listData}
          RenderItems={renderItem}
          isLoading={isLoading}
        />
      ) : null}
      {/* <CustomModalNew
        setIsModalShow={setIsConfirmModal}
        isModalShow={isConfirmModal}
        onPressCallApi={() => GetApprovedFromAPI(singleRowData, 'approve')}
        deleteText="Approve"
        cancelText="Reject"
        onCancelPressCallApi={() => {
          GetApprovedFromAPI(singleRowData, 'reject');
        }}
        //  isBtnSideBySide
        modalText={`Are you sure to approve this  application?`}
      /> */}
    </View>
  );
};

export default observer(CustomerApprovalMainIndex);
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
