import { applySnapshot, detach, flow, types } from 'mobx-state-tree';
import createPersistentStore from 'mst-persistent-store';
import { UserInfoStore, UserInfoStoreType } from './userInfo';
import { PermisionInfoStore, PermisionStoreType } from './permisionInfo';
import { DrawerMenuStore, DrawerMenuType } from './drawerMenu';
import { DrawerSubMenuStore, DrawerSubMenuType } from './drawerSubMenu';
import { MenuTabStore, MenuTabType } from './menu';
import { AudioIsRecordType, AudioRecordStore } from './audioRecord';
import { EmpModel, EmpModelType } from './emp';
import { ProductItemModel, ProductItemModelType } from './productItem';
import { SupplierModel, SupplierModelType } from './supplier';
import {
  SelectedBusinessUnitModel,
  SelectedBusinessUnitType,
} from './selectedBusiUnit';
import {
  GRNProductWithRefModel,
  GRNProductWithRefModelType,
} from './grnProductWithRef';
import { createMMKV } from 'react-native-mmkv';
import { secureStorageKey } from '../../App';
import {
  CustomerRegInfoStore,
  CustomerRegInfoStoreType,
} from './customerRegInfo';
import {
  PreviousLocationsModel,
  PreviousLocationModelType,
} from './lattitudeLongitude';
import { StperModel, StperModelType } from './stepMeter';
import { TrackOnOrOfModel, TrackOnOrOfType } from './trackOnOrOff';
import { UserMenuModel, UserMenuSnapshotType } from './cacheUserMenu';
import { FullDashboardResponseModel } from './dashboardProfile';
import { CacheLocationModel, CacheLocationType } from './cacheLocation';

