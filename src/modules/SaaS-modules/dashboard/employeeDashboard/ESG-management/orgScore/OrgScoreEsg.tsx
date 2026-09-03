import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';

import LinearGradient from 'react-native-linear-gradient';


import FastImage from 'react-native-fast-image';
import {
  GetOrganizationalUnitUserPermission,
  GetKpiChartReport} from '../../../../../../common/api/api';
import CustomDropDownNew from '../../../../../../common/components/CustomDropDown';
import CustomTextNew from '../../../../../../common/components/CustomText';
import LoadingContainer from '../../../../../../common/components/Loading';
import Row from '../../../../../../common/components/Row';
import {httpRequest} from '../../../../../../common/constant/httpRequest';
import {IMAGES} from '../../../../../../common/constant/Index';
import {COLORS} from '../../../../../../common/constant/Themes';
import useAsyncEffect from '../../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../../../stores/rootStore';

const OrgScoreEsg = () => {
  const [landingData, setLandingData] = useState({});
  const [calculationData, setCalculationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [categoryScores, setCategoryScores] = useState({});
  const {control, handleSubmit: _handleSubmit, setValue, getValues: _getValues, watch, reset: _reset} =
    useForm<any>();
  const {userInfo} = useRootStore();

  const getLandingKPIdata = async () => {
    const api_params = {
      url: GetKpiChartReport,
      data: {
        PartName: 'TargetedKPI',
        BusinessUnit: +watch('businessUnit')?.value,
        YearId: 14,
        KpiForId: 3,
        KpiForReffId: +watch('businessUnit')?.value,
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
  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    const api_params = {
      url: GetOrganizationalUnitUserPermission,
      data: {ERPUserId: userInfo?.intErpUserId},
    };
    const res = await httpRequest(api_params, () => {});
    if (res?.length > 0) {
      const modifiData = res?.map(item => {
        return {
          ...item,
          label: item?.organizationUnitReffName,
          value: item?.organizationUnitReffId,
        };
      });
      setSbuDDL(modifiData);
    }
  }, []);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (+watch('businessUnit')?.value) {
        getLandingKPIdata();
      }
    },
    [+watch('businessUnit')?.value],
  );
  const calculateCategoryScores = (infoList: any) => {
    const scores = {};
    infoList?.forEach((category: any) => {
      if (!scores[category?.bsc]) {
        scores[category?.bsc] = 0;
      }
      category?.dynamicList?.forEach((kpi: any) => {
        scores[category?.bsc] += kpi?.score;
      });
    });
    return scores || {};
  };
  useEffect(() => {
    if (landingData?.infoList) {
      const scores = calculateCategoryScores(landingData?.infoList);
      setCategoryScores(scores);
    }
  }, [landingData]);

  const calculateProgress = (achievement, target) => {
    if (target === 0) return 0;
    if (achievement === 0) return 0;
    return (achievement / target) * 100 || 0;
  };
  return (
    <View>
      <LoadingContainer isLoading={isLoading} />
      <View style={styles.appContainer}>
        <CustomDropDownNew
          control={control}
          data={sbuDDL}
          name="businessUnit"
          label="AKIJ Resource All Business Units"
          onChange={(options: any) => {
            setValue('businessUnit', options);
            setLandingData([]);
            setCalculationData({});
          }}
          rules={{required: true}}
        />
      </View>

      {landingData?.infoList?.length > 0 ? (
        <View>
          {/* <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginHorizontal: 10,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialIcons
                  name="share"
                  size={18}
                  color={COLORS.graySubText}
                  style={{marginRight: 7}}
                />
                <CustomTextNew
                  text={'Share'}
                  txtSize={13}
                  txtColor={COLORS.graySubText}
                  lineHight={20}
                />
                <Text style={{color: COLORS.graySubText, marginHorizontal: 7}}>
                  |
                </Text>
                <MaterialIcons
                  name="chat"
                  size={18}
                  color={COLORS.graySubText}
                  style={{marginRight: 7}}
                />
                <CustomTextNew
                  text={'Opinion'}
                  txtSize={13}
                  txtColor={COLORS.graySubText}
                  lineHight={20}
                />
              </View>
              <View>
                
              </View>
            </View>
          </View> */}
          <View style={styles.topContent}>
            <View style={styles.meterContainer}>
              <FastImage
                source={IMAGES.kpi}
                style={{height: 100, width: 120}}
                resizeMode="contain"
              />
              <Row align="center">
                <CustomTextNew
                  text={`${calculationData?.dynamicList?.[0]?.score?.toFixed(2) || 0}`}
                  txtSize={16}
                  txtColor={COLORS.black}
                  txtWeight={'500'}
                />
                <View style={{marginLeft: 10}}>
                  <CustomTextNew
                    text={'KPI Score'}
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                  />
                </View>
              </Row>
            </View>
            <View style={styles.inFoContent}>
              {Object?.keys(categoryScores)?.map((category, index) => (
                <View key={index} style={styles.infoTxtContainer}>
                  <CustomTextNew
                    text={category || 'N/A'}
                    txtColor={COLORS.black}
                    txtSize={13}
                    lineHight={20}
                    txtWeight={500}
                  />
                  <CustomTextNew
                    text={`${categoryScores[category]?.toFixed(2)}`}
                    txtColor={COLORS.black}
                    txtSize={13}
                    lineHight={20}
                    txtWeight={500}
                  />
                </View>
              ))}
            </View>
          </View>
          <View style={styles.bottomContent}>
            <CustomTextNew
              text={`${calculateProgress(
                calculationData?.dynamicList?.[0]?.numAchivement,

                calculationData?.dynamicList?.[0]?.numTarget,
              )?.toFixed(2)}%`}
              txtSize={18}
              txtColor={COLORS.black}
              txtWeight={'500'}
              lineHight={20}
            />
            <CustomTextNew
              text={'Progress'}
              txtSize={14}
              txtColor={COLORS.graySubText}
              // txtWeight={'500'}
              lineHight={20}
            />
            <View
              style={[
                styles.progressBar,
                {backgroundColor: 'rgba(234, 236, 240, 1)', marginTop: 10},
              ]}>
              <LinearGradient
                colors={[
                  'rgba(232, 115, 115, 1)',
                  'rgba(255, 214, 0, 1)',
                  'rgba(0, 179, 39, 1)',
                ]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.progressBar,

                  {
                    width: `${calculateProgress(calculationData?.dynamicList?.[0]?.numAchivement, calculationData?.dynamicList?.[0]?.numTarget)}%`,
                  },
                ]}></LinearGradient>
            </View>
          </View>
          <View style={styles.horizontalLine} />
        </View>
      ) : null}
    </View>
  );
};

