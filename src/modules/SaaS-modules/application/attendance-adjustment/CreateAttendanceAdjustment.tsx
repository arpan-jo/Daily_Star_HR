import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Edge} from 'react-native-safe-area-context';
import {useRootStore} from '../../../../stores/rootStore';
import {_todayDate} from '../../../../common/services/todayDate';
import {createAttendanceAdjustment} from '../../../../services/SaaS-modules/attendance/attendance';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomDropDownNew from '../../../../common/components/CustomDropDown';
import CustomInputNew from '../../../../common/components/CustomInput';
import CustomButtonNew from '../../../../common/components/CustomButton';
import {COLORS} from '../../../../common/constant/Themes';
import {useToast} from '../../../../common/components/CustomToast';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';

const edges: Edge[] = ['right', 'bottom', 'left'];

const CreateAttendanceAdjustment = () => {
  const {userInfo} = useRootStore();
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const application = route?.params?.application;
  const toaster = useToast();
  const attStatusData = [
    {value: 1, label: 'Present'},
    {value: 3, label: 'Late'},
  ];

  const {control, setValue, handleSubmit, reset} = useForm({});

  const updateDefaultValues = {
    changeStatus: {
      value:
        (application?.strRequestStatus || application?.RequestStatus) ===
        'Pending'
          ? 1
          : 2,
      label: application?.strRequestStatus || application?.RequestStatus,
    },
    remarks: application?.strRemarks,
  };

  const onSubmit = async (data: any) => {
    const payload = [
      {
        id:
          application?.strRequestStatus || application?.RequestStatus
            ? application?.intId || application?.ManualAttendanceId
            : 0,
        attendanceSummaryId:
          application?.AttendanceSummaryId || application?.AutoId,
        employeeId: application?.intEmployeeId || application?.EmployeeId,
        attendanceDate:
          application?.dteAttendanceDate || application?.AttendanceDate,
        inTime: application?.timeInTime || application?.ManulInTime || '',
        outTime: application?.timeOutTime || application?.ManulOutTime || '',
        status:
          application?.isPresent === true
            ? 'Present'
            : application?.isLate === true
              ? 'Late'
              : application?.isLeave === true
                ? 'Leave'
                : application?.isMovement === true
                  ? 'Movement'
                  : application?.isAbsent === true
                    ? 'Absent'
                    : '',
        requestStatus: data?.changeStatus?.label,
        remarks: data?.remarks,
        isApproved: application?.isApproved || false,
        isActive: application?.isActive || true,
        isManagement: false,
        insertUserId: userInfo?.intEmployeeId,
        insertDateTime: _todayDate(),
        accountId: userInfo?.intAccountId,
      },
    ];

    const res = await createAttendanceAdjustment(payload);

    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      if (application?.ApplicationStatus?.trim() === 'Pending') {
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
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
  };

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (application?.ApplicationStatus?.trim() === 'Pending') {
        reset(updateDefaultValues);
      }
    },
    [application?.ApplicationStatus?.trim() === 'Pending'],
  );
  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Create Attendance Adjustment"
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
              data={attStatusData}
              label="Change Status"
              name="changeStatus"
              control={control}
              setValue={setValue}
              rules={{required: true}}
            />
          </View>

          <View style={styles.paddingTop}>
            <CustomInputNew
              setValue={setValue}
              control={control}
              name="remarks"
              multiline
              label="Remarks"
              // rules={{ required: true }}
            />
          </View>
        </View>

        <CustomButtonNew
          onBtnPress={handleSubmit(onSubmit)}
          btnText={'Send Request'}
          btnstyle={styles.btn}
          btnTextStyle={styles.btnText}
        />
      </KeyboardAwareScrollView>
    </ContainerNew>
  );
};

export default CreateAttendanceAdjustment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  inputMain: {
    padding: 16,
    marginTop: 24,
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
  paddingTop: {paddingTop: 16},
});
