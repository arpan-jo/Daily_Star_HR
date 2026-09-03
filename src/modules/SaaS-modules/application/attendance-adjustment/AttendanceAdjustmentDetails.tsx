import {useNavigation, useRoute} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS} from '../../../../common/constant/Themes';

const edges: Edge[] = ['right', 'bottom', 'left'];

const AttendanceAdjustmentDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const attDetails = route?.params?.attDetails;

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Attendance Adjustment Details"
          alterIcon={
            attDetails?.ApplicationStatus?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateAttendanceAdjustment', {
              application: attDetails,
            })
          }
        />
      }
      style={styles.container}>
      <View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="pending-actions"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Approval Status</Text>
            <Text style={styles.valueText}>
              {attDetails?.ApplicationStatus}
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
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Request Attendance</Text>
            <Text style={styles.valueText}>
              {attDetails?.strRequestStatus || attDetails?.RequestStatus}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="perm-contact-calendar"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Actual Attendance</Text>
            <Text style={styles.valueText}>
              {attDetails?.isPresent && attDetails?.isLate && 'Late'}
              {attDetails?.isPresent && !attDetails?.isLate && 'Present'}
              {attDetails?.isAbsent && 'Absent'}
              {attDetails?.isOffday && 'Off Day'}
              {attDetails?.isHoliday && 'Holiday'}
              {attDetails?.isLeave && 'Leave'}
              {attDetails?.isMovement && 'Movement'}{' '}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="schedule"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>In-time</Text>
            <Text style={styles.valueText}>{attDetails?.InTime || '---'} </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="schedule"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Out-time</Text>
            <Text style={styles.valueText}>
              {attDetails?.OutTime || '---'}{' '}
            </Text>
          </View>
        </View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="subject"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Remarks</Text>
            <Text style={styles.valueText}>{attDetails?.strRemarks} </Text>
          </View>
        </View>
      </View>
    </ContainerNew>
  );
};

export default AttendanceAdjustmentDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  box: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  iconBox: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  subText: {
    fontSize: 12,
    lineHeight: 20,
    color: COLORS.graySubText,
  },
  valueText: {
    fontSize: 14,
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
