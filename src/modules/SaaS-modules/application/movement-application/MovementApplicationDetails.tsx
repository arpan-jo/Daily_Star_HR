import {useNavigation, useRoute} from '@react-navigation/native';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import MIcon from 'react-native-vector-icons/MaterialIcons';
//@ts-ignore
import {CRUDMovementApplication} from '../../../../common/api/api';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import {COLORS} from '../../../../common/constant/Themes';
import {httpRequest} from '../../../../common/constant/httpRequest';
import {date_formater} from '../../../../common/services/dateFormater';
import {useRootStore} from '../../../../stores/rootStore';
import {commonURL} from '../../../../../App';
import {timeFormaterWithoutSecond} from '../../../../common/services/timeFormater';
import CommonImageViewer from '../../../../common/components/CommonImageViewer';
import {getImageURL} from '../../../../common/services/getImage';

const edges: Edge[] = ['right', 'bottom', 'left'];

const MovementApplicationDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //@ts-ignore
  const {movementDetails} = route?.params;
  const {userInfo} = useRootStore();
  const toaster = useToast();
  const [_isApplicationSubmit, setIsApplicationSubmit] = useState(false);
  const [isModalShow, setIsModalShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const saveHandler = async () => {
    const fromDate = dayjs(movementDetails?.FromDate);
    const toDate = dayjs(movementDetails?.ToDate);

    if (toDate.diff(fromDate) < 1 && toDate.diff(fromDate) !== 0) {
      toaster.show({message: 'Invalid date duration', type: 'error'});
    } else {
      const payload = {
        // part id 1 = create, 2 = edit, 3 = delete
        partId: 3,
        accountId:
          movementDetails?.empLeaveData?.profileData?.empEmployeeBankDetail
            ?.intAccountId || userInfo?.intAccountId,
        businessUnitId:
          movementDetails?.empLeaveData?.intBusinessUnitId ||
          userInfo?.intBusinessUnitId,
        fromDate: movementDetails?.FromDate,
        fromTime:
          userInfo?.strUrl === commonURL
            ? timeFormaterWithoutSecond(movementDetails?.FromTimeAMPM)
            : movementDetails?.FromTime,
        insertBy:
          movementDetails?.empLeaveData?.EmployeeId || userInfo?.intEmployeeId,
        intEmployeeId:
          movementDetails?.empLeaveData?.EmployeeId || userInfo?.intEmployeeId,
        isActive: true,
        location: movementDetails?.Location,
        movementId: movementDetails?.MovementId,
        movementTypeId: movementDetails?.MovementTypeId,
        reason: movementDetails?.Reason,
        toDate: movementDetails?.ToDate,
        toTime:
          userInfo?.strUrl === commonURL
            ? timeFormaterWithoutSecond(movementDetails?.ToTimeAMPM)
            : movementDetails?.ToTime,
      };

      const commonPayload = {
        ...payload,
        workplaceGroupId:
          movementDetails?.empLeaveData?.profileData?.empEmployeeBankDetail
            ?.intWorkplaceGroupId ||
          movementDetails?.empLeaveData?.intWorkplaceGroupId ||
          movementDetails?.workplaceGroupId ||
          userInfo?.intWorkplaceGroupId,
      };

      const api_params = {
        url: CRUDMovementApplication,
        data: userInfo?.strUrl === commonURL ? commonPayload : payload,
        method: 'post',
      };
      const res = await httpRequest(api_params, setIsApplicationSubmit);
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
          title="Movement Details"
          deleteIcon={
            movementDetails?.Status?.trim()?.toLowerCase() === 'pending'
              ? Platform?.OS === 'ios'
                ? 'delete-outline'
                : 'delete'
              : ''
          }
          deleteIconPress={() => setIsModalShow(true)}
          alterIcon={
            movementDetails?.Status?.trim()?.toLowerCase() === 'pending'
              ? 'edit'
              : ''
          }
          alterIconPress={() =>
            navigation.navigate('CreateEditMovementApplication', {
              movementDetails: movementDetails,
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
              {date_formater(movementDetails?.ApplicationDate)}
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
            <Text style={styles.subText}>Movement Type</Text>
            <Text style={styles.valueText}>
              {movementDetails?.MovementType}
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
              {date_formater(movementDetails?.FromDate)}
              {' - '}
              {date_formater(movementDetails?.ToDate)}
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
            <Text style={styles.subText}>Time Range</Text>
            <Text style={styles.valueText}>
              {movementDetails?.FromTimeAMPM}
              {' - '}
              {movementDetails?.ToTimeAMPM}
            </Text>
          </View>
        </View>

        {userInfo?.strUrl === commonURL ? (
          <>
            <View style={styles.box}>
              <View style={styles.iconBox}>
                <MIcon
                  name="people"
                  size={25}
                  color={COLORS.iconColor}
                  style={styles.centerText}
                />
              </View>
              <View style={styles.textRightPart}>
                <Text style={styles.subText}>Contact Person</Text>
                <Text style={styles.valueText}>
                  {movementDetails?.ContactPerson}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.iconBox}>
                <MIcon
                  name="phone"
                  size={25}
                  color={COLORS.iconColor}
                  style={styles.centerText}
                />
              </View>
              <View style={styles.textRightPart}>
                <Text style={styles.subText}>Contact Number</Text>
                <Text style={styles.valueText}>
                  {movementDetails?.ContactNumber}
                </Text>
              </View>
            </View>
            <View style={styles.box}>
              <View style={styles.iconBox}>
                <MIcon
                  name="attachment"
                  size={25}
                  color={COLORS.iconColor}
                  style={styles.centerText}
                />
              </View>
              <View style={styles.textRightPart}>
                <Text style={styles.subText}>Attachment</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={[styles.valueText, {color: 'green'}]}>
                    {'Attachment'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : null}

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
            <Text style={styles.valueText}>{movementDetails?.Reason}</Text>
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
            <Text style={styles.valueText}>{movementDetails?.Location}</Text>
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
            <Text style={styles.valueText}>{movementDetails?.Status}</Text>
          </View>
        </View>

        {movementDetails?.DocumentFileUrl ? (
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
        modalText={'Are you sure to delete the movement application?'}
        deleteText={'Confirm'}
      />
      <CommonImageViewer
        imageUrl={getImageURL(
          movementDetails?.DocumentId && movementDetails?.DocumentId,
        )}
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ContainerNew>
  );
};

export default MovementApplicationDetails;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  box: {flexDirection: 'row', flexWrap: 'wrap'},
  iconBox: {
    width: 45,
    height: 45,
    backgroundColor: COLORS.iconGrayBackground,
    borderRadius: 100,
    justifyContent: 'center',
    marginRight: 16,
  },
  subText: {fontSize: 14, lineHeight: 20, color: COLORS.graySubText},
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
});
