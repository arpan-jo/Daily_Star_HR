/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {EmployeeJobDescription} from '../../../../../common/api/api';
import ContainerNew from '../../../../../common/components/Container';
import CustomHeader from '../../../../../common/components/CustomHeader';
import {useToast} from '../../../../../common/components/CustomToast';
import LoadingContainer from '../../../../../common/components/Loading';
import {COLORS} from '../../../../../common/constant/Themes';
import {httpRequest} from '../../../../../common/constant/httpRequest';
import {createJobDescReaction} from '../../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {useRootStore} from '../../../../../stores/rootStore';
import useAsyncEffect from '../../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const JobDescriptionIndex = () => {
  const [jdLandingData, setJDLandingData] = useState<any>();
  const [reload, setReload] = useState(false);
  const [_isLoading, setIsLoading] = useState(false);
  const [landingLoading, setLandingLoading] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      const params = {
        url: EmployeeJobDescription,
        data: {employeeId: userInfo?.intEmployeeId},
      };
      const pdRes = await httpRequest(params, setLandingLoading);

      // const pdRes = await getJdLandData(userInfo?.intEmployeeId);

      setJDLandingData(pdRes);
    },
    [isFocused, reload],
  );

  const saveReactionHandler = async (
    jd: any,
    bookOrReaction: string,
    isBookmarkOrReaction: boolean | string,
  ) => {
    const payload = {
      jid: jd?.jdId,
      reaction:
        bookOrReaction === 'reaction' ? isBookmarkOrReaction : jd?.reaction,
      employeeID: userInfo?.intEmployeeId,
      isBookmark:
        bookOrReaction === 'bookmarked' ? isBookmarkOrReaction : jd?.isBookmark,
      eisenhowerMatrix: jd?.eisenhowerMatrix,
      responsibilityMatrix: jd?.responsibilityMatrix,
    };
    const res = await createJobDescReaction(payload, setIsLoading);
    if (res?.statusCode === 200) {
      setReload(!reload);
      toaster.show({message: res?.message, type: 'success'});
    } else {
      toaster.show({message: 'Try again', type: 'error'});
    }
  };

  const getColor = (str: string) => {
    if (str === 'Schedule') {
      return '#0BA5EC';
    }
    if (str === 'Delegate') {
      return '#EAAA08';
    }
    if (str === 'Don’t Do') {
      return '#D92D20';
    }
    if (str === 'Do First') {
      return COLORS.primary;
    }
  };
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader title="Job Description" onBackPress={navigation.goBack} />
      }
      style={styles.container}>
      <LoadingContainer isLoading={landingLoading} />
      <View>
        {jdLandingData?.jobDescriptions?.map((item: any, ind: number) => (
          <View key={ind}>
            <>
              {item?.jobDescriptionRows?.map(
                (itemRow: any, itemIndex: number) => (
                  <View
                    key={itemIndex}
                    style={[
                      styles.activeReaction,
                      {
                        borderBottomWidth:
                          item?.jobDescriptionRows?.length - 1 === itemIndex
                            ? 0
                            : 1,
                      },
                    ]}>
                    <View style={styles.rowItemBox}>
                      <View style={{marginRight: 3}}>
                        <TouchableOpacity
                          onPress={() => {
                            saveReactionHandler(
                              itemRow,
                              'bookmarked',
                              !itemRow?.isBookmark,
                            );
                          }}>
                          <MIcon
                            name={itemRow?.isBookmark ? 'star' : 'star-outline'}
                            size={22}
                            color={
                              itemRow.isBookmark
                                ? COLORS.yellow
                                : COLORS.deepGray
                            }
                          />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        style={{flex: 1}}
                        onPress={() => {
                          const jdData = {
                            roleID: item?.roleID,
                            jd: itemRow,
                          };
                          //@ts-ignore
                          navigation.navigate('JobDescriptionDetails', {
                            jdData,
                          });
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View style={{flex: 1}}>
                            <View style={[styles.jobStatus]}>
                              <Text style={styles.roleCodeTxt}>
                                {item?.roleCode}
                              </Text>
                            </View>
                          </View>

                          <View style={{flex: 0.4}}>
                            <View style={styles.likeIcon}>
                              <TouchableOpacity
                                onPress={() => {
                                  saveReactionHandler(
                                    itemRow,
                                    'reaction',
                                    itemRow?.reaction === 'like' ? '' : 'like',
                                  );
                                }}>
                                <Icon
                                  name={
                                    itemRow.reaction === 'like'
                                      ? 'thumb-up'
                                      : 'thumb-up-outline'
                                  }
                                  size={18}
                                  color={
                                    itemRow.reaction === 'like'
                                      ? COLORS.primary
                                      : COLORS.darkGray
                                  }
                                  style={{marginHorizontal: 3}}
                                />
                              </TouchableOpacity>
                              <Text style={{color: COLORS.graySubText}}>
                                {' '}
                                |{' '}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  saveReactionHandler(
                                    itemRow,
                                    'reaction',
                                    itemRow?.reaction === 'dislike'
                                      ? ''
                                      : 'dislike',
                                  );
                                }}>
                                <Icon
                                  name={
                                    itemRow.reaction === 'dislike'
                                      ? 'thumb-down'
                                      : 'thumb-down-outline'
                                  }
                                  size={18}
                                  color={COLORS.darkGray}
                                  style={{marginHorizontal: 2}}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>

                          <View>
                            <TouchableOpacity
                              onPress={() => {
                                const jdData = {
                                  roleID: item?.roleID,
                                  jd: itemRow,
                                };
                                //@ts-ignore
                                navigation.navigate('JobDescriptitonMatrix', {
                                  jdData,
                                });
                                // const resettedPriorities = taskPrio.map((priority: any) => ({
                                //   ...priority,
                                //   isActive: false,
                                // }));
                                // setTaskPrio(resettedPriorities);
                                // setSelectedJD(itemRow);
                                // refRBSheet2.current?.open();
                              }}>
                              <Icon
                                name="dots-vertical"
                                size={18}
                                color={'gray'}
                                style={{marginHorizontal: 3}}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={{marginVertical: 5, flexDirection: 'row'}}>
                          {itemRow?.responsibilityMatrix && (
                            <View
                              style={[
                                styles.jobStatus,
                                {
                                  marginRight: 5,
                                  backgroundColor: '#667780',
                                  paddingVertical: 3,
                                },
                              ]}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: COLORS.white,
                                  fontWeight: '500',
                                }}>
                                {itemRow?.responsibilityMatrix}
                              </Text>
                            </View>
                          )}
                          {itemRow?.eisenhowerMatrix && (
                            <View
                              style={[
                                styles.jobStatus,
                                {
                                  marginRight: 5,
                                  backgroundColor: getColor(
                                    itemRow?.eisenhowerMatrix,
                                  ),
                                  paddingVertical: 3,
                                },
                              ]}>
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: COLORS.white,
                                  fontWeight: '500',
                                }}>
                                {itemRow?.eisenhowerMatrix}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View>
                          <Text style={styles.rowItem} numberOfLines={2}>
                            {itemRow?.jobDescription}{' '}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ),
              )}
            </>
          </View>
        ))}
      </View>
    </ContainerNew>
  );
};

export default JobDescriptionIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  activeReaction: {
    // backgroundColor: 'coral',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softGray,
    paddingBottom: 5,
  },
  rowItemBox: {
    flexDirection: 'row',
  },
  jobStatus: {
    backgroundColor: '#EAECF0',
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 2,
    marginBottom: 5,
  },
  rowItem: {
    fontSize: 14,
    color: COLORS.textNewColor,
    lineHeight: 20,

    // marginLeft: 15,
  },
  roleCodeTxt: {fontSize: 12, color: COLORS.black, fontWeight: '500'},
  likeIcon: {
    // backgroundColor: COLORS.lightGray2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
});
