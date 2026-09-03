import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {ActivityIndicator, Platform, StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';

import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../../stores/rootStore';
import {useForm} from 'react-hook-form';
import {
  _todayDate,
  _todayDateTime} from '../../../../common/services/todayDate';
import Column from '../../../../common/components/Column';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {
  CreateNUpdateGrievance,
  GrievanceCategoryDDL,
  GrievanceMisconductDDL,
  GrievanceSegmentDDL,
  GrievanceSubCategoryDDL} from '../../../../common/api/api';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import Row from '../../../../common/components/Row';
import CustomTimePickerNew from '../../../../common/components/CustomTimePicker';
import CustomInputNew from '../../../../common/components/CustomInput';
import {uploadLeaveFiles} from '../../../../services/SaaS-modules/leave/leave';
import {useToast} from '../../../../common/components/CustomToast';
import {launchImageLibrary} from 'react-native-image-picker';
import {UploadedFile} from '../leave-application/CreateEditForCommon';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Text} from 'react-native';
import {COLORS} from '../../../../common/constant/Themes';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import dayjs from 'dayjs';
import {timeFormater} from '../../../../common/services/timeFormater';
import CommonImageViewer from '../../../../common/components/CommonImageViewer';
import {getImageURL} from '../../../../common/services/getImage';
import {getContactBook} from '../../../../services/SaaS-modules/contact/contact';

const edges: Edge[] = ['right', 'bottom', 'left'];

