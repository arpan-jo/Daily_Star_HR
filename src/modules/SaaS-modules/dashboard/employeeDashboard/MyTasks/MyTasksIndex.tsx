/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import Column from '../../../../../common/components/Column';
import ContainerNew from '../../../../../common/components/Container';
import CustomBottomSheetNew from '../../../../../common/components/CustomBottomSheet';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS, SIZES} from '../../../../../common/constant/Themes';
import {useRootStore} from '../../../../../stores/rootStore';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {MyTaskLandingApi} from '../../../../../common/api/api';

import LoadingContainer from '../../../../../common/components/Loading';
const edges: Edge[] = ['right', 'bottom', 'left'];

const tabDataset = [
  {
    title: 'All',
    isActive: true,
    nameForApi: 'all',
  },
  {
    title: 'SOP',
    isActive: false,
    nameForApi: 'sop',
  },
  {
    title: 'Policy',
    isActive: false,
    nameForApi: 'policy',
  },
  {
    title: 'Workflow',
    isActive: false,
    nameForApi: 'workflow',
  },
];

const MyTasksIndex = () => {
  const [myTakLandingData, setMyTaskLandingData] = useState<any>({});
  const [taskLanding, setTaskLanding] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const refRBSheet: any = useRef();
  const isFocused = useIsFocused();
  const navigation: any = useNavigation();
  const {userInfo} = useRootStore();
  const [topTabName, setTopTabName] = useState(0);
  const [_topTabNameHeader, setTopTabNameHeader] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [_topBarHeader, setTopBarHeader] = useState(tabDataset);
  const [topBar, setTopBar] = useState([
    {
      title: 'System (10)',
      isActive: true,
      nameForApi: 'System',
    },
    {
      title: 'Process (9)',
      isActive: false,
      nameForApi: 'Process',
    },
    {
      title: 'Activity (6)',
      isActive: false,
      nameForApi: 'Activity',
    },
    {
      title: 'Rules (4)',
      isActive: false,
      nameForApi: 'Rules',
    },
  ]);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const params = {
        url: MyTaskLandingApi,
        data: {
          employeeId: userInfo?.intEmployeeId,
          BusinessUnitId: userInfo?.intBusinessUnitId,
          pageNo: currentPage,
          pageSize: 15,
        },
      };
      const response = await httpRequest(params, setIsLoading);
      if (response) {
        setIsLoading(false);
        setMyTaskLandingData(response);
        setTaskLanding((prevData: any) =>
          currentPage === 1 ? response?.data : [...prevData, ...response?.data],
        );
      }
    },
    [isFocused, currentPage],
  );

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
  const _handleTopBarHeader = (ind: any) => {
    const mod = [...tabDataset];
    const temp = mod?.map((item: any, index: any) => {
      return {
        ...item,
        isActive: ind === index ? true : false,
      };
    });

    setTopBarHeader(temp);
    setTopTabNameHeader(ind);
  };

  const getStatus = (str: string | null | undefined = '') => {
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

  const handleLoadMore = () => {
    if (
      taskLanding?.length < myTakLandingData?.totalCount &&
      taskLanding?.length >= currentPage * 15 &&
      !isLoading
    ) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const renderItem = useCallback(
    ({item}: any) => (
      <View key={item?.intTaskId}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MyTaskDetails', {
              details: item,
            })
          }>
          <Row direction="column" rowStyle={[styles.row]}>
            <Column colWidth="100%">
              <View style={{flexDirection: 'row'}}>
                {/* new design  */}
                {/* <TouchableOpacity>
                  <MCIcon
                    color={COLORS.graySubText}
                    name="star-outline"
                    size={20}
                    style={{marginRight: 10}}
                  />
                </TouchableOpacity> */}
                <Row style={styles.listContainer}>
                  <View>
                    <Row>
                      <CustomTextNew
                        txtStyle={styles.titleText}
                        text={`${item?.strTaskName} ` || 'N/A'}
                      />
                    </Row>
                    <Row align="center" rowStyle={{marginTop: 5}}>
                      <CustomTextNew
                        text={item?.empRoleWiseSystem || 'N/A'}
                        subTxt
                        txtSize={12}
                      />
                      <Ionicons name="ellipse" style={styles.ellipseStyle} />
                      <CustomTextNew
                        text={item?.empRoleWiseProcess || 'N/A'}
                        subTxt
                        txtSize={12}
                      />
                    </Row>
                    <Row align="center" rowStyle={{marginTop: 5}}>
                      <MIcon
                        name="sticky-note-2"
                        color={COLORS.primary}
                        size={16}
                        style={styles.stickyNoteStyle}
                      />
                      <CustomTextNew
                        text={`${item?.strDifficulty} Importance`}
                        txtStyle={styles.textSub}
                      />
                      <View style={styles.verticalBar} />
                      <MCIcon
                        name="clock-fast"
                        size={16}
                        color={'#667085'}
                        style={styles.stickyNoteStyle}
                      />
                      <CustomTextNew
                        text={item?.strFrequency || 'N/A'}
                        subTxt
                        txtSize={12}
                      />
                    </Row>
                    <Row align="center" rowStyle={{marginTop: 5}}>
                      <CustomTextNew
                        txtStyle={styles.staticChip}
                        text={item?.roleName || 'N/A'}
                      />
                      <Column
                        colStyle={[
                          {
                            backgroundColor: getStatus(item?.priority),
                          },
                          styles.status,
                        ]}>
                        <CustomTextNew
                          txtStyle={styles.stsTxt}
                          text={item?.priority || 'N/A'}
                        />
                      </Column>
                    </Row>
                    {/* update code  */}
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
                </Row>
                <Column>
                  <MIcon
                    name="more-vert"
                    size={24}
                    color={'#667085'}
                    style={{alignSelf: 'flex-end'}}
                  />
                </Column>
              </View>
            </Column>
          </Row>
          <View
            style={{borderBottomColor: COLORS.lightGray3, borderBottomWidth: 1}}
          />
        </TouchableOpacity>
      </View>
    ),
    [myTakLandingData],
  );

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation?.goBack}
          title="Business Operational Task"
          // alterIcon="info"
          // alterIconPress={() => refRBSheet.current.open()}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />

      <Row direction="column" rowStyle={styles.row}>
        {/* new design */}
        {/* <Column style={[styles.head1]}>
          {topBarHeader?.map((item: any, index: number) => (
            <Column
              key={index}
              style={[
                styles.box1,
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
              onCardPress={() => handleTopBarHeader(index)}>
              <CustomTextNew txtStyle={styles.headText} text={item?.title} />
            </Column>
          ))}
        </Column> */}

        <Column colWidth="100%">
          {myTakLandingData?.data?.length > 0 ? (
            <>
              <Text>
                <Text style={styles.statementTitle}>Task</Text>
                <Text style={styles.statementContent}>
                  {`-  ${
                    myTakLandingData?.totalCount || 0
                  } (Total job role id ${
                    myTakLandingData?.data[0]?.intRoleId || 0
                  })`}
                </Text>
              </Text>
              <View>
                <Text>
                  <Text style={styles.statementTitle}>Importance </Text>
                  <Text style={styles.statementContent}>
                    {' '}
                    {`-  ${
                      myTakLandingData?.data[0]?.importanceHigh || 0
                    } High, ${
                      myTakLandingData?.data[0]?.importanceMedium || 0
                    } Medium, ${
                      myTakLandingData?.data[0]?.importanceLow || 0
                    } Low`}
                  </Text>
                </Text>
                <Text>
                  <Text style={styles.statementTitle}>Frequency </Text>
                  <Text style={styles.statementContent}>
                    {' '}
                    {`-  ${myTakLandingData?.data[0]?.frequecyMonthly} Monthly, ${myTakLandingData?.data[0]?.frequecyQuertly} Quarterly, ${myTakLandingData?.data[0]?.frequencyYearly} Yearly`}
                  </Text>
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </Column>
      </Row>

      {myTakLandingData?.data?.length > 0 ? (
        <>
          <View style={styles.horizontalBar} />
          <FlatList
            showsVerticalScrollIndicator={false}
            data={taskLanding}
            renderItem={renderItem}
            keyExtractor={(item: any, index: number) =>
              `${item.intTaskId}_${index}`
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
          />
        </>
      ) : null}

      <CustomBottomSheetNew
        refRBSheet={refRBSheet}
        sheetHeight={SIZES.height / 1.5}>
        <View>
          <View style={styles.sheetHeader}>
            <Text>Business Operation </Text>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.close()
              }>
              <MIcon name="close" size={25} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          {/* topBar items */}
          <Column style={styles.head}>
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
                      color: item?.isActive ? COLORS.primary : '#667085',
                    },
                  ]}
                  text={item?.title}
                />
              </Column>
            ))}
          </Column>
          {topTabName === 0 ? (
            <>
              <Row direction="column">
                <Column colWidth="100%">
                  <CustomTextNew
                    text="1. Manufacturing execution system"
                    txtStyle={styles.bottomSheetText}
                  />
                  <CustomTextNew
                    text="2. Inventory Management System"
                    txtStyle={styles.bottomSheetText}
                  />
                  <CustomTextNew
                    text="3. Warehouse management system"
                    txtStyle={styles.bottomSheetText}
                  />
                </Column>
              </Row>
            </>
          ) : null}
          {topTabName === 1 ? (
            <>
              <Row direction="column">
                <Column colWidth="100%">
                  <CustomTextNew
                    text="1. Preventive maintenance"
                    txtStyle={styles.bottomSheetText}
                  />
                  <CustomTextNew
                    text="2. Corrective maintenance"
                    txtStyle={styles.bottomSheetText}
                  />
                </Column>
              </Row>
            </>
          ) : null}
          {topTabName === 2 ? (
            <>
              <Row direction="column">
                <Column colWidth="100%">
                  <CustomTextNew
                    text="1. Monthly production planning"
                    txtStyle={styles.bottomSheetText}
                  />
                  <CustomTextNew
                    text="2. Monthly budget planning"
                    txtStyle={styles.bottomSheetText}
                  />
                </Column>
              </Row>
            </>
          ) : null}
          {topTabName === 3 ? (
            <>
              <Row direction="column">
                <Column colWidth="100%">
                  <CustomTextNew
                    text="1.0 Order must be confirmed 3 days before end of the running month."
                    txtStyle={styles.bottomSheetText}
                  />
                  <CustomTextNew
                    text="2.0 SKU wise forecast qty must prepare."
                    txtStyle={styles.bottomSheetText}
                  />
                </Column>
              </Row>
            </>
          ) : null}
        </View>
      </CustomBottomSheetNew>
    </ContainerNew>
  );
};

