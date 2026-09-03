import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import {OverTimeApproval} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomButtonNew from '../../../../common/components/CustomButton';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {date_formater} from '../../../../common/services/dateFormater';
import {timeFormaterToPmAm} from '../../../../common/services/timeFormater';
import {useRootStore} from '../../../../stores/rootStore';
import {overtimeStyle} from '../../application/overtime-application/OvertimeApplicationDetails';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const OvertimeApprovalDetails = ({route}: props) => {
  const navigation = useNavigation();
  const overtimeDetails = route?.params?.overtimeDetails;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);

  const approveOrReject = async (isReject: boolean) => {
    const payload = [
      {
        applicationId: overtimeDetails?.intOverTimeId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];

    const api_params = {
      url: OverTimeApproval,
      data: payload,
      method: 'post',
    };
    const res = await httpRequest(api_params, () => {});
    if (res) {
      navigation.goBack();
      toaster.show({message: res?.data, type: 'success'});
    }
  };

  return (
    <ContainerNew
      edges={edges}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          title="Overtime Details"
          statusText={
            overtimeDetails?.application?.strStatus === 'Pending' ? true : false
          }
        />
      }
      style={styles.container}>
      <View style={styles.padding}>
        {/* Head Card */}
        <View style={styles.headBox}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.touchCard}
            onPress={() =>
              navigation.navigate('AllEmployeeDetails', {
                leaveDetails: {
                  EmployeeId: overtimeDetails?.application?.intEmployeeId,
                },
                isFromApproval: true,
              })
            }>
            <View style={styles.card}>
              <View style={styles.cardImageText}>
                <FastImage
                  source={IMAGES.NoImage}
                  style={styles.profileImage}
                />

                <View style={styles.cardText}>
                  <Text style={styles.name}>
                    {overtimeDetails?.strEmployeeName}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {overtimeDetails?.strEmploymentType}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {overtimeDetails?.application?.intEmployeeId}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {overtimeDetails?.strDesignation}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {overtimeDetails?.strDepartment}
                  </Text>
                </View>
              </View>
              <MIcon name="arrow-forward" size={25} color={'#667085'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Overtime application Details */}

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
              <Text style={styles.subText}>Application Date</Text>
              <Text style={styles.valueText}>
                {date_formater(overtimeDetails?.dteOverTimeDate)}
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
                {overtimeDetails?.application?.numOverTimeHour}
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
                {timeFormaterToPmAm(
                  overtimeDetails?.application?.tmeStartTime,
                ) || '---'}
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
                {timeFormaterToPmAm(overtimeDetails?.application?.tmeEndTime) ||
                  '---'}
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
            <View style={[styles.textRightPart, styles.borderBtmWidth]}>
              <Text style={styles.subText}>Waiting Stage</Text>
              <Text style={styles.valueText}>
                {overtimeDetails?.waitingStage ||
                  overtimeDetails?.WaitingStage ||
                  overtimeDetails?.waitingstage}
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
            <View style={[styles.textRightPart, styles.borderBtmWidth]}>
              <Text style={styles.subText}>Status</Text>
              <Text style={styles.valueText}>
                {overtimeDetails?.application?.strStatus}
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
              <Text style={styles.valueText}>{overtimeDetails?.strReason}</Text>
            </View>
          </View>
        </View>

        <View style={styles.flexRowCenter}>
          <View>
            <CustomButtonNew
              btnText={'Reject'}
              onBtnPress={() => setIsModalShow2(true)}
              btnstyle={styles.btn1}
              btnTextStyle={styles.btnText1}
            />
          </View>

          <CustomButtonNew
            btnText={'Approve'}
            onBtnPress={() => setIsModalShow(true)}
            btnstyle={styles.btn2}
            btnTextStyle={styles.btnText2}
          />
        </View>
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveOrReject(false)}
        modalText={'Are you sure to approve Overtime application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => approveOrReject(true)}
        modalText={'Are you sure to reject Overtime application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default OvertimeApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },

  btn1: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
    marginHorizontal: 8,
    backgroundColor: '#F2F4F7',
    borderWidth: 1,
    borderColor: COLORS.offDay,
  },
  btn2: {
    alignSelf: 'center',
    borderRadius: 100,
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginTop: 24,
    marginHorizontal: 8,
  },
  btnText1: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    color: COLORS.textColor,
  },
  btnText2: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },

  headBox: {
    marginHorizontal: 16,
    borderColor: COLORS.white,
    elevation: 10,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  touchCard: {
    padding: 16,
  },
  profileImage: {
    width: 66,
    height: 66,
    borderRadius: 50,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cardImageText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  cardText: {
    width: '80%',
    paddingHorizontal: 10,
  },
  name: {
    color: COLORS.textNewColor,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
  cardCommonText: {
    color: COLORS.textNewColor,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  topSectionBottomPart: {
    paddingHorizontal: 16,
    paddingTop: 9,
    paddingBottom: 24,
    marginTop: 17,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  borderBtmWidth: {
    borderBottomWidth: 0,
  },
  padding: {
    paddingVertical: 16,
  },
  ...overtimeStyle,
});
