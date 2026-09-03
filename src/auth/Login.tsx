import { useIsFocused, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  BackHandler,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { arlURL, commonURL } from '../../App';
import { AuthAppsLogin } from '../common/api/api';
import ContainerNew from '../common/components/Container';
import CustomButtonNew from '../common/components/CustomButton';
import CustomInputNew from '../common/components/CustomInput';
import { useToast } from '../common/components/CustomToast';
import { COLORS, IMAGES, SIZES } from '../common/constant/Index';
import { httpRequest } from '../common/constant/httpRequest';
import useAsyncEffect from '../common/packages/useAsyncEffect/useAsyncEffect';
import { clearAllStorage } from '../common/services/clearStorage';
import { LoginPayloadType } from '../interfaces/login/login';
import { RootStackScreenProps } from '../navigations/RootStack';
import { requestPushNotificationPermission } from '../services/SaaS-modules/notification/notification';
import { useRootStore } from '../stores/rootStore';

// 👇 Polyfill for React Native
if (typeof global.atob === 'undefined') {
  global.atob = atob;
}
if (typeof global.btoa === 'undefined') {
  global.btoa = btoa;
}
interface PayloadType {
  email: string;
  password: string;
}

const Login = observer<RootStackScreenProps<'Login'>>(({ navigation }) => {
  const route = useRoute();
  const { userInfoSave, trackOnOrOfFunc, userInfo } = useRootStore();
  //@ts-ignore
  const { fromReset, email } = route?.params || {};
  const [showPass, setShowPass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toaster = useToast();
  const isFocused = useIsFocused();
  const [deviceName, setDeviceName] = useState('');
  DeviceInfo.getDeviceName().then(name => setDeviceName(name));
  const seChUa = 'sec-ch-ua';
  const secChUaMobile = 'sec-ch-ua-mobile';
  const secChUaPlatform = 'sec-ch-ua-platform';
  DeviceInfo.getUniqueId().then(uniqueId => {
    axios.defaults.headers.common[seChUa] = uniqueId;
  });

  const initValue = {
    email: userInfo?.loginEmail || '',
    password: '',
  };

  const versionName = DeviceInfo.getSystemVersion();
  axios.defaults.headers.common[secChUaMobile] = deviceName;
  axios.defaults.headers.common[secChUaPlatform] =
    Platform.OS === 'android'
      ? `android${versionName}:empId${userInfo?.intEmployeeId}`
      : `ios:empId${userInfo?.intEmployeeId}`;

  const { control, handleSubmit, setValue, reset, watch } = useForm({
    defaultValues: initValue,
  });
  if (fromReset) {
    setValue('email', email);
  }

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      await requestPushNotificationPermission();

      const backAction = () => {
        if (navigation.isFocused()) {
          BackHandler.exitApp();
          return true;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () =>
        //@ts-ignore
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    },
    [isFocused],
  );

  const onSubmit = async (data: PayloadType) => {
    const payload = {
      strLoginId: data?.email?.trim(),
      strPassword: data?.password?.trim(),
      intUrlId: 0,
      strUrl: '',
      intAccountId: 1,
    };
    loginHandler(payload);
  };

  const loginHandler = async (values: LoginPayloadType) => {
    axios.defaults.baseURL = `${commonURL}/api`;
    authAppsLogin(values, commonURL);
  };

  const authAppsLogin = async (values: LoginPayloadType, url: string) => {
    const params = {
      url: AuthAppsLogin,
      method: 'post',
      data: {
        strLoginId: values?.strLoginId,
        strPassword: values?.strPassword,
        intUrlId: 0,
        strUrl: url,
        intAccountId: 1,
      },
    };
    const res = await httpRequest(params, setIsLoading);
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message || '', type: 'error' });
      return;
    }

    if (res) {
      setIsLoading(false);
      const modifiedData = {
        ...res,
        isSupNLMORManagement:
          res?.isSupNlmorManagement || res?.isSupNLMORManagement,
        strUrl: url,
      };
      login(modifiedData);
    }
  };

  const login = async (res: any) => {
    if (res?.token) {
      axios.defaults.baseURL = `${res?.strUrl}/api`;
      axios.defaults.headers.common['Authorization'] = `Bearer ${res?.token}`;
      const modifiedData = {
        ...res,
        originalWorkplaceGroupId: res?.intWorkplaceGroupId,
        loginEmail: watch('email'),
        loginPassword: watch('password'),
      };

      trackOnOrOfFunc({
        isTrackOn: false,
        isDriverOnRunning: false,
        vehicleId: 0,
        driverId: 0,
        tripId: 0,
      });
      if (res?.strUrl !== arlURL) {
        //@ts-ignore
        userInfoSave(modifiedData);
        navigation.replace('EmpDrawer');
        toaster.show({ message: 'Login Successfully', type: 'success' });
      }
    } else if (res?.statusCode === 0 || res === 406) {
      toaster.show({ message: 'Invalid user. Try again!', type: 'error' });
      return;
    } else {
      reset();
      signOut();
    }
  };

  const signOut = async () => {
    clearAllStorage();
  };

  return (
    <ContainerNew edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.main}>
        <View>
          <Image source={IMAGES.AppLogo} style={styles.logo} />
          <Text style={styles.appName}>Daily Star</Text>
        </View>
        <View style={styles.paddingBtm10}>
          <CustomInputNew
            isAuth
            control={control}
            setValue={setValue}
            name="email"
            placeholder="Enter ID"
            rules={{ required: ' ' }}
            leftIcon={() => (
              <Icon name={'email-outline'} color={COLORS.iconColor} size={22} />
            )}
          />
        </View>
        <CustomInputNew
          isAuth
          control={control}
          setValue={setValue}
          name="password"
          placeholder="Password"
          rules={{ required: ' ' }}
          secureTextEntry={showPass ? true : false}
          leftIcon={() => (
            <Icon name={'lock-outline'} color={COLORS.iconColor} size={22} />
          )}
          rightIcon={() => (
            <TouchableOpacity onPress={() => setShowPass(!showPass)}>
              <Icon
                name={showPass ? 'eye-off' : 'eye'}
                color={COLORS.iconColor}
                size={22}
              />
            </TouchableOpacity>
          )}
        />
        <CustomButtonNew
          disabled={isLoading}
          btnText="LOG IN"
          isLoading={isLoading}
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnTxt}
        />
      </View>
    </ContainerNew>
  );
});

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  main: {
    backgroundColor: COLORS.white,
    marginTop: SIZES.height / 10,
  },
  logo: { alignSelf: 'center', height: 120, width: 87 },
  appName: {
    color: COLORS.transparentDark,
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 38,
    textAlign: 'center',
    paddingTop: 6,
    paddingBottom: 50,
  },

  btn: {
    marginTop: 40,
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    height: 44,
    paddingVertical: 0,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  btnTxt: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    alignSelf: 'center',
  },
  paddingBtm10: {
    paddingBottom: 10,
  },
});
