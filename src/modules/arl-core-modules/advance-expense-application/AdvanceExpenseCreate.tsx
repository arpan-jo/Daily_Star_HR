import {useIsFocused, useNavigation} from '@react-navigation/native';

import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import ContainerNew from '../../../common/components/Container';
import CustomHeader from '../../../common/components/CustomHeader';

import useAsyncEffect from '../../../common/packages/useAsyncEffect/useAsyncEffect';
import {useRootStore} from '../../../stores/rootStore';
import {useForm} from 'react-hook-form';
import Column from '../../../common/components/Column';
import Row from '../../../common/components/Row';
import CustomInputNew from '../../../common/components/CustomInput';
import CustomDatePickerNew from '../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../common/components/CustomDropDown';
import {useToast} from '../../../common/components/CustomToast';
import {
  CreateAdvanceExpense,
  GetCostCenterDDL,
  GetCostElementByCostCenterForExpense,
  GetInstrumentTypeDDL,
  GetProfitcenterDDLByCostCenterId} from '../../../common/api/api';
import { erpPeopleDeskURL} from '../../../../App';
import {httpRequest} from '../../../common/constant/httpRequest';
import {AdvanceExpenseFormDataTs} from '../../../interfaces/advance-expense/advance-expense';
import {_todayDate, dateFormater} from '../../../common/services/todayDate';
import useAuditLogSave from '../../../common/hooks/useAuditLogSave';
const edges: Edge[] = ['right', 'bottom', 'left'];

const AdvacneExpenseCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profitCenterDDL, setProfitCenterDDL] = useState<any>([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState<any>([]);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo, sbu} = useRootStore();
  const {control, handleSubmit, setValue, watch, reset} =
    useForm<AdvanceExpenseFormDataTs>();
  const toast = useToast();
  const {saveLogAction} = useAuditLogSave();
  const expenseGroupOptions: {value: number | string; label: string}[] = [
    {value: 'TaDa', label: 'Ta/Da'},
    {value: 'Other', label: 'Other'},
  ];
  const [instrumentDDL, setinstrumentDDL] = useState([]);
  const toster = useToast();
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      getCostCenterData();
      getinstrumentDDL();
    },
    [isFocused],
  );

  const getinstrumentDDL = async () => {
    const api_params = {
      url: GetInstrumentTypeDDL,
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(api_params, () => {});
    //only EFT and Cheque show
    const filterData = res?.filter(
      (data: any) => data?.value === 1 || data?.value === 2,
    );
    setinstrumentDDL(filterData);
  };
  const onSubmit = async (data: AdvanceExpenseFormDataTs) => {
    const payload = {
      accountId: userInfo?.intAccountId,
      businessUnitId: sbu?.businessUnitId,
      businessUnitName: sbu?.businessUnitName,
      sbuid: sbu?.sbuId,
      sbuname: sbu?.businessUnitName,
      currencyId: 141,
      currencyName: 'Taka',
      employeeId: userInfo?.intEmployeeId,
      requestDate: _todayDate(),
      dueDate: dateFormater(data?.dueDate),
      instrumentId: +data?.instrumentName?.value,
      instrumentName: data?.instrumentName?.label,
      disbursementCenterId: 0,
      disbursementCenterName: '',
      numRequestedAmount: +data?.reqAmount,
      comments: data?.comments || '',
      actionBy: userInfo?.intErpUserId,
      plantId: 0,
      expenseGroup: data?.expenseGroup?.value,
      costCenterid: +data?.costCenter?.value,
      costElementid: +data?.costElement?.value,
      profitCenterid: +data?.profitCenter?.value || 0,
      costCenterName: data?.costCenter?.label,
      costElementName: data?.costElement?.label,
      profitCenterName: data?.profitCenter?.label || '',
      businessTransactionName: '',
      subGlaccountHeadId: 0,
      strSubGlaccountHead: '',
    };

    const api_params = {
      url: CreateAdvanceExpense,
      data: payload,
      method: 'post',
      baseURL: erpPeopleDeskURL,
    };

    const response = await httpRequest(api_params, setIsLoading);
    if (
      response?.statusCode === 200 ||
      response?.StatusCode === 200 ||
      response?.statuscode === 200
    ) {
      saveLogAction({
        payload: {
          newEntity: payload,
          isPeopledesk: true,
          actionType: 'Create',
        },
      });
      toster.show({
        message:
          response?.Message ||
          response?.message ||
          'Expense successfully created.',
        type: 'success',
      });
      reset();
      navigation.goBack();
    } else {
      toster.show({
        message:
          response?.message || response?.Message || 'Something went wrong!',
        type: 'error',
      });
    }
  };
  const getCostCenterData = async () => {
    const api_params = {
      url: GetCostCenterDDL,
      data: {
        AccountId: userInfo?.intAccountId,
        BusinessUnitId: sbu?.businessUnitId,
        SBUId: sbu?.sbuId,
      },
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(api_params, () => {});
    setCostCenterDDL(res);
  };
  const getCostElementData = async (
    costCenterId: number,
    searchText: string,
  ) => {
    const api_params1 = {
      url: GetCostElementByCostCenterForExpense,
      data: {
        AccountId: userInfo?.intAccountId,
        UnitId: sbu?.businessUnitId,
        CostCenterId: costCenterId,
        Search: searchText || '',
      },
      baseURL: erpPeopleDeskURL,
    };
    const res = await httpRequest(api_params1, () => {});
    setCostElementDDL(res);
  };
  const getProfitCenterData = async (costCenterId: number) => {
    const api_params2 = {
      url: GetProfitcenterDDLByCostCenterId,
      data: {
        costCenterId: costCenterId,
        businessUnitId: sbu?.businessUnitId,
        employeeId: userInfo?.intEmployeeId,
      },
      baseURL: erpPeopleDeskURL,
    };
    const res2 = await httpRequest(api_params2, () => {});
    setProfitCenterDDL(res2);
  };

  return (
    <ContainerNew
      edges={edges}
      isFloatBottomButton={isLoading ? false : true}
      btnText="Submit"
      singleFloatBtmBtnPress={handleSubmit(onSubmit)}
      header={
        <CustomHeader
          title="Create Advance Expense"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <Column colWidth={'100%'} colStyle={styles.appContainer}>
        <Column>
          <Column isCard colWidth="100%">
            <Row justify="flex-start">
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomInputNew
                  onChange={(e: number) => {
                    const numValue = Number(e);
                    if (isNaN(numValue) || numValue < 0) {
                      toast.show({
                        message: 'Amount cannot be less than 0',
                        type: 'warning',
                      });
                      setValue('reqAmount', '');
                    } else {
                      setValue('reqAmount', e?.toString());
                    }
                  }}
                  control={control}
                  keyboardType="numeric"
                  name="reqAmount"
                  label="Requested Amount"
                  rules={{required: true}}
                />
              </Column>
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDatePickerNew
                  name="dueDate"
                  label="Due Date"
                  control={control}
                  rules={{required: true}}
                  onChange={(d: string) => {
                    setValue('dueDate', d);
                  }}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={costCenterDDL}
                  name="costCenter"
                  label="Cost Center"
                  placholder="Choose"
                  onChange={async (options: any) => {
                    setValue('costCenter', options);
                    //@ts-ignore
                    setValue('costElement', '');
                    //@ts-ignore
                    setValue('profitCenter', '');
                    await getCostElementData(options?.value, '');
                    await getProfitCenterData(options?.value);
                  }}
                  rules={{required: true}}
                />
              </Column>
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  setSearchText={async (text: string) => {
                    await getCostElementData(watch('costCenter')?.value, text);
                  }}
                  control={control}
                  data={costElementDDL}
                  name="costElement"
                  label="Cost Element"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('costElement', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={profitCenterDDL}
                  name="profitCenter"
                  label="Profit Center"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('profitCenter', options);
                  }}
                  rules={{required: false}}
                />
              </Column>
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={expenseGroupOptions}
                  name="expenseGroup"
                  label="Expense Group"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('expenseGroup', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
            </Row>

            <Row justify="flex-start">
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomDropDownNew
                  control={control}
                  data={instrumentDDL}
                  name="instrumentName"
                  label="Instrument"
                  placholder="Choose"
                  onChange={(options: any) => {
                    setValue('instrumentName', options);
                  }}
                  rules={{required: true}}
                />
              </Column>
              <Column colWidth="48%" colStyle={styles.colMargin}>
                <CustomInputNew
                  onChange={(e: number) => {
                    setValue('comments', e?.toString());
                  }}
                  control={control}
                  setValue={setValue}
                  name="comments"
                  label="Comments"
                  rules={{required: false}}
                  multiline
                />
              </Column>
            </Row>
          </Column>
        </Column>
      </Column>
    </ContainerNew>
  );
};

export default AdvacneExpenseCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
  },
  appContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  colMargin: {
    marginRight: 16,
    marginBottom: 10,
  },
});
