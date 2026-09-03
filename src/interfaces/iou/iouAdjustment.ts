export interface IOUAdjustmentApprovalDataType {
  responseStatus: string;
  applicationStatus: string;
  currentSatageId: number;
  nextSatageId: number;
  isComplete: boolean;
  listData?: IOUAdjustmentApprovalListDataType[] | null;
}
export interface IOUAdjustmentApprovalListDataType {
  intEmployeeId: number;
  strEmployeeName: string;
  numPayableAmount: number;
  numReceivableAmount: number;
  numAdjustmentAmount: number;
  isAcknowledgement: boolean;
  status: string;
  department: string;
  designation: string;
  employmentType: string;
  dteFromDate: string;
  dteToDate: string;
  iouAmount: number;
  description: string;
  imgUrlId: number;
  isActive: boolean;
  application: Application;
}
export interface Application {
  intIouadjustmentId: number;
  intIouid: number;
  intEmployeeId: number;
  numPayableAmount: number;
  numReceivableAmount: number;
  isAcknowledgement: boolean;
  isActive: boolean;
  intCreatedBy: number;
  dteCreatedAt: string;
  intUpdatedBy?: null;
  dteUpdatedAt: string;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: null;
  intRejectedBy?: null;
}
