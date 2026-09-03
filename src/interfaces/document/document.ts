export interface DocCategoryDDLType {
  value: number;
  label: string;
}
export interface ImageFileType {
  id: string;
  fileName: string;
}

export interface AllDocumentLandingType {
  intDocumentId: number;
  strDocumentTitle: string;
  intDocCategoryId: number;
  strDocCategoryName: string;
  intOwnerId: number;
  strOwnerName: string;
  strFileUrl: string;
  strFileName: string;
  strInsertBy: string;
  strApprovalStatus: string;
  isActive: boolean;
  insertDate: string;
  isShow: boolean;
}

export interface DocInboxType {
  intDocumentId: number;
  strDocumentTitle: string;
  intDocCategoryId: number;
  strDocCategoryName: string;
  intOwnerId: number;
  strOwnerName: string;
  strFileUrl: string;
  strFileName: string;
  intAutoId: number;
  strApprovalStatus: string;
  intSenderId: number;
  strSenderName: string;
  intReceiverId: number;
  strReceiverName: string;
  strNote?: null;
  isForApproval: boolean;
  dteSharedDate: string;
  isShow: boolean;
}
