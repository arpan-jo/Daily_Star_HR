import * as Clarity from '@microsoft/react-native-clarity';
import {
  arlURLL,
  commonURLL,
  crmURLL,
  erpPeopleDeskURLL,
  erpiBOSURLL,
  mainURLL,
  openMapp,
  rscURLL,
  secretKeyy,
  secureStorageKeyy,
} from '@env';
import notifee from '@notifee/react-native';
import {
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Linking, LogBox, Platform } from 'react-native';
// import BootSplash from 'react-native-bootsplash';
import { Provider as PaperProvider } from 'react-native-paper';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { withoutEncryptionApi } from './src/common/api/withoutEncrytApi';
import { ToastProvider } from './src/common/components/CustomToast';
import {
  makeDecryption,
  makeEncryption,
} from './src/common/constant/encryption';
import delay from './src/common/services/delay';
import useIsDarkTheme from './src/hooks/useIsDarkTheme';
import useLanguage from './src/hooks/useLanguage';
import RootStack from './src/navigations/RootStack';
import navigationServices from './src/services/SaaS-modules/notification/navigationServices';
import { setOpenedFromNotification } from './src/services/SaaS-modules/notification/notificationLaunch';
import { initTelemetry, logScreen } from './src/services/telemetry';
import { RootStoreProvider, useRootStore } from './src/stores/rootStore';
import DarkTheme from './src/themes/darkTheme';
import DefaultTheme from './src/themes/defaultTheme';

// Global error handler to prevent unhandled exceptions from crashing the app
const defaultErrorHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((error, isFatal) => {
  console.error('Uncaught Exception:', error, isFatal);
  // Don't call abort() or process.exit()
  // Let the default handler process this, but be aware
  if (defaultErrorHandler) {
    defaultErrorHandler(error, isFatal);
  }
});

// Runs after the handler above on purpose: Crashlytics wraps whatever global
// handler already exists and chains to it, so the console logging still happens
// and the crash is reported exactly once. Reporting only starts from the moment
// this call is made, hence keeping it at module scope rather than in an effect.
initTelemetry();

LogBox.ignoreLogs(['EventEmitter.removeListener', 'ViewPropTypes']);

// Clarity requires Android API 29+; skip initialization on older devices.
const clarityEnabled =
  Platform.OS === 'ios' ||
  (Platform.OS === 'android' && Platform.Version >= 29);

if (clarityEnabled) {
  Clarity.initialize('y8vbk4vl32', {
    logLevel: Clarity.LogLevel.None, // Note: Use "LogLevel.Verbose" value while testing to debug initialization issues.
  });
}

export const MainURL = mainURLL;
export const arlURL = arlURLL;
export const rscURL = rscURLL;
export const crmURL = crmURLL;
export const erpPeopleDeskURL = erpPeopleDeskURLL;
export const erpiBOSURL = erpiBOSURLL;
export const openMap = openMapp;
export const secretKey = secretKeyy;
export const secureStorageKey = secureStorageKeyy;
export const commonURL = commonURLL;

const linking: LinkingOptions<any> = {
  prefixes: [
    /* your linking prefixes */
    'PeopleDesk://',
    'https://www.arl.peopledesk.io',
  ],
  config: {
    /* configuration for matching screens with paths */
    initialRouteName: 'Loader',
    screens: {
      MicroApp: 'microapp/:appId',
      Loader: {
        path: 'loader/:delay?/:text?',
        parse: {
          delay: ms => Number(ms),
          text: text => decodeURIComponent(text),
        },
        stringify: {
          delay: ms => String(ms),
          text: text => encodeURIComponent(text),
        },
      },
    },
  },
};

// Encryption process
axios.interceptors.request.use(
  async config => {
    let url = config?.url;
    if (withoutEncryptionApi.some(element => url?.includes(element))) {
      return config;
    }
    let copyOfConfig = { ...config };
    const apiPrefixes = url?.includes('?');
    if (apiPrefixes) {
      let splitUrl = url?.split('?');
      const encryptedData = await makeEncryption(splitUrl?.[1]);
      url = `${splitUrl?.[0]}?${encryptedData}`;
      copyOfConfig = { ...config, url };
    }
    let payload = null;
    if (config?.data) {
      payload = await makeEncryption(JSON.stringify(config?.data));
    }

    copyOfConfig = {
      ...copyOfConfig,
      data: payload,
      headers: {
        ...copyOfConfig.headers,
        'Content-Type': 'application/json',
      },
    };

    return copyOfConfig;
  },
  async error => {
    // console.log('error', JSON.stringify(error, null, 2));
    let decryptedData = error?.response?.data
      ? await makeDecryption(error?.response?.data)
      : '';
    let newError = {
      response: { fullResponse: error, data: decryptedData || '' },
    };
    return Promise.reject(newError);
  },
);

