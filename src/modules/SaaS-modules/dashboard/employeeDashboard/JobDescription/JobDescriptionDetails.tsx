/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, ScrollView, View, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-paper';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import CustomTextNew from '../../../../../common/components/CustomText';
import Row from '../../../../../common/components/Row';
import {COLORS} from '../../../../../common/constant/Themes';
import {
  employeeJobDescriptionDetails,
  createJobDescReaction,
} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import {useToast} from '../../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import LoadingContainer from '../../../../../common/components/Loading';

const edges: Edge[] = ['right', 'bottom', 'left'];
const getColor = (str: string) => {
  let colorCode = '#fff';
  if (str === 'Schedule') {
    colorCode = '#0BA5EC';
  }
  if (str === 'Delegate') {
    colorCode = '#EAAA08';
  }
  if (str === 'Don’t Do') {
    colorCode = '#D92D20';
  }
  if (str === 'Do First') {
    colorCode = COLORS.primary;
  }
  return colorCode;
};

const JobDescriptionDetails = () => {
  const [details, setDetails] = useState<any>({});
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const route: any = useRoute();
  const {roleID, jd} = route?.params?.jdData || {};

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const response = await employeeJobDescriptionDetails(
        userInfo?.intEmployeeId,
        roleID,
        jd?.jdId,
      );
      setDetails(response);
    },
    [isFocused, jd?.jdId, isLoadMore],
  );

  const {
    strategicKpi,
    kpiformula,
    performanceDriver,
    criticalSuccessFactor,
    competency,
    employeeCompetency,
    training,
    softSkill,
  } = details?.jdDetails || {};

  const saveReactionHandler = async (
    bookOrReaction: string,
    isBookmarkOrReaction: boolean | string,
  ) => {
    const payload = {
      jid: details?.jobDescription?.jdId,
      reaction:
        bookOrReaction === 'reaction'
          ? isBookmarkOrReaction
          : details?.jobDescription?.reaction,
      employeeID: userInfo?.intEmployeeId,
      isBookmark:
        bookOrReaction === 'bookmarked'
          ? isBookmarkOrReaction
          : details?.jobDescription?.isBookmark,
      eisenhowerMatrix: details?.jobDescription?.eisenhowerMatrix,
      responsibilityMatrix: details?.jobDescription?.responsibilityMatrix,
    };

    const res = await createJobDescReaction(payload, setIsLoading);
    if (res?.statusCode === 200) {
      setIsLoadMore(!isLoadMore);
      toaster.show({message: res?.message, type: 'success'});
    } else {
      toaster.show({message: 'Try again', type: 'error'});
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          alterIcon={
            details?.jobDescription?.isBookmark ? 'star' : 'star-outline'
          }
          alterIconPress={() =>
            saveReactionHandler(
              'bookmarked',
              !details?.jobDescription?.isBookmark,
            )
          }
          title="Job Description Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <Row direction="column" rowStyle={[styles.row, {marginBottom: 50}]}>
          <CustomTextNew
            text={jd?.jobDescription}
            txtSize={22}
            lineHight={24}
            txtWeight={'600'}
            txtColor={COLORS.black}
          />

          <View style={styles.iconContainer}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={styles.likeIcon}>
                <TouchableOpacity
                  onPress={() =>
                    saveReactionHandler(
                      'reaction',
                      details?.jobDescription?.reaction === 'like'
                        ? ''
                        : 'like',
                    )
                  }>
                  <Icon
                    name={
                      details?.jobDescription?.reaction === 'like'
                        ? 'thumb-up'
                        : 'thumb-up-outline'
                    }
                    size={18}
                    color={COLORS.darkGray}
                    style={{marginHorizontal: 3}}
                  />
                </TouchableOpacity>
                <Text style={{color: COLORS.graySubText}}> | </Text>
                <TouchableOpacity
                  onPress={() =>
                    saveReactionHandler(
                      'reaction',
                      details?.jobDescription?.reaction === 'dislike'
                        ? ''
                        : 'dislike',
                    )
                  }>
                  <Icon
                    name={
                      details?.jobDescription?.reaction === 'dislike'
                        ? 'thumb-down'
                        : 'thumb-down-outline'
                    }
                    size={18}
                    color={COLORS.darkGray}
                    style={{marginHorizontal: 5}}
                  />
                </TouchableOpacity>
                <Text style={{fontSize: 13, color: COLORS.deepGray}}>
                  Expression
                </Text>
              </View>

              <View style={styles.reportIcon}>
                <TouchableOpacity
                  style={{flexDirection: 'row'}}
                  onPress={() => {
                    const jdData = {
                      roleID: roleID,
                      jd: jd,
                    };

                    //@ts-ignore
                    navigation.navigate('ReportJobDescription', {
                      jdData,
                    });
                  }}>
                  <Icon
                    name="alert-octagon-outline"
                    size={18}
                    color={'gray'}
                    style={{marginHorizontal: 2}}
                  />

                  <Text style={{fontSize: 13, color: COLORS.deepGray}}>
                    Report
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderRadius: 15,
                paddingVertical: 3,
                paddingHorizontal: 8,
                backgroundColor: getColor(
                  details?.jobDescription?.eisenhowerMatrix,
                ),
              }}>
              <Text style={[styles.txtCmn, {color: COLORS.white}]}>
                {details?.jobDescription?.eisenhowerMatrix}
              </Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  const jdData = {
                    roleID: roleID,
                    jd: jd,
                  };

                  navigation.navigate('JobDescriptitonMatrix', {
                    jdData,
                  });
                }}>
                <Icon
                  name="dots-vertical"
                  size={16}
                  color={'gray'}
                  style={{marginHorizontal: 3}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.horizontalLine, {marginTop: 15}]} />

          <View style={{marginBottom: 8, marginTop: 5}}>
            <CustomTextNew
              text={'Role ID'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={`${details?.jobDescription?.roleCode}` || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />

            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'KPI (Key Performance Indictor)'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={strategicKpi || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'KPI Formula'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={kpiformula || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Performance Driver'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={performanceDriver || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />

            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Critical Success Factor (CSF)'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={criticalSuccessFactor || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Competency (Technical or Functional or Leadership)'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={competency || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />

            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Employee Competencies'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={employeeCompetency || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Technical/Functional Training'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={training || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
            <View style={styles.horizontalLine} />
            <CustomTextNew
              text={'Soft Skill'}
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={20}
            />
            <CustomTextNew
              text={softSkill || 'N/A'}
              txtColor={COLORS.black}
              txtSize={16}
              lineHight={25}
              txtWeight={'600'}
            />
          </View>
        </Row>
      </ScrollView>
    </ContainerNew>
  );
};

export default JobDescriptionDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  row: {
    padding: 16,
  },

  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,

    justifyContent: 'space-between',
  },
  likeIcon: {
    backgroundColor: COLORS.lightGray2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  reportIcon: {
    backgroundColor: COLORS.lightGray2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 5,
    borderRadius: 10,
    marginLeft: 5,
  },
  jobStatus: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 10,
  },
  txtCmn: {fontSize: 12, color: COLORS.graySubText, fontWeight: '500'},
  horizontalLine: {
    borderWidth: 0.3,
    borderColor: COLORS.lightGray5,
    marginTop: 8,
  },
});