const RootStore = types
  .model('RootStore', {
    userColorScheme: types.maybeNull(
      types.union(types.literal('light'), types.literal('dark')),
    ),
    hydrated: false,
    userInfo: types.maybe(UserInfoStore),
    customerRegInfo: types.maybe(CustomerRegInfoStore),
    previousLocationInfo: types.map(PreviousLocationsModel),
    permisionInfo: types.maybe(PermisionInfoStore),
    drawerMenu: types.maybe(DrawerMenuStore),
    drawerSubMenu: types.maybe(DrawerSubMenuStore),
    menuTab: types.maybe(MenuTabStore),
    audioRecord: types.maybe(AudioRecordStore),
    empployee: types.map(EmpModel),
    productItem: types.map(ProductItemModel),
    supplier: types.map(SupplierModel),
    step: types.map(StperModel),
    sbu: types.maybe(SelectedBusinessUnitModel),
    gRNProductWithRef: types.map(GRNProductWithRefModel),
    trackOnOrOf: types.maybe(TrackOnOrOfModel),
    userMenu: types.optional(types.array(UserMenuModel), []),
    dashboardProfileData: types.maybe(FullDashboardResponseModel),
    cacheLocation: types.maybe(CacheLocationModel),
  })
  .actions(self => ({
    setUserColorScheme(colorScheme: typeof self.userColorScheme | 'auto') {
      if (colorScheme === 'auto') {
        self.userColorScheme = null;
      } else {
        self.userColorScheme = colorScheme;
      }
    },
    hydrate: flow(function* hydrate() {
      try {
        self.hydrated = true;
      } catch (error) {
        console.error(error);
        self.hydrated = true;
      }
    }),
    userInfoSave(userInfo: UserInfoStoreType) {
      self.userInfo = userInfo;
    },
    customerRegInfoSave(customerRegInfo: CustomerRegInfoStoreType) {
      self.customerRegInfo = customerRegInfo;
    },
    addPreviousLocation(it: PreviousLocationModelType) {
      self.previousLocationInfo.put(it);
    },
    removePreviousLocation(id: string) {
      self.previousLocationInfo.delete(id);
    },
    clearPreviousLocations() {
      self.previousLocationInfo.clear();
    },
    menuTabSave(menuTab: MenuTabType) {
      self.menuTab = menuTab;
    },
    audioRecordSave(audioRecord: AudioIsRecordType) {
      self.audioRecord = audioRecord;
    },
    permisionInfoSave(permisionInfo: PermisionStoreType) {
      self.permisionInfo = permisionInfo;
    },
    // setCurrentLocation(CurrentLocation: CurrentLocationSnapshotType) {
    //   self.CurrentLocation = CurrentLocation;
    // },
    addToEmployee(item: EmpModelType) {
      if (self.empployee.has(item.id)) {
        return { err: 'Employee is already added' };
      }
      self.empployee.put(item);
      // return { msg: 'Product added to cart' };
    },
    removeFromEmp(id: string) {
      const item = self.empployee.get(id);
      if (item) {
        detach(item); // Detach before deletion
        self.empployee.delete(id);
      }
    },
    clearEmpList() {
      // self.empployee.forEach(item => detach(item));
      self.empployee.clear();
    },
    addToProdectItem(item: ProductItemModelType) {
      if (self.productItem.has(item.id)) {
        return { err: 'Item is already added' };
      }
      self.productItem.put(item);
      // return { msg: 'Product added to cart' };
    },
    removeFromProductItem(id: string) {
      self.productItem.delete(id);
    },
    clearProductItem() {
      // self.productItem.forEach(item => detach(item));
      self.productItem.clear();
    },
    addGRNProductWithRef(item: GRNProductWithRefModelType) {
      if (self.gRNProductWithRef.has(item.id)) {
        // self.gRNProductWithRef.put({
        //   ...item,
        //   id: item.id,
        // });
      }
      self.gRNProductWithRef.put(item);
    },
    removeGRNProductWithRef(id: string) {
      self.gRNProductWithRef.delete(id);
    },
    clearGRNProductWithRef() {
      // self.gRNProductWithRef.forEach(item => detach(item));
      self.gRNProductWithRef.clear();
    },
    addToSupplier(it: SupplierModelType) {
      if (self.supplier.has(it.id)) {
        return { err: 'Item is already added' };
      }
      self.supplier.put(it);
      // return { msg: 'Product added to cart' };
    },
    addStep(it: StperModelType) {
      // if (self.step.has(it.id)) {
      self.step.put(it);
      // }
    },
    clearStep() {
      // self.step.forEach(item => detach(item));
      self.step.clear();
    },
    removeFromSupplier(id: string) {
      self.supplier.delete(id);
    },
    clearSupplier() {
      // self.supplier.forEach(item => detach(item));
      self.supplier.clear();
    },
    sbuSave(sbu: SelectedBusinessUnitType) {
      self.sbu = sbu;
    },
    clearSBU() {
      detach(self.sbu);
      self.sbu = undefined;
    },
    drawerMenuNameSave(drawerMenu: DrawerMenuType) {
      self.drawerMenu = drawerMenu;
    },
    drawerSubMenuNameSave(drawerSubMenu: DrawerSubMenuType) {
      self.drawerSubMenu = drawerSubMenu;
    },
    drawerSubMenuClean() {
      self.drawerSubMenu = undefined;
    },
    permisionInfoDelete() {
      self.permisionInfo = undefined;
    },
    trackOnOrOfFunc(trackOnOrOf: TrackOnOrOfType) {
      self.trackOnOrOf = trackOnOrOf;
    },
    userMenuSave(menu: UserMenuSnapshotType[]) {
      self.userMenu.replace(menu);
    },
    clearUserMenu() {
      self.userMenu.clear();
    },
    saveDashboardProfile(data: any) {
      if (!data) return;
      self.dashboardProfileData = data;
    },
    clearDashboardProfile() {
      self.dashboardProfileData = undefined;
    },
    cacheLocationSave(cacheLocation: CacheLocationType) {
      self.cacheLocation = cacheLocation;
    },
    clearCacheLocation() {
      self.cacheLocation = undefined;
    },
    logout() {
      mmkv.clearAll();
      self.userMenu.clear();
      self.dashboardProfileData = undefined;
      applySnapshot(self, {
        userColorScheme: null,
        hydrated: false,
        userInfo: undefined,
        customerRegInfo: undefined,
        previousLocationInfo: {},
        permisionInfo: undefined,
        drawerMenu: undefined,
        drawerSubMenu: undefined,
        menuTab: undefined,
        audioRecord: undefined,
        empployee: {},
        productItem: {},
        supplier: {},
        step: {},
        sbu: undefined,
        gRNProductWithRef: {},
        trackOnOrOf: undefined,
        cacheLocation: undefined,
      });
    },
  }))
  .views(self => ({
    get empListArray() {
      return [...self.empployee.values()];
    },
    get productItemListArray() {
      return [...self.productItem.values()];
    },
    get GRNProductWithRefItemList() {
      return [...self.gRNProductWithRef.values()];
    },
    get supplierListArray() {
      return [...self.supplier.values()];
    },
    get previousLocationList() {
      return [...self.previousLocationInfo.values()];
    },
    get currentColorScheme() {
      if (self.userColorScheme) {
        return self.userColorScheme;
      }
      return 'auto';
    },
  }));

export const mmkv = createMMKV({
  id: 'mmkv.default',
  encryptionKey: secureStorageKey,
});
const setItem = (key: string, value: any) =>
  mmkv.set(key, JSON.stringify(value));

const getItem = (key: string) => {
  const value = mmkv.getString(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};
const removeItem = (key: string) => {
  mmkv.remove(key);
};

const secureStorage = {
  setItem,
  getItem,
  removeItem,
};

export const [RootStoreProvider, useRootStore] = createPersistentStore(
  RootStore,
  secureStorage,
  {
    hydrated: false,
  },
);
