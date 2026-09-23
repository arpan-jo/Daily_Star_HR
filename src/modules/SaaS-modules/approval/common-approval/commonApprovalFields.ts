import { date_formater } from '../../../../common/services/dateFormater';

// 'Asset Requisition' -> 'Asset Requisition Approval', but an API label that
// already says Approval is kept as is.
export const getApprovalHeaderTitle = (title: string) => {
  const trimmed = String(title || '').trim();
  return /approval$/i.test(trimmed) ? trimmed : `${trimmed} Approval`;
};

export interface ApprovalInfoRow {
  key: string;
  label: string;
  value: string;
  iconName: string;
}

// Fields the employee card / fixed rows already show, so they never repeat.
const SKIP_KEYS = [
  'employeeName',
  'employeeCode',
  'designation',
  'department',
  'profileUrlId',
  'status',
  'waitingStage',
  'WaitingStage',
  'currentStage',
  'applicationDate',
  'isActive',
];

const ID_KEY = /(^id$|id$|ids$|urlid$|guid$)/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}([T ].*)?$/;
const HUNGARIAN_PREFIX = /^(str|int|num|dte|dbl|flt|bol|is)(?=[A-Z])/;

// 'numIncrementAmount' -> 'Increment Amount', 'dteEffectiveDate' -> 'Effective Date'
export const prettyLabel = (key: string) => {
  const stripped = key.replace(HUNGARIAN_PREFIX, '');
  const spaced = stripped
    .replace(/_/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

export const prettyValue = (value: unknown): string | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  if (typeof value === 'object') {
    return null;
  }
  if (typeof value === 'string' && ISO_DATE.test(value)) {
    return date_formater(value);
  }
  return String(value);
};

const iconForKey = (key: string) => {
  if (/date|day|time/i.test(key)) {
    return 'today';
  }
  if (/amount|salary|price|cost|payment|balance/i.test(key)) {
    return 'money';
  }
  return 'info-outline';
};

// Turns an unknown applicationInformation payload into displayable rows, so a
// newly added approval type shows its own fields without a dedicated screen.
export const getApprovalInfoRows = (
  applicationInformation: any,
): ApprovalInfoRow[] => {
  if (!applicationInformation || typeof applicationInformation !== 'object') {
    return [];
  }
  return Object.keys(applicationInformation).reduce(
    (rows: ApprovalInfoRow[], key) => {
      if (SKIP_KEYS.includes(key) || ID_KEY.test(key)) {
        return rows;
      }
      const value = prettyValue(applicationInformation[key]);
      if (value === null) {
        return rows;
      }
      rows.push({
        key,
        label: prettyLabel(key),
        value,
        iconName: iconForKey(key),
      });
      return rows;
    },
    [],
  );
};
