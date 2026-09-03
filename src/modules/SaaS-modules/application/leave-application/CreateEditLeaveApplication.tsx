import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Edge } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import FastImage from 'react-native-fast-image';
import { launchImageLibrary } from 'react-native-image-picker';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRootStore } from '../../../../stores/rootStore';
import { ModifyLeaveTypeDDLType } from '../../../../interfaces/leave/leave';
import {
  createLeaveApplication,
  uploadLeaveFiles,
} from '../../../../services/SaaS-modules/leave/leave';
import {
  _todayDate,
  _todayDateTime,
} from '../../../../common/services/todayDate';
import { arlURL, commonURL, rscURL } from '../../../../../App';
import Voice from '@dev-amirzubair/react-native-voice';
import Tts from '@iternio/react-native-tts';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomInputNew from '../../../../common/components/CustomInput';
import { COLORS } from '../../../../common/constant/Themes';
import CustomButtonNew from '../../../../common/components/CustomButton';
import LeaveBalanceSheet from './LeaveBalanceSheet';
import { getImageURL } from '../../../../common/services/getImage';
import { useToast } from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { datetimeToDate } from '../../../../common/services/datetimeToDate';

import { chat, PeopleDeskAllDDL } from '../../../../common/api/api';
import { httpRequest } from '../../../../common/constant/httpRequest';
import Row from '../../../../common/components/Row';
import Column from '../../../../common/components/Column';

const edges: Edge[] = ['right', 'bottom', 'left'];

// for matador
const leaveLengthDDL = [
  {
    label: 'Full Day',
    value: 1,
  },
  {
    label: 'Half Day',
    value: 2,
  },
];

const halfDayTimeDDL = [
  {
    label: '8:30 AM – 12:30 PM',
    value: 1,
  },
  {
    label: '1:30 PM – 05:30 PM',
    value: 2,
  },
];

