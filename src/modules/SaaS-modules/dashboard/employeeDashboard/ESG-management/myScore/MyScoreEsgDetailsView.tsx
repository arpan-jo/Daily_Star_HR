import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomTextNew from '../../../../../../common/components/CustomText';
import Row from '../../../../../../common/components/Row';
import {COLORS} from '../../../../../../common/constant/Themes';
import {KPI} from '../../../../../../interfaces/performance/kpi';

const MyScoreEsgDetailsView = ({item}: KPI) => {
  return (
    <>
      {item?.dynamicList?.length > 0 ? (
        <>
          {item?.dynamicList?.map((dynamicList, childIndex) => {
            return (
              <View key={childIndex}>
                <View>
                  {/*========= top section========  */}
                  <View>
                    <View style={[styles.leftLine, {paddingHorizontal: 15}]}>
                      <Row align="center">
                        <View style={{flex: 0.4}}>
                          <CustomTextNew
                            text={'Sustainability'}
                            txtColor={COLORS.graySubText}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                        <View style={{flex: 1, marginHorizontal: 10}}>
                          <CustomTextNew
                            text={item?.bsc || 'N/A'}
                            txtColor={COLORS.black}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                      </Row>
                      <View style={styles.singleLine} />
                      <View style={styles.leftLineStyle} />
                    </View>

                    <View style={[styles.leftLine, {paddingHorizontal: 15}]}>
                      <Row align="center">
                        <View style={{flex: 0.4}}>
                          <CustomTextNew
                            text={'Objective'}
                            txtColor={COLORS.graySubText}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                        <View style={{flex: 1, marginHorizontal: 10}}>
                          <CustomTextNew
                            text={dynamicList?.objective || ''}
                            txtColor={COLORS.black}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                      </Row>
                      <View style={styles.singleLine} />
                    </View>

                    <View style={[styles.leftLine, {paddingHorizontal: 15}]}>
                      <Row align="center">
                        <View style={{flex: 0.4}}>
                          <CustomTextNew
                            text={'ESG'}
                            txtColor={COLORS.graySubText}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                        <View style={{flex: 1, marginHorizontal: 10}}>
                          <CustomTextNew
                            text={dynamicList?.kpi || 'N/A'}
                            txtColor={COLORS.black}
                            txtSize={14}
                            lineHight={20}
                          />
                        </View>
                      </Row>
                      <View style={styles.singleLine} />
                    </View>
                  </View>

                  {/*=========== top section=========  */}

                  <View style={styles.cardBottomContainer}>
                    {/*=========== Left============== */}
                    <View style={styles.bottomLeftItemsContainer}>
                      <View style={styles.bottomLeftTxtContainer}>
                        <Text style={styles.cardBottomLeftTxt}>SRF</Text>
                        <View style={styles.progressWithIcon}>
                          <Text style={styles.cardBottomRightTxt}>
                            {dynamicList?.strFrequency || ''}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.bottomLeftTxtContainer}>
                        <Text style={styles.cardBottomLeftTxt}>Weight</Text>
                        <View style={styles.progressWithIcon}>
                          <Text style={styles.cardBottomRightTxt}>
                            {' '}
                            {dynamicList?.numWeight || ''}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.bottomLeftTxtContainer}>
                        <Text style={styles.cardBottomLeftTxt}>Benchmark</Text>
                        <View style={styles.progressWithIcon}>
                          <Text style={styles.cardBottomRightTxt}>
                            {dynamicList?.benchmark || 'N/A'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.bottomLeftTxtContainer}>
                        <Text style={styles.cardBottomLeftTxt}>Progress</Text>
                        <View style={styles.progressWithIcon}>
                          <Text style={styles.cardBottomRightTxt}>
                            {dynamicList?.progress || '0'}%
                          </Text>

                          <Icon
                            name={
                              dynamicList?.arrowText === 'up'
                                ? 'arrow-circle-up'
                                : 'arrow-circle-down'
                            }
                            color={
                              dynamicList?.arrowText === 'up'
                                ? COLORS.primary
                                : COLORS.red
                            }
                            size={16}
                            style={styles.smallIcon}
                          />
                        </View>
                      </View>
                      <View style={styles.bottomLeftTxtContainer}>
                        <Text style={styles.cardBottomLeftTxt}>Score</Text>
                        <View style={styles.progressWithIcon}>
                          <Text style={styles.cardBottomRightTxt}>
                            {dynamicList?.score || '0'}
                          </Text>
                        </View>
                      </View>
                    </View>
                    {/* Right */}
                    <View style={styles.bottomRightItemContainer}>
                      <View style={styles.bottomItemContainer}>
                        <View style={styles.maxWidth40}>
                          <Text style={styles.normalTxt}>Target</Text>
                          <Text style={styles.txtBold}>
                            {' '}
                            {dynamicList?.numTarget || '0'}
                          </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.maxWidth50}>
                          <Text style={styles.normalTxt}>Achievement</Text>
                          <Text style={styles.txtBold}>
                            {dynamicList?.numAchivement || '0'}
                          </Text>
                        </View>
                      </View>

                      <View style={{marginTop: 10}}>
                        <Row align="center">
                          <Ionicons
                            name="bicycle"
                            size={25}
                            color={COLORS.graySubText}
                            style={{marginRight: 5}}
                          />
                          <CustomTextNew
                            text={'Individual KPI'}
                            txtColor={COLORS.graySubText}
                            txtSize={15}
                            lineHight={20}
                          />
                        </Row>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.horizontalLine} />
              </View>
            );
          })}
        </>
      ) : null}
    </>
  );
};

export default MyScoreEsgDetailsView;

const styles = StyleSheet.create({
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
  cardBottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 12,
    marginTop: 10,
    marginHorizontal: 10,
  },
  bottomLeftItemsContainer: {
    flexDirection: 'column',
    backgroundColor: COLORS.iconGrayBackground,
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    width: '40%',
  },
  bottomLeftTxtContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.iconGrayBackground,
  },
  cardBottomLeftTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.textNewBold,
    width: '52%',
  },
  cardBottomRightTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.textNewBold,
  },
  bottomRightItemContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '64%',
  },
  bottomItemContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.iconGrayBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    width: '90%',
    paddingBottom: 14,
  },
  normalTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: COLORS.textNewBold,
  },
  txtBold: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    color: COLORS.textNewBold,
  },
  kpiBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  progressWithIcon: {
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  smallIcon: {
    borderRadius: 50,
    marginLeft: 3,
  },
  maxWidth40: {
    maxWidth: '40%',
  },
  maxWidth50: {
    maxWidth: '50%',
  },
  width60: {
    width: '60%',
  },
  noImgContainer: {
    alignSelf: 'center',
    paddingTop: 50,
  },
  divider: {
    borderLeftColor: COLORS.offDay,
    borderLeftWidth: 1,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  horizontalLine: {
    borderBottomWidth: 10,
    borderColor: 'rgba(234, 236, 240, 1)',
    marginVertical: 10,
  },
});
