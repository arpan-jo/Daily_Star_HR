export interface PRRequestDDLType {
  value: number;
  label: string;
  address?: string | null;
  isPOS?: boolean | null;
}

export interface PROrgDDLType {
  value: number;
  label: string;
  address?: string | null;
  isPOS?: boolean | null;
}

export interface PlantDDLType {
  value: number;
  label: string;
  address?: string | null;
  isPOS?: boolean | null;
}

export interface WarehouseDDLType {
  value: number;
  label: string;
  address?: string | null;
  isPOS?: boolean | null;
}

export interface PRItemType {
  id: number | null;
  configId: number | null;
  value: number | null;
  label: string | null;
  itemName: string | null;
  itemCode: string | null;
  baseUomId: number | null;
  baseUomName: string | null;
  currentStockId: number | null;
  conversionUom: string | null;
  categoryName: string | null;
  subCategoryName: string | null;
  typeName: string | null;
  description: string | null;
}

export interface RfqCurrencyDDLType {
  value: number;
  label: string;
  code: string;
  address?: null;
  isPOS?: null;
}

export interface SupplierDDLType {
  value?: number;
  label?: string;
  labelValue?: string;
  supplierAddress?: string;
  supplierContact?: string;
  supplierEmail?: string;
  code?: string;
  supplierRefNo?: string;
  requestForQuotationCode?: string;
  requestForQuotationId?: number;
  partnerRfqid?: number;
}
export interface PurchaseRequestLandingDataType {
  accountId: number;
  accountName?: number;
  actionBy: number;
  approvedById?: number;
  approvedByName: string;
  approvedDateTime?: string;
  businessUnitId: number;
  businessUnitName: string;
  closedById: number;
  closedByName: string;
  closedDateTime: string;
  costCenterId?: number;
  costCenterName?: string;
  costControlingUnitId?: number;
  costControlingUnityName?: string;
  costElementId?: number;
  costElementName?: string;
  deliveryAddress?: string;
  isActive?: boolean;
  isApproved: boolean;
  isClosed: boolean;
  isComplete: boolean;
  itemCategoryId?: number;
  lastActionDateTime: string;
  plantId: number;
  plantName: string;
  purchaseOrganizationId: number;
  purchaseOrganizationName: string;
  purchaseRequestCode: string;
  purchaseRequestId: number;
  purchaseRequestTypeId: number;
  purchaseRequestTypeName: string;
  purpose: string;
  reffNo: string;
  requestDate: string;
  requiredDate?: string;
  rowList?: RowListEntity[] | null;
  sbuid: number;
  sbuname: string;
  serverDateTime: string;
  supplyingWarehouseId?: number;
  supplyingWarehouseName?: string;
  totalItems?: number;
  warehouseId: number;
  warehouseName: string;
  requestBy: string;
}
export interface RowListEntity {
  approvedQuantity: number;
  billOfMaterialId?: number;
  isActive: boolean;
  itemCategoryName: string;
  itemCode: string;
  itemDescription: string;
  itemId: number;
  itemName: string;
  itemSubCategoryName: string;
  itemTypeName: string;
  purchaseOrderId?: number;
  purchaseOrderQuantity: number;
  purchaseRequestCode?: string;
  purchaseRequestId: number;
  remarks: string;
  requestQuantity: number;
  restQuantity: number;
  rfqquantity: number;
  rowId: number;
  uoMid: number;
  uoMname: string;
}

export interface SBUType {
  organizationUnitReffId: number;
  organizationUnitReffName: string;
  businessUnitAddress: string;
  address?: string;
  image?: string | null;
  buShortName: string;
  isTredingBusiness: boolean;
  isAmountBase?: null;
  isGateMaintain?: null;
  banglaAddress?: string;
  sbuId?: number;
}
export interface PRapproveTypes {
  sl: number;
  totalRows: number;
  approvalId: number;
  purchaseOrderTypeId: null | number; // Replace 'null' with the actual type if applicable
  plantName: string;
  whName: string;
  requestBy: string;
  transectionId: number;
  transectionDate: string; // You might want to use a Date type here instead of a string
  strCode: string;
  strNarration: string;
  quantity: number;
  amount: number;
  supplyer: null | string; // Replace 'null' with the actual type if applicable
  grandTotalAmount: null | number; // Replace 'null' with the actual type if applicable
  typeName: string;
  organizationName: string;
  currencyCode: string;
}
