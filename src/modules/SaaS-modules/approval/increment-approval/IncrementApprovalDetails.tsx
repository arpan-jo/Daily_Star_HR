import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {View} from 'react-native';
import {Edge} from 'react-native-safe-area-context';
import {commonURL} from '../../../../../App';
import {EmployeeProfileView} from '../../../../common/api/api';
import {commonApprovalDetailsStyle as styles} from '../../../../common/commonStyle/commonApprovalDetailsStyle';
import ApprovalDetails from '../../../../common/components/CommonApprovalInfo';
import ContainerNew from '../../../../common/components/Container';
import CustomHeader from '../../../../common/components/CustomHeader';
import CustomModalNew from '../../../../common/components/CustomModal';
import {useToast} from '../../../../common/components/CustomToast';
import EmployeeInfoCard from '../../../../common/components/EmployeeInfoCard';
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {handleApprovalAction} from '../../../../hooks/useCommonApprovalV2';
import {ProfileDataType} from '../../../../interfaces/dashboard/employeeDashboard';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const IncrementApprovalDetails = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const route = useRoute();
  const [profileData, setProfileData] = useState<ProfileDataType>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const toaster = useToast();

  //@ts-ignore
  const incrementApprovalDetails = route?.params?.incrementApprovalDetails;

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      //api call here
      const api_params2 = {
        url: EmployeeProfileView,
        data:
          commonURL === userInfo?.strUrl
            ? {
                employeeId:
                  incrementApprovalDetails?.notificationMaster?.intEmployeeId ??
                  //from push notification
                  +incrementApprovalDetails?.empId,
                businessUnitId: userInfo?.intBusinessUnitId,
                workplaceGroupId: userInfo?.intWorkplaceGroupId,
              }
            : {
                employeeId:
                  incrementApprovalDetails?.notificationMaster?.intEmployeeId ??
                  //from push notification
                  +incrementApprovalDetails?.empId,
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
          incrementApprovalDetails?.Status?.trim() === 'Pending' ||
          incrementApprovalDetails?.applicationInformation?.status?.trim() ===
            'Pending'
        )
      }
      firstBtnTxt="Reject"
      firstBtmBtnPress={() => setIsModalShow2(true)}
      firstBtnStyle={styles.firstBtn}
      firstBtnTxtStyle={styles.firstBtnTxt}
      secondBtnTxt="Approve"
      secondBtmBtnPress={() => setIsModalShow(true)}
      header={
        <CustomHeader
          title="Increment Approval Details"
          onBackPress={navigation.goBack}
        />
      }
      style={styles.container}>
      <EmployeeInfoCard
        profileData={profileData}
        detailsData={incrementApprovalDetails?.applicationInformation}
        onPress={() =>
          navigation.navigate('AllEmployeeDetails', {
            leaveDetails: {
              EmployeeId:
                incrementApprovalDetails?.applicationInformation?.employeeId,
            },
            isFromApproval: true,
          })
        }
      />
      <View style={{paddingHorizontal: 16, paddingVertical: 10}}>
        <ApprovalDetails
          iconName="today"
          label="Application Date"
          value={date_formater(
            incrementApprovalDetails?.applicationInformation?.applicationDate,
          )}
        />
        <ApprovalDetails
          iconName="today"
          label="Effective Date"
          value={date_formater(
            incrementApprovalDetails?.applicationInformation?.dteEffectiveDate,
          )}
        />
        <ApprovalDetails
          iconName="money"
          label="Incremented Amount"
          value={
            incrementApprovalDetails?.applicationInformation?.numIncrementAmount
          }
        />

        <ApprovalDetails
          iconName="today"
          label="Salary Type"
          value={incrementApprovalDetails?.applicationInformation?.salaryType}
        />
        <ApprovalDetails
          iconName="today"
          label="Depand On"
          value={incrementApprovalDetails?.applicationInformation?.strDependOn}
        />
        <ApprovalDetails
          iconName="pending-actions"
          label="Waiting Stage"
          value={
            // details?.waitingStage ||
            // details?.WaitingStage ||
            incrementApprovalDetails?.applicationInformation?.waitingStage ??
            incrementApprovalDetails?.applicationInformation?.WaitingStage ??
            // details?.CurrentStage ||
            incrementApprovalDetails?.applicationInformation?.currentStage
          }
        />
        <ApprovalDetails
          iconName="pending-actions"
          label="Status"
          value={incrementApprovalDetails?.applicationInformation?.status}
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
            applicationTypeId: incrementApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: incrementApprovalDetails,
            navigation,
          })
        }
        modalText={'Are you sure to approve Increment application?'}
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
            applicationTypeId: incrementApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: incrementApprovalDetails,
            navigation,
          })
        }
        modalText={'Are you sure to reject Increment application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default observer(IncrementApprovalDetails);
