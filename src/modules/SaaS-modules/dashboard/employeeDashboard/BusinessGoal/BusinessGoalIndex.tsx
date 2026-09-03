import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity, StyleSheet, View, Text} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import Feather from 'react-native-vector-icons/Feather';

const BusinessGoalIndex = () => {
  const edges: Edge[] = ['right', 'bottom', 'left'];
  const navigation = useNavigation();

  const data = {
    company_goals: [
      {
        goal_type: 'Revenue Growth:',
        strategies:
          'Increase annual revenue by  20% through sales expansion, new product/service offerings, or market penetration.',
      },
      {
        goal_type: 'Customer Satisfaction :',
        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
      {
        goal_type: 'Customer Satisfaction :',
        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
      {
        goal_type: 'Customer Satisfaction :',
        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
      {
        goal_type: 'Customer Satisfaction :',
        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
      {
        goal_type: 'Revenue Growth:',

        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
      {
        goal_type: 'Market Expansion:',

        strategies:
          'Improve customer satisfaction ratings 15% by enhancing customer support, product quality, and overall customer experience.',
      },
    ],
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Business Goal" onBackPress={navigation.goBack} />
      }>
      <View style={styles.containerTop}>
        <View style={styles.topTxt}>
          <CustomTextNew
            txtColor={COLORS.graySubText}
            txtSize={13}
            text={
              'You can leverage your available resources and capabilities to achieve your goal. It will reflected in your KPIs.'
            }
          />
        </View>

        {data.company_goals.map((goal, index) => (
          <TouchableOpacity key={index}>
            <Column>
              <Row rowStyle={styles.totalBoxs} key={index}>
                <Feather
                  name="target"
                  size={25}
                  color={COLORS.redish}
                  style={{marginRight: 10}}
                />
                <Row style={styles.goalContainer}>
                  <Text>
                    <Text style={styles.goalText}>{goal.goal_type}</Text>{' '}
                    <Text style={styles.goalDescription}>
                      {goal.strategies}
                    </Text>
                  </Text>
                </Row>
              </Row>
            </Column>
          </TouchableOpacity>
        ))}
      </View>
    </ContainerNew>
  );
};

export default BusinessGoalIndex;

const styles = StyleSheet.create({
  totalBoxs: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray3,
    flexDirection: 'row',
    paddingBottom: 10,
  },
  ICN: {
    color: COLORS.red,
    marginRight: 10,
    marginTop: 5,
  },

  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
  },
  goalDescription: {
    fontSize: 14,
    fontWeight: 'normal',
    color: COLORS.black,
  },
  goalContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  topTxt: {
    marginTop: 2,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray3,
    paddingBottom: 6,
  },
  targetIMG: {
    height: 25,
    width: 25,
    marginRight: 10,
    marginTop: 5,
  },
  containerTop: {padding: 10},
});
