import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';


import FastImage from 'react-native-fast-image';
import CustomTextNew from '../../../../../../common/components/CustomText';
import Row from '../../../../../../common/components/Row';
import {IMAGES} from '../../../../../../common/constant/Index';
import {COLORS} from '../../../../../../common/constant/Themes';


import MyScoreEsgDetailsView from './MyScoreEsgDetailsView';
import MyScoreEsgShortView from './MyScoreEsgShortView';

const MyScoreIndex = ({landingData, calculationData}: any) => {
  const [isDetailsView, setIsDetailsView] = useState(false);
  const [categoryScores, setCategoryScores] = useState({});

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
  const calculateProgress = (achievement, target) => {
    if (target === 0) return 0;
    if (achievement === 0) return 0;
    return (achievement / target) * 100 || 0;
  };

  useEffect(() => {
    if (landingData?.infoList) {
      const scores = calculateCategoryScores(landingData?.infoList);
      setCategoryScores(scores);
    }
  }, [landingData]);

  return (
    <View>
      {/* ==========top section start========= */}
      <>
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
                txtSize={30}
                txtWeight={'500'}
              />
              <View style={{marginLeft: 10}}>
                <CustomTextNew
                  text={'ESG Score'}
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
          <Row align="center">
            <View style={styles.meterContainer}>
              <CustomTextNew
                text={`${calculateProgress(
                  calculationData?.dynamicList?.[0]?.numAchivement,

                  calculationData?.dynamicList?.[0]?.numTarget,
                )?.toFixed(2)}%`}
                txtSize={16}
                txtColor={COLORS.black}
                txtWeight={'500'}
              />
            </View>
            <View style={styles.inFoContent}>
              <View style={styles.detailsContent}>
                <CustomTextNew
                  txtSize={13}
                  txtWeight={'500'}
                  text={'Details View'}
                  lineHight={20}
                />
                <TouchableOpacity
                  style={[
                    styles.switchContainer,
                    {
                      backgroundColor: isDetailsView
                        ? COLORS.primary
                        : '#EAECF0',
                    },
                  ]}
                  onPress={() => setIsDetailsView(!isDetailsView)}>
                  <View
                    style={[
                      styles.circle,
                      {alignSelf: isDetailsView ? 'flex-end' : 'flex-start'},
                      {
                        backgroundColor: isDetailsView
                          ? COLORS.white
                          : COLORS.graySubText,
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Row>
          <CustomTextNew
            text={'Progress'}
            txtSize={13}
            txtColor={COLORS.graySubText}
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

          {/* <View style={{marginTop: 10}}>
            <Row align="center">
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
              <Text style={{marginHorizontal: 7, color: COLORS.graySubText}}>
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
            </Row>
          </View> */}
        </View>
        <View style={styles.horizontalLine} />
      </>
      {/*============= top section end==========  */}

      {/*================= section 2 ============= */}
      {isDetailsView ? (
        <>
          {landingData?.infoList?.map((item: any, index: number) => (
            <MyScoreEsgDetailsView key={index} item={item} />
          ))}
        </>
      ) : (
        <>
          {landingData?.infoList?.map((item: any, index: number) => (
            <MyScoreEsgShortView key={index} item={item} />
          ))}
        </>
      )}
      {/* ================section 2 end==========  */}
    </View>
  );
};

export default MyScoreIndex;

const styles = StyleSheet.create({
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
