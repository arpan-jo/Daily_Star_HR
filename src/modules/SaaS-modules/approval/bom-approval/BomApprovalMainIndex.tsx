import CheckBox from '@react-native-community/checkbox';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {erpPeopleDeskURL} from '../../../../../App';
import {BOMApproval, BOMApprovalLanding} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
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
import {getPlantDDL} from '../../../../services/arl-core-modules/procurement/purchaseRequest/purchaseRequestAPI';
import {useRootStore} from '../../../../stores/rootStore';
import {commonPRLanStyle as styles} from '../../../arl-core-modules/procurement/common/commonPRLanStyle';
import ProcurementCard from '../../../arl-core-modules/procurement/ProcurementLandingCard';
const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

const BomApprovalMainIndex = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [bomApprovalLanding, setBomApprovalLanding] = useState<any[]>();
  const [plantDataDDL, setPlantDataDDL] = useState<any[]>();
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {sbu, userInfo} = useRootStore();
  const {saveLogAction} = useAuditLogSave();
  const {control, setValue, watch} = useForm();
  const toaster = useToast();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const plantDDLData = await getPlantDDL(
        userInfo?.intErpUserId,
        sbu?.businessUnitId,
      );
      setPlantDataDDL(plantDDLData);
      getBomApprovalLandingList();
    },
    [isFocused],
  );
  // https://erp.peopledesk.io/mes/BOM/BOMApprovalLanding?
  // accountId=1&businessUnitId=4&plantId=79&userId=509697&viewOrder=desc&pageNo=0&pageSize=15

  const getBomApprovalLandingList = async () => {
    const api_params = {
      url: BOMApprovalLanding,
      data: {
        accountId: userInfo?.intAccountId,
        businessUnitId: sbu?.businessUnitId,
        userId: userInfo?.intErpUserId,
        viewOrder: 'desc',
        pageNo: 1,
        pageSize: 150,
        plantId: watch('plant')?.value || 0,
      },
      baseURL: erpPeopleDeskURL,
    };

    const res = await httpRequest(api_params, () => {});
    const modData = res?.data?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    setBomApprovalLanding(modData);
  };
  const isTrueSingleClick = bomApprovalLanding?.filter(
    item => item?.isActive === true,
  );

  const handleApprove = async () => {
    const payload = isTrueSingleClick?.map(item => {
      return {
        billOfMaterialId: item?.billOfMaterialId,
        actionBy: userInfo?.intErpUserId,
      };
    });
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
      allDeactive();
      getBomApprovalLandingList();
      setIsModalShow(false);
    } else {
      toaster.show({
        message: 'Something went wrong!',
        type: 'error',
      });
    }
  };

  const activeDeactiveHandler = (index: number) => {
    let modifyData = [...(bomApprovalLanding ?? [])];
    modifyData[index].isActive = !modifyData[index].isActive;
    setBomApprovalLanding(modifyData);
    const isTrueSingle = modifyData?.filter(item => item?.isActive === true);
    const isFalseSingle = modifyData?.filter(item => item?.isActive === false);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
    isFalseSingle?.length ? setIsSelectAll(false) : setIsSelectAll(true);
  };

  const AllActiveDeactiveHandler = () => {
    let modifyData = [...(bomApprovalLanding ?? [])];
    const modifyAllData = modifyData.map(item => {
      return {
        ...item,
        isActive: isSelectAll ? false : true,
      };
    });
    setBomApprovalLanding(modifyAllData);
    setIsSelectAll(!isSelectAll);
    const isTrueSingle = modifyAllData?.filter(item => item?.isActive === true);
    isTrueSingle?.length ? setIsShowHeader(false) : setIsShowHeader(true);
  };

  const allDeactive = async () => {
    const newArr = bomApprovalLanding?.map(item => {
      return {
        ...item,
        isActive: false,
      };
    });
    setBomApprovalLanding(newArr);
    setIsShowHeader(true);
    getBomApprovalLandingList();
  };

  const renderItem = ({item, index}: any) => (
    <ProcurementCard
      // createdDate={`Requested ${
      //   item?.transectionDate ? date_formater(item?.transectionDate) : ''
      // } | ${item?.requestBy}`}
      title={`${item?.billOfMaterialName}`}
      subtitle={`${item?.boMItemVersionName}      [ ${item?.uoMName} ]`}
      // code={`IR Code: ${item?.strCode}`}
      status={'Pending'}
      additionalInfo={
        <Row>
          <Column>
            <Row align="center" justify="flex-start">
              <CustomTextNew
                txtStyle={styles.cardText}
                text={`Lot Size ${item?.lotSize ? item?.lotSize : ''}`}
              />
            </Row>
          </Column>
        </Row>
      }
      // onPress={() => {
      //   //@ts-ignore
      //   navigation.navigate('ItemRequestApprovalDetails', {
      //     requestId: item?.transectionId,
      //     itemApprovalId: item?.approvalId,
      //     itemQuantity: item?.quantity,
      //     requestedBy: item?.requestBy,
      //     ...item,
      //   });
      // }}
      onLongPress={() => {
        activeDeactiveHandler(index);
      }}
      onPress={() => {
        if (isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0) {
          activeDeactiveHandler(index);
        } else {
          // navigation.navigate('ItemRequestApprovalDetails', {
          //   requestId: item?.transectionId,
          //   itemApprovalId: item?.approvalId,
          //   itemQuantity: item?.quantity,
          //   requestedBy: item?.requestBy,
          //   ...item,
          // });
        }
      }}
      style={{
        backgroundColor: item?.isActive ? COLORS.lightPrimary2 : COLORS.white,
      }}
    />
  );

  return (
    <ContainerNew
      edges={isShowHeader ? edges2 : Platform.OS === 'ios' ? edges2 : edges1}
      header={
        //   <CustomHeader
        //     title="Item Request Approve"
        //     onBackPress={navigation.goBack}
        //   />
        <>
          {isShowHeader && (
            <>
              <CustomHeader
                // alterIcon={'search'}
                // alterIconPress={() => {
                //   setIsSearch(!isSearch);
                //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
                // }}
                onBackPress={navigation.goBack}
                title="Bom Approval"
              />
            </>
          )}
        </>
      }
      style={styles.container}>
      <LoadingContainer isLoading={loading} />

      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View>
          <View style={styles.headMain}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isSelectAll}
                onValueChange={() => AllActiveDeactiveHandler()}
                style={styles.checkbox}
                tintColors={{true: 'white', false: 'white'}}
                tintColor={COLORS.white}
                onCheckColor={COLORS.white}
                onTintColor={COLORS.white}
              />
              <Text style={styles.label}>All</Text>
            </View>

            <View style={styles.flexRow}>
              <TouchableOpacity
                onPress={() => setIsModalShow(true)}
                style={[styles.approveOrReject, styles.marginLeft]}>
                <Text style={styles.rejectApproveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <Column colWidth={'90%'} colStyle={styles.sbu}>
        <CustomDropDownNew
          control={control}
          data={plantDataDDL}
          name="plant"
          label="Plant"
          placholder="Choose"
          onChange={async (options: any) => {
            //@ts-ignore
            setValue('plant', options);
            getBomApprovalLandingList();
          }}
        />
      </Column>
      <View>
        <CustomFlatList
          contentContainerStyle={{
            paddingBottom: 150,
          }}
          data={bomApprovalLanding}
          RenderItems={renderItem}
        />
      </View>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => handleApprove()}
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Item Request application?`}
      />
    </ContainerNew>
  );
};

export default BomApprovalMainIndex;
