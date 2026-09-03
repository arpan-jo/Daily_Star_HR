import {useIsFocused, useNavigation} from '@react-navigation/native';
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
  View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {launchImageLibrary} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Edge} from 'react-native-safe-area-context';
import EnIcon from 'react-native-vector-icons/Entypo';
import IIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  LoanCRUD,
  PeopleDeskAllDDL,
  UploadFile} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {getImageURL} from '../../../../common/services/getImage';
import {
  _todayDate,
  _todayDateTime} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import CustomTextNew from '../../../../common/components/CustomText';
import Row from '../../../../common/components/Row';
import Column from '../../../../common/components/Column';
import {observer} from 'mobx-react-lite';
const edges: Edge[] = ['right', 'bottom', 'left'];
interface props {
  route?: any;
}

const CreateEditLoanApplication = ({route}: props) => {
  const loanDetails = route?.params?.loanDetails;
  const navigation = useNavigation();
  const {userInfo, empListArray, removeFromEmp, clearEmpList} = useRootStore();
  const isFocused = useIsFocused();
  const date = dayjs();
  const toaster = useToast();
  const [isLoading, _setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<any>();
  const [modalVisible, setModalVisible] = useState(false);
  const [loanTypeDDL, setLoanTypeDDL] = useState();
  const [loanAmounts, setLoanAmounts] = useState(0);
  const [loanInstallment, setLoanInstallment] = useState(0);
  const [isT, setIsT] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      // DDLType=LoanType&AccountId=1&BusinessUnitId=184&intId=0
      const mainApiParams = {
        DDLType: 'LoanType',
        AccountId: userInfo?.intAccountId,
        BusinessUnitId: userInfo?.intBusinessUnitId,
        intId: 0,
      };
      const commonApiParams = {
        ...mainApiParams,
        intWorkplaceId: userInfo?.intWorkplaceId,
        WorkplaceGroupId: userInfo?.intWorkplaceGroupId,
      };

      const api_params = {
        url: PeopleDeskAllDDL,
        data: userInfo?.strUrl === commonURL ? commonApiParams : mainApiParams,
      };
      const res = await httpRequest(api_params, () => {});

      const modifiedData = res?.map(
        (item: {LoanTypeId: number; LoanType: string}) => {
          return {
            value: item?.LoanTypeId,
            label: item?.LoanType,
          };
        },
      );
      setLoanTypeDDL(modifiedData);
    },
    [userInfo, isFocused],
  );

  const updateDefaultValues = {
    loanType: {
      value: loanDetails?.loanTypeId,
      label: loanDetails?.loanType,
    },
    effectiveDate: loanDetails?.effectiveDate?.split('T')?.[0],
    loanAmount: loanDetails?.loanAmount?.toString(),
    installment: loanDetails?.numberOfInstallment?.toString(),
    amountPerInst: loanDetails?.numberOfInstallmentAmount?.toString(),
    description: loanDetails?.description,
  };

  const {control, setValue, handleSubmit, reset, watch} = useForm({
    defaultValues: {
      effectiveDate: Platform.OS === 'ios' ? _todayDate() : '',
      installment: '',
      amountPerInst: '',
      loanAmount: '',
    },
  });

  const onSubmit = async (data: any) => {
    if (
      +data?.loanAmount < 0 ||
      +data?.installment < 0 ||
      +data?.amountPerInst < 0
    ) {
      toaster.show({
        message: 'Amount should be positive number.',
        type: 'error',
      });
      return;
    }
    if (empListArray?.length < 2 && userInfo?.strUrl === commonURL) {
      toaster.show({
        message: 'There should be at least 2 Guarantor Employee needed',
        type: 'error',
      });
      return;
    }

    const employeeIds = empListArray
      .map((employee: any) => `"${employee?.EmployeeId}"`)
      .join(',');

    const commonPayload = {
      partType: loanDetails?.loanApplicationId ? 'LoanUpdate' : 'LoanCreate',
      intAccountId: userInfo?.intAccountId,
      loanApplicationId: loanDetails?.loanApplicationId || 0,
      employeeId:
        loanDetails?.intEmployeeId ||
        loanDetails?.employeeId ||
        userInfo?.intEmployeeId,
      loanTypeId: data?.loanType?.value,
      loanAmount: +data?.loanAmount,
      numberOfInstallment: +data?.installment,
      createdBy:
        loanDetails?.intEmployeeId ||
        loanDetails?.employeeId ||
        userInfo?.intEmployeeId,

      description: data?.description,

      fileUrl: imageFile?.globalFileUrlId ? imageFile?.globalFileUrlId : 0,
      applicationDate: date,
      approveBy: '',
      approveLoanAmount: 0,
      approveNumberOfInstallment: 0,
      effectiveDate: data?.effectiveDate
        ? data?.effectiveDate
        : Platform.OS === 'ios'
          ? _todayDateTime()
          : '',
      rejectBy: '',
      referenceNo: '',
      isActive: true,
      insertByUserId:
        loanDetails?.intEmployeeId ||
        loanDetails?.employeeId ||
        userInfo?.intEmployeeId,
      insertDateTime: date,
      updateByUserId: userInfo?.intEmployeeId,
      isApprove: false,
      isReject: false,
      remainingBalance: 0,
    };

    const mainPayload = {
      ...commonPayload,
      numberOfInstallmentAmount: +data?.amountPerInst,
    };

    const commonAppPayload = {
      ...commonPayload,
      numberOfInstallmentAmount: +data?.amountPerInst,
      intInterest: data?.interest || 0,
      intGurrantorId: employeeIds?.length > 0 ? employeeIds : '',
      dteLoanClosingDate: data?.effectiveDate
        ? data?.effectiveDate
        : Platform.OS === 'ios'
          ? _todayDateTime()
          : '',
      intApproveLoanAmount: data?.loanAmount,
      intApproveNumberOfInstallment: data?.installment || 0,
      intApproveNumberOfInstallmentAmount:
        +watch('loanAmount') / +watch('installment'),
      businessUnitId: userInfo?.intBusinessUnitId,
      workPlaceGrop: userInfo?.intWorkplaceGroupId,
      rowList: [],
    };

    const api_params = {
      url: LoanCRUD,
      data: userInfo?.strUrl === commonURL ? commonAppPayload : mainPayload,
      method: 'post',
    };

    const res = await httpRequest(api_params, setBtnLoading);

    if (res?.statusCode === 200) {
      clearEmpList();
      // reset();
      toaster.show({message: res?.message, type: 'success'});

      if (
        loanDetails?.loanApplicationId &&
        loanDetails?.loanApplicationId !== undefined
      ) {
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
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (loanDetails?.loanApplicationId) {
        reset(updateDefaultValues);
      }
    },
    [loanDetails?.loanApplicationId],
  );

  const openGallary = () => {
    launchImageLibrary(
      {
        //@ts-ignore
        mediatype: 'photo',
        includeBase64: true,
        selectionLimit: 1,
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
    if (!res.didCancel && !res.errorMessage) {
      const params = {
        url: UploadFile,
        data: {
          accountId: userInfo?.intAccountId,
          tableReferrence: 'LoanType',
          documentTypeId: 14,
          businessUnitId: userInfo?.intBusinessUnitId,
          createdBy: userInfo?.intEmployeeId,
        },
        isParamsAndmediaFile: true,
        method: 'post',
        mediaFile: res?.assets?.[0],
      };
      const response = await httpRequest(params, () => {});
      if (response) {
        //@ts-ignore
        setImageFile(response?.[0]);
        toaster.show({
          message: 'Document uploaded successfully. ',
          type: 'success',
        });
      }
    } else {
      console.log('user canceled');
    }
  };

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={true}
      header={
        <CustomHeader
          onBackPress={() => {
            navigation.goBack();
            clearEmpList();
          }}
          title="Create Loan Request"
        />
      }
      style={styles.container}>
      <KeyboardAwareScrollView
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll>
        <View style={Platform.OS === 'ios' ? {} : styles.inputMain}>
          <View>
            <CustomDropDownNew
              data={loanTypeDDL}
              label="Loan Type"
              name="loanType"
              control={control}
              setValue={setValue}
              rules={{required: true}}
            />
          </View>
          <View style={styles.multiInput}>
            <View style={styles.singleInput}>
              <CustomInputNew
                control={control}
                name="loanAmount"
                onChange={async (e: string) => {
                  if (e) {
                    setValue('loanAmount', e);
                    setLoanAmounts(Number(e));
                    if (loanDetails?.numberOfInstallment && isT) {
                      const loan =
                        loanInstallment || loanDetails?.numberOfInstallment;
                      setValue(
                        'amountPerInst',
                        (Number(e) / loan).toFixed(2).toString(),
                      );
                    } else {
                      setValue('amountPerInst', '');
                    }
                  } else {
                    setIsT(false);
                    setValue('loanAmount', '');
                    setValue('installment', '');
                    setValue('amountPerInst', '');
                  }
                }}
                multiline
                label="Loan Amount"
                placeholder="Enter Amount"
                rules={{required: true}}
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.singleInput}>
              <CustomInputNew
                control={control}
                name="installment"
                multiline
                label="Installment No."
                onChange={(e: string) => {
                  if (e) {
                    setLoanInstallment(Number(e));
                    setValue('installment', e.toString());
                  } else {
                    setValue('installment', '');
                  }
                  const num = Number(e);
                  if (
                    num > 0 &&
                    (loanAmounts || loanDetails?.loanAmount) > num
                  ) {
                    setValue(
                      'amountPerInst',
                      (
                        Number(loanAmounts || loanDetails?.loanAmount) / num ||
                        loanDetails?.numberOfInstallment
                      )
                        .toFixed(2)
                        .toString(),
                    );
                  } else {
                    setValue('amountPerInst', '');
                  }
                }}
                placeholder="Enter installment"
                rules={{required: true}}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/*=========== interest for common app==========  */}
          {userInfo?.strUrl === commonURL ? (
            <>
              <View style={styles.multiInput}>
                <CustomInputNew
                  control={control}
                  name="interest"
                  label="Interest (%)"
                  placeholder="Enter amount"
                  rules={{
                    required: false,
                  }}
                  keyboardType="number-pad"
                  onChange={(e: any) => {
                    if (+e > 0) {
                      setValue('interest', e.toString());
                      const loanAmount = +watch('loanAmount');
                      const installment = +watch('installment');
                      const withInstallmentLoanAmount =
                        (loanAmount * +e) / 100 + loanAmount;
                      const amountPerInstallment =
                        withInstallmentLoanAmount / installment;
                      setValue(
                        'amountPerInst',
                        amountPerInstallment?.toString(),
                      );
                    } else {
                      setValue('interest', '');
                      const loanAmount = +watch('loanAmount');
                      const installment = +watch('installment');
                      let amount = loanAmount / installment;
                      setValue('amountPerInst', amount.toString());
                    }
                  }}
                />
              </View>
            </>
          ) : null}

          {/*=========== interest for common app==========  */}
          <View style={styles.multiInput}>
            <View style={styles.singleInput}>
              <CustomInputNew
                control={control}
                name="amountPerInst"
                multiline
                label="Amount Per Install"
                placeholder="Enter amount"
                rules={{required: true}}
                keyboardType="number-pad"
                setValue={setValue}
              />
            </View>
            <View style={styles.singleInput}>
              <CustomDatePickerNew
                name="effectiveDate"
                label="Effective Date"
                control={control}
                rules={{required: Platform.OS === 'ios' ? false : true}}
                setValue={setValue}
              />
            </View>
          </View>

          <View style={styles.description}>
            <CustomInputNew
              control={control}
              name="description"
              setValue={setValue}
              multiline
              placeholder="Enter description"
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
        </View>

        {userInfo?.strUrl === commonURL ? (
          <>
            <View style={styles.secondSection}>
              <View style={styles.leftContent}>
                <Text style={[styles.myLeaveTitle, {paddingBottom: 3}]}>
                  Guarantor Employee
                </Text>
              </View>
              <View style={styles.rightContent}>
                <TouchableOpacity
                  style={styles.addEmployeeBtn}
                  onPress={() =>
                    navigation.navigate('AttendeOfMeeting', {
                      isLoanAddEmployee: true,
                    })
                  }>
                  <Icon name="plus" size={23} color={COLORS.primary} />
                  <CustomTextNew
                    text={'Add Employee'}
                    txtColor={COLORS.primary}
                    txtSize={14}
                    txtWeight={'500'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Row direction="column" rowStyle={styles.addedItemContainer}>
              {empListArray?.length > 0 && (
                <>
                  {empListArray?.map((item: any, index: number) => (
                    <Column colWidth="100%" key={index}>
                      <Row rowStyle={styles.addedItem}>
                        <Column
                          colWidth="5.5%"
                          isPressOn={false}
                          onCardPress={() => removeFromEmp(item?.EmployeeId)}>
                          <MCIcon
                            name="close-circle-outline"
                            style={styles.itemCancelIcon}
                          />
                        </Column>
                        <Column
                          colWidth="90%"
                          colStyle={styles.addedItemTextContainer}
                          isPressOn={false}
                          onCardPress={() => {
                            console.log('click me');
                          }}>
                          <CustomTextNew
                            subTxt
                            text={
                              `${item?.EmployeeName} [${item?.EmployeeId}]` ||
                              'N/A'
                            }
                            lineHight={20}
                          />
                          <CustomTextNew
                            subTxt
                            numberOfLines={1}
                            text={` ${item?.DesignationName}`}
                            lineHight={20}
                          />
                        </Column>
                      </Row>
                    </Column>
                  ))}
                </>
              )}
            </Row>
          </>
        ) : null}

        {btnLoading ? (
          <></>
        ) : (
          <CustomButtonNew
            btnText={
              loanDetails?.loanApplicationId ? 'Update Request' : 'Send Request'
            }
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

export default observer(CreateEditLoanApplication);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
    backgroundColor: COLORS.white,
  },
  inputMain: {
    padding: 16,
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
    alignSelf: Platform.OS === 'android' ? 'center' : 'auto',
    borderRadius: Platform.OS === 'android' ? 100 : 10,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  icon: {paddingRight: 8},
  multiInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    width: '100%',
  },
  singleInput: {
    width: '48%',
  },
  description: {paddingTop: 16},
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
  secondSection: {flexDirection: 'row', marginTop: 20},
  leftContent: {width: '65%'},
  rightContent: {justifyContent: 'center', width: '35%'},
  addEmployeeBtn: {flexDirection: 'row', alignItems: 'center'},
  cardContainer: {
    backgroundColor: '#F2F4F7',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 5,
    position: 'relative',
    marginVertical: 5,
  },
  verticalLine: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    marginVertical: 5,
  },
  closeBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
    padding: 2,
  },
  myLeaveTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500',
    color: COLORS.textNewColor,
    paddingBottom: 16,
  },
  editableIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  addedItemContainer: {
    marginVertical: 10,
  },
  addedItem: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.iconGrayBackground,
  },

  itemCancelIcon: {
    fontSize: 18,
    color: COLORS.absent,
    marginTop: 4,
  },
  addedItemTextContainer: {
    marginLeft: 8,
  },
});
