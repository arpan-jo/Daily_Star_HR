import { useIsFocused } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
// import RNFetchBlob from 'rn-fetch-blob';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { date_formater } from '../../../../common/services/dateFormater';
import { getImageURL } from '../../../../common/services/getImage';
import { EmployeeSelfDetailsType } from '../../../../interfaces/employee-details/employee-details';
import { createDoucumentApproval } from '../../../../services/SaaS-modules/document/documentInbox';
import { createDoucument } from '../../../../services/SaaS-modules/document/documentsAPI';
import { getEmployeeDetails } from '../../../../services/SaaS-modules/employee-management/employee-managemnet';
import { useToast } from '../../../../common/components/CustomToast';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { fileService } from '../../../../services/file.service';

const DocDetails = ({ navigation, route }: any) => {
  const refRBSheet = useRef();
  const toaster = useToast();

  const [isMenu, setIsMenu] = useState(false);

  const { from, title, item } = route?.params;

  const isFocused = useIsFocused();
  const [_isLoading, setIsLoading] = useState(false);
  const [singleEmployee, setSingleEmployee] =
    useState<EmployeeSelfDetailsType>();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      setIsMenu(false);
      const res = await getEmployeeDetails(item?.intOwnerId, setIsLoading);
      setSingleEmployee(res);
    },
    [isFocused],
  );

  const deleteDocument = async (i: any) => {
    let payload = {
      intDocumentId: i?.intDocumentId,
      strDocumentTitle: i?.strDocumentTitle,
      strDocCategoryName: i?.strDocCategoryName,
      intDocCategoryId: i?.intDocCategoryId,
      intOwnerId: i?.intOwnerId,
      strOwnerName: i?.strOwnerName,
      strFileUrl: i?.strFileUrl,
      strFileName: i?.strFileName,
      strInsertBy: i?.strInsertBy,
      strApprovalStatus: i?.strApprovalStatus,
      isActive: false,
      insertDate: i?.insertDate,
      IntAccountId: i?.intAccountId,
    };

    const res = await createDoucument(payload);

    if (res?.statusCode === 200) {
      toaster.show({ message: res?.message, type: 'success' });
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
  };

  const approveOrReject = async (item: any, statusId: number) => {
    setIsMenu(!isMenu);
    //statusId 0 = pending, 1 = approve, 2 = reject
    const res = await createDoucumentApproval(
      item?.intOwnerId,
      item?.intDocumentId,
      item?.intAutoId,
      statusId,
    );
    if (res?.statusCode === 200) {
      toaster.show({ message: res?.message, type: 'success' });
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      toaster.show({ message: res?.message, type: 'error' });
    }
  };

  const downloadFile = async(file: any) => {
    const response = await fileService.FileDownload({
      fileId: file,
      fileName: "file"
    })
    toaster.show({ message: response?.message, type: response?.status ? 'success' : 'error' });

    // let image_URL = getImageURL(file);
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
    //     path: PictureDir + '/' + 'file',
    //     description: 'file',
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

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MIcon name="arrow-back" size={28} color={COLORS.blackish} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{title || 'Title'}</Text>
        </View>
        <View>
          <TouchableOpacity onPress={() => setIsMenu(!isMenu)}>
            <MIcon
              name="more-vert"
              size={26}
              color={COLORS.transparentBlack}
              style={{ paddingHorizontal: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isMenu && (
        <View
          style={[
            styles.popOver,
            {
              height:
                title === 'View' ? 100 : title === 'Application' ? 190 : 160,
            },
          ]}>
          {title === 'Application' && (
            <View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendOrApproval', {
                    item: item,
                    title: 'Send',
                    popFrom: 2,
                  })
                }
                style={[styles.textIconPopUp, { width: 65 }]}>
                <MIcon name="send" size={20} color={COLORS.transparentDark} />
                <Text style={styles.popOverText}>Send</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SendOrApproval', {
                    item: item,
                    title: 'Approve Request',
                    popFrom: 2,
                  })
                }
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
                  setIsMenu(!isMenu);
                  downloadFile(item?.strFileUrl);
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
                <MIcon name="delete" size={20} color={COLORS.transparentDark} />
                <Text style={styles.popOverText}>Delete</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('DocUploadFile', {
                    item: item,
                    title: 'Edit',
                    popFrom: 2,
                  })
                }
                style={[styles.textIconPopUp, { width: 60 }]}>
                <MIcon name="edit" size={20} color={COLORS.transparentDark} />
                <Text style={styles.popOverText}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}

          {title === 'Approval' && (
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
                <MIcon name="cancel" size={20} color={COLORS.transparentDark} />
                <Text style={styles.popOverText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}

          {title === 'Approval' || title === 'View' ? (
            <>
              <TouchableOpacity
                onPress={() => {
                  setIsMenu(!isMenu);
                  navigation.navigate('SendOrApproval', {
                    item: item,
                    title: 'Forward',
                    popFrom: 2,
                  });
                }}
                style={[styles.textIconPopUp, { width: 90 }]}>
                <MIcon name="send" size={20} color={COLORS.transparentDark} />
                <Text style={styles.popOverText}>Forward</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsMenu(!isMenu);
                  downloadFile(item?.strFileUrl);
                }}
                style={[styles.textIconPopUp, { width: 100 }]}>
                <MIcon
                  name="file-download"
                  size={20}
                  color={COLORS.transparentDark}
                />
                <Text style={styles.popOverText}>Download</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      )}

      <ScrollView>
        <TouchableOpacity
          onPress={() => {
            if (isMenu) {
              setIsMenu(!isMenu);
            }
          }}
          activeOpacity={1}
          style={styles.container}>
          <Text style={styles.title}>{item?.strDocumentTitle}</Text>
          <Text style={styles.subTitle}>
            Category: {item?.strDocCategoryName}
          </Text>

          {from === 'inbox-approval' && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.subTitle, { paddingRight: 10 }]}>
                Created By: {item?.strOwnerName?.trim()}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  //@ts-ignore
                  refRBSheet.current.open()
                }
                style={{ paddingLeft: 6 }}>
                <MIcon
                  name="info-outline"
                  size={20}
                  color={COLORS.transparentDark}
                  style={{ paddingHorizontal: 5 }}
                />
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.subTitle}>
            Create Date:{' '}
            {date_formater(item?.dteSharedDate || item?.insertDate)}
          </Text>

          {from === 'inbox-approval' && title === 'Approval' && (
            <Text style={styles.status}>Pending</Text>
          )}

          <View
            style={[
              styles.imagePart,
              { paddingBottom: item?.strFileUrl ? 150 : 0 },
            ]}>
            <Image
              source={{
                uri: getImageURL(item?.strFileUrl),
              }}
              style={styles.image}
            />
          </View>
        </TouchableOpacity>
        <RBSheet
          //@ts-ignore
          ref={refRBSheet}
          width={SIZES.width}
          height={SIZES.height / 1.2}
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
          <View style={styles.main}>
            <Text style={styles.title2}>Creator Info</Text>

            <ScrollView>
              {/* Creator Name */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="home-work"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {
                          singleEmployee?.employeeProfileLandingView
                            ?.strEmployeeName
                        }
                      </Text>
                      <Text style={styles.cmnTxt}>Name</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Workplace */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="business-center"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {
                          singleEmployee?.employeeProfileLandingView
                            ?.strWorkplaceName
                        }
                      </Text>
                      <Text style={styles.cmnTxt}>Workplace</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* SBU */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="lightbulb"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {
                          singleEmployee?.employeeProfileLandingView
                            ?.strBusinessUnitName
                        }
                      </Text>
                      <Text style={styles.cmnTxt}>SBU</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Payroll Group */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="tour"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.employeeProfileLandingView
                          ?.strPayrollGroupName
                          ? singleEmployee?.employeeProfileLandingView
                            ?.strPayrollGroupName
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Payroll Group</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Calender Type */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="today"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.employeeProfileLandingView
                          ?.strCalenderType
                          ? singleEmployee?.employeeProfileLandingView
                            ?.strCalenderType
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Calender Type</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Calender Name */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="today"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.employeeProfileLandingView
                          ?.strCalenderName
                          ? singleEmployee?.employeeProfileLandingView
                            ?.strCalenderName
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Calender Name</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Remuneration */}
              {/* <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon name="wysiwyg" size={20} color={COLORS.transparentBlack} />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.
                          ? singleEmployee?.RemunerationType
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Remuneration Type</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View> */}
              {/* Appointment Date */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="date-range"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.employeeProfileLandingView
                          ?.dteJoiningDate
                          ? date_formater(
                            singleEmployee?.employeeProfileLandingView
                              ?.dteJoiningDate,
                          )
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Appointment Date</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
              {/* Employment Type */}
              <View>
                <View style={styles.card}>
                  <View style={styles.iconPart}>
                    <View style={styles.info}>
                      <MIcon
                        name="tour"
                        size={20}
                        color={COLORS.transparentBlack}
                      />
                    </View>
                    <View style={styles.iconText}>
                      <Text style={styles.type}>
                        {singleEmployee?.employeeProfileLandingView
                          ?.employmentType
                          ? singleEmployee?.employeeProfileLandingView
                            ?.employmentType
                          : 'N/A'}
                      </Text>
                      <Text style={styles.cmnTxt}>Employment Type</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.bar} />
              </View>
            </ScrollView>
          </View>
        </RBSheet>
      </ScrollView>
    </View>
  );
};

