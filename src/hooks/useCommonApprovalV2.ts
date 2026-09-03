import {commonURL} from '../../App';
import {ApproveApplications} from '../common/api/api';
import {httpRequest} from '../common/constant/httpRequest';
import {ApprovalActionParams} from '../interfaces/approval/approval';

export const handleApprovalAction = async ({
  isTrueSingleClick = [],
  userInfo,
  actionType,
  method = 'post',
  toaster,
  allDeactive,
  applicationTypeId,
  isMultipleApprove = false,
  singleApprovalData,
  navigation,
}: ApprovalActionParams) => {
  if (isMultipleApprove) {
    if (!isTrueSingleClick?.length) return;
  }
  const multipleApprovalPayload = isTrueSingleClick.map((item: any) => ({
    configHeaderId: item?.configHeaderId,
    approvalTransactionId: item?.id,
    applicationId: item?.applicationInformation?.applicationId,
    approverEmployeeId: userInfo?.intEmployeeId,
    isApprove: actionType === 'approve',
    isReject: actionType === 'reject',
    actionBy: userInfo?.intEmployeeId,
    applicationTypeId: applicationTypeId,
  }));
  const singleApprovalPayload = [
    {
      configHeaderId: singleApprovalData?.configHeaderId,
      approvalTransactionId: singleApprovalData?.id,
      applicationId:
        singleApprovalData?.notificationMaster?.intFeatureTableAutoId ??
        singleApprovalData?.applicationId,
      isApprove: actionType === 'approve',
      isReject: actionType === 'reject',
      actionBy: userInfo?.intEmployeeId,
      applicationTypeId: singleApprovalData?.applicationTypeId,
    },
  ];
  const api_params = {
    url: commonURL === userInfo?.strUrl ? ApproveApplications : '',
    data: isMultipleApprove ? multipleApprovalPayload : singleApprovalPayload,
    method,
    isConsole: true,
    isEncrypted: true,
  };

  try {
    const res = await httpRequest(api_params, () => {});
    const resMessage = res?.message || res?.data || res?.data?.message;

    toaster.show({
      message: resMessage,
      type: resMessage?.toLowerCase().includes('fail') ? 'error' : 'success',
    });
    if (!isMultipleApprove) {
      navigation?.goBack();
    }
    if (allDeactive) {
      allDeactive();
    }
  } catch (err) {
    console.log('error=>>', err);
    toaster.show({
      message: 'Something went wrong.',
      type: 'error',
    });
  }
};
