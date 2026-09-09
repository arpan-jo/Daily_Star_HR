//@ts-nocheck
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Modal,
  NativeModules,
  PermissionsAndroid,
  Platform,
  ScrollView,
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
// import RNCallKeep from 'react-native-callkeep';
import FastImage from 'react-native-fast-image';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import AIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  default as Icon,
  default as IconMY,
} from 'react-native-vector-icons/MaterialIcons';
import { arlURL } from '../../../App';
import {
  GetVisitingCardDataByEmployeeId,
  SendPushNotification,
} from '../../common/api/api';
import ContainerNew from '../../common/components/Container';
import CustomButtonNew from '../../common/components/CustomButton';
import CustomHeader from '../../common/components/CustomHeader';
import CustomInputNew from '../../common/components/CustomInput';
import { useToast } from '../../common/components/CustomToast';
import Row from '../../common/components/Row';

import { httpRequest } from '../../common/constant/httpRequest';
import { COLORS, IMAGES, SIZES } from '../../common/constant/Index';
import RBSheet from '../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  getEmpProficiencyBgColor,
  getEmpProficiencyTxtColor,
} from '../../common/services/getColor';
import { getImageURL } from '../../common/services/getImage';
import {
  createBookMarked,
  createMeetMe,
  createThumsDown,
  getBusinessUnitList,
  getContactBook,
  getEmpDepartmentList,
  getEmployeeSkillCategoryList,
  getEmploymentTypeList,
  getSwitchBoardData,
} from '../../services/SaaS-modules/contact/contact';
import { useRootStore } from '../../stores/rootStore';
// import {endCall, makeCall, sessionCancel} from './sip_service/SipService';
import MapLocModal from '../../common/components/MapLocModal';

const edges: Edge[] = ['right', 'bottom', 'left'];
const edgess: Edge[] = ['right', 'left', 'top'];

