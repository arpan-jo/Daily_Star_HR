/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import Column from '../../../../common/components/Column';
import Row from '../../../../common/components/Row';
import CustomTextNew from '../../../../common/components/CustomText';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  ApproveCommercialCoating,
  GetShipmentById,
} from '../../../../common/api/api';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import LcShipmentViewTable from './LcShipmentViewTable';
import {useForm} from 'react-hook-form';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import {useToast} from '../../../../common/components/CustomToast';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const LcShipmentView = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [shipmentDetails, setShipmentDetails] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  //@ts-ignore
  const shipment = route?.params?.shipment;
  const {userInfo} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const toaster = useToast();

  const {control, setValue, reset} = useForm();

  useAsyncEffect(() => {
    if (shipment) {
      getByShipmentDetails();
    }
  }, [shipment]);

  const getByShipmentDetails = async () => {
    const api_params = {
      url: GetShipmentById,
      data: {
        shipmentId: shipment?.value || 0,
      },
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(api_params, () => {});
    if (res) {
      setShipmentDetails(res);
      // need default set value
      res?.objRow?.forEach((item: any, index: number) => {
        setValue(
          `numShipmentLossGainQty${index}`,
          item?.numShipmentLossGainQty?.toString(),
        );
      });
    }
  };
  // {"shipmentId":10807,"poId":121675,"approveBy":509697,"row":[{"intItemId":126385,"numShipmentLossGainQty":0},{"intItemId":126386,"numShipmentLossGainQty":0}]}
  const handleSaveAndApprove = async () => {
    const payload = {
      approveBy: userInfo?.intErpUserId,
      poId: shipmentDetails?.objHeader?.poId,
      shipmentId: shipmentDetails?.objHeader?.shipmentId,
      row: shipmentDetails?.objRow?.map((item: any) => ({
        intItemId: item?.itemId,
        numShipmentLossGainQty: +item?.numShipmentLossGainQty,
      })),
    };
    const api_params = {
      url: ApproveCommercialCoating,
      data: payload,
      baseURL: erpPeopleDeskURL,
      method: 'POST',
    };
    const response = await httpRequest(api_params, setIsLoading);
    if (
      response?.statusCode === 200 ||
      response?.StatusCode === 200 ||
      response?.statuscode === 200
    ) {
      saveLogAction({
        payload: {
          newEntity: payload,
          isPeopledesk: true,
          actionType: 'Approve',
        },
      });
      toaster.show({
        message: 'Approved successfully',
        type: 'success',
      });
      reset();
      navigation.goBack();
    } else {
      toaster.show({
        type: 'warning',
        message: 'Something Went Wrong!',
      });
    }
  };

  const rowOnchangeHandler = (value: any, index: number, name: string) => {
    const data = [...shipmentDetails?.objRow];
    data[index][name] = value;
    setShipmentDetails((prevState: any) => ({
      ...prevState,
      objRow: data,
    }));
  };

  const totalPoAmount = shipmentDetails?.objRow
    ?.reduce((acc: number, item: any) => acc + item?.poquantity * item?.rate, 0)
    .toFixed(2);
  const totalAddedAmount = shipmentDetails?.objRow
    ?.reduce(
      (acc: number, item: any) => acc + item?.addedQuantity * item?.rate,
      0,
    )
    .toFixed(2);

  return (
    <ContainerNew
      // isScrollView={false}
      edges={edges}
      btnText="Save & Approve"
      singleFloatBtmBtnLoading={isLoading}
      singleFloatBtmBtnDisable={!shipmentDetails?.objRow?.length}
      isFloatBottomButton
      singleFloatBtmBtnPress={() => {
        handleSaveAndApprove();
      }}
      header={
        <CustomHeader
          title="Shipment Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <Column style={styles.appContainer}>
        {/* <Column colWidth={'100%'}> */}
        <Row align="center" justify="flex-start">
          <Column colWidth={'100%'}>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'PO Number:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.ponumber || 'N/A'}
                lineHight={20}
                txtSize={16}
                txtStyle={{marginLeft: 5}}
                txtWeight={'700'}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'LC Number:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.lcnumber || 'N/A'}
                lineHight={20}
                txtSize={16}
                txtStyle={{marginLeft: 5}}
                txtWeight={'700'}
              />
            </Column>

            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Ship By:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.shipByName || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Vassel Name:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.vasselName || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'BL/AWB/TR No:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.shipByNumber || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'BL/AWB/TR Date:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.shippingDate
                    ? date_formater(shipmentDetails?.objHeader?.shippingDate)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>

            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Currency:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.currencyName || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Invoice No:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.invoiceNumber || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Invoice Date:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.invoiceDate
                    ? date_formater(shipmentDetails?.objHeader?.invoiceDate)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Doc. Receive By Bank:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.docReceiveByBank
                    ? date_formater(
                        shipmentDetails?.objHeader?.docReceiveByBank,
                      )
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            {/* packing charge, freight charge, invoice amount, due date, cnf provider, eta date, ata date, number of container */}
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Packing Charge:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.packingCharge
                    ? shipmentDetails?.objHeader?.packingCharge.toFixed(2)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Freight Charge:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.freightCharge
                    ? shipmentDetails?.objHeader?.freightCharge.toFixed(2)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Invoice Amount:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.invoiceAmount
                    ? shipmentDetails?.objHeader?.invoiceAmount.toFixed(2)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Due Date:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.dueDate
                    ? date_formater(shipmentDetails?.objHeader?.dueDate)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'CNF Provider:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.cnFPartnerName || 'N/A'}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'ETA Date:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.etaDate
                    ? date_formater(shipmentDetails?.objHeader?.etaDate)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'ATA Date:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.ataDate
                    ? date_formater(shipmentDetails?.objHeader?.ataDate)
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Number of Container:'}
                txtSize={13}
                txtWeight={'500'}
                lineHight={20}
              />

              <CustomTextNew
                text={
                  shipmentDetails?.objHeader?.numberOfContainer
                    ? shipmentDetails?.objHeader?.numberOfContainer.toString()
                    : 'N/A'
                }
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Total PO Amount:'}
                txtSize={14}
                txtWeight={'600'}
                lineHight={20}
              />

              <CustomTextNew
                text={totalPoAmount}
                lineHight={20}
                txtSize={13}
                txtStyle={{marginLeft: 5}}
                txtWeight={'600'}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Tolerance Percentage:'}
                txtSize={14}
                txtWeight={'600'}
                lineHight={20}
              />

              <CustomTextNew
                text={shipmentDetails?.objHeader?.tolarance + ' %' || ''}
                lineHight={20}
                txtSize={14}
                txtStyle={{marginLeft: 5}}
                txtWeight={'600'}
              />
            </Column>
            <Column colWidth={'80%'} colStyle={{flexDirection: 'row'}}>
              <CustomTextNew
                text={'Total Added Amount:'}
                txtSize={14}
                txtWeight={'600'}
                lineHight={20}
              />

              <CustomTextNew
                text={totalAddedAmount}
                lineHight={20}
                txtSize={14}
                txtStyle={{marginLeft: 5}}
                txtWeight={'600'}
              />
            </Column>
          </Column>
        </Row>
        {shipmentDetails?.objRow?.length > 0 && (
          <LcShipmentViewTable
            data={shipmentDetails?.objRow || []}
            control={control}
            setValue={setValue}
            rowOnchangeHandler={rowOnchangeHandler}
          />
        )}
        {/* </Column> */}
      </Column>
    </ContainerNew>
  );
};

export default LcShipmentView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  appContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  status: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: COLORS.red,
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 10,
  },
  flatContainer: {paddingBottom: 100},
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  btnContainer: {
    width: '15%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    height: 45,
    width: 45,
    borderRadius: 45 / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipStyle: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
