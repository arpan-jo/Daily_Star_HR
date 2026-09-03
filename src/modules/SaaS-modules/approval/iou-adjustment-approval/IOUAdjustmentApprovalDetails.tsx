import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Edge} from 'react-native-safe-area-context';
import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {IMAGES} from '../../../../common/constant/Index';
import {COLORS} from '../../../../common/constant/Themes';
import {date_formater} from '../../../../common/services/dateFormater';
import {IOUAdjustmentApproval} from '../../../../services/SaaS-modules/iou/ios';
import {useRootStore} from '../../../../stores/rootStore';

const edges: Edge[] = ['right', 'bottom', 'left'];

interface props {
  route?: any;
}

const IOUAdjustmentApprovalDetails = ({route}: props) => {
  const navigation = useNavigation();

  const iouAdjustDetails = route?.params?.iouAdjustDetails;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);

  const approveOrReject = async (isReject: boolean) => {
    const payload = [
      {
        applicationId: iouAdjustDetails?.application?.intIouadjustmentId,
        approverEmployeeId: userInfo?.intEmployeeId,
        isReject: isReject,
        accountId: userInfo?.intAccountId,
        isAdmin: userInfo?.isOfficeAdmin,
      },
    ];
    const res = await IOUAdjustmentApproval(payload);
    if (res) {
      navigation.goBack();
      toaster.show({message: res?.data, type: 'success'});
    }
  };

  return (
    <ContainerNew
      isRefresh={false}
      edges={edges}
      isBottomDoubleButton={true}
      firstBtnTxt="Reject"
      firstBtmBtnPress={() => setIsModalShow2(true)}
      firstBtnStyle={styles.firstBtn}
      firstBtnTxtStyle={styles.firstBtnTxt}
      secondBtnTxt="Approve"
      secondBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          onLeftCrossPress={() => navigation.goBack()}
          title="IOU Details"
          statusText={
            iouAdjustDetails?.application?.strStatus === 'Pending'
              ? true
              : false
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
              //@ts-ignore
              navigation.navigate('AllEmployeeDetails', {
                leaveDetails: {EmployeeId: iouAdjustDetails?.intEmployeeId},
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
                    {iouAdjustDetails?.strEmployeeName}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {iouAdjustDetails?.employmentType}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {iouAdjustDetails?.intEmployeeId}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {iouAdjustDetails?.designation}
                  </Text>
                  <Text style={styles.cardCommonText}>
                    {iouAdjustDetails?.department}
                  </Text>
                </View>
              </View>
              <MIcon name="arrow-forward" size={25} color={'#667085'} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Adjustment Details */}
        <Text style={styles.sectionTxt}>Adjustment Details</Text>

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
                {date_formater(iouAdjustDetails?.dteAttendanceDate)}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <Icons
                name="currency-bdt"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Adjusted Amount</Text>
              <Text style={styles.valueText}>
                {iouAdjustDetails?.numAdjustmentAmount}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <Icons
                name="currency-bdt"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Payable Amount</Text>
              <Text style={styles.valueText}>
                {iouAdjustDetails?.numPayableAmount}
              </Text>
            </View>
          </View>

          <View style={styles.box}>
            <View style={styles.iconBox}>
              <Icons
                name="currency-bdt"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={styles.textRightPart}>
              <Text style={styles.subText}>Receivable Amount</Text>
              <Text style={styles.valueText}>
                {iouAdjustDetails?.numReceivableAmount}
              </Text>
            </View>
          </View>
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
              <Text style={styles.subText}>Bill Attachment</Text>
              <Text style={styles.valueText}>---</Text>
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
                {iouAdjustDetails?.waitingStage ||
                  iouAdjustDetails?.WaitingStage ||
                  iouAdjustDetails?.currentStage}
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
              <Text style={styles.subText}>Adjustment Status</Text>
              <Text style={styles.valueText}>{iouAdjustDetails?.status}</Text>
            </View>
          </View>
        </View>

        {/* IOU Details */}
        <Text style={styles.bottomSectionTxt}>IOU Details</Text>
        <View style={styles.bottomSection}>
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
              <Text style={styles.valueText}>
                ৳ {iouAdjustDetails?.iouAmount}
              </Text>
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
                {date_formater(iouAdjustDetails?.dteFromDate)}
                {' - '}
                {date_formater(iouAdjustDetails?.dteToDate)}
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
              <Text style={styles.subText}>Description</Text>
              <Text style={styles.valueText}>
                {iouAdjustDetails?.description}
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
              <Text style={styles.valueText}>
                {iouAdjustDetails?.application?.strStatus}
              </Text>
            </View>
          </View>
          <View style={styles.box}>
            <View style={styles.iconBox}>
              <MIcon
                name="file-present"
                size={25}
                color={COLORS.iconColor}
                style={styles.centerText}
              />
            </View>
            <View style={[styles.textRightPart, styles.borderBtmWidth]}>
              <Text style={styles.subText}>File</Text>
              <Text style={styles.valueText}>---</Text>
            </View>
          </View>
        </View>
      </View>
      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() => approveOrReject(false)}
        modalText={'Are you sure to approve IOU Adjustment application?'}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() => approveOrReject(true)}
        modalText={'Are you sure to reject IOU Adjustment application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default IOUAdjustmentApprovalDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
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
  sectionTxt: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
    marginLeft: 17,
    marginTop: 16,
  },
  bottomSectionTxt: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.graySubText,
    marginLeft: 17,
    marginTop: 6,
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
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    marginTop: 17,
  },
  topSectionBottomPart: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginTop: 9,
  },
  flexRowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    // position: 'absolute',
    bottom: 15,
    alignSelf: 'center',
  },
  borderBtmWidth: {
    borderBottomWidth: 0,
  },
  padding: {
    paddingVertical: 16,
  },
  firstBtn: {
    backgroundColor: COLORS.newGray,
    borderColor: COLORS.offDay,
    borderWidth: 1,
  },
  firstBtnTxt: {
    color: COLORS.textColor,
    fontWeight: '600',
  },
});
