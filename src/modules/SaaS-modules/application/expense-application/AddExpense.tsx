import {
  useIsFocused,
  useNavigation,
  useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Modal,
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View} from 'react-native';
import { pick, types } from '@react-native-documents/picker';
import FastImage from 'react-native-fast-image';
import { launchCamera } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Edge } from 'react-native-safe-area-context';
import IIcon from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import { erpiBOSURL, erpPeopleDeskURL } from '../../../../../App';
import {
  GetAvailableBudgetAdvanceBalance,
  GetBugetHeadWiseBalance,
  GetCostCenterDDL,
  GetCostElementByCostCenterForExpense,
  GetProfitcenterDDLByCostCenterId,
  GetValidateExpenseAttachment,
  GRNFileUpload} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTextNew from '../../../../common/components/CustomText';
import { useToast } from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
import { COLORS, SIZES } from '../../../../common/constant/Themes';
import { httpRequest } from '../../../../common/constant/httpRequest';
import RBSheet from '../../../../common/packages/RBSheet/RBSheet';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { date_formater } from '../../../../common/services/dateFormater';
import { datetimeToDate } from '../../../../common/services/datetimeToDate';
import { getEprocurementImageURL } from '../../../../common/services/getImage';
import { useRootStore } from '../../../../stores/rootStore';


const edges: Edge[] = ['right', 'bottom', 'left'];

