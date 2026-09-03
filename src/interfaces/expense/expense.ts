export interface ExpenseDetailsType {
  objHeader: ExpenseObjHeader;
  objRow?: ExpenseObjRowEntity[] | null;
}
export interface ExpenseObjHeader {
  expenseId: number;
  expenseCode: string;
  accountId: number;
  businessUnitId: number;
  businessUnitName: string;
  sbuid: number;
  sbuname: string;
  countryId: number;
  plantId: number;
  countryName: string;
  currencyId: number;
  internalAccountId: number;
  currencyName: string;
  expenseForId: number;
  advExpCategoryId: number;
  advExpCategoryName?: null;
  fromDate: string;
  toDate: string;
  projectId: number;
  projectName: string;
  costCenterId: number;
  costCenterName: string;
  instrumentId: number;
  instrumentName: string;
  disbursementCenterId: number;
  disbursementCenterName: string;
  vehicleId: string;
  totalAmount: number;
  comments: string;
  totalApprovedAmount: number;
  actionBy: number;
  expenseGroup: string;
  isSupervisorApproved: boolean;
  isLineManagerApproved: boolean;
  expenseForNameDesg: string;
  supervisorNameDesg: string;
  lineManagerNameDesg: string;
  supervisorImageId: string | number;
  lineManagerImageId: string | number;
  expenseForEmployeeId: string | number;
  actionByEmployeeId: string | number;
  expenseForImageId: string | number;
  expenseForDesignation: string | number;
}
export interface ExpenseObjRowEntity {
  expenseRowId: number;
  expenseDate: string;
  businessTransactionId: number;
  businessTransactionName: string;
  quantity: number;
  rate: number;
  amount: number;
  supervisorAmount: number;
  linemanagerAmount: number;
  expenseLocation: string;
  comments: string;
  attachmentLink: string;
  actionBy: number;
  driverId: number;
  driverName: string;
  costCenterId: number;
  costCenterName: string;
  profitCenterId: number;
  profitCenterName: string;
  costElementId: number;
  costElementName: string;
}
export interface AdvanceApproval {
  advanceId: number;
  advanceCode: string;
  accountId: number;
  businessUnitId: number;
  businessUnitName: string;
  sbuid: number;
  sbuname: string;
  currencyId: number;
  currencyName: string;
  employeeId: number;
  requestDate: string; // ISO date string (e.g., "2025-05-21")
  dueDate: string; // ISO date string (e.g., "2025-05-22")
  instrumentId: number;
  instrumentName: string;
  disbursementCenterId: number;
  disbursementCenterName: string;
  numRequestedAmount: number;
  comments: string;
  actionBy: number;
  willApproved: boolean;
  plantId: number;
  expenseGroup: string;
  costCenterid: number;
  costElementid: number;
  profitCenterid: number;
  costCenterName: string;
  costElementName: string;
  profitCenterName: string;
  businessTransactionName: string;
  subGlaccountHeadId: number;
  strSubGlaccountHead: string;
  requestedAmount: any;
  employeeName: string;
}
