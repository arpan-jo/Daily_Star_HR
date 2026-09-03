// src/interfaces/common/applicationCommon.ts

export interface ApplicationBase {
  intLoanApplicationId: number;
  intEmployeeId: number;
  intLoanTypeId: number;
  intLoanAmount: number;
  intNumberOfInstallment: number;
  intNumberOfInstallmentAmount: number;
  dteApplicationDate: string;
  intApproveLoanAmount?: number | null;
  intApproveNumberOfInstallment?: number | null;
  intApproveNumberOfInstallmentAmount?: number | null;
  numRemainingBalance?: number | null;
  dteEffectiveDate: string;
  strDescription: string;
  intFileUrlId: number;
  strReferenceNo: string;
  isActive: boolean;
  isHold: boolean;
  intReScheduleCount: number;
  intReScheduleNumberOfInstallment?: number | null;
  intReScheduleNumberOfInstallmentAmount?: number | null;
  strReScheduleRemarks?: string | null;
  dteReScheduleDateTime?: string | null;
  intCreatedBy: number;
  dteCreatedAt: string;
  intUpdatedBy?: number | null;
  dteUpdatedAt: string;
  intPipelineHeaderId: number;
  intCurrentStage: number;
  intNextStage: number;
  strStatus: string;
  isPipelineClosed: boolean;
  isReject: boolean;
  dteRejectDateTime?: string | null;
  intRejectedBy?: number | null;
}

export interface ApprovalLandingBase<T> {
  responseStatus: string;
  applicationStatus: string;
  currentSatageId: number;
  nextSatageId: number;
  isComplete: boolean;
  listData?: T[] | null;
}
