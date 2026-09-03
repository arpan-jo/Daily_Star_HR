import {Instance, SnapshotOut, types} from 'mobx-state-tree';

const Header = types.model('Header', {
  intRegistrationId: types.maybeNull(types.number),
  intPartnerTypeId: types.maybeNull(types.number),
  strPartnerTypeName: types.maybeNull(types.string),
  strMobileNumber: types.maybeNull(types.string),
  strPassword: types.maybeNull(types.string),
  intNidFrontFileId: types.maybeNull(types.number),
  intNidBackFileId: types.maybeNull(types.number),
  strNidNumber: types.maybeNull(types.string),
  strPartnerName: types.maybeNull(types.string),
  strFatherName: types.maybeNull(types.string),
  strMotherName: types.maybeNull(types.string),
  dteDateOfBirth: types.maybeNull(types.string),
  strAddress: types.maybeNull(types.string),
  intDivisionId: types.maybeNull(types.number),
  strDivisionName: types.maybeNull(types.string),
  intDistrictId: types.maybeNull(types.number),
  strDistrictName: types.maybeNull(types.string),
  intThanaId: types.maybeNull(types.number),
  strThanaName: types.maybeNull(types.string),
  strZipCode: types.maybeNull(types.string),
  intImageFileId: types.maybeNull(types.number),
  intTinFileId: types.maybeNull(types.number),
  strTinNumber: types.maybeNull(types.string),
  intBinFileId: types.maybeNull(types.number),
  strBinNumber: types.maybeNull(types.string),
  strCompanyName: types.maybeNull(types.string),
  strOfficeAddress: types.maybeNull(types.string),
  strWarehouseAddress: types.maybeNull(types.string),
  strEmailAddress: types.maybeNull(types.string),
  strWebsiteAddress: types.maybeNull(types.string),
  strShareholdersName: types.maybeNull(types.string),
  strShareholdersAddress: types.maybeNull(types.string),
  strShareholdersMobileNumber: types.maybeNull(types.string),
  intTypeOfBusinessId: types.maybeNull(types.number),
  strTypeOfBusinessName: types.maybeNull(types.string),
  intNatureOfBusinessId: types.maybeNull(types.number),
  strNatureOfBusinessName: types.maybeNull(types.string),
  dteDateOfEstablishment: types.maybeNull(types.string),
  numBusinessInvestment: types.maybeNull(types.number),
  intTotalEmployee: types.maybeNull(types.number),
  intBankId: types.maybeNull(types.number),
  strBankName: types.maybeNull(types.string),
  intBankBranchId: types.maybeNull(types.number),
  strBankBranchName: types.maybeNull(types.string),
  strRoutingNumber: types.maybeNull(types.string),
  strSwiftCode: types.maybeNull(types.string),
  strAccountName: types.maybeNull(types.string),
  strAccountNumber: types.maybeNull(types.string),
  intImportRegistrationFileId: types.maybeNull(types.number),
  intTradeLicenseFileId: types.maybeNull(types.number),
  strTradeLicenseNumber: types.maybeNull(types.string),
  isExclusive: types.maybeNull(types.boolean),
  isExistingPartner: types.maybeNull(types.boolean),
  intReferenceEmployeeId: types.maybeNull(types.number),
  strReferenceEmployeeName: types.maybeNull(types.string),
  isApproved: types.maybeNull(types.boolean),
  intApprovaldBy: types.maybeNull(types.number),
  dteApprovalAt: types.maybeNull(types.string),
  isActive: types.maybeNull(types.boolean),
  dteCreatedAt: types.maybeNull(types.string),
  dteUpdatedAt: types.maybeNull(types.string),
  intCurrentStageId: types.maybeNull(types.number),
  intBusinessUnitId: types.maybeNull(types.number),
  strBusinessUnitName: types.maybeNull(types.string),
  intOwnershipTypeId: types.maybeNull(types.number),
  strOwnershipTypeName: types.maybeNull(types.string),
});

const AnnualTurnOver = types.model('AnnualTurnOver', {
  intRowId: types.maybeNull(types.number),
  intRegistrationId: types.maybeNull(types.number),
  intYear: types.maybeNull(types.number),
  numTaka: types.maybeNull(types.number),
  isActive: types.maybeNull(types.boolean),
});

const MajorCustomer = types.model('MajorCustomer', {
  intRowId: types.maybeNull(types.number),
  intRegistrationId: types.maybeNull(types.number),
  strCompanyName: types.maybeNull(types.string),
  strContactPersonName: types.maybeNull(types.string),
  strContactNumber: types.maybeNull(types.string),
  strCustomerType: types.maybeNull(types.string),
  intAttachmentId: types.maybeNull(types.number),
  isActive: types.maybeNull(types.boolean),
});

const MainBusinessArea = types.model('MainBusinessArea', {
  intRowId: types.maybeNull(types.number),
  intRegistrationId: types.maybeNull(types.number),
  strName: types.maybeNull(types.string),
  isActive: types.maybeNull(types.boolean),
});

const Ownership = types.model('Ownership', {
  intRowId: types.maybeNull(types.number),
  intRegistrationId: types.maybeNull(types.number),
  strName: types.maybeNull(types.string),
  isActive: types.maybeNull(types.boolean),
  strAddress: types.maybeNull(types.string),
  strMobileNumber: types.maybeNull(types.string),
});

export const CustomerRegInfoStore = types.model('CustomerRegInfoStore', {
  header: types.maybeNull(Header),
  annualTurnOver: types.array(AnnualTurnOver),
  majorCustomer: types.array(MajorCustomer),
  mainBusinessArea: types.array(MainBusinessArea),
  ownership: types.array(Ownership),
  token: types.maybeNull(types.string),
  refreshToken: types.maybeNull(types.string),
});

export type CustomerRegInfoStoreType = Instance<typeof CustomerRegInfoStore>;
export type CustomerRegInfoSnapshotType = SnapshotOut<
  typeof CustomerRegInfoStore
>;
