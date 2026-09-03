import {SnapshotOrInstance, types, Instance} from 'mobx-state-tree';

export const ProductItemModel = types.model('ProductItem', {
  id: types.identifier,
  configId: types.maybeNull(types?.number),
  value: types.maybeNull(types?.number),
  label: types.maybeNull(types?.string),
  itemName: types.maybeNull(types?.string),
  itemCode: types.maybeNull(types?.string),
  baseUomId: types.maybeNull(types?.number),
  baseUomName: types.maybeNull(types?.string),
  currentStockId: types.maybeNull(types?.number),
  conversionUom: types.maybeNull(types?.string),
  rqstQuantity: types.maybeNull(types?.number),
  itemPurpose: types.maybeNull(types?.string),
  categoryName: types.maybeNull(types?.string),
  subCategoryName: types.maybeNull(types?.string),
  typeName: types.maybeNull(types?.string),
  description: types.maybeNull(types?.string),
  rowId: types.maybeNull(types?.number),
  restQuantity: types.maybeNull(types?.number),
  purchaseOrderQty: types.maybeNull(types?.number),
  purchaseOrderId: types.maybeNull(types?.number),
  approvedQuantity: types.maybeNull(types?.number),
  rfqquantity: types.maybeNull(types?.number),
  itemCategoryId: types.maybeNull(types?.number),
  itemSubCategoryId: types.maybeNull(types?.number),
  typeId: types.maybeNull(types?.number),
});

export type ProductItemModelType = SnapshotOrInstance<typeof ProductItemModel>;
export type ProductItemType = Instance<typeof ProductItemModel>;