export default MyTasksIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statementTitle: {
    fontSize: 15,
    color: '#101828',
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
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iconRight: {
    marginLeft: 12,
  },
  iconLeft: {
    marginTop: 2,
  },
  titleText: {
    fontSize: 14,
    color: '#101828',
    fontWeight: '400',
    lineHeight: 20,
  },
  staticChip: {
    backgroundColor: '#EAECF0',
    borderRadius: 99,
    fontSize: 12,
    color: '#000',
    fontWeight: '400',
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    // marginLeft: 8,
  },
  ellipseStyle: {
    fontSize: 5,
    marginHorizontal: 4,
    marginTop: 2,
    color: '#667085',
  },
  stickyNoteStyle: {
    marginHorizontal: 4,
  },

  textSub: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '400',
    lineHeight: 16,
  },
  verticalBar: {
    width: 1,
    height: 12,
    backgroundColor: '#667085',
    marginHorizontal: 4,
  },
  horizontalBar: {
    width: '100%',
    height: 2,
    backgroundColor: '#EAECF0',
  },
  status: {
    borderRadius: 50,
    paddingHorizontal: 4,
    alignItems: 'center',
    marginLeft: 12,
    paddingVertical: 1,
  },
  stsTxt: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    color: COLORS.black,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // bottom sheet
  head: {
    borderTopWidth: 1,
    borderTopColor: '#EAECF0',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EAECF0',
    marginBottom: 8,
  },
  head1: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
  },
  activeBox: {
    borderBottomColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 4,
  },
  inActiveBox: {
    borderBottomColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 0,
  },
  bottomSheetText: {
    fontSize: 12,
    lineHeight: 20,
    fontWeight: '400',
    paddingVertical: 2,
  },
  listContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingRight: 5,
    flex: 1,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    flexWrap: 'wrap',
  },
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
  box: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    borderWidth: 1,
    marginRight: 8,
  },
  box1: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 30,
    borderWidth: 1,
    marginRight: 8,
  },
});
