import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {GetCompetencyLandingPagination} from '../../../../../common/api/api';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../../stores/rootStore';

const topBarData = [
  {
    title: 'Core',
    isActive: true,
    nameForApi: 'Core',
  },
  {
    title: 'Leadership',
    isActive: false,
    nameForApi: 'leadership',
  },
  {
    title: 'Functional',
    isActive: false,
    nameForApi: 'functional',
  },
];

const CompetencyLanding = () => {
  const [competencyData, setCompetencyData] = useState([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();

  const [_topBar, _setTopBar] = useState(topBarData);
  const [_, _setTopTabName] = useState(0);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const params = {
        url: GetCompetencyLandingPagination,
        data: {
          accountId: userInfo?.intAccountId,
          businessUnitId: 0,
          viewOrder: 'ASC',
          pageNo: 1,
          pageSize: 6,
        },
      };
      const response = await httpRequest(params, () => {});

      setCompetencyData(response?.data);
    },
    [isFocused],
  );

  return (
    <View style={{marginTop: 5}}>
      {/* new design  */}
      {/* <Column style={styles.head}>
        {topBar?.map((item: any, index: number) => (
          <Column
            key={index}
            colWidth="50%"
            align="center"
            style={item?.isActive ? styles.activeBox : styles.inActiveBox}
            isPressOn={false}
            onCardPress={() => handleTopBar(index)}>
            <CustomTextNew
              txtStyle={[
                styles.headText,
                {
                  color: item?.isActive ? COLORS.primary : COLORS.graySubText,
                  fontWeight: item?.isActive ? '500' : '400',
                },
              ]}
              text={item?.title}
            />
          </Column>
        ))}
      </Column> */}

      {competencyData && competencyData?.length > 0 ? (
        competencyData?.slice(0, 5)?.map((item: any, i) => (
          <View key={i}>
            <View style={styles.contentContainer}>
              <CustomTextNew
                text={` ${i + 1}.`}
                lineHight={20}
                txtColor={COLORS.black}
                txtSize={14}
              />
              <TouchableOpacity
                style={styles.behaviorContent}
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate('CopetencyDetails', {
                    id: item?.competencyId,
                  });
                }}>
                <CustomTextNew
                  text={` ${item.competencyName}`}
                  lineHight={20}
                  txtColor={COLORS.black}
                  txtSize={14}
                />
                {/* <View style={{ flexDirection: 'row' }}>
                {item.Date && (
                  <View>
                    <CustomTextNew
                      text={` ${item.Date}`}
                      lineHight={20}
                      txtColor={COLORS.graySubText}
                      txtSize={14}
                    />
                  </View>
                )}
                {item.subTitle && (
                  <View style={styles.subTextStyle}>
                    <CustomTextNew
                      text={` ${item.subTitle}`}
                      lineHight={20}
                      txtColor={COLORS.black}
                      txtSize={12}
                    />
                  </View>
                )}
              </View> */}
              </TouchableOpacity>
            </View>
            {competencyData?.slice(0, 5)?.length - 1 !== i ? (
              <View style={styles.underline} />
            ) : null}
          </View>
        ))
      ) : (
        <></>
      )}
      {competencyData?.length > 3 ? (
        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 10}}
          onPress={() => navigation.navigate('CompetencyIndex')}>
          <Row align="center">
            <CustomTextNew
              text={'View All Competency in List'}
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

export default CompetencyLanding;

const styles = StyleSheet.create({
  behaviorContent: {marginLeft: 5, flex: 1},

  contentContainer: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  underline: {borderBottomWidth: 1, borderBottomColor: COLORS.lightGray3},
  pHorizontal: {
    paddingHorizontal: 16,
  },
  sheetHeader: {flexDirection: 'row', justifyContent: 'space-between'},
  underLine: {borderBottomWidth: 1, borderColor: COLORS.lightGray3},
  txtStyle: {marginRight: 5, color: COLORS.black, fontSize: 14},
  rowStyle: {marginVertical: 5, flexDirection: 'row'},
  head: {
    flexDirection: 'row',

    borderBottomColor: COLORS.lightGray3,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  activeBox: {
    borderBottomColor: COLORS.primary,

    paddingVertical: 10,
    marginRight: 18,
    borderBottomWidth: 2,
  },
  inActiveBox: {
    borderBottomColor: COLORS.primary,

    paddingVertical: 10,
    marginRight: 18,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
});