export default DocDetails;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    zIndex: 0,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    elevation: 10,
    borderBottomColor: COLORS.borderBottom,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerTitle: {
    fontSize: 20,
    color: COLORS.blackish,
    fontWeight: '600',
    paddingLeft: 20,
  },
  popOver: {
    marginTop: Platform.OS === 'ios' ? 50 : 45,
    position: 'absolute',
    backgroundColor: COLORS.white,
    width: 200,
    height: 160,
    marginLeft: 180,
    marginRight: 200,
    zIndex: 1,
    elevation: 40,
    padding: 16,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: Platform.OS === 'ios' ? COLORS.softGray : '',
    shadowOpacity: Platform.OS === 'ios' ? 1 : 0,
  },
  title: {
    paddingTop: 20,
    fontSize: 18,
    lineHeight: 16,
    fontWeight: '500',
    letterSpacing: 0.2,
    color: COLORS.transparentText,
  },
  subTitle: {
    fontSize: 14,
    lineHeight: 16,
    paddingTop: 6,
    color: COLORS.transparentBlack,
  },
  imagePart: { marginTop: 10, alignItems: 'center' },
  image: {
    width: SIZES.width / 1.1,
    height: SIZES.height / 1.8,
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
    paddingLeft: 5,
  },
  status: {
    backgroundColor: '#FFF5D7',
    width: 75,
    textAlign: 'center',
    marginTop: 6,
    borderRadius: 4,
    fontSize: 14,
    color: '#B88205',
    paddingTop: 3,
    paddingBottom: 6,
  },

  main: {
    paddingHorizontal: 20,

    zIndex: 99999,
  },
  title2: {
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 24,
    letterSpacing: 0.5,
    color: COLORS.blackish,
    paddingBottom: 20,
  },
  bar: { height: 1, backgroundColor: COLORS.borderBottom, marginVertical: 10 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconPart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconText: {
    paddingLeft: 10,
  },
  type: {
    color: COLORS.blackish,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.5,
  },
  cmnTxt: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.5,
    color: COLORS.transparentBlack,
  },

  info: {
    overflow: 'hidden',
    borderRadius: 20,
    padding: 10,
    width: 41,
    height: 40,
    backgroundColor: COLORS.lightGray7,
  },
});
