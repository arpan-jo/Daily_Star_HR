import { lazy } from 'react';

const AllApplicationFromDash = lazy(
  () => import('../modules/SaaS-modules/application/AllApplicationFromDash'),
);
const AttendanceAdjustmentDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/attendance-adjustment/AttendanceAdjustmentDetails'),
);
const AttendanceAdjustmentMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/attendance-adjustment/AttendanceAdjustmentMainIndex'),
);
const CreateAttendanceAdjustment = lazy(
  () =>
    import('../modules/SaaS-modules/application/attendance-adjustment/CreateAttendanceAdjustment'),
);
const AddExpense = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/AddExpense'),
);
const CreateEditExpenseApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/CreateEditExpenseApplication'),
);
const EmployeeSelect = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/EmployeeSelect'),
);
const ExpenseApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/ExpenseApplicationMainIndex'),
);
const ExpenseBillDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/ExpenseBillDetails'),
);
const ExpenseDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/expense-application/ExpenseDetails'),
);
const CreateEditIOUApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/iou-application/CreateEditIOUApplication'),
);
const IOUApplicationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/iou-application/IOUApplicationDetails'),
);
const IOUApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/iou-application/IOUApplicationMain'),
);
const CreateEditLeaveApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/leave-application/CreateEditLeaveApplication'),
);
const LeaveApplicationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/leave-application/LeaveApplicationDetails'),
);
const LeaveApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/leave-application/LeaveApplicationMainIndex'),
);
const CreateEditLoanApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/loan-application/CreateEditLoanApplication'),
);
const LoanApplicationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/loan-application/LoanApplicationDetails'),
);
const LoanApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/loan-application/LoanApplicationMainIndex'),
);
const AddLocationIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-&-device/AddLocationIndex'),
);
const LocationAndDeviceMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-&-device/LocationAndDeviceMainIndex'),
);
const LocationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-&-device/LocationDetails'),
);
const CreateEditNewLocationAssign = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-assign/CreateEditNewLocationAssign'),
);
const LocationAssignMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-assign/LocationAssignMainIndex'),
);
const MarketVisitMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/market-visit/MarketVisitMainIndex'),
);
const CreateEditMovementApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/movement-application/CreateEditMovementApplication'),
);
const MovementApplicationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/movement-application/MovementApplicationDetails'),
);
const MovementApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/movement-application/MovementApplicationMainIndex'),
);
const OvertimeApplicationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/overtime-application/OvertimeApplicationDetails'),
);
const CreateEditOvertimeApplication = lazy(
  () =>
    import('../modules/SaaS-modules/application/overtime-application/CreateEditOvertimeApplication'),
);
const OvertimeApplicationMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/overtime-application/OvertimeApplicationMainIndex'),
);
const RemoteAttendanceMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/remote-attendance/RemoteAttendanceMainIndex'),
);
const ApprovalMainIndexFromSupDash = lazy(
  () => import('../modules/SaaS-modules/approval/ApprovalMainIndexFromSupDash'),
);
const AssignedLocationApprovalMain = lazy(
  () =>
    import('../modules/SaaS-modules/approval/assigned-location-approval/AssignedLocationApproval'),
);
const AssignedLocationApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/assigned-location-approval/AssignedLocationApprovalDetails'),
);
const AttendanceAdjustmentApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/attendance-adjustment-approval/AttendanceAdjustmentApprovalDetails'),
);
const AttendanceAdjustmentApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/attendance-adjustment-approval/AttendanceAdjustmentApprovalMainIndex'),
);
const ExpenseApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/expense-approval/ExpenseApprovalDetails'),
);
const ExpenseApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/expense-approval/ExpenseApprovalMainIndex'),
);
const IOUAdjustmentApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/iou-adjustment-approval/IOUAdjustmentApprovalDetails'),
);
const IOUAdjustmentApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/iou-adjustment-approval/IOUAdjustmentMainIndex'),
);
const IOUApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/iou-approval/IOUApprovalDetails'),
);
const IOUApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/iou-approval/IOUApprovalMainIndex'),
);
const LeaveNewApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/leave-approval/LeaveApprovalDetials'),
);
const LeaveApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/leave-approval/LeaveApprovalMainIndex'),
);
const LoanApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/loan-approval/LoanApprovalDetails'),
);
const LoanApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/loan-approval/LoanApprovalMainIndex'),
);
const LocationAndDeviceApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/location-device-approval/LocationAndDeviceApprovalDetails'),
);
const LocationAndDeviceApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/location-device-approval/LocatonAndDeviceApprovalMainIndex'),
);
const MarketVisitApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/market-visit-approval/MarketVisitApproval'),
);
const MarketVisitApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/market-visit-approval/MarketVisitApprovalDetails'),
);
const MovementApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/movement-approval/MovementApprovalMainIndex'),
);
const MovementNewApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/movement-approval/MovementNewApprovalDetails'),
);
const OvertimeApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/overtime-approval/OvertimeApprovalDetails'),
);
const OvertimeApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/overtime-approval/OvertimeApprovalMainIndex'),
);
const RemoteAttendanceApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/remote-attendance-approval/RemoteAttendanceApprovalDetails'),
);
const RemoteAttendanceApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/remote-attendance-approval/RemoteAttendanceApprovalMainIndex'),
);

const AttendanceDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/AttendanceDetails'),
);
const BehaviorLibrayIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Behavior-Libray/BehaviorLibrayIndex'),
);
const CoreValuesDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Behavior-Libray/CoreValuesDetails'),
);
const BusinessGoalIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/BusinessGoal/BusinessGoalIndex'),
);
const AddedCompentency = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Competency/AddedCompentency'),
);
const CompetencyCreate = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Competency/CompetencyCreate'),
);
const CompetencyEdit = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Competency/CompetencyEdit'),
);
const CompetencyIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Competency/CompetencyIndex'),
);
const CopetencyDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/Competency/CopetencyDetails'),
);
const EmployeeAddEditSkill = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/EmployeeAddEditSkill'),
);
const EmployeeAddLink = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/EmployeeAddLink'),
);
const EmpolyeeSelfDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/EmpolyeeSelfDetails'),
);
const EmpolyeeSkills = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/EmpolyeeSkills'),
);

const InternalReferenceLanding = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/internal-reference-reward/internalReferenceLanding'),
);
const MakeCustomerIR = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/internal-reference-reward/MakeCustomerIR'),
);
const JobDescriptionDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/JobDescription/JobDescriptionDetails'),
);
const JobDescriptionIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/JobDescription/JobDescriptionIndex'),
);
const JobDescriptitonMatrix = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/JobDescription/JobDescriptionMatrix'),
);
const ReportJobDescription = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/JobDescription/ReportJobDescription'),
);

const MyTaskDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/MyTasks/MyTaskDetails'),
);
const MyTasksIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/MyTasks/MyTasksIndex'),
);
const PolicyBusinessTaskIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/MyTasks/PolicyBusinessTaskIndex'),
);
const SopBusinessTaskIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/MyTasks/SopBusinessTaskIndex'),
);
const WorkflowBusinessTaskIndex = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/MyTasks/WorkflowBusinessTaskIndex'),
);
const NoticeDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/NoticeDetails'),
);

const PayslipDetails = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/employeeDashboard/PayslipDetails'),
);

const EmployeeSalary = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/managerDashboard/EmployeeSalary'),
);
const AllEmloyeeSupervisor = lazy(
  () =>
    import('../modules/SaaS-modules/dashboard/supervisorDashboard/AllEmloyeeSupervisor'),
);
const DocRouteCreate = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/doc-routing/docRouteCreate'),
);
const DocRouteDetails = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/doc-routing/docRouteDetails'),
);
const DocDetails = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/docApplication/docDetails'),
);
const DocUpload = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/docApplication/docUpload'),
);
const DocUploadFile = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/docApplication/docUploadFile'),
);
const SendOrApproval = lazy(
  () =>
    import('../modules/SaaS-modules/document-management/docApplication/sendOrApproval'),
);
const EmployeeDirectoryDetails = lazy(
  () =>
    import('../modules/SaaS-modules/employee-directory/EmployeeDirectoryDetails'),
);
const EmployeeDirectoryFromHome = lazy(
  () =>
    import('../modules/SaaS-modules/employee-directory/EmployeeDirectoryFromHome'),
);
const SendMsgToEmployee = lazy(
  () => import('../modules/SaaS-modules/employee-directory/SendMsgToEmployee'),
);
const AllEmployeeDetails = lazy(
  () => import('../modules/SaaS-modules/employeeManagement/AllEmployeeDetails'),
);
const NotificationIndex = lazy(
  () => import('../modules/SaaS-modules/notification/notification'),
);
const IncrementApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/increment-approval/IncrementApprovalMainIndex'),
);
const IncrementApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/increment-approval/IncrementApprovalDetails'),
);
const CommonApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/common-approval/CommonApprovalMainIndex'),
);
const CommonApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/common-approval/CommonApprovalDetails'),
);
const SalaryGenerateApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/salary-generate-approval/SalaryGenerateApprovalMainIndex'),
);
const SalaryGenerateApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/salary-generate-approval/SalaryGenerateApprovalDetails'),
);
const AdvanceExpenseApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/advance-expenxe-approval/AdvanceExpApprovalMainIndex'),
);
const AdvanceExpenseApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/advance-expenxe-approval/AdvanceExpenseApprovalDetails'),
);
const IssueMainIndex = lazy(
  () => import('../modules/SaaS-modules/application/issue/IssueMainIndex'),
);
const IssueCreate = lazy(
  () => import('../modules/SaaS-modules/application/issue/IssueCreate'),
);
const IssueDetails = lazy(
  () => import('../modules/SaaS-modules/application/issue/IssueDetails'),
);
const CreateEditForCommon = lazy(
  () =>
    import('../modules/SaaS-modules/application/leave-application/CreateEditForCommon'),
);
const BomApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/bom-approval/BomApprovalMainIndex'),
);
const LcCostSheetApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/lc-costsheet-approval/LcCostSheetApprovalMainIndex'),
);
const LcShipmentView = lazy(
  () =>
    import('../modules/SaaS-modules/approval/lc-costsheet-approval/LcShipmentView'),
);
const InventoryLoanApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/inventory-loan-approval/InventoryLoanApprovalMainIndex'),
);
const FundRequestApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/fund-request-approval/FundRequestApprovalMainIndex'),
);
const GrievanceMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/Grievance/GrievanceMainIndex'),
);
const GrievanceCreate = lazy(
  () => import('../modules/SaaS-modules/application/Grievance/GrievanceCreate'),
);
const InventoryAdjustApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/inventory-adjust-approval/InventoryAdjustApprovalMainIndex'),
);
const InventoryAdjustApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/inventory-adjust-approval/InventoryAdjustApprovalDetails'),
);
const PartnerApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/partner-approval/PartnerApprovalMainIndex'),
);

const CustomerPreAssesmentApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/customer-pre-assesment-approval/CustomerPreAssesmentApprovalMainIndex'),
);
const CustomerPreAssessmentApprovalDetails = lazy(
  () =>
    import('../modules/SaaS-modules/approval/customer-pre-assesment-approval/CustomerPreAssesmentApprovalDetails'),
);
const SalesForceAssesmentApprovalMainIndex = lazy(
  () =>
    import('../modules/SaaS-modules/approval/sales-force-assesment-approval/SalesForceAssesmentApprovalMainIndex'),
);

const FaceRegistrationIndex = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-&-device/FaceRegistratioIndex'),
);
const RegLocationDetails = lazy(
  () =>
    import('../modules/SaaS-modules/application/location-&-device/LocationDetails'),
);

export const saasModuleStack = [
  { name: 'AllApplicationFromDash', component: AllApplicationFromDash },

  {
    name: 'AttendanceAdjustmentDetails',
    component: AttendanceAdjustmentDetails,
  },
  {
    name: 'AttendanceAdjustmentMainIndex',
    component: AttendanceAdjustmentMainIndex,
  },
  { name: 'CreateAttendanceAdjustment', component: CreateAttendanceAdjustment },
  { name: 'AddExpense', component: AddExpense },
  {
    name: 'CreateEditExpenseApplication',
    component: CreateEditExpenseApplication,
  },
  { name: 'EmployeeSelect', component: EmployeeSelect },
  {
    name: 'ExpenseApplicationMainIndex',
    component: ExpenseApplicationMainIndex,
  },
  { name: 'ExpenseBillDetails', component: ExpenseBillDetails },
  { name: 'ExpenseDetails', component: ExpenseDetails },
  { name: 'CreateEditIOUApplication', component: CreateEditIOUApplication },
  { name: 'IOUApplicationDetails', component: IOUApplicationDetails },
  { name: 'IOUApplicationMainIndex', component: IOUApplicationMainIndex },
  { name: 'CreateEditLeaveApplication', component: CreateEditLeaveApplication },
  { name: 'LeaveApplicationDetails', component: LeaveApplicationDetails },
  { name: 'LeaveApplicationMainIndex', component: LeaveApplicationMainIndex },
  { name: 'CreateEditLoanApplication', component: CreateEditLoanApplication },
  { name: 'LoanApplicationDetails', component: LoanApplicationDetails },
  { name: 'LoanApplicationMainIndex', component: LoanApplicationMainIndex },
  { name: 'AddLocationIndex', component: AddLocationIndex },
  { name: 'LocationAndDeviceMainIndex', component: LocationAndDeviceMainIndex },
  { name: 'LocationDetails', component: LocationDetails },
  {
    name: 'CreateEditNewLocationAssign',
    component: CreateEditNewLocationAssign,
  },
  { name: 'LocationAssignMainIndex', component: LocationAssignMainIndex },
  { name: 'MarketVisitMainIndex', component: MarketVisitMainIndex },
  {
    name: 'CreateEditMovementApplication',
    component: CreateEditMovementApplication,
  },
  { name: 'MovementApplicationDetails', component: MovementApplicationDetails },
  {
    name: 'MovementApplicationMainIndex',
    component: MovementApplicationMainIndex,
  },
  { name: 'OvertimeApplicationDetails', component: OvertimeApplicationDetails },
  {
    name: 'CreateEditOvertimeApplication',
    component: CreateEditOvertimeApplication,
  },
  {
    name: 'OvertimeApplicationMainIndex',
    component: OvertimeApplicationMainIndex,
  },
  { name: 'RemoteAttendanceMainIndex', component: RemoteAttendanceMainIndex },
  {
    name: 'ApprovalMainIndexFromSupDash',
    component: ApprovalMainIndexFromSupDash,
  },
  {
    name: 'AssignedLocationApprovalMain',
    component: AssignedLocationApprovalMain,
  },
  {
    name: 'AssignedLocationApprovalDetails',
    component: AssignedLocationApprovalDetails,
  },
  {
    name: 'AttendanceAdjustmentApprovalDetails',
    component: AttendanceAdjustmentApprovalDetails,
  },
  {
    name: 'AttendanceAdjustmentApprovalMainIndex',
    component: AttendanceAdjustmentApprovalMainIndex,
  },
  { name: 'ExpenseApprovalDetails', component: ExpenseApprovalDetails },
  { name: 'ExpenseApprovalMainIndex', component: ExpenseApprovalMainIndex },
  {
    name: 'IOUAdjustmentApprovalDetails',
    component: IOUAdjustmentApprovalDetails,
  },
  {
    name: 'IOUAdjustmentApprovalMainIndex',
    component: IOUAdjustmentApprovalMainIndex,
  },
  { name: 'IOUApprovalDetails', component: IOUApprovalDetails },
  { name: 'IOUApprovalMainIndex', component: IOUApprovalMainIndex },
  { name: 'LeaveNewApprovalDetails', component: LeaveNewApprovalDetails },
  { name: 'LeaveApprovalMainIndex', component: LeaveApprovalMainIndex },
  { name: 'LoanApprovalDetails', component: LoanApprovalDetails },
  { name: 'LoanApprovalMainIndex', component: LoanApprovalMainIndex },
  {
    name: 'LocationAndDeviceApprovalDetails',
    component: LocationAndDeviceApprovalDetails,
  },
  {
    name: 'LocationAndDeviceApprovalMainIndex',
    component: LocationAndDeviceApprovalMainIndex,
  },
  {
    name: 'MarketVisitApprovalMainIndex',
    component: MarketVisitApprovalMainIndex,
  },
  { name: 'MarketVisitApprovalDetails', component: MarketVisitApprovalDetails },
  { name: 'MovementApprovalMainIndex', component: MovementApprovalMainIndex },
  { name: 'MovementNewApprovalDetails', component: MovementNewApprovalDetails },
  { name: 'OvertimeApprovalDetails', component: OvertimeApprovalDetails },
  { name: 'OvertimeApprovalMainIndex', component: OvertimeApprovalMainIndex },
  {
    name: 'RemoteAttendanceApprovalDetails',
    component: RemoteAttendanceApprovalDetails,
  },
  {
    name: 'RemoteAttendanceApprovalMainIndex',
    component: RemoteAttendanceApprovalMainIndex,
  },

  { name: 'AttendanceDetails', component: AttendanceDetails },
  { name: 'BehaviorLibrayIndex', component: BehaviorLibrayIndex },
  { name: 'CoreValuesDetails', component: CoreValuesDetails },
  { name: 'BusinessGoalIndex', component: BusinessGoalIndex },
  { name: 'AddedCompentency', component: AddedCompentency },
  { name: 'CompetencyCreate', component: CompetencyCreate },
  { name: 'CompetencyEdit', component: CompetencyEdit },
  { name: 'CompetencyIndex', component: CompetencyIndex },
  { name: 'CopetencyDetails', component: CopetencyDetails },
  { name: 'EmployeeAddEditSkill', component: EmployeeAddEditSkill },
  { name: 'EmployeeAddLink', component: EmployeeAddLink },
  { name: 'EmpolyeeSelfDetails', component: EmpolyeeSelfDetails },
  { name: 'EmpolyeeSkills', component: EmpolyeeSkills },
  { name: 'InternalReferenceLanding', component: InternalReferenceLanding },
  { name: 'MakeCustomerIR', component: MakeCustomerIR },
  { name: 'JobDescriptionDetails', component: JobDescriptionDetails },
  { name: 'JobDescriptionIndex', component: JobDescriptionIndex },
  { name: 'JobDescriptitonMatrix', component: JobDescriptitonMatrix },
  { name: 'ReportJobDescription', component: ReportJobDescription },

  { name: 'MyTaskDetails', component: MyTaskDetails },
  { name: 'MyTasksIndex', component: MyTasksIndex },
  { name: 'SopBusinessTaskIndex', component: SopBusinessTaskIndex },
  { name: 'PolicyBusinessTaskIndex', component: PolicyBusinessTaskIndex },
  { name: 'WorkflowBusinessTaskIndex', component: WorkflowBusinessTaskIndex },
  { name: 'NoticeDetails', component: NoticeDetails },
  { name: 'PayslipDetails', component: PayslipDetails },

  { name: 'PerformanceEntry', component: PerformanceEntry },
  { name: 'EmployeeSalary', component: EmployeeSalary },
  { name: 'AllEmloyeeSupervisor', component: AllEmloyeeSupervisor },
  { name: 'DocRouteCreate', component: DocRouteCreate },
  { name: 'DocRouteDetails', component: DocRouteDetails },
  { name: 'DocDetails', component: DocDetails },
  { name: 'DocUpload', component: DocUpload },
  { name: 'DocUploadFile', component: DocUploadFile },
  { name: 'SendOrApproval', component: SendOrApproval },
  { name: 'EmployeeDirectoryDetails', component: EmployeeDirectoryDetails },
  { name: 'EmployeeDirectoryFromHome', component: EmployeeDirectoryFromHome },
  { name: 'SendMsgToEmployee', component: SendMsgToEmployee },
  { name: 'AllEmployeeDetails', component: AllEmployeeDetails },
  { name: 'NotificationIndex', component: NotificationIndex },
  { name: 'IncrementApprovalMainIndex', component: IncrementApprovalMainIndex },
  { name: 'IncrementApprovalDetails', component: IncrementApprovalDetails },
  { name: 'CommonApprovalMainIndex', component: CommonApprovalMainIndex },
  { name: 'CommonApprovalDetails', component: CommonApprovalDetails },
  {
    name: 'SalaryGenerateApprovalMainIndex',
    component: SalaryGenerateApprovalMainIndex,
  },
  {
    name: 'SalaryGenerateApprovalDetails',
    component: SalaryGenerateApprovalDetails,
  },
  {
    name: 'AdvanceExpenseApprovalMainIndex',
    component: AdvanceExpenseApprovalMainIndex,
  },
  {
    name: 'AdvanceExpenseApprovalDetails',
    component: AdvanceExpenseApprovalDetails,
  },
  { name: 'IssueMainIndex', component: IssueMainIndex },
  { name: 'IssueCreate', component: IssueCreate },
  { name: 'IssueDetails', component: IssueDetails },
  { name: 'CreateEditForCommon', component: CreateEditForCommon },
  { name: 'BomApprovalMainIndex', component: BomApprovalMainIndex },
  {
    name: 'LcCostSheetApprovalMainIndex',
    component: LcCostSheetApprovalMainIndex,
  },
  { name: 'LcShipmentView', component: LcShipmentView },
  {
    name: 'InventoryLoanApprovalMainIndex',
    component: InventoryLoanApprovalMainIndex,
  },
  {
    name: 'FundRequestApprovalMainIndex',
    component: FundRequestApprovalMainIndex,
  },
  { name: 'GrievanceMainIndex', component: GrievanceMainIndex },
  { name: 'GrievanceCreate', component: GrievanceCreate },
  {
    name: 'InventoryAdjustApprovalMainIndex',
    component: InventoryAdjustApprovalMainIndex,
  },
  {
    name: 'InventoryAdjustApprovalDetails',
    component: InventoryAdjustApprovalDetails,
  },
  { name: 'PartnerApprovalMainIndex', component: PartnerApprovalMainIndex },

  {
    name: 'CustomerPreAssesmentApprovalMainIndex',
    component: CustomerPreAssesmentApprovalMainIndex,
  },
  {
    name: 'CustomerPreAssessmentApprovalDetails',
    component: CustomerPreAssessmentApprovalDetails,
  },
  {
    name: 'SalesForceAssesmentApprovalMainIndex',
    component: SalesForceAssesmentApprovalMainIndex,
  },
  {
    name: 'FaceRegistrationIndex',
    component: FaceRegistrationIndex,
  },
  {
    name: 'RegLocationDetails',
    component: RegLocationDetails,
  },
];
