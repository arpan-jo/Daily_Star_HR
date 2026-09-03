import { useIsFocused, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { CreateTicket, GetIssueTypes } from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomImageViewer from '../../../../common/components/CustomImageViewer';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTextNew from '../../../../common/components/CustomText';
import { useToast } from '../../../../common/components/CustomToast';
import Row from '../../../../common/components/Row';
import { httpRequest } from '../../../../common/constant/httpRequest';
import { COLORS } from '../../../../common/constant/Themes';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { uploadFileMultipart } from '../../../../common/services/uploadDocument';
import { IssuePayloadTS } from '../../../../interfaces/issue/issue';
import { useRootStore } from '../../../../stores/rootStore';
import { pick, types } from '@react-native-documents/picker';
const edges: Edge[] = ['right', 'bottom', 'left'];

const IssueCreate = () => {
  const [ticketType, setTicketType] = useState<any>([]);
  const [fileData, setFileData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const { control, handleSubmit, setValue, reset } = useForm<IssuePayloadTS>();
  const [modalShow, setModalShow] = useState(false);
  const [downloadAttachment, setDownloadAttachment] = useState('');
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: GetIssueTypes,
      };
      const res = await httpRequest(api_params, () => {});

      const updateResponse = res?.map((item: any) => {
        return {
          value: item?.issueTypeId,
          label: item?.issueTypeName,
          ...item,
        };
      });
      setTicketType(updateResponse);
    },
    [isFocused],
  );
  const openGallary = useCallback(async () => {
    try {
      const response = await pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
      });
      uploadAttachment(response);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const uploadAttachment = async (res: any) => {
    if (!res.didCancel && !res.errorMessage && res.length > 0) {
      const file = res[0]; // get the first selected file

      const data = await uploadFileMultipart(
        userInfo?.intAccountId,
        userInfo?.intEmployeeId,
        userInfo?.intBusinessUnitId,
        {
          uri: file.uri,
          fileName: file.name, // file.fileName for some platforms
          type: file.type,
        },
        setIsLoading,
      );

      if (data?.globalFileUrlId) {
        setFileData(prevState => [...prevState, data]);
        toast.show({
          message: 'Document uploaded successfully.',
          type: 'success',
        });
      }
    } else {
      console.log('User canceled or error occurred.');
    }
  };

  const onSubmit = async (data: IssuePayloadTS) => {
    if (fileData?.length === 0) {
      toast.show({
        message: 'At least One attachment required',
        type: 'warning',
      });
      return;
    }
    const formateImage = fileData?.map(item => item?.globalFileUrlId);
    const payload = {
      issueTypeId: +data?.issueType?.value,
      businessUnitId: userInfo?.intBusinessUnitId,
      departmentId: userInfo?.intDepartmentId?.toString(),
      contactNo: data?.contact,
      issueDetails: data?.details,
      remarks: data?.remarks,
      ticketRequestFor: userInfo?.intEmployeeId,
      ticketCreateBy: userInfo?.intEmployeeId,
      attachmentIds: formateImage,
    };
    const params = {
      url: CreateTicket,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(params, setIsLoading);
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode === 200
    ) {
      toast.show({
        message: res?.message || res?.Message || 'Created successfully',
        type: 'success',
      });
      reset();
      navigation.goBack();
    } else {
      toast.show({
        type: 'warning',
        message: res.message || res.Message || 'Something Went Wrong!',
      });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={isLoading ? false : true}
      singleFloatBtmBtnPress={handleSubmit(onSubmit)}
      btnText="Save"
      header={
        <CustomHeader title="Issue Create" onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      <Column style={styles.appContainer}>
        <Column isCard>
          <Row justify="space-between">
            <Column colWidth={'48%'} colStyle={styles.rowMargin}>
              <CustomDatePickerNew
                name="date"
                label="Date"
                control={control}
                rules={{ required: true }}
                onChange={(d: string) => {
                  setValue('date', d);
                }}
              />
            </Column>
            <Column colWidth={'48%'} colStyle={styles.rowMargin}>
              <CustomDropDownNew
                control={control}
                data={ticketType}
                name="issueType"
                label="Issue Type"
                placholder="Choose"
                onChange={async (options: any) => {
                  setValue('issueType', options);
                }}
                rules={{ required: true }}
              />
            </Column>
          </Row>

          <Row justify="flex-start">
            <Column colWidth={'100%'} colStyle={styles.rowMargin}>
              <CustomInputNew
                onChange={(e: string) => {
                  setValue('contact', e);
                }}
                control={control}
                name="contact"
                label="Contact"
                keyboardType="numeric"
                rules={{ required: true }}
              />
            </Column>
          </Row>

          <Row justify="flex-start">
            <Column colWidth={'100%'} colStyle={styles.rowMargin}>
              <CustomInputNew
                onChange={(e: string) => {
                  setValue('details', e);
                }}
                multiline
                control={control}
                name="details"
                label="Details"
                rules={{ required: true }}
              />
            </Column>
          </Row>

          <Row justify="flex-start">
            <Column colWidth={'100%'} colStyle={styles.rowMargin}>
              <CustomInputNew
                onChange={(e: string) => {
                  setValue('remarks', e);
                }}
                multiline
                control={control}
                name="remarks"
                label="Remarks"
                rules={{ required: true }}
              />
            </Column>
          </Row>
        </Column>

        <Row>
          <Row direction="column" isCard>
            <Row style={styles.attachmentContainer}>
              <Column>
                <CustomTextNew
                  text={'Attachment'}
                  txtSize={18}
                  txtWeight={'500'}
                  lineHight={20}
                />
              </Column>
              <Column>
                <TouchableOpacity
                  style={styles.attachmentBtn}
                  onPress={() => openGallary()}
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
            </Row>

            {fileData?.length > 0 &&
              fileData?.map((item, index) => (
                <Column
                  isPressOn={false}
                  onCardPress={() => {
                    setModalShow(true);
                    //@ts-ignore
                    setDownloadAttachment(item?.globalFileUrlId);
                  }}
                  key={index}
                  style={styles.attachmentCard}
                >
                  <Column style={styles.iconContainer}>
                    <Column style={styles.gallaryIcon}>
                      <Ionicons
                        name="image-outline"
                        size={20}
                        color={COLORS.white}
                      />
                    </Column>
                  </Column>
                  <Column style={styles.cardCenterContent}>
                    <CustomTextNew
                      //@ts-ignore
                      text={item?.fileName}
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
                        setFileData(prevState => {
                          return prevState.filter(
                            //@ts-ignore
                            (item: any) => item?.id !== fileData?.[index]?.id,
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
      </Column>
      <CustomImageViewer
        isModalShow={modalShow}
        setIsModalShow={setModalShow}
        attachmentId={downloadAttachment}
        isProcurement={false}
      />
    </ContainerNew>
  );
};

export default observer(IssueCreate);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  appContainer: {
    paddingHorizontal: 16,
  },
  rowMargin: {
    marginBottom: 10,
  },
  btnStyle: {
    alignSelf: Platform.OS === 'ios' ? 'auto' : 'center',
    borderRadius: Platform.OS === 'ios' ? 10 : 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 20,
  },

  attachmentCard: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 3,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray3,
    borderRadius: 10,
    backgroundColor: COLORS.activeBackground,
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
  attachmentContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    width: 90,
    height: 35,
    justifyContent: 'center',
    borderRadius: 20,
    alignItems: 'center',
  },
});
