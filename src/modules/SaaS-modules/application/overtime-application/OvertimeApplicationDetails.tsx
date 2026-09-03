import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';

//@ts-ignore
import {TimeSheetCRUD} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {date_formater} from '../../../../common/services/dateFormater';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface PropsTs {
  route?: any;
}

const OvertimeApplicationLandingDetails = ({route}: PropsTs) => {
  const overtimeDetails = route?.params?.overtimeDetails;
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const [isModalShow, setIsModalShow] = useState(false);
  const toaster = useToast();

  const handleDelete = async () => {
    const payload = {
      partType: 'Overtime',
      isActive: false,
      businessUnitId: userInfo?.intBusinessUnitId,
      accountId: userInfo?.intAccountId,
      workplaceId: 0,
      intCreatedBy: userInfo?.intEmployeeId,
      overtimeHour: null,
      autoId: overtimeDetails?.OvertimeId,
      employeeId: overtimeDetails?.EmployeeId,
      startTime: null,
      endTime: null,
    };

    const api_params = {
      url: TimeSheetCRUD,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    if (res?.statusCode === 200) {
      toaster.show({message: res?.message, type: 'success'});
      navigation.goBack();
    }
    if (res?.statusCode === 500) {
      toaster.show({message: res?.message, type: 'error'});
    }
    if (res?.StatusCode === 500) {
      toaster.show({message: res?.Message, type: 'error'});
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          title="Overtime Entry Details"
          deleteIcon={
            overtimeDetails?.ApprovalStatus?.trim()?.toLowerCase() === 'pending'
              ? Platform?.OS === 'ios'
                ? 'delete-outline'
                : 'delete'
              : ''
          }
          deleteIconPress={() => setIsModalShow(true)}
          alterIcon={
            overtimeDetails?.ApprovalStatus?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateEditOvertimeApplication', {
              overtimeDetails: overtimeDetails,
            })
          }
        />
      }
      style={styles.container}>
      <View>
        <View style={styles.topSectionBottomPart}>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="today"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Overtime Date</Text>
              <Text style={styles.valueText}>
                {date_formater(overtimeDetails?.OvertimeDate)}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="timer"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Total Hours</Text>
              <Text style={styles.valueText}>
                {overtimeDetails?.OvertimeHour}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="timelapse"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Start time</Text>
              <Text style={styles.valueText}>
                {timeFormaterToPmAm(overtimeDetails?.StartTime) || '---'}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="timelapse"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>End time</Text>
              <Text style={styles.valueText}>
                {timeFormaterToPmAm(overtimeDetails?.EndTime) || '---'}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="assignment"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={[styles.textRightPart, styles.borderBtmWidth]}>
              <Text style={styles.subText}>Reason</Text>
              <Text style={styles.valueText}>{overtimeDetails?.Reason}</Text>
            </View>
          </View>
        </View>
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => handleDelete()}
        modalText={'Are you sure to delete the overtime entry?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default OvertimeApplicationLandingDetails;
export const overtimeStyle = StyleSheet.create({
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  subText: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  valueText: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: COLORS.textNewColor,
    paddingBottom: 2,
  },
  centerText: {
    textAlign: 'center',
  },
  textRightPart: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    paddingBottom: 8,
    marginBottom: 9,
  },
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },

  topSectionBottomPart: {
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 24,
    marginTop: 17,
  },

  borderBtmWidth: {
    borderBottomWidth: 0,
  },
  ...overtimeStyle,
});
