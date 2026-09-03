import { lazy } from 'react';

const EmployeeDirectory = lazy(
  () => import('../modules/arl-core-modules/EmployeeDirectory'),
);
const EmployeeDirectoryNew = lazy(
  () => import('../modules/arl-core-modules/EmployeeDirectoryNew'),
);
const AttendanceLog = lazy(
  () => import('../modules/arl-core-modules/EntryPoint/home/AttendanceLog'),
);
const PDFViewer = lazy(
  () => import('../modules/arl-core-modules/EntryPoint/home/PDFViewer'),
);

const EmpManagement = lazy(
  () =>
    import(
      '../modules/arl-core-modules/hr-core/application/employee-management/EmpManagement'
    ),
);
const EmpMngAllEmp = lazy(
  () =>
    import(
      '../modules/arl-core-modules/hr-core/application/employee-management/EmpMngAllEmp'
    ),
);

const EmpMangement = lazy(
  () => import('../modules/arl-core-modules/hr-core/dashboard/EmpManagement'),
);

const AdvanceExpenseMainIndex = lazy(
  () =>
    import(
      '../modules/arl-core-modules/advance-expense-application/AdvanceExpenseMainIndex'
    ),
);

const AdvanceExpenseCreate = lazy(
  () =>
    import(
      '../modules/arl-core-modules/advance-expense-application/AdvanceExpenseCreate'
    ),
);

const DialPadWithContacts = lazy(
  () =>
    import('../modules/arl-core-modules/EntryPoint/home/DialPadWithContacts'),
);
const MillRuleApproval = lazy(
  () => import('../modules/arl-core-modules/EntryPoint/home/MillRuleApproval'),
);

const IMGViewer = lazy(
  () => import('../modules/arl-core-modules/EntryPoint/home/IMGViewer'),
);

export const arlCoreStack = [
  { name: 'EmployeeDirectory', component: EmployeeDirectory },
  { name: 'EmployeeDirectoryNew', component: EmployeeDirectoryNew },
  { name: 'AttendanceLog', component: AttendanceLog },
  { name: 'PDFViewer', component: PDFViewer },
  { name: 'EmpManagement', component: EmpManagement },
  { name: 'EmpMngAllEmp', component: EmpMngAllEmp },

  { name: 'EmpMangement', component: EmpMangement },

  { name: 'AdvanceExpenseMainIndex', component: AdvanceExpenseMainIndex },
  { name: 'AdvanceExpenseCreate', component: AdvanceExpenseCreate },
  { name: 'DialPadWithContacts', component: DialPadWithContacts },
  { name: 'MillRuleApproval', component: MillRuleApproval },

  { name: 'IMGViewer', component: IMGViewer },
];
