import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'rn-fetch-blob';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import {
  getStatusBgColor,
  getStatusColor} from '../../../../common/services/getColor';

import { DocInboxType } from '../../../../interfaces/document/document';
import {
  createDoucumentApproval,
  getDocumentInbox} from '../../../../services/SaaS-modules/document/documentInbox';
import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { fileService } from '../../../../services/file.service';

const DocInboxApproval = ({ title, refRBSheet }: any) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { userInfo } = useRootStore();

  const toaster = useToast();

  const [_isLoading, setIsLoading] = useState<boolean>();

  const [data, setData] = useState<DocInboxType[]>();
  const [singleData, setSingleData] = useState<DocInboxType>();

  const activeDeactiveHandler = (index: number) => {
    // @ts-ignore
    let modifyData = [...data];
    const mod = modifyData?.map(item => {
      return {
        ...item,
        isShow: false,
      };
    });
    mod[index].isShow = !mod[index].isShow;
    setData(mod);
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getDocment();
    },
    [isFocused, title],
  );

  const approveOrReject = async (item: any, statusId: number) => {
    getDocment();
    //statusId 0 = pending, 1 = approve, 2 = reject
    const res = await createDoucumentApproval(
      userInfo?.intEmployeeId,
      item?.intDocumentId,
      item?.intAutoId,
      statusId,
    );
    if (res?.statusCode === 200) {
      getDocment();
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
  };

  const downloadFile = async (file: any, fileN: string | undefined) => {
    const response = await fileService.FileDownload({
      fileId: file,
      fileName: fileN
    })
    toaster.show({ message: response?.message, type: response?.status ? 'success' : 'error' });
    // let image_URL = getImageURL(file);
    // console.log(image_URL);
    // const {config, fs, ios} = RNFetchBlob;
    // // let PictureDir = fs.dirs.DownloadDir;
    // let PictureDir =
    //   Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;
    // let options = {
    //   fileCache: true,
    //   appendExt: '.png',
    //   addAndroidDownloads: {
    //     useDownloadManager: true,
    //     notification: true,
    //     path: PictureDir + '/' + fileN,
    //     description: fileN,
    //   },
    //   // path: PictureDir + '/' + fileN,
    // };
    // config(options)
    //   .fetch('GET', image_URL)
    //   .then(res => {
    //     if (res?.data && Platform.OS === 'ios') {
    //       fs.writeFile(PictureDir, res?.data, 'base64');
    //       ios.previewDocument(res?.data);
    //     }
    //   });
  };

  const getDocment = async () => {
    const res = await getDocumentInbox(userInfo?.intEmployeeId, setIsLoading);
    if (title === 'Approval') {
      const modifiedData = res && res?.filter(i => i?.isForApproval === true);
      setData(modifiedData);
    }
    if (title === 'View') {
      const modifiedData = res && res?.filter(i => !i?.isForApproval);
      setData(modifiedData);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={async () => {
        getDocment();
      }}
      style={styles.main}>
      <View>
        {data &&
          data?.map((item, index) => (
            <View key={index}>
              <ScrollView>
                <View style={styles.card}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('DocDetails', {
                        item: item,
                        from: 'inbox-approval',
                        title: title,
                      })
                    }>
                    <View style={[styles.textPart]}>
                      <View style={styles.daysPart}>
                        <View
                          style={[
                            styles.days,
                            {
                              backgroundColor: COLORS.activeText,
                              // title === 'View' ? '#BD3044' : '#B88205'
                            },
                          ]}>
                          <Text style={styles.cmnDay}>
                            {dayjs(item?.dteSharedDate).format('DD')}
                          </Text>
                          <Text style={styles.cmnDay}>
                            {dayjs(item?.dteSharedDate).format('MMM')}
                          </Text>
                        </View>
                      </View>
                      <View>
                        <Text style={styles.titleTxt}>
                          {item?.strDocumentTitle?.trim()}
                        </Text>
                        <Text style={styles.date}>
                          {item?.strDocCategoryName?.trim()}
                        </Text>
                        {item?.strSenderName && (
                          <Text style={[styles.date, { paddingTop: 4 }]}>
                            Send by {item?.strSenderName?.trim()}
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>

                  <View>
                    {title && title === 'Approval' && item?.isForApproval && (
                      <Text
                        style={[
                          styles.status,
                          {
                            backgroundColor: getStatusBgColor(
                              item?.strApprovalStatus,
                            ),
                            color: getStatusColor(item?.strApprovalStatus),
                          },
                        ]}>
                        {item?.strApprovalStatus}
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => {
                        activeDeactiveHandler(index);

                        if (Platform.OS === 'ios') {
                          //@ts-ignore
                          refRBSheet?.current?.open();
                          setSingleData(item);
                        }
                      }}
                      style={styles.threeDots}>
                      <Icon
                        name="dots-vertical"
                        size={25}
                        color={COLORS.transparentBlack}
                        style={{ paddingHorizontal: 5 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>

              <View style={styles.bar2} />
              {Platform.OS === 'android' && item?.isShow && (
                <View
                  style={[
                    styles.popUp,
                    { height: title === 'View' ? 100 : 160 },
                  ]}>
                  <View>
                    {title && title === 'Approval' && (
                      <>
                        <TouchableOpacity
                          onPress={() => approveOrReject(item, 1)}
                          style={[styles.textIconPopUp, { width: 90 }]}>
                          <MIcon
                            name="check-circle"
                            size={20}
                            color={COLORS.transparentDark}
                          />
                          <Text style={styles.popOverText}>Approve</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => approveOrReject(item, 2)}
                          style={[styles.textIconPopUp, { width: 80 }]}>
                          <MIcon
                            name="cancel"
                            size={20}
                            color={COLORS.transparentDark}
                          />
                          <Text style={styles.popOverText}>Reject</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('SendOrApproval', {
                          item: item,
                          title: 'Forward',
                        })
                      }
                      style={[styles.textIconPopUp, { width: 90 }]}>
                      <MIcon
                        name="send"
                        size={20}
                        color={COLORS.transparentDark}
                      />
                      <Text style={styles.popOverText}>Forward</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        getDocment();
                        downloadFile(item?.strFileUrl, item?.strFileName);
                      }}
                      style={[styles.textIconPopUp, { width: 100 }]}>
                      <MIcon
                        name="file-download"
                        size={20}
                        color={COLORS.transparentDark}
                      />
                      <Text style={styles.popOverText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}

        {/* {isLoading && <ActivityIndicator size={'large'} />} */}
      </View>

      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={title === 'View' ? SIZES.height / 5.2 : SIZES.height / 3.5}
        duration={150}
        closeOnDragDown={true}
        animationType={'fade'}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopRightRadius: 24,
            borderTopLeftRadius: 24,
            backgroundColor: COLORS.white,
          },
        }}>
        <View style={[{ paddingLeft: 15 }]}>
          <View>
            {title && title === 'Approval' && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    //@ts-ignore
                    refRBSheet?.current?.close();
                    approveOrReject(singleData, 1);
                  }}
                  style={[styles.textIconPopUp, { width: 90 }]}>
                  <MIcon
                    name="check-circle"
                    size={20}
                    color={COLORS.transparentDark}
                  />
                  <Text style={styles.popOverText}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    //@ts-ignore
                    refRBSheet?.current?.close();
                    approveOrReject(singleData, 2);
                  }}
                  style={[styles.textIconPopUp, { width: 80 }]}>
                  <MIcon
                    name="cancel"
                    size={20}
                    color={COLORS.transparentDark}
                  />
                  <Text style={styles.popOverText}>Reject</Text>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                refRBSheet?.current?.close();
                navigation.navigate('SendOrApproval', {
                  item: singleData,
                  title: 'Forward',
                });
              }}
              style={[styles.textIconPopUp, { width: 90 }]}>
              <MIcon name="send" size={20} color={COLORS.transparentDark} />
              <Text style={styles.popOverText}>Forward</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                downloadFile(singleData?.strFileUrl, singleData?.strFileName);
              }}
              style={[styles.textIconPopUp, { width: 100 }]}>
              <MIcon
                name="file-download"
                size={20}
                color={COLORS.transparentDark}
              />
              <Text style={styles.popOverText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </TouchableOpacity>
  );
};

