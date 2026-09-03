import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Edge} from 'react-native-safe-area-context';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {_todayDate} from '../../../../common/services/todayDate';
import {
  createIOUApplication,
  uploadIOUFiles,
} from '../../../../services/SaaS-modules/iou/ios';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const CreateEditIOUApplication = ({route}: props) => {
  const iouDetails = route?.params?.iouDetails;

  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);

  const [minDate, setMinDate] = useState('');

  const updateDefaultValues = {
    fromDate: iouDetails?.dteFromDate?.split('T')?.[0],
    toDate: iouDetails?.dteToDate?.split('T')?.[0],
    amount: iouDetails?.numIOUAmount?.toString(),
    description: iouDetails?.strDiscription,
  };

  const {control, handleSubmit, setValue, reset} = useForm({
    defaultValues: {
      fromDate: Platform.OS === 'ios' ? _todayDate() : '',
      toDate: Platform.OS === 'ios' ? _todayDate() : '',
    },
  });

  const onSubmit = async (data: any) => {
    if (+data?.amount < 0) {
      toaster.show({
        message: 'Amount should be positive number.',
        type: 'error',
      });
      return;
    }
    const fromDate = dayjs(data?.fromDate && data?.fromDate);
    const toDate = dayjs(data?.toDate && data?.toDate);
    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({message: 'Invalid date duration', type: 'error'});
    } else {
      const payload = {
        dteFromDate: data?.fromDate,
        dteToDate: data?.toDate,
        intCreatedBy:
          iouDetails?.employeeId ||
          iouDetails?.intEmployeeId ||
          userInfo?.intEmployeeId,
        intEmployeeId:
          iouDetails?.employeeId ||
          iouDetails?.intEmployeeId ||
          userInfo?.intEmployeeId,
        intIOUAdjustmentId: 0,
        intIOUId: iouDetails?.intIOUId || iouDetails?.iouId || 0,
        intUpdatedBy: userInfo?.intEmployeeId,
        isActive: true,
        isAdjustment: false,
        numAdjustedAmount: 0,
        numIOUAmount: +data?.amount,
        numPayableAmount: 0,
        numReceivableAmount: 0,
        strDiscription: data?.description,
        strEntryType: iouDetails?.intIOUId ? 'EDIT' : 'ENTRY',
        urlIdViewModelList: imageFile?.globalFileUrlId
          ? [...imageFile?.globalFileUrlId]
          : [],
      };
      const res = await createIOUApplication(payload, setIsLoading);
      if (res?.statusCode === 200) {
        reset();
        toaster.show({message: res?.message, type: 'success'});
        if (iouDetails?.intIOUId && iouDetails?.intIOUId !== undefined) {
          //@ts-ignore
          navigation.pop(2);
        } else {
          navigation.goBack();
        }
      } else {
        toaster.show({
          message: res?.message || 'Something went wrong.',
          type: 'error',
        });
      }
      if (res?.statusCode === 500) {
        toaster.show({message: res?.message, type: 'error'});
      }
      if (res?.StatusCode === 500) {
        toaster.show({message: res?.Message, type: 'error'});
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
    const response = await uploadIOUFiles(
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

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (iouDetails?.intIOUId) {
        reset(updateDefaultValues);
      }
    },
    [iouDetails?.intIOUId],
  );
  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Create IOU Request"
        />
      }
      style={styles.container}>
      <KeyboardAwareScrollView
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll>
        <View style={Platform.OS === 'android' ? styles.inputMain : {}}>
          <View style={styles.box}>
            <View style={styles.width}>
              <CustomDatePickerNew
                name="fromDate"
                label="From Date"
                control={control}
                rules={{required: Platform.OS === 'ios' ? false : true}}
                onChange={(d: string) => {
                  setValue('fromDate', d);
                  setMinDate(d);
                }}
              />
            </View>
            <View style={styles.width}>
              <CustomDatePickerNew
                name="toDate"
                label="To Date"
                control={control}
                rules={{required: Platform.OS === 'ios' ? false : true}}
                setValue={setValue}
                minimumDate={minDate}
              />
            </View>
          </View>

          <View style={styles.padTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="amount"
              placeholder="Enter amount"
              multiline
              label="IOU Amount (BDT)"
              rules={{required: true}}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.padTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="description"
              placeholder="Description"
              multiline
              label="Description"
              rules={{required: true}}
            />
          </View>

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
                        style={styles.imageFileName}
                        onPress={() => setModalVisible(!modalVisible)}>
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
        {isLoading ? null : (
          <CustomButtonNew
            btnText={iouDetails?.intIOUId ? 'Update Request' : 'Send Request'}
            onBtnPress={handleSubmit(onSubmit)}
            btnstyle={styles.btn}
            btnTextStyle={styles.btnText}
          />
        )}
      </KeyboardAwareScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
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
    </ContainerNew>
  );
};

export default CreateEditIOUApplication;

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
    shadowOffset: {width: 0, height: 0},
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
  images: {width: 350, height: 450, marginVertical: 16},
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
  box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  width: {
    width: '48%',
  },
  padTop: {
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
});
