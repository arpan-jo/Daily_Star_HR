import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import Column from '../../../../../common/components/Column';
import Row from '../../../../../common/components/Row';
import CustomTextNew from '../../../../../common/components/CustomText';
import {COLORS} from '../../../../../common/constant/Themes';
import {getBehaviouralDetails} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const BehaviorLibrayIndex = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [behaviourList, setBehaviourList] = useState<any>([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here

      const landingData: any = await getBehaviouralDetails(
        0,
        userInfo?.intBusinessUnitId,
      );
      setBehaviourList(landingData);
    },

    [isFocused],
  );
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          title="Behavior Library"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}
      scrollEnabled>
      {/* <CustomTextNew text="Hello component" /> */}
      <ScrollView>
        {behaviourList?.length > 0 ? (
          <>
            {behaviourList.map((item: any, index: number) => (
              <Column
                key={index}
                colStyle={styles.mainBodyCard}
                colWidth="100%">
                <Row>
                  <CustomTextNew
                    text={`${index + 1}. `}
                    txtStyle={styles.headingTitleNumber}
                  />
                  <CustomTextNew
                    text={item?.objHeader?.coreValueName}
                    txtStyle={styles.headingTitleText}
                  />
                </Row>
                <Row>
                  <CustomTextNew
                    txtStyle={styles.details}
                    text={item?.objHeader?.coreValueDefinition || ''}
                  />
                </Row>

                <Column style={styles.statement}>
                  <Text>
                    <Text style={styles.statementTitle}>Statement - </Text>
                    <Text style={styles.statementContent}>
                      {' '}
                      {item?.objHeader?.statement || ''}
                    </Text>
                  </Text>
                </Column>

                <Row>
                  <CustomTextNew
                    txtColor="#000"
                    txtSize={16}
                    txtWeight="500"
                    text="Indicator"
                  />
                </Row>
                <Column colStyle={styles.positiveCard} colWidth="100%">
                  <Column>
                    <CustomTextNew
                      txtStyle={styles.positiveText}
                      text="Positive Behavioral Indicators"
                    />
                  </Column>
                  {item?.objListRow?.length > 0 ? (
                    <>
                      {item?.objListRow?.map((itemRow: any, indx: number) => {
                        if (itemRow?.isPositive) {
                          return (
                            <Column key={indx}>
                              <CustomTextNew
                                txtStyle={styles.ulList}
                                text={`${indx + 1}. ${
                                  itemRow?.demonstratedBehaviour
                                }`}
                              />
                            </Column>
                          );
                        }
                      })}
                    </>
                  ) : null}
                </Column>
                <Column colStyle={styles.negativeCard} colWidth="100%">
                  <Column>
                    <CustomTextNew
                      txtStyle={styles.negativeText}
                      text="Negative Behavioral Indicators"
                    />
                  </Column>
                  {item?.objListRowNeg?.length > 0 ? (
                    <>
                      {item?.objListRowNeg?.map(
                        (itemRow: any, index2: number) => {
                          if (!itemRow?.isPositive) {
                            return (
                              <Column key={index2}>
                                <CustomTextNew
                                  txtStyle={styles.ulList}
                                  text={`${index + 1}. ${
                                    itemRow?.demonstratedBehaviour
                                  }`}
                                />
                              </Column>
                            );
                          }
                        },
                      )}
                    </>
                  ) : null}
                </Column>
              </Column>
            ))}
          </>
        ) : null}
      </ScrollView>
    </ContainerNew>
  );
};

export default BehaviorLibrayIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mainBodyCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headingTitleNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101828',
    marginBottom: 16,
  },
  headingTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#101828',
    marginBottom: 16,
    marginLeft: 8,
  },
  details: {
    fontSize: 16,
    color: '#101828',
    fontWeight: '400',
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

  statementTitle: {
    fontSize: 15,
    color: COLORS.darkBlue,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  statementContent: {
    fontStyle: 'italic',
    fontSize: 15,
    color: COLORS.graySubText,

    lineHeight: 20,
    marginBottom: 16,
  },
  positiveText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  negativeText: {
    fontSize: 16,
    color: '#B42318',
    fontWeight: '500',
    lineHeight: 20,
    marginBottom: 8,
  },
  ulList: {
    fontSize: 14,
    color: '#344054',
    fontWeight: '400',
    lineHeight: 16,
    marginBottom: 8,
  },
  statement: {marginBottom: 16},
});
