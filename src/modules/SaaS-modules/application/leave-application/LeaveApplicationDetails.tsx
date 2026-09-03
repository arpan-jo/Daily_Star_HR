import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';

import dayjs from 'dayjs';
//@ts-ignore

import EnIcon from 'react-native-vector-icons/Entypo';
import FastImage from 'react-native-fast-image';
import {useRootStore} from '../../../../stores/rootStore';
import {_todayDate} from '../../../../common/services/todayDate';
import {createLeaveApplication} from '../../../../services/SaaS-modules/leave/leave';
import {commonURL, rscURL} from '../../../../../App';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater, getDay} from '../../../../common/services/dateFormater';
import CustomModalNew from '../../../../common/components/CustomModal';
import {getImageURL} from '../../../../common/services/getImage';
import {useToast} from '../../../../common/components/CustomToast';

const edges: Edge[] = ['right', 'bottom', 'left'];

const LeaveApplicationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const {leaveDetails} = route?.params;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [_isApplicationSubmit, setIsApplicationSubmit] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const saveHandler = async () => {
    const fromDate = dayjs(
      leaveDetails?.AppliedFromDate && leaveDetails?.AppliedFromDate,
    );
    const toDate = dayjs(
      leaveDetails?.AppliedToDate && leaveDetails?.AppliedToDate,
    );

    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({message: 'Invalid date duration', type: 'error'});
    } else {
      const payload = {
        // part id 1 = create, 2 = edit, 3 = delete
        partId: 3,
        leaveApplicationId: leaveDetails?.intApplicationId,
        leaveTypeId: leaveDetails?.LeaveTypeId,
        employeeId:
          leaveDetails?.empLeaveData?.EmployeeId || userInfo?.intEmployeeId,
        accountId:
          leaveDetails?.empLeaveData?.profileData?.empEmployeeBankDetail
            ?.intAccountId || userInfo?.intAccountId,
        businessUnitId:
          leaveDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        applicationDate: _todayDate(),
        appliedFromDate: leaveDetails?.AppliedFromDate,
        appliedToDate: leaveDetails?.AppliedToDate,
        documentFile: 0,
        leaveReason: leaveDetails?.Reason,
        addressDuetoLeave: leaveDetails?.AddressDuetoLeave,
        insertBy:
          leaveDetails?.empLeaveData?.EmployeeId || userInfo?.intEmployeeId,
      };
      const payload2 = {
        ...payload,
        leaveTime: leaveDetails?.numLeaveTime,
        leaveFrom: leaveDetails?.strLeaveFrom,
        leaveTo: leaveDetails?.strLeaveTo,
      };
      // for common project
      const commonPayload = {
        isHalfDay: leaveDetails?.HalfDay ? true : false,
        strHalfDayRange: leaveDetails?.HalfDayRange || '',
        leaveApplicationId: leaveDetails?.intApplicationId,
        leaveTypeId: leaveDetails?.LeaveTypeId,
        employeeId:
          leaveDetails?.intEmployeeId ||
          leaveDetails?.empLeaveData?.EmployeeId ||
          userInfo?.intEmployeeId,
        businessUnitId:
          leaveDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        appliedFromDate: leaveDetails?.AppliedFromDate,
        appliedToDate: leaveDetails?.AppliedToDate,
        documentFile: 0,
        leaveReason: leaveDetails?.Reason,
        addressDuetoLeave: leaveDetails?.AddressDuetoLeave,
        isActive: false,
        workplaceGroupId:
          leaveDetails?.empLeaveData?.profileData?.employeeProfileLandingView
            ?.intWorkplaceGroupId || userInfo?.intWorkplaceGroupId,
        isSelfService: leaveDetails?.empLeaveData?.EmployeeId ? false : true,
      };

      const res = await createLeaveApplication(
        userInfo?.strUrl === rscURL
          ? payload2
          : userInfo?.strUrl === commonURL
            ? commonPayload
            : payload,
        setIsApplicationSubmit,
      );
      if (res?.statusCode === 200) {
        toaster.show({message: res?.message, type: 'success'});
        navigation.goBack();
      }
      if (res?.statusCode === 500) {
        toaster.show({message: res?.message, type: 'error'});
      }
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onBackPress={navigation.goBack}
          title="Leave Details"
          deleteIcon={
            leaveDetails?.ApprovalStatus?.trim()?.toLowerCase() === 'pending'
              ? Platform?.OS === 'ios'
                ? 'delete-outline'
                : 'delete'
              : ''
          }
          deleteIconPress={() => setIsModalShow(true)}
          alterIcon={
            leaveDetails?.ApprovalStatus?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateEditLeaveApplication', {
              leaveDetails: leaveDetails,
            })
          }
        />
      }
      style={styles.container}>
      <View>
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
            <Text style={styles.subText}>Application Date</Text>
            <Text style={styles.valueText}>
              {date_formater(leaveDetails?.ApplicationDate)}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="tour"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Leave Type</Text>
            <Text style={styles.valueText}>{leaveDetails?.LeaveType}</Text>
          </View>
        </View>

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
            <Text style={styles.subText}>Date Range</Text>
            <Text style={styles.valueText}>
              {date_formater(leaveDetails?.AppliedFromDate)}
              {' - '}
              {date_formater(leaveDetails?.AppliedToDate)}
            </Text>
          </View>
        </View>

        {userInfo?.strUrl === rscURL && leaveDetails?.numLeaveTime ? (
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
              <Text style={styles.subText}>Total Hours</Text>
              <Text style={styles.valueText}>
                {leaveDetails?.numLeaveTime / 60}
              </Text>
            </View>
          </View>
        ) : null}
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
            <Text style={styles.subText}>Duration</Text>
            <Text style={styles.valueText}>
              {/* {getDay(
                leaveDetails?.AppliedFromDate,
                leaveDetails?.AppliedToDate,
              )} */}
              {/* for common project */}
              {leaveDetails?.HalfDay
                ? leaveDetails?.HalfDayRange
                : getDay(
                    leaveDetails?.AppliedFromDate,
                    leaveDetails?.AppliedToDate,
                  )}
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
            <Text style={styles.subText}>Reason</Text>
            <Text style={styles.valueText}>{leaveDetails?.Reason}</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="location-on"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Loaction</Text>
            <Text style={styles.valueText}>
              {leaveDetails?.AddressDuetoLeave}
            </Text>
          </View>
        </View>

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
            <Text style={styles.subText}>Status</Text>
            <Text style={styles.valueText}>{leaveDetails?.ApprovalStatus}</Text>
          </View>
        </View>

        {leaveDetails?.DocumentFileUrl ? (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={styles.box}>
              <View style={styles.iconBox}>
                <MIcon
                  name="file-present"
                  size={25}
                  color={COLORS.iconColor}
                  style={styles.centerText}
                />
              </View>
              <View style={styles.textRightPart}>
                <Text style={styles.subText}>File</Text>
                <Text style={[styles.valueText, {color: COLORS.movement}]}>
                  Document
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => saveHandler()}
        modalText={'Are you sure to delete the leave application?'}
        deleteText={'Confirm'}
      />

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
                  leaveDetails?.DocumentFileUrl &&
                    leaveDetails?.DocumentFileUrl,
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

export default LeaveApplicationDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
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
  imageCancelIcon: {
    paddingLeft: 10,
    textAlign: 'right',
  },
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
  centerText: {textAlign: 'center'},
  textRightPart: {
    borderBottomWidth: 1,
    flex: 1,
    borderBottomColor: COLORS.iconGrayBackground,
    paddingBottom: 8,
    marginBottom: 9,
  },
  images: {width: 350, height: 450, marginVertical: 16},
});