axios.interceptors.response.use(
  async response => {
    if (
      withoutEncryptionApi.some(element =>
        response?.config?.url?.includes(element),
      )
    ) {
      return response;
    }
    let decryptedData = response?.data ? makeDecryption(response?.data) : '';
    return {
      status: response?.status,
      data: decryptedData,
    } as any;
  },

  async error => {
    if (error?.response?.status === 401) {
      return Promise.reject({ response: { data: 401 } });
    } else if (error?.response?.status === 406) {
      return Promise.reject({ response: { data: 406 } });
    } else {
      if (
        withoutEncryptionApi.some(element =>
          error?.config?.url?.includes(element),
        )
      ) {
        return Promise.reject({
          ...error?.response?.data,
          ...error?.response?.message,
          status: error?.response?.status,
          fullResponse: error?.response,
        });
      } else {
        let decryptedError = error?.response?.data
          ? makeDecryption(error?.response?.data)
          : '';
        let modifiedError = {
          response: {
            data: decryptedError,
            status: error?.response?.status,
          },
        };
        return Promise.reject(modifiedError);
      }
    }
  },
);

const Main = observer(() => {
  const { hydrate } = useRootStore();
  const [isDark] = useIsDarkTheme();
  const language = useLanguage();

  const navigationRef =
    useRef<NavigationContainerRef<ReactNavigation.RootParamList> | null>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  const theme = useMemo(() => {
    if (isDark) {
      return DarkTheme;
    }
    return DefaultTheme;
  }, [isDark]);

  const setNavigationRef = useCallback(
    (ref: NavigationContainerRef<ReactNavigation.RootParamList> | null) => {
      navigationRef.current = ref;

      navigationServices.setTopLevelNavigator(ref);
    },
    [],
  );

  // Clarity and Firebase Analytics both name every page after the native
  // activity/view controller unless we tell them otherwise, so feed them the
  // React Navigation route instead. Clarity starts a new page on each change,
  // hence the guard against repeat names — which also stops Analytics from
  // counting a screen twice when navigation state changes without a route
  // change (a param update, a drawer opening).
  const syncScreenName = useCallback(() => {
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
    if (!currentRouteName || currentRouteName === routeNameRef.current) {
      return;
    }
    routeNameRef.current = currentRouteName;

    if (clarityEnabled) {
      Clarity.setCurrentScreenName(currentRouteName).catch(console.error);
    }
    logScreen(currentRouteName);
  }, []);

  const onReady = useCallback(async () => {
    syncScreenName();
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        await delay(200);
        await hydrate();
        // await BootSplash.hide({fade: true});
      }
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
    }
  }, [hydrate, syncScreenName]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <ToastProvider>
          <NavigationContainer
            linking={linking}
            theme={theme}
            ref={setNavigationRef}
            onReady={onReady}
            onStateChange={syncScreenName}
          >
            {/* Keyed on the language: switching remounts the tree so every
                render-time t() returns the new strings without a relaunch. */}
            <RootStack key={language} />
          </NavigationContainer>
        </ToastProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
});

const App = () => {
  async function bootstrap() {
    const initialNotification: any = await notifee.getInitialNotification();
    if (initialNotification) {
      const data = initialNotification?.notification?.data?.data?.data;

      if (initialNotification?.pressAction) {
        const screenMappings: any = {
          Default: 'NotificationIndex',
          Leave: 'LeaveNewApprovalDetails',
          Movement: 'MovementNewApprovalDetails',
        };
        setOpenedFromNotification(true);

        if (data?.routeName && screenMappings[data?.routeName?.trim()]) {
          setTimeout(() => {
            navigationServices.navigate(
              screenMappings[data?.routeName?.trim()],
              {
                leaveDetails: data,
              },
            );
          }, 3000);
        }
      }
    }
  }

  useEffect(() => {
    if (Platform.OS === 'android') {
      bootstrap().catch(console.error);
    }
  }, []);

  return (
    <RootStoreProvider>
      <Main />
    </RootStoreProvider>
  );
};

export default App;
