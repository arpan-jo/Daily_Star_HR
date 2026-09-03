import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../../stores/rootStore';
import {GetKpiChartReport} from '../../../../../common/api/api';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import LoadingContainer from '../../../../../common/components/Loading';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import {COLORS} from '../../../../../common/constant/Themes';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {KPIReport} from '../../../../../interfaces/performance/kpi';
import MyScoreEsgIndex from './myScore/MyScoreEsgIndex';
import OrgScoreEsg from './orgScore/OrgScoreEsg';

const edges: Edge[] = ['right', 'bottom', 'left'];

const EsgManagement = () => {
  const [calculationData, setCalculationData] = useState({});
  const [landingData, setLandingData] = useState<KPIReport>();
  const [isLoading, setIsLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [tabName, setTabName] = useState('myScore');
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getLandingKPIdata();
    },
    [isFocused],
  );
  const getLandingKPIdata = async () => {
    const api_params = {
      url: GetKpiChartReport,
      data: {
        PartName: 'TargetedKPI',
        BusinessUnit: userInfo?.intBusinessUnitId,
        YearId: 14,
        KpiForId: 1,
        KpiForReffId: userInfo?.intEmployeeId,
        accountId: userInfo?.intAccountId,
        from: 1,
        to: 12,
        pmTypeId: 5,
      },
    };
    const res = await httpRequest(api_params, setIsLoading);
    if (res?.infoList?.length > 0) {
      const modifyData = {
        ...res,
        infoList: res?.infoList?.slice(0, -1),
      };
      setLandingData(modifyData);
      const calculationData = res?.infoList[res?.infoList?.length - 1];
      setCalculationData(calculationData);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="ESG Score" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <View style={styles.headPart}>
        <View
          style={[
            styles.head,
            {
              borderBottomColor: isClicked ? COLORS.primary : COLORS.white,
            },
          ]}>
          <TouchableOpacity
            disabled={!isClicked ? true : false}
            onPress={() => {
              isClicked && setIsClicked(!isClicked);
              setTabName('myScore');
            }}>
            <Text
              style={[
                styles.headText,
                !isClicked
                  ? styles.isLocationClickedFalse
                  : styles.isLocationClickedTrue,
              ]}>
              MY SCORE
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            styles.head,
            {
              borderBottomColor: !isClicked ? COLORS.primary : COLORS.white,
            },
          ]}>
          <TouchableOpacity
            disabled={isClicked ? true : false}
            onPress={() => {
              !isClicked && setIsClicked(!isClicked);
              setTabName('orgScore');
            }}>
            <Text
              style={[
                styles.headText,
                isClicked
                  ? styles.isDeviceClickedFalse
                  : styles.isDeviceClickedTrue,
              ]}>
              ORG. SCORE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        {tabName === 'myScore' ? (
          <>
            {landingData && landingData?.infoList?.length > 0 ? (
              <MyScoreEsgIndex
                landingData={landingData}
                calculationData={calculationData}
              />
            ) : null}
          </>
        ) : (
          <OrgScoreEsg />
        )}
      </View>
    </ContainerNew>
  );
};

export default EsgManagement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  headPart: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: COLORS.primary,
    paddingTop: 25.78,
    paddingBottom: 0.7,
    elevation: 5,
  },
  head: {
    width: '48%',
    borderBottomWidth: 3,
  },
  headText: {
    paddingBottom: 15,
    paddingLeft: 20,
    fontWeight: '700',
    fontSize: 14,
    alignItems: 'center',
    lineHeight: 20,
    textAlign: 'center',
  },
  isLocationClickedTrue: {
    color: '#BFE7CA',
  },
  isLocationClickedFalse: {
    color: COLORS.white,
  },
  isDeviceClickedTrue: {
    color: '#BFE7CA',
  },
  isDeviceClickedFalse: {
    color: COLORS.white,
  },
  appContainer: {
    paddingHorizontal: 10,
  },
});
