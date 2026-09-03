import {useState} from 'react';
import DeviceInfo from 'react-native-device-info';
import {NetworkInfo} from 'react-native-network-info';
import {useRootStore} from '../../stores/rootStore';
import {SaveAuditLog} from '../api/api';
import {httpRequest} from '../constant/httpRequest';
import {AuditLogPayload} from '../services/auditLogSave';
import Geolocation from 'react-native-geolocation-service';

type ActionType = 'Create' | 'Edit' | 'Delete' | 'Approve' | 'Reject';

interface ISaveLogAction {
  payload: {
    newEntity: any;
    actionType?: ActionType;
    oldEntity?: any;
    isPeopledesk?: any;
  };
  auditLogCB?: (response: any) => void;
}

function useAuditLogSave() {
  const {userInfo, sbu} = useRootStore();

  const [logSaveRes, setLogSaveRes] = useState<any>(null);
  const [logSaveError, setLogSaveError] = useState<any>(null);
  const [logSaveLoading, setLogSaveLoading] = useState<boolean>(false);

  const saveLogAction = async ({payload, auditLogCB}: ISaveLogAction) => {
    setLogSaveLoading(true);
    setLogSaveError(null);
    setLogSaveRes(null);
    try {
      // Get device ID
      const deviceId = await DeviceInfo.getUniqueId();
      // Get IP address
      const ipAddress = await NetworkInfo.getIPAddress();

      // Get current location (wrapped in a Promise for async/await)
      const getCurrentLocation = () =>
        new Promise<{latitude: string; longitude: string}>(resolve => {
          Geolocation.getCurrentPosition(
            (position: any) => {
              resolve({
                latitude: String(position?.coords?.latitude ?? '0'),
                longitude: String(position?.coords?.longitude ?? '0'),
              });
            },
            (error: any) => {
              console.log('Geolocation error:', error);
              resolve({latitude: '0', longitude: '0'});
            },
            {
              accuracy: {
                android: 'high',
                ios: 'best',
              },
              enableHighAccuracy: true,
            },
          );
        });

      const {latitude, longitude} = await getCurrentLocation();

      const modifypayload: AuditLogPayload = {
        auditLog: 0,
        actionType: payload?.actionType || 'Create',
        oldEntity: JSON.stringify(payload?.oldEntity || {}),
        newEntity: JSON.stringify(payload?.newEntity || {}),
        ipAddress: ipAddress || '',
        accountId: userInfo?.intAccountId || 0,
        businessUnitId: sbu?.businessUnitId || 0,
        moduleFeatureId: 0,
        moduleFeatureName: '',
        userId: userInfo?.intErpUserId || 0,
        userName: userInfo?.strDisplayName || '',
        isPeopledesk: payload?.isPeopledesk,
        latitude: latitude || '',
        longitude: longitude || '',
        deviceId: deviceId || '',
        isApprove: payload?.actionType === 'Approve',
        approveTransactionId: 0,
        approveFkid: 0,
      };
      const api_params = {
        url: SaveAuditLog,
        data: modifypayload,
        method: 'post',
        isConsole: true,
        isConsoleParams: true,
      };
      const res = await httpRequest(api_params, setLogSaveLoading);
      setLogSaveRes(res);
      if (auditLogCB) auditLogCB(res);
    } catch (error) {
      setLogSaveError(error);
    } finally {
      setLogSaveLoading(false);
    }
  };

  return {
    logSaveRes,
    logSaveError,
    logSaveLoading,
    saveLogAction,
  };
}

export default useAuditLogSave;
