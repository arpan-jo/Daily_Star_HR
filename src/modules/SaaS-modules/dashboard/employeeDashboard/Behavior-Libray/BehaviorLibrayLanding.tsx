import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {GetCoreValuesLandingPagination} from '../../../../../common/api/api';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../../stores/rootStore';

const BehaviorLibrayLanding = () => {
  const [coreValuesLanding, setCoreValuesLanding] = useState<any>([]);
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const params = {
        url: GetCoreValuesLandingPagination,
        data: {
          accountId: userInfo?.intAccountId,
          businessUnitId: 0,
          pageNo: 1,
          pageSize: 6,
          viewOrder: 'ASC',
        },
      };
      const response = await httpRequest(params, () => {});
      setCoreValuesLanding(response?.data);
    },
    [isFocused],
  );

  return (
    <View>
      {coreValuesLanding && coreValuesLanding?.length > 0 ? (
        coreValuesLanding?.slice(0, 5).map((item: any, i: number) => (
          <View key={i}>
            <TouchableOpacity
              style={styles.behaviorContent}
              onPress={() => {
                //@ts-ignore
                navigation.navigate('CoreValuesDetails', {
                  id: item?.intCoreValueId,
                });
              }}>
              <CustomTextNew
                text={`${i + 1}. ${item?.strCoreValueName}`}
                lineHight={20}
                txtColor={COLORS.black}
                txtSize={14}
              />
            </TouchableOpacity>
            {coreValuesLanding?.slice(0, 5)?.length - 1 !== i ? (
              <View style={styles.underLine} />
            ) : null}
          </View>
        ))
      ) : (
        <></>
      )}

      {coreValuesLanding?.length > 5 ? (
        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 10}}
          onPress={() => navigation.navigate('BehaviorLibrayIndex')}>
          <Row align="center">
            <CustomTextNew
              text={'View All Behavior in List'}
              lineHight={25}
              txtWeight={'500'}
              txtSize={14}
              txtColor={COLORS.darkGray}
            />
            <View style={{marginLeft: 5}}>
              <MIcon
                name="arrow-forward-ios"
                size={14}
                color={COLORS.darkGray}
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

export default BehaviorLibrayLanding;

const styles = StyleSheet.create({
  behaviorContent: {marginVertical: 8},
  underLine: {borderBottomWidth: 1, borderColor: COLORS.lightGray3},
  pHorizontal: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 5,
    paddingHorizontal: 16,
  },
  statement: {marginVertical: 16},
  statementTitle: {
    fontSize: 15,
    color: COLORS.darkBlue,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
  },
  statementContent: {
    fontStyle: 'italic',
    fontSize: 15,
    color: COLORS.graySubText,

    lineHeight: 20,
    marginBottom: 16,
  },
  positiveCard: {
    backgroundColor: '#F1FFF3',
    padding: 10,
    marginVertical: 8,
  },
  negativeCard: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#fef2f3',
  },
});
