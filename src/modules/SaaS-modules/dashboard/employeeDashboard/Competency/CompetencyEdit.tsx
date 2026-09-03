import {useIsFocused, useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
const edges: Edge[] = ['right', 'bottom', 'left'];

const CompetencyEdit = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
    },
    [isFocused],
  );
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          title="Added Competency"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row]}>
          <Column colWidth="100%" isCard>
            {/* <CustomTextNew txtColor="#101828" txtSize={16} txtWeight={'400'} text="Add Behaviors" /> */}

            <Row>
              <Column colWidth="90%">
                <Row>
                  <CustomTextNew
                    txtStyle={styles.titleText}
                    text="tf jejwm jshjgg kfgejhwm fjefbj jseg jhrbg rbgh"
                  />
                </Row>
                <Row>
                  <CustomTextNew
                    txtStyle={styles.subTitleText}
                    text="Create in 23 September, 2023"
                  />
                  <CustomTextNew txtStyle={styles.chip} text="Functional" />
                </Row>
              </Column>
              <Column colWidth="10%" colStyle={styles.iconRight}>
                <MIcon name="edit" size={24} color={'#667085'} />
              </Column>
            </Row>
          </Column>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default CompetencyEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  iconRight: {
    marginTop: 12,
    marginLeft: 12,
  },
  titleText: {
    fontSize: 16,
    color: '#344054',
    fontWeight: '400',
    lineHeight: 24,
  },
  subTitleText: {
    fontSize: 12,
    color: '#344054',
    fontWeight: '400',
    lineHeight: 16,
    paddingTop: 4,
  },
  chip: {
    backgroundColor: '#EAECF0',
    borderRadius: 4,
    fontSize: 12,
    color: '#344054',
    fontWeight: '400',
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
});
