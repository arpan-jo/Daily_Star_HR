import {StyleSheet, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextNew from '../../../../../../common/components/CustomText';
import Row from '../../../../../../common/components/Row';
import {COLORS} from '../../../../../../common/constant/Themes';

const MyScoreEsgShortView = ({item}: any) => {
  return (
    <>
      {item?.dynamicList?.length > 0 ? (
        <>
          {item?.dynamicList?.map((dynamicList: any, childIndex: number) => (
            <View key={childIndex}>
              <View>
                <View>
                  <View style={[styles.leftLine, {paddingHorizontal: 15}]}>
                    <Row align="center">
                      <CustomTextNew
                        text={item?.bsc}
                        txtColor={COLORS.graySubText}
                        txtSize={14}
                        lineHight={20}
                      />
                      <View style={{flex: 1, marginHorizontal: 10}}>
                        <CustomTextNew
                          text={dynamicList?.kpi || 'N/A'}
                          txtColor={COLORS.black}
                          txtSize={14}
                          lineHight={20}
                        />
                      </View>
                      <Ionicons
                        name={'bicycle'}
                        size={25}
                        color={COLORS.graySubText}
                      />
                    </Row>
                    <View style={styles.singleLine} />
                    <View style={styles.leftLineStyle} />
                  </View>
                </View>

                <View style={styles.chipContainer}>
                  <View
                    style={{
                      borderRightWidth: 1,
                      borderColor: COLORS.lightGray,
                      paddingHorizontal: 8,
                    }}>
                    <CustomTextNew
                      text={'Target'}
                      txtSize={13}
                      txtColor={COLORS.graySubText}
                      lineHight={20}
                    />
                    <CustomTextNew
                      text={dynamicList?.numTarget || '0'}
                      txtSize={20}
                      txtColor={COLORS.black}
                      lineHight={30}
                      txtWeight={'500'}
                    />
                  </View>
                  <View style={{paddingHorizontal: 10}}>
                    <CustomTextNew
                      text={'Achievement'}
                      txtSize={13}
                      txtColor={COLORS.graySubText}
                      lineHight={20}
                    />
                    <CustomTextNew
                      text={dynamicList?.numAchivement || '0'}
                      txtSize={20}
                      txtColor={COLORS.black}
                      lineHight={30}
                      txtWeight={'500'}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.horizontalLine} />
            </View>
          ))}
        </>
      ) : null}
    </>
  );
};

export default MyScoreEsgShortView;

const styles = StyleSheet.create({
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