export default OrgScoreEsg;

const styles = StyleSheet.create({
  appContainer: {
    padding: 10,
  },
  topContent: {
    flexDirection: 'row',
    // backgroundColor: 'coral',
    alignItems: 'center',
    padding: 10,
  },
  meterContainer: {
    flex: 1,
    // alignItems: 'center',
  },
  inFoContent: {
    flex: 1,
  },
  bottomContent: {
    padding: 10,
    paddingVertical: 5,
  },
  infoTxtContainer: {
    backgroundColor: '#F2F4F7',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  switchContainer: {
    borderWidth: 1,
    borderColor: COLORS.softGray,
    backgroundColor: '#EAECF0',
    padding: 2.5,
    borderRadius: 20,
    width: 50,
    // marginTop: 10,
  },
  circle: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.graySubText,
    borderRadius: 100,
  },
  detailsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  progressBar: {
    height: 15,
    // backgroundColor: COLORS.primary,
    // marginTop: 10,
  },
  horizontalLine: {
    borderBottomWidth: 10,
    borderColor: 'rgba(234, 236, 240, 1)',
    marginVertical: 10,
  },
  leftLine: {
    paddingHorizontal: 10,
  },
  singleLine: {
    borderBottomWidth: 1,
    marginVertical: 5,
    borderColor: 'rgba(234, 236, 240, 1)',
  },
  leftLineStyle: {
    borderLeftWidth: 8,
    borderColor: 'rgba(50, 213, 131, 1)',
    height: 40,
    position: 'absolute',
    top: -10,
  },
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(234, 236, 240, 1)',
    padding: 10,
    borderRadius: 20,
    width: 200,
    marginLeft: 10,
    marginTop: 10,
  },
});
