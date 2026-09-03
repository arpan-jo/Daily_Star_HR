/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  View} from 'react-native';

import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../../stores/rootStore';
import {getCompetencydetailsById} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import LoadingContainer from '../../../../../common/components/Loading';




const edges: Edge[] = ['right', 'bottom', 'left'];

const CompetencyIndex = () => {
  const [competencyDetails, setCompetencyDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [_topTabName, setTopTabName] = useState(0);
  const [reportCheckbox, setReportCheckbox] = useState<any>([
    {
      title: 'All Core Competencies',
      isCheck: false,
    },
    {
      title: 'Process Orientation',
      isCheck: false,
      id: 1,
    },
    {
      title: 'Quality Focused',
      isCheck: false,
      id: 2,
    },
    {
      title: 'Compliance',
      isCheck: false,
      id: 3,
    },
    {
      title: 'Cost Efficiency',
      isCheck: false,
      id: 4,
    },
    {
      title: 'Service Orientation',
      isCheck: false,
      id: 5,
    },
  ]);
  const [_reportTitle, setReportTitle] = useState(reportCheckbox[0]?.title);
  const refRBSheet: any = useRef();
  const [topBar, setTopBar] = useState([
    {
      title: 'CORE',
      isActive: true,
      nameForApi: 'core',
    },
    {
      title: 'LEADERSHIP',
      isActive: false,
      nameForApi: 'leadership',
    },
    {
      title: 'FUNCTIONAL',
      isActive: false,
      nameForApi: 'functional',
    },
  ]);

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const landingData: any = await getCompetencydetailsById(
        0,
        userInfo?.intBusinessUnitId,
        setIsLoading,
      );
      setCompetencyDetails(landingData);
    },
    [isFocused],
  );

  const _handleTopBar = (ind: any) => {
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
  const _updateCheckbox = (id: any) => {
    const updatedReports = [...reportCheckbox];
    const selectedData = updatedReports.find((item: any) => item?.id === id);
    setReportTitle(selectedData.title);
    const updatedData = updatedReports.map(item => {
      if (item.id === id) {
        return {
          ...item,
          isCheck: true,
        };
      } else {
        return {
          ...item,
          isCheck: false,
        };
      }
    });
    setReportCheckbox(updatedData);
    refRBSheet?.current?.close();
  };
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Competency" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
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
                  color: item?.isActive ? COLORS.white : COLORS.lightGray,
                },
              ]}
              text={item?.title}
            />
          </Column>
        ))}
      </Column> */}
      {/* <View style={styles.filterContainer}>
        <View style={styles.filterLeftContent}>
          <CustomTextNew
            text={'Filter with'}
            txtStyle={{fontSize: 15, color: COLORS.graySubText, lineHeight: 20}}
          />
        </View>
        <View style={styles.rightContent}>
          <TouchableOpacity onPress={() => refRBSheet?.current?.open()}>
            <View style={styles.dropdownContainer}>
              <CustomTextNew
                text={reportTitle}
                txtStyle={{
                  fontSize: 15,
                  color: COLORS.black,
                  lineHeight: 20,
                }}
              />
              <AntDesign name="caretdown" color={COLORS.black} size={10} />
            </View>
          </TouchableOpacity>
        </View>
      </View> */}
      <View
        style={{borderBottomWidth: 5, borderBottomColor: COLORS.lightGray3}}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {competencyDetails?.length > 0 ? (
          <>
            {competencyDetails?.map((details: any, index: number) => (
              <View key={index}>
                <View style={styles.mainContainer}>
                  <CustomTextNew
                    text={details?.objCompetency?.competencyName || 'N/A'}
                    txtSize={22}
                    lineHight={25}
                    txtWeight={'500'}
                    txtColor={'#0086c9'}
                  />
                  <View style={{marginVertical: 10}}>
                    <CustomTextNew
                      lineHight={20}
                      txtSize={15}
                      text={
                        details?.objCompetency?.competencyDefinition || 'N/A'
                      }
                    />
                  </View>
                  <CustomTextNew
                    text={'Behaviors'}
                    txtSize={19}
                    lineHight={25}
                    txtWeight={'500'}
                    txtColor={COLORS.black}
                  />
                  {details?.objDemo?.length > 0 ? (
                    details?.objDemo?.map((behavior: any, i: number) => (
                      <View key={i}>
                        <Row style={styles.rowStyle}>
                          <CustomTextNew
                            text={`${i + 1}. `}
                            txtStyle={styles.txtStyle}
                          />
                          <CustomTextNew
                            text={behavior?.demonstratedBehaviour || 'N/A'}
                            txtSize={14}
                            lineHight={20}
                            txtColor={COLORS.black}
                          />
                        </Row>
                      </View>
                    ))
                  ) : (
                    <></>
                  )}
                </View>
                <View style={styles.underLine} />
              </View>
            ))}
          </>
        ) : (
          <></>
        )}
        {/* //update code */}
        {/* <View style={{padding: 16}}>
          <CustomTextNew
            text={'Quality Focused'}
            txtSize={22}
            lineHight={25}
            txtWeight={'500'}
            txtColor={'#0086c9'}
          />
          <View style={{marginVertical: 10}}>
            <CustomTextNew
              lineHight={20}
              txtSize={15}
              text={
                'Inspire, emphasizes and focuses on process, system or procedures that bring long-term benefits.'
              }
            />
          </View>
          <CustomTextNew
            text={'Behaviors'}
            txtSize={19}
            lineHight={25}
            txtWeight={'500'}
            txtColor={COLORS.black}
          />

          <View style={{backgroundColor: 'rgba(50, 245, 39, 0.11)'}}>
            <Row style={{padding: 10}}>
              <CustomTextNew
                text={'Positive Behavioral'}
                txtSize={15}
                lineHight={20}
                txtColor={COLORS.primary}
              />
              <View style={{marginVertical: 10}}>
                <CustomTextNew
                  text={'1.Shows pro-activeness in workplace'}
                  txtSize={14}
                  lineHight={20}
                  txtColor={COLORS.black}
                />
                <CustomTextNew
                  text={'2.Does not wait to be asked'}
                  txtSize={14}
                  lineHight={20}
                  txtColor={COLORS.black}
                />
                <CustomTextNew
                  text={'3.Focus on standards to deliver outcome'}
                  txtSize={14}
                  lineHight={20}
                  txtColor={COLORS.black}
                />
              </View>
            </Row>
          </View>
        </View> */}
      </ScrollView>
      {/* <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 2}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            // borderTopRightRadius: 24,
            // borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}>
        <View style={styles.pHorizontal}>
          <View style={styles.sheetHeader}>
            <View>
              <CustomTextNew
                text={'Core Competency'}
                txtSize={20}
                lineHight={20}
                txtWeight={'500'}
              />
            </View>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.close()
              }>
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: COLORS.lightGray3,
            marginVertical: 10,
          }}
        />
        <View style={styles.pHorizontal}>
          <View style={{marginTop: 15}}>
            {reportCheckbox.length > 0 &&
              reportCheckbox.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    marginVertical: 10,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity onPress={() => updateCheckbox(item?.id)}>
                    <Icon
                      name={
                        item.isCheck
                          ? 'radio-button-checked'
                          : 'radio-button-off'
                      }
                      size={20}
                      color={item.isCheck ? COLORS.primary : COLORS.darkGray}
                    />
                  </TouchableOpacity>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <CustomTextNew text={item?.title} txtColor={COLORS.black} />
                  </View>
                </View>
              ))}
          </View>
        </View>
      </RBSheet> */}
    </ContainerNew>
  );
};

export default CompetencyIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  mainContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  txtStyle: {marginRight: 5, color: COLORS.black, fontSize: 14},
  rowStyle: {marginVertical: 5, flexDirection: 'row'},
  underLine: {
    borderBottomWidth: 8,
    borderBottomColor: COLORS.newGray,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
  },
  activeBox: {
    borderBottomColor: COLORS.white,
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderBottomWidth: 4,
  },
  inActiveBox: {
    borderBottomColor: COLORS.white,
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  headText: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '400',
  },
  filterContainer: {flexDirection: 'row', padding: 16},
  filterLeftContent: {
    flex: 0.3,

    justifyContent: 'center',
  },
  rightContent: {flex: 0.7, marginLeft: 20},
  dropdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  pHorizontal: {
    paddingHorizontal: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
