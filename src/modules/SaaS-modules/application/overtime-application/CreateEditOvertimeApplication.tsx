import CheckBox from '@react-native-community/checkbox';
import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Edge} from 'react-native-safe-area-context';
import {TimeSheetCRUD} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomDatePickerNew from '../../../../common/components/CustomDatePicker';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomTimePickerNew from '../../../../common/components/CustomTimePicker';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {timeFormater} from '../../../../common/services/timeFormater';
import {
  _todayDate,
  _todayDateTime,
} from '../../../../common/services/todayDate';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const CreateEditOvertimeApplication = ({route}: props) => {
  const overtimeDetails = route?.params?.overtimeDetails;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();

  const toaster = useToast();

  const [toggleCheckBox, setToggleCheckBox] = useState(1);

  const empDDL = [
    {
      value: overtimeDetails?.intEmployeeId,
      label: overtimeDetails?.employeeName,
    },
  ];

  //   useAsyncEffect(
  //     async (isMounted) => {
  //       if (!isMounted()) {
  //         return;
  //       }
  //       const res = await getAllEmployeeLanding(userInfo?.intEmployeeId);
  //       const ddl = res?.map((item: any) => {
  //         return {
  //           value: item?.intEmployeeBasicInfoId,
  //           label: item?.strEmployeeName,
  //         };
  //       });
  //       setAllEmpDDL(ddl);
  //     },
  //     [userInfo, isFocused]
  //   );

  const updateDefaultValues = {
    selectEmployee: {
      value: overtimeDetails?.EmployeeId,
      label: overtimeDetails?.EmployeeName,
    },
    overtimeDate: overtimeDetails?.OvertimeDate,
    startTime: overtimeDetails?.StartTime,
    endTime: overtimeDetails?.EndTime,
    overtimeHour: overtimeDetails?.OvertimeHour?.toString(),
    reason: overtimeDetails?.Reason,
  };

  const {control, setValue, handleSubmit, reset} = useForm({
    defaultValues: {
      selectEmployee: {
        value: overtimeDetails?.intEmployeeId,
        label: overtimeDetails?.employeeName,
      },
      overtimeDate: Platform.OS === 'ios' ? _todayDate() : '',
    },
  });

  const onSubmit = async (data: any) => {
    const iosTime =
      dayjs(_todayDateTime()).format('LT') &&
      dayjs(_todayDateTime()).format('LT');
    const payload = {
      partType: 'Overtime',
      isActive: true,
      businessUnitId: userInfo?.intBusinessUnitId,
      accountId: userInfo?.intAccountId,
      workplaceId: 0,
      intCreatedBy: userInfo?.intEmployeeId,
      startTime: timeFormater(data?.startTime ? data?.startTime : iosTime),
      endTime: timeFormater(data?.endTime ? data?.endTime : iosTime),
      overtimeDate: data?.overtimeDate,
      overtimeHour: Number(data?.overtimeHour),
      reason: data?.reason,
      autoId: 0,
      employeeId: overtimeDetails?.intEmployeeId,
    };
    const api_params = {
      url: TimeSheetCRUD,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});

    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      if (
        overtimeDetails?.OvertimeId &&
        overtimeDetails?.OvertimeId !== undefined
      ) {
        //@ts-ignore
        navigation.pop(2);
      } else {
        navigation.goBack();
      }
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
      if (overtimeDetails?.OvertimeId) {
        reset(updateDefaultValues);
      }
    },
    [overtimeDetails?.OvertimeId],
  );

  return (
    <ContainerNew
      edges={edges}
      scrollEnabled={false}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Create Overtime Entry Request"
        />
      }
      style={styles.container}>
      <KeyboardAwareScrollView
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll>
        <View style={styles.inputMain}>
          <View>
            <CustomDropDownNew
              data={empDDL}
              label="Select Employee"
              name="selectEmployee"
              control={control}
              setValue={setValue}
              isDisable
              rules={{required: true}}
            />
          </View>

          <View style={styles.padTop}>
            <CustomDatePickerNew
              name="overtimeDate"
              label="Overtime Date"
              control={control}
              rules={{required: Platform.OS === 'ios' ? false : true}}
              setValue={setValue}
            />
          </View>

          <View style={[styles.multiInput, styles.padTop]}>
            <View style={styles.multiInput}>
              <CheckBox
                disabled={toggleCheckBox === 1 ? true : false}
                value={toggleCheckBox === 1 && true}
                onValueChange={() => setToggleCheckBox(1)}
                tintColors={{true: COLORS.primary, false: COLORS.textNewColor}}
                tintColor={COLORS.primary}
                onCheckColor={COLORS.primary}
                onTintColor={COLORS.primary}
              />
              <Text style={styles.hourRange}>Hourly</Text>
            </View>

            <View style={styles.multiInput}>
              <CheckBox
                disabled={toggleCheckBox === 2 ? true : false}
                value={toggleCheckBox === 2 && true}
                onValueChange={() => setToggleCheckBox(2)}
                tintColors={{true: COLORS.primary, false: COLORS.textNewColor}}
                tintColor={COLORS.primary}
                onCheckColor={COLORS.primary}
                onTintColor={COLORS.primary}
              />
              <Text style={styles.hourRange}>Range</Text>
            </View>
          </View>

          {toggleCheckBox === 2 ? (
            <View style={[styles.multiInput, styles.padTop, styles.justify]}>
              <View style={styles.singleInput}>
                <CustomTimePickerNew
                  control={control}
                  name="startTime"
                  label="Start Time"
                  setValue={setValue}
                  rules={{required: Platform.OS === 'ios' ? false : true}}
                />
              </View>
              <View style={styles.singleInput}>
                <CustomTimePickerNew
                  control={control}
                  name="endTime"
                  label="End Time"
                  setValue={setValue}
                  rules={{required: Platform.OS === 'ios' ? false : true}}
                />
              </View>
            </View>
          ) : null}

          {toggleCheckBox === 2 ? null : (
            <View style={styles.padTop}>
              <CustomInputNew
                setValue={setValue}
                control={control}
                name="overtimeHour"
                multiline
                label="Overtime Hour"
                rules={{required: true}}
                keyboardType="number-pad"
              />
            </View>
          )}

          <View style={styles.padTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="reason"
              multiline
              label="Reason"
            />
          </View>
        </View>

        <CustomButtonNew
          btnText={
            overtimeDetails?.OvertimeId ? 'Update Request' : 'Send Request'
          }
          onBtnPress={handleSubmit(onSubmit)}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnText}
        />
      </KeyboardAwareScrollView>
    </ContainerNew>
  );
};

export default CreateEditOvertimeApplication;

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

  btn: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  padTop: {
    paddingTop: 16,
  },
  justify: {
    justifyContent: 'space-between',
  },
  multiInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hourRange: {
    fontSize: 14,
    color: COLORS.textNewColor,
    paddingRight: 16,
    paddingLeft: Platform?.OS === 'ios' ? 10 : 2,
  },
  singleInput: {
    width: '48%',
  },
});
