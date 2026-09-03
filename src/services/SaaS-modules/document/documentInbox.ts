import axios from 'axios';
import {DocInboxType} from '../../../interfaces/document/document';

export const getDocumentInbox = async (
  empId: number | null | undefined,
  setIsLoading?: any,
) => {
  try {
    setIsLoading(true);
    const res = await axios.get(
      `/EmployeeDocument/DocumentInbox?EmployeeId=${empId}`,
    );
    setIsLoading(false);

    const modifiedData = res?.data?.map((item: DocInboxType) => {
      return {
        ...item,
        isShow: false,
      };
    });

    return modifiedData;
  } catch (_error) {
    setIsLoading(false);
  }
};

export const createDoucumentApproval = async (
  empId: number | null | undefined,
  docId: number | null | undefined,
  autoId: number | null | undefined,
  aprvStsId: number | null | undefined,
) => {
  try {
    const res = await axios.post(
      `/EmployeeDocument/CreateDocumentApproval?EmployeeId=${empId}&DocumentId=${docId}&IntAutoId=${autoId}&ApprovalStatusId=${aprvStsId}`,
    );
    return res?.data;
  } catch (error) {
    //@ts-ignore
    return error?.response?.data;
  }
};
