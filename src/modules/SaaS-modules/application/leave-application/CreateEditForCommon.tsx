import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useRef, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Edge} from 'react-native-safe-area-context';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CommonEmployeeDDL,
  Create,
  EmployeeLeaveTypeDDL,
  Update} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import CommonImageViewer from '../../../../common/components/CommonImageViewer';
import ContainerNew from '../../../../common/components/Container';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTimePickerNew from '../../../../common/components/CustomTimePicker';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {timeFormater} from '../../../../common/services/timeFormater';
import {
  _todayDate,
  _todayDateTime,
  dateFormater} from '../../../../common/services/todayDate';
import {
  LeaveApplicationFormTs} from '../../../../interfaces/leave/common-leave/common-leave';
import {uploadLeaveFiles} from '../../../../services/SaaS-modules/leave/leave';
import {useRootStore} from '../../../../stores/rootStore';
import LeaveBalanceSheetCommon from './LeaveBalanceSheetCommon';
import dayjs from 'dayjs';
const edges: Edge[] = ['right', 'bottom', 'left'];

export interface UploadedFile {
  globalFileUrlId: number;
  fileName: string;
}

const CreateEditForCommon = () => {
  const toast = useToast();
  const refRBSheet = useRef();
  const route = useRoute();
  //@ts-ignore
  const {leaveDetails} = route?.params;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const {control, handleSubmit, setValue, reset, watch, getValues: _getValues} =
    useForm<LeaveApplicationFormTs>({
      defaultValues: {
        fromDate: Platform.OS === 'ios' ? _todayDate() : '',
        toDate: Platform.OS === 'ios' ? _todayDate() : '',
      },
    });
  const [imageFile, setImageFile] = useState<UploadedFile>();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [leaveTypeDDL, setLeaveTypeDDL] = useState([]);
  const [leaveConsumeTypeDDL, setLeaveConsumeTypeDDL] = useState([]);
  const [leaveReliverDDL, setLeaveReliverDDL] = useState([]);
  const [minDate, setMinDate] = useState(
    Platform.OS === 'ios' ? _todayDateTime() : '',
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (leaveDetails?.leaveApplicationId) {
        reset({
          leaveType: {
            value: leaveDetails?.leaveId,
            label: leaveDetails?.leaveType,
          },
          leaveConsumeType: {
            value: leaveDetails?.leaveConsumeTypeId,
            label: leaveDetails?.leaveConsumeType,
          },
          fromDate: leaveDetails?.dteFromDate?.split('T')?.[0],
          toDate: leaveDetails?.dteToDate?.split('T')?.[0],
          leaveReliver: {
            value: leaveDetails?.leaveReliverId,
            label: leaveDetails?.leaveReliverName,
          },
          location: leaveDetails?.location,
          reason: leaveDetails?.reason,
          startTime: leaveDetails?.tmeFromTime,
          endTime: leaveDetails?.tmeToTime,
        });
        if (leaveDetails?.attachmentId) {
          setImageFile({
            fileName: 'Attachment',
            globalFileUrlId: leaveDetails?.attachmentId,
          });
        }
      }
    },
    [leaveDetails?.leaveApplicationId],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getEmpLeaveTypeData();
      getCommonEmpData('');
    },
    [isFocused],
  );

  const getEmpLeaveTypeData = async () => {
    const api_params = {
      url: EmployeeLeaveTypeDDL,
      data: {
        employeeId: leaveDetails?.EmployeeId || userInfo?.intEmployeeId,
        date: _todayDate(),
        isAdmin: userInfo?.isOfficeAdmin,
      },
    };
    const res = await httpRequest(api_params, setIsLoading);

    const modifyRes = res?.map((item: any) => {
      return {
        ...item,
        value: item?.id,
        label: item?.name,
      };
    });
    setLeaveTypeDDL(modifyRes);
  };

  const getCommonEmpData = async (searchText: string) => {
    const api_params = {
      url: CommonEmployeeDDL,
      data: {
        businessUnitId: userInfo?.intBusinessUnitId,
        workplaceGroupId: userInfo?.intWorkplaceGroupId,
        searchText: searchText || '',
      },
    };
    const res = await httpRequest(api_params, () => {});
    const modifyRes = res?.map((item: any) => {
      return {
        ...item,
        value: item?.employeeId,
        label: item?.employeeNameWithCode,
      };
    });
    setLeaveReliverDDL(modifyRes);
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
      toast.show({
        message: 'Document uploaded successfully.',
        type: 'success',
      });
    }
  };

  const onSubmit = async (data: LeaveApplicationFormTs) => {
    const iosTime =
      dayjs(_todayDateTime()).format('LT') &&
      dayjs(_todayDateTime()).format('LT');
    const payload = {
      intApplicationId: leaveDetails?.leaveApplicationId || 0,
      businessUnitId:
        leaveDetails?.BusinessUnitId || userInfo?.intBusinessUnitId,
      workplaceGroupId:
        leaveDetails?.AccountId || userInfo?.intWorkplaceGroupId,
      intLeaveTypeId: +data?.leaveType?.value,
      intEmployeeId: leaveDetails?.EmployeeId || userInfo?.intEmployeeId,
      intConsumeType: +data?.leaveConsumeType?.value || 0,
      dteFromDate: dateFormater(data?.fromDate),
      dteToDate: dateFormater(data?.toDate),
      tmeFromTime: timeFormater(data?.startTime ? data?.startTime : iosTime),
      tmeToTime: timeFormater(data?.endTime ? data?.endTime : iosTime),
      intDocumentId: imageFile?.globalFileUrlId || 0,
      strReason: data?.reason || '',
      strLocation: data?.location,
      isAdmin: userInfo?.isOfficeAdmin,
      intLeaveReliverId: +data?.leaveReliver?.value || 0,
    };
    const api_params = {
      url: leaveDetails?.leaveApplicationId ? Update : Create,
      data: payload,
      method: leaveDetails?.leaveApplicationId ? 'put' : 'post',
      // isConsole: true,
      // isConsoleParams: true,
      // isEncrypted: true,
    };

    const res = await httpRequest(api_params, setIsLoading);
    if (
      res?.statusCode === 200 ||
      res?.statusCode === 201 ||
      res?.StatusCode === 200 ||
      res?.StatusCode === 201 ||
      res?.statuscode === 200 ||
      res?.statuscode === 201
    ) {
      toast.show({
        message: res?.message || res?.Message || 'Create/Update successfully',
        type: 'success',
      });
      reset();
      navigation.goBack();
    } else {
      toast.show({
        type: 'warning',
        message: res?.message || res?.Message || 'Something Went Wrong!',
      });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={isLoading ? false : true}
      btnText={leaveDetails?.leaveApplicationId ? 'Edit' : 'Submit'}
      singleFloatBtmBtnPress={handleSubmit(onSubmit)}
      header={
        <CustomHeader
          infoIconPress={() =>
            //@ts-ignore
            refRBSheet?.current?.open()
          }
          title="Create Leave Application"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <Column style={styles.appContainer} colWidth={'100%'}>
        <Column isCard colWidth={'100%'}>
          <Row justify="space-between" rowStyle={styles.contentStyle}>
            <Column colWidth="48%">
              <CustomDropDownNew
                control={control}
                data={leaveTypeDDL}
                isImportant
                name="leaveType"
                label="Leave Type"
                placholder="Choose"
                onChange={(options: any) => {
                  setValue('leaveType', options);
                  setValue('leaveConsumeType', '');
                  if (options?.assingendConsumeTypeList?.length > 0) {
                    const modifyData = options?.assingendConsumeTypeList?.map(
                      (item: any) => {
                        return {
                          ...item,
                          value: item?.id,
                          label: item?.name,
                        };
                      },
                    );
                    setLeaveConsumeTypeDDL(modifyData);
                  }
                }}
                rules={{required: true}}
              />
            </Column>
            <Column colWidth="48%">
              <CustomDropDownNew
                control={control}
                data={leaveConsumeTypeDDL}
                isImportant
                name="leaveConsumeType"
                label="Leave Consume Type"
                placholder="Choose"
                onChange={(options: any) => {
                  setValue('leaveConsumeType', options);
                }}
                rules={{required: true}}
              />
            </Column>
          </Row>

          <Row justify="space-between" rowStyle={styles.contentStyle}>
            <Column colWidth="48%">
              <CustomDatePickerNew
                name="fromDate"
                isImportant
                label="From Date"
                control={control}
                rules={{required: Platform.OS === 'ios' ? false : true}}
                onChange={(d: string) => {
                  setValue('fromDate', d);
                  setMinDate(d);
                }}
              />
            </Column>
            <Column colWidth="48%">
              <CustomDatePickerNew
                name="toDate"
                isImportant
                label="To Date"
                control={control}
                //@ts-ignore
                minimumDate={minDate}
                rules={{required: Platform.OS === 'ios' ? false : true}}
                onChange={(d: string) => {
                  setValue('toDate', d);
                }}
              />
            </Column>
          </Row>
          {watch('leaveConsumeType')?.value !== 1 ? (
            <Row justify="space-between" rowStyle={styles.contentStyle}>
              <Column colWidth="48%">
                <CustomTimePickerNew
                  control={control}
                  name="startTime"
                  label="Start Time"
                  setValue={setValue}
                  rules={{required: watch('leaveConsumeType')?.value !== 1}}
                />
              </Column>
              <Column colWidth="48%">
                <CustomTimePickerNew
                  control={control}
                  name="endTime"
                  label="End Time"
                  setValue={setValue}
                  rules={{required: watch('leaveConsumeType')?.value !== 1}}
                />
              </Column>
            </Row>
          ) : null}

          <Row justify="space-between" rowStyle={styles.contentStyle}>
            <Column colWidth="48%">
              <CustomDropDownNew
                control={control}
                setSearchText={async (text: string) => {
                  if (text?.length > 3) {
                    await getCommonEmpData(text);
                  } else {
                    await getCommonEmpData('');
                  }
                }}
                data={leaveReliverDDL}
                name="leaveReliver"
                label="Leave Reliver"
                placholder="Choose"
                onChange={(options: any) => {
                  //@ts-ignore
                  setValue('leaveReliver', options);
                }}
                rules={{required: false}}
              />
            </Column>

            <Column colWidth="48%">
              <CustomInputNew
                setValue={setValue}
                control={control}
                isImportant
                name="location"
                label="Location"
                rules={{required: true}}
              />
            </Column>
          </Row>

          <Row justify="space-between" rowStyle={styles.contentStyle}>
            <Column colWidth="100%">
              <CustomInputNew
                setValue={setValue}
                control={control}
                isImportant
                name="reason"
                label="Reason"
                rules={{required: true}}
              />
            </Column>
          </Row>

          <View>
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
        </Column>

        <CommonImageViewer
          imageUrl={getImageURL(
            imageFile?.globalFileUrlId && imageFile?.globalFileUrlId,
          )}
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
        />

        <LeaveBalanceSheetCommon
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
      </Column>
    </ContainerNew>
  );
};

export default observer(CreateEditForCommon);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  appContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  contentStyle: {
    marginBottom: 10,
  },
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
  icon: {
    paddingRight: 8,
  },
  fileUploadText: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.textNewBold,
    paddingTop: 15,
    paddingBottom: 2,
    lineHeight: 22,
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
});
