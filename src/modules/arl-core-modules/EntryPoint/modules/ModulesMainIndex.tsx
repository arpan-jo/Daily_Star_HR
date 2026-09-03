
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Linking, StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';

import SVGController from '../../../../assets/svg/SVGController';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {SmarARLMenuType} from '../../../../interfaces/ARL-Core/ARLMenutype';
import {getAllNotificationCount} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {
  GetFCMToken,
  NotificationListner,
  notificationListeners} from '../../../../services/SaaS-modules/notification/notification';
import {getMenuData} from '../../../../services/arl-core-modules/services';
import {useRootStore} from '../../../../stores/rootStore';
import NotificationCounter from '../../../SaaS-modules/dashboard/employeeDashboard/NotificationCounter';
import {useSignalRNotification} from '../../../../hooks/useSignalRconnection';

const edges: Edge[] = ['right', 'left'];

const ModulesMainIndex = () => {
  const navigation = useNavigation();
  const {
    userInfo,
    clearEmpList,
    clearGRNProductWithRef,
    clearProductItem,
    clearSBU,
    clearSupplier,
    sbu,
  } = useRootStore();
  // const netInfo = useNetInfo();
  const toaster = useToast();
  const isFocused = useIsFocused();
  const [, setIsLoading] = useState(false);
  const [menuDataList, setMenuDataList] = useState<SmarARLMenuType[]>([]);
  const [notificationCounter, setNorificationCounter] = useState<number>(0);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      sbu?.businessUnitId && clearSBU();
      clearSupplier();
      clearEmpList();
      clearProductItem();
      clearGRNProductWithRef();
      const menuData = await getMenuData(userInfo?.intUserId, setIsLoading);
      const res =
        menuData && menuData?.filter((it: any) => it?.label !== 'Approval');
      setMenuDataList(res);
      await NotificationListner();
      await notificationListeners();
      GetFCMToken(userInfo?.intEmployeeId);
      await NotificationListner(navigation);
      const notiCount = await getAllNotificationCount(
        userInfo?.intEmployeeId,
        userInfo?.intAccountId,
      );
      if (notiCount) {
        setNorificationCounter(notiCount);
      } else {
        setNorificationCounter(0);
      }
    },
    [isFocused],
  );

  useSignalRNotification(userInfo, isFocused, setNorificationCounter);

  const renderItem = ({item}: any) => {
    return (
      <Column colWidth={'33.3%'}>
        <Column
          onCardPress={() => {
            if (item?.label?.trim() === 'HR Core') {
              navigation.navigate('HrCoreBottomTab');
            } else if (item?.label?.trim() === 'Procurement') {
              navigation.navigate('ProcurementBottomTab');
            } else if (item?.label?.trim() === 'Culture') {
              navigation.navigate('CultureMainIndex');
            } else if (item?.label?.trim() === 'My Tasks') {
              navigation.navigate('TodoMasterMainIndex', {
                fromService: true,
              });
            } else if (item?.label?.trim() === 'Sales') {
              navigation.navigate('SalesMainIndex');
            } else if (item?.label?.trim() === 'Meet-Map') {
              navigation.navigate('MettingAgendaMainIndex');
            } else if (item?.label?.trim() === 'CRM') {
              navigation.navigate('CRMMainIndex');
            } else if (item?.label?.trim() === 'OPEX') {
              navigation.navigate('OPEXMainIndex');
            } else if (item?.label?.trim() === 'Wifi Zone Setup') {
              navigation.navigate('WifiZoneMainIndex');
            } else if (item?.label?.trim() === 'Transport') {
              // userInfo?.intDesignationId === 1386
              //   ? navigation.navigate('VehicleLogBookMainIndex')
              //   :
              navigation.navigate('AllRequistionMainIndex', item);
            } else if (item?.label?.trim() === 'Social Engagement') {
              navigation.navigate('LinkCustomer'); // LinkCustomer
            } else if (item?.label?.trim() === 'Poultry & Cattle') {
              navigation.navigate('FarmManagementIndex');
            } else if (item?.label?.trim() === 'Visitor') {
              navigation.navigate('VisitorManagementMainIndex');
            } else {
              toaster.show({
                message: 'Upcoming feature',
                type: 'success',
              });
            }
          }}
          isPressOn={false}
          align="center"
          colStyle={[styles.card]}>
          <SVGController name={item?.label?.trim()} />
        </Column>
        <CustomTextNew
          text={item?.label?.trim()}
          txtAlign={'center'}
          padTop={10}
        />
      </Column>
    );
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      header={
        <CustomHeader
          title="PeopleDesk"
          alterIcon={'contacts-outline'}
          alterIconPress={() => {
            navigation.navigate('EmployeeDirectoryNew');
          }}
          isSupport
          supportIconPress={() =>
            Linking.openURL('https://forms.gle/Cruy4CLDjWKfcphv9')
          }
          components={
            <NotificationCounter
              notificationCounter={notificationCounter}
              setNorificationCounter={setNorificationCounter}
            />
          }
        />
      }
      style={styles.container}>
      <CustomFlatList
        contentContainerStyle={styles.pb150}
        data={menuDataList}
        RenderItems={renderItem}
        numColumns={3}
      />
    </ContainerNew>
  );
};

export default ModulesMainIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },

  logoWrapper: {
    textAlign: 'center',
    fontSize: 40,
    padding: 25,
  },
  padHorizontal: {
    paddingHorizontal: 6,
  },
  card: {
    marginTop: 20,
  },
  pb150: {
    paddingBottom: 150,
  },
});
