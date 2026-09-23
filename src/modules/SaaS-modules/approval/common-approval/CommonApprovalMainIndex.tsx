import CheckBox from '@react-native-community/checkbox';
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { commonURL } from '../../../../../App';
import { GetAllPendingApplicationsForApproval } from '../../../../common/api/api';
import { commonApprovalMainIndexStyle as styles } from '../../../../common/commonStyle/commonApprovalMainIndexStyle';
import Column from '../../../../common/components/Column';
import CommonApprovalMainIndexCard from '../../../../common/components/CommonApprovalMainIndexCard';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import { useToast } from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
import TopBarItem from '../../../../common/components/TabBaritem';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { date_formater } from '../../../../common/services/dateFormater';
import { handleSelectionChange } from '../../../../hooks/useApprovalSelectionV2';
import { handleApprovalAction } from '../../../../hooks/useCommonApprovalV2';
import { useRootStore } from '../../../../stores/rootStore';
import {
  getApprovalHeaderTitle,
  getApprovalInfoRows,
} from './commonApprovalFields';

const topBarItem = [
  {
    title: 'Common Approval',
    isActive: true,
    nameForApi: 'commonApproval',
    isForAll: true,
  },
  {
    title: 'Admin Approval',
    isActive: false,
    nameForApi: 'adminApproval',
    isForAll: false,
  },
];

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];
const pageSize = 25;

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Landing screen for any approval type that has no dedicated screen yet
// (Increment Proposal 5, Separation 21, Asset Requisition 32, Document
// Requisition 40...). The v2 approval API is the same for every type, so only
// the title and the card fields differ - both come from the tapped menu item.
const CommonApprovalMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [approvalData, setApprovalData] = useState<any>();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toaster = useToast();

  const commonLanData = route?.params as any;
  const approvalTitle =
    commonLanData?.applicationType || commonLanData?.menuName || 'Approval';
  const headerTitle = getApprovalHeaderTitle(approvalTitle);
  // Opens on the tab the dashboard was on, then follows this screen's own tabs.
  const initialTabName = commonLanData?.activeTabName || 'commonApproval';
  const [topBar, setTopBar] = useState(() =>
    topBarItem.map(item => ({
      ...item,
      isActive: item?.nameForApi === initialTabName,
    })),
  );
  const [activeTabName, setActiveTabName] = useState(initialTabName);

  useEffect(() => {
    if (!userInfo) {
      return;
    }
    setTopBar(prev =>
      prev.map(item => ({
        ...item,
        isForAll:
          item?.nameForApi === 'adminApproval'
            ? !!userInfo?.isOfficeAdmin
            : true,
      })),
    );
  }, [userInfo]);

  const handleTopBar = (ind: any) => {
    setTopBar(prev =>
      prev.map((item, index) => ({ ...item, isActive: ind === index })),
    );
    setActiveTabName(topBar[ind]?.nameForApi);
    setIsShowHeader(true);
  };

  const payloadForLand = {
    workplaceGroupId:
      userInfo?.intWorkplaceGroupId || userInfo?.originalWorkplaceGroupId,
    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
    accountId: userInfo?.intAccountId,
    applicationTypeId: commonLanData?.applicationTypeId,
    employeeId: userInfo?.intEmployeeId,
    isAdmin: activeTabName === 'adminApproval' ? true : false,
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      loadFirstPage();
    },
    [isFocused, activeTabName],
  );

  // Next page, requested by the list when it scrolls to the end.
  useAsyncEffect(
    async isMounted => {
      if (!isMounted() || currentPage === 1) {
        return null;
      }
      getLandingDataApi(currentPage);
    },
    [currentPage],
  );

  const getLandingDataApi = async (pageNo = 1) => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : '',
      data: { ...payloadForLand, pageNo, pageSize },
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',
    };
    const resData = await httpRequest(api_params, setIsLoading);
    const data = resData?.listData ?? resData;
    const list = Array.isArray(data) ? data : [];
    const modifiedData = list.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    // The API sends no total count - a short page means it was the last one.
    setHasMore(list.length === pageSize);
    if (pageNo === 1) {
      setApprovalData(modifiedData);
    } else {
      setApprovalData((prev: any) => [...(prev || []), ...modifiedData]);
      modifiedData.length > 0 && setIsSelectAll(false);
    }
  };

  const loadFirstPage = () => {
    setCurrentPage(1);
    getLandingDataApi(1);
  };

  const handleLoadMore = (next: (prev: number) => number) => {
    if (!isLoading && hasMore) {
      setCurrentPage(next);
    }
  };

  const isTrueSingleClick = approvalData?.filter(
    (item: any) => item?.isActive === true,
  );

  const allDeactive = async () => {
    const newArr = approvalData?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    setApprovalData(newArr);
    setIsShowHeader(true);
    loadFirstPage(); // need for v2 approval
  };

  const handleToggleItem = ({ index, mode }: any) => {
    !isSearch && setIsSearch(true);
    const {
      updatedData,
      isShowHeader: showHeader,
      isSelectAllState,
    } = handleSelectionChange({
      data: approvalData,
      mode: mode,
      index,
      isSelectAll,
    });
    setApprovalData(updatedData);
    setIsShowHeader(showHeader);
    if (mode === 'single') {
      setIsSelectAll(isSelectAllState);
    }
    if (mode === 'all') {
      setIsSelectAll(!isSelectAll);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const infoRows = getApprovalInfoRows(item?.applicationInformation);
    return (
      <Column key={index?.toString()}>
        <TouchableOpacity
          onLongPress={() => handleToggleItem({ index: index, mode: 'single' })}
          onPress={() => {
            if (isTrueSingleClick?.length > 0) {
              handleToggleItem({ index: index, mode: 'single' });
            } else {
              navigation.navigate('CommonApprovalDetails', {
                commonApprovalDetails: item,
                approvalTitle: approvalTitle,
                activeTabName: activeTabName,
              });
            }
          }}
          style={[
            styles?.card,
            {
              backgroundColor: item?.isActive
                ? COLORS.lightPrimary2
                : COLORS.white,
            },
          ]}
        >
          <CommonApprovalMainIndexCard
            item={item}
            index={index}
            isTrueSingleClick={isTrueSingleClick}
            employeeName={item?.applicationInformation?.employeeName || ''}
            amount={
              infoRows[0] ? `${infoRows[0].label}: ${infoRows[0].value}` : ''
            }
            effectiveDate={
              infoRows[1] ? `${infoRows[1].label}: ${infoRows[1].value}` : ''
            }
            applicationDate={`Application Date: ${
              item?.applicationInformation?.applicationDate
                ? date_formater(item?.applicationInformation?.applicationDate)
                : ''
            }`}
          />
        </TouchableOpacity>
      </Column>
    );
  };

  return (
    <ContainerNew
      edges={isShowHeader ? edges2 : Platform.OS === 'ios' ? edges2 : edges1}
      isScrollView={false}
      header={
        <CustomHeader title={headerTitle} onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      {userInfo?.strUrl === commonURL && (
        <Row style={tabStyles.toptabstyle}>
          {topBar?.map(
            (item, index) =>
              // if isForAll is true then show the tab
              item?.isForAll && (
                <TopBarItem
                  item={item}
                  index={index}
                  onPress={handleTopBar}
                  key={index?.toString()}
                />
              ),
          )}
        </Row>
      )}
      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View>
          <View style={styles.headMain}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isSelectAll}
                onValueChange={() => handleToggleItem({ mode: 'all' })}
                style={styles.checkbox}
                tintColors={{ true: 'white', false: 'white' }}
                tintColor={COLORS.white}
                onCheckColor={COLORS.white}
                onTintColor={COLORS.white}
              />
              <Text style={styles.label}>All</Text>
            </View>

            <View style={styles.flexRow}>
              <TouchableOpacity
                onPress={() => setIsModalShow2(true)}
                style={styles.approveOrReject}
              >
                <Text style={styles.rejectApproveText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsModalShow(true)}
                style={[styles.approveOrReject, styles.marginLeft]}
              >
                <Text style={styles.rejectApproveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.paddingHorizontl}>
        <CustomFlatList
          contentContainerStyle={listStyles.listContent}
          data={approvalData}
          RenderItems={renderItem}
          isLoading={isLoading}
          currentPage={currentPage}
          setCurrentPage={handleLoadMore}
        />
      </View>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() =>
          handleApprovalAction({
            isTrueSingleClick,
            userInfo,
            actionType: 'approve',
            method: 'post',
            toaster,
            allDeactive,
            applicationTypeId: commonLanData?.applicationTypeId,
            isMultipleApprove: true,
          })
        }
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending ${approvalTitle} application?`}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() =>
          handleApprovalAction({
            isTrueSingleClick,
            userInfo,
            actionType: 'reject',
            method: 'post',
            toaster,
            allDeactive,
            applicationTypeId: commonLanData?.applicationTypeId,
            isMultipleApprove: true,
          })
        }
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending ${approvalTitle} application?`}
      />
    </ContainerNew>
  );
};

export default observer(CommonApprovalMainIndex);

const listStyles = StyleSheet.create({
  listContent: {
    paddingBottom: 150,
  },
});

const tabStyles = StyleSheet.create({
  toptabstyle: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35,
    alignContent: 'center',
    paddingHorizontal: 14,
  },
});
