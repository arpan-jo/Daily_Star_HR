import { useIsFocused, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import FastImage from 'react-native-fast-image';
import ImagePicker from 'react-native-image-crop-picker';
import { launchCamera } from 'react-native-image-picker';
import { PERMISSIONS, RESULTS, check } from 'react-native-permissions';
import QRCode from 'react-native-qrcode-svg';
import { Edge } from 'react-native-safe-area-context';
import Share from 'react-native-share';
import Feather from 'react-native-vector-icons/Feather';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  default as Icon,
  default as MaterialCommunityIcons,
} from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { captureRef } from 'react-native-view-shot';
import RNFetchBlob from 'react-native-blob-util';
import { arlURL } from '../../../../../App';
import {
  CreateEmployeeVisitingCardData,
  EmployeeVisitingCardInfo,
  SendContact,
} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTextNew from '../../../../common/components/CustomText';
import { useToast } from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
import { IMAGES } from '../../../../common/constant/Index';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { time_count_down } from '../../../../common/services/countDownTime';
import {
  date_formater,
  date_formaterWithoutYear,
} from '../../../../common/services/dateFormater';
import { getImageURL } from '../../../../common/services/getImage';
import { timeFormaterToPmAm } from '../../../../common/services/timeFormater';
import { uploadFileMultipart } from '../../../../common/services/uploadDocument';
import { clearProfileCache } from '../../../../common/services/profileCache';
import { ProfileDataType } from '../../../../interfaces/dashboard/employeeDashboard';
import {
  getEmployeeSelfDetails,
  getEmployeeSkillLandingData,
  getJdLandData,
} from '../../../../services/SaaS-modules/dashboard/employeeDashboard';
import {
  createSwitchLink,
  uploadProfileImages,
} from '../../../../services/SaaS-modules/employee-management/employee-managemnet';
import { useRootStore } from '../../../../stores/rootStore';
import BehaviorLibrayLanding from './Behavior-Libray/BehaviorLibrayLanding';
import CompetencyLanding from './Competency/CompetencyLanding';
import MyTasksLanding from './MyTasks/MyTasksLanding';
import CustomVisitingCard from '../../../../common/components/CustomVisitingCard';
import { empDirectoryCommon } from '../../../arl-core-modules/EmployeeDirectory';

