import {erpiBOSURL} from '../../../App';
import {httpRequest} from '../constant/httpRequest';

// Define the type for the audit log payload
export interface AuditLogPayload {
  auditLog?: number;
  accountId?: number;
  businessUnitId?: number;
  moduleFeatureId?: number;
  moduleFeatureName?: string;
  userId?: number;
  userName?: string;
  actionType?: string;
  oldEntity?: string;
  newEntity?: string;
  ipAddress?: string;
  isPeopledesk?: boolean;
  deviceId?: string;
  latitude?: string;
  longitude?: string;
  isApprove?: boolean;
  approveTransactionId?: number;
  approveFkid?: number;
}

export async function saveAuditLog(
  payload: AuditLogPayload,
  setIsLoading?: (loading: boolean) => void,
) {
  const api_params = {
    url: '/domain/AuditLog/AuditLogSave',
    baseURL: erpiBOSURL,
    data: payload,
    method: 'post',
  };
  return await httpRequest(api_params, setIsLoading || (() => {}));
}
