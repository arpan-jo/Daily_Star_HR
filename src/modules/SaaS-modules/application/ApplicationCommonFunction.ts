import {COLORS} from '../../../common/constant/Themes';

// Define types for better type safety
type ModuleLabel =
  | 'Directory'
  | 'Meeting'
  | 'Task'
  | 'Leave'
  | 'Movement'
  | 'Remote Attendance'
  | 'Attendance'
  | 'IOU'
  | 'Loan'
  | 'Overtime'
  | 'Location & Device'
  | 'e-Presence'
  | 'Attendance Adjustment'
  | 'Market Visit'
  | 'Location Assign'
  | 'Att. Adjust'
  | 'Expense'
  | 'Share Wifi'
  | 'Adv. Expense'
  | 'Share Card'
  | 'E Collection'
  | 'Issue'
  | 'Non-Compliance'
  | 'Grievance'
  | 'Employee Register'
  | 'Apps';

// Centralized mappings
const ICON_MAPPINGS: Record<ModuleLabel, string> = {
  Directory: 'contacts',
  Meeting: 'meeting-room',
  Task: 'add-task',
  Leave: 'luggage',
  Movement: 'directions-car',
  'Remote Attendance': 'person-pin-circle',
  Attendance: 'person-pin-circle',
  IOU: 'request-page',
  Loan: 'receipt',
  Overtime: 'schedule-send',
  'Location & Device': 'map',
  'e-Presence': 'map',
  'Attendance Adjustment': 'perm-contact-calendar',
  'Market Visit': 'business-center',
  'Location Assign': 'map',
  'Att. Adjust': 'perm-contact-calendar',
  Expense: 'receipt-long',
  'Share Wifi': 'wifi',
  'Adv. Expense': 'receipt',
  'Share Card': 'credit-card',
  'E Collection': 'payments',
  Issue: 'report-problem',
  'Non-Compliance': 'gavel',
  Grievance: 'feedback',
  'Employee Register': 'account-balance',
  Apps: 'apps',
};

const COLOR_MAPPINGS: Record<ModuleLabel, string> = {
  Directory: '#F63D68',
  Meeting: '#299647',
  Task: '#7A5AF8',
  Leave: '#D444F1',
  Movement: '#2E90FA',
  'Remote Attendance': '#F63D68',
  Attendance: '#F63D68',
  IOU: '#F79009',
  Loan: '#669F2A',
  Overtime: '#875BF7',
  'Location & Device': '#06AED4',
  'e-Presence': '#06AED4',
  'Attendance Adjustment': '#4E5BA6',
  'Market Visit': 'green',
  'Location Assign': '#06AED4',
  'Att. Adjust': '#4E5BA6',
  Expense: '#0BA5EC',
  'Share Wifi': '#0BA5EC',
  'Adv. Expense': COLORS.yellow,
  'Share Card': COLORS.yellow,
  'E Collection': COLORS.orange,
  Issue: '#D444F1',
  'Non-Compliance': '#ffaa00',
  Grievance: '#F79009',
  'Employee Register': '#3A86FF',
  Apps: '#7A5AF8',
};

// Single unified functions
export const getIconByLabel = (label?: string): string => {
  return (label && ICON_MAPPINGS[label as ModuleLabel]) || 'luggage'; // default icon
};

export const getBgColorByLabel = (label?: string): string => {
  return (label && COLOR_MAPPINGS[label as ModuleLabel]) || '#D444F1'; // default color
};

// Deprecated functions - can be removed if not used elsewhere
export const getIconByLabelOnHrCore = getIconByLabel;
export const getBgColorByLabelOnHrCore = getBgColorByLabel;
