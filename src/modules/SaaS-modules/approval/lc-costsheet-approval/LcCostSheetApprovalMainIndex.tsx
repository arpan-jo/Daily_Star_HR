import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  BOMApproval,
  GetInfoFromPoLcDDLApprove,
  GetPONOLcNoforLCSummeryDDL,
  ImportCostSheetReport} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';
import {useRootStore} from '../../../../stores/rootStore';
import {commonPRLanStyle as styles} from '../../../arl-core-modules/procurement/common/commonPRLanStyle';
import LandingCostTable from './LcCostSheetTable';
import CustomTextNew from '../../../../common/components/CustomText';
import {Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
const edges: Edge[] = ['right', 'bottom', 'left'];

const LcCostSheetApprovalMainIndex = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [lcCostSheetReport, setLcCostSheetReport] = useState<any[]>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [poLcNoDDL, setPoLcNoDDL] = useState<any[]>([]);
  const [shipmentDDL, setShipmentDDL] = useState<any[]>([]);
  const _isFocused = useIsFocused();
  const navigation = useNavigation();
  const {sbu, userInfo} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const {control, setValue, watch} = useForm();
  const toaster = useToast();

  const getPoLcNoForLcSummary = async (searchTerm: string) => {
    const api_params = {
      url: GetPONOLcNoforLCSummeryDDL,
      data: {
        accountId: userInfo?.intAccountId,
        businessUnitId: sbu?.businessUnitId,
        searchTerm: searchTerm,
      },
      baseURL: erpPeopleDeskURL,
    };

    const res = await httpRequest(api_params, () => {});

    setPoLcNoDDL(res);
  };

  const getShipmentDDL = async (poLcNo: string) => {
    // getShipmentforLCSummeryDDL
    const api_params = {
      url: GetInfoFromPoLcDDLApprove,
      data: {
        accId: userInfo?.intAccountId,
        buId: sbu?.businessUnitId,
        searchTerm: poLcNo,
      },
      baseURL: erpPeopleDeskURL,
    };

    const res = await httpRequest(api_params, () => {});

    setShipmentDDL(res);
  };

  const getImportCostSheetReport = async () => {
    const api_params = {
      url: ImportCostSheetReport,
      data: {
        lcId: watch('PoLcNo')?.lcId || 0,
        poId: watch('PoLcNo')?.value || 0,
        shipmentId: watch('shipment')?.value || 0,
        typeId: 2,
      },
      baseURL: erpPeopleDeskURL,
    };

    const res = await httpRequest(api_params, () => {});

    setLcCostSheetReport(res);
  };

  const handleApprove = async () => {
    const payload = {
      LCId: watch('PoLcNo')?.lcId || 0,
    };

    const api_Params = {
      url: BOMApproval,
      data: payload,
      method: 'POST',
      baseURL: erpPeopleDeskURL,
    };
    // https://erp.peopledesk.io/mes/BOM/BOMApproval

    const res = await httpRequest(api_Params, setLoading);

    if (res?.statusCode === 200 || res?.statuscode === 200) {
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
      setIsModalShow(false);
    } else {
      toaster.show({
        message: 'Something went wrong!',
        type: 'error',
      });
    }
  };
  // https://erp.peopledesk.io/imp/Shipment/GetShipmentById?shipmentId=10807

  return (
    <ContainerNew
      edges={edges}
      singleFloatBtmBtnStyle={{
        width: '92%',
      }}
      btnText="Approve"
      // singleFloatBtmBtnLoading={isLoading}
      singleFloatBtmBtnDisable={
        !(lcCostSheetReport?.length! > 0 && watch('shipment'))
      }
      isFloatBottomButton
      singleFloatBtmBtnPress={() =>
        navigation.navigate('LcShipmentView', {shipment: watch('shipment')})
      }
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="LC Cost Sheet Approval"
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={loading} />
      <Row direction="col" rowStyle={styles.sbu}>
        <Column colWidth="100%">
          <CustomDropDownNew
            control={control}
            setSearchText={async (text: string) => {
              if (text?.length >= 3) {
                getPoLcNoForLcSummary(text);
              } else {
                getPoLcNoForLcSummary('');
              }
            }}
            data={poLcNoDDL}
            name="PoLcNo"
            label="PO/LC No"
            placholder="Choose"
            rules={{required: true}}
            onChange={async (options: any) => {
              //@ts-ignore
              setValue('PoLcNo', options);
              getShipmentDDL(options?.label);
              setValue('shipment', '');
              setLcCostSheetReport([]);
            }}
          />
        </Column>

        <Column colWidth="100%" colStyle={{marginTop: 10}}>
          <CustomDropDownNew
            control={control}
            data={shipmentDDL}
            name="shipment"
            label="Shipment"
            placholder="Choose"
            rules={{required: true}}
            onChange={(options: any) => {
              setValue('shipment', options);
              setLcCostSheetReport([]);
            }}
          />
        </Column>

        <Column colWidth={'90%'}>
          <CustomButtonNew
            btnText="View"
            btnstyle={{marginTop: 16}}
            onBtnPress={() => {
              getImportCostSheetReport();
            }}
          />
        </Column>
      </Row>
      {/* Header Section */}
      {
        <View style={styles.headerContainer}>
          <Row>
            <Column colWidth="100%">
              <CustomTextNew
                text={`${watch('shipment')?.label || ''} Cost Information`}
                txtWeight="700"
                txtSize={16}
                txtAlign="center"
                lineHight={24}
              />
            </Column>
          </Row>
          <Row rowStyle={{marginTop: 8}}>
            {/* need same row this column i need PO NO: left and then {watch('PoLcNo')?.poNumber || ''}  */}
            <Column colWidth="50%" colStyle={{flexDirection: 'row'}}>
              <Text>PO NO: </Text>
              <TouchableOpacity style={{flex: 1}}>
                <Text style={{color: COLORS.primary}}>
                  {watch('PoLcNo')?.poNumber || ''}
                </Text>
              </TouchableOpacity>
            </Column>
            <Column colWidth="50%">
              <CustomTextNew
                text={`LC No: ${watch('PoLcNo')?.lcNumber || ''}`}
                txtSize={13}
              />
            </Column>
          </Row>
          <Row rowStyle={{marginTop: 4}}>
            <Column colWidth="50%">
              <CustomTextNew
                text={`LC Date: ${watch('PoLcNo')?.lcDate ? date_formater(watch('PoLcNo')?.lcDate) : ''}`}
                txtSize={13}
              />
            </Column>
            <Column colWidth="50%">
              <CustomTextNew
                text={`Total Value: ${watch('shipment')?.shipmentWiseAmount ? watch('shipment')?.shipmentWiseAmount?.toFixed(2) + ' USD' : ''}`}
                txtSize={13}
              />
            </Column>
          </Row>
          <Row style={{marginTop: 4}}>
            <Column colWidth="100%">
              <CustomTextNew
                text={`Supplier: ${watch('PoLcNo')?.supplier || ''}`}
                txtSize={13}
              />
            </Column>
          </Row>
        </View>
      }
      <View>
        {lcCostSheetReport && lcCostSheetReport?.length > 0 && (
          <LandingCostTable data={lcCostSheetReport} />
        )}
      </View>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => handleApprove()}
        modalText={`Are you sure to approve LC Cost Sheet?`}
      />
    </ContainerNew>
  );
};

export default LcCostSheetApprovalMainIndex;
