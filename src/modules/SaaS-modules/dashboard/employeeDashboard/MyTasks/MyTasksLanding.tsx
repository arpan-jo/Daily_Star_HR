/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {MyTaskLandingApi} from '../../../../../common/api/api';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../../stores/rootStore';

const MyTasksLanding = () => {
  const [myTakLandingData, setMyTaskLandingData] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const {userInfo} = useRootStore();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const param = {
        employeeId: userInfo?.intEmployeeId,
        BusinessUnitId: userInfo?.intBusinessUnitId,
        pageNo: 1,
        pageSize: 6,
      };
      const params = {
        url: MyTaskLandingApi,
        data: param,
      };
      const response = await httpRequest(params, () => {});
      setMyTaskLandingData(response?.data);
    },
    [isFocused],
  );
  const getStatus = (str: string | null | undefined) => {
    let color;
    if (str === 'Schedule') {
      color = '#05A5CE';
    } else if (str === 'Delegate') {
      color = '#EAAA08';
    } else if (str === 'Do First') {
      color = COLORS.primary;
    } else {
      color = COLORS.lightGray2;
    }
    return color;
  };

  return (
    <View style={styles.container}>
      <View style={styles.underLine} />
      {myTakLandingData?.length > 0 ? (
        <>
          {myTakLandingData?.slice(0, 3)?.map((item: any, index: number) => (
            <View key={index}>
              <View style={styles.listContainer}>
                <Text style={styles.titleTxt} numberOfLines={1}>
                  {item?.strTaskName || 'N/A'}
                </Text>

                <Row align="center">
                  <CustomTextNew
                    text={item?.empRoleWiseSystem || 'N/A'}
                    lineHight={20}
                    txtColor={COLORS.graySubText}
                    txtSize={13}
                  />
                  <Entypo name="dot-single" size={15} color={COLORS.black} />
                  <CustomTextNew
                    text={item?.strVca || 'N/A'}
                    lineHight={20}
                    txtSize={13}
                    txtColor={COLORS.graySubText}
                  />
                </Row>
                <Row style={styles.mainRow}>
                  <View style={styles.subContainer}>
                    <CustomTextNew
                      text={item?.roleName || 'N/A'}
                      txtColor={COLORS.black}
                      txtSize={12}
                    />
                  </View>
                  <View
                    style={[
                      styles.subContainer,
                      {
                        backgroundColor: getStatus(item?.priority),
                      },
                    ]}>
                    <CustomTextNew
                      text={item?.priority || 'N/A'}
                      txtColor={COLORS.black}
                      txtSize={12}
                    />
                  </View>
                  <View style={[styles.iconContainer]}>
                    <Text style={{marginRight: 2}}>
                      <MIcon
                        name="sticky-note-2"
                        color={COLORS.primary}
                        size={13}
                      />
                    </Text>
                    <CustomTextNew
                      text={item?.strDifficulty || ''}
                      txtColor={COLORS.primary}
                      txtSize={12.5}
                    />
                  </View>
                  <View style={styles.iconContainer}>
                    <Text style={{marginRight: 2}}>
                      <MCIcon
                        name="clock-fast"
                        color={COLORS.graySubText}
                        size={15}
                      />
                    </Text>
                    <CustomTextNew
                      text={item?.strFrequency || ''}
                      txtColor={COLORS.graySubText}
                      txtSize={12.5}
                    />
                  </View>
                </Row>

                {/*=== new update code business task===  */}
                {/* <Row style={styles.mainRow}>
                  <View style={styles.subContent}>
                    <View style={{marginRight: 5}}>
                      <MCIcon
                        name="file-document-outline"
                        size={15}
                        color={COLORS.deepGray}
                      />
                    </View>
                    <View>
                      <CustomTextNew
                        text={'SOP'}
                        txtSize={12}
                        txtWeight={'400'}
                      />
                    </View>
                  </View>

                  <View style={styles.subContent}>
                    <View style={{marginRight: 5}}>
                      <MIcon
                        name="receipt-long"
                        size={15}
                        color={COLORS.deepGray}
                      />
                    </View>
                    <View>
                      <CustomTextNew
                        text={'Policy'}
                        txtSize={12}
                        txtWeight={'400'}
                      />
                    </View>
                  </View>
                  <View style={styles.subContent}>
                    <View style={{marginRight: 5}}>
                      <MCIcon
                        name="family-tree"
                        size={15}
                        color={COLORS.deepGray}
                      />
                    </View>
                    <View>
                      <CustomTextNew
                        text={'Workflow'}
                        txtSize={12}
                        txtWeight={'400'}
                      />
                    </View>
                  </View>
                </Row> */}
              </View>
              {myTakLandingData?.slice(0, 3)?.length - 1 !== index ? (
                <View style={styles.underLine} />
              ) : null}
            </View>
          ))}
        </>
      ) : (
        <></>
      )}

      {myTakLandingData?.length > 3 ? (
        <TouchableOpacity
          style={{marginTop: 8, alignSelf: 'center'}}
          onPress={() => navigation.navigate('MyTasksIndex')}>
          <Row align="center">
            <CustomTextNew
              text={'View all tasks'}
              lineHight={25}
              txtWeight={'500'}
              txtSize={14}
              txtColor={COLORS.graySubText}
            />
            <View style={{marginLeft: 5}}>
              <MIcon
                name="arrow-forward-ios"
                size={14}
                color={COLORS.graySubText}
              />
            </View>
          </Row>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default MyTasksLanding;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  underLine: {borderBottomWidth: 1, borderColor: COLORS.lightGray3},
  titleTxt: {
    fontSize: 14.5,
    color: COLORS.black,
    lineHeight: 20,
  },
  listContainer: {
    marginVertical: 10,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
  subContainer: {
    backgroundColor: COLORS.lightGray3,
    paddingHorizontal: 5,
    paddingVertical: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 5,
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center', marginRight: 5},
  subContent: {
    flexDirection: 'row',
    borderWidth: 0.8,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.lightGray2,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    marginRight: 5,
  },
});
