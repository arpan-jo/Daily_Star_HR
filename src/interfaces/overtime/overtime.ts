// src/interfaces/overtime/overtime.ts
import {
  ApplicationBase,
  ApprovalLandingBase,
} from '../common/applicationCommon';

export interface OvertimeApprovalLandingType
  extends ApprovalLandingBase<ListDataEntity> {}

export interface ListDataEntity {
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
  application: ApplicationBase;
}

export interface OvertimeApplicationLandingType {
  OvertimeId: number;
  EmployeeId: number;
  EmployeeName: string;
  EmployeeCode: string;
  WorkplaceId: number;
  OvertimeDate: string;
  StartTime?: string | null;
  EndTime?: string | null;
  OvertimeHour: number;
  Reason: string;
  isActive: boolean;
  InsertUserId: number;
  InsertDateTime: string;
  DepartmentName: string;
  DesignationName: string;
  SupervisorName: string;
  WorkplaceName: string;
  WorkplaceGroupName: string;
  strEmployeeStatus: string;
  strProfileImageUrl?: string | null;
  EmploymentTypeName: string;
  EmploymentTypeId: number;
  BasicSalary?: number | null;
  GrossSalary?: number | null;
  PerHourAmount: number;
  DayAmount: number;
  WorkplaceGroupId?: number | null;
  BusinessUnitId: number;
  ApprovalStatus: string;
}
