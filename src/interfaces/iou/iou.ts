export interface IOUApprovalLandingType {
  responseStatus: string;
  applicationStatus: string;
  currentSatageId: number;
  nextSatageId: number;
  isComplete: boolean;
  listData: IOUApprvalLandingListDataEntity[];
}
export interface IOUApprvalLandingListDataEntity {
  employeeName: string;
  department: string;
  designation: string;
  employmentType: string;
  leaveType?: null;
  dateRange?: null;
  status: string;
  application: Application;
  isActive: boolean;
}
export interface Application {
  intIouid: number;
  strIoucode: string;
  intEmployeeId: number;
  dteApplicationDate: string;
  dteFromDate: string;
  dteToDate: string;
  numIouamount: number;
  numAdjustedAmount: number;
  numPayableAmount: number;
  numReceivableAmount: number;
  numPendingAdjAmount: number;
  strDiscription: string;
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