export default DocInboxApproval;

const styles = StyleSheet.create({
  main: { marginTop: 10, flex: 1, paddingBottom: SIZES.height / 3 },
  titleTxt: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.black,
    paddingBottom: 2,
  },
  bar2: { height: 2, backgroundColor: COLORS.lightGray7, marginVertical: 10 },
  textPart: { flexDirection: 'row' },
  daysPart: { width: 50 },
  days: {
    width: 40,
    paddingVertical: 6,
    borderRadius: 4,
    paddingHorizontal: 4,
    height: 65,
    paddingTop: 15,
  },
  cmnDay: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 5,
  },

  date: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.15,
    color: COLORS.transparentBlack,
  },

  popUp: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    width: 200,
    height: 160,
    marginLeft: Platform.OS === 'ios' ? 5 : 180,
    zIndex: 2,
    elevation: 40,
    padding: 16,
    borderRadius: 4,
  },
  textIconPopUp: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  popOverText: {
    fontSize: 14,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.transparentText,
    paddingLeft: Platform.OS === 'ios' ? 10 : 5,
  },
  status: {
    width: 75,
    textAlign: 'center',
    marginTop: 6,
    borderRadius: 4,
    fontSize: 14,
    paddingTop: 3,
    paddingBottom: 6,
  },
  threeDots: { alignItems: 'flex-end', paddingTop: 6 },
});
