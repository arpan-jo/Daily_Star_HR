import {
  useIsFocused,
  useNavigation,
  useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Edge } from 'react-native-safe-area-context';
import {
  CRUDMovementApplication,
  PeopleDeskAllDDL} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTimePickerNew from '../../../../common/components/CustomTimePicker';
import { useToast } from '../../../../common/components/CustomToast';
import { COLORS } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {
  timeFormater} from '../../../../common/services/timeFormater';
import {
  _todayDate,
  _todayDateTime} from '../../../../common/services/todayDate';
import { ModifyLeaveTypeDDLType } from '../../../../interfaces/leave/leave';
import { useRootStore } from '../../../../stores/rootStore';
import { MovementDDLType } from '../../../../interfaces/movement/movement';
import CustomTextNew from '../../../../common/components/CustomText';
import { commonURL } from '../../../../../App';
import { datetimeToDate } from '../../../../common/services/datetimeToDate';
import { launchImageLibrary } from 'react-native-image-picker';
import { uploadLeaveFiles } from '../../../../services/SaaS-modules/leave/leave';
import { TouchableOpacity } from 'react-native';

import { Text } from 'react-native';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonImageViewer from '../../../../common/components/CommonImageViewer';
import { getImageURL } from '../../../../common/services/getImage';

const edges: Edge[] = ['right', 'bottom', 'left'];

export interface UploadedFile {
  globalFileUrlId: number;
  fileName: string;
}

