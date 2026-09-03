import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

const attachmentList = types.model({
  id: types.maybeNull(types?.number),
  attachmentId: types.maybeNull(types?.string),
});

export const SupplierModel = types.model('Supplier', {
  id: types.identifier,
  businessPartnerId: types.maybeNull(types?.number),
  businessPartnerName: types.maybeNull(types?.string),
  businessPartnerCode: types.maybeNull(types?.string),
  businessPartnerAddress: types.maybeNull(types?.string),
  email: types.maybeNull(types?.string),
  contactNumber: types.maybeNull(types?.string),
  rank: types.maybeNull(types?.number),
  totalAmount: types.maybeNull(types?.number),
  isQuotationReceived: types.maybeNull(types?.boolean),
  isSelected: types.maybeNull(types?.boolean),
  placeNoForCs: types.maybeNull(types?.number),
  //added later
  partnerRfqId: types.maybeNull(types?.number),
  rowId: types.maybeNull(types?.number),
  quantity: types.maybeNull(types?.number),
  takenQuantity: types.maybeNull(types?.number),
  supplierRate: types.maybeNull(types?.number),
  rfqId: types.maybeNull(types?.number),
  termsAndConditions: types.maybeNull(types?.string),
  currencyCode: types.maybeNull(types?.string),
  modeOfShipment: types.maybeNull(types?.string),
  edtDate: types.maybeNull(types?.string),
  laycanOrEtaDate: types.maybeNull(types?.string),
  description: types.maybeNull(types?.string),
  incotermsId: types.maybeNull(types?.number),
  incotermsName: types.maybeNull(types?.string),
  attachmentList: types.array(attachmentList),
  grossDiscount: types.maybeNull(types?.number),
});

export type SupplierModelType = SnapshotOrInstance<typeof SupplierModel>;
export type SupplierType = Instance<typeof SupplierModel>;
