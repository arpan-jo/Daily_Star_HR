import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {erpiBOSURL} from '../../../../../App';
import {GetPendingAdjustments} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const InvAdjustApprovalMainIndex = () => {
  const [landingData, setLandingData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      onSubmit();
    },
    [isFocused],
  );

  const onSubmit = async () => {
    const params = {
      url: GetPendingAdjustments,
      data: {
        intBusinessUnitId: sbu?.businessUnitId || userInfo?.intBusinessUnitId, //sbu?.businessUnitId || 0,
      },
      baseURL: erpiBOSURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(params, setIsLoading);
    setLandingData(res || []);
  };

  const renderItem = ({item}: any) => (
    <Row
      rowWidth="100%"
      isCard
      direction="column"
      justify="space-between"
      isPressOn={false}
      onCardPress={() => {
        navigation.navigate('InvAdjustApprovalDetails', {lanData: item});
      }}>
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
            <CustomTextNew
              text={`Profit Center: ${item?.strProfitCenterName || 'N/A'}`}
            />
          </Column>
        </Row>

        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Plant: ${item?.strPlantName ? item?.strPlantName : 'N/A'}`}
            />
          </Column>
        </Row>
        <Row direction="row">
          <Column colWidth={'100%'}>
            <CustomTextNew
              text={`Warehouse: ${item?.strWarehouseName || 'N/A'}`}
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
      header={
        <CustomHeader
          title="Inv Adjust Approval"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      {landingData?.length !== 0 ? (
        <CustomFlatList
          contentContainerStyle={styles.flatlistCont}
          data={landingData}
          RenderItems={renderItem}
          isLoading={isLoading}
        />
      ) : null}
    </ContainerNew>
  );
};

export default observer(InvAdjustApprovalMainIndex);
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