const AddExpense = () => {
  const refRBSheet = useRef();
  const propsdata = useRoute<any>();
  const expenseId = propsdata?.params?.expenseId;
  const expenseList = propsdata?.params?.expenseList;
  const setExpenseList = propsdata?.params?.setExpenseList;
  const expenseItem = propsdata?.params?.expenseItem;
  const expenseItemIndex = propsdata?.params?.expenseItemIndex;
  const minDate = propsdata?.params?.minDate;
  const maxDate = propsdata?.params?.maxDate;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo, sbu } = useRootStore();
  const toaster = useToast();
  const [fileData, setFileData] = useState<any>([]);
  const [modalShow, setModalShow] = useState(false);
  const [downloadAttachment, setDownloadAttachment] = useState('');
  const [costCenterDDL, setCostCenterDDL] = useState<any>([]);
  const [costElementDDL, setCostElementDDL] = useState<any>([]);
  const [profitCenterDDL, setProfitCenterDDL] = useState<any>([]);
  const [costCenterLabel, setCostCenterLabel] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isDateSimilar, setIsDateSimilar] = useState(false);
  const [render, setRender] = useState(false);
  const [budgetHeadDDL, setBudgetHeadDDL] = useState<any>([]);
  const [getAvailableBalance, setGetAvailableBalance] = useState<any>([]);

  const defaultValuesForUpdate = {
    costCenter: {
      label: expenseItem?.costCenterName,
      value: expenseItem?.costCenterId,
    },
    costElement: {
      label: expenseItem?.costElementName,
      value: expenseItem?.costElementId,
    },
    profitCenter: {
      label: expenseItem?.profitCenterName,
      value: expenseItem?.profitCenterId,
    },
    expenseDate: expenseItem?.expenseDate?.split('T')?.[0],
    description: expenseItem?.comments,
    amount:
      expenseItem?.amount?.toString() || expenseItem?.numAmount?.toString(),
  };

  const { control, handleSubmit, setValue, reset, getValues, watch } = useForm({
    defaultValues: {
      expenseDate: dayjs(minDate)?.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
    },
  });

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const minDateObject = minDate ? new Date(minDate) : null;
      const maxDateObject = maxDate ? new Date(maxDate) : null;

      // checking
      const datesAreSimilar =
        minDateObject &&
        maxDateObject &&
        minDateObject?.getTime() === maxDateObject?.getTime();

      if (datesAreSimilar) {
        setValue('expenseDate', minDateObject?.toISOString().split('T')?.[0]);
        setIsDateSimilar(true);
      }
    },
    [minDate, maxDate],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: GetCostCenterDDL,
        data: {
          AccountId: userInfo?.intAccountId,
          BusinessUnitId: sbu?.businessUnitId,
          SBUId: sbu?.sbuId,
        },
        baseURL: erpiBOSURL,
      };
      const res = await httpRequest(api_params, () => {});
      setCostCenterDDL(res);

      const api_params2 = {
        url: GetProfitcenterDDLByCostCenterId,
        data: {
          //@ts-ignore
          costCenterId: 0,
          businessUnitId: sbu?.businessUnitId,
          employeeId: userInfo?.intEmployeeId,
        },
        baseURL: erpiBOSURL,
      };
      const res2 = await httpRequest(api_params2, () => {});
      if (sbu?.businessUnitId === 184) {
        setProfitCenterDDL(res2);
      }
    },
    [isFocused],
  );

  useAsyncEffect(async isMounted => {
    if (!isMounted()) {
      return null;
    }
    if (expenseItem?.expenseDate) {
      if (expenseItem?.attachmentLink) {
        setFileData([{ id: expenseItem?.attachmentLink }]);
      }
      reset(defaultValuesForUpdate);
    }
  }, []);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      handleDDL();
    },
    [costCenterLabel],
  );

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      setRender(false);
    },
    [render],
  );

  const handleDDL = async () => {
    //@ts-ignore
    if (getValues('costCenter')?.value) {
      const api_params1 = {
        url: GetCostElementByCostCenterForExpense,
        data: {
          AccountId: userInfo?.intAccountId,
          UnitId: sbu?.businessUnitId,
          //@ts-ignore
          CostCenterId: getValues('costCenter')?.value,
        },
        baseURL: erpiBOSURL,
      };
      const res1 = await httpRequest(api_params1, () => {});
      setCostElementDDL(res1);

      const api_params2 = {
        url: GetProfitcenterDDLByCostCenterId,
        data: {
          costCenterId:
            //@ts-ignore
            sbu?.businessUnitId === 184 ? 0 : getValues('costCenter')?.value,
          businessUnitId: sbu?.businessUnitId,
          employeeId: userInfo?.intEmployeeId,
        },
        baseURL: erpiBOSURL,
      };
      const res2 = await httpRequest(api_params2, () => {});
      setProfitCenterDDL(res2);
    }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (searchText?.length > 2) {
        const api_params1 = {
          url: GetCostElementByCostCenterForExpense,
          data: {
            AccountId: userInfo?.intAccountId,
            UnitId: sbu?.businessUnitId,
            //@ts-ignore
            CostCenterId: getValues('costCenter')?.value,
            Search: searchText?.toString(),
          },
          baseURL: erpiBOSURL,
        };

        const res1 = await httpRequest(api_params1, () => {});
        setCostElementDDL(res1);
      }
    },
    [searchText],
  );

  const handleUploadProfileImage = (type: string) => {
    const options = {
      //@ts-ignore
      mediatype: 'photo',
      includeBase64: false,
      selectionLimit: 1,
      maxWidth: 1000,
      maxHeight: 1000,
      quality: 0.7,
    };
    if (type !== 'camera') {
      openGallary(options);
    } else {
      openCameraFunc(options);
    }
  };

  // file upload functionality
  const openGallary = async (_options: any) => {
    // launchImageLibrary(options, async res => {
    //   console.log('i have to make this', JSON.stringify(res, null, 2));
    //   uploadAttachment(res);
    // });

    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.allFiles, types.images],
      });
      // @ts-ignore
      refRBSheet?.current?.close();
      if (response) {
        const params = {
          url: GRNFileUpload,
          method: 'post',
          mediaFile: response?.[0],
        };
        const res = await httpRequest(params, () => {});
        if (res?.[0]?.id) {
          const isValidAttachment = await checkAttachment(res?.[0]?.id);
          const imgRes = {
            ...res?.[0],
            ocrText: isValidAttachment?.ocrText || '',
          };

          if (isValidAttachment?.isValid) {
            //@ts-ignore
            setFileData(prevState => [...prevState, imgRes]);
            toaster.show({
              message: 'File uploaded successfully.',
              type: 'success',
            });
          } else {
            toaster.show({
              message: 'This file already exists, Please choose another file!',
              type: 'warning',
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkAttachment = async (ImageId: any) => {
    const api_params = {
      url: GetValidateExpenseAttachment,
      data: {
        ImageId: ImageId,
        ActionBy: userInfo?.intErpUserId,
      },
      baseURL: erpPeopleDeskURL,
      isConsole: true,
      isConsoleParams: true,
    };
    const res = await httpRequest(api_params, () => {});
    return res;
  };

  const openCameraFunc = async (opt: any) => {
    await launchCamera(opt, async response => {
      // @ts-ignore
      refRBSheet?.current?.close();
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
              uploadAttachment(response);
            } catch (_error) {}
          }
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.log(err);
      }
    });
  };

  const uploadAttachment = async (res: any) => {
    // @ts-ignore
    refRBSheet?.current?.close();
    if (!res.didCancel && !res.errorMessage) {
      const params = {
        url: GRNFileUpload,
        method: 'post',
        mediaFile: res?.assets?.[0],
      };
      const response = await httpRequest(params, () => {});

      if (response?.[0]?.id) {
        const isValidAttachment = await checkAttachment(response?.[0]?.id);
        const imgRes = {
          ...response?.[0],
          ocrText: isValidAttachment?.ocrText || '',
        };

        if (isValidAttachment?.isValid) {
          //@ts-ignore
          setFileData(prevState => [...prevState, imgRes]);
          toaster.show({
            message: 'File uploaded successfully.',
            type: 'success',
          });
        } else {
          toaster.show({
            message: 'This file already exists, Please choose another file!',
            type: 'warning',
          });
        }
      }
    } else {
      console.log('user canceled');
    }
  };

  const addAndSaveBtnHandler = async (data: any) => {
    if (
      (+data?.amount >= 500 ||
        expenseItem?.numAmount ||
        expenseItem?.numRate) &&
      !fileData?.[0]?.id
    ) {
      toaster.show({
        message: 'Attachment must need.',
        type: 'warning',
      });
      return;
    }
    if (
      budgetHeadDDL?.length > 0 &&
      getAvailableBalance?.[0]?.numRemainAmount > 0 &&
      getAvailableBalance[0]?.numRemainAmount < +data?.expenseAmount
    ) {
      return toaster.show({
        message: 'Amount is greater than available balance.',
        type: 'warning',
      });
    }
    const dataExp = {
      rowId: expenseItem?.expenseRowId || 0,
      expenseId: expenseId || 0,
      costCenterId: data?.costCenter?.value,
      costCenterName: data?.costCenter?.label,
      profitCenterId: data?.profitCenter?.value,
      profitCenterName: data?.profitCenter?.label,
      costElementId: data?.costElement?.value,
      costElementName: data?.costElement?.label,
      dteExpenseDate: datetimeToDate(data?.expenseDate),
      expenseDate: datetimeToDate(data?.expenseDate),
      businessTransactionId: 0,
      businessTransactionName: '',
      numQuantity: 1,
      numRate: +data?.amount || expenseItem?.numRate,
      numAmount: +data?.amount || expenseItem?.numAmount,
      expenseLocation: '',
      comments: data?.description,
      attachmentLink: fileData?.[0]?.id,
      driverName: '',
      driverId: 0,
      subGlaccountHeadId: data?.budgetHead?.value || 0,
      strSubGlaccountHead: data?.budgetHead?.label || '',
      // rate: +data?.amount,
      // amount: +data?.amount,
    };

    if (expenseList && expenseList.length > 0) {
      const index = expenseList?.findIndex(
        (item: any) => item?.expenseRowId === expenseItem?.expenseRowId,
      );
      if (index !== -1) {
        expenseList[expenseItemIndex] = dataExp;
      } else {
        setExpenseList((prevState: any) => [...prevState, dataExp]);
      }
    } else {
      setExpenseList((prevState: any) => [...prevState, dataExp]);
    }
    setFileData([]);
    const defaultValuesForUpdateV2 = {
      costCenter: {
        label: '',
        value: '',
      },
      costElement: {
        label: '',
        value: '',
      },
      profitCenter: {
        label: '',
        value: '',
      },
      budgetHead: {
        label: '',
        value: '',
      },
      expenseDate: expenseItem?.expenseDate?.split('T')?.[0],
      description: '',
      amount: '',
    };
    reset(defaultValuesForUpdateV2);
  };

  const addBtnHandler = async (data: any) => {
    if (
      (+data?.amount >= 500 ||
        expenseItem?.numAmount ||
        expenseItem?.numRate) &&
      !fileData?.[0]?.id
    ) {
      toaster.show({
        message: 'Attachment must need.',
        type: 'warning',
      });
      return;
    }
    if (
      budgetHeadDDL?.length > 0 &&
      getAvailableBalance?.[0]?.numRemainAmount > 0 &&
      getAvailableBalance[0]?.numRemainAmount < +data?.expenseAmount
    ) {
      return toaster.show({
        message: 'Amount is greater than available balance.',
        type: 'warning',
      });
    }
    const dataExp = {
      rowId: expenseItem?.expenseRowId || 0,
      expenseId: expenseId || 0,
      costCenterId: data?.costCenter?.value,
      costCenterName: data?.costCenter?.label,
      profitCenterId: data?.profitCenter?.value,
      profitCenterName: data?.profitCenter?.label,
      costElementId: data?.costElement?.value,
      costElementName: data?.costElement?.label,
      dteExpenseDate: datetimeToDate(data?.expenseDate),
      expenseDate: datetimeToDate(data?.expenseDate),
      businessTransactionId: 0,
      businessTransactionName: '',
      numQuantity: 1,
      numRate: +data?.amount,
      numAmount: +data?.amount,
      expenseLocation: '',
      comments: data?.description,
      attachmentLink: fileData?.[0]?.id,
      attachmentText: fileData?.[0]?.ocrText || '',
      driverName: '',
      driverId: 0,
      subGlaccountHeadId: data?.budgetHead?.value || 0,
      strSubGlaccountHead: data?.budgetHead?.label || '',

      // rate: +data?.amount,
      // amount: +data?.amount,
    };

    if (expenseList && expenseList.length > 0) {
      const index = expenseList?.findIndex(
        (item: any) => item?.expenseRowId === expenseItem?.expenseRowId,
      );
      if (index !== -1) {
        expenseList[expenseItemIndex] = dataExp;
      } else {
        setExpenseList((prevState: any) => [...prevState, dataExp]);
      }
    } else {
      setExpenseList((prevState: any) => [...prevState, dataExp]);
    }
    setFileData([]);
    navigation.goBack();
  };
  const isPdf = (link: string) => {
    return link?.toLowerCase()?.endsWith('.pdf') || false;
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={expenseItemIndex + 1 ? true : false}
      isBottomDoubleButton={expenseItemIndex + 1 ? false : true}
      singleFloatBtmBtnStyle={styles.btmBtnStyle}
      btnText="Add"
      singleFloatBtmBtnPress={handleSubmit(addBtnHandler)}
      firstBtnTxt="Add & New"
      firstBtnStyle={styles.firstBtnStyle}
      firstBtnTxtStyle={styles.firstBtnTxtStyle}
      firstBtmBtnPress={handleSubmit(addAndSaveBtnHandler)}
      secondBtnTxt="Add"
      secondBtmBtnPress={handleSubmit(addBtnHandler)}
      header={
        <CustomHeader title="Add Expense" onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      <Row direction="column" rowStyle={styles.row}>
        <Column isCard colWidth="100%">
          <CustomTextNew
            text={`Your expense duration is ${date_formater(
              minDate,
            )} - ${date_formater(maxDate)}`}
            txtStyle={styles.expDueTxt}
          />

          <Column colWidth="100%" colStyle={styles.colMargin}>
            <CustomDatePickerNew
              name="expenseDate"
              label="Expense Date"
              control={control}
              isDisable={isDateSimilar}
              rules={{ required: true }}
              minimumDate={minDate}
              maximumDate={maxDate}
              onChange={(d: string) => {
                console.log(d);
                //@ts-ignore
                setValue('expenseDate', d);
              }}
            />
          </Column>

          <Column colWidth="100%" colStyle={styles.colMargin}>
            <CustomDropDownNew
              control={control}
              data={costCenterDDL}
              name="costCenter"
              label="Cost Center"
              placholder="Choose"
              onChange={(options: any) => {
                //@ts-ignore
                setValue('costCenter', options);
                setCostCenterLabel(options?.label);
              }}
              rules={{ required: true }}
            />
          </Column>

          <Column colWidth="100%" colStyle={[styles.colMargin]}>
            <CustomDropDownNew
              searchText={searchText}
              setSearchText={async (text: string) => {
                setSearchText(text);
              }}
              control={control}
              data={costElementDDL}
              name="costElement"
              label="Cost Element"
              placholder="Choose"
              onChange={async (options: any) => {
                //@ts-ignore
                setValue('costElement', options);
                const bugetHead_Params = {
                  url: GetBugetHeadWiseBalance,
                  data: {
                    businessUnitId: sbu?.businessUnitId,
                    generalLedgerId: options?.glId,
                    subGlId: options?.subGlId,
                    accountHeadId: 0,
                    dteJournalDate: dayjs().format('YYYY-MM-DD'),
                  },
                  baseURL: erpiBOSURL,
                  // isConsole: true,
                };
                const budgetHeadRes = await httpRequest(
                  bugetHead_Params,
                  () => {},
                );
                const modData = budgetHeadRes?.map((item: any) => {
                  return {
                    ...item,
                    label: item?.strAccountHeadName,
                    value: item?.intAccountHeadId,
                  };
                });
                setBudgetHeadDDL(modData);
              }}
              rules={{ required: true }}
            />
          </Column>

          {budgetHeadDDL?.length > 0 && (
            <Column colWidth="100%" colStyle={[styles.colMargin]}>
              <CustomDropDownNew
                control={control}
                data={budgetHeadDDL}
                name="budgetHead"
                label="Account Head"
                placholder="Choose"
                onChange={async (options: any) => {
                  //@ts-ignore
                  setValue('budgetHead', options);

                  const avaiBal_Params = {
                    url: GetAvailableBudgetAdvanceBalance,
                    data: {
                      businessUnitId: sbu?.businessUnitId,
                      subGlId: watch('costElement')?.subGlId,
                      accountHeadId: options?.value,
                      dteJournalDate: dayjs().format('YYYY-MM-DD'),
                    },
                    baseURL: erpiBOSURL,
                    isConsole: true,
                  };
                  const avaiBalRes = await httpRequest(
                    avaiBal_Params,
                    () => {},
                  );
                  setGetAvailableBalance(avaiBalRes);
                }}
                rules={{ required: budgetHeadDDL?.length > 0 ? true : false }}
              />
            </Column>
          )}

          <Column colWidth="100%" colStyle={[styles.colMargin]}>
            <CustomDropDownNew
              control={control}
              data={profitCenterDDL}
              name="profitCenter"
              label="Profit Center"
              placholder="Choose"
              onChange={(options: any) => {
                //@ts-ignore
                setValue('profitCenter', options);
              }}
              rules={{ required: true }}
            />
          </Column>

          <Column colWidth="100%" colStyle={[styles.colMargin]}>
            <CustomInputNew
              multiline
              setValue={setValue}
              control={control}
              name="description"
              label="Description"
              rules={{ required: true }}
            />
          </Column>

          <Column colWidth="100%" colStyle={[styles.colMargin]}>
            <CustomInputNew
              multiline
              onChange={(e: any) => {
                if (e <= 0) {
                  setValue('amount', '');
                } else {
                  setValue('amount', e);
                  setRender(true);
                }
              }}
              keyboardType="numeric"
              control={control}
              name="amount"
              label="Amount"
              rules={{ required: true }}
            />
          </Column>

          {+getValues('amount') >= 500 ? (
            <CustomTextNew
              text={'Attachment is needed for amount 500 or greater.'}
              txtColor={COLORS.red}
            />
          ) : null}
        </Column>
      </Row>

      {/* file upload  */}
      <Row rowStyle={styles.padding}>
        <Row direction="column" isCard>
          <Row style={styles.attachmentContainer}>
            <Column>
              <CustomTextNew
                text={'Upload Attachment'}
                txtSize={18}
                txtWeight={'500'}
                lineHight={20}
              />
              {/* <CustomTextNew
                text={'Add files up to 5MB'}
                txtSize={14}
                txtColor={COLORS.graySubText}
                lineHight={20}
              /> */}
            </Column>
            {fileData?.length === 0 && (
              <Column>
                <TouchableOpacity
                  style={styles.attachmentBtn}
                  onPress={() =>
                    // @ts-ignore
                    refRBSheet?.current?.open()
                  }
                >
                  <CustomTextNew
                    text={'+  Add'}
                    txtSize={15}
                    lineHight={20}
                    txtColor={COLORS.primary}
                    txtWeight={'500'}
                  />
                </TouchableOpacity>
              </Column>
            )}
          </Row>

          {fileData?.length > 0 &&
            fileData?.map((item: any, index: number) => (
              <Column
                isPressOn={false}
                onCardPress={() => {
                  if (isPdf(item?.id)) {
                    navigation.navigate('PDFViewer', {
                      fileId: item?.id,
                      fileName: item?.id,
                      isExpenseApproval: true,
                    });
                  } else {
                    //@ts-ignore
                    setModalShow(true);
                    setDownloadAttachment(item?.id);
                  }
                }}
                key={index}
                style={styles.attachmentCard}
              >
                <Column style={styles.iconContainer}>
                  <Column style={styles.gallaryIcon}>
                    <IIcon
                      name="image-outline"
                      size={20}
                      color={COLORS.white}
                    />
                  </Column>
                </Column>
                <Column style={styles.cardCenterContent}>
                  <CustomTextNew
                    text={item?.fileName || 'Document'}
                    lineHight={25}
                    txtColor={COLORS.black}
                    txtSize={17}
                  />
                  <CustomTextNew
                    text={'100% uploaded'}
                    lineHight={20}
                    txtColor={COLORS.graySubText}
                    txtSize={15}
                  />
                </Column>
                <View style={styles.closeIcon}>
                  <TouchableOpacity
                    onPress={() => {
                      setFileData((prevState: any[]) => {
                        return prevState.filter(
                          (ite: any) => ite?.id !== fileData?.[index]?.id,
                        );
                      });
                    }}
                  >
                    <MCIcon name="close" size={22} color={COLORS.darkGray} />
                  </TouchableOpacity>
                </View>
              </Column>
            ))}
        </Row>
      </Row>

      <Row justify="flex-end" rowStyle={styles.pv50} />
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
            <FastImage
              style={styles.modalImg}
              source={{
                uri: getEprocurementImageURL(downloadAttachment),
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

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
            <Text
              style={{
                color: COLORS.textNewColor,
              }}
            >
              Select Upload Option
            </Text>
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
    </ContainerNew>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  firstBtnStyle: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  firstBtnTxtStyle: {
    color: COLORS.primary,
  },
  row: {
    paddingHorizontal: 16,
  },
  colMargin: {
    marginRight: 16,
    paddingBottom: 10,
  },
  expDueTxt: {
    fontStyle: 'italic',
    color: COLORS.graySubText,
    lineHeight: 20,
    fontSize: 14,
    paddingBottom: 8,
  },
  timeLineRow: {
    marginTop: 11,
  },
  timeLineColMargin: {
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
  },
  cardSubTitle: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.graySubText,
    marginTop: 4,
  },
  btmBtnStyle: {
    width: '92%',
    elevation: 0,
  },

  padding: {
    paddingHorizontal: 16,
    paddingBottom: 2,
  },
  attachmentContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentBtn: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: 90,
    height: 35,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
  },
  attachmentCard: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 3,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray3,
    borderRadius: 4,
    backgroundColor: '#F2F4F7',
  },
  iconContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gallaryIcon: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCenterContent: {
    flex: 1,
    marginHorizontal: 8,
  },
  closeIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCon: {
    paddingHorizontal: 30,
    paddingVertical: 120,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImg: {
    borderRadius: 8,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
  },
  pv50: {
    paddingVertical: 50,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between' },
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
  pHorizontal: {
    paddingHorizontal: 16,
  },
  marginRight: {
    marginRight: 30,
  },
});