const GrievanceCreate = () => {
  const toast = useToast();
  const route: any = useRoute();
  const routeData: any = route?.params?.grievanceData;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [categoryDDL, setCategoryDDL] = useState('');
  const [subCategoryDDL, setSubCategoryDDL] = useState('');
  const [misConductDDL, setMisConductDDL] = useState('');
  const [segmentDDL, setSegmentDDL] = useState('');
  const [imageFile, setImageFile] = useState<UploadedFile>();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [empDDL, setEmpDDL] = useState([]);
  const {control, handleSubmit, setValue, reset} = useForm<any>({
    defaultValues: {
      fromDate: Platform.OS === 'ios' ? _todayDate() : '',
      toDate: Platform.OS === 'ios' ? _todayDate() : '',
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }

      if (routeData?.intGrievanceId) {
        reset({
          category: {
            value: routeData?.intCategoryId,
            label: routeData?.strCategory,
          },
          subCategory: {
            value: routeData?.intSubCategoryId,
            label: routeData?.strSubCategory,
          },
          misconduct: {
            value: routeData?.intMisconductId,
            label: routeData?.strMisconduct,
          },
          segment: {
            value: routeData?.intSegmentId,
            label: routeData?.strSegment,
          },
          employeeName: {
            value: routeData?.intEmployeeId,
            label: routeData?.strEmployee,
          },
          priority: {
            value: '1',
            label: routeData?.strPriority,
          },
          description: routeData?.strDescription,
          incidentDateTime: dayjs(routeData?.dteIncidentDate).format(
            'D MMMM, YYYY, h.mm A',
          ),
        });

        setImageFile({
          globalFileUrlId: routeData?.strAttachment,
          fileName: 'attachment',
        });
      } else {
        getCategoryDDL();
        getSubCategoryDDL();
        getMiConductDDL();
        getSegmentDDL();
      }
    },
    [isFocused],
  );

  const getCategoryDDL = async () => {
    const api_params = {
      url: GrievanceCategoryDDL,
    };
    const res = await httpRequest(api_params, () => {});
    setCategoryDDL(res);
  };
  const getSubCategoryDDL = async () => {
    const api_params = {
      url: GrievanceSubCategoryDDL,
    };
    const res = await httpRequest(api_params, () => {});
    setSubCategoryDDL(res);
  };

  const getMiConductDDL = async () => {
    const api_params = {
      url: GrievanceMisconductDDL,
    };
    const res = await httpRequest(api_params, () => {});
    setMisConductDDL(res);
  };
  const getSegmentDDL = async () => {
    const api_params = {
      url: GrievanceSegmentDDL,
    };
    const res = await httpRequest(api_params, () => {});
    setSegmentDDL(res);
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

  const getEmployeeData = async (searchTxt: string = '') => {
    const res = await getContactBook(
      userInfo?.intEmployeeId,
      0,
      0,
      0,
      0,
      '',
      '',
      '',
      searchTxt || '', //search
      setIsLoading,
    );

    const modifyData = res?.map((item: any) => {
      return {
        ...item,
        value: item?.EmployeeId,
        label: `${item?.EmployeeName} [${item?.EmployeeId}]`,
      };
    });
    setEmpDDL(modifyData);
  };

  const onSubmit = async (data: any) => {
    const payload = {
      intGrievanceId: 0,
      intBusinessUnitId: userInfo?.intBusinessUnitId,
      strBusinessUnitName: userInfo?.strBusinessUnit,
      intRoleId: 0,
      strRole: '',
      intGrievanceTypeId: 2,
      strGrievanceType: 'Non-Judicial',
      intEmployeeId: +data?.employeeName?.value || 0,
      strEmployee: data?.employeeName?.label || '',
      intCategoryId: +data?.category?.value,
      strCategory: data?.category?.label,
      intSubCategoryId: +data?.subCategory?.value,
      strSubCategory: data?.subCategory?.label,
      intMisconductId: +data?.misconduct?.value,
      strMisconduct: data?.misconduct?.label,
      intSegmentId: +data?.segment?.value,
      strSegment: data?.segment?.label,
      strPriority: data?.priority?.label,
      intStatusId: 0,
      strStatus: '',
      strDescription: data?.description || '',
      strAttachment: imageFile?.globalFileUrlId || '',
      intCreatedBy: userInfo?.intEmployeeId,
      dteIncidentDate: `${dayjs(data?.incidentDate).format('YYYY-MM-DD')}T${timeFormater(data?.incidentTime)}`,
    };

    const api_params = {
      url: CreateNUpdateGrievance,
      data: payload,
      method: 'post',
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
      setImageFile('');
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
      isFloatBottomButton={routeData?.intGrievanceId ? false : true}
      singleFloatBtmBtnStyle={{
        width: '90%',
      }}
      btnText="Save"
      singleFloatBtmBtnPress={handleSubmit(onSubmit)}
      header={
        <CustomHeader
          title="Grievance Create"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <Column colWidth={'100%'}>
        <CustomDropDownNew
          isDisable={routeData?.intGrievanceId ? true : false}
          label="Category"
          name="category"
          control={control}
          data={categoryDDL}
          rules={{required: true}}
          setValue={setValue}
          isFullTextView
        />

        <CustomDropDownNew
          boxStyle={{
            marginTop: 10,
          }}
          isDisable={routeData?.intGrievanceId ? true : false}
          label="Sub Category"
          name="subCategory"
          control={control}
          isFullTextView
          data={subCategoryDDL}
          rules={{required: true}}
          setValue={setValue}
        />

        <CustomDropDownNew
          boxStyle={{
            marginTop: 10,
          }}
          isDisable={routeData?.intGrievanceId ? true : false}
          label="Misconduct"
          name="misconduct"
          control={control}
          data={misConductDDL}
          rules={{required: true}}
          isFullTextView
          setValue={setValue}
        />

        <CustomDropDownNew
          boxStyle={{
            marginTop: 10,
          }}
          isDisable={routeData?.intGrievanceId ? true : false}
          label="Segment"
          name="segment"
          control={control}
          isFullTextView
          data={segmentDDL}
          rules={{required: true}}
          setValue={setValue}
        />

        <CustomDropDownNew
          boxStyle={{
            marginTop: 10,
          }}
          isDisable={routeData?.intGrievanceId ? true : false}
          setSearchText={(txt: string) => {
            if (txt?.length > 3) {
              getEmployeeData(txt);
            } else {
              getEmployeeData('');
            }
          }}
          control={control}
          data={empDDL}
          name="employeeName"
          label="Employee"
          placholder="Choose"
          setValue={setValue}
        />

        <CustomDropDownNew
          boxStyle={{
            marginTop: 10,
          }}
          isDisable={routeData?.intGrievanceId ? true : false}
          label="Priority"
          name="priority"
          control={control}
          data={[
            {
              label: 'High',
              value: 1,
            },
            {
              label: 'Medium',
              value: 2,
            },
            {
              label: 'Low',
              value: 3,
            },
          ]}
          rules={{required: true}}
          setValue={setValue}
        />

        {!routeData?.intGrievanceId && (
          <Column
            colWidth="100%"
            colStyle={{
              marginTop: 10,
            }}>
            <CustomDatePickerNew
              name="incidentDate"
              label="Incident Date"
              control={control}
              rules={{required: Platform.OS === 'ios' ? false : true}}
              setValue={setValue}
            />
          </Column>
        )}

        {!routeData?.intGrievanceId && (
          <Column
            colWidth="100%"
            colStyle={{
              marginTop: 10,
            }}>
            <CustomTimePickerNew
              control={control}
              name="incidentTime"
              label="Incident Time"
              setValue={setValue}
              rules={{required: Platform.OS === 'ios' ? false : true}}
            />
          </Column>
        )}

        {routeData?.intGrievanceId && (
          <Column
            colWidth="100%"
            colStyle={{
              marginTop: 10,
            }}>
            <CustomInputNew
              disabled={routeData?.intGrievanceId ? true : false}
              setValue={setValue}
              control={control}
              name="incidentDateTime"
              label="Incident Date/Time"
              multiline
            />
          </Column>
        )}
        <Column
          colWidth="100%"
          colStyle={{
            marginTop: 10,
          }}>
          <CustomInputNew
            disabled={routeData?.intGrievanceId ? true : false}
            setValue={setValue}
            control={control}
            name="description"
            label="Description"
            placeholder="Enter Description"
            multiline
          />
        </Column>

        <View>
          {Platform.OS === 'android' && !routeData?.intGrievanceId ? (
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

          {Platform.OS === 'ios' && !routeData?.intGrievanceId ? (
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
                {/* <Text style={styles.clickOtherText}>PNG, JPG or PDF</Text> */}
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={styles.fileNamePart}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#00ff00" />
            ) : (
              <>
                {imageFile?.fileName && (
                  <Row
                    rowWidth={'100%'}
                    rowStyle={{
                      paddingTop: 10,
                    }}>
                    <TouchableOpacity
                      onPress={() => setModalVisible(!modalVisible)}
                      style={styles.imageFileName}>
                      <Text style={styles.fileN}>
                        {imageFile && imageFile?.fileName}
                      </Text>
                    </TouchableOpacity>
                    {!routeData?.intGrievanceId && (
                      <TouchableOpacity onPress={() => setImageFile([])}>
                        <EnIcon
                          name="cross"
                          size={30}
                          style={styles.imageCancelIcon}
                        />
                      </TouchableOpacity>
                    )}
                  </Row>
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
    </ContainerNew>
  );
};

export default observer(GrievanceCreate);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    width: '85%',
  },
  imageCancelIcon: {
    textAlign: 'right',
  },
  fileNamePart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileN: {
    color: COLORS.activeText,
    fontSize: 20,
  },
});