const EmployeeDirectoryNew = () => {
  const refRBSheet = useRef();
  const refRBSheet1 = useRef();
  const [empId, setEmpId] = useState();
  // SearchContact Element
  const toaster = useToast();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo, sbu } = useRootStore();
  // const [isWebSocketOn, setIsWebSocketOn] = useState(false);
  const [modalShow, setModalShow] = useState(false);

  // useEffect(() => {
  //   const setupCallKeepAndSIP = async () => {
  //     try {
  //       await setupCallKeepAndSIPFunc();

  //       RNCallKeep.addEventListener('didDisplayIncomingCall', data => {
  //         console.log('Incoming call displayed', data);
  //       });
  //       RNCallKeep.addEventListener('endCall', data => {
  //         // sessionCancel();
  //         RNCallKeep.endAllCalls();
  //         // RNCallKeep.clearInitialEvents();
  //       });
  //       RNCallKeep.addEventListener('answerCall', data => {
  //         RNCallKeep.setCurrentCallActive(data?.callUUID);
  //       });
  //       RNCallKeep.addEventListener('didReceiveStartCallAction', data => {
  //         console.log('Start call action ', data);
  //       });
  //     } catch (error) {
  //       console.error('CallKeep setup error:', error);
  //       // sessionCancel();
  //     }
  //   };
  //   setupCallKeepAndSIP();
  //   return () => {
  //     RNCallKeep.removeEventListener('didDisplayIncomingCall');
  //     RNCallKeep.removeEventListener('didReceiveStartCallAction');
  //     RNCallKeep.removeEventListener('endCall');
  //     RNCallKeep.removeEventListener('answerCall');
  //   };
  // }, []);

  const [showPeopleAndSkills, setShowPeopleAndSkills] = useState(true);
  const [showOtherButtons, setShowOtherButtons] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [showLocationBtn, setShowLocationBtn] = useState(false);
  const [showContactBtn, setShowContactBtn] = useState(false);
  const [showPeopleButton, setShowPeopleButton] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [peopleCategoryButton, setPeopleCategoryButton] = useState(false);
  const [showSearchContact, setShowSearchContact] = useState(false);
  const [showContactBook, setShowContactBook] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState(''); //Employee or Skills
  const [isLoading, setIsLoading] = useState(false);
  const [isload, setIsLoad] = useState(false);
  const [contactBookLandingData, setContactBookLandingData] = useState();
  const [skillCategoryModalVisible, setSkillCategoryModalVisible] =
    useState(false);
  const [empSkillCategoryList, setEmpSkillCategoryList] = useState();
  const [businessUnitList, setBusinessUnitList] = useState();
  const [empDepartmentList, setEmpDepartmentList] = useState();
  const [employmentTypeList, setEmploymentTypeList] = useState();
  const [selectedSubcategory, setSelectedSubcategory] = useState();
  const [contactLandingData, setContactLandingData] = useState([]);
  const [switchBoardData, setSwitchBoardData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCallStart, setIsCallStart] = useState(false); //for ios calling modal
  const currentTime = dayjs().format('h:mm A');
  const [callerName, setCallerName] = useState('');
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      agendaOfMeetMe: 'Come to meet me now',
      schedule: currentTime?.toString(),
    },
  });

  const [peopleSubCat, _setPeopleSubCat] = useState([
    {
      id: 1,
      name: 'Business Unit',
    },
    {
      id: 2,
      name: 'Depertment',
    },
    {
      id: 3,
      name: 'Employment Type',
    },
  ]);

  const [skillSubCat, _setSkillSubCat] = useState([
    {
      id: 4,
      name: 'Skill Category',
    },
    {
      id: 5,
      name: 'Proficiency Levels',
    },
  ]);

  const [proficiencyLevels, setProficiencyLevels] = useState([
    {
      value: 1,
      label: 'Beginner',
      isActive: false,
    },
    {
      value: 2,
      label: 'Intermediate',
      isActive: false,
    },
    {
      value: 3,
      label: 'Expert',
      isActive: false,
    },
  ]);

  const selectedBusinessUnitId =
    businessUnitList?.length > 0 &&
    businessUnitList?.filter((item: any) => item?.isActive === true);

  const selectedDepartmentId =
    empDepartmentList?.length > 0 &&
    empDepartmentList?.filter((item: any) => item?.isActive === true);

  const selectedEmpTypeId =
    employmentTypeList?.length > 0 &&
    employmentTypeList?.filter((item: any) => item?.isActive === true);

  //filter selected item and return only selected item value as string
  const selectedEmployeSkillCategory =
    empSkillCategoryList?.length > 0 &&
    empSkillCategoryList
      ?.filter((item: any) => item?.isActive === true)
      .map((item: any) => item?.value)
      .toString();

  // employeeProficiencyLevels where isActive
  const selectedEmpProficiencyLevel =
    proficiencyLevels?.length > 0 &&
    proficiencyLevels?.filter((item: any) => item?.isActive === true);

  const callContactBookApi = async () => {
    const data = await getContactBook(
      userInfo?.intEmployeeId,
      0,
      selectedBusinessUnitId?.length > 0 && activeMainTab === 'Employee'
        ? selectedBusinessUnitId?.[0]?.intBusinessUnitId
        : 0,
      selectedEmpTypeId?.length > 0 && activeMainTab === 'Employee'
        ? selectedEmpTypeId?.[0]?.Id
        : 0,
      selectedDepartmentId?.length > 0 && activeMainTab === 'Employee'
        ? selectedDepartmentId?.[0]?.DepartmentId
        : 0,
      selectedEmployeSkillCategory && activeMainTab === 'Skill'
        ? selectedEmployeSkillCategory
        : '',
      selectedEmpProficiencyLevel?.length > 0 && activeMainTab === 'Skill'
        ? selectedEmpProficiencyLevel?.[0]?.label
        : '',
      activeMainTab || '',
      searchText,
      setIsLoading,
    );

    const modData = data?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });
    setContactBookLandingData(modData);
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      callContactBookApi();
    },
    [isFocused, searchText, activeMainTab],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
    },
    [modalVisible],
  );

  const handleSkillTabApi = async () => {
    const data = await getEmployeeSkillCategoryList(
      userInfo?.intAccountId,
      setIsLoading,
    );

    const modData = data?.map((item: any) => {
      return {
        ...item,
        isActive: false,
      };
    });

    setEmpSkillCategoryList(modData);
  };

  const handlePeopleTabApi = async () => {
    const EmpDepartment = await getEmpDepartmentList(
      userInfo?.intAccountId,
      userInfo?.intBusinessUnitId,
      sbu?.sbuId,
      setIsLoading,
    );

    const modEmpDepartment = EmpDepartment?.map((item: any) => {
      return {
        ...item,
        label: item?.DepartmentName,
        value: item?.DepartmentId,
        isActive: false,
      };
    });
    setEmpDepartmentList(modEmpDepartment);

    const BusinessUnit = await getBusinessUnitList(
      userInfo?.intAccountId,
      userInfo?.intBusinessUnitId,
      userInfo?.intEmployeeId,
      setIsLoading,
    );

    const modBusinessUnit = BusinessUnit?.map((item: any) => {
      return {
        ...item,
        label: item?.strBusinessUnit,
        value: item?.intBusinessUnitId,
        isActive: false,
      };
    });
    setBusinessUnitList(modBusinessUnit);

    const EmploymentType = await getEmploymentTypeList(
      1,
      userInfo?.intBusinessUnitId,
      sbu?.sbuId,
      setIsLoading,
    );

    const modEmploymentType = EmploymentType?.map((item: any) => {
      return {
        ...item,
        label: item?.EmploymentType,
        value: item?.Id,
        isActive: false,
      };
    });

    setEmploymentTypeList(modEmploymentType);
  };

  const toggleSearchButton = () => {
    setShowContactBook(!showContactBook);
    setShowSearchContact(!showSearchContact);
  };

  // People Button
  const toggleButtonPeople = () => {
    handlePeopleTabApi();
    setShowPeopleAndSkills(false);
    setPeopleCategoryButton(true);
    setShowLocationBtn(false);
    setShowContactBtn(false);
    setShowPeopleButton(!showPeopleButton);
  };

  // Skill Button
  const toggleButtonSkills = () => {
    handleSkillTabApi();
    setShowPeopleAndSkills(false);
    setShowLocationBtn(false);
    setShowContactBtn(false);
    setShowOtherButtons(true);
    setShowButton(!showButton);
  };

  //location button
  const toggleButtonLocation = () => {
    setShowLocationBtn(!showLocationBtn);
    setShowContactBtn(false);
  };
  const toggleContactBookData = async () => {
    setShowContactBtn(true);
    setShowLocationBtn(false);
    const api_paramsForPhoneNo = {
      url: GetVisitingCardDataByEmployeeId,
      data: { IntEmployeeId: userInfo?.intEmployeeId },
    };
    const resForPhoneNo = await httpRequest(api_paramsForPhoneNo, () => {});
    setContactLandingData(resForPhoneNo);
  };
  const handleSkillsCategoryPress = () => {
    setSkillCategoryModalVisible(true);
  };
  console.log(
    'contactLandingData',
    JSON.stringify(contactLandingData, null, 2),
  );
  const categoryHideModal = () => {
    setSkillCategoryModalVisible(false);
  };

  const handleCloseBtn = () => {
    if (searchText?.length > 0) {
      setSearchText('');
    } else {
      setShowSearchContact(!showSearchContact);
      setShowContactBook(!showContactBook);
      setActiveMainTab('');
      //@ts-ignore
      setContactBookLandingData([]);
      setIsLoad(true);
      if (showSearchContact) {
        setShowPeopleAndSkills(true);
        setShowOtherButtons(false);
        setShowButton(false);
        setShowLocationBtn(false);
        setShowPeopleButton(false);
        setShowContactBtn(false);
        setPeopleCategoryButton(false);
        setSearchText('');
        setActiveMainTab('');
        //@ts-ignore
        setContactBookLandingData([]);
        setIsLoad(true);
      }
    }
  };

  useEffect(() => {
    setIsLoad(false);
    callContactBookApi();
  }, [isload]);

  const isActiveCloseIcon =
    searchText?.length > 0 ||
    peopleCategoryButton ||
    showButton ||
    showLocationBtn ||
    showContactBtn;

  const handlebottomSheatItemsPress = (item: any) => {
    if (selectedSubcategory?.id === 1) {
      setBusinessUnitList(
        businessUnitList?.map((x: any) =>
          x?.value === item?.value
            ? { ...x, isActive: !x?.isActive }
            : { ...x, isActive: false },
        ),
      );
    } else if (selectedSubcategory?.id === 2) {
      setEmpDepartmentList(
        empDepartmentList?.map((x: any) =>
          x?.value === item?.value
            ? { ...x, isActive: !x?.isActive }
            : { ...x, isActive: false },
        ),
      );
    } else if (selectedSubcategory?.id === 3) {
      setEmploymentTypeList(
        employmentTypeList?.map((x: any) =>
          x?.value === item?.value
            ? { ...x, isActive: !x?.isActive }
            : { ...x, isActive: false },
        ),
      );
    } else if (selectedSubcategory?.id === 4) {
      setEmpSkillCategoryList(
        empSkillCategoryList?.map((x: any) =>
          x?.value === item?.value ? { ...x, isActive: !x?.isActive } : x,
        ),
      );
    } else if (selectedSubcategory?.id === 5) {
      setProficiencyLevels(
        proficiencyLevels?.map((x: any) =>
          x?.value === item?.value
            ? { ...x, isActive: !x?.isActive }
            : { ...x, isActive: false },
        ),
      );
    }
  };

  const handleActive = (item: any) => {
    setContactBookLandingData(
      contactBookLandingData?.map((x: any) =>
        x?.AutoId === item?.AutoId
          ? { ...x, isActive: !x?.isActive }
          : { ...x, isActive: false },
      ),
    );
  };

  const createBookmark = async (it: any) => {
    const res = await createBookMarked(
      userInfo?.intEmployeeId,
      it?.EmployeeId,
      it?.isBookmarked,
      callContactBookApi,
    );
    handleResponds(res);
  };

  const handleThumsDown = async (it: any) => {
    const res = await createThumsDown(
      userInfo?.intEmployeeId,
      it?.EmployeeId,
      it?.isThumbsDown,
      callContactBookApi,
    );
    handleResponds(res);
  };

  const handleResponds = async (res: any) => {
    if (res) {
      // setIsSearch(true);
      setIsLoad(true);
      // setEmployeeName('');
      toaster.show({ message: 'Successfull.', type: 'success' });
    } else {
      setIsLoad(true);
      // setEmployeeName('');
    }
  };

  const createMeetMeMsg = async (data: any) => {
    const dname = `${userInfo?.strDisplayName}, ${userInfo?.strDesignation}, ${userInfo?.strDepartment}`;
    const res = await createMeetMe(
      userInfo?.intAccountId,
      userInfo?.intEmployeeId,
      dname?.toString(),
      empId,
      data?.agendaOfMeetMe,
      data?.schedule,
      () => {
        reset();
        refRBSheet?.current?.close();
      },
    );
    if (res) {
      toaster.show({ message: 'Message sent successfully.', type: 'success' });
    }
  };

  const handleSwitchBoardData = async (empIdd: number) => {
    setSwitchBoardData([]);
    refRBSheet1?.current?.open();
    const res = await getSwitchBoardData(empIdd, setIsLoading);
    setSwitchBoardData(res);
  };

  const dialCall = (phone?: String, email?: String) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${phone}`;
    } else {
      phoneNumber = `telprompt:${phone}`;
    }

    if (phone) {
      Linking.openURL(phoneNumber);
    } else if (email) {
      Linking.openURL(`mailto:${email}`);
    } else {
      toaster.show({ message: 'Phone no is empty.', type: 'error' });
    }
  };

  const sections = [
    {
      title: 'People',
      data: contactBookLandingData?.filter(
        iteem =>
          iteem.strTableType === 'Employee' ||
          iteem.strTableType === 'Location',
      ),
    },
    {
      title: 'Skills',
      data: contactBookLandingData?.filter(
        iteem => iteem.strTableType === 'Skill',
      ),
    },

    {
      title: 'Contact',
      data: contactBookLandingData?.filter(
        iteem => iteem.strTableType === 'Contact',
      ),
    },
  ];

  const location = '';

  return (
    <ContainerNew
      isScrollView={false}
      edges={edges}
      header={
        <>
          {showContactBook && (
            <CustomHeader
              onBackPress={() => {
                navigation.goBack();
              }}
              // components={
              //   <Icon
              //     name={'dialer-sip'}
              //     size={24}
              //     color={
              //       isWebSocketOn ? COLORS.lightPrimary2 : COLORS.lightYellow
              //     }
              //     style={{
              //       marginRight: 10,
              //     }}
              //   />
              // }
              alterIcon={'search'}
              alterIconPress={() => {
                toggleSearchButton();
              }}
              title="Contact Book"
            />
          )}
        </>
      }
      style={styles.container}
    >
      {showContactBook && !isLoading ? (
        <>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={<View style={styles.hight8} />}
            ListFooterComponent={<View style={styles.hight100} />}
            data={contactBookLandingData}
            renderItem={({ item }) => (
              <View
                style={{
                  backgroundColor: item?.isActive ? '#F2F4F7' : COLORS.white,
                  borderRadius: 24,
                  marginHorizontal: item?.isActive ? 8 : 0,
                  marginTop: item?.isActive ? 4 : 0,
                  elevation: item?.isActive ? 5 : 0,
                  marginBottom: item?.isActive ? 4 : 0,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleActive(item)}
                  style={{
                    paddingHorizontal: item?.isActive ? 8 : 16,
                    paddingVertical: 8,
                  }}
                >
                  <View style={styles.flexCenter}>
                    <View style={styles.imageSection}>
                      {item?.intProfilePicFileUrlId ? (
                        <FastImage
                          source={{
                            uri: getImageURL(item?.intProfilePicFileUrlId),
                          }}
                          style={styles.image1}
                        />
                      ) : (
                        <View style={styles.imageBox1}>
                          <Image
                            source={IMAGES.NoImage}
                            style={styles.image1}
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.profileMidContainer}>
                      <View style={styles.width85p}>
                        <View style={styles.rowCenterWrap}>
                          <Text style={styles.empNam}>
                            {item?.EmployeeName?.trim()}
                          </Text>
                          <Text>
                            {item?.isBookmarked && (
                              <Icon name="star" size={15} color={COLORS.late} />
                            )}
                          </Text>
                        </View>
                        <Text style={styles.empDesignation}>
                          {item?.DesignationName}
                        </Text>
                        <Text style={styles.empPhone}>{item?.Phone}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          // if (userInfo?.strUrl === arlURL) {
                          //   // handleCall(
                          //   //   item?.extensionNumber
                          //   //     ? item?.extensionNumber
                          //   //     : item?.Phone,
                          //   //   item?.EmployeeName?.trim(),
                          //   // );
                          // } else {
                          dialCall(item?.Phone, undefined);
                          // console.log(item?.Phone);
                          // }
                        }}
                        style={styles.callIcon}
                      >
                        <Icon
                          name="call"
                          size={25}
                          color={COLORS.graySubText}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                {item?.isActive ? <View style={styles.activeDevider} /> : null}
                {item?.isActive ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    style={styles.activeScroll}
                  >
                    {userInfo?.strUrl === arlURL ? (
                      <TouchableOpacity
                        onPress={() => {
                          handleSwitchBoardData(item?.EmployeeId);
                        }}
                        style={styles.chatAndInfo}
                      >
                        <MIcon
                          name="link"
                          size={25}
                          color={COLORS.white}
                          style={{
                            transform: [{ rotate: '135deg' }],
                          }}
                        />
                      </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity
                      onPress={() =>
                        //@ts-ignore
                        navigation.navigate('CreateAppreciate', {
                          empDetails: item,
                        })
                      }
                      style={[styles.chatAndInfo, styles.marginLeft12]}
                    >
                      <MIcon
                        name="thumb-up-outline"
                        size={25}
                        color={COLORS.white}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        handleThumsDown(item);
                      }}
                      style={[styles.chatAndInfo, styles.marginLeft12]}
                    >
                      <MIcon
                        name="thumb-down-outline"
                        size={25}
                        color={
                          item?.isThumbsDown ? COLORS.yellow : COLORS.white
                        }
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        if (item?.Phone) {
                          Linking.openURL(`sms:${item?.Phone}?body=`);
                        } else {
                          toaster.show({
                            message: 'Phone no is empty.',
                            type: 'error',
                          });
                        }
                      }}
                      style={[styles.chatAndInfo, styles.marginLeft12]}
                    >
                      <Icon name="chat" size={25} color={COLORS.white} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        //@ts-ignore
                        navigation.navigate('EmployeeDirectoryDetails', {
                          employeeDetails: item || '',
                        });
                      }}
                      style={[styles.chatAndInfo, styles.marginLeft12]}
                    >
                      <Icon name="info" size={25} color={COLORS.white} />
                    </TouchableOpacity>

                    {userInfo?.strUrl === arlURL && (
                      <>
                        <TouchableOpacity
                          onPress={() => createBookmark(item)}
                          style={[styles.chatAndInfo, styles.marginLeft12]}
                        >
                          <Icon
                            name="star"
                            size={25}
                            color={
                              item?.isBookmarked ? COLORS.late : COLORS.white
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            // @ts-ignore
                            setEmpId(item?.EmployeeId);
                            // @ts-ignore
                            refRBSheet?.current?.open();
                          }}
                          style={[styles.chatAndInfo, styles.mapIcon]}
                        >
                          <Icon
                            name="notifications"
                            size={25}
                            color={COLORS.white}
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setModalShow(true);
                            setEmpId(item?.EmployeeId);
                            // openMap(item?.presentAddress);
                          }}
                          style={[styles.chatAndInfo, styles.mapIcon]}
                        >
                          <MIcon
                            name="map-marker"
                            size={25}
                            color={COLORS.white}
                          />
                        </TouchableOpacity>

                        <View style={styles.width100} />
                      </>
                    )}
                  </ScrollView>
                ) : null}
                {item?.isActive ? null : <View style={styles.bar1} />}
              </View>
            )}
          />
        </>
      ) : (
        !showSearchContact && (
          <ActivityIndicator
            size={'large'}
            color={COLORS.primary}
            style={styles.loadingIndicator}
          />
        )
      )}

      {/* ========================SearchContact======================== */}

      {showSearchContact && (
        <SafeAreaView edges={edgess}>
          <View style={styles.headerTop}>
            <View style={styles.searchCon}>
              <TouchableOpacity
                style={styles.pHorizontal12}
                onPress={() => navigation.goBack()}
              >
                <AIcon color={'#667085'} size={25} name="arrowleft" />
              </TouchableOpacity>

              <View style={styles.peopleCon}>
                {showPeopleButton && (
                  <TouchableOpacity style={styles.btnCon}>
                    <IconMY
                      style={styles.marginRight5}
                      color={COLORS.white}
                      name="people-outline"
                      size={18}
                    />
                    <Text style={styles.whiteTxt}>People</Text>
                    <IconMY
                      style={styles.marginLeft5}
                      name="arrow-drop-down"
                      size={18}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                )}

                {showButton && (
                  <TouchableOpacity style={styles.btnCon}>
                    <IconMY
                      style={styles.marginRight5}
                      color={COLORS.white}
                      name="lightbulb-outline"
                      size={18}
                    />
                    <Text style={styles.whiteTxt}>Skills</Text>
                    <IconMY
                      style={styles.marginLeft5}
                      name="arrow-drop-down"
                      size={18}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                )}

                {showLocationBtn && (
                  <TouchableOpacity style={styles.btnCon}>
                    <Ionicons
                      style={styles.marginRight5}
                      color={COLORS.white}
                      name="location-outline"
                      size={18}
                    />
                    <Text style={styles.whiteTxt}>Location</Text>
                  </TouchableOpacity>
                )}

                {showContactBtn && (
                  <TouchableOpacity style={styles.btnCon}>
                    <Ionicons
                      style={styles.marginRight5}
                      color={COLORS.white}
                      name="call-outline"
                      size={18}
                    />
                    <Text style={styles.whiteTxt}>Contact</Text>
                  </TouchableOpacity>
                )}
                <TextInput
                  style={{
                    width: showPeopleAndSkills ? '100%' : '55%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: -5,
                    paddingLeft: 4,
                    color: COLORS.graySubText,
                  }}
                  placeholderTextColor={COLORS.graySubText}
                  editable={activeMainTab === 'Contact' ? false : true}
                  value={searchText}
                  placeholder="Search"
                  onChangeText={text => setSearchText(text)}
                />
              </View>
              {isActiveCloseIcon && (
                <TouchableOpacity onPress={() => handleCloseBtn()}>
                  <AIcon color={'#667085'} size={24} name="close" />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity style={styles.qrCon}>
              <IconMY color={'#667085'} size={25} name="qr-code-scanner" />
            </TouchableOpacity>
          </View>
          <View style={styles.PLeft4}>
            {showPeopleAndSkills && (
              <View style={styles.empCon}>
                <TouchableOpacity
                  onPress={() => {
                    setActiveMainTab('Employee');
                    toggleButtonPeople();
                  }}
                  style={styles.button}
                >
                  <IconMY
                    style={styles.marginRight5}
                    color={COLORS.graySubText}
                    name="people-outline"
                    size={18}
                  />
                  <Text style={styles.buttonText}>People</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setContactBookLandingData([]);
                    setActiveMainTab('Skill');
                    toggleButtonSkills();
                  }}
                  style={styles.button}
                >
                  <IconMY
                    style={styles.marginRight5}
                    color={COLORS.graySubText}
                    name="lightbulb-outline"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Skills</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setContactBookLandingData([]);
                    setActiveMainTab('Location');
                    toggleButtonLocation();
                  }}
                  style={styles.button}
                >
                  <Ionicons
                    style={styles.marginRight5}
                    color={COLORS.graySubText}
                    name="location-outline"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Location</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setContactBookLandingData([]);
                    setActiveMainTab('Contact');
                    toggleContactBookData();
                  }}
                  style={styles.button}
                >
                  <Ionicons
                    style={styles.marginRight5}
                    color={COLORS.graySubText}
                    name="call-outline"
                    size={18}
                  />
                  <Text style={styles.buttonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            )}
            {showOtherButtons && (
              <View>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  style={styles.empCon}
                >
                  {skillSubCat?.length > 0 &&
                    skillSubCat?.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          //@ts-ignore
                          setSelectedSubcategory(item);
                          handleSkillsCategoryPress();
                        }}
                        style={styles.button}
                      >
                        <Text style={styles.buttonText}>{item?.name}</Text>
                        <IconMY
                          style={styles.marginRight5}
                          color={'#667085'}
                          name="arrow-drop-down"
                          size={18}
                        />
                        {selectedEmployeSkillCategory?.length > 0 &&
                        index === 0 ? (
                          <View style={styles.empSkilDes} />
                        ) : selectedEmpProficiencyLevel?.length > 0 &&
                          index === 1 ? (
                          <View style={styles.empSkilDes} />
                        ) : null}
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}
          </View>
          <View style={styles.padLeft4}>
            {peopleCategoryButton && (
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                style={styles.empCon}
              >
                {peopleSubCat?.length > 0 &&
                  peopleSubCat?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        //@ts-ignore
                        setSelectedSubcategory(item);
                        handleSkillsCategoryPress();
                      }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>{item?.name}</Text>
                      <IconMY
                        style={styles.marginRight2}
                        color={'#667085'}
                        name="arrow-drop-down"
                        size={18}
                      />
                      {selectedBusinessUnitId?.length > 0 && index === 0 ? (
                        <View style={styles.empSkilDes} />
                      ) : selectedDepartmentId?.length > 0 && index === 1 ? (
                        <View style={styles.empSkilDes} />
                      ) : selectedEmpTypeId?.length > 0 && index === 2 ? (
                        <View style={styles.empSkilDes} />
                      ) : null}
                    </TouchableOpacity>
                  ))}
                <View style={styles.width50} />
              </ScrollView>
            )}
          </View>

          {showSearchContact && (
            <View
              style={{
                height: SIZES.height - 100,
                // backgroundColor: COLORS.red,
              }}
            >
              {activeMainTab === 'Contact' ? (
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 24,
                    marginHorizontal: 0,
                    marginTop: 0,
                    elevation: 0,
                    marginBottom: 0,
                  }}
                >
                  {contactLandingData?.length > 0
                    ? contactLandingData?.map((item, index) => (
                        <View style={{ marginBottom: 8 }} key={index}>
                          {item?.Phone ? (
                            <Row align="center">
                              <View style={styles.flexRow}>
                                <View style={[styles.imageSection]}>
                                  <View style={[styles.imageBox2]}>
                                    <Image
                                      source={IMAGES.NoImage}
                                      style={[styles.image2]}
                                    />
                                  </View>
                                </View>

                                <View style={styles.width74p}>
                                  <View style={styles.flexRowWrap}>
                                    <Text style={styles.empNam1}>
                                      {item?.name || ''}
                                    </Text>
                                  </View>
                                  <Text style={styles.empDes}>
                                    {item?.designation || ''}
                                  </Text>
                                  <Text style={styles.empDes}>
                                    {item?.mobileNo || ''}
                                  </Text>
                                </View>
                              </View>

                              <TouchableOpacity
                                onPress={() => {
                                  // if (userInfo?.strUrl === arlURL) {
                                  //   console.log(item);
                                  //   handleCall(
                                  //     item?.extensionNumber
                                  //       ? item?.extensionNumber
                                  //       : item?.mobileNo,

                                  //     item?.name,
                                  //   );
                                  // } else {
                                  dialCall(item?.mobileNo, undefined);
                                  // }
                                }}
                                style={{ padding: 8 }}
                              >
                                <Icon
                                  name="call"
                                  size={20}
                                  color={COLORS.graySubText}
                                />
                              </TouchableOpacity>
                            </Row>
                          ) : null}
                        </View>
                      ))
                    : null}
                </View>
              ) : (
                <SectionList
                  sections={sections}
                  keyExtractor={(ite, index) => ite + index}
                  ListFooterComponent={<View style={styles.hight100} />}
                  renderItem={ite => (
                    <View>
                      {ite?.item?.strTableType?.trim() === 'Employee' ||
                      ite?.item?.strTableType?.trim() === 'Location' ? (
                        <View
                          style={{
                            backgroundColor: ite?.item?.isActive
                              ? '#F2F4F7'
                              : COLORS.white,
                            paddingHorizontal: ite?.item?.isActive ? 8 : 16,
                            paddingVertical: 8,
                            borderRadius: 24,
                            marginHorizontal: ite?.item?.isActive ? 8 : 0,
                            marginTop: ite?.item?.isActive ? 4 : 0,
                            elevation: ite?.item?.isActive ? 5 : 0,
                            marginBottom: ite?.item?.isActive ? 4 : 0,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => handleActive(ite?.item)}
                            style={styles.flexRow}
                          >
                            <View style={styles.imageSection}>
                              {ite?.item?.intProfilePicFileUrlId ? (
                                <FastImage
                                  source={{
                                    uri: getImageURL(
                                      ite?.item?.intProfilePicFileUrlId,
                                    ),
                                  }}
                                  style={styles.image2}
                                />
                              ) : (
                                <View style={styles.imageBox2}>
                                  <Image
                                    source={IMAGES.NoImage}
                                    style={styles.image2}
                                  />
                                </View>
                              )}
                            </View>

                            <View style={styles.width74p}>
                              <View style={styles.flexRowWrap}>
                                <Text style={styles.empNam1}>
                                  {ite?.item?.EmployeeName?.trim()}
                                </Text>
                                <Text style={styles.empId}>
                                  [ ID{ite?.item?.EmployeeId} ]
                                </Text>
                                <Text>
                                  {ite?.item?.isBookmarked && (
                                    <Icon
                                      name="star"
                                      size={15}
                                      color={COLORS.late}
                                    />
                                  )}
                                </Text>
                              </View>
                              <Text style={styles.empDes}>
                                {ite?.item?.DesignationName}
                              </Text>
                              <Text style={styles.empDes}>
                                {ite?.item?.Phone}
                              </Text>

                              {ite?.item?.strTableType === 'Location' ? (
                                <Text style={styles.empPhone}>
                                  {ite?.item?.strAddress || ''}
                                </Text>
                              ) : null}
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                // if (userInfo?.strUrl === arlURL) {
                                //   handleCall(
                                //     ite?.item?.extensionNumber
                                //       ? ite?.item?.extensionNumber
                                //       : ite?.item?.Phone,

                                //     ite?.item?.EmployeeName?.trim(),
                                //   );
                                // } else {
                                dialCall(ite?.item?.Phone, undefined);
                                // }
                              }}
                              style={styles.padding8}
                            >
                              <Icon
                                name="call"
                                size={25}
                                color={COLORS.graySubText}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>

                          {ite?.item?.isActive ? (
                            <View style={styles.activeDevider1} />
                          ) : null}
                          {ite?.item?.isActive ? (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              showsVerticalScrollIndicator={false}
                              style={styles.moreSec}
                            >
                              {userInfo?.strUrl === arlURL ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    handleSwitchBoardData(
                                      ite?.item?.EmployeeId,
                                    );
                                  }}
                                  style={styles.chatAndInfo}
                                >
                                  <MIcon
                                    name="link"
                                    size={25}
                                    color={COLORS.white}
                                    style={{
                                      transform: [{ rotate: '135deg' }],
                                    }}
                                  />
                                </TouchableOpacity>
                              ) : null}

                              <TouchableOpacity
                                onPress={() =>
                                  //@ts-ignore
                                  navigation.navigate('CreateAppreciate', {
                                    empDetails: ite?.item,
                                  })
                                }
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <MIcon
                                  name="thumb-up-outline"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  handleThumsDown(ite?.item);
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <MIcon
                                  name="thumb-down-outline"
                                  size={25}
                                  color={
                                    ite?.item?.isThumbsDown
                                      ? COLORS.yellow
                                      : COLORS.white
                                  }
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  if (ite?.item?.Phone) {
                                    Linking.openURL(
                                      `sms:${ite?.item?.Phone}?body=`,
                                    );
                                  } else {
                                    toaster.show({
                                      message: 'Phone no is empty.',
                                      type: 'error',
                                    });
                                  }
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <Icon
                                  name="chat"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  //@ts-ignore
                                  navigation.navigate(
                                    'EmployeeDirectoryDetails',
                                    {
                                      employeeDetails: ite?.item || '',
                                    },
                                  );
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <Icon
                                  name="info"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              {userInfo?.strUrl === arlURL && (
                                <>
                                  <TouchableOpacity
                                    onPress={() => createBookmark(ite?.item)}
                                    style={[
                                      styles.chatAndInfo,
                                      styles.marginLeft12,
                                    ]}
                                  >
                                    <Icon
                                      name="star"
                                      size={25}
                                      color={
                                        ite?.item?.isBookmarked
                                          ? COLORS.late
                                          : COLORS.white
                                      }
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      // @ts-ignore
                                      setEmpId(ite?.item?.EmployeeId);
                                      // @ts-ignore
                                      refRBSheet?.current?.open();
                                    }}
                                    style={[styles.chatAndInfo, styles.mapIcon]}
                                  >
                                    <Icon
                                      name="notifications"
                                      size={25}
                                      color={COLORS.white}
                                    />
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    onPress={() => {
                                      setModalShow(true);
                                      setEmpId(ite?.item?.EmployeeId);
                                      // openMap(ite?.item?.presentAddress);
                                    }}
                                    style={[styles.chatAndInfo, styles.mapIcon]}
                                  >
                                    <MIcon
                                      name="map-marker"
                                      size={25}
                                      color={COLORS.white}
                                    />
                                  </TouchableOpacity>

                                  <View style={styles.width100} />
                                </>
                              )}
                            </ScrollView>
                          ) : null}
                          {ite?.item?.isActive ? null : (
                            <View style={styles.activeDevider2} />
                          )}
                        </View>
                      ) : ite?.item?.strTableType?.trim() === 'Skill' ? (
                        <View
                          style={{
                            backgroundColor: ite?.item?.isActive
                              ? '#F2F4F7'
                              : COLORS.white,
                            borderRadius: 24,
                            marginHorizontal: ite?.item?.isActive ? 8 : 10,
                            marginTop: ite?.item?.isActive ? 4 : 0,
                            elevation: ite?.item?.isActive ? 5 : 0,
                            marginBottom: ite?.item?.isActive ? 4 : 0,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => handleActive(ite?.item)}
                            style={styles.flexRowMbottom5}
                          >
                            <View style={styles.lightIconCon}>
                              <IconMY name="lightbulb-outline" size={32} />
                            </View>
                            <View style={styles.wid73pMtop5}>
                              <View style={styles.flexRow}>
                                <Text style={styles.skillTxt}>
                                  {ite?.item?.strSkillName}
                                </Text>
                              </View>
                              <View style={styles.flexRow}>
                                {ite?.item?.intProfilePicFileUrlId ? (
                                  <FastImage
                                    source={{
                                      uri: getImageURL(
                                        ite?.item?.intProfilePicFileUrlId,
                                      ),
                                    }}
                                    style={styles.imgCon}
                                  />
                                ) : (
                                  <Image
                                    source={IMAGES.NoImage}
                                    style={styles.imgCon}
                                  />
                                )}

                                <View style={styles.flexCenterWrap}>
                                  <Text style={styles.empNam2}>
                                    {ite?.item?.EmployeeName?.trim()}
                                  </Text>
                                  <Text>[ID{ite?.item?.EmployeeId}]</Text>
                                  <Text>
                                    {ite?.item?.isBookmarked && (
                                      <Icon
                                        name="star"
                                        size={15}
                                        color={COLORS.late}
                                      />
                                    )}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.flexRowMvartical4}>
                                {ite?.item?.DesignationName ? (
                                  <View style={styles.desSection}>
                                    <Text style={styles.desSubTxt}>
                                      {ite?.item?.DesignationName}
                                    </Text>
                                  </View>
                                ) : null}

                                {ite?.item?.strSkillProficiencyLevel ? (
                                  <View
                                    style={{
                                      backgroundColor: getEmpProficiencyBgColor(
                                        ite?.item?.strSkillProficiencyLevel,
                                      ),
                                      paddingHorizontal: 4,
                                      paddingVertical: 2,
                                      borderRadius: 4,
                                    }}
                                  >
                                    <Text
                                      style={{
                                        color: getEmpProficiencyTxtColor(
                                          ite?.item?.strSkillProficiencyLevel,
                                        ),
                                        fontSize: 12,
                                      }}
                                    >
                                      {ite?.item?.strSkillProficiencyLevel}
                                    </Text>
                                  </View>
                                ) : null}
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                // if (userInfo?.strUrl === arlURL) {
                                //   handleCall(
                                //     ite?.item?.extensionNumber
                                //       ? ite?.item?.extensionNumber
                                //       : ite?.item?.Phone,

                                //     ite?.item?.EmployeeName?.trim(),
                                //   );
                                // } else {
                                dialCall(ite?.item?.Phone, undefined);
                                //   ``;
                                // }
                              }}
                              style={styles.callIconCon}
                            >
                              <Icon
                                name="call"
                                size={25}
                                color={COLORS.graySubText}
                              />
                            </TouchableOpacity>
                          </TouchableOpacity>

                          {ite?.item?.isActive ? (
                            <View style={styles.activeDevider3} />
                          ) : null}
                          {ite?.item?.isActive ? (
                            <ScrollView
                              horizontal
                              showsHorizontalScrollIndicator={false}
                              showsVerticalScrollIndicator={false}
                              style={styles.moreSec}
                            >
                              {userInfo?.strUrl === arlURL ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    handleSwitchBoardData(
                                      ite?.item?.EmployeeId,
                                    );
                                  }}
                                  style={styles.chatAndInfo}
                                >
                                  <MIcon
                                    name="link"
                                    size={25}
                                    color={COLORS.white}
                                    style={{
                                      transform: [{ rotate: '135deg' }],
                                    }}
                                  />
                                </TouchableOpacity>
                              ) : null}

                              <TouchableOpacity
                                onPress={() =>
                                  //@ts-ignore
                                  navigation.navigate('CreateAppreciate', {
                                    empDetails: ite?.item,
                                  })
                                }
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <MIcon
                                  name="thumb-up-outline"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  handleThumsDown(ite?.item);
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <MIcon
                                  name="thumb-down-outline"
                                  size={25}
                                  color={
                                    ite?.item?.isThumbsDown
                                      ? COLORS.yellow
                                      : COLORS.white
                                  }
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  if (ite?.item?.Phone) {
                                    Linking.openURL(
                                      `sms:${ite?.item?.Phone}?body=`,
                                    );
                                  } else {
                                    toaster.show({
                                      message: 'Phone no is empty.',
                                      type: 'error',
                                    });
                                  }
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <Icon
                                  name="chat"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  //@ts-ignore
                                  navigation.navigate(
                                    'EmployeeDirectoryDetails',
                                    {
                                      employeeDetails: ite?.item || '',
                                    },
                                  );
                                }}
                                style={[
                                  styles.chatAndInfo,
                                  styles.marginLeft12,
                                ]}
                              >
                                <Icon
                                  name="info"
                                  size={25}
                                  color={COLORS.white}
                                />
                              </TouchableOpacity>

                              {userInfo?.strUrl === arlURL && (
                                <>
                                  <TouchableOpacity
                                    onPress={() => createBookmark(ite?.item)}
                                    style={[
                                      styles.chatAndInfo,
                                      styles.marginLeft12,
                                    ]}
                                  >
                                    <Icon
                                      name="star"
                                      size={25}
                                      color={
                                        ite?.item?.isBookmarked
                                          ? COLORS.late
                                          : COLORS.white
                                      }
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={() => {
                                      // @ts-ignore
                                      setEmpId(ite?.item?.EmployeeId);
                                      // @ts-ignore
                                      refRBSheet?.current?.open();
                                    }}
                                    style={[styles.chatAndInfo, styles.mapIcon]}
                                  >
                                    <Icon
                                      name="notifications"
                                      size={25}
                                      color={COLORS.white}
                                    />
                                  </TouchableOpacity>

                                  <TouchableOpacity
                                    onPress={() => {
                                      setModalShow(true);
                                      setEmpId(ite?.item?.EmployeeId);
                                      // openMap(ite?.item?.presentAddress);
                                    }}
                                    style={[styles.chatAndInfo, styles.mapIcon]}
                                  >
                                    <MIcon
                                      name="map-marker"
                                      size={25}
                                      color={COLORS.white}
                                    />
                                  </TouchableOpacity>

                                  <View style={styles.width100} />
                                </>
                              )}
                            </ScrollView>
                          ) : null}
                          {ite?.item?.isActive ? null : (
                            <View style={styles.bar1} />
                          )}
                        </View>
                      ) : ite?.item?.strTableType?.trim() === 'Contact' ? (
                        <>
                          <Text>Hello contact</Text>
                        </>
                      ) : null}
                    </View>
                  )}
                  renderSectionHeader={({ section: { title } }) => (
                    <View>
                      {title?.trim() === 'People' &&
                      activeMainTab !== 'Skill' ? (
                        <View style={styles.secHeader}>
                          <Text style={styles.title}>{title?.trim()}</Text>
                          <Text style={styles.title}>
                            Showing {sections?.[0]?.data?.length || '0'} results
                          </Text>
                        </View>
                      ) : title?.trim() === 'Skills' &&
                        activeMainTab !== 'Employee' ? (
                        <View style={styles.secHeader}>
                          <Text style={styles.title}>{title?.trim()}</Text>
                          <Text style={styles.title}>
                            Showing {sections?.[1]?.data?.length || '0'} results
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  )}
                />
              )}
            </View>
          )}

          {/* Modal  */}
          <View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={skillCategoryModalVisible}
              onRequestClose={categoryHideModal}
            >
              <View style={styles.centered_view}>
                <View
                  style={{
                    backgroundColor: COLORS.white,
                    height: SIZES.height / 1.4,
                  }}
                >
                  <View style={styles.empDetails}>
                    <Text style={styles.empNam3}>
                      {selectedSubcategory?.name || ''}
                    </Text>
                    <TouchableOpacity onPress={categoryHideModal}>
                      <IconMY
                        name="close"
                        size={25}
                        color={COLORS.graySubText}
                      />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.scrollCon}>
                    <View style={styles.modalMainCon}>
                      {/* Business Unit */}
                      {
                        // @ts-ignore
                        selectedSubcategory?.id === 1 &&
                          // @ts-ignore
                          businessUnitList?.length > 0 &&
                          // @ts-ignore
                          businessUnitList?.map((item: any, index: number) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handlebottomSheatItemsPress(item)}
                              style={[
                                styles.businessCon,
                                {
                                  backgroundColor: item?.isActive
                                    ? COLORS.primary
                                    : COLORS.white,
                                },
                              ]}
                            >
                              <AIcon
                                style={styles.paddingRight5}
                                color={
                                  item?.isActive
                                    ? COLORS.white
                                    : COLORS.iconColor
                                }
                                name="plus"
                                size={18}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  {
                                    color: item?.isActive
                                      ? COLORS.white
                                      : COLORS.black,
                                  },
                                ]}
                              >
                                {item?.label}
                              </Text>
                            </TouchableOpacity>
                          ))
                      }

                      {/* Department */}
                      {
                        // @ts-ignore
                        selectedSubcategory?.id === 2 &&
                          // @ts-ignore
                          empDepartmentList?.length > 0 &&
                          // @ts-ignore
                          empDepartmentList?.map((item: any, index: number) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handlebottomSheatItemsPress(item)}
                              style={[
                                styles.businessCon,
                                {
                                  backgroundColor: item?.isActive
                                    ? COLORS.primary
                                    : COLORS.white,
                                },
                              ]}
                            >
                              <AIcon
                                style={styles.paddingRight5}
                                color={
                                  item?.isActive
                                    ? COLORS.white
                                    : COLORS.iconColor
                                }
                                name="plus"
                                size={18}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  {
                                    color: item?.isActive
                                      ? COLORS.white
                                      : COLORS.black,
                                  },
                                ]}
                              >
                                {item?.label}
                              </Text>
                            </TouchableOpacity>
                          ))
                      }

                      {/* Employment Type */}
                      {
                        // @ts-ignore
                        selectedSubcategory?.id === 3 &&
                          // @ts-ignore
                          employmentTypeList?.length > 0 &&
                          // @ts-ignore
                          employmentTypeList?.map(
                            (item: any, index: number) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  handlebottomSheatItemsPress(item)
                                }
                                style={[
                                  styles.businessCon,
                                  {
                                    backgroundColor: item?.isActive
                                      ? COLORS.primary
                                      : COLORS.white,
                                  },
                                ]}
                              >
                                <AIcon
                                  style={styles.paddingRight5}
                                  color={
                                    item?.isActive
                                      ? COLORS.white
                                      : COLORS.iconColor
                                  }
                                  name="plus"
                                  size={18}
                                />
                                <Text
                                  style={[
                                    styles.buttonText,
                                    {
                                      color: item?.isActive
                                        ? COLORS.white
                                        : COLORS.black,
                                    },
                                  ]}
                                >
                                  {item?.label}
                                </Text>
                              </TouchableOpacity>
                            ),
                          )
                      }

                      {/* Skill Category */}
                      {
                        // @ts-ignore
                        selectedSubcategory?.id === 4 &&
                          // @ts-ignore
                          empSkillCategoryList?.length > 0 &&
                          // @ts-ignore
                          empSkillCategoryList?.map(
                            (item: any, index: number) => (
                              <TouchableOpacity
                                key={index}
                                onPress={() =>
                                  handlebottomSheatItemsPress(item)
                                }
                                style={[
                                  styles.businessCon,
                                  {
                                    backgroundColor: item?.isActive
                                      ? COLORS.primary
                                      : COLORS.white,
                                  },
                                ]}
                              >
                                <AIcon
                                  style={styles.paddingRight5}
                                  color={
                                    item?.isActive
                                      ? COLORS.white
                                      : COLORS.iconColor
                                  }
                                  name="plus"
                                  size={18}
                                />
                                <Text
                                  style={[
                                    styles.buttonText,
                                    {
                                      color: item?.isActive
                                        ? COLORS.white
                                        : COLORS.black,
                                    },
                                  ]}
                                >
                                  {item?.label}
                                </Text>
                              </TouchableOpacity>
                            ),
                          )
                      }

                      {/* Proficiency Levels */}
                      {
                        // @ts-ignore
                        selectedSubcategory?.id === 5 &&
                          proficiencyLevels?.length > 0 &&
                          proficiencyLevels?.map((item: any, index: number) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() => handlebottomSheatItemsPress(item)}
                              style={[
                                styles.businessCon,
                                {
                                  backgroundColor: item?.isActive
                                    ? COLORS.primary
                                    : COLORS.white,
                                },
                              ]}
                            >
                              <AIcon
                                style={styles.paddingRight5}
                                color={
                                  item?.isActive
                                    ? COLORS.white
                                    : COLORS.iconColor
                                }
                                name="plus"
                                size={18}
                              />
                              <Text
                                style={[
                                  styles.buttonText,
                                  {
                                    color: item?.isActive
                                      ? COLORS.white
                                      : COLORS.black,
                                  },
                                ]}
                              >
                                {item?.label}
                              </Text>
                            </TouchableOpacity>
                          ))
                      }
                    </View>
                  </ScrollView>
                  <View style={styles.paddingHor16}>
                    <TouchableOpacity
                      onPress={() => {
                        setSkillCategoryModalVisible(false);
                        callContactBookApi();
                      }}
                      style={styles.shorResCon}
                    >
                      <Text style={styles.shorResTxt}>Show Result</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      )}
      <RBSheet
        //@ts-ignore
        ref={refRBSheet}
        width={SIZES.width}
        height={SIZES.height / 2.5}
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
                refRBSheet?.current?.close()
              }
            >
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="agendaOfMeetMe"
              placeholder="Agenda Of Meet Me"
              label="Agenda Of Meet Me"
              rules={{ required: true }}
            />

            <View style={styles.padT16}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="schedule"
                placeholder="Arrival Time"
                label="Arrival Time"
                rules={{ required: true }}
              />
            </View>

            <CustomButtonNew
              btnText="Send Meet Me"
              onBtnPress={handleSubmit(createMeetMeMsg)}
              btnstyle={styles.btn1}
              btnTextStyle={styles.btnText1}
            />
          </View>
        </View>
      </RBSheet>

      <RBSheet
        //@ts-ignore
        ref={refRBSheet1}
        width={SIZES.width}
        height={SIZES.height / 1.8}
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
            <Text style={styles.switchTxt}>Switch Board</Text>
            <TouchableOpacity
              onPress={() =>
                // @ts-ignore
                refRBSheet1?.current?.close()
              }
            >
              <MIcon name="close" size={30} color={COLORS.transparentDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.sheetFooter}>
            {switchBoardData?.length > 0 ? (
              <>
                {switchBoardData?.map((item: any, index: number) => (
                  <View key={index}>
                    {item?.strSwitchBoardLink ? (
                      <TouchableOpacity
                        onPress={() => {
                          //@ts-ignore
                          refRBSheet1?.current?.close();
                          Linking.openURL(item?.strSwitchBoardLink);
                        }}
                        style={styles.linkIcon}
                      >
                        <MIcon
                          name="link"
                          size={25}
                          color={COLORS.blue}
                          style={{
                            transform: [{ rotate: '135deg' }],
                          }}
                        />
                        <Text style={styles.switchNam}>
                          {item?.strSwitchBoardName}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
              </>
            ) : null}
          </View>
        </View>
      </RBSheet>

      <Modal
        transparent={true}
        animationType="none"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Calling...</Text>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
              style={styles.endCallButton}
            >
              <Text style={styles.endCallText}>Call End</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <MapLocModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        location={location}
        idForLocation={empId}
      />
    </ContainerNew>
  );
};

export default EmployeeDirectoryNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 62,
    paddingTop: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
  },

  buttonText: {
    color: COLORS.black,
  },

  centered_view: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000099',
  },

  imageBox1: {
    height: 64,
    width: 64,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },
  imageSection: {
    paddingRight: 12,
    alignSelf: 'center',
  },
  image1: {
    width: 64,
    height: 64,
    borderRadius: 100,
  },
  imageBox2: {
    height: 48,
    width: 48,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#DCDCDC',
  },

  image2: {
    width: 48,
    height: 48,
    borderRadius: 100,
  },
  loadingIndicator: {
    paddingTop: SIZES.height / 2.5,
  },
  chatAndInfo: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 100,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sheetFooter: {
    paddingTop: 30,
    paddingHorizontal: 10,
  },
  pHorizontal: {
    paddingHorizontal: 16,
  },
  btn1: {
    alignSelf: 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%',
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  marginLeft12: {
    marginLeft: 12,
  },
  marginLeft5: {
    marginLeft: 5,
  },
  marginRight5: {
    marginRight: 5,
  },
  hight8: {
    height: 8,
  },
  hight100: {
    height: 100,
  },
  flexCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  width85p: {
    width: '85%',
  },
  profileMidContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  rowCenterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  empNam: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    paddingRight: 6,
    color: COLORS.black,
  },
  empNam1: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.black,
  },
  empDesignation: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  callIcon: {
    padding: 8,
    alignSelf: 'center',
  },
  activeDevider: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  activeDevider1: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginBottom: 4,
    marginTop: 8,
    marginHorizontal: 8,
  },
  activeDevider2: {
    height: 1,
    width: '100%',
    marginTop: 8,
    backgroundColor: COLORS.bar,
  },
  activeScroll: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
    marginHorizontal: 10,
  },
  empPhone: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  mapIcon: {
    marginLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bar1: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.bar,
  },
  width100: {
    width: 100,
  },
  searchCon: {
    flexDirection: 'row',
    backgroundColor: '#F2F4F7',
    height: 44,
    width: '90%',
    alignItems: 'center',
    borderRadius: 100,
  },
  pHorizontal12: {
    paddingHorizontal: 12,
  },
  peopleCon: {
    backgroundColor: '#F2F4F7',
    width: SIZES.width / 1.55,
    height: 32,
    flexDirection: 'row',
  },
  btnCon: {
    flexDirection: 'row',
    height: 32,
    marginBottom: 5,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: COLORS.primary,
  },
  whiteTxt: {
    color: COLORS.white,
    marginLeft: 0,
  },
  qrCon: {
    height: 24,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  PLeft4: {
    paddingLeft: 4,
  },
  empCon: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bar,
  },
  empSkilDes: {
    width: 8,
    height: 8,
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    position: 'absolute',
    right: -1,
    top: 2,
  },
  width50: {
    width: 50,
  },
  flexRow: {
    flexDirection: 'row',
  },
  padLeft4: {
    paddingLeft: 4,
  },
  marginRight2: {
    marginRight: 2,
  },
  width74p: {
    width: '74%',
  },
  flexRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empId: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    paddingHorizontal: 6,
    color: COLORS.black,
  },
  empDes: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  padding8: {
    padding: 8,
  },
  moreSec: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
    marginHorizontal: 8,
  },
  flexRowMbottom5: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  lightIconCon: {
    height: 48,
    width: 48,
    backgroundColor: '#F2F4F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginRight: 10,
  },
  skillTxt: {
    fontSize: 16,
    fontWeight: '400',
    color: COLORS.black,
  },
  wid73pMtop5: {
    marginTop: 5,
    width: '73%',
  },
  imgCon: {
    height: 16,
    width: 16,
    borderRadius: 100,
    borderColor: COLORS.white,
    alignSelf: 'center',
  },
  flexCenterWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  desSubTxt: {
    color: COLORS.graySubText,
    fontSize: 12,
    lineHeight: 16,
  },
  activeDevider3: {
    height: 1,
    backgroundColor: '#EAECF0',
    marginHorizontal: 12,
    marginVertical: 4,
  },
  empNam2: {
    fontSize: 16,
    fontWeight: '400',
    paddingHorizontal: 6,
    color: COLORS.black,
  },
  flexRowMvartical4: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  desSection: {
    backgroundColor: COLORS.newGray,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 8,
    borderRadius: 4,
  },
  callIconCon: {
    padding: 8,
    alignSelf: 'center',
  },
  secHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  title: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    color: COLORS.graySubText,
  },
  padT16: {
    paddingTop: 16,
  },
  switchTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingLeft: 8,
    alignSelf: 'center',
  },
  empDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.bar,
  },
  empNam3: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 30,
    color: COLORS.black,
  },
  scrollCon: {
    width: SIZES.width,
    paddingHorizontal: 16,
  },
  paddingRight5: {
    paddingRight: 5,
  },
  modalMainCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  businessCon: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    marginVertical: 8,
    marginRight: 8,
    paddingHorizontal: 10,
    borderColor: COLORS.offDay,
    borderRadius: 100,
    borderWidth: 1,
  },
  switchNam: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.blue,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    paddingLeft: 8,
  },
  linkIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 4,
  },
  paddingHor16: {
    paddingHorizontal: 16,
  },
  shorResCon: {
    marginBottom: 10,
    height: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
  },
  shorResTxt: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '500',
  },

  callButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  buttonText2: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  endCallButton: {
    marginTop: 10,
    padding: 10,
  },
  endCallText: {
    color: 'red',
    fontSize: 16,
  },
});
