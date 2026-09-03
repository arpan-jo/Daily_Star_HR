/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {commonURL, erpPeopleDeskURL} from '../../../../../App';
import {
  ExpenseLandingEngine,
  GetExpenseLandingPaginationApps,
  GetOrganizationalUnitUserPermission,
} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import SearchHeader from '../../../../common/components/SearchHeader';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {getImageURL} from '../../../../common/services/getImage';
import {SBUType} from '../../../../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import {useRootStore} from '../../../../stores/rootStore';
import {_todayDateTime} from '../../../../common/services/todayDate';

const edges: Edge[] = ['right', 'bottom', 'left'];

const ExpenseApprovalMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu, sbuSave} = useRootStore();

  const [isSearch, setIsSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedBuUnit, setSelectedBuUnit] = useState<SBUType[]>();
  const [expenseLandingData, setExpenseLandingData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRender, setIsRender] = useState(false);

  //get data
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsLoading(false);
      landingData();
    },
    [currentPage],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (!searchQuery) {
        sbuHandler();
        landingData();
      }
    },
    [isFocused, isRender],
  );

  useAsyncEffect(
    async (isMounted: () => any) => {
      if (!isMounted()) {
        return;
      }
    },
    [sbu?.businessUnitId],
  );

  const sbuHandler = async () => {
    setIsRender(false);
    const api_params = {
      url: GetOrganizationalUnitUserPermission,
      data: {ERPUserId: userInfo?.intErpUserId},
    };
    const res = await httpRequest(api_params, () => {});
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
  };
  const landingData = async () => {
    const payloadForLand = {
      applicationStatus: 'Pending',
      isAdmin: userInfo?.isOfficeAdmin,
      isSupOrLineManager: 0,
      approverId: userInfo?.intEmployeeId,
      departmentId: 0,
      designationId: 0,
      applicantId: 0,
      expenseTypeId: 0,
      intId: 0,
      expenseDate: _todayDateTime(),
      accountId: userInfo?.intAccountId,
      workplaceGroupId: userInfo?.intWorkplaceGroupId,
      workplaceId: userInfo?.intWorkplaceId,
      businessUnitId: userInfo?.intBusinessUnitId,
    };

    const api_paramsFomCommon = {
      url: ExpenseLandingEngine,
      data: payloadForLand,
      method: 'post',
    };
    const api_params = {
      url: GetExpenseLandingPaginationApps,
      data: {
        AccountId: userInfo?.intAccountId,
        BusinessUnitId: sbu?.businessUnitId,
        ExpenseForId: userInfo?.intEmployeeId,
        SbuId: sbu?.sbuId,
        CountryId: 18,
        CurrencyId: 141,
        IsActive: true,
        isBillSubmitted: true,
        isApproved: false,
        PageNo: currentPage,
        PageSize: 30,
        viewOrder: 'desc',
        IsSuppervisor: userInfo?.isSupNLMORManagement === 1 ? true : false,
      },
      baseURL: erpPeopleDeskURL,
    };

    const param =
      commonURL === userInfo?.strUrl ? api_paramsFomCommon : api_params;
    const res = await httpRequest(param, setIsLoading);
    const modData = res?.data?.filter((i: any) => {
      if (+i?.expenseForId !== userInfo?.intEmployeeId) {
        return {...i};
      }
    });

    const modifiedResponse = res?.listData?.map((item: any) => {
      return {
        expenseId: item?.intExpenseId,
        lastActionDateTime: item?.expenseApplication?.dteCreatedAt,
        totalAmount: item?.numExpenseAmount,
        // expenseCode: item?.
        fromDate: item?.dteExpenseFromDate,
        toDate: item?.dteExpenseToDate,
        expenseForImageId: item?.profileUrlId,
        expenseGroup: item?.strExpenseType,
        expenseBy: item?.employeeName,
        employeeDesignation: item?.designation,
        comments: item?.strDiscription,
      };
    });

    commonURL === userInfo?.strUrl
      ? setExpenseLandingData(modifiedResponse)
      : setExpenseLandingData((prev: any) =>
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
          // @ts-ignore
          navigation.navigate(
            //@ts-ignore
            'ExpenseApprovalDetails',
            {
              expenseId:
                userInfo?.strUrl === commonURL ? item : item?.expenseId,
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
                backgroundColor: getStatusBgColor('Pending'),
                alignItems: 'center',
                borderRadius: 50,
              }}>
              <CustomTextNew txtStyle={styles.stsTxt} text={'Pending'} />
            </Column>
          </Column>
        </Row>
        <Row justify="flex-start">
          <CustomTextNew
            txtStyle={styles.amountTitle}
            text={`BDT ${item?.totalAmount}`}
          />
        </Row>

        <Row rowWidth="100%" style={styles.rowWrap}>
          <CustomTextNew subTxt text={item?.expenseCode || ''} />
          {userInfo?.strUrl !== commonURL ? (
            <MIcon
              name="stop-circle"
              size={6}
              color={COLORS.textNewColor}
              style={styles.dotIcon}
            />
          ) : null}
          <CustomTextNew
            txtStyle={{
              width: '65%',
              lineHeight: 16,
            }}
            text={`${item?.fromDate ? date_formater(item?.fromDate) : ''} - ${
              item?.toDate ? date_formater(item?.toDate) : ''
            }`}
          />
        </Row>

        {item?.expenseForId !== userInfo?.intErpUserId && (
          <Row
            align="center"
            rowStyle={{
              marginTop: 6,
            }}>
            {item?.expenseForImageId ? (
              <FastImage
                source={{
                  uri: getImageURL(item?.expenseForImageId),
                }}
                style={styles.profileImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />
            )}

            <Column>
              <CustomTextNew text={item?.expenseBy} />
              <CustomTextNew
                txtStyle={{
                  fontSize: 12,
                  lineHeight: 14,
                  color: COLORS.graySubText,
                  fontStyle: 'italic',
                }}
                text={item?.expenseGroup || ''}
              />
            </Column>
          </Row>
        )}
      </Row>
    </View>
  );
  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isFloatBottomButton={false}
      // singleFloatBtmBtnPress={() =>
      //   navigation.navigate('CreateEditExpenseApplication')
      // }
      header={
        <>
          {!isSearch && (
            <CustomHeader
              setRerender={setIsRender}
              isSubtitleClickable={true}
              subTitleData={selectedBuUnit}
              title="Expense Approval"
              subtitle={sbu?.businessUnitName || ''}
              onBackPress={navigation.goBack}
              // alterIcon={'search'}
              // alterIconPress={() => {
              //   setIsSearch(!isSearch);
              //   LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
              // }}
            />
          )}
        </>
      }
      style={styles.container}>
      {isSearch && (
        <SearchHeader
          setIsSearch={setIsSearch}
          isSearch={isSearch}
          inputText={searchQuery}
          setInputText={setSearchQuery}
        />
      )}
      <View
        style={{
          marginTop: isSearch ? 95 : 0,
        }}>
        {/* heading tab */}

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

export default ExpenseApprovalMainIndex;

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
    paddingHorizontal: 4,
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
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
});
