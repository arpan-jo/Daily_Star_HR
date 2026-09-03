import { useIsFocused, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'rn-fetch-blob';
import { SIZES, COLORS } from '../../../../common/constant/Themes';

import { uploadFileMultipart } from '../../../../common/services/uploadDocument';
import { AllDocumentLandingType } from '../../../../interfaces/document/document';
import {
  getSelfDocumentList,
  createDoucument} from '../../../../services/SaaS-modules/document/documentsAPI';
import { useRootStore } from '../../../../stores/rootStore';
import { useToast } from '../../../../common/components/CustomToast';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { fileService } from '../../../../services/file.service';

const DocApplicationIndex = () => {
  const { userInfo } = useRootStore();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const toaster = useToast();
  const refRBSheet = useRef();
  const refRBSheet2 = useRef();

  const [_isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadShow, setIsUploadShow] = useState<boolean>(true);

  const [isUploading, _setIsUploading] = useState<boolean>(false);
  const [allDocList, setAllDocList] = useState<AllDocumentLandingType[]>();
  const [singleDoc, setSingleDoc] = useState<AllDocumentLandingType>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      const res = await getSelfDocumentList(
        userInfo?.intEmployeeId,
        setIsLoading,
      );
      setAllDocList(res);
      setIsUploadShow(true);
    },
    [isFocused],
  );

  const activeDeactiveHandler = (index: number) => {
    if (allDocList) {
      let modifyData = [...allDocList];
      const mod = modifyData?.map(item => {
        return {
          ...item,
          isShow: false,
        };
      });
      // @ts-ignore
      mod[index].isShow = !mod[index].isShow;
      setAllDocList(mod);
    }
  };

  const launchCam = () => {
    const options = {
      cropping: true,
      // cropperCircleOverlay: true,
      useFrontCamera: true,
      compressImageQuality: 0.6,
      showCropGuidelines: false,
      showCropFrame: false,
    };
    ImagePicker.openCamera({
      ...options,
    })
      .then(async image => {
        const res = {
          assets: [
            {
              // @ts-ignore
              fileName: 'document' + '.jpg',
              fileSize: 1000,
              height: 300,
              type: image?.mime,
              uri: image?.path,
              width: 300,
            },
          ],
        };
        const data = await uploadFileMultipart(
          userInfo?.intAccountId,
          userInfo?.intEmployeeId,
          userInfo?.intBusinessUnitId,
          res?.assets?.[0],
          setIsLoading,
        );
        if (data) {
          //@ts-ignore
          refRBSheet?.current?.close();
          navigation.navigate('DocUpload', {
            image: data,
          });
        } else {
          setIsLoading(false);
          toaster.show({ message: 'Something went worng.', type: 'error' });
        }
      })
      .catch(() => {
        //@ts-ignore
        refRBSheet?.current?.close();
        setIsLoading(false);
      });
  };

  const deleteDocument = async (item: any) => {
    let payload = {
      intDocumentId: item?.intDocumentId,
      strDocumentTitle: item?.strDocumentTitle,
      strDocCategoryName: item?.strDocCategoryName,
      intDocCategoryId: item?.intDocCategoryId,
      intOwnerId: item?.intOwnerId,
      strOwnerName: item?.strOwnerName,
      strFileUrl: item?.strFileUrl,
      strFileName: item?.strFileName,
      strInsertBy: item?.strInsertBy,
      strApprovalStatus: item?.strApprovalStatus,
      isActive: false,
      insertDate: item?.insertDate,
      IntAccountId: item?.intAccountId,
    };

    const res = await createDoucument(payload);

    if (res?.statusCode === 200) {
      const docRes = await getSelfDocumentList(
        userInfo?.intEmployeeId,
        setIsLoading,
      );
      setAllDocList(docRes);
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

    // const { config, fs, ios } = RNFetchBlob;
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

  const reload = async () => {
    const res = await getSelfDocumentList(
      userInfo?.intEmployeeId,
      setIsLoading,
    );
    setAllDocList(res);
    setIsUploadShow(true);
  };

  const isTrue = allDocList?.filter(item => item?.isShow === true);

  return (
    <View>
      <TouchableOpacity
        disabled={isTrue && isTrue?.length > 0 ? false : true}
        activeOpacity={1}
        onPress={() => {
          if (Platform.OS === 'ios') {
            setIsUploadShow(true);
          }
          if (isTrue && isTrue.length > 0) {
            reload();
          }
        }}>
        <View
          style={{
            height: SIZES.height,
            backgroundColor: COLORS.white,
            paddingBottom: allDocList?.length
              ? Platform.OS === 'ios'
                ? SIZES.height / 5.6
                : '38%'
              : SIZES.height,
          }}>
          <ScrollView>
            {!isUploading && (
              <View style={{ paddingBottom: 150 }}>
                {/* {isLoading && <ActivityIndicator size={'large'} color={COLORS.primary} />} */}

                {allDocList?.map((item, index) => (
                  <View key={index}>
                    <View style={[styles.card]}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('DocDetails', {
                            item: item,
                            title: 'Application',
                          })
                        }>
                        <View style={[styles.textPart]}>
                          <View style={styles.daysPart}>
                            <View
                              style={[
                                styles.days,
                                { backgroundColor: '#009CDE' },
                              ]}>
                              <Text style={styles.cmnDay}>
                                {dayjs(item?.insertDate).format('DD')}
                              </Text>
                              <Text style={styles.cmnDay}>
                                {dayjs(item?.insertDate).format('MMM')}
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
                          </View>
                        </View>
                      </TouchableOpacity>

                      <View>
                        <TouchableOpacity
                          onPress={() => {
                            setIsUploadShow(!isUploadShow);
                            activeDeactiveHandler(index);
                            if (Platform.OS === 'ios') {
                              //@ts-ignore
                              refRBSheet2?.current?.open();
                              setSingleDoc(item);
                            }
                          }}>
                          <Icon
                            name="dots-vertical"
                            size={25}
                            color={COLORS.transparentBlack}
                            style={{ paddingHorizontal: 5 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.bar2} />
                    {item?.isShow && Platform.OS === 'android' && (
                      <View style={styles.popUp}>
                        <View>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('SendOrApproval', {
                                item: item,
                                title: 'Send',
                                popFrom: 1,
                              })
                            }
                            style={[styles.textIconPopUp, { width: 65 }]}>
                            <MIcon
                              name="send"
                              size={20}
                              color={COLORS.transparentDark}
                            />
                            <Text style={styles.popOverText}>Send</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('SendOrApproval', {
                                item: item,
                                title: 'Approve Request',
                                popFrom: 1,
                              })
                            }
                            style={[styles.textIconPopUp, { width: 150 }]}>
                            <MIcon
                              name="assignment-turned-in"
                              size={20}
                              color={COLORS.transparentDark}
                            />
                            <Text style={styles.popOverText}>
                              Approval Request
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() => {
                              reload();
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

                          <TouchableOpacity
                            onPress={() => deleteDocument(item)}
                            style={[styles.textIconPopUp, { width: 75 }]}>
                            <MIcon
                              name="delete"
                              size={20}
                              color={COLORS.transparentDark}
                            />
                            <Text style={styles.popOverText}>Delete</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('DocUploadFile', {
                                item: item,
                                title: 'Edit',
                                popFrom: 1,
                              })
                            }
                            style={[styles.textIconPopUp, { width: 60 }]}>
                            <MIcon
                              name="edit"
                              size={20}
                              color={COLORS.transparentDark}
                            />
                            <Text style={styles.popOverText}>Edit</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {isUploading && (
            <>
              <Text style={styles.imageProcess}>
                Please wait. Image is processing
              </Text>
            </>
          )}
        </View>
      </TouchableOpacity>
      {isUploadShow && Platform.OS === 'android' && (
        <TouchableOpacity
          onPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          style={[
            styles.appBtn,
            {
              marginTop: SIZES.height / 1.36,
            },
          ]}
          activeOpacity={0.6}>
          <Icon name="upload" size={20} color={COLORS.white} />
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>
      )}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          onPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          style={[
            styles.appBtn,
            {
              marginTop: SIZES.height / 1.45,
            },
          ]}
          activeOpacity={0.6}>
          <Icon name="upload" size={20} color={COLORS.white} />
          <Text style={styles.btnText}>Upload</Text>
        </TouchableOpacity>
      )}
      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 3.5}
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
        <View style={{ paddingHorizontal: 16 }}>
          <View style={styles.sheetHeader}>
            <Text>Select Upload Option</Text>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.close()
              }>
              <MIcon name="close" size={25} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter}>
            <View style={{ marginRight: 30 }}>
              <TouchableOpacity
                onPress={() => launchCam()}
                style={styles.iconBg}>
                <MIcon
                  name="center-focus-weak"
                  size={25}
                  color={COLORS.primary}
                />
              </TouchableOpacity>
              <Text style={styles.textSheet}>Camera</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  // @ts-ignore
                  refRBSheet?.current?.close();
                  navigation.navigate('DocUploadFile', {
                    item: '',
                    title: 'Upload',
                    popFrom: 1,
                  });
                }}
                style={styles.iconBg}>
                <MIcon name="attachment" size={25} color={COLORS.activeText} />
              </TouchableOpacity>

              <Text style={styles.textSheet}>File</Text>
            </View>
          </View>
        </View>
      </RBSheet>

      <RBSheet
        //@ts-ignore
        ref={refRBSheet2}
        width={SIZES.width}
        height={SIZES.height / 3.5}
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
        <View style={{ paddingLeft: 25 }}>
          <View>
            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                refRBSheet2?.current?.close();
                navigation.navigate('SendOrApproval', {
                  item: singleDoc,
                  title: 'Send',
                  popFrom: 1,
                });
              }}
              style={[styles.textIconPopUp, { width: 65 }]}>
              <MIcon name="send" size={20} color={COLORS.transparentDark} />
              <Text style={styles.popOverText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                refRBSheet2?.current?.close();
                navigation.navigate('SendOrApproval', {
                  item: singleDoc,
                  title: 'Approve Request',
                  popFrom: 1,
                });
              }}
              style={[styles.textIconPopUp, { width: 150 }]}>
              <MIcon
                name="assignment-turned-in"
                size={20}
                color={COLORS.transparentDark}
              />
              <Text style={styles.popOverText}>Approval Request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                downloadFile(singleDoc?.strFileUrl, singleDoc?.strFileName);
              }}
              style={[styles.textIconPopUp, { width: 100 }]}>
              <MIcon
                name="file-download"
                size={20}
                color={COLORS.transparentDark}
              />
              <Text style={styles.popOverText}>Download</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                deleteDocument(singleDoc);
              }}
              style={[styles.textIconPopUp, { width: 75 }]}>
              <MIcon name="delete" size={20} color={COLORS.transparentDark} />
              <Text style={styles.popOverText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                //@ts-ignore
                refRBSheet2?.current?.close();
                navigation.navigate('DocUploadFile', {
                  item: singleDoc,
                  title: 'Edit',
                  popFrom: 1,
                });
              }}
              style={[styles.textIconPopUp, { width: 60 }]}>
              <MIcon name="edit" size={20} color={COLORS.transparentDark} />
              <Text style={styles.popOverText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default DocApplicationIndex;

const styles = StyleSheet.create({
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
  days: { width: 40, paddingVertical: 6, borderRadius: 4, paddingHorizontal: 4 },
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
    // zIndex: 9,
  },

  date: {
    fontSize: 14,
    lineHeight: 16,
    letterSpacing: 0.15,
    color: COLORS.transparentBlack,
  },
  appBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    position: 'absolute',
    marginLeft: SIZES.width / 1.6,
  },

  btnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 5,
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  sheetFooter: {
    flexDirection: 'row',
    paddingTop: 30,
  },
  iconBg: {
    backgroundColor: COLORS.white,
    alignSelf: 'center',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    // overflow: 'hidden',
    elevation: 5,
  },
  textSheet: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 14,
    color: COLORS.transparentBlack,
  },
  popUp: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    shadowOffset: { width: 1, height: 5 },
    shadowColor: Platform.OS === 'ios' ? COLORS.softGray : '',
    shadowOpacity: Platform.OS === 'ios' ? 1 : 0,
    width: 200,
    height: 200,
    marginLeft: 180,
    elevation: 40,
    padding: 16,
    borderRadius: 4,
    // zIndex: 2,
    // overflow: 'hidden',
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
  imageProcess: {
    fontSize: 16,
    color: COLORS.transparentText,
    fontWeight: '700',
    paddingLeft: 16,
  },
});
