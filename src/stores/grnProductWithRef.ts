import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

const reference = types.model({
  value: types.maybeNull(types?.number),
  label: types.maybeNull(types?.string),
  inventoryTransactionId: types.maybeNull(types?.number),
  inventoryTransactionCode: types.maybeNull(types?.string),
  address: types.maybeNull(types?.string),
  amount: types.maybeNull(types?.number),
  supplierId: types.maybeNull(types?.number),
  purchaseOrganizationId: types.maybeNull(types?.number),
  purchaseOrganizationName: types.maybeNull(types?.string),
  actionBy: types.maybeNull(types?.number),
  actionName: types.maybeNull(types?.string),
  supplierName: types.maybeNull(types?.string),
  fromPlantId: types.maybeNull(types?.number),
  fromPlantName: types.maybeNull(types?.string),
  fromWearHouseId: types.maybeNull(types?.number),
  fromWearHouseName: types.maybeNull(types?.string),
  grossDiscount: types.maybeNull(types?.number),
  freight: types.maybeNull(types?.number),
  commission: types.maybeNull(types?.number),
  productCost: types.maybeNull(types?.number),
  othersCharge: types.maybeNull(types?.number),
  refTypeId: types.maybeNull(types?.number),
  crrencyCode: types.maybeNull(types?.string),
  vatAmount: types.maybeNull(types?.number),
  isDeliveryCreated: types.maybeNull(types?.boolean),
});

const itemLocation = types.model({
  value: types.maybeNull(types?.number),
  label: types.maybeNull(types?.string),
  binNumber: types.maybeNull(types?.string),
  currentStock: types.maybeNull(types?.number),
  referenceId: types.maybeNull(types?.number),
});

const locationddl = types.model({
  value: types.maybeNull(types?.number),
  label: types.maybeNull(types?.string),
  binNumber: types.maybeNull(types?.string),
  currentStock: types.maybeNull(types?.number),
  referenceId: types.maybeNull(types?.number),
});

export const GRNProductWithRefModel = types.model('gRNProductWithRef', {
  id: types.identifier,
  strItemCode: types.maybeNull(types?.string),
  numOrderQty: types.maybeNull(types?.number),
  numBasePrice: types.maybeNull(types?.number),
  numTotalValue: types.maybeNull(types?.number),
  strPurchaseDescription: types.maybeNull(types?.string),
  strItemDescription: types.maybeNull(types?.string),
  numDiscount: types.maybeNull(types?.number),
  numReceiveQty: types.maybeNull(types?.number),
  numVatAmount: types.maybeNull(types?.number),
  numRestQty: types.maybeNull(types?.number),
  strUoMName: types.maybeNull(types?.string),
  intUoMId: types.maybeNull(types?.number),
  strHSCode: types.maybeNull(types?.string),
  numIssueQty: types.maybeNull(types?.number),
  numReturnQty: types.maybeNull(types?.number),
  intReferenceId: types.maybeNull(types?.number),
  profitCenterId: types.maybeNull(types?.number),
  profitCenterName: types.maybeNull(types?.string),
  costRevenueId: types.maybeNull(types?.number),
  costRevenueName: types.maybeNull(types?.string),
  elementId: types.maybeNull(types?.number),
  elementName: types.maybeNull(types?.string),
  intItemId: types.maybeNull(types?.number),
  strItemName: types.maybeNull(types?.string),
  locationddl: types.array(locationddl),
  value: types.maybeNull(types?.string),
  label: types.maybeNull(types?.string),
  itemQty: types.maybeNull(types?.number),
  itemLocation: types.optional(itemLocation, {}),
  reference: types.optional(reference, {}),
  netValue: types.maybeNull(types?.number),
  itemTypeName: types.maybeNull(types?.string),
  itemSubCategoryName: types.maybeNull(types?.string),
  itemCategoryName: types.maybeNull(types?.string),
});

export type GRNProductWithRefModelType = SnapshotOrInstance<
  typeof GRNProductWithRefModel
>;
export type GRNProductWithRefType = Instance<typeof GRNProductWithRefModel>;