const CreateEditLeaveApplication = () => {
  const route = useRoute();
  //@ts-ignore
  const leaveDetails = route?.params?.leaveDetails;
  const date = dayjs();
  const navigation = useNavigation();
  const refRBSheet = useRef<any>(null);
  const { userInfo } = useRootStore();
  const isFocused = useIsFocused();
  const toaster = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState<ModifyLeaveTypeDDLType[]>();
  const [isApplicationSubmit, setIsApplicationSubmit] = useState(false);
  const [leaveType, setLeaveType] = useState({
    LeaveType: '',
    LeaveTypeId: 0,
    label: '',
    value: 0,
    AppliedFromDate: '',
    AppliedToDate: '',
  });
  const [minDate, setMinDate] = useState(
    Platform.OS === 'ios' ? _todayDateTime() : '',
  );
  // for common project
  const [maxDate, setMaxDate] = useState(
    Platform.OS === 'ios' ? _todayDateTime() : '',
  );
  const [toDate1, setToDate1] = useState(
    Platform.OS === 'ios' ? _todayDateTime() : '',
  );
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();

  const timeDDL = [
    { label: '9:00 AM', value: 1 },
    { label: '9:30 AM', value: 2 },
    { label: '10:00 AM', value: 3 },
    { label: '10:30 AM', value: 4 },
    { label: '11:00 AM', value: 5 },
    { label: '11:30 AM', value: 6 },
    { label: '12:00 PM', value: 7 },
    { label: '12:30 PM', value: 8 },
    { label: '1:00 PM', value: 9 },
    { label: '1:30 PM', value: 10 },
    { label: '2:00 PM', value: 11 },
    { label: '2:30 PM', value: 12 },
    { label: '3:00 PM', value: 13 },
    { label: '3:30 PM', value: 14 },
    { label: '4:00 PM', value: 15 },
    { label: '4:30 PM', value: 16 },
    { label: '5:00 PM', value: 17 },
    { label: '5:30 PM', value: 18 },
    { label: '6:00 PM', value: 19 },
  ];
  // console.log('user', JSON.stringify(userInfo, null, 2));
  const [endTimeDDL, setEndTimeDDL] = useState(timeDDL);
  // for common project

  const [voiceChatVisible, setVoiceChatVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    { role: string; content: string }[]
  >([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceApiLoading, setIsVoiceApiLoading] = useState(false);
  const [voiceResultText, setVoiceResultText] = useState('');
  const shouldCallApiRef = useRef(false);
  const chatHistoryRef = useRef<{ role: string; content: string }[]>([]);
  const chatScrollRef = useRef<any>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      // for common project
      const commonParams = {
        BusinessUnitId:
          leaveDetails?.BusinessUnitId || userInfo?.intBusinessUnitId,
        intId: leaveDetails?.EmployeeId || userInfo?.intEmployeeId,
        DDLType: 'EmployeeLeaveType',
      };
      const apiParams = {
        url: PeopleDeskAllDDL,
        data:
          userInfo?.strUrl === commonURL
            ? {
                ...commonParams,
                WorkplaceGroupId:
                  leaveDetails?.AccountId || userInfo?.intWorkplaceGroupId,
                intWorkplaceId: 0,
              }
            : {
                ...commonParams,
                AccountId: leaveDetails?.AccountId || userInfo?.intAccountId,
              },
      };
      const res = await httpRequest(apiParams, setIsLoading);
      const modifyRes = res?.map((item: any) => {
        return {
          ...item,
          value: item?.LeaveTypeId,
          label: item?.LeaveType,
        };
      });

      const modifyForApply = modifyRes?.filter(
        (item: any) => item?.IsLveBalanceApplyForSelfService,
      );
      userInfo?.strUrl === commonURL
        ? setLeaveTypeDDL(modifyForApply)
        : setLeaveTypeDDL(modifyRes);
      //   const res = await getLeaveTypeDDL(
      //     leaveDetails?.AccountId || userInfo?.intAccountId,
      //     leaveDetails?.BusinessUnitId || userInfo?.intBusinessUnitId,
      //     leaveDetails?.EmployeeId || userInfo?.intEmployeeId,
      //   );
      //   setLeaveTypeDDL(res);

      if (leaveDetails?.isLeaveCreate !== true) {
        setLeaveType({
          LeaveType: leaveDetails?.LeaveType,
          LeaveTypeId: leaveDetails?.LeaveTypeId,
          label: leaveDetails?.LeaveType,
          value: leaveDetails?.LeaveTypeId,
          AppliedFromDate: leaveDetails?.AppliedFromDate,
          AppliedToDate: leaveDetails?.AppliedToDate,
        });
        setMinDate(leaveDetails?.AppliedFromDate);
        setMaxDate(leaveDetails?.AppliedToDate); // for common project
        setToDate1(leaveDetails?.AppliedToDate);
        setStartTime(
          //@ts-ignore
          timeDDL?.find(item => item?.label === leaveDetails?.strLeaveFrom)
            ?.value,
        );

        setEndTimeDDL(
          timeDDL?.splice(
            timeDDL?.findIndex(
              item => item?.label === leaveDetails?.strLeaveTo,
            ),
            timeDDL?.length,
          ),
        );
      }
    },
    [userInfo, isFocused],
  );

  const defaultValuesForUpdate = {
    reportType: {
      value: leaveDetails?.LeaveTypeId,
      label: leaveDetails?.LeaveType,
    },
    fromDate: leaveDetails?.AppliedFromDate?.split('T')?.[0],
    toDate: leaveDetails?.AppliedToDate?.split('T')?.[0],
    location: leaveDetails?.AddressDuetoLeave,
    reason: leaveDetails?.Reason,
    startTime: {
      value: 0,
      label: leaveDetails?.strLeaveFrom,
    },
    endTime: {
      value: 0,
      label: leaveDetails?.strLeaveTo,
    },
    totalHours: leaveDetails?.numLeaveTime
      ? (leaveDetails?.numLeaveTime / 60).toString()
      : '',

    // for common project
    leaveLength:
      leaveDetails?.HalfDay === true
        ? {
            label: 'Half Day',
            value: 2,
          }
        : {
            label: 'Full Day',
            value: 1,
          },

    halfDayTime:
      leaveDetails?.HalfDay === true
        ? leaveDetails?.HalfDayRange?.includes('12')
          ? {
              label: '8:30 AM – 12:30 PM',
              value: 1,
            }
          : {
              label: '1:30 PM – 05:30 PM',
              value: 2,
            }
        : '',
  };

  const { control, handleSubmit, setValue, reset, watch, getValues } = useForm({
    defaultValues: {
      fromDate: Platform.OS === 'ios' ? _todayDate() : '',
      toDate: Platform.OS === 'ios' ? _todayDate() : '',
    },
  });
  //@ts-ignore
  const dayFull = watch('leaveLength');

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (leaveDetails?.LeaveTypeId) {
        reset(defaultValuesForUpdate);
      }
    },
    [leaveDetails],
  );

  const onSubmit = async (data: any) => {
    const fromDate = dayjs(data?.fromDate && data?.fromDate);
    const toDate = dayjs(data?.toDate && data?.toDate);
    //@ts-ignore
    if (
      dayjs(maxDate)?.diff(dayjs(minDate)) > 0 &&
      //@ts-ignore
      dayFull?.value === 2
    ) {
      toaster.show({ message: 'Invalid date range', type: 'error' });
      return;
    }
    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({ message: 'Invalid date duration', type: 'error' });
      return;
    } else {
      const payload = {
        //part id 1 = create, 2 = edit
        partId: leaveDetails?.intApplicationId ? 2 : 1,
        leaveApplicationId: leaveDetails?.intApplicationId || 0,
        leaveTypeId: data?.reportType?.value,
        employeeId:
          // leaveDetails?.EmployeeId == Employee Management Leave Create, leaveDetails?.empLeaveData?.EmployeeId == Employee Management Leave Edit,
          leaveDetails?.EmployeeId ||
          leaveDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
        accountId:
          leaveDetails?.AccountId ||
          leaveDetails?.empLeaveData?.profileData?.empEmployeeBankDetail
            ?.intAccountId ||
          userInfo?.intAccountId,
        businessUnitId:
          leaveDetails?.BusinessUnitId ||
          leaveDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        appliedFromDate: data?.fromDate
          ? data?.fromDate
          : Platform.OS === 'ios'
          ? _todayDateTime()
          : '',
        appliedToDate: data?.toDate
          ? data?.toDate
          : Platform.OS === 'ios'
          ? _todayDateTime()
          : '',
        applicationDate: date,
        documentFile: imageFile?.globalFileUrlId
          ? imageFile?.globalFileUrlId
          : 0,
        leaveReason: data?.reason,
        addressDuetoLeave: data?.location,
        insertBy:
          leaveDetails?.EmployeeId ||
          leaveDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
      };

      const payload2 = {
        ...payload,
        leaveTime: +data?.totalHours * 60,
        leaveFrom: data?.startTime?.label || '9:00 AM',
        leaveTo: data?.endTime?.label || '6:00 PM',
      };

      const commonPayload = {
        isActive: true,
        yearId: dayjs().year(),
        leaveApplicationId: leaveDetails?.intApplicationId || 0,
        leaveTypeId: data?.reportType?.value,
        employeeId:
          leaveDetails?.EmployeeId ||
          leaveDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
        businessUnitId:
          leaveDetails?.BusinessUnitId ||
          leaveDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        appliedFromDate: data?.fromDate
          ? datetimeToDate(data?.fromDate)
          : _todayDateTime(),
        appliedToDate: data?.toDate
          ? datetimeToDate(data?.toDate)
          : _todayDateTime(),
        documentFile: imageFile?.globalFileUrlId
          ? imageFile?.globalFileUrlId
          : 0,
        leaveReason: data?.reason,
        addressDuetoLeave: data?.location,
        //@ts-ignore
        isHalfDay: dayFull?.value === 2 ? true : false,
        //@ts-ignore
        strHalDayRange: dayFull?.value === 2 ? data?.halfDayTime?.label : '',
        workplaceGroupId:
          leaveDetails?.empLeaveData?.profileData?.employeeProfileLandingView
            ?.intWorkplaceGroupId || userInfo?.intWorkplaceGroupId,
        isSelfService: leaveDetails?.empLeaveData?.EmployeeId ? false : true,
      };
      const res = await createLeaveApplication(
        userInfo?.strUrl === rscURL
          ? payload2
          : userInfo?.strUrl === commonURL
          ? commonPayload
          : payload,
        setIsApplicationSubmit,
      );
      if (res?.statusCode === 200) {
        reset();
        setChatHistory([]);
        toaster.show({ message: res?.message, type: 'success' });
        if (leaveDetails?.intApplicationId) {
          //@ts-ignore
          navigation.pop(2);
        } else {
          navigation.goBack();
        }
      }
      if (res?.statusCode === 500) {
        toaster.show({ message: res?.message, type: 'error' });
      }
      if (res?.StatusCode === 500) {
        toaster.show({ message: res?.Message, type: 'error' });
      }
    }
  };

  const openGallary = () => {
    launchImageLibrary(
      {
        //@ts-ignore
        mediatype: 'photo',
        includeBase64: true,
        selectionLimit: 10,
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.7,
      },
      async res => {
        upload(res);
      },
    );
  };

  const upload = async (res: any) => {
    const response = await uploadLeaveFiles(
      userInfo?.intAccountId,
      userInfo?.intEmployeeId,
      userInfo?.intBusinessUnitId,
      userInfo?.intEmployeeId,
      res?.assets?.[0],
    );
    if (response) {
      setImageFile(response);
      toaster.show({
        message: 'Document uploaded successfully.',
        type: 'success',
      });
    }
  };

  // Keep chatHistoryRef in sync so Voice callback always reads latest history
  useEffect(() => {
    chatHistoryRef.current = chatHistory;
  }, [chatHistory]);

  // TTS setup and cleanup
  useEffect(() => {
    if (userInfo?.strUrl !== arlURL) return;
    // Wait for the native TTS engine to be ready, then configure it.
    Tts.getInitStatus()
      .then(() => {
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5, true);
        Tts.setDefaultPitch(1.0);
      })
      .catch((err: any) => {
        // requiresInstall: Android may need TTS engine/data installed
        if (err?.code === 'no_engine') {
          Tts.requestInstallEngine();
        }
        console.log('TTS init error:', err);
      });

    const startSub = Tts.addEventListener('tts-start', () =>
      setIsSpeaking(true),
    );
    const finishSub = Tts.addEventListener('tts-finish', () =>
      setIsSpeaking(false),
    );
    const cancelSub = Tts.addEventListener('tts-cancel', () =>
      setIsSpeaking(false),
    );

    return () => {
      Tts.stop();
      startSub.remove();
      finishSub.remove();
      cancelSub.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Speak the assistant reply aloud.
  const speakReply = (text: string) => {
    if (!text) return;
    Tts.stop();
    Tts.speak(text);
  };

  // Destroy Voice on unmount
  useEffect(() => {
    if (userInfo?.strUrl !== arlURL) {
      return;
    }
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call Pepobot API when voice text is ready
  useEffect(() => {
    if (!voiceResultText) {
      return;
    }
    const text = voiceResultText;
    setVoiceResultText('');

    (async () => {
      try {
        const api_params = {
          url: chat,
          data: {
            text,
            history: chatHistoryRef.current,
            employee_id: userInfo?.intEmployeeId,
            business_unit_id: userInfo?.intBusinessUnitId,
          },
          baseURL: 'https://pepobot.ibos.io',
          // 'https://pepobot.peopledesk.io/chat'
          method: 'post',
          isConsole: true,
          isConsoleParams: true,
        };
        const res = await httpRequest(api_params, setIsVoiceApiLoading);
        const reply =
          res?.reply || res?.response || res?.message || res?.text || '';
        setChatHistory(prev => [
          ...prev,
          { role: 'user', content: text },
          { role: 'assistant', content: reply },
        ]);
        // Speak only the assistant reply; the spoken user text is shown as text.
        speakReply(reply);
      } catch (err) {
        console.error('Pepobot API error:', err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceResultText]);

  const startVoiceRecording = async () => {
    try {
      setIsRecording(true);
      shouldCallApiRef.current = true;
      // Destroy any previous session so Voice module is in a clean state.
      // Voice.start() silently fails on subsequent calls without this.
      await Voice.destroy();
      Voice.onSpeechResults = (e: any) => {
        const text = e?.value?.[0] || '';
        if (text && shouldCallApiRef.current) {
          shouldCallApiRef.current = false;
          setVoiceResultText(text);
        }
      };
      Voice.onSpeechError = () => {
        setIsRecording(false);
        shouldCallApiRef.current = false;
      };
      await Voice.start('en-US');
    } catch (error) {
      console.error('Voice start error:', error);
      setIsRecording(false);
      shouldCallApiRef.current = false;
    }
  };

  const stopVoiceRecording = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Voice stop error:', error);
      setIsRecording(false);
    }
  };

  return (
    <ContainerNew
      edges={edges}
      // scrollEnabled={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          infoIconPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          title="Leave Application"
          components={
            // userInfo?.strUrl === arlURL ? (
            <TouchableOpacity
              onPress={() => setVoiceChatVisible(true)}
              style={styles.voiceHeaderIcon}
            >
              <IIcon name="mic" size={24} color={COLORS.white} />
            </TouchableOpacity>
            // ) : undefined
          }
        />
      }
      style={styles.container}
    >
      <KeyboardAwareScrollView
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll
      >
        <View style={Platform.OS === 'android' ? styles.inputMain : {}}>
          <View>
            <CustomDropDownNew
              control={control}
              data={leaveTypeDDL}
              name="reportType"
              label="Leave Type"
              placholder="Choose"
              onChange={(options: any) => {
                //@ts-ignore
                setValue('reportType', options);
                setLeaveType(options);
                //@ts-ignore
                setValue('startTime', {});
                //@ts-ignore
                setValue('endTime', {});
                //@ts-ignore
                setValue('totalHours', '');
              }}
              rules={{ required: true }}
            />
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.dateWidth}>
              <CustomDatePickerNew
                name="fromDate"
                label="From Date"
                control={control}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
                onChange={(d: string) => {
                  setValue('fromDate', d);
                  setMinDate(d);
                  setMaxDate(d);
                  //@ts-ignore
                  setValue('startTime', {});
                  //@ts-ignore
                  setValue('endTime', {});
                  //@ts-ignore
                  setValue('totalHours', '');
                  setValue('toDate', '');
                  // if (d) {
                  //   setFromDateCal(d);
                  // }
                }}
              />
            </View>
            <View style={styles.dateWidth}>
              <CustomDatePickerNew
                name="toDate"
                label="To Date"
                control={control}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
                onChange={(d: string) => {
                  setValue('toDate', d);
                  setToDate1(d);
                  //@ts-ignore
                  setValue('startTime', {});
                  //@ts-ignore
                  setValue('endTime', {});
                  //@ts-ignore
                  setValue('totalHours', '');
                  // if (d) {
                  //   setToDateCal(d);
                  // }
                }}
                //@ts-ignore
                minimumDate={minDate}
                isDisable={getValues('fromDate') ? false : true}
              />
            </View>
          </View>
          {/* for common project */}
          {dayjs(maxDate)?.diff(dayjs(minDate)) === 0 &&
            userInfo?.strUrl === commonURL && (
              <Row
                rowWidth="100%"
                rowStyle={{
                  paddingTop: 10,
                }}
              >
                <Column colWidth="100%">
                  <CustomDropDownNew
                    control={control}
                    data={leaveLengthDDL}
                    name="leaveLength"
                    label="Leave Length"
                    placholder="Choose"
                    onChange={(options: any) => {
                      //@ts-ignore
                      setValue('leaveLength', options);
                      if (options?.value === 1) {
                        //@ts-ignore
                        setValue('halfDayTime', '');
                      }
                    }}
                    rules={{
                      required:
                        userInfo?.strUrl === commonURL
                          ? dayjs(maxDate)?.diff(dayjs(minDate)) === 0
                            ? true
                            : false
                          : false,
                    }}
                  />
                </Column>
              </Row>
            )}

          {
            //@ts-ignore
            dayFull?.value === 2 && (
              <Row
                rowWidth="100%"
                rowStyle={{
                  paddingTop: 10,
                }}
              >
                <Column colWidth="100%">
                  <CustomDropDownNew
                    control={control}
                    data={halfDayTimeDDL}
                    name="halfDayTime"
                    label="Half Day Time"
                    placholder="Choose"
                    setValue={setValue}
                    //@ts-ignore
                    rules={{ required: dayFull?.value === 2 ? true : false }}
                  />
                </Column>
              </Row>
            )
          }
          <View>
            {userInfo?.strUrl === rscURL &&
            (leaveType?.LeaveType.trim().toLocaleLowerCase() ===
              'casual leave' ||
              leaveType?.LeaveType.trim().toLocaleLowerCase() ===
                'earn leave/annual leave' ||
              leaveType?.LeaveType.trim().toLocaleLowerCase() ===
                'sick leave') &&
            dayjs(toDate1).diff(dayjs(minDate)) === 0 ? (
              <View style={styles.dateContainer}>
                <View style={styles.timeWidth}>
                  <CustomDropDownNew
                    control={control}
                    data={timeDDL}
                    name="startTime"
                    label="Start Time"
                    placholder="Choose"
                    onChange={(options: any) => {
                      //@ts-ignore
                      setValue('startTime', options);
                      setStartTime(options.value);
                      //@ts-ignore
                      setValue('endTime', {});

                      setEndTimeDDL(
                        timeDDL.splice(
                          leaveType.LeaveType === 'Casual Leave'
                            ? options?.value + 7
                            : leaveType.LeaveType === 'Sick Leave'
                            ? options?.value + 3
                            : options?.value,
                          timeDDL?.length,
                        ),
                      );

                      if (endTime) {
                        //@ts-ignore
                        setValue(
                          'fromDate',
                          (
                            (+options?.value - +(startTime ?? '')) /
                            2
                          ).toString(),
                        );
                      }
                      //@ts-ignore
                      setValue('toDate', '');
                    }}
                    rules={{ required: true }}
                  />
                </View>
                <View style={styles.timeWidth}>
                  <CustomDropDownNew
                    control={control}
                    data={endTimeDDL}
                    name="endTime"
                    label="End Time"
                    placholder="Choose"
                    onChange={(options: any) => {
                      //@ts-ignore
                      setValue('endTime', options);
                      setEndTime(options.value);
                      if (startTime) {
                        //@ts-ignore
                        setValue(
                          'fromDate',
                          ((+options?.value - +startTime) / 2).toString(),
                        );
                      }
                      //@ts-ignore
                      setValue('totalHours', ''); // Fix: Pass the correct parameter name 'fromDate' or 'toDate' instead of 'totalHours'
                    }}
                    rules={{ required: true }}
                  />
                </View>
                <View style={styles.timeWidth}>
                  <CustomInputNew
                    control={control}
                    name="totalHours"
                    placeholder="Hours"
                    disabled={true}
                    label="Total Hours"
                    rules={{ required: true }}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.paddingTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="location"
              placeholder="Enter Location"
              multiline
              label="Location"
              rules={{ required: true }}
            />
          </View>
          <View style={styles.paddingTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="reason"
              placeholder="Reason for leave"
              multiline
              label="Reason"
              rules={{ required: true }}
            />
          </View>

          {/*      
          {leaveType?.label?.trim() === 'Sick Leave' ||
          leaveType?.label?.trim() === 'Medical Leave' ||
          leaveType?.label?.trim() === 'Sick leave' ||
          leaveType?.label?.trim() === 'ML' ? (
            <View style={styles.file}>
              {Platform.OS === 'android' ? (
                <TouchableOpacity
                  onPress={() => openGallary()}
                  style={styles.upldImg}>
                  <Icon
                    name="upload"
                    size={25}
                    color={COLORS.primary}
                    style={styles.icon}
                  />
                  <Text style={styles.uploadText}>File Upload</Text>
                </TouchableOpacity>
              ) : null}

              {Platform.OS === 'ios' ? (
                <View>
                  <Text style={styles.fileUploadText}>File upload</Text>
                  <TouchableOpacity
                    style={styles.fileUploadBtn}
                    onPress={() => openGallary()}>
                    <IIcon
                      name="cloud-upload-outline"
                      size={24}
                      style={styles.iosUploadIcon}
                    />
                    <Text style={styles.clickText}>Click to upload</Text>
                    <Text style={styles.clickOtherText}>PNG, JPG or PDF</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              <View style={styles.fileNamePart}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#00ff00" />
                ) : (
                  <>
                    {imageFile?.fileName && (
                      <>
                        <TouchableOpacity
                          onPress={() => setModalVisible(!modalVisible)}
                          style={styles.imageFileName}>
                          <Text style={styles.fileN}>
                            {imageFile && imageFile?.fileName}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setImageFile([])}>
                          <EnIcon
                            name="cross"
                            size={20}
                            style={styles.imageCancelIcon}
                          />
                        </TouchableOpacity>
                      </>
                    )}
                  </>
                )}
              </View>
            </View>
          ) : null} */}

          <View style={styles.file}>
            {Platform.OS === 'android' ? (
              <TouchableOpacity
                onPress={() => openGallary()}
                style={styles.upldImg}
              >
                <Icon
                  name="upload"
                  size={25}
                  color={COLORS.primary}
                  style={styles.icon}
                />
                <Text style={styles.uploadText}>File Upload</Text>
              </TouchableOpacity>
            ) : null}

            {Platform.OS === 'ios' ? (
              <View>
                <Text style={styles.fileUploadText}>File upload</Text>
                <TouchableOpacity
                  style={styles.fileUploadBtn}
                  onPress={() => openGallary()}
                >
                  <IIcon
                    name="cloud-upload-outline"
                    size={24}
                    style={styles.iosUploadIcon}
                  />
                  <Text style={styles.clickText}>Click to upload</Text>
                  <Text style={styles.clickOtherText}>PNG, JPG or PDF</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            <View style={styles.fileNamePart}>
              {isLoading ? (
                <ActivityIndicator size="small" color="#00ff00" />
              ) : (
                <>
                  {imageFile?.fileName && (
                    <>
                      <TouchableOpacity
                        onPress={() => setModalVisible(!modalVisible)}
                        style={styles.imageFileName}
                      >
                        <Text style={styles.fileN}>
                          {imageFile && imageFile?.fileName}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setImageFile([])}>
                        <EnIcon
                          name="cross"
                          size={20}
                          style={styles.imageCancelIcon}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </>
              )}
            </View>
          </View>
        </View>

        <CustomButtonNew
          btnText={
            leaveDetails && leaveDetails?.isLeaveCreate !== true
              ? 'Update'
              : 'Apply'
          }
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnText}
          isLoading={isApplicationSubmit}
          disabled={isApplicationSubmit ? true : false}
        />
      </KeyboardAwareScrollView>

      {/* {userInfo?.strUrl === arlURL && ( */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={voiceChatVisible}
          onRequestClose={() => setVoiceChatVisible(false)}
        >
          <View style={styles.voiceChatOverlay}>
            <View style={styles.voiceChatContainer}>
              <View style={styles.voiceChatHeader}>
                <Text style={styles.voiceChatTitle}>
                  AI Assistant{isSpeaking ? ' • Speaking…' : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Tts.stop();
                    setVoiceChatVisible(false);
                  }}
                >
                  <EnIcon name="cross" size={24} color={COLORS.textNewBold} />
                </TouchableOpacity>
              </View>
              <ScrollView
                ref={chatScrollRef}
                style={styles.chatHistoryScroll}
                contentContainerStyle={styles.chatHistoryContent}
                onContentSizeChange={() =>
                  chatScrollRef.current?.scrollToEnd({ animated: true })
                }
              >
                {chatHistory.length === 0 && !isVoiceApiLoading && (
                  <Text style={styles.emptyChatText}>
                    Press and hold the button below to speak
                  </Text>
                )}
                {chatHistory?.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.chatBubble,
                      msg?.role === 'user'
                        ? styles.userBubble
                        : styles.botBubble,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chatBubbleText,
                        msg?.role === 'user'
                          ? styles.userBubbleText
                          : styles.botBubbleText,
                      ]}
                    >
                      {msg?.content}
                    </Text>
                    {msg?.role === 'assistant' && (
                      <View style={styles.bubbleAudioBtn}>
                        <IIcon
                          name="volume-high"
                          size={16}
                          color={COLORS.primary}
                        />
                      </View>
                    )}
                  </View>
                ))}
                {isVoiceApiLoading && (
                  <View style={[styles.chatBubble, styles.botBubble]}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                )}
              </ScrollView>
              <View style={styles.voiceButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.voiceSpeakButton,
                    isRecording && styles.voiceSpeakButtonActive,
                    isVoiceApiLoading && styles.voiceSpeakButtonDisabled,
                  ]}
                  onPressIn={startVoiceRecording}
                  onPressOut={stopVoiceRecording}
                  disabled={isVoiceApiLoading}
                  activeOpacity={0.8}
                >
                  <IIcon
                    name={isRecording ? 'mic' : 'mic-outline'}
                    size={28}
                    color={COLORS.white}
                  />
                  <Text style={styles.voiceSpeakButtonText}>
                    {isRecording ? 'Recording...' : 'Press to Speak'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      {/* )} */}

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <EnIcon name="cross" size={20} style={styles.imageCancelIcon} />
            </TouchableOpacity>

            <FastImage
              source={{
                uri: getImageURL(
                  imageFile?.globalFileUrlId && imageFile?.globalFileUrlId,
                ),
              }}
              style={styles.images}
            />
          </View>
        </View>
      </Modal>
      <LeaveBalanceSheet
        refRBSheet={refRBSheet}
        employeeId={
          leaveDetails?.EmployeeId ||
          leaveDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId
        }
        // for common project
        workplaceGroupId={
          leaveDetails?.intWorkplaceGroupId ||
          leaveDetails?.empLeaveData?.intWorkplaceGroupId ||
          userInfo?.intWorkplaceGroupId
        }
        buId={userInfo?.intBusinessUnitId}
      />
    </ContainerNew>
  );
};

export default CreateEditLeaveApplication;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
  inputMain: {
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.borderBottom,
    elevation: 5,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },

  file: {},
  upldImg: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
  },
  uploadText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: COLORS.primary,
  },
  fileNamePart: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  imageCancelIcon: {
    paddingLeft: 10,
    textAlign: 'right',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },
  modalView: {
    height: 500,
    backgroundColor: COLORS.white,
    borderRadius: 3,
    paddingHorizontal: 35,
    paddingTop: 5,
    overflow: 'hidden',
  },
  images: {
    width: 350,
    height: 450,
    marginVertical: 16,
  },
  btn: {
    alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  icon: {
    paddingRight: 8,
  },
  paddingTop: {
    paddingTop: 16,
  },
  dateWidth: {
    width: '48%',
  },
  timeWidth: {
    width: '30%',
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },

  fileUploadBtn: {
    borderStyle: 'dashed',
    borderRadius: 10,
    height: 44,
    borderWidth: 1,
    borderColor: COLORS.offDay,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  fileUploadText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textNewBold,
    paddingTop: 15,
    paddingBottom: 2,
    lineHeight: 22,
  },
  iosUploadIcon: {
    color: COLORS.primary,
  },
  clickText: {
    color: COLORS.primary,
    fontWeight: '600',
    paddingLeft: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  clickOtherText: {
    color: COLORS.textNewColor,
    paddingLeft: 5,
    fontSize: 14,
    lineHeight: 20,
  },
  imageFileName: {
    width: '90%',
  },
  fileN: {
    color: COLORS.activeText,
    paddingTop: 5,
  },
  voiceHeaderIcon: {
    padding: 4,
    marginRight: 10,
  },
  voiceChatOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  voiceChatContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '75%',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  voiceChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  voiceChatTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textNewBold,
  },
  chatHistoryScroll: {
    flex: 1,
    marginBottom: 12,
  },
  chatHistoryContent: {
    flexGrow: 1,
  },
  emptyChatText: {
    textAlign: 'center',
    color: COLORS.textNewColor,
    fontSize: 14,
    marginTop: 40,
  },
  chatBubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginVertical: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F0F0',
    borderBottomLeftRadius: 2,
  },
  chatBubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userBubbleText: {
    color: COLORS.white,
  },
  botBubbleText: {
    color: COLORS.textNewBold,
  },
  voiceButtonContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  voiceSpeakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
    gap: 8,
  },
  voiceSpeakButtonActive: {
    backgroundColor: '#e53935',
  },
  voiceSpeakButtonDisabled: {
    backgroundColor: COLORS.borderBottom,
  },
  voiceSpeakButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  bubbleAudioBtn: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
