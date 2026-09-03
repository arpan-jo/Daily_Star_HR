/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import { StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../App';
import {
  GetOrganizationalUnitUserPermission,
  GetAdvanceExpenseLandingPasignation} from '../../../common/api/api';
import Column from '../../../common/components/Column';
import ContainerNew from '../../../common/components/Container';
import CustomFlatList from '../../../common/components/CustomFlatList';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomTextNew from '../../../common/components/CustomText';
import NoData from '../../../common/components/NoData';
import Row from '../../../common/components/Row';
import {httpRequest} from '../../../common/constant/httpRequest';
import {COLORS} from '../../../common/constant/Themes';
import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../common/services/dateFormater';
import {SBUType} from '../../../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import {useRootStore} from '../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const topBarItem = [
  {
    title: 'Pending',
    isActive: true,
    nameForApi: 'Pending',
  },
  {
    title: 'Approved',
    isActive: false,
    nameForApi: 'Approved',
  },
];

const AdvanceExpenseMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu, sbuSave} = useRootStore();
  const [topTabName, setTopTabName] = useState(0);
  const [topBar, setTopBar] = useState(topBarItem);
  const [selectedBuUnit, setSelectedBuUnit] = useState<SBUType[]>();
  const [expenseLandingData, setExpenseLandingData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);

  const activeBar = topBar?.filter((item: any) => item?.isActive === true);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsRender(false);
      setIsLoading(false);
      landingData();
    },
    [isFocused, currentPage, topBar, isRender],
  );

  useAsyncEffect(
    async (isMounted: () => any) => {
      if (!isMounted()) {
        return;
      }
    },
    [sbu?.businessUnitId],
  );

  const handleTopBar = (ind: any) => {
    setExpenseLandingData([]);
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
    setTopTabName(ind);
  };

  const landingData = async () => {
    const api_param = {
      url: GetOrganizationalUnitUserPermission,
      data: {ERPUserId: userInfo?.intErpUserId},
    };
    const res = await httpRequest(api_param, () => {});
    const mySbu = res?.filter(
      (item: any) =>
        item?.organizationUnitReffId === userInfo?.intBusinessUnitId,
    );
    if (!sbu?.businessUnitId && userInfo?.intBusinessUnitId) {
      sbuSave({
        businessUnitId: mySbu?.[0]?.organizationUnitReffId,
        businessUnitName: mySbu?.[0]?.organizationUnitReffName,
        sbuId: mySbu?.[0]?.sbuId,
      });
    }
    const modifiedData = res?.map((item: SBUType) => {
      return {
        value: item?.organizationUnitReffId,
        label: item?.organizationUnitReffName,
        sbuId: item?.sbuId,
      };
    });
    setSelectedBuUnit(modifiedData);

    const api_params = {
      url: GetAdvanceExpenseLandingPasignation,
      data: {
        AccountId: userInfo?.intAccountId,
        BusinessUnitId:
          sbu?.businessUnitId || mySbu?.[0]?.organizationUnitReffId,
        SBUId: sbu?.sbuId || mySbu?.[0]?.sbuId,
        CurrencyId: 141,
        EmployeeId: userInfo?.intEmployeeId,
        isApproved: topTabName === 1 ? true : false,
        PageNo: currentPage,
        PageSize: 30,
        viewOrder: 'desc',
      },
      baseURL: erpPeopleDeskURL,
    };
    const ress = await httpRequest(api_params, setIsLoading);
    setExpenseLandingData((prev: any) =>
      currentPage === 1 ? ress?.data : [...prev, ...res?.data],
    );
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return COLORS.yellow;

      case 'Approved':
        return COLORS.primary;
      default:
        return COLORS.primary;
    }
  };

  const renderItem = ({item}: any) => (
    <View
      style={{
        marginHorizontal: 16,
      }}>
      <Row
        rowWidth="100%"
        isCard
        isPressOn={true}
        direction="column"
        justify="space-between">
        <Row justify="space-between">
          <Column colWidth="82%">
            <CustomTextNew
              txtSize={14}
              txtWeight={'500'}
              text={`Code ${item?.advanceCode || 'N/A'}`}
            />
          </Column>
          <Column colWidth="18%">
            <Column
              colWidth={60}
              colStyle={{
                backgroundColor: getStatusBgColor(activeBar?.[0]?.title),
                alignItems: 'center',
                borderRadius: 50,
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}>
              <CustomTextNew
                txtStyle={styles.stsTxt}
                text={activeBar?.[0]?.title}
              />
            </Column>
          </Column>
        </Row>
        <Row justify="flex-start">
          <CustomTextNew
            txtSize={13}
            text={`Req. Date: ${date_formater(item?.requestDate)}`}
          />
        </Row>
        <Row justify="flex-start">
          <CustomTextNew text={`Bill Code: ${item?.billCode || 'N/A'}`} />
        </Row>
        <Row style={styles.boxContent}>
          <CustomTextNew
            text={`Payment Type: ${item?.instrumentName || 'N/A'}`}
            txtSize={13}
            lineHight={20}
            txtColor={COLORS.graySubText}
          />
          <MIcon
            name="stop-circle"
            size={6}
            color={COLORS.textNewColor}
            style={styles.dotIcon}
          />
          <CustomTextNew
            txtSize={13}
            lineHight={20}
            text={`Currency Name: ${item?.currencyName || 'N/A'}`}
            txtColor={COLORS.graySubText}
          />
        </Row>
        <Row style={styles.boxContent}>
          <CustomTextNew
            text={`Request: ${item?.requestedAmmount || 0}`}
            txtSize={13}
            lineHight={20}
            txtColor={COLORS.graySubText}
          />
          <MIcon
            name="stop-circle"
            size={6}
            color={COLORS.textNewColor}
            style={styles.dotIcon}
          />
          <CustomTextNew
            txtSize={13}
            lineHight={20}
            text={`Approved: ${item?.approvedAmount || 0}`}
            txtColor={COLORS.graySubText}
          />
        </Row>
      </Row>
    </View>
  );
  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnPress={() => navigation.navigate('AdvanceExpenseCreate')}
      header={
        <>
          <CustomHeader
            setRerender={setIsRender}
            isSubtitleClickable={true}
            subTitleData={selectedBuUnit}
            title="Advance Expense"
            subtitle={sbu?.businessUnitName || ''}
            onBackPress={navigation.goBack}
          />
        </>
      }
      style={styles.container}>
      <View
        style={{
          marginTop: 0,
        }}>
        {/* heading tab */}
        <Column style={styles.head}>
          {topBar?.map((item: any, index: number) => (
            <Column
              key={index}
              style={[
                styles.box,
                {
                  backgroundColor: item?.isActive
                    ? COLORS.lightPrimary2
                    : COLORS.white,
                  borderColor: item?.isActive
                    ? COLORS.primary
                    : COLORS.textNewColor,
                },
              ]}
              isPressOn={false}
              onCardPress={() => handleTopBar(index)}>
              <CustomTextNew txtStyle={styles.headText} text={item?.title} />
            </Column>
          ))}
        </Column>
        <NoData data={expenseLandingData?.length} />
        <View>
          <CustomFlatList
            contentContainerStyle={{
              paddingBottom: 250,
            }}
            data={expenseLandingData}
            RenderItems={renderItem}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            isLoading={isLoading}
          />
        </View>
      </View>
    </ContainerNew>
  );
};

export default AdvanceExpenseMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  // heading tab
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 16,
  },
  box: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    marginRight: 8,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.textNewColor,
  },
  // tab body
  padding: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  amountTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 4,
  },
  cardSubTitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  cardText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.graySubText,
    paddingVertical: 2,
  },
  iconStyle: {
    paddingRight: 4,
  },
  dotIcon: {
    // paddingHorizontal: 4,
    marginHorizontal: 3,
  },
  status: {
    borderRadius: 50,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 1,
  },
  stsTxt: {
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
    color: COLORS.white,
  },
  emptyCol: {
    height: 200,
  },
  profileImage: {
    width: 24,
    height: 24,
    borderRadius: 100,
    backgroundColor: COLORS.iconGrayBackground,
    marginRight: 8,
  },
  boxContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
});
