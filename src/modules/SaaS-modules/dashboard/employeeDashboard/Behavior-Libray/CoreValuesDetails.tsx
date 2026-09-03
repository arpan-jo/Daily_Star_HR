import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {getCoreValuesById} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const CoreValuesDetails = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [itemInfo, setItemInfo] = useState<any>({});

  const route = useRoute();
  //@ts-ignore
  const id = route?.params?.id;
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const itemDetails: any = await getCoreValuesById(
        id,
        userInfo?.intBusinessUnitId,
      );

      if (itemDetails?.length > 0) {
        setItemInfo(itemDetails[0]);
      }
    },
    [isFocused, id],
  );
  return (
    <ContainerNew
      edges={edges}
      header={<CustomHeader title="Details" onBackPress={navigation.goBack} />}
      style={styles.container}>
      <View>
        <View style={styles.pHorizontal}>
          <CustomTextNew
            txtSize={20}
            txtWeight={'500'}
            lineHight={25}
            txtColor={COLORS.black}
            text={itemInfo?.objHeader?.coreValueName || 'N/A'}
          />
          <View style={{marginVertical: 5}} />
          <CustomTextNew
            txtSize={14}
            lineHight={20}
            txtColor={COLORS.black}
            text={itemInfo?.objHeader?.coreValueDefinition || 'N/A'}
          />

          <Column style={styles.statement}>
            <Text>
              <Text style={styles.statementTitle}>Statement -</Text>
              <Text style={styles.statementContent}>
                {' '}
                {itemInfo?.objHeader?.statement || 'N/A'}
              </Text>
            </Text>
          </Column>
          <Row>
            <CustomTextNew
              txtColor="#000"
              txtSize={15}
              txtWeight="500"
              text="Indicator"
            />
          </Row>

          <Column style={styles.positiveCard}>
            <CustomTextNew
              text={'Positive Behavioral Indicators'}
              lineHight={20}
              txtSize={13}
              txtWeight={'500'}
              txtColor={COLORS.primary}
            />
            {itemInfo?.objListRow?.length > 0 ? (
              itemInfo?.objListRow?.map((item: any, i: number) => (
                <View key={i}>
                  <CustomTextNew
                    text={`${i + 1}. ${item?.demonstratedBehaviour}`}
                    lineHight={20}
                    txtSize={12.5}
                    txtColor={COLORS.black}
                  />
                </View>
              ))
            ) : (
              <></>
            )}
          </Column>

          <Column style={styles.negativeCard}>
            <CustomTextNew
              text={'Negative Behavioral Indicators'}
              lineHight={20}
              txtSize={12.5}
              txtWeight={'500'}
              txtColor={COLORS.red}
            />
            {itemInfo?.objListRowNeg?.length > 0 ? (
              itemInfo?.objListRowNeg?.map((item: any, i: number) => (
                <View key={i}>
                  <CustomTextNew
                    text={`${i + 1}. ${item?.demonstratedBehaviour}`}
                    lineHight={20}
                    txtSize={13}
                    txtColor={COLORS.black}
                  />
                </View>
              ))
            ) : (
              <></>
            )}
          </Column>
        </View>
      </View>
    </ContainerNew>
  );
};

export default CoreValuesDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
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
