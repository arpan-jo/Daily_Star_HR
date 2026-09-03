import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {erpPeopleDeskURL} from '../../../../../App';
import {
  AdvanceExpenseLandingForApps,
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
import {dateFormater} from '../../../../common/services/todayDate';
import {SBUType} from '../../../../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const AdvanceExpenseApprovalMainIndex = () => {
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
    const api_params = {
      url: AdvanceExpenseLandingForApps,
      data: {
        businessUnitId: sbu?.businessUnitId,
        employeeId: userInfo?.intEmployeeId,
        isApproved: false,
        PageNo: currentPage,
        PageSize: 30,
        // businessUnitId=4&employeeId=509689&isApproved=false&pageNo=1&pageSize=100
      },
      baseURL: erpPeopleDeskURL,
    };

    const param = api_params;
    const res = await httpRequest(param, setIsLoading);
    setExpenseLandingData((prev: any) =>
      currentPage === 1 ? res?.data : [...prev, ...res?.data],
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
            'AdvanceExpenseApprovalDetails',
            {
              advanceLanData: item,
            },
          );
        }}>
        <Row justify="space-between">
          <Column colWidth="82%">
            <CustomTextNew
              subTxt
              text={`Created ${
                item?.requestDate ? date_formater(item?.requestDate) : ''
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
            text={`BDT ${item?.requestedAmmount}`}
          />
        </Row>

        <Row rowWidth="100%" style={styles.rowWrap}>
          <CustomTextNew subTxt text={item?.advanceCode || ''} />
          <MIcon
            name="stop-circle"
            size={6}
            color={COLORS.textNewColor}
            style={styles.dotIcon}
          />
          <CustomTextNew
            txtStyle={{
              width: '65%',
              lineHeight: 16,
            }}
            text={`Due Date: ${item?.dueDate ? dateFormater(item?.dueDate) : ''}`}
          />
        </Row>

        <Row
          align="center"
          rowStyle={{
            marginTop: 6,
          }}>
          <FastImage source={IMAGES.NoImage} style={styles.profileImage} />

          <Column>
            <CustomTextNew text={item?.employeeName} />
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
              title="Advance Expense Approval"
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

export default AdvanceExpenseApprovalMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  amountTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 4,
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
