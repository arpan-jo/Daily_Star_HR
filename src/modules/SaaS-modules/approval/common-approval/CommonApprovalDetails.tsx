import {
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Edge } from 'react-native-safe-area-context';
import { commonURL } from '../../../../../App';
import { EmployeeProfileView } from '../../../../common/api/api';
import { commonApprovalDetailsStyle as styles } from '../../../../common/commonStyle/commonApprovalDetailsStyle';
import ApprovalDetails from '../../../../common/components/CommonApprovalInfo';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import { useToast } from '../../../../common/components/CustomToast';
import EmployeeInfoCard from '../../../../common/components/EmployeeInfoCard';
import { httpRequest } from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import { date_formater } from '../../../../common/services/dateFormater';
import { handleApprovalAction } from '../../../../hooks/useCommonApprovalV2';
import { ProfileDataType } from '../../../../interfaces/dashboard/employeeDashboard';
import { useRootStore } from '../../../../stores/rootStore';
import {
  getApprovalHeaderTitle,
  getApprovalInfoRows,
} from './commonApprovalFields';

const edges: Edge[] = ['right', 'bottom', 'left'];

// Details screen for any approval type that has no dedicated screen yet.
const CommonApprovalDetails = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const { userInfo } = useRootStore();
  const route = useRoute();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const toaster = useToast();

  //@ts-ignore
  const commonApprovalDetails = route?.params?.commonApprovalDetails;
  //@ts-ignore
  const approvalTitle = route?.params?.approvalTitle || 'Approval';
  const headerTitle = `${getApprovalHeaderTitle(approvalTitle)} Details`;

  const applicationInformation = commonApprovalDetails?.applicationInformation;
  const employeeId =
    commonApprovalDetails?.notificationMaster?.intEmployeeId ??
    //from push notification
    (commonApprovalDetails?.empId
      ? +commonApprovalDetails?.empId
      : undefined) ??
    applicationInformation?.employeeId;
  const infoRows = getApprovalInfoRows(applicationInformation);

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      if (!employeeId) {
        return null;
      }
      //api call here
      const api_params2 = {
        url: EmployeeProfileView,
        data:
          commonURL === userInfo?.strUrl
            ? {
                employeeId: employeeId,
                businessUnitId: userInfo?.intBusinessUnitId,
                workplaceGroupId: userInfo?.intWorkplaceGroupId,
              }
            : {
                employeeId: employeeId,
              },
      };
      const profileRes = await httpRequest(api_params2, () => {});
      setProfileData(profileRes);
    },
    [isFocused],
  );

  return (
    <ContainerNew
      edges={edges}
      isBottomDoubleButton={
        !!(
          commonApprovalDetails?.Status?.trim() === 'Pending' ||
          applicationInformation?.status?.trim() === 'Pending'
        )
      }
      firstBtnTxt="Reject"
      firstBtmBtnPress={() => setIsModalShow2(true)}
      firstBtnStyle={styles.firstBtn}
      firstBtnTxtStyle={styles.firstBtnTxt}
      secondBtnTxt="Approve"
      secondBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader title={headerTitle} onBackPress={navigation.goBack} />
      }
      style={styles.container}
    >
      {applicationInformation?.employeeName ? (
        <EmployeeInfoCard
          profileData={profileData}
          detailsData={applicationInformation}
          onPress={
            applicationInformation?.employeeId
              ? () =>
                  navigation.navigate('AllEmployeeDetails', {
                    leaveDetails: {
                      EmployeeId: applicationInformation?.employeeId,
                    },
                    isFromApproval: true,
                  })
              : undefined
          }
        />
      ) : null}
      <View style={detailsStyles.infoBox}>
        <ApprovalDetails
          iconName="today"
          label="Application Date"
          value={
            applicationInformation?.applicationDate
              ? date_formater(applicationInformation?.applicationDate)
              : '-'
          }
        />
        {infoRows.map(row => (
          <ApprovalDetails
            key={row.key}
            iconName={row.iconName}
            label={row.label}
            value={row.value}
          />
        ))}
        <ApprovalDetails
          iconName="pending-actions"
          label="Waiting Stage"
          value={
            applicationInformation?.waitingStage ??
            applicationInformation?.WaitingStage ??
            applicationInformation?.currentStage
          }
        />
        <ApprovalDetails
          iconName="pending-actions"
          label="Status"
          value={applicationInformation?.status}
        />
      </View>

      <CustomModalNew
        setIsModalShow={setIsModalShow}
        isModalShow={isModalShow}
        onPressCallApi={() =>
          handleApprovalAction({
            userInfo,
            actionType: 'approve',
            method: 'post',
            toaster,
            applicationTypeId: commonApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: commonApprovalDetails,
            navigation,
          })
        }
        modalText={`Are you sure to approve ${approvalTitle} application?`}
        deleteText={'Confirm'}
      />
      <CustomModalNew
        setIsModalShow={setIsModalShow2}
        isModalShow={isModalShow2}
        onPressCallApi={() =>
          handleApprovalAction({
            userInfo,
            actionType: 'reject',
            method: 'post',
            toaster,
            applicationTypeId: commonApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: commonApprovalDetails,
            navigation,
          })
        }
        modalText={`Are you sure to reject ${approvalTitle} application?`}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default observer(CommonApprovalDetails);

const detailsStyles = StyleSheet.create({
  infoBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
