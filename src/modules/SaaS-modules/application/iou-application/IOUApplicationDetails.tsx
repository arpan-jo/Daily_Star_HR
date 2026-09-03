import {useNavigation} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
//@ts-ignore
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {_todayDate} from '../../../../common/services/todayDate';
import {createLeaveApplication} from '../../../../services/SaaS-modules/leave/leave';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const IOUApplicationDetails = ({route}: props) => {
  const navigation = useNavigation();

  const iouDetails = route?.params?.iouDetails;

  const {userInfo} = useRootStore();
  const toaster = useToast();

  const [isModalShow, setIsModalShow] = useState(false);
  const [_isApplicationSubmit, setIsApplicationSubmit] = useState(false);

  const saveHandler = async () => {
    const fromDate = dayjs(
      iouDetails?.AppliedFromDate && iouDetails?.AppliedFromDate,
    );
    const toDate = dayjs(
      iouDetails?.AppliedToDate && iouDetails?.AppliedToDate,
    );

    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({message: 'Invalid date duration', type: 'error'});
    } else {
      const payload = {
        // part id 1 = create, 2 = edit, 3 = delete
        partId: 3,
        leaveApplicationId: iouDetails?.intApplicationId,
        leaveTypeId: iouDetails?.LeaveTypeId,
        employeeId: userInfo?.intEmployeeId,
        accountId: userInfo?.intAccountId,
        businessUnitId: userInfo?.intBusinessUnitId,
        applicationDate: _todayDate(),
        appliedFromDate: iouDetails?.AppliedFromDate,
        appliedToDate: iouDetails?.AppliedToDate,
        documentFile: 0,
        leaveReason: iouDetails?.Reason,
        addressDuetoLeave: iouDetails?.AddressDuetoLeave,
        insertBy: userInfo?.intEmployeeId,
      };
      const res = await createLeaveApplication(payload, setIsApplicationSubmit);
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
          title="IOU Details"
          // deleteIcon={iouDetails?.Status?.trim().toLowerCase() === 'pending' ? 'delete' : ''}
          // deleteIconPress={() => setIsModalShow(true)}
          alterIcon={
            iouDetails?.Status?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateEditIOUApplication', {
              iouDetails: iouDetails,
            })
          }
        />
      }
      style={styles.container}>
      <View>
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <MIcon
              name="lightbulb-outline"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Application Code</Text>
            <Text style={styles.valueText}>{iouDetails?.strIOUCode}</Text>
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
            <Text style={styles.subText}>Application Date</Text>
            <Text style={styles.valueText}>
              {date_formater(iouDetails?.dteApplicationDate)}
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
            <Text style={styles.subText}>IOU Amount</Text>
            <Text style={styles.valueText}>{iouDetails?.numIOUAmount}</Text>
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
              {date_formater(iouDetails?.dteFromDate)}
              {' - '}
              {date_formater(iouDetails?.dteToDate)}
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
            <Text style={styles.subText}>Description</Text>
            <Text style={styles.valueText}>{iouDetails?.strDiscription}</Text>
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
            <Text style={styles.valueText}>{iouDetails?.Status}</Text>
          </View>
        </View>

        <Text style={styles.assignmentText}>Adjustment Details</Text>
        <View style={styles.bar} />
        <View style={styles.box}>
          <View style={styles.iconBox}>
            <Icon
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Adjusted Amount</Text>
            <Text style={styles.valueText}>
              {iouDetails?.numAdjustedAmount}
            </Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <Icon
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Payable Amount</Text>
            <Text style={styles.valueText}>{iouDetails?.numPayableAmount}</Text>
          </View>
        </View>

        <View style={styles.box}>
          <View style={styles.iconBox}>
            <Icon
              name="currency-bdt"
              size={25}
              color={COLORS.iconColor}
              style={styles.centerText}
            />
          </View>
          <View style={styles.textRightPart}>
            <Text style={styles.subText}>Receivable Amount</Text>
            <Text style={styles.valueText}>
              {iouDetails?.numReceivableAmount}
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
            <Text style={styles.subText}>Adjustment Status</Text>
            <Text style={styles.valueText}>
              {iouDetails?.AdjustmentStatus || '--'}
            </Text>
          </View>
        </View>

        {/* {iouDetails?.DocumentFileUrl ? (
          <TouchableOpacity>
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
                <Text style={[styles.valueText, { color: COLORS.movement }]}>Document</Text>
              </View>
            </View>
          </TouchableOpacity>
        ) : null} */}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalShow}
        onRequestClose={() => {
          setIsModalShow(!isModalShow);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Are you sure to delete the leave application?
            </Text>

            <View style={styles.textBottom}>
              <Pressable onPress={() => setIsModalShow(!isModalShow)}>
                <Text style={[styles.textStyle, styles.paddingRight]}>NO</Text>
              </Pressable>
              <Pressable onPress={() => saveHandler()}>
                <Text style={styles.textStyle}>YES</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ContainerNew>
  );
};

export default IOUApplicationDetails;

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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121E4499',
  },

  modalView: {
    height: 160,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 35,
    paddingTop: 35,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalText: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
    color: COLORS.transparentBlack,
  },
  textStyle: {
    color: COLORS.primary,
    padding: 6,
  },
  textBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 30,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 1.25,
  },
  assignmentText: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
  },
  bar: {
    height: 1,
    backgroundColor: COLORS.bar,
    marginVertical: 8,
  },
  paddingRight: {
    marginRight: 20,
  },
});
