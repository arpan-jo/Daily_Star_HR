import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Linking,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import QRCode from 'react-native-qrcode-svg';
import Share from 'react-native-share';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ViewShot from 'react-native-view-shot';
import { arlURL } from '../../../../../App';
import { BuildingwiseWifiDDL, SendContact } from '../../../../common/api/api';
import { stylesForModal } from '../../../../common/components/AppUpdate';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomFlatList from '../../../../common/components/CustomFlatList';
import { useToast } from '../../../../common/components/CustomToast';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { MenuType } from '../../../../interfaces/application/application';
import { getMenuData } from '../../../../services/arl-core-modules/services';
import { useRootStore } from '../../../../stores/rootStore';
import {
  getBgColorByLabelOnHrCore,
  getIconByLabelOnHrCore,
} from '../../../SaaS-modules/application/ApplicationCommonFunction';

import CustomVisitingCard from '../../../../common/components/CustomVisitingCard';
import { getEmployeeSelfDetails } from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { ProfileDataType } from '../../../../interfaces/dashboard/employeeDashboard';

const AllApplicationArl = () => {
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const isFocused = useIsFocused();
  const [applicationMenu, setApplicationMenu] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const toaster = useToast();
  const [_, setIsLoading] = useState(false);
  const [isShowWifi, setIsShowWifi] = useState(false);
  const [wifiDropdown, setWifiDropdown] = useState<any[]>([]);
  const { control, setValue, watch } = useForm<any>();
  const ref = useRef<any>();
  const vCardRef = useRef<any>();
  const [resURL, setResURL] = useState<any>('');
  const [isCapturing, setIsCapturing] = useState(false);
  const securityType = 'WPA';

  const openUrl = async () => {
    const url = 'https://corporate.akijair.com/login?callbackUrl=%2F';
    Linking.openURL(url);
  };

  const shareMyVisitingCard = async () => {
    try {
      setIsCapturing(true);
      await new Promise(resolve => setTimeout(resolve, 100));

      if (!vCardRef.current) {
        toaster.show({
          message: 'Card reference not available',
          type: 'error',
        });
        setIsCapturing(false);
        return;
      }

      const uri = await vCardRef.current.capture();
      if (!uri) {
        toaster.show({
          message: 'Failed to capture card',
          type: 'error',
        });
        setIsCapturing(false);
        return;
      }

      const shareOptions = {
        message: 'Business Card',
        url: uri,
        failOnCancel: false,
      };

      await Share.open(shareOptions);
    } catch (error) {
      console.log('errror share', error);
      toaster.show({
        message: 'Failed to share card',
        type: 'error',
      });
    } finally {
      setIsCapturing(false);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <View style={styles.applicationContainer}>
        {item?.map((i: MenuType, inde: number) => (
          <TouchableOpacity
            key={inde}
            style={styles.main}
            onPress={() => {
              if (i?.label?.trim() === 'DigiTania') {
                Linking.openURL('tel:09606868000');
              } else if (i?.label?.trim() === 'Apps') {
                navigation.navigate('MicroAppList');
              } else if (i?.label?.trim() === 'Leave') {
                navigation.navigate('LeaveApplicationMainIndex', {
                  empLeaveData: { isLeaveCreate: true },
                });
              } else if (i?.label?.trim() === 'Movement') {
                navigation.navigate('MovementApplicationMainIndex', {
                  empLeaveData: { isMovementCreate: true },
                });
              } else if (i?.label?.trim() === 'Attendance') {
                navigation.navigate('RemoteAttendanceMainIndex');
              } else if (i?.label?.trim() === 'Market Visit') {
                navigation.navigate('MarketVisitMainIndex');
              } else if (i?.label?.trim() === 'Att. Adjust') {
                navigation.navigate('AttendanceAdjustmentMainIndex');
              } else if (i?.label === 'Location & Device') {
                navigation.navigate('LocationAndDeviceMainIndex');
              } else if (i?.label === 'e-Presence') {
                navigation.navigate('LocationAndDeviceMainIndex');
              } else if (i?.label?.trim() === 'IOU') {
                navigation.navigate('IOUApplicationMainIndex');
              } else if (i?.label?.trim() === 'Loan') {
                navigation.navigate('LoanApplicationMainIndex');
              } else if (i?.label?.trim() === 'Directory') {
                if (userInfo?.strUrl === arlURL) {
                  openUrl();
                } else {
                  navigation.navigate('EmployeeDirectory');
                }
              } else if (i?.label?.trim() === 'Meeting') {
                navigation.navigate('MettingAgendaMainIndex');
              } else if (i?.label?.trim() === 'Task') {
                // navigation.navigate('TodoMasterMainIndex');
                navigation.navigate('TaskMainIndex');
              } else if (i?.label?.trim() === 'Expense') {
                navigation.navigate('ExpenseApplicationMainIndex');
              } else if (i?.label?.trim() === 'Share Wifi') {
                setValue('officeBuilding', wifiDropdown?.[0] || null);
                setIsShowWifi(true);
              } else if (i?.label?.trim() === 'Adv. Expense') {
                navigation.navigate('AdvanceExpenseMainIndex');
              } else if (i?.label?.trim() === 'E Collection') {
                navigation.navigate('CustomerChequeIndex');
              } else if (i?.label?.trim() === 'Share Card') {
                shareMyVisitingCard();
              } else if (i?.label?.trim() === 'Issue') {
                navigation.navigate('IssueMainIndex');
              } else if (i?.label?.trim() === 'Non-Compliance') {
                navigation.navigate('NonComplianceIndex');
              } else if (i?.label?.trim() === 'Grievance') {
                navigation.navigate('GrievanceMainIndex');
              } else if (i?.label?.trim() === 'Employee Register') {
                navigation.navigate('EmployeeRegisterIndex');
              } else {
                toaster.show({ message: 'Coming soon...', type: 'success' });
              }
            }}
          >
            <View
              style={[
                styles.applicationIconBox,
                {
                  backgroundColor:
                    i?.label?.trim() === 'DigiTania'
                      ? 'white'
                      : i?.label?.trim() === 'Directory'
                      ? userInfo?.strUrl === arlURL
                        ? 'white'
                        : getBgColorByLabelOnHrCore(i?.label?.trim()) || ''
                      : getBgColorByLabelOnHrCore(i?.label?.trim()) || '',
                  // i?.label === 'Akij Air'
                  //   ? 'white'
                  //   : getBgColorByLabelOnHrCore(i?.label?.trim()) || '',
                },
              ]}
            >
              {i?.label?.trim() === 'DigiTania' ? (
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 45 / 2,
                    height: 45,
                    width: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: COLORS.primary,
                  }}
                >
                  <FastImage
                    source={IMAGES.digiTaniaImg}
                    style={{ height: 30, width: 30 }}
                    resizeMode="cover"
                  />
                </View>
              ) : i?.label?.trim() === 'Directory' ? (
                userInfo?.strUrl === arlURL ? (
                  <View
                    style={{
                      borderWidth: 1,
                      borderRadius: 45 / 2,
                      height: 45,
                      width: 45,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: COLORS.primary,
                    }}
                  >
                    <FastImage
                      source={IMAGES.akijairLogo}
                      style={{ height: 30, width: 30 }}
                      resizeMode="contain"
                    />
                  </View>
                ) : (
                  <MIcon
                    //@ts-ignore
                    name={`${getIconByLabelOnHrCore(i?.label)}`}
                    size={30}
                    color={COLORS.white}
                  />
                )
              ) : (
                <MIcon
                  //@ts-ignore
                  name={`${getIconByLabelOnHrCore(i?.label)}`}
                  size={30}
                  color={COLORS.white}
                />
              )}
            </View>
            <Text style={styles.applicationTitle}>
              {i?.label?.trim() === 'Directory'
                ? userInfo?.strUrl === arlURL
                  ? 'Akij Air'
                  : i?.label
                : i?.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const api_params = {
        url: BuildingwiseWifiDDL,
      };
      const res = await httpRequest(api_params, () => {});
      const modifiedData = res?.map((item: any) => ({
        ...item,
        value: item?.BuildingId,
        label: item?.BuildingName,
      }));
      setWifiDropdown(modifiedData);

      const menuData = await getMenuData(userInfo?.intUserId, setIsLoading);
      const applicationData =
        menuData &&
        menuData?.filter((item: any) => item?.label?.trim() === 'HR Core');
      if (applicationData?.length > 0) {
        // DigiTania does not come from the backend menu — inject it at the
        // front (Apps is unshifted after it, so it lands ahead of DigiTania).
        if (userInfo?.strUrl === arlURL && applicationData?.[0]?.childList) {
          applicationData[0].childList.unshift({
            id: -1,
            label: 'DigiTania',
            isFirstLabel: true,
            parentId: applicationData?.[0]?.id,
            childList: null,
          });
        }
        // Same treatment as DigiTania above: micro-apps are a client-side
        // registry, so the backend menu has no entry for them.
        // ponytail: injected client-side; move to the backend menu once
        // micro-apps need per-user visibility.
        applicationData?.[0]?.childList?.unshift({
          id: -2,
          label: 'Apps',
          parentId: applicationData?.[0]?.id,
          childList: null,
        });
        const newArr: any[] = [];
        while (applicationData?.[0]?.childList?.length) {
          newArr?.push(applicationData?.[0]?.childList?.splice(0, 4));
        }
        setApplicationMenu(newArr);
      }

      const profileRes = await getEmployeeSelfDetails(
        userInfo?.intEmployeeId,
        setIsLoading,
      );
      setProfileData(profileRes);

      const api_params2 = {
        url: SendContact,
        data: { employee: userInfo?.intEmployeeId },
      };
      const resQr = await httpRequest(api_params2, () => {});
      setResURL(resQr);
    },
    [isFocused],
  );
  const phoneNumber =
    profileData?.employeeProfileLandingView?.strOfficeMobile ||
    profileData?.employeeProfileLandingView?.strPersonalMobile;
  const emailAdrress =
    profileData?.employeeProfileLandingView?.strOfficeMail ||
    profileData?.employeeProfileLandingView?.strPersonalMail;
  const strDesignation =
    profileData?.employeeProfileLandingView?.strDesignation ||
    userInfo?.strDesignation;

  return (
    <View style={styles.containerMargin}>
      <Text style={styles.myLeaveTitle}>Applications</Text>
      <CustomFlatList
        data={applicationMenu}
        RenderItems={renderItem}
        horizontal
        showHorizontalScrollIndicator={false}
      />

      <Modal animationType="fade" transparent visible={isShowWifi}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalStyle,
              {
                height: 400,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setIsShowWifi(false)}>
              <MIcon
                style={{
                  textAlign: 'right',
                  paddingRight: 6,
                }}
                //@ts-ignore
                name={'close'}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
            <View
              style={{
                height: 50,
                width: 280,
                marginLeft: 16,
              }}
            >
              <CustomDropDownNew
                control={control}
                data={wifiDropdown}
                name="officeBuilding"
                label="Ofice Building"
                placholder="Choose"
                setValue={setValue}
                rules={{ required: true }}
              />
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <ViewShot
                style={{
                  width: SIZES.width,
                  alignItems: 'center',
                  paddingVertical: 20,
                }}
                //@ts-ignore
                ref={ref}
                options={{
                  fileName: 'VCARD',
                  format: 'jpg',
                  quality: 0.9,
                }}
              >
                <QRCode
                  value={`WIFI:S:${
                    watch('officeBuilding')?.WiFiUsername
                  };T:${securityType};P:${
                    watch('officeBuilding')?.WiFiPassword
                  };;`}
                  size={190}
                  color="black"
                  backgroundColor="white"
                />
              </ViewShot>

              <TouchableOpacity
                onPress={() => {
                  ref?.current?.capture()?.then(async (uri: any) => {
                    const shareOptions = {
                      social: Share.Social.FACEBOOK,
                      message: 'WiFi QR Code',
                      url: uri,
                    };
                    const _ShareResponse = await Share.open(shareOptions);
                  });
                }}
                style={{
                  backgroundColor: COLORS.lightGray5,
                  marginTop: 6,
                  width: 280,
                  paddingVertical: 6,
                  alignItems: 'center',
                  borderRadius: 6,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                  }}
                >
                  <MIcon
                    //@ts-ignore
                    name={'share'}
                    size={20}
                    color={COLORS.black}
                  />
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 16,
                    }}
                  >
                    Share
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {phoneNumber && emailAdrress && userInfo ? (
        <View
          style={
            isCapturing
              ? { position: 'relative', opacity: 1 }
              : {
                  position: 'absolute',
                  opacity: 0,
                  pointerEvents: 'none',
                  top: -9999, // Ensure offscreen
                  left: -9999,
                }
          }
        >
          <CustomVisitingCard
            phoneNumber={phoneNumber}
            emailAddress={emailAdrress}
            strDesignation={strDesignation}
            userInfo={userInfo}
            resURL={resURL}
            viewShotRef={vCardRef}
          />
        </View>
      ) : null}
    </View>
  );
};

export default observer(AllApplicationArl);

const styles = StyleSheet.create({
  applicationIconBox: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  applicationContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  applicationTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    textAlign: 'center',
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  containerMargin: {
    paddingVertical: 8,
    marginHorizontal: 16,
  },
  main: {
    alignItems: 'center',
    width: Platform.OS === 'ios' ? 85 : 90,
  },
  contain: {
    paddingVertical: 16,
    paddingBottom: 22,
  },
  ...stylesForModal,
});
