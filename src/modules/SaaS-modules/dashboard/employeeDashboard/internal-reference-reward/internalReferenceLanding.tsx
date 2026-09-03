/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {IMAGES} from '../../../../../common/constant/Index';
import {COLORS} from '../../../../../common/constant/Themes';
import {date_formater} from '../../../../../common/services/dateFormater';
import {cRMLeadLandingForPeopledesk} from '../../../../../services/SaaS-modules/dashboard/internalReferance';
import {useRootStore} from '../../../../../stores/rootStore';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const topBarItem = [
  {
    title: 'All',
    isActive: true,
    nameForApi: 'All',
  },
  {
    title: 'Processing',
    isActive: false,
    nameForApi: 'Processing',
  },
  {
    title: 'Reward',
    isActive: false,
    nameForApi: 'Reward',
  },
  {
    title: 'Dismissed',
    isActive: false,
    nameForApi: 'Dismissed',
  },
];

const InternalReferenceLanding = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [topTabName, setTopTabName] = useState(0);
  const [topBar, setTopBar] = useState(topBarItem);
  const [, setLoading] = useState<boolean>(false);
  const [landingData, setLandingData] = useState([]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await cRMLeadLandingForPeopledesk(
        'All',
        userInfo?.intEmployeeId,
        setLoading,
      );
      setLandingData(res);
    },
    [isFocused],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const status = topBar[topTabName]?.nameForApi;
      const res = await cRMLeadLandingForPeopledesk(
        status,
        userInfo?.intEmployeeId,
        setLoading,
      );
      setLandingData(res);
    },
    [topTabName, topBar],
  );

  const getStatus = (
    type: string | null | undefined = '',
    approvedStatus: string | null | undefined = '',
  ) => {
    if (approvedStatus === 'Rewarded') {
      return type === 'text' ? 'Rewarded' : '#039855';
    }
    if (approvedStatus === 'Processing') {
      return type === 'text' ? 'Processing' : '#EAAA08';
    }
    if (approvedStatus === 'Dismissed') {
      return type === 'text' ? 'Dismissed' : '#D92D20';
    }
  };
  const handleTopBar = (ind: any) => {
    const mod = [...topBar];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });
    setTopBar(temp);
    setTopTabName(ind);
  };

  return (
    <ContainerNew
      edges={edges}
      isScrollView={false}
      isFloatBottomButton={true}
      singleFloatBtmBtnPress={() => navigation.navigate('MakeCustomerIR')}
      header={
        <CustomHeader
          title="Internal Reference"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      {/* heading tab */}
      <Column style={styles.head}>
        {topBar?.map((item: any, index: number) => (
          <Column
            key={index}
            style={[
              styles.box,
              {
                backgroundColor: item?.isActive
                  ? COLORS.lightPrimary2
                  : COLORS.white,
                borderColor: item?.isActive
                  ? COLORS.primary
                  : COLORS.textNewColor,
              },
            ]}
            isPressOn={false}
            onCardPress={() => handleTopBar(index)}>
            <CustomTextNew txtStyle={styles.headText} text={item?.title} />
          </Column>
        ))}
      </Column>

      {landingData && landingData?.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Row direction="column" rowStyle={styles.padding}>
            <>
              {landingData?.map((item: any, index: any) => (
                <Row
                  key={index}
                  isCard
                  isPressOn={true}
                  direction="column"
                  justify="space-between">
                  <Row justify="space-between">
                    <Column colWidth="100%">
                      <CustomTextNew
                        txtColor={COLORS.graySubText}
                        text={`Created at ${date_formater(item?.createdDate)}`}
                      />
                    </Column>
                  </Row>
                  <Row justify="flex-start">
                    <Column>
                      <CustomTextNew
                        txtStyle={styles.cardTitle}
                        text={item?.leadName}
                      />
                      <CustomTextNew
                        txtStyle={styles.cardTitle}
                        text={item?.industryName}
                      />
                      <CustomTextNew
                        text={item?.address}
                        txtColor="#667085"
                        txtSize={12}
                      />
                    </Column>
                  </Row>
                  <Column style={{position: 'absolute', right: 10, top: 10}}>
                    <View style={{width: 80, alignItems: 'center'}}>
                      {item?.status === 'Rewarded' && (
                        <Column style={styles.imagePart}>
                          <FastImage
                            source={IMAGES.GiftBox}
                            style={styles.gImage}
                          />
                        </Column>
                      )}
                      <View
                        style={{
                          backgroundColor: getStatus('color', item?.status),
                          borderRadius: 10,
                          width: 70,
                          alignItems: 'center',
                        }}>
                        <CustomTextNew
                          text={item?.status}
                          txtSize={11}
                          txtColor={COLORS.white}
                        />
                      </View>
                    </View>
                  </Column>
                </Row>
              ))}
            </>
          </Row>

          <Column style={styles.emptyCol} />
        </ScrollView>
      ) : (
        <Column style={styles.noData}>
          <View>
            <CustomTextNew
              text={'No internal reference has been created yet.'}
              txtSize={14}
              txtColor={COLORS.graySubText}
              lineHight={20}
            />
            <CustomTextNew
              text={'Click the Create button to create one now. '}
              txtSize={14}
              txtColor={COLORS.graySubText}
              lineHight={20}
            />
            <TouchableOpacity
              style={{alignSelf: 'center', marginVertical: 10}}
              onPress={() => navigation.navigate('MakeCustomerIR')}>
              <CustomTextNew
                text={'+ Create IR'}
                txtSize={14}
                txtColor={COLORS.primary}
                lineHight={20}
              />
            </TouchableOpacity>
          </View>
        </Column>
      )}
    </ContainerNew>
  );
};

export default InternalReferenceLanding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  // heading tab
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingRight: 8,
    paddingLeft: 16,
  },
  box: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    marginRight: 8,
  },
  headText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.textNewColor,
  },
  // tab body
  padding: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  cardTitle: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingVertical: 2,
  },
  emptyCol: {
    height: 200,
  },
  imagePart: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  gImage: {
    width: 35,
    height: 35,
  },
  noData: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
  },
});