const CreateEditMovementApplication = () => {
  const route = useRoute();
  //@ts-ignore
  const { movementDetails } = route?.params;
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const isFocused = useIsFocused();
  const [minDate, setMinDate] = useState('');
  const toaster = useToast();
  const [isApplicationSubmit, setIsApplicationSubmit] = useState(false);
  const [movementTypeDDL, setMovementTypeDDL] =
    useState<ModifyLeaveTypeDDLType[]>();
  const [movmenyType, setMovmenyType] = useState<MovementDDLType>();
  const [imageFile, setImageFile] = useState<UploadedFile>();
  const [modalVisible, setModalVisible] = useState(false);

  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      fromDate: Platform.OS === 'ios' ? _todayDate() : '',
      toDate: Platform.OS === 'ios' ? _todayDate() : '',
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }

      const commonParameters = {
        DDLType: 'MovementType',
        BusinessUnitId:
          movementDetails?.BusinessUnitId || userInfo?.intBusinessUnitId,
        intId: movementDetails?.EmployeeId || userInfo?.intEmployeeId,
      };

      const api_params = {
        url: PeopleDeskAllDDL,
        data:
          userInfo?.strUrl === commonURL
            ? {
                ...commonParameters,
                WorkplaceGroupId:
                  movementDetails?.AccountId || userInfo?.intWorkplaceGroupId,
              }
            : {
                ...commonParameters,
                AccountId: movementDetails?.AccountId || userInfo?.intAccountId,
              },
      };
      const res = await httpRequest(api_params, () => {});

      if (res) {
        const data = res?.map((item: MovementDDLType) => {
          return {
            ...item,
            value: item?.MovementTypeId,
            label: item?.MovementType,
          };
        });
        setMovementTypeDDL(data);
      }
    },
    [userInfo, isFocused],
  );

  const updateDefaultValues = {
    reportType: {
      value: movementDetails?.MovementTypeId,
      label: movementDetails?.MovementType,
    },
    fromDate: movementDetails?.FromDate?.split('T')?.[0],
    toDate: movementDetails?.ToDate?.split('T')?.[0],
    location: movementDetails?.Location,
    reason: movementDetails?.Reason,
    fromTime: movementDetails?.FromTimeAMPM,
    toTime: movementDetails?.ToTimeAMPM,
    contactPerson: movementDetails?.ContactPerson || '',
    contactNumber: movementDetails?.ContactNumber || '',
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (movementDetails?.MovementTypeId) {
        reset(updateDefaultValues);
        setMovmenyType(movementDetails?.MovementType?.trim());

        if (movementDetails?.DocumentId) {
          setImageFile({
            globalFileUrlId: movementDetails?.DocumentId,
            fileName: 'Attachment',
          });
        }
      }
    },
    [movementDetails?.MovementTypeId],
  );

  const onSubmit = async (data: any) => {
    const iosTime =
      dayjs(_todayDateTime()).format('LT') &&
      dayjs(_todayDateTime()).format('LT');
    const fromDate = dayjs(data?.fromDate || _todayDateTime());
    const toDate = dayjs(data?.toDate || _todayDateTime());
    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({ message: 'Invalid date duration', type: 'error' });
    } else {
      const payload = {
        // part id 1 = create, 2 = edit, 3 = delete
        partId: movementDetails?.MovementId ? 2 : 1,
        movementId: movementDetails?.MovementId || 0,
        movementTypeId:
          data?.reportType?.MovementTypeId || movementDetails?.MovementTypeId,
        intEmployeeId:
          movementDetails?.EmployeeId ||
          movementDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
        accountId:
          movementDetails?.AccountId ||
          movementDetails?.empLeaveData?.profileData?.empEmployeeBankDetail
            ?.intAccountId ||
          userInfo?.intAccountId,
        businessUnitId:
          movementDetails?.BusinessUnitId ||
          movementDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        fromDate:
          userInfo?.strUrl === commonURL
            ? datetimeToDate(data?.fromDate || _todayDateTime())
            : data?.fromDate || _todayDateTime(),
        toDate:
          userInfo?.strUrl === commonURL
            ? datetimeToDate(data?.toDate || _todayDateTime())
            : data?.toDate || _todayDateTime(),
        reason: data?.reason,
        location: data?.location,
        insertBy:
          movementDetails?.EmployeeId ||
          movementDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
        fromTime:
          // userInfo?.strUrl === commonURL
          //   ? timeFormaterWithoutSecond(
          //       data?.fromTime ? data?.fromTime : iosTime,
          //     )
          //   :
          timeFormater(data?.fromTime ? data?.fromTime : iosTime),
        toTime:
          // userInfo?.strUrl === commonURL
          //   ? timeFormaterWithoutSecond(data?.toTime ? data?.toTime : iosTime)
          //   :
          timeFormater(data?.toTime ? data?.toTime : iosTime),
        // for edit and create isActive = true
        isActive: true,
      };

      const commonPayload = {
        ...payload,
        workplaceGroupId: userInfo?.intWorkplaceGroupId,
        // new field added for commonURL
        contactPerson: data?.contactPerson || '',
        contactNumber: data?.contactNumber || '',
        documentId: imageFile?.globalFileUrlId || 0,
      };

      const api_params = {
        url: CRUDMovementApplication,
        data: userInfo?.strUrl === commonURL ? commonPayload : payload,
        method: 'post',
        isConsole: true,
        isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setIsApplicationSubmit);
      if (res?.statusCode === 200) {
        toaster.show({ message: res?.message, type: 'success' });
        if (movementDetails?.MovementId) {
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

  return (
    <ContainerNew
      edges={edges}
      // scrollEnabled={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Movement Application"
        />
      }
      style={styles.container}
    >
      <KeyboardAwareScrollView
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll
      >
        <View style={Platform.OS === 'android' ? styles.inputMain : null}>
          <View>
            <CustomDropDownNew
              label="Movement Type"
              name="reportType"
              control={control}
              data={movementTypeDDL}
              rules={{ required: true }}
              onChange={(item: any) => {
                //@ts-ignore
                setValue('reportType', item);
                setMovmenyType(item);
              }}
            />
          </View>

          {movmenyType?.MovementType?.trim() === 'Short Movement' && (
            <CustomTextNew
              txtColor={COLORS.warning}
              padTop={6}
              txtSize={12}
              text="Short Movement doesn't affect on daily attendance."
            />
          )}

          <View style={styles.dateContainer}>
            <View style={styles.halfWidth}>
              <CustomDatePickerNew
                name="fromDate"
                label="From Date"
                control={control}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
                onChange={(d: string) => {
                  setValue('fromDate', d);
                  setMinDate(d);
                }}
              />
            </View>
            <View style={styles.halfWidth}>
              <CustomDatePickerNew
                name="toDate"
                label="To Date"
                control={control}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
                setValue={setValue}
                minimumDate={minDate}
              />
            </View>
          </View>

          <View style={styles.dateContainer}>
            <View style={styles.halfWidth}>
              <CustomTimePickerNew
                control={control}
                name="fromTime"
                label="From Time"
                setValue={setValue}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
              />
            </View>
            <View style={styles.halfWidth}>
              <CustomTimePickerNew
                control={control}
                name="toTime"
                label="To Time"
                setValue={setValue}
                rules={{ required: Platform.OS === 'ios' ? false : true }}
              />
            </View>
          </View>

          <View style={styles.paddingTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="location"
              label="Location"
              placeholder="Enter Location"
              rules={{ required: true }}
              multiline
            />
          </View>
          <View style={styles.paddingTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="reason"
              label="Reason"
              placeholder="Reason for movement"
              rules={{ required: true }}
              multiline
            />
          </View>
          {userInfo?.strUrl === commonURL && (
            <View>
              <View style={styles.paddingTop}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="contactPerson"
                  label="Contact Person"
                  placeholder="Enter Contact Person"
                  rules={{ required: false }}
                  multiline
                />
              </View>
              <View style={styles.paddingTop}>
                <CustomInputNew
                  setValue={setValue}
                  control={control}
                  name="contactNumber"
                  label="Contact Number"
                  placeholder="Enter Contact Number"
                  rules={{ required: false }}
                  multiline
                />
              </View>
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
              </View>
            </View>
          )}
        </View>

        <CustomButtonNew
          btnText={
            movementDetails && movementDetails?.isMovementCreate !== true
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
      <CommonImageViewer
        imageUrl={getImageURL(
          imageFile?.globalFileUrlId && imageFile?.globalFileUrlId,
        )}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ContainerNew>
  );
};

export default CreateEditMovementApplication;

export const createEditStyle = StyleSheet.create({
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
  btn: {
    alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
  },
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },

  btnText: { fontSize: 14, fontWeight: '600', lineHeight: 20 },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
  },
  halfWidth: { width: '48%' },
  paddingTop: { paddingTop: 16 },
  upldImg: { flexDirection: 'row', alignItems: 'center', paddingTop: 15 },
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
  imageCancelIcon: { paddingLeft: 10, textAlign: 'right' },
  icon: { paddingRight: 8 },
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
  iosUploadIcon: { color: COLORS.primary },
  imageFileName: { width: '90%' },
  fileN: { color: COLORS.activeText, paddingTop: 5 },
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
  ...createEditStyle,
});
