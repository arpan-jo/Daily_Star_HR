/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  GetExpenseLandingPaginationApps,
  GetOrganizationalUnitUserPermission,
} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import NoData from '../../../../common/components/NoData';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {SBUType} from '../../../../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const topBarItem = [
  {
    title: 'Draft',
    isActive: true,
    nameForApi: 'Draft',
  },
  {
    title: 'Pending',
    isActive: false,
    nameForApi: 'Pending',
  },
  {
    title: 'Approved',
    isActive: false,
    nameForApi: 'Approved',
  },
];

const ExpenseApplicationMainIndex = () => {
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
      url: GetExpenseLandingPaginationApps,
      data: {
        AccountId: userInfo?.intAccountId,
        BusinessUnitId:
          sbu?.businessUnitId || mySbu?.[0]?.organizationUnitReffId,
        ExpenseForId: userInfo?.intEmployeeId,
        SbuId: sbu?.sbuId || mySbu?.[0]?.sbuId,
        CountryId: 18,
        CurrencyId: 141,
        IsActive: true,
        isBillSubmitted: topTabName === 0 ? false : true,
        isApproved: topTabName === 2 ? true : false,
        PageNo: currentPage,
        PageSize: 30,
        viewOrder: 'desc',
        IsSuppervisor: userInfo?.isSupNLMORManagement ? true : false,
      },
      baseURL: erpPeopleDeskURL,
    };
    const ress = await httpRequest(api_params, setIsLoading);
    const modData = ress?.data?.filter((i: any) => {
      if (+i?.expenseForId === userInfo?.intEmployeeId) {
        return {...i};
      }
    });

    setExpenseLandingData((prev: any) =>
      currentPage === 1 ? modData : [...prev, ...modData],
    );
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return COLORS.yellow;
      case 'Draft':
        return COLORS.graySubText;
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
        isPressOn={false}
        direction="column"
        justify="space-between"
        onCardPress={() => {
          navigation.navigate(
            activeBar?.[0]?.title === 'Draft'
              ? 'CreateEditExpenseApplication'
              : 'ExpenseDetails',
            {
              expenseId: item?.expenseId,
            },
          );
        }}>
        <Row justify="space-between">
          <Column colWidth="82%">
            <CustomTextNew
              subTxt
              text={`Created ${
                item?.lastActionDateTime
                  ? date_formater(item?.lastActionDateTime)
                  : ''
              }`}
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
        {/* <Row justify="flex-start">
          <CustomTextNew
            txtStyle={styles.amountTitle}
            text={`BDT ${item?.totalAmount}`}
          />
        </Row>
        // billCode */}
        <Row style={styles.boxContent}>
          <CustomTextNew
            txtStyle={styles.amountTitle}
            text={`BDT ${item?.totalAmount}`}
          />
          {item?.billCode ? (
            <>
              <MIcon
                name="stop-circle"
                size={6}
                color={COLORS.textNewColor}
                style={styles.dotIcon}
              />
              <CustomTextNew
                txtSize={13}
                lineHight={20}
                text={`${item?.billCode ? item?.billCode : ''}`}
              />
            </>
          ) : null}
        </Row>

        <Row style={styles.boxContent}>
          <CustomTextNew
            text={`${item?.expenseCode} `}
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
            text={`${item?.fromDate ? date_formater(item?.fromDate) : ''} - ${
              item?.toDate ? date_formater(item?.toDate) : ''
            }`}
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
      singleFloatBtmBtnPress={() =>
        navigation.navigate('CreateEditExpenseApplication')
      }
      header={
        <>
          <CustomHeader
            setRerender={setIsRender}
            isSubtitleClickable={true}
            subTitleData={selectedBuUnit}
            title="Expense"
            subtitle={sbu?.businessUnitName || ''}
            onBackPress={navigation.goBack}
            alterIcon={'info-outline'}
            alterIconPress={() => {
              Linking.openURL(
                'https://drive.google.com/file/d/1WNjJxwpSD8j-wvFkvLv7vn2CCqcv-pSM/view',
              );
            }}
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

export default ExpenseApplicationMainIndex;

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
