// src/interfaces/loan/loan.ts
import {
  ApplicationBase,
  ApprovalLandingBase,
} from '../common/applicationCommon';

export interface LoanLandingType {
  loanApplicationId: number;
  employeeId: number;
  loanTypeId: number;
  loanAmount: number;
  numberOfInstallment: number;
  numberOfInstallmentAmount: number;
  applicationDate: string;
  isApprove: number;
  approveById?: number | null;
  approveBy?: string | null;
  approveDate: string;
  approveLoanAmount: number;
  approveNumberOfInstallment: number;
  approveNumberOfInstallmentAmount: number;
  isHold: boolean;
  remainingBalance: number;
  effectiveDate: string;
  description: string;
  fileUrl: number;
  referenceNo: string;
  isActive: boolean;
  isReject: number;
  rejectBy?: number | null;
  rejectDate: string;
  insertByUserId: number;
  insertDateTime: string;
  updateByUserId?: number | null;
  updateDateTime: string;
  employeeName: string;
  reScheduleCount: number;
  reScheduleNumberOfInstallment?: number | null;
  reScheduleNumberOfInstallmentAmount?: number | null;
  reScheduleDateTime?: string | null;
  employeeCode: string;
  departmentName: string;
  designationName: string;
  loanType: string;
  Description1: string;
  intCreatedBy: number;
  paidAmount: number;
  dueInstallment: number;
  paidInstallment: number;
  applicationStatus: string;
  installmentStatus: string;
}

export interface LoanApprovalLandingType
  extends ApprovalLandingBase<LoanApprovalLandingListDataType> {}

export interface LoanApprovalLandingListDataType {
  intLoanApplicationId: number;
  intEmployeeId: number;
  strEmployeeName: string;
  intDepartmentId: number;
  strDepartment: string;
  intDesignationId: number;
  strDesignation: string;
  intLoanTypeId: number;
  strLoanType: string;
  intLoanAmount: number;
  intNumberOfInstallment: number;
  intNumberOfInstallmentAmount: number;
  isActive?: boolean;
  application: ApplicationBase;
}
