
import {useNetInfo} from '@react-native-community/netinfo';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Linking, StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../common/components/CustomText';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';

import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {SmarARLMenuType} from '../../../../interfaces/ARL-Core/ARLMenutype';

import {getMenuData} from '../../../../services/arl-core-modules/services';
import {getAllNotificationCount} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {
  GetFCMToken,
  NotificationListner,
  notificationListeners} from '../../../../services/SaaS-modules/notification/notification';
import {useRootStore} from '../../../../stores/rootStore';
import NotificationCounter from '../../../SaaS-modules/dashboard/employeeDashboard/NotificationCounter';
import {useSBUSetup} from '../../../../hooks/useSBUSetup';
import {useSignalRNotification} from '../../../../hooks/useSignalRconnection';

const edges: Edge[] = ['right', 'left'];

const ArlApprovalMainIndex = () => {
  const toster = useToast();
  const {
    userInfo,
    clearEmpList,
    clearGRNProductWithRef,
    clearProductItem,
    clearSupplier,
    sbuSave,
    sbu: _sbu,
  } = useRootStore();
  const [, setIsLoading] = useState(false);
  const [isSBULoading, setIsSBULoading] = useState(false);
  const isFocused = useIsFocused();
  const [approvalMenu, setApprovalMenu] = useState<SmarARLMenuType[]>();
  const netInfo = useNetInfo();
  const navigation = useNavigation();
  const [notificationCounter, setNorificationCounter] = useState<number>(0);

  const {control, setValue} = useForm();
  const selectedBuUnit = useSBUSetup(isFocused, setIsSBULoading, setValue);
  const iconName = (item: any) => {
    if (item?.label?.trim() === 'Leave') {
      return 'luggage';
    }
    if (item?.label?.trim() === 'Movement') {
      return 'directions-car';
    }
    if (item?.label?.trim() === 'Separation') {
      return 'upcoming';
    }
    if (item?.label?.trim() === 'Overtime') {
      return 'schedule-send';
    }
    if (item?.label?.trim() === 'Loan') {
      return 'receipt';
    }
    if (item?.label?.trim() === 'IOU') {
      return 'request-page';
    }
    if (item?.label?.trim() === 'IOU Adjust') {
      return 'receipt-long';
    }
    if (item?.label?.trim() === 'Remote Att.') {
      return 'person-pin-circle';
    }
    if (item?.label?.trim() === 'e-Presence') {
      return 'map';
    }
    if (item?.label?.trim() === 'Att. Adjust') {
      return 'perm-contact-calendar';
    }
    if (item?.label?.trim() === 'Market Visit') {
      return 'business-center';
    }
    if (item?.label?.trim() === 'Expense') {
      return 'request-page';
    }
    if (item?.label?.trim() === 'Master Location') {
      return 'map';
    }
    if (item?.label?.trim() === 'Purchase Request') {
      return 'add-shopping-cart';
    }
    if (item?.label?.trim() === 'Comparative Statement') {
      return 'fact-check';
    }
    if (item?.label?.trim() === 'Purchase Order') {
      return 'fact-check';
    }
    if (item?.label?.trim() === 'Transport') {
      return 'directions-car';
    }
    if (item?.label?.trim() === 'Trip Expense') {
      return 'receipt-long';
    }
    if (item?.label?.trim() === 'IHB Reg') {
      return 'app-registration';
    }
    if (item?.label?.trim() === 'Site Entry') {
      return 'apartment';
    }
    if (item?.label?.trim() === 'Site Engineer') {
      return 'engineering';
    }
    if (item?.label?.trim() === 'Advance Exp') {
      return 'request-page';
    }
    if (item?.label?.trim() === 'Customer Pre-Assesment') {
      return 'app-registration';
    }
    if (item?.label?.trim() === 'Field Force Assesment') {
      return 'app-registration';
    }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      clearSupplier();
      clearEmpList();
      clearProductItem();
      clearGRNProductWithRef();
      const menuData = await getMenuData(userInfo?.intUserId, setIsLoading);

      const appMenu =
        menuData && menuData?.filter((item: any) => item.label === 'Approval');

      // Function to remove parent elements with empty childList
      const removeEmptyParents = (data: any) => {
        return data?.filter(
          (item: any) => item?.childList && item?.childList?.length > 0,
        );
      };

      // Remove empty parents
      const filteredData = removeEmptyParents(appMenu?.[0]?.childList);
      setApprovalMenu(filteredData);

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
    [isFocused, netInfo?.isConnected],
  );
  // console.log('approvalMenu', JSON.stringify(approvalMenu, null, 2));
  useSignalRNotification(userInfo, isFocused, setNorificationCounter);

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={true}
      header={
        <CustomHeader
          alterIcon={'contacts-outline'}
          alterIconPress={() => {
            navigation.navigate('EmployeeDirectoryNew');
          }}
          isSupport
          supportIconPress={() =>
            Linking.openURL('https://forms.gle/Cruy4CLDjWKfcphv9')
          }
          // setRerender={setIsLoadAgain}
          // isSubtitleClickable={true}
          // subTitleData={selectedBuUnit}
          // subtitle={sbu?.businessUnitName || ''}
          title="PeopleDesk"
          components={
            <NotificationCounter
              notificationCounter={notificationCounter}
              setNorificationCounter={setNorificationCounter}
            />
          }
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isSBULoading} />
      <Column
        colWidth={'100%'}
        colStyle={{
          paddingHorizontal: 16,
          paddingTop: 10,
        }}>
        <CustomDropDownNew
          isFullTextView
          control={control}
          data={selectedBuUnit}
          name="sbu"
          label="SBU"
          placholder="Choose"
          onChange={(options: any) => {
            sbuSave({
              businessUnitId: options?.value,
              businessUnitName: options?.label,
              sbuId: options?.sbuId,
            });
            setValue('sbu', options);
          }}
          rules={{required: true}}
        />
      </Column>
      <Row direction="column">
        {approvalMenu?.map((item, index) => (
          <Row key={index} direction="column" rowStyle={styles.mainRow}>
            {index === 0 ? null : <Row rowStyle={styles.dividerStyle} />}
            <CustomTextNew text={item?.label} txtStyle={styles.mainTxt} />
            <Row rowStyle={styles.mainRow}>
              {item?.childList?.map((it, ind) => (
                <Column
                  isPressOn={false}
                  onCardPress={() => {
                    if (it?.label?.trim() === 'Leave') {
                      navigation.navigate('LeaveApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Movement') {
                      navigation.navigate('MovementApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Separation') {
                      // navigation.navigate('MovementApprovalMainIndex');
                      toster.show({
                        message: 'Upcoming...',
                        type: 'warning',
                      });
                    }
                    if (it?.label?.trim() === 'Loan') {
                      navigation.navigate('LoanApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Remote Att.') {
                      navigation.navigate('RemoteAttendanceApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Overtime') {
                      navigation.navigate('OvertimeApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'IOU Adjust') {
                      navigation.navigate('IOUAdjustmentApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'IOU') {
                      navigation.navigate('IOUApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Att. Adjust') {
                      navigation.navigate(
                        'AttendanceAdjustmentApprovalMainIndex',
                      );
                    }
                    if (it?.label?.trim() === 'e-Presence') {
                      navigation.navigate('LocationAndDeviceApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Market Visit') {
                      navigation.navigate('MarketVisitApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Expense') {
                      navigation.navigate('ExpenseApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Master Location') {
                      navigation.navigate('AssignedLocationApprovalMain');
                    }
                    if (it?.label.trim() === 'Purchase Request') {
                      navigation.navigate('PurchaseRequestApproveIndex');
                    }
                    if (it?.label.trim() === 'Purchase Order') {
                      navigation.navigate('PurchaseOrderApproveIndex');
                    }
                    if (it?.label.trim() === 'Comparative Statement') {
                      navigation.navigate('ComparatiStatementApprovalIndex');
                    }
                    if (it?.label.trim() === 'Transport') {
                      // navigation.navigate('TransportApprovalMain');
                      navigation.navigate('StandbyReqApprovalMain');
                    }
                    if (it?.label?.trim() === 'Trip Expense') {
                      navigation.navigate('TripExpenseApprovalMain');
                    }
                    if (it?.label?.trim() === 'IHB Reg') {
                      navigation.navigate('IhApprovalLanding');
                    }
                    if (it?.label?.trim() === 'Site Engineer') {
                      navigation.navigate('ARLSiteUserReg');
                    }
                    if (it?.label?.trim() === 'Site Entry') {
                      navigation.navigate('ARLSiteReg'); // ARLSiteReg
                    }
                    if (it?.label?.trim() === 'Advance Exp') {
                      navigation.navigate('AdvanceExpenseApprovalMainIndex');
                    }
                    if (it?.label?.trim() === 'Customer Pre-Assesment') {
                      navigation.navigate(
                        'CustomerPreAssesmentApprovalMainIndex',
                      );
                    }
                    if (it?.label?.trim() === 'Field Force Assesment') {
                      navigation.navigate(
                        'SalesForceAssesmentApprovalMainIndex',
                      );
                    }
                  }}
                  colWidth="25%"
                  key={ind}
                  colStyle={styles.pad}>
                  <Row direction="row" justify="center" align="center">
                    <Column colStyle={[styles.iconDesign]}>
                      <MIcon
                        //@ts-ignore
                        name={iconName(it)}
                        color={COLORS.graySubText}
                        size={24}
                      />
                    </Column>
                  </Row>
                  <CustomTextNew
                    text={it?.label || ''}
                    txtAlign={'center'}
                    txtSize={12}
                  />
                </Column>
              ))}
            </Row>
          </Row>
        ))}
      </Row>
    </ContainerNew>
  );
};

export default observer(ArlApprovalMainIndex);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },
  mainTxt: {
    color: COLORS.textNewColor,
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconDesign: {
    marginVertical: 4,
    padding: 8,
    borderRadius: 50,
  },
  pad: {
    padding: 4,
  },
  mainRow: {
    flexWrap: 'wrap',
    paddingTop: 5,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
  },
  dividerStyle: {
    backgroundColor: COLORS.bar,
    height: 8,
  },
});
