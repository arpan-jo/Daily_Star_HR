export interface AllNotificationDetailsType {
  id: number;
  notifyTitle: string;
  notifyDetails: string;
  moduleId: number;
  module: string;
  feature: string;
  isCommon?: null;
  receiver: string;
  isSeen: boolean;
  createdBy: string;
  createdAt: string;
  isDelete?: null;
  timeDifference: string;
  notificationMaster: NotificationMaster;
}
export interface NotificationMaster {
  intId: number;
  intOrgId: number;
  strNotifyTitle: string;
  strNotifyDetails: string;
  intModuleId: number;
  strModule: string;
  strFeature: string;
  intFeatureTableAutoId: number;
  intEmployeeId: number;
  strLoginId: string;
  isCommon: boolean;
  strReceiver: string;
  isSeen: boolean;
  strCreatedBy: string;
  dteCreatedAt: string;
  isDelete: boolean;
}
