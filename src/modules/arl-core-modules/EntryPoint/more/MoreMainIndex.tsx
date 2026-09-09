/* eslint-disable react-native/no-inline-styles */
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { Linking, NativeModules, Platform, StyleSheet } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomTextNew from '../../../../common/components/CustomText';
import { useToast } from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
// import {setupCallKeepAndSIPFunc} from '../../../../common/constant/BodySensorPermission';
import { COLORS } from '../../../../common/constant/Index';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import ThemePicker from '../../../../common/components/ThemePicker';
import LanguagePicker from '../../../../common/components/LanguagePicker';
import { t } from '../../../../common/constant/i18n';
import { useMoreScreenLogic } from '../../../../hooks/useMoreScreenLogic';
import { getAllNotificationCount } from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import { useRootStore } from '../../../../stores/rootStore';
import NotificationCounter from '../../../SaaS-modules/dashboard/employeeDashboard/NotificationCounter';
import MenuItem from '../../shared/MenuItem';
import ProfileHeader from '../../shared/ProfileHeader';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const { MqttModule } = NativeModules || {};
const edges: Edge[] = ['right', 'left'];

const HRMoreMainIndex = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { userInfo, userInfoSave } = useRootStore();
  const toaster = useToast();
  const [notificationCounter, setNotificationCounter] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalForBiometric, setIsModalForBiometric] = useState(false);
  const { empDashboardData, url, isUpdate, clearAll } =
    useMoreScreenLogic(navigation);
  const [emailInput, setEmailInput] = useState(userInfo?.loginEmail || '');
  const [passwordInput, setPasswordInput] = useState('');
  const appName = `sendTo_people_desk_saas_${userInfo?.intAccountId}_${userInfo?.intEmployeeId}`;
  console.log(userInfo, null, 2);
  useEffect(() => {
    setIsModalVisible(false);
    if (Platform.OS === 'android') {
      // setupCallKeepAndSIPFunc();
    }
  }, []);

  // Notification counter logic
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;

      if (userInfo?.intEmployeeId && userInfo?.intAccountId) {
        const notiCount = await getAllNotificationCount(
          userInfo?.intEmployeeId,
          userInfo?.intAccountId,
        );
        setNotificationCounter(notiCount || 0);
      }
    },
    [isFocused],
  );

  // SignalR connection
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) return null;

      const connection = new HubConnectionBuilder()
        .withUrl('https://signal.peopledesk.io/NotificationHub')
        .withAutomaticReconnect()
        .configureLogging(LogLevel.None)
        .build();

      if (connection) {
        connection
          .start()
          .then(() => {
            connection.on(`${appName}`, (count: number) => {
              setNotificationCounter(preCount => preCount + count);
            });
          })
          .catch((error: any) =>
            console.log('connection err ===>', JSON.stringify(error, null, 2)),
          );
      }
    },
    [isFocused],
  );

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={true}
      header={
        <CustomHeader
          title="PeopleDesk"
          alterIcon={'contacts-outline'}
          alterIconPress={() => navigation.navigate('EmployeeDirectoryNew')}
          isSupport
          supportIconPress={() =>
            Linking.openURL('https://forms.gle/Cruy4CLDjWKfcphv9')
          }
          components={
            <NotificationCounter
              notificationCounter={notificationCounter}
              setNorificationCounter={setNotificationCounter}
            />
          }
        />
      }
      style={styles.container}
    >
      <ProfileHeader
        empDashboardData={empDashboardData}
        userInfo={userInfo}
        showDetails={true}
        onDetailsPress={() => {
          //@ts-ignore
          navigation.navigate('EmpolyeeSelfDetails', { empDashboardData });
        }}
      />

      {/* Appearance Section */}
      <Row direction="row" rowStyle={styles.mainRow}>
        <Row rowStyle={styles.paddingHorizontalAndVertical}>
          <Column colWidth="100%">
            <Row>
              <CustomTextNew text={t('more.appearance')} subTxt padTop={8} />
            </Row>
          </Column>
        </Row>
        <ThemePicker />
        <LanguagePicker />
      </Row>

      {/* Privacy & Security Section */}
      <Row direction="row" rowStyle={styles.mainRow}>
        <Row rowStyle={styles.paddingHorizontalAndVertical}>
          <Column colWidth="100%">
            <Row>
              <CustomTextNew text={t('more.privacy')} subTxt padTop={8} />
            </Row>
          </Column>
        </Row>

        <MenuItem
          icon="privacy-tip"
          title={t('more.terms')}
          onPress={() => Linking.openURL('https://ibos.io/our-products/')}
        />

        <MenuItem
          icon="lock-outline"
          title={t('more.privacyPolicy')}
          onPress={() =>
            Linking.openURL(
              'https://ibos.io/about-ibos-top-software-company-in-bangladesh/',
            )
          }
          showBorder={false}
        />
      </Row>

      {/* Others Section */}
      <Row direction="row" rowStyle={styles.mainRow}>
        <Row rowStyle={styles.paddingHorizontalAndVertical}>
          <Column colWidth="100%">
            <Row>
              <CustomTextNew text={t('more.others')} subTxt padTop={8} />
            </Row>
          </Column>
        </Row>
        <MenuItem
          icon="mic"
          title={t('more.voiceRecorder')}
          onPress={() => navigation.navigate('VoiceRecorder')}
        />

        <MenuItem
          icon="fingerprint"
          title={t('more.biometric')}
          onPress={() => setIsModalForBiometric(true)}
        />

        <MenuItem
          icon="feedback"
          title={t('more.feedback')}
          onPress={() =>
            Linking.openURL(
              'https://ibos.io/contact-ibos-software-company-in-bangladesh/',
            )
          }
        />
        <MenuItem
          icon="help-outline"
          title={t('more.faq')}
          onPress={() =>
            Linking.openURL(
              'https://ibos.io/about-ibos-top-software-company-in-bangladesh/',
            )
          }
        />

        <MenuItem
          icon="share"
          title={t('more.changePassword')}
          onPress={async () => {
            const alreadySigned = await GoogleSignin.getCurrentUser();

            if (alreadySigned) {
              toaster.show({
                message: 'Password change is not available for Google sign-in!',
                type: 'warning',
              });
            } else {
              navigation.navigate('ChangePasswordMainIndex');
            }
          }}
        />

        <MenuItem
          icon="star-border"
          title={t('more.rateApp')}
          onPress={() =>
            Linking.openURL(
              'https://play.google.com/store/apps/details?id=com.ibos.dailystarhr',
            )
          }
        />

        <MenuItem
          icon="info-outline"
          title={t('more.about')}
          onPress={() =>
            Linking.openURL(
              'https://ibos.io/peopledesk-best-hr-management-software/',
            )
          }
        />

        {isUpdate && (
          <MenuItem
            icon="update"
            title={t('more.updateAvailable')}
            onPress={() => Linking.openURL(url)}
            textColor={COLORS.blue}
            iconColor={COLORS.blue}
          />
        )}

        <MenuItem
          icon="power-settings-new"
          title={t('more.logOut')}
          onPress={async () => {
            try {
              if (Platform.OS === 'android') {
                await MqttModule?.stopService();
              }
              setIsModalVisible(true);
            } catch (_error) {
              setIsModalVisible(true);
            }
            // await MqttModule?.stopService()
            //   ?.then((res: string) => {
            //     setIsModalVisible(true);
            //     console.log('🛑 MQTT Service stopped', res);
            //   })
            //   .catch((error: any) => setIsModalVisible(true));
          }}
          showArrow={false}
          showBorder={false}
        />
      </Row>

      <CustomModalNew
        setIsModalShow={setIsModalForBiometric}
        isModalShow={isModalForBiometric}
        setModalInputText2={setEmailInput}
        modalInputLabel2={t('common.email')}
        keyboardType="default"
        modalInputText2={emailInput}
        setModalInputText={setPasswordInput}
        modalInputLabel={t('common.password')}
        modalInputText={passwordInput}
        onPressCallApi={() => {
          //@ts-ignore
          userInfoSave({
            ...userInfo,
            loginEmail: emailInput,
            loginPassword: passwordInput,
          });
          setIsModalForBiometric(false);
          setEmailInput('');
          setPasswordInput('');
          toaster.show({
            message: 'Biometric setup Successfully',
            type: 'success',
          });
        }}
        modalText={t('more.biometricConfirm')}
        deleteText={t('common.setup')}
      />

      <CustomModalNew
        setIsModalShow={setIsModalVisible}
        isModalShow={isModalVisible}
        onPressCallApi={() => {
          setIsModalVisible(false);
          clearAll();
        }}
        modalText={t('more.logoutConfirm')}
        deleteText={t('common.confirm')}
      />
      {/* Social Media Section */}
      <Row
        direction="row"
        rowStyle={[styles.mainRow, { borderBottomWidth: 0 }]}
      >
        <Row
          align="center"
          rowStyle={styles.paddingHorizontalAndVertical}
          isPressOn={false}
        >
          <Column colWidth="100%">
            <CustomTextNew text={t('more.followUs')} subTxt padTop={8} />
            <Row style={styles.colDirection}>
              <Column
                isPressOn={false}
                onCardPress={() =>
                  Linking.openURL('https://www.facebook.com/iboslimited/')
                }
              >
                <MIcon
                  name="facebook"
                  color={'#0163E0'}
                  size={24}
                  style={styles.socialMediaIconStyle}
                />
              </Column>
              <Column
                isPressOn={false}
                onCardPress={() =>
                  Linking.openURL(
                    'https://www.linkedin.com/company/iboslimited',
                  )
                }
              >
                <MCIcon
                  name="linkedin"
                  color={'#1275B1'}
                  size={24}
                  style={styles.socialMediaIconStyle}
                />
              </Column>
              <Column
                isPressOn={false}
                onCardPress={() =>
                  Linking.openURL('https://www.youtube.com/@iBOSLimited/')
                }
              >
                <MCIcon
                  name="youtube"
                  color={'#FC0D1B'}
                  style={styles.socialMediaIconStyle}
                />
              </Column>
            </Row>
          </Column>
        </Row>
      </Row>
    </ContainerNew>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
  },
  mainRow: {
    flexWrap: 'wrap',
    paddingTop: 5,
    backgroundColor: COLORS.white,
    paddingBottom: 16,
    borderBottomColor: COLORS.bar,
    borderBottomWidth: 8,
  },
  paddingHorizontalAndVertical: {
    paddingHorizontal: 16,
  },
  colDirection: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
  },
  socialMediaIconStyle: {
    fontSize: 32,
    marginRight: 16,
  },
});

export default observer(HRMoreMainIndex);
