export interface ApprovalMenuType {
  intMenuId: number;
  pipelineCode: string;
  intMenuLabelId: number;
  intParentMenuId: number;
  strMenuName: string;
  strMenuNameWeb: string;
  strMenuNameApps: string;
  strTo: string;
  strToForApps?: null;
  strIcon?: null;
  strIconForApps?: null;
  intMenuSerial: number;
  intMenuSerialForApps?: null;
  isExpandable: boolean;
  isForCommon: boolean;
  isMenuForView: boolean;
  isActive: boolean;
  isForApps: boolean;
  isForWeb: boolean;
  isHasApproval: boolean;
  icon?: string;
  count?: number;
  menuName: string;
  totalCount: number;
  applicationTypeId: number;
  applicationType: number;
  pendingApprovalCount: number;
}

export interface ApprovalCountType {
  leaveCount: number;
  movementCount: number;
  remoteAttendanceCount: number;
  salaryAdditionNDeductionCount: number;
  iouCount: number;
  loanCount: number;
  salaryCount: number;
  overtimeCount: number;
  iouAdjustmentCount: number;
  manualAttendanceCount: number;
}

export interface ApprovalActionParams {
  isTrueSingleClick?: any[];
  userInfo: any;
  actionType: 'approve' | 'reject';
  method?: 'post' | 'put' | 'patch';
  toaster: any;
  allDeactive?: () => any;
  applicationTypeId: any;
  isMultipleApprove: any;
  singleApprovalData?: any;
  navigation?: any;
}
