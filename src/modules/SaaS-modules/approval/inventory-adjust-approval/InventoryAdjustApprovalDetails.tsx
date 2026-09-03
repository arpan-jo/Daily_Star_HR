import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {erpiBOSURL} from '../../../../../App';
import {
  AdjustmentApproval,
  GetPendingAdjustmentRowViewByTransId,
} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomTextNew from '../../../../common/components/CustomText';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const InvAdjustApprovalDetails = () => {
  const [detailsData, setDetailsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmModal, setIsConfirmModal] = useState(false);
  const [buttonTag, setButtonTag] = useState<'Approve' | 'Reject'>('Approve');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const toaster = useToast();
  const route = useRoute();
  //@ts-ignore
  const lanData = route?.params?.lanData;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getDetailsFromAPI();
    },
    [isFocused],
  );

  const getDetailsFromAPI = async () => {
    const params = {
      url: GetPendingAdjustmentRowViewByTransId,
      data: {
        intBusinessUnitId: sbu?.businessUnitId || userInfo?.intBusinessUnitId, //sbu?.businessUnitId || 0,
        intInventoryTransactionId: lanData?.intInventoryTransactionId,
      },
      baseURL: erpiBOSURL,
    };
    const res = await httpRequest(params, setIsLoading);
    setDetailsData(res || []);
  };

  const GetApprovedFromAPI = async (action: string) => {
    const commonPayload = {
      intInventoryTransactionId: lanData?.intInventoryTransactionId,
      isApprove: action === 'Approve' ? true : false,
    };
    const params = {
      url: AdjustmentApproval,
      data: commonPayload,
      baseURL: erpiBOSURL,
      method: 'POST',
      isPostOrPutWithParams: true,
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
      setIsConfirmModal(false);
      navigation.goBack();
    } else {
      toaster.show({
        message: 'Something went wrong!',
        type: 'error',
      });
      setIsConfirmModal(false);
    }
  };

  const renderItem = ({item}: any) => (
    <Row rowWidth="100%" isCard direction="column" justify="space-between">
      {/* Card Content */}
      <View style={styles.cardContent}>
        <Row direction="row" justify="space-between">
          <Column colWidth={'50%'}>
            <CustomTextNew
              text={`Code: ${item?.strInventoryTransactionCode || 'N/A'}`}
            />
          </Column>
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Trans Type: ${item?.strTransactionTypeName || 'N/A'}`}
            />
          </Column>
        </Row>

        <Row direction="row" justify="space-between">
          <Column colWidth={'100%'}>
            <CustomTextNew text={`Item: ${item?.strItemName || 'N/A'}`} />
          </Column>
        </Row>

        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`UOM: ${item?.strUoMname ? item?.strUoMname : 'N/A'}`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Trans Qty: ${item?.numTransactionQuantity ? item?.numTransactionQuantity?.toFixed(2) : 'N/A'}`}
            />
          </Column>
        </Row>
        {/* Mother Vessel	Lighter Vessel	Item	QTY	Rate	Amount */}
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.monTransactionValue
                  ? `Trans Value: ${item?.monTransactionValue ? item?.monTransactionValue?.toFixed(2) : 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strProfitCenterName
                  ? `Profit Center: ${item?.strProfitCenterName || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strPlantName
                  ? `Plant: ${item?.strPlantName || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strWarehouseName
                  ? `Warehouse: ${item?.strWarehouseName || 'N/A'}`
                  : ''
              }
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={
                item?.strInventoryLocationName
                  ? `Inv Location: ${item?.strInventoryLocationName || 'N/A'}`
                  : ''
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
      isBottomDoubleButton
      firstBtnTxt="Reject"
      firstBtnStyle={{backgroundColor: COLORS.redish}}
      secondBtnTxt="Approve"
      firstBtmBtnPress={() => {
        setIsConfirmModal(true);
        setButtonTag('Reject');
      }}
      secondBtmBtnPress={() => {
        setIsConfirmModal(true);
        setButtonTag('Approve');
      }}
      header={
        <CustomHeader
          title="Inv Adjust Approval Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      {detailsData?.length !== 0 ? (
        <CustomFlatList
          contentContainerStyle={styles.flatlistCont}
          data={detailsData}
          RenderItems={renderItem}
          isLoading={isLoading}
        />
      ) : null}
      <CustomModalNew
        setIsModalShow={setIsConfirmModal}
        isModalShow={isConfirmModal}
        onPressCallApi={() => GetApprovedFromAPI(buttonTag)}
        deleteText={buttonTag === 'Approve' ? 'Approve' : 'Reject'}
        modalText={`Are you sure to ${buttonTag}?`}
      />
    </ContainerNew>
  );
};

export default observer(InvAdjustApprovalDetails);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  flatlistCont: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cardContent: {
    marginBottom: 10,
  },
});