const edges: Edge[] = ['right', 'bottom', 'left'];
interface CardDataInterface {
  name: string;
  company: string;
  designation: string;
  address: string;
  contact: string;
  email: string;
  other_contact?: string;
}
const EmpolyeeSelfDetails = ({ route }: any) => {
  const empDashboardData: any = route?.params?.empDashboardData || '';
  const navigation = useNavigation();
  const { userInfo, userInfoSave } = useRootStore();
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const toaster = useToast();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [jdLandingData, setJDLandingData] = useState<any>();
  const [totalJobRole, setTotalJobRole] = useState(0);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [skillsData, setSkillsData] = useState<any>([]);
  const { control, handleSubmit, setValue, reset } = useForm();
  const [selectedValue, setSelectedValue] = useState('employee');
  const [visitingCardData, setVisitingCardData] = useState<CardDataInterface>();
  const [resURL, setResURL] = useState<any>('');
  const [visitingCardImage, setVisitingCardImage] = useState();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(0);
  // Pull-to-refresh drops the cached profile, then re-runs the effect below —
  // which now finds nothing stored and refetches.
  const onPullRefresh = () => {
    clearProfileCache(userInfo?.intEmployeeId);
    setReload(n => n + 1);
  };
  const ref = useRef<any>();
  const phoneNumber =
    profileData?.employeeProfileLandingView?.strOfficeMobile ||
    profileData?.employeeProfileLandingView?.strPersonalMobile;
  const emailAdrress =
    profileData?.employeeProfileLandingView?.strOfficeMail ||
    profileData?.employeeProfileLandingView?.strPersonalMail;
  const strDesignation =
    profileData?.employeeProfileLandingView?.strDesignation ||
    userInfo?.strDesignation;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setIsLoadMore(false);

      const api_params = {
        url: SendContact,
        data: { employee: userInfo?.intEmployeeId },
      };
      const res = await httpRequest(api_params, () => {});
      setResURL(res);

      const profileRes = await getEmployeeSelfDetails(
        userInfo?.intEmployeeId,
        setIsLoading,
      );
      setProfileData(profileRes);
      const pdRes = await getJdLandData(userInfo?.intEmployeeId);
      setJDLandingData(pdRes);

      const uniqueRoleCodes = new Set();
      //======= Use Set to filter out duplicates=======
      pdRes?.jobDescriptions?.forEach((item: any) => {
        uniqueRoleCodes.add(item.roleCode);
      });
      const lengthWithoutDuplicates = uniqueRoleCodes.size;
      setTotalJobRole(lengthWithoutDuplicates);

      if (res?.sharingLink && Platform.OS === 'ios') {
        //@ts-ignore
        ref?.current?.capture()?.then(async uri => {
          const api_paramsForVisit = {
            url: EmployeeVisitingCardInfo,
            data: {
              employeeId: userInfo?.intEmployeeId,
              vCardFileId: 0,
              request: 'GetFileId',
            },
          };

          const getVisitImage = await httpRequest(api_paramsForVisit, () => {});
          setVisitingCardImage(getVisitImage?.vCardFileId);
          if (
            !getVisitImage?.vCardFileId &&
            uri &&
            (profileRes?.employeeProfileLandingView?.strPersonalMobile ||
              profileRes?.employeeProfileLandingView?.strOfficeMobile) &&
            (profileRes?.employeeProfileLandingView?.strOfficeMail ||
              profileRes?.employeeProfileLandingView?.strPersonalMail)
          ) {
            const dataa = {
              fileName: 'virtual_card.jpg',
              type: 'image/jpeg',
              uri: uri,
            };

            const imageForVisit = await uploadFileMultipart(
              userInfo?.intAccountId,
              userInfo?.intEmployeeId,
              userInfo?.intBusinessUnitId,
              dataa,
              () => {},
            );
            const api_para = {
              url: EmployeeVisitingCardInfo,
              data: {
                employeeId: userInfo?.intEmployeeId,
                vCardFileId: imageForVisit?.globalFileUrlId,
                request: 'SaveFileId',
              },
            };
            const resForVisitCardSave = await httpRequest(api_para, () => {});
            setVisitingCardImage(resForVisitCardSave?.vCardFileId);
          }
        });
      }
    },
    //@ts-ignore
    [userInfo, file?.globalFileUrlId, isLoadMore, isFocused, reload],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const skillData = await getEmployeeSkillLandingData(
        userInfo?.intEmployeeId,
      );
      setSkillsData(skillData);
    },

    //@ts-ignore
    [isFocused],
  );

  const handleUploadProfileImage = (type: string) => {
    const options = {
      cropping: true,
      cropperCircleOverlay: true,
      useFrontCamera: true,
      compressImageQuality: 0.6,
      showCropGuidelines: false,
      showCropFrame: false,
    };
    if (type !== 'camera') {
      ImagePicker.openPicker({
        ...options,
      }).then(image => {
        imageFormater(image);
      });
    } else {
      ImagePicker.openCamera(options)?.then(image => {
        imageFormater(image);
      });
    }
  };
  const imageFormater = (image: any) => {
    if (!image?.path) {
      return;
    }
    const res = {
      assets: [
        {
          // @ts-ignore
          fileName: userInfo?.strDisplayName?.replaceAll(' ', '') + '.jpg',
          fileSize: 1000,
          height: 300,
          type: image?.mime,
          uri: image?.path,
          width: 300,
        },
      ],
    };
    upload(res);
  };

  const upload = async (res: any) => {
    // @ts-ignore
    refRBSheet?.current?.close();
    const response = await uploadProfileImages(
      userInfo?.intAccountId,
      userInfo?.intEmployeeId,
      userInfo?.intBusinessUnitId,
      userInfo?.intEmployeeId,
      res?.assets?.[0],
      setIsLoading,
    );
    if (response) {
      const updtedLoginInfo = {
        ...userInfo,
        intProfileImageUrl: response?.globalFileUrlId,
      };
      //@ts-ignore
      userInfoSave(updtedLoginInfo);
      // The stored profile still has the old image id — drop it so the effect
      // re-run below refetches instead of restoring the stale copy.
      clearProfileCache(userInfo?.intEmployeeId);
      setFile(response);
      toaster.show({
        message: 'Profile uploaded successfully.',
        type: 'success',
      });
    }
  };

  const switchLinkHandler = async (data: any) => {
    const payload = {
      partType: 'SwitchBoardCreateAndUpdate',
      employeeId: userInfo?.intEmployeeId,
      insertByEmpId: userInfo?.intEmployeeId,
      name: data?.switchName,
      description: data?.switchLInk,
    };
    const res = await createSwitchLink(payload, setIsLoading);
    if (res?.statusCode === 200) {
      setIsDisable(false);
      reset();
      // @ts-ignore
      refRBSheet1?.current?.close();
      toaster.show({ message: res?.message, type: 'success' });
    }
    if (res?.statusCode === 500) {
      setIsDisable(false);
      toaster.show({ message: res?.message, type: 'error' });
    }
    if (res?.StatusCode === 500) {
      setIsDisable(false);
      toaster.show({ message: res?.Message, type: 'error' });
    }
  };

  // const saveReactionHandler = async (
  //   jd: any,
  //   bookOrReaction: string,
  //   isBookmarkOrReaction: boolean | string,
  // ) => {
  //   const payload = {
  //     jid: jd?.jdId,
  //     reaction:
  //       bookOrReaction === 'reaction' ? isBookmarkOrReaction : jd?.reaction,
  //     employeeID: userInfo?.intEmployeeId,
  //     isBookmark:
  //       bookOrReaction === 'bookmarked' ? isBookmarkOrReaction : jd?.isBookmark,
  //     eisenhowerMatrix: jd?.eisenhowerMatrix,
  //     responsibilityMatrix: jd?.responsibilityMatrix,
  //   };

  //   const res = await createJobDescReaction(payload, setIsLoading);
  //   if (res?.statusCode === 200) {
  //     reset();
  //     setIsLoadMore(true);
  //     toaster.show({message: res?.message, type: 'success'});
  //   } else {
  //     toaster.show({message: 'Try again', type: 'error'});
  //   }
  // };

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
  const shareMyVisitingCard = async () => {
    try {
      ref?.current?.capture()?.then(async (uri: string) => {
        const shareOptions = {
          social: Share.Social.FACEBOOK,
          message: 'Business Card',
          url: uri,
        };
        await Share.open(shareOptions);
      });
    } catch (_error) {
      toaster.show({ message: 'Try again.', type: 'error' });
    }
  };

  const shareVcard = async () => {
    const shareOptions = {
      url: resURL?.sharingLink,
    };
    try {
      const _ShareResponse = await Share.open(shareOptions);
    } catch (_error) {}
  };

  const convertToList = (data: CardDataInterface | undefined) => {
    // const result = [];
    // for (const key in data) {
    //   if (data[key]) {
    //     result.push({
    //       strType: key,
    //       strDescription: data[key]?.trim(),
    //       intAutoId: 0,
    //       intEmployeeId: userInfo?.intEmployeeId,
    //       intCreatedBy: userInfo?.intEmployeeId,
    //       strUserType: selectedValue,
    //     });
    //   }
    // }
    // return result;.

    const payload = {
      intEmployeeId: userInfo?.intEmployeeId,
      intCreatedBy: userInfo?.intEmployeeId,
      strUserType: selectedValue,
      strAddress: data?.address || '',
      strCompany: data?.company || '',
      strContact: data?.contact || '',
      strDesignation: data?.designation || '',
      strEmail: data?.email || '',
      strName: data?.name || '',
      strOtherContact: data?.other_contact || '',
    };
    return payload;
  };

  const downloadVcard = async () => {
    const { config, fs, ios } = RNFetchBlob;

    let PictureDir =
      Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;

    if (Platform.OS === 'ios') {
      if (!visitingCardImage) {
        // setRenderAgain(true);
        toaster.show({
          message: 'Try Again',
          type: 'warning',
        });
        return;
      }
      const resImage = getImageURL(visitingCardImage);
      let options = {
        indicator: true,
        fileCache: true,
        appendExt: '.png',
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: PictureDir + '/' + 'visiting_card.png',
          description: 'document',
        },
      };
      config(options)
        .fetch('GET', resImage)

        .then(res => {
          // if (res?.data && Platform.OS === 'android') {
          //   Alert.alert('', 'Your visiting card download complete', [
          //     {text: 'OK', onPress: () => console.log('OK Pressed')},
          //   ]);
          // }
          if (res?.data && Platform.OS === 'ios') {
            fs.writeFile(PictureDir, res?.data, 'base64');
            ios.previewDocument(res?.data);
          }
        });
    } else {
      const uri = await captureRef(ref, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      const path = `${PictureDir}/app_vcard${Math.random().toFixed(3)}.png`;
      fs.writeFile(path, uri, 'base64')
        .then(() => {
          // if (Platform.OS === 'android') {
          Alert.alert('', 'Download complete. Please check Gallery', [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
          // }
          // if ( Platform.OS === 'ios') {
          //   fs.writeFile(PictureDir, res?.data, 'base64');
          //   ios.previewDocument(res?.data);
          // }
        })
        .catch(error => {
          console.error('Error saving screenshot: ', error);
        });
    }
  };
  const handleRadioPress = (value: any) => {
    setSelectedValue(value);
  };

  const handleImage = async () => {
    const options: any = {
      mediaType: 'photo',
      includeBase64: false,
      selectionLimit: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.7,
      saveToPhotos: true,
    };

    await launchCamera(options, async response => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'App Camera Permission',
            message: 'App needs access to your camera ',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        const iosGranted = await check(PERMISSIONS.IOS.CAMERA);

        if (
          granted === PermissionsAndroid.RESULTS.GRANTED ||
          RESULTS.GRANTED === iosGranted
        ) {
          if (response?.didCancel) {
            console.log('User cancelled image picker');
          } else if (response?.errorCode) {
            console.log('ImagePicker Error: ', response?.errorMessage);
          } else {
            try {
              const formData = new FormData();
              formData.append('file', {
                uri: response?.assets?.[0]?.uri,
                type: response?.assets?.[0]?.type,
                name: response?.assets?.[0]?.fileName || 'file',
              });
              const customBaseUrlAxiosInstance = axios.create({
                baseURL: 'https://ocr.ibos.io',
              });
              setIsLoading(true);
              const responses = await customBaseUrlAxiosInstance.post(
                '/visiting_card_ocr',
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Accept: 'application/json',
                  },
                },
              );
              setIsLoading(false);
              setVisitingCardData(responses?.data);
              if (responses?.data?.name) {
                setModalShow(true);
              }
            } catch (error) {
              console.log(JSON.stringify(error, null, 2));
              setIsLoading(false);
              toaster.show({
                type: 'warning',
                //@ts-ignore
                message: error?.message || 'Try again.',
              });
            }
          }
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const _addContact = async (data: any) => {
    const newPerson = {
      emailAddresses: [
        {
          label: 'work',
          email: data?.email,
        },
      ],
      phoneNumbers: [
        {
          label: 'mobile',
          number: data?.contact?.toString()?.split(',')?.[0] || data?.contact,
        },
      ],
      displayName: data?.name,
      company: data?.company,
      postalAddresses: [
        {
          label: 'address',
          formattedAddress: data?.address,
          street: '',
          pobox: '',
          neighborhood: '',
          city: '',
          region: '',
          state: '',
          postCode: '',
          country: '',
        },
      ],
      jobTitle: data?.designation,
    };

    Contacts.openContactForm(newPerson).then(contact => {
      console.log(contact);
      toaster.show({
        message: 'Saved Successfully',
        type: 'success',
      });
      setVisitingCardData(undefined);
    });
  };

  const handleSubmitVcardTag = async () => {
    const payload = convertToList(visitingCardData);

    if (payload?.strContact) {
      const api_params = {
        url: CreateEmployeeVisitingCardData,
        data: payload,
        method: 'post',
      };
      const response = await httpRequest(api_params, setIsLoading);
      if (
        response?.statusCode === 200 ||
        response?.StatusCode === 200 ||
        response?.statuscode === 200
      ) {
        setModalShow(false);
        // await addContact(visitingCardData);
        setVisitingCardData(undefined);
        toaster.show({
          message: 'Saved Successfully',
          type: 'success',
        });
      } else {
        toaster.show({
          type: 'warning',
          message: response?.message || 'Something Went Wrong!',
        });
      }
    }
  };

  return (
    <ContainerNew
      edges={edges}
      refreshing={refreshing}
      setRefresh={setRefreshing}
      apiCall={onPullRefresh}
      header={
        <>
          <CustomHeader onBackPress={navigation.goBack} title="Profile" />
        </>
      }
      style={styles.main}
    >
      {isLoading ? (
        <ActivityIndicator
          color={COLORS.primary}
          size={'large'}
          style={styles.activityIndi}
        />
      ) : null}

      <View style={styles.pHorizontal}>
        <View style={styles.flexRow}>
          <View style={styles.width25}>
            {profileData?.employeeProfileLandingView?.intEmployeeImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    profileData?.employeeProfileLandingView
                      ?.intEmployeeImageUrlId,
                  ),
                }}
                style={styles.profileImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.profileImage} />
            )}
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.open()
              }
            >
              <Icon
                name="camera-outline"
                style={styles.cam}
                size={30}
                color={COLORS.blackish}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.width75}>
            <Text style={styles.employeeName}>
              {profileData?.employeeProfileLandingView?.strEmployeeName}
            </Text>
            <Text style={styles.empSubData}>
              {profileData?.employeeProfileLandingView?.strDesignation}
            </Text>

            {arlURL === userInfo?.strUrl ? (
              <View style={styles.rowSpaceBtn}>
                <Text style={styles.empSubData}>
                  {profileData?.employeeProfileLandingView?.strReferenceId}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('EmployeeAddLink');
                    // refRBSheet1?.current?.open();
                  }}
                  style={styles.rowFlexEnd}
                >
                  <MIcon
                    name="link"
                    size={22}
                    color={COLORS.white}
                    style={{
                      transform: [{ rotate: '135deg' }],
                    }}
                  />
                  <Text style={styles.addTxt}>Add</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        <View style={[styles.borderBottomWidth, styles.profileDivider]} />
        <View>
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon
                name="business-center"
                size={25}
                color={COLORS.iconColor}
              />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strDepartment}
              </Text>
              <Text style={styles.commonTextTitle}>Department</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="cake" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.dteDateOfBirth
                  ? date_formaterWithoutYear(
                      profileData?.employeeProfileLandingView?.dteDateOfBirth,
                    )
                  : 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Date of Birth</Text>
            </View>
          </View>

          <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="person" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strGender}
              </Text>
              <Text style={styles.commonTextTitle}>Gender</Text>
            </View>

            <View style={styles.divider} />
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.employeeProfileLandingView?.strReligion}
              </Text>
              <Text style={styles.commonTextTitle}>Religion</Text>
            </View>
          </View>
        </View>
      </View>

      {userInfo?.strUrl === arlURL ? (
        <>
          {/* =========virtual card start==========  */}
          <View style={[styles.bar]} />
          <View style={styles.pHorizontal}>
            <CustomTextNew
              txtSize={18}
              lineHight={28}
              txtWeight={'600'}
              text={'Virtual Card'}
            />
            <CustomTextNew
              txtColor={COLORS.graySubText}
              txtSize={12}
              lineHight={28}
              txtWeight={'400'}
              text={'Instant access to you virtual official card'}
            />
            <View style={{ flexDirection: 'row', paddingTop: 10 }}>
              <View style={styles.leftCard}>
                {resURL?.sharingLink ? (
                  <QRCode
                    value={resURL?.sharingLink}
                    size={SIZES.width / 2.8}
                  />
                ) : null}
              </View>
              <View style={styles.rightCard}>
                <TouchableOpacity
                  style={styles.leftCardContainer}
                  onPress={() => shareVcard()}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={17}
                    color={'green'}
                  />
                  <Text style={styles.shareTitle}>Send my Contact</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leftCardContainer}
                  onPress={() => shareMyVisitingCard()}
                >
                  <Ionicons
                    name="share-social-outline"
                    size={17}
                    color={'green'}
                  />
                  <Text style={styles.shareTitle}>Send my Business Card</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.leftCardContainer}
                  onPress={() => {
                    handleImage();
                  }}
                >
                  <Ionicons name="pricetag-outline" size={17} color={'green'} />
                  <Text style={styles.shareTitle}>Capture Business Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={!emailAdrress || !phoneNumber ? true : false}
                  onPress={() => downloadVcard()}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginVertical: 5,
                  }}
                >
                  <Feather name="download" size={17} color={'green'} />
                  <Text style={styles.shareTitle}>Download Business Card</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* =========virtual card end here==========  */}
        </>
      ) : null}

      <View style={[styles.bar]} />
      <View style={styles.pHorizontal}>
        <Text style={styles.myLeaveTitle}>Bank Information</Text>
        <View style={styles.bankInfoCard}>
          <Text style={[styles.myLeaveTitle, styles.bankWalletTxt]}>
            {profileData?.empEmployeeBankDetail?.strBankWalletName || 'N/A'}
          </Text>
          <Text style={styles.commonTextTitle}>
            {profileData?.empEmployeeBankDetail?.strBranchName || 'N/A'}
          </Text>
          <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="tour" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strRoutingNo || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Routing Number</Text>
            </View>

            <View style={styles.divider} />
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strSwiftCode || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>SWFIT Code</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="account-circle" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strAccountName || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Account Name</Text>
            </View>
          </View>
          <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          <View style={styles.flexRow}>
            <View style={styles.width10}>
              <MIcon name="account-circle" size={25} color={COLORS.iconColor} />
            </View>
            <View>
              <Text style={styles.commonTextData}>
                {profileData?.empEmployeeBankDetail?.strAccountNo || 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Account Number</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.bar]} />

      {/* time calendar section */}
      <View style={styles.pHorizontal}>
        <Text style={styles.myLeaveTitle}>Time Calendar</Text>
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="watch-later" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {time_count_down(
                empDashboardData?.employeeDashboardViewModel?.checkIn,
                empDashboardData?.employeeDashboardViewModel?.checkOut,
              )}
            </Text>
            <Text style={styles.commonTextTitle}>Today Working Period</Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="hourglass-bottom" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {`${timeFormaterToPmAm(
                empDashboardData?.employeeDashboardViewModel?.calendarStartTime,
              )} - ${timeFormaterToPmAm(
                empDashboardData?.employeeDashboardViewModel?.calendarEndTime,
              )}`}
            </Text>
            <Text style={styles.commonTextTitle}>General Calendar</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* activity history section */}
      <View style={styles.pHorizontal}>
        <Text style={styles.myLeaveTitle}>Activity History</Text>
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="lightbulb" size={25} color={COLORS.iconColor} />
          </View>
          <View>
            <Text style={styles.commonTextData}>
              {empDashboardData?.employeeDashboardViewModel?.serviceLength}
            </Text>
            <Text style={styles.commonTextTitle}>Length of Service</Text>
          </View>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
        <View style={styles.flexRow}>
          <View style={styles.width10}>
            <MIcon name="today" size={25} color={COLORS.iconColor} />
          </View>
          <View style={styles.flexRow}>
            <View>
              <Text style={styles.commonTextData}>
                {date_formater(
                  empDashboardData?.employeeDashboardViewModel?.joiningDate,
                )}
              </Text>
              <Text style={styles.commonTextTitle}>Joining Date</Text>
            </View>
            <View style={styles.conDateDivider} />
            <View>
              <Text style={styles.commonTextData}>
                {empDashboardData?.employeeDashboardViewModel?.confirmationDate
                  ? date_formater(
                      empDashboardData?.employeeDashboardViewModel
                        ?.confirmationDate,
                    )
                  : 'N/A'}
              </Text>
              <Text style={styles.commonTextTitle}>Confirmation Date</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {userInfo?.strUrl === arlURL ? (
        <>
          {/* ============Business Goal==================== */}
          {/* <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, {paddingBottom: 4}]}>
              Business Goal
            </Text>
            <CustomTextNew
              text={
                'You can leverage your available resources and capabilities to achieve your goal. It will reflected in your KPIs'
              }
              txtColor={COLORS.graySubText}
              txtSize={13}
              lineHight={20}
            />

            <BusinessGoalLanding />
          </View>
          <View style={[styles.bar]} /> */}

          {/*==== Business Operational Task====  */}
          <View style={styles.pHorizontal}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.7 }}>
                <Text style={[styles.myLeaveTitle, { paddingBottom: 4 }]}>
                  Business Operational Task
                </Text>
                <View>
                  <CustomTextNew
                    text={
                      'Unifying systems, streamlining process and empowering activities'
                    }
                    txtColor={COLORS.graySubText}
                    txtSize={14}
                    lineHight={20}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 0.3,

                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <Icon name="target" size={50} color={'#9dc9a3'} />
              </View>
            </View>

            <MyTasksLanding />
          </View>
          <View style={[styles.bar]} />

          {/* ==========Resources=========  */}
          <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, { paddingBottom: 4 }]}>
              Resources
            </Text>
            <CustomTextNew
              text={
                "Align your job description with your company's core values"
              }
              txtColor={COLORS.graySubText}
              txtSize={13}
              lineHight={20}
            />
          </View>
          <View style={[styles.bar]} />

          {/*============job description section========== */}
          <View style={styles.pHorizontal}>
            <CustomTextNew
              text={'Job Description'}
              txtWeight={'600'}
              txtSize={18}
              lineHight={18}
              txtColor={COLORS.textNewColor}
            />
            <View style={styles.infoIconContainer}>
              {/* <MIcon
                name="info-outline"
                size={15}
                style={{marginRight: 5}}
                color={COLORS.graySubText}
              /> */}
              <CustomTextNew
                text={`Your total job Role ID for this position is ${totalJobRole}`}
                txtSize={13}
                lineHight={18}
                txtColor={COLORS.graySubText}
              />
            </View>
            {jdLandingData?.jobDescriptions?.map((item: any, ind: number) => (
              <View key={ind}>
                <>
                  {item?.jobDescriptionRows
                    ?.slice(0, 3)
                    ?.map((itemRow: any, itemIndex: number) => (
                      <View
                        key={itemIndex}
                        style={[
                          styles.activeReaction,
                          {
                            borderBottomWidth:
                              item?.jobDescriptionRows?.slice(0, 3)?.length -
                                1 ===
                              itemIndex
                                ? 0
                                : 1,
                          },
                        ]}
                      >
                        <View style={styles.rowItemBox}>
                          {/* <View style={{marginRight: 3}}>
                            <TouchableOpacity
                              onPress={() => {
                                saveReactionHandler(
                                  itemRow,
                                  'bookmarked',
                                  !itemRow?.isBookmark,
                                );
                              }}>
                              <MIcon
                                name={
                                  itemRow?.isBookmark ? 'star' : 'star-outline'
                                }
                                size={22}
                                color={
                                  itemRow.isBookmark
                                    ? COLORS.yellow
                                    : COLORS.deepGray
                                }
                              />
                            </TouchableOpacity>
                          </View> */}

                          {jdLandingData?.jobDescriptions[0]?.jobDescriptionRows
                            .length > 3 ? (
                            <TouchableOpacity
                              style={{ flex: 1 }}
                              onPress={() => {
                                const jdData = {
                                  roleID: item?.roleID,
                                  jd: itemRow,
                                };
                                //@ts-ignore
                                navigation.navigate('JobDescriptionDetails', {
                                  jdData,
                                });
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                }}
                              >
                                <View style={{ flex: 1 }}>
                                  <View style={[styles.jobStatus]}>
                                    <Text style={styles.roleCodeTxt}>
                                      {item?.roleCode}
                                    </Text>
                                  </View>
                                </View>

                                {/* <View style={{flex: 0.4}}>
                                  <View style={styles.likeIcon}>
                                    <TouchableOpacity
                                      onPress={() => {
                                        saveReactionHandler(
                                          itemRow,
                                          'reaction',
                                          itemRow?.reaction === 'like'
                                            ? ''
                                            : 'like',
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
                                </View> */}

                                {/* <View>
                                  <TouchableOpacity
                                    onPress={() => {
                                      const jdData = {
                                        roleID: item?.roleID,
                                        jd: itemRow,
                                      };

                                      navigation.navigate(
                                        'JobDescriptitonMatrix',
                                        {
                                          jdData,
                                        },
                                      );
                                    }}>
                                    <Icon
                                      name="dots-vertical"
                                      size={18}
                                      color={'gray'}
                                      style={{marginHorizontal: 3}}
                                    />
                                  </TouchableOpacity>
                                </View> */}
                              </View>

                              <View
                                style={{
                                  marginVertical: 5,
                                  flexDirection: 'row',
                                }}
                              >
                                {itemRow?.responsibilityMatrix && (
                                  <View
                                    style={[
                                      styles.jobStatus,
                                      {
                                        marginRight: 5,
                                        backgroundColor: '#667780',
                                        paddingVertical: 3,
                                      },
                                    ]}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        color: COLORS.white,
                                        fontWeight: '500',
                                      }}
                                    >
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
                                    ]}
                                  >
                                    <Text
                                      style={{
                                        fontSize: 12,
                                        color: COLORS.white,
                                        fontWeight: '500',
                                      }}
                                    >
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
                          ) : (
                            <></>
                          )}
                        </View>
                      </View>
                    ))}
                </>
              </View>
            ))}

            {jdLandingData?.jobDescriptions[0]?.jobDescriptionRows?.length >
            3 ? (
              <TouchableOpacity
                style={{ alignSelf: 'center', marginTop: 10 }}
                onPress={() => navigation.navigate('JobDescriptionIndex')}
              >
                <Row align="center">
                  <CustomTextNew
                    text={'View All Job Description'}
                    lineHight={25}
                    txtWeight={'500'}
                    txtSize={14}
                    txtColor={COLORS.darkGray}
                  />
                  <View style={{ marginLeft: 5 }}>
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
          <View style={[styles.bar]} />

          {/*========= Core value======  */}
          <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, { paddingBottom: 3 }]}>
              Core Values
            </Text>
            <CustomTextNew
              text={
                'Company core values set out the central, guiding beliefs and principles that underpin a company'
              }
              txtColor={COLORS.graySubText}
              txtSize={13}
              lineHight={20}
            />

            {/* behavior landing  */}
            <BehaviorLibrayLanding />
          </View>
          <View style={[styles.bar]} />

          {/* =====job Specification section==== */}
          <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, { paddingBottom: 3 }]}>
              Job Specification
            </Text>
            {jdLandingData?.jobSpecifications?.map((item: any, ind: number) => (
              <View key={ind}>
                <Text style={styles.itemHeader}>
                  Role:{item?.empRoleName} ({item?.empRoleCode})
                </Text>
                {item?.educationalQualification ? (
                  <Text style={styles.rowItem}>
                    1. {item?.educationalQualification}
                  </Text>
                ) : null}
                {item?.experience ? (
                  <Text style={styles.rowItem}>2. {item?.experience}</Text>
                ) : null}
                {item?.functionalSkills ? (
                  <Text style={styles.rowItem}>
                    3. {item?.functionalSkills}
                  </Text>
                ) : null}
                {item?.age ? (
                  <Text style={styles.rowItem}>4. {item?.age}</Text>
                ) : null}
              </View>
            ))}
          </View>
          <View style={[styles.bar]} />

          {/* ==========Capabilities=========  */}
          <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, { paddingBottom: 4 }]}>
              Capabilities
            </Text>
            <CustomTextNew
              text={
                "Align your job description with your company's core values"
              }
              txtColor={COLORS.graySubText}
              txtSize={13}
              lineHight={20}
            />
          </View>
          <View style={[styles.bar]} />

          {/*========= Competency======  */}
          <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, { paddingBottom: 3 }]}>
              Competency
            </Text>
            <View style={styles.editableIcon}>
              <CustomTextNew
                text={'You can add additional competency'}
                txtColor={COLORS.graySubText}
                txtSize={13}
                lineHight={20}
              />
              {/* <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => navigation.navigate('CompetencyCreate')}>
              <Icon name="plus" size={23} color={COLORS.darkGray} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CompetencyEdit')}>
              <MIcon name="edit" size={19} color={COLORS.darkGray} style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View> */}
            </View>

            <CompetencyLanding />
          </View>
          <View style={[styles.bar]} />

          {/*========== Organiztional Tree==========  */}
          {/* <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, {paddingBottom: 3}]}>
              Organizational Tree
            </Text>
            <CustomTextNew
              text={
                'fundamental in providing a comprehensive understanding of the organization'
              }
              txtColor={COLORS.graySubText}
              txtSize={13}
              lineHight={20}
            />
            <OrganizationalTreeLanding />
          </View>
          <View style={[styles.bar]} /> */}

          {/*========= Performance Entry======  */}
          <View style={styles.pHorizontal}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.7 }}>
                <Text style={[styles.myLeaveTitle, { paddingBottom: 5 }]}>
                  Performance Management
                </Text>
                <View>
                  <CustomTextNew
                    text={
                      'Continuous improvement is the key to achieving excellence in performance.'
                    }
                    txtColor={COLORS.graySubText}
                    txtSize={14}
                    lineHight={20}
                  />
                </View>
              </View>
              <View
                style={{
                  flex: 0.3,

                  justifyContent: 'center',
                  alignItems: 'flex-end',
                }}
              >
                <Icon
                  name="chart-timeline-variant"
                  size={50}
                  color={'#9dc9a3'}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => navigation.navigate('PerformanceEntry')}
            >
              <Row align="center">
                <CustomTextNew
                  text={'View Details'}
                  lineHight={25}
                  txtWeight={'500'}
                  txtSize={14}
                  txtColor={COLORS.primary}
                />
                <View style={{ marginLeft: 5 }}>
                  <MIcon
                    name="arrow-forward-ios"
                    size={14}
                    color={COLORS.primary}
                  />
                </View>
              </Row>
            </TouchableOpacity>
          </View>
          <View style={[styles.bar]} />

          {/*========= key Interaction======  */}
          {/* <View style={styles.pHorizontal}>
            <Text style={[styles.myLeaveTitle, {paddingBottom: 3}]}>
              Key Interaction
            </Text>
            <View style={styles.editableIcon}>
              <CustomTextNew
                text={'You can add key interaction'}
                txtColor={COLORS.graySubText}
                txtSize={14}
                lineHight={20}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('KeyInteractionCreate')}>
                  <Icon name="plus" size={23} color={COLORS.darkGray} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('KeyInteractionCreate')}>
                  <MIcon
                    name="edit"
                    size={19}
                    color={COLORS.darkGray}
                    style={{marginLeft: 10}}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <KeyInteractionLanding />
          </View>
          <View style={[styles.bar]} /> */}

          {/* =======skills===========  */}
          <View style={styles.pHorizontal}>
            <View style={styles.skillsContainer}>
              <CustomTextNew
                txtSize={18}
                lineHight={28}
                txtWeight={'600'}
                // text={'Talent (Extra curricular activities)'}
                text={'Skills'}
              />
              <TouchableOpacity
                style={{ flexDirection: 'row' }}
                onPress={() => {
                  navigation.navigate('EmployeeAddEditSkill');
                }}
              >
                <Text style={styles.skillsBtn}>+ Add/Edit</Text>
              </TouchableOpacity>
            </View>

            {skillsData.Length > 0
              ? skillsData?.slice(0, 3)?.map((item: any, index: number) => (
                  <View key={index}>
                    <CustomTextNew
                      txtColor={COLORS.graySubText}
                      txtSize={14}
                      lineHight={28}
                      txtWeight={'400'}
                      text={item?.strSkillName || 'N/A'}
                    />
                    <View
                      style={[
                        styles.borderBottomWidth,
                        styles.marginHorizontal,
                      ]}
                    />
                  </View>
                ))
              : null}

            {skillsData?.Length > 3 ? (
              <TouchableOpacity
                style={{ alignSelf: 'center' }}
                onPress={() => navigation.navigate('EmpolyeeSkills')}
              >
                <Text
                  style={styles.showAllSkills}
                >{`View All ${skillsData?.Length} skills  >`}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={[styles.bar]} />
        </>
      ) : null}

      {/* manager list section */}
      <View style={styles.pHorizontal}>
        <Text style={styles.myLeaveTitle}>My Manager</Text>
        <View style={styles.flexRow}>
          <View style={styles.width15}>
            {empDashboardData?.employeeDashboardViewModel
              ?.intLineManagerImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    empDashboardData?.employeeDashboardViewModel
                      ?.intLineManagerImageUrlId,
                  ),
                }}
                style={styles.managerImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
            )}
          </View>
          <View style={styles.widthPadding}>
            <Text style={styles.managerTitle}>
              {empDashboardData?.employeeDashboardViewModel?.lineManager}
            </Text>
            <Text style={styles.managerText}>Manager</Text>
            <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />
          </View>
        </View>
        {userInfo?.strUrl === arlURL ? (
          <View />
        ) : (
          <View style={styles.flexRow}>
            <View style={styles.width15}>
              {empDashboardData?.employeeDashboardViewModel
                ?.intDottedSupervisorImageUrlId ? (
                <FastImage
                  source={{
                    uri: getImageURL(
                      empDashboardData?.employeeDashboardViewModel
                        ?.intDottedSupervisorImageUrlId,
                    ),
                  }}
                  style={styles.managerImage}
                />
              ) : (
                <FastImage
                  source={IMAGES.NoImage}
                  style={styles.managerImage}
                />
              )}
            </View>
            <View style={styles.widthPadding}>
              <Text style={styles.managerTitle}>
                {empDashboardData?.employeeDashboardViewModel?.dottedSupervisor}
              </Text>
              <Text style={styles.managerText}>Dotted Supervisor</Text>
              <View
                style={[styles.borderBottomWidth, styles.marginHorizontal]}
              />
            </View>
          </View>
        )}
        <View style={styles.flexRow}>
          <View style={styles.width15}>
            {empDashboardData?.employeeDashboardViewModel
              ?.intSupervisorImageUrlId ? (
              <FastImage
                source={{
                  uri: getImageURL(
                    empDashboardData?.employeeDashboardViewModel
                      ?.intSupervisorImageUrlId,
                  ),
                }}
                style={styles.managerImage}
              />
            ) : (
              <FastImage source={IMAGES.NoImage} style={styles.managerImage} />
            )}
          </View>
          <View style={styles.widthPadding}>
            <Text style={styles.managerTitle}>
              {empDashboardData?.employeeDashboardViewModel?.supervisor}
            </Text>
            <Text style={styles.managerText}>Supervisor</Text>
          </View>
        </View>
      </View>
      <View style={[styles.bar]} />

      {/* administration information */}
      <View style={styles.pHorizontal}>
        <Text style={styles.myLeaveTitle}>Administration Information</Text>
        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Business Unit {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strBusinessUnitName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Workplace Group {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strWorkplaceGroupName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Workplace {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strWorkplaceName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Payroll Group {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strPayrollGroupName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Payscale Grade {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strPayscaleGradeName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Calendar Type {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strCalenderType ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Calendar Name {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strCalenderName ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Joining Date {'   '}
            <Text style={[styles.commonTextData]}>
              {date_formater(
                profileData?.employeeProfileLandingView?.dteJoiningDate ||
                  'N/A',
              )}
            </Text>
          </Text>
        </View>
        <View style={[styles.borderBottomWidth, styles.marginHorizontal]} />

        <View>
          <Text style={[styles.commonTextTitle, styles.fontSize14]}>
            Employee Type {'   '}
            <Text style={[styles.commonTextData]}>
              {profileData?.employeeProfileLandingView?.strEmploymentType ||
                'N/A'}
            </Text>
          </Text>
        </View>
        <View style={styles.bottomSpace} />

        {userInfo?.strUrl === arlURL ? (
          <View
            style={{
              marginTop: 10000,
            }}
          >
            {phoneNumber && emailAdrress && userInfo ? (
              <CustomVisitingCard
                phoneNumber={phoneNumber}
                emailAddress={emailAdrress}
                strDesignation={strDesignation}
                userInfo={userInfo}
                resURL={resURL}
                viewShotRef={ref}
              />
            ) : null}
          </View>
        ) : null}

        {/* {phoneNumber && emailAdrress ? (
          <>
            <View
              style={{
                marginBottom: 10000,
              }}
            />
            <View
              style={{
                alignSelf: 'center',
                backgroundColor: COLORS.white,
              }}>
              <ViewShot
                style={{
                  backgroundColor: COLORS.white,
                  width: SIZES.width,
                  alignItems: 'center',
                }}
                //@ts-ignore
                ref={ref}
                options={{
                  fileName: 'VCARD',
                  format: 'jpg',
                  quality: 0.9,
                }}>
                {userInfo?.intBusinessUnitId === 232 ? (
                  <View style={styles.cardContainer}>
                    <FastImage
                      source={IMAGES.feedVisitingCard2}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="contain"
                    />
                    <View style={{position: 'absolute', right: 50, bottom: 40}}>
                      <QRCode
                        value={resURL?.sharingLink}
                        size={SIZES.width / 6.3}
                      />
                    </View>
                    <View style={styles.dynamicContent}>
                      <Text style={styles.titleTxt}>
                        {userInfo?.strDisplayName || ''}
                      </Text>
                      <Text style={styles.designationTxt}>
                        {strDesignation || ''}
                      </Text>
                      <View
                        style={{
                          marginTop: 5,
                          backgroundColor: 'white',
                          paddingLeft: 10,
                          marginLeft: -10,
                        }}>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="telephone"
                              color={COLORS.black}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text style={styles.numTxt}>{phoneNumber}</Text>
                          </View>
                        </Row>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="mail"
                              color={COLORS.black}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text
                              style={[
                                styles.numTxt,
                                {
                                  fontFamily: 'HelveticaNeue_Medium',
                                  fontSize: 11,
                                },
                              ]}>
                              {emailAdrress}
                            </Text>
                          </View>
                        </Row>
                      </View>
                    </View>

                    <View
                      style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        top: 40,
                        left: 30,
                        paddingLeft: 10,
                      }}>
                      <Row align="center">
                        <View>
                          <Foundation
                            name="web"
                            color={COLORS.black}
                            size={15}
                          />
                        </View>
                        <View style={{marginLeft: 5}}>
                          <Text style={styles.numTxt}>
                            www.akijresource.com
                          </Text>
                        </View>
                      </Row>
                      <Row align="center">
                        <View>
                          <Foundation
                            name="mail"
                            color={COLORS.black}
                            size={15}
                          />
                        </View>
                        <View style={{marginLeft: 5}}>
                          <Text
                            style={[
                              styles.numTxt,
                              {
                                fontFamily: 'HelveticaNeue_Medium',
                                fontSize: 11,
                              },
                            ]}>
                            info@akijresource.com
                          </Text>
                        </View>
                      </Row>
                    </View>
                  </View>
                ) : userInfo?.intBusinessUnitId === 225 ? (
                  <View style={styles.cardContainer}>
                    <FastImage
                      source={IMAGES.akijAirVisitingCard}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="contain"
                    />
                    <View style={styles.qrAir}>
                      <QRCode
                        value={resURL?.sharingLink}
                        size={SIZES.width / 6.3}
                      />
                    </View>
                    <View style={styles.dynamicContent}>
                      <Text style={styles.titleTxt}>
                        {userInfo?.strDisplayName || ''}
                      </Text>
                      <Text style={styles.designationTxt}>
                        {strDesignation || ''}
                      </Text>
                      <View style={{marginTop: 5}}>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="telephone"
                              color={'#00008B'}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text style={styles.numTxt}>{phoneNumber}</Text>
                          </View>
                        </Row>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="mail"
                              color={'#00008B'}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text
                              style={[
                                styles.numTxt,
                                {
                                  fontFamily: 'HelveticaNeue_Medium',
                                  fontSize: 11,
                                },
                              ]}>
                              {emailAdrress}
                            </Text>
                          </View>
                        </Row>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.cardContainer}>
                    <FastImage
                      source={IMAGES.visitingCardFront}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="contain"
                    />
                    <View style={styles.qr}>
                      <QRCode
                        value={resURL?.sharingLink}
                        size={SIZES.width / 6.3}
                      />
                    </View>
                    <View style={styles.dynamicContent}>
                      <Text style={styles.titleTxt}>
                        {userInfo?.strDisplayName || ''}
                      </Text>
                      <Text style={styles.designationTxt}>
                        {strDesignation || ''}
                      </Text>
                      <View style={{marginTop: 5}}>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="telephone"
                              color={'#00008B'}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text style={styles.numTxt}>{phoneNumber}</Text>
                          </View>
                        </Row>
                        <Row align="center">
                          <View>
                            <Foundation
                              name="mail"
                              color={'#00008B'}
                              size={15}
                            />
                          </View>
                          <View style={{marginLeft: 5}}>
                            <Text
                              style={[
                                styles.numTxt,
                                {
                                  fontFamily: 'HelveticaNeue_Medium',
                                  fontSize: 11,
                                },
                              ]}>
                              {emailAdrress}
                            </Text>
                          </View>
                        </Row>
                      </View>
                    </View>
                  </View>
                )}

                <View style={styles.cardContainer}>
                  <FastImage
                    source={IMAGES.visitingCardBack}
                    style={{height: '100%', width: '100%'}}
                    resizeMode="contain"
                  />
                </View>
              </ViewShot>
            </View>
          </>
        ) : null} */}
      </View>

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
        }}
      >
        <View style={styles.pHorizontal}>
          <View style={styles.sheetHeader}>
            <Text>Select Upload Option</Text>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet?.current?.close()
              }
            >
              <MIcon name="close" size={25} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter1}>
            <View style={styles.marginRight}>
              <TouchableOpacity
                onPress={() => {
                  handleUploadProfileImage('camera');
                }}
                style={styles.iconBg}
              >
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
                  handleUploadProfileImage('file');
                }}
                style={styles.iconBg}
              >
                <MIcon name="attachment" size={25} color={COLORS.activeText} />
              </TouchableOpacity>

              <Text style={styles.textSheet}>File</Text>
            </View>
          </View>
        </View>
      </RBSheet>

      <RBSheet
        //@ts-ignore
        ref={refRBSheet1}
        width={SIZES.width}
        height={SIZES.height / 2}
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
        }}
      >
        <View style={styles.pHorizontal}>
          <View style={styles.sheetHeader}>
            <View />
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet1?.current?.close()
              }
            >
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter2}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="switchName"
              placeholder="Title"
              label="Title"
              rules={{ required: true }}
            />

            <View
              style={{
                paddingTop: 16,
              }}
            >
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="switchLInk"
                placeholder="Link"
                label="Link"
                rules={{ required: true }}
              />
            </View>

            <CustomButtonNew
              disabled={isDisable}
              btnText="ADD"
              onBtnPress={handleSubmit(switchLinkHandler)}
              btnstyle={styles.btn1}
              btnTextStyle={styles.btnText1}
            />
          </View>
        </View>
      </RBSheet>

      <Modal
        animationType="fade"
        transparent
        visible={modalShow}
        onRequestClose={() => {
          setModalShow(!modalShow);
        }}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            setModalShow(!modalShow);
          }}
        >
          <View style={styles.imgCon}>
            <View style={styles.idParentContainer}>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CustomTextNew
                  text={'Visiting Card'}
                  lineHight={27}
                  txtWeight={'600'}
                  txtSize={15}
                  txtColor={COLORS.black}
                />
              </View>
              <View style={{ marginVertical: 20 }}>
                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Name: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.name} `}</Text>
                </Row>

                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Email: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.email}`}</Text>
                </Row>

                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Company: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.company}`}</Text>
                </Row>
                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Designation: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.designation}`}</Text>
                </Row>

                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Contact: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.contact}`}</Text>
                </Row>
                <Row align="center" rowStyle={{ marginBottom: 5 }}>
                  <Text style={styles.titleTxt2}>Other Contact: </Text>
                  <Text
                    style={styles.valueTxt}
                  >{`${visitingCardData?.other_contact}`}</Text>
                </Row>
              </View>

              <View style={styles.radioButtonGroup}>
                <CustomTextNew
                  text={'Select Type:'}
                  lineHight={27}
                  txtWeight={'600'}
                  txtSize={15}
                  txtColor={COLORS.black}
                />

                <Row>
                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('employee')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'employee'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Employee</Text>
                    </TouchableOpacity>
                  </Column>
                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('career')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'career'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Career</Text>
                    </TouchableOpacity>
                  </Column>
                </Row>

                <Row>
                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('supplier')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'supplier'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Supplier</Text>
                    </TouchableOpacity>
                  </Column>

                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('investor')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'investor'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Investor</Text>
                    </TouchableOpacity>
                  </Column>
                </Row>

                <Row>
                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('ecommerce')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'ecommerce'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Ecommerce</Text>
                    </TouchableOpacity>
                  </Column>

                  <Column colWidth={'48%'}>
                    <TouchableOpacity
                      style={styles.radioButtonContainer}
                      onPress={() => handleRadioPress('customer')}
                    >
                      <MaterialCommunityIcons
                        name={
                          selectedValue === 'customer'
                            ? 'radiobox-marked'
                            : 'radiobox-blank'
                        }
                        size={24}
                        color="black"
                      />
                      <Text style={styles.radioButtonLabel}>Customer</Text>
                    </TouchableOpacity>
                  </Column>
                </Row>
              </View>

              <CustomButtonNew
                isLoading={isLoading}
                disabled={isLoading}
                btnText="Save"
                onBtnPress={() => {
                  handleSubmitVcardTag();
                }}
                btnstyle={{
                  marginTop: 15,
                }}
                // btnTextStyle={styles.btnText1}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ContainerNew>
  );
};

export default EmpolyeeSelfDetails;

const styles = StyleSheet.create({
  valueTxt: {
    color: COLORS.black,
    lineHeight: 20,
    fontSize: 13.5,
    flex: 1,
    // marginLeft: 10,
    fontWeight: '500',
  },
  radioButtonGroup: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // padding: 10,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginVertical: 4,
  },
  radioButtonLabel: {
    marginLeft: 10,
    color: COLORS.black,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  imgCon: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  idParentContainer: {
    padding: 20,
    backgroundColor: COLORS.white,
    width: SIZES.width / 1.2,
    // height: SIZES.height / 3.5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  main: {
    paddingVertical: 24,
    backgroundColor: COLORS.white,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    color: COLORS.textNewColor,
  },
  empSubData: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.textNewColor,
  },
  profileImage: {
    width: 72,
    height: 72,
    borderRadius: 100,
  },
  bar: {
    height: 5,
    backgroundColor: COLORS.bar,
    marginVertical: 16,
  },
  commonTextData: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    color: COLORS.textNewColor,
  },
  commonTextTitle: {
    fontSize: 12,
    lineHeight: 24,
    color: COLORS.graySubText,
  },
  borderBottomWidth: {
    borderWidth: 0.8,
    borderColor: COLORS.borderBottom,
    marginTop: 24,
  },
  myLeaveTitle: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  managerImage: {
    width: 45,
    height: 45,
    borderRadius: 100,
  },
  managerTitle: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textNewColor,
    fontWeight: '500',
  },
  managerText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  cam: {
    borderRadius: 100,
    width: 30,
    height: 30,
    right: -45,
    top: -20,
    backgroundColor: COLORS.white,
  },

  sheetFooter1: {
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
  flexRow: {
    flexDirection: 'row',
  },

  marginHorizontal: {
    marginTop: 10,
    marginBottom: 10,
  },
  widthPadding: {
    width: '85%',
    paddingLeft: 5,
  },
  fontSize14: {
    fontSize: 14,
  },
  width10: {
    width: '10%',
  },
  width15: {
    width: '15%',
  },
  width25: {
    width: '25%',
  },
  width75: {
    width: '75%',
  },
  marginRight: {
    marginRight: 30,
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.bar,
    marginHorizontal: 24,
  },
  bankInfoCard: {
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    elevation: 3,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 16,
    shadowColor: COLORS.blackish,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.09,
    shadowRadius: 5,
  },
  profileDivider: {
    marginTop: -10,
    marginBottom: 10,
  },
  conDateDivider: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.borderBottom,
    marginHorizontal: 25,
  },
  bankWalletTxt: {
    fontSize: 16,
    paddingBottom: 0,
  },
  bottomSpace: {
    marginTop: 10,
    marginBottom: 100,
  },
  activityIndi: {
    position: 'absolute',
    zIndex: 999999,
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    borderRadius: 100,
    padding: 10,
    justifyContent: 'center',
    elevation: 10,
    flex: 1,
  },
  rowFlexEnd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 1,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
  },
  rowSpaceBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  addTxt: {
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.white,
    paddingLeft: 2,
  },

  sheetFooter2: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  itemHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.black,

    marginVertical: 10,
  },
  rowItem: {
    fontSize: 14,
    color: COLORS.textNewColor,
    lineHeight: 20,

    // marginLeft: 15,
  },
  rowItemBox: {
    flexDirection: 'row',
  },
  activeReaction: {
    // backgroundColor: 'coral',
    marginVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.softGray,
    paddingBottom: 5,
  },
  // shareTitle: { color: 'green', marginLeft: 5, fontWeight: '600' },
  // leftCard: {
  //   flex: 0.5,
  // },
  // rightCard: {
  //   flex: 0.5,
  //   justifyContent: 'center',
  // },
  // leftCardContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   marginVertical: 5,
  // },
  skillsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  skillsBtn: { marginLeft: 5, color: 'green', fontSize: 15, fontWeight: '600' },
  showAllSkills: { color: COLORS.darkGray, fontSize: 14, fontWeight: '600' },
  jobStatus: {
    backgroundColor: '#EAECF0',
    width: 100,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 2,
    marginBottom: 5,
  },
  roleCodeTxt: { fontSize: 12, color: COLORS.black, fontWeight: '500' },
  // sheetFooter: {
  //   paddingTop: 10,
  // },
  // iconContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   // paddingHorizontal: 8,
  //   paddingVertical: 8,
  //   // marginLeft: 15,
  // },
  infoIconContainer: {
    marginTop: 8,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeIcon: {
    // backgroundColor: COLORS.lightGray2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  editableIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shareTitle: { color: 'green', marginLeft: 5, fontWeight: '600' },
  leftCard: {
    flex: 0.5,
  },
  rightCard: {
    flex: 0.5,
    justifyContent: 'center',
  },
  leftCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },

  qrAir: {
    position: 'absolute',
    right: 12,
    bottom: 40,
  },

  ...empDirectoryCommon,
});
