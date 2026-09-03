import {useIsFocused, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {arlURL} from '../../../App';
import {EmpDashboardDataType} from '../../interfaces/dashboard/employeeDashboard';
import {getMenuPermissionAPI} from '../../services/SaaS-modules/drawer/drawer';
import {useRootStore} from '../../stores/rootStore';
import {EmployeeDashboard} from '../api/api';
import {COLORS, SIZES} from '../constant/Themes';
import {httpRequest} from '../constant/httpRequest';
import useAsyncEffect from '../packages/useAsyncEffect/useAsyncEffect';
import {clearAllStorage} from '../services/clearStorage';
import ContainerNew from './Container';
import CustomHeader from './CustomHeader';

const wait = (timeout: any) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};
const edges: Edge[] = ['right', 'left'];
const EmptyScreen = () => {
  const navigation = useNavigation<any>();
  const {
    userInfo,
    menuTabSave,
    clearSupplier,
    clearEmpList,
    clearProductItem,
    clearGRNProductWithRef,
  } = useRootStore();
  const [_, setIsLoading] = useState<boolean>(false);
  const [__, setEmpDashboardData] = useState<EmpDashboardDataType>();
  const [refreshing, setRefreshing] = useState(false);
  axios.defaults.headers.common.Authorization = `Bearer ${userInfo?.token}`;
  axios.defaults.baseURL = `${userInfo?.strUrl}/api`;

  const isFocused = useIsFocused();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      clearSupplier();
      clearEmpList();
      clearProductItem();
      clearGRNProductWithRef();
      importantApiCall();
      setRefreshing(false);
    },
    [isFocused, refreshing],
  );

  const importantApiCall = async () => {
    if (
      !userInfo?.intAccountId ||
      !userInfo?.token ||
      !userInfo?.refreshToken
    ) {
      clearAllStorage();
      navigation.navigate('Login');
    }

    const api_params = {
      url: EmployeeDashboard,
      data: {
        EmployeeId: userInfo?.intEmployeeId,
        BusinessUnitId: userInfo?.intBusinessUnitId,
      },
    };
    const empDashData = await httpRequest(api_params, setIsLoading);

    if (empDashData === 401) {
      const payload = {
        accessToken: userInfo?.token,
        refreshToken: userInfo?.refreshToken,
      };
      const api_params = {
        url: '/Auth/GenerateRefreshToken',
        data: payload,
        method: 'post',
      };
      const refreshRes = await httpRequest(api_params, () => {});

      if (refreshRes?.accessToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${refreshRes?.accessToken}`;

        const _updtedLoginInfo = {
          ...userInfo,
          token: refreshRes?.accessToken,
          refreshToken: refreshRes?.refreshToken,
        };

        // userInfoSave(updtedLoginInfo);

        const api_paramss = {
          url: EmployeeDashboard,
          data: {
            EmployeeId: userInfo?.intEmployeeId,
            BusinessUnitId: userInfo?.intBusinessUnitId,
          },
        };
        const empDashDatas = await httpRequest(api_paramss, setIsLoading);
        setEmpDashboardData(empDashDatas);
      } else {
        clearAllStorage();
        navigation.navigate('Login');
      }
    } else if (empDashData === 406) {
      clearAllStorage();
      navigation.navigate('Login');
    }
  };

  const hanleRefresh = () => {
    setRefreshing(true);
    wait(500).then(async () => {
      importantApiCall();
      const menuRes = await getMenuPermissionAPI(userInfo?.intEmployeeId);

      if (menuRes?.length > 0) {
        menuTabSave({
          isLoad: true,
        });

        if (userInfo?.strUrl !== arlURL) {
          navigation.replace('EmpDrawer');
        } else {
          if (userInfo?.intUserTypeId === 1) {
            navigation.replace('ArlDrawer');
          } else if (userInfo?.intUserTypeId === 2) {
            navigation.replace('SupDrawer');
          }
        }
      }
      setRefreshing(false);
    });
  };
  return (
    <ContainerNew
      edges={edges}
      refreshing={refreshing}
      setRefresh={setRefreshing}
      // onRefresh={hanleRefresh}
      apiCall={hanleRefresh}
      style={styles.main}
      header={
        <CustomHeader
          personIconPress={async () => {
            clearAllStorage();
            navigation.navigate('Login');
          }}
          title="PeopleDesk"
        />
      }>
      <View style={styles.container}>
        <LottieView
          style={styles.lottieAnim}
          source={require('../../assets/Lottie/maintainance.json')}
          autoPlay
          loop
        />
        <Text style={styles.text}>Pull to refresh for a while</Text>
      </View>
    </ContainerNew>
  );
};

export default EmptyScreen;

const styles = StyleSheet.create({
  main: {
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.height / 5,
  },
  lottieAnim: {
    width: SIZES.width / 1.5,
    height: 250,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
});
