/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import FAIcon from 'react-native-vector-icons/FontAwesome6';
import Icon from 'react-native-vector-icons/MaterialIcons';

import dayjs from 'dayjs';
import {arlURL, erpPeopleDeskURL} from '../../../../../App';
import {
  EditAdvanceExpense,
  GetAdvanceExpenseById} from '../../../../common/api/api';
import Column from '../../../../common/components/Column';
import ContainerNew from '../../../../common/components/Container';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomModalNew from '../../../../common/components/CustomModal';
import CustomTextNew from '../../../../common/components/CustomText';
import {useToast} from '../../../../common/components/CustomToast';
import LoadingContainer from '../../../../common/components/Loading';
import Row from '../../../../common/components/Row';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {_todayDate} from '../../../../common/services/todayDate';
import {AdvanceApproval} from '../../../../interfaces/expense/expense';
import {useRootStore} from '../../../../stores/rootStore';
import useAuditLogSave from '../../../../common/hooks/useAuditLogSave';

const edges: Edge[] = ['right', 'bottom', 'left'];

const AdvanceExpenseApprovalDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [approveLoading, setApproveLoading] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const params = useRoute();
  //@ts-ignore
  const advanceLanData = params?.params?.advanceLanData;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [expenseDetails, setExpenseDetails] = useState<AdvanceApproval>();
  const {userInfo, sbu} = useRootStore();
  const toaster = useToast();
  const {saveLogAction} = useAuditLogSave();
  // const [reload, setReload] = useState(false);

  const {control, setValue, reset: _reset, watch} = useForm();

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const api_params = {
        url: GetAdvanceExpenseById,
        data: {AdvanceId: advanceLanData?.advanceId},
        baseURL: erpPeopleDeskURL,
        //   isConsole: true,
      };
      const res = await httpRequest(api_params, setIsLoading);

      if (res?.[0]) {
        setExpenseDetails(res[0]); // Ensure this state update completes first
      }
    },
    [isFocused],
  );

  useEffect(() => {
    if (expenseDetails) {
      setValue('requestedAmount', expenseDetails?.requestedAmount?.toString());
      setValue('comments', expenseDetails?.comments);
      setValue('dueDate', _todayDate());
    }
  }, [expenseDetails, setValue]);

  const handleApprove = async () => {
    const payload = {
      advanceId: advanceLanData?.advanceId,
      advanceCode: expenseDetails?.advanceCode,
      accountId: 1,
      businessUnitId: sbu?.businessUnitId,
      businessUnitName: sbu?.businessUnitName,
      sbuid: expenseDetails?.sbuid,
      sbuname: expenseDetails?.sbuname,
      currencyId: advanceLanData?.currencyId,
      currencyName: advanceLanData?.currencyName,
      employeeId: expenseDetails?.employeeId,
      requestDate: advanceLanData?.requestDate
        ? dayjs(advanceLanData.requestDate).format('YYYY-MM-DD')
        : _todayDate(),
      dueDate: dayjs(watch('dueDate')).format('YYYY-MM-DD'),
      instrumentId: expenseDetails?.instrumentId,
      instrumentName: expenseDetails?.instrumentName,
      disbursementCenterId: expenseDetails?.disbursementCenterId,
      disbursementCenterName: expenseDetails?.disbursementCenterName,
      numRequestedAmount: +watch('requestedAmount'),
      comments: watch('comments'),
      actionBy: userInfo?.intErpUserId,
      willApproved: true,
      plantId: 0,
      expenseGroup: expenseDetails?.expenseGroup,
      costCenterid: expenseDetails?.costCenterid,
      costElementid: expenseDetails?.costElementid,
      profitCenterid: expenseDetails?.profitCenterid,
      costCenterName: expenseDetails?.costCenterName,
      costElementName: expenseDetails?.costElementName,
      profitCenterName: expenseDetails?.profitCenterName,
      businessTransactionName: expenseDetails?.businessTransactionName,
      subGlaccountHeadId: expenseDetails?.subGlaccountHeadId,
      strSubGlaccountHead: expenseDetails?.strSubGlaccountHead,
    };

    const api_params = {
      url: EditAdvanceExpense,
      data: payload,
      method: 'put',
      baseURL: erpPeopleDeskURL,
    };

    const res = await httpRequest(api_params, setApproveLoading);
    if (
      res?.statusCode === 200 ||
      res?.StatusCode === 200 ||
      res?.statuscode === 200 ||
      res.includes('Approved Successfully')
    ) {
      if (arlURL === userInfo?.strUrl) {
        saveLogAction({
          payload: {
            newEntity: payload,
            isPeopledesk: true,
            actionType: 'Approve',
          },
        });
      }
      toaster.show({
        message: 'Successfully Approved',
        type: 'success',
      });
      navigation.goBack();
    } else {
      toaster.show({
        message: 'Something Went Wrong!',
        type: 'warning',
      });
    }
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={approveLoading ? false : true}
      btnText="Approve"
      singleFloatBtmBtnStyle={styles.btmBtnStyle}
      singleFloatBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          title="Advance Approval Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <LoadingContainer isLoading={isLoading} />
      <Row direction="column">
        <Column colWidth="100%" colStyle={styles.mainDetails}>
          <Row direction="column" rowStyle={styles.rowWrapper}>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="person" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Employee Name "
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew text={expenseDetails?.employeeName || 'N/A'} />
                </Column>
              </Column>
            </Row>

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="123" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Advance Code "
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew text={expenseDetails?.advanceCode || 'N/A'} />
                </Column>
              </Column>
            </Row>

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="group" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Expense Group"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew text={expenseDetails?.expenseGroup || 'N/A'} />
                </Column>
              </Column>
            </Row>

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="short-text" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Cost Center"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew text={expenseDetails?.costCenterName || ''} />
                </Column>
              </Column>
            </Row>

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="short-text" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Cost Element"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew text={expenseDetails?.costElementName || ''} />
                </Column>
              </Column>
            </Row>

            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="business-center" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomTextNew
                      text="Profit Center"
                      txtColor={COLORS.textNewColor}
                      txtSize={12}
                    />
                  </Row>
                  <CustomTextNew
                    text={expenseDetails?.profitCenterName || ''}
                  />
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="date-range" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <CustomDatePickerNew
                    control={control}
                    setValue={setValue}
                    name="dueDate"
                    label={`Due Date  -  ${expenseDetails?.dueDate ? date_formater(expenseDetails?.dueDate) : ''}`}
                    minimumDate={_todayDate()}
                    rules={{required: true}}
                  />
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <FAIcon name="bangladeshi-taka-sign" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomInputNew
                      control={control}
                      name={'requestedAmount'}
                      keyboardType="numeric"
                      label="Advance Amount"
                      onChange={(e: any) => {
                        const inputValue = parseFloat(e);
                        const maxAmount = parseFloat(
                          expenseDetails?.requestedAmount,
                        );

                        if (!isNaN(inputValue)) {
                          if (inputValue <= maxAmount) {
                            setValue('requestedAmount', e);
                          } else {
                            setValue('requestedAmount', maxAmount.toString());
                            toaster.show({
                              message: `Applied Advance Amount Is ${maxAmount}`,
                              type: 'warning',
                            });
                          }
                        } else {
                          setValue('requestedAmount', '');
                        }
                      }}
                      rules={{required: true}}
                    />
                  </Row>
                </Column>
              </Column>
            </Row>
            <Row align="center" rowStyle={styles.rowElement}>
              <Column colWidth="10%">
                <Icon name="wysiwyg" style={styles.icon} />
              </Column>
              <Column colWidth="90%" colStyle={styles.topBottomTextContainer}>
                <Column colWidth="100%" colStyle={styles.topBoxItemText}>
                  <Row direction="row" justify="space-between" align="center">
                    <CustomInputNew
                      control={control}
                      name={'comments'}
                      label="Comments"
                      onChange={(e: any) => {
                        setValue('comments', e);
                      }}
                      multiline
                    />
                  </Row>
                </Column>
              </Column>
            </Row>
          </Row>
        </Column>
      </Row>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={handleApprove}
        modalText={'Are you sure, you want to Approve this?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default AdvanceExpenseApprovalDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    //  backgroundColor: COLORS.newGray,
  },
  mainDetails: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  rowWrapper: {
    marginTop: 16,
  },
  rowElement: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 24,
    color: COLORS.graySubText,
    padding: 6,
    backgroundColor: COLORS.newGray,
    borderRadius: 50,
    textAlign: 'center',
  },
  topBottomTextContainer: {
    paddingLeft: 12,
    paddingTop: 2,
  },
  topBoxItemText: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.newGray,
  },
  btmBtnStyle: {
    width: '92%',
    elevation: 0,
  },
});
