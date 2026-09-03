import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import LoadingContainer from '../../../../../common/components/Loading';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getCompetencydetailsById} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

const _proficiencyLevel = [
  {
    level: 'Level 1',
    title: 'Beginner',
    content: [
      'Most Practices required development',
      "May demonstrate partial prficiency in some practice's proficiency in some practices",
    ],
  },
  {
    level: 'Level 2',
    title: 'Intermediate',
    content: [
      'Performs well in most practices, needs devlopment in one or two practices',
    ],
  },
  {
    level: 'Level 3',
    title: 'Expert',
    content: ['Very proficient; well developed in this competency'],
  },
  {
    level: 'Level 4',
    title: 'Mastery',
    content: [
      'Excels in all practices, full mastery of all aspects of this competency',
    ],
  },
];
const _getLevelColor = (status: string) => {
  if (status === 'Level 1') {
    return COLORS.sunColor;
  }
  if (status === 'Level 2') {
    return COLORS.sayn;
  }
  if (status === 'Level 3') {
    return COLORS.primary;
  }
  if (status === 'Level 4') {
    return COLORS.leave;
  }
  return COLORS.white; // You can specify a default color here if needed
};

const CopetencyDetails = () => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
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
      const itemDetails: any = await getCompetencydetailsById(
        id,
        userInfo?.intBusinessUnitId,
        setIsLoading,
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
      <LoadingContainer isLoading={isLoading} />
      <View style={styles.pHorizontal}>
        <View style={{marginTop: 10}}>
          <CustomTextNew
            text={itemInfo?.objCompetency?.competencyName || 'N/A'}
            txtSize={22}
            lineHight={25}
            txtWeight={'500'}
            txtColor={'#0086c9'}
          />
          <View style={{marginVertical: 10}}>
            <CustomTextNew
              lineHight={20}
              txtSize={15}
              text={itemInfo?.objCompetency?.competencyDefinition || 'N/A'}
            />
          </View>
          <CustomTextNew
            text={'Behaviors'}
            txtSize={19}
            lineHight={25}
            txtWeight={'500'}
            txtColor={COLORS.black}
          />
          <View>
            {itemInfo?.objDemo?.length > 0 ? (
              <>
                {itemInfo?.objDemo?.map((item: any, i: any) => (
                  <Row style={styles.rowStyle} key={i?.toString()}>
                    <CustomTextNew
                      text={`${i + 1}.`}
                      txtStyle={styles.txtStyle}
                    />
                    <CustomTextNew
                      text={item?.demonstratedBehaviour || 'N/A'}
                      txtSize={14}
                      lineHight={20}
                      txtColor={COLORS.black}
                    />
                  </Row>
                ))}
              </>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </ContainerNew>
  );
};

export default CopetencyDetails;

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
  txtStyle: {marginRight: 5, color: COLORS.black, fontSize: 14},
  rowStyle: {marginVertical: 5, flexDirection: 'row'},
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusContainer: {
    backgroundColor: COLORS.yellow,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginRight: 10,
  },
  verticalLine: {
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: COLORS.lightGray,
    marginLeft: 15,
    paddingVertical: 10,
  },
  textContainer: {
    flexDirection: 'row',
  },
  proficiencyTxt: {flex: 1, color: COLORS.black, lineHeight: 20},
});
