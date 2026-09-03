import CheckBox from '@react-native-community/checkbox';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {Platform, Text, TouchableOpacity, UIManager, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {commonURL} from '../../../../../App';
import {GetAllPendingApplicationsForApproval} from '../../../../common/api/api';
import {commonApprovalMainIndexStyle as styles} from '../../../../common/commonStyle/commonApprovalMainIndexStyle';
import Column from '../../../../common/components/Column';
import CommonApprovalMainIndexCard from '../../../../common/components/CommonApprovalMainIndexCard';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {handleSelectionChange} from '../../../../hooks/useApprovalSelectionV2';
import {handleApprovalAction} from '../../../../hooks/useCommonApprovalV2';
import {useRootStore} from '../../../../stores/rootStore';

const edges1: Edge[] = ['right', 'bottom', 'left', 'top'];
const edges2: Edge[] = ['right', 'bottom', 'left'];

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const IncrementApprovalMainIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const [incrementData, setIncrementData] = useState<any>();
  const [isSearch, setIsSearch] = useState(true);
  const [isShowHeader, setIsShowHeader] = useState(true);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const toaster = useToast();

  const incrementLanData = route?.params as any;

  const payloadForLand = {
    workplaceGroupId: userInfo?.intWorkplaceGroupId,
    workplaceId: userInfo?.intWorkplaceId,
    businessUnitId: userInfo?.intBusinessUnitId,
    accountId: userInfo?.intAccountId,
    // for common new approval api  v2
    //@ts-ignore
    applicationTypeId: incrementLanData?.applicationTypeId,
    employeeId: userInfo?.intEmployeeId,
    // for common new approval api  v2
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      getLandingDataApi();
    },
    [isFocused],
  );

  const getLandingDataApi = async () => {
    const api_params = {
      url:
        userInfo?.strUrl === commonURL
          ? GetAllPendingApplicationsForApproval
          : '',
      data: payloadForLand,
      method: commonURL === userInfo?.strUrl ? 'get' : 'post',

      // isConsole: true,
      // isConsoleParams: true,
      // isEncrypted: true,
    };
    const resData = await httpRequest(api_params, setIsLoading);
    const data = resData?.listData ?? resData;
    const modifiedData = data?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    setIncrementData(modifiedData);
  };
  //   isTrueSingleClick,
  //   navigation,
  //   activeDeactiveHandler,
  //   styles,
  const isTrueSingleClick = incrementData?.filter(
    (item: any) => item?.isActive === true,
  );

  const allDeactive = async () => {
    const newArr = incrementData?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    setIncrementData(newArr);
    setIsShowHeader(true);
    getLandingDataApi(); // need for v2 approval
  };
  const handleToggleItem = ({index, mode}: any) => {
    !isSearch && setIsSearch(true);
    const {updatedData, isShowHeader, isSelectAllState} = handleSelectionChange(
      {
        data: incrementData,
        mode: mode,
        index,
        isSelectAll,
      },
    );
    setIncrementData(updatedData);
    setIsShowHeader(isShowHeader);
    if (mode === 'single') {
      setIsSelectAll(isSelectAllState);
    }
    if (mode === 'all') {
      setIsSelectAll(!isSelectAll);
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <Column key={index?.toString()}>
        <TouchableOpacity
          // onLongPress={() => activeDeactiveHandler(index)}
          onLongPress={() => handleToggleItem({index: index, mode: 'single'})}
          onPress={() => {
            if (isTrueSingleClick?.length > 0) {
              handleToggleItem({index: index, mode: 'single'});
            } else {
              navigation.navigate('IncrementApprovalDetails', {
                incrementApprovalDetails: item,
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
          ]}>
          <CommonApprovalMainIndexCard
            item={item}
            index={index}
            isTrueSingleClick={isTrueSingleClick}
            employeeName={item?.applicationInformation?.employeeName || ''}
            amount={`Increment Amount ${item?.applicationInformation?.numIncrementAmount || '0'}`}
            effectiveDate={`Effective Date: ${
              item?.applicationInformation?.dteEffectiveDate
                ? date_formater(item?.applicationInformation?.dteEffectiveDate)
                : ''
            }`}
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
        <CustomHeader
          title="Increment Approval"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      {isTrueSingleClick !== undefined && isTrueSingleClick?.length > 0 && (
        <View>
          <View style={styles.headMain}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={isSelectAll}
                onValueChange={() => handleToggleItem({mode: 'all'})}
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
                onPress={() => setIsModalShow2(true)}
                style={styles.approveOrReject}>
                <Text style={styles.rejectApproveText}>Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setIsModalShow(true)}
                style={[styles.approveOrReject, styles.marginLeft]}>
                <Text style={styles.rejectApproveText}>Approve</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <View style={styles.paddingHorizontl}>
        <CustomFlatList
          contentContainerStyle={{
            paddingBottom: 150,
          }}
          data={incrementData}
          RenderItems={renderItem}
          isLoading={isLoading}
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
            applicationTypeId: incrementLanData?.applicationTypeId,
            isMultipleApprove: true,
          })
        }
        modalText={`Are you sure to approve ${isTrueSingleClick?.length} pending Increment application?`}
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
            applicationTypeId: incrementLanData?.applicationTypeId,
            isMultipleApprove: true,
          })
        }
        modalText={`Are you sure to reject ${isTrueSingleClick?.length} pending Increment application?`}
      />
    </ContainerNew>
  );
};

export default observer(IncrementApprovalMainIndex);
