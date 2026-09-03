import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';

import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../stores/rootStore';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';
import {COLORS} from '../../../../common/constant/Themes';

import CustomerApprovalMainIndex from './CustomerApprovalMainIndex';
import Column from '../../../../common/components/Column';
import StatusTabSelector, {
  TabOption} from '../../../../common/components/StatusTabSelector';
import {PartnerRegistrationApproval} from '../../../../common/api/api';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {erpiBOSURL} from '../../../../../App';
const edges: Edge[] = ['right', 'bottom', 'left'];

const topBarItem = [
  {
    title: 'Customer',
    isActive: true,
    nameForApi: 'customer',
  },
  {
    title: 'Supplier',
    isActive: false,
    nameForApi: 'supplier',
  },
];
const tabs: TabOption[] = [
  {label: 'Approved', value: 0},
  {label: 'Unapproved', value: 1},
  {label: 'Reject', value: 2},
];
const PartnerApprovalMainIndex = () => {
  const [landingData, setLandingData] = useState<any[]>([]);
  const [_isLoading, setIsLoading] = useState(false);
  const [topBar, setTopBar] = useState(topBarItem);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();
  const [selectedTab, setSelectedTab] = useState<TabOption>(tabs[0]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLandingAPI();
    },
    [isFocused, selectedTab, topBar],
  );

  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
  };
  // https://erp.ibos.io/partner/BusinessPartnerBasicInfo/PartnerRegistration?
  // partName=LandingForApproval&pageNo=0&pageSize=15&businessUnitId=4&isApproved=true
  // &partnerType=supplier&autoId=0

  const getLandingAPI = async () => {
    const params = {
      url: PartnerRegistrationApproval,
      data: {
        partName: 'LandingForApproval',
        businessUnitId: sbu?.businessUnitId || userInfo?.intBusinessUnitId, //sbu?.businessUnitId || 0,
        isApproved:
          selectedTab?.value === 0
            ? true
            : selectedTab?.value === 1
              ? false
              : null,
        partnerType:
          topBar?.find(itm => itm?.isActive)?.nameForApi || 'customer',
        pageNo: 0,
        pageSize: 500,
        isReject: selectedTab?.value === 2 ? true : false,
      },
      baseURL: erpiBOSURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(params, setIsLoading);
    setLandingData(res);
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          title="Partner Approval"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <Row style={styles.head}>
        {topBar?.map((item, index) => (
          <TopBarItem
            item={item}
            index={index}
            onPress={handleTopBar}
            key={index?.toString()}
          />
        ))}
      </Row>
      <Column style={styles.appContainer}>
        <StatusTabSelector
          data={tabs}
          selected={selectedTab.value}
          onChange={data => {
            setSelectedTab(data);
            //   setCurrentPage(1);
          }}
        />
      </Column>
      {
        topBar[0]?.isActive ? (
          <CustomerApprovalMainIndex listData={landingData} />
        ) : null
        //   <OutgoingVisitMainIndex />
      }
    </ContainerNew>
  );
};

export default observer(PartnerApprovalMainIndex);
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
  appContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
