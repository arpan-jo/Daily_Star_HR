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
import {httpRequest} from '../../../../common/constant/httpRequest';
import useAsyncEffect from '../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {date_formater} from '../../../../common/services/dateFormater';
import {getMonthNameByMonthId} from '../../../../common/services/getMonthNameByMonthId';
import {handleApprovalAction} from '../../../../hooks/useCommonApprovalV2';
import {ProfileDataType} from '../../../../interfaces/dashboard/employeeDashboard';
import {useRootStore} from '../../../../stores/rootStore';
const edges: Edge[] = ['right', 'bottom', 'left'];

const SalaryGenerateApprovalDetails = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {userInfo} = useRootStore();
  const route = useRoute();
  const [_profileData, setProfileData] = useState<ProfileDataType>();
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalShow2, setIsModalShow2] = useState(false);
  const toaster = useToast();

  //@ts-ignore
  const salaryApprovalDetails = route?.params?.salaryApprovalDetails;

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
                  salaryApprovalDetails?.notificationMaster?.intEmployeeId ??
                  //from push notification
                  +salaryApprovalDetails?.empId,
                businessUnitId: userInfo?.intBusinessUnitId,
                workplaceGroupId: userInfo?.intWorkplaceGroupId,
              }
            : {
                employeeId:
                  salaryApprovalDetails?.notificationMaster?.intEmployeeId ??
                  //from push notification
                  +salaryApprovalDetails?.empId,
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
          salaryApprovalDetails?.Status?.trim() === 'Pending' ||
          salaryApprovalDetails?.applicationInformation?.status?.trim() ===
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
      <View style={{paddingHorizontal: 16, paddingVertical: 10}}>
        <ApprovalDetails
          iconName="money"
          label="Salary Code"
          value={salaryApprovalDetails?.applicationInformation?.salaryCode}
        />
        <ApprovalDetails
          iconName="money"
          label="Net Payable Salary"
          value={
            salaryApprovalDetails?.applicationInformation?.netPayableSalary
          }
        />
        <ApprovalDetails
          iconName="today"
          label="Created Date"
          value={date_formater(salaryApprovalDetails?.dteCreatedAt)}
        />
        <ApprovalDetails
          iconName="today"
          label="From Date -- To Date"
          value={`${date_formater(
            salaryApprovalDetails?.applicationInformation?.fromDate,
          )} -- ${date_formater(
            salaryApprovalDetails?.applicationInformation?.toDate,
          )}`}
        />

        <ApprovalDetails
          iconName="today"
          label="Month"
          value={getMonthNameByMonthId(
            salaryApprovalDetails?.applicationInformation?.monthId,
          )}
        />
        <ApprovalDetails
          iconName="pending-actions"
          label="Waiting Stage"
          value={
            // details?.waitingStage ||
            // details?.WaitingStage ||
            salaryApprovalDetails?.applicationInformation?.waitingStage ??
            salaryApprovalDetails?.applicationInformation?.WaitingStage ??
            // details?.CurrentStage ||
            salaryApprovalDetails?.applicationInformation?.currentStage
          }
        />
        <ApprovalDetails
          iconName="pending-actions"
          label="Status"
          value={salaryApprovalDetails?.applicationInformation?.status}
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
            applicationTypeId: salaryApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: salaryApprovalDetails,
            navigation,
          })
        }
        modalText={'Are you sure to approve Salary Generate application?'}
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
            applicationTypeId: salaryApprovalDetails?.applicationTypeId,
            isMultipleApprove: false,
            singleApprovalData: salaryApprovalDetails,
            navigation,
          })
        }
        modalText={'Are you sure to reject Salary Generate application?'}
        deleteText={'Confirm'}
      />
    </ContainerNew>
  );
};

export default observer(SalaryGenerateApprovalDetails);
