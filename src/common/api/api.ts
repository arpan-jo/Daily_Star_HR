const AuthAppsGetUrlByUser = '/AuthApps/GetUrlByUser';
const AuthAppsLogin = '/AuthApps/Login';
const LoginOAuth2G = '/AuthApps/LoginOAuth2G';
const GetLoginOTP = '/Auth/GetLoginOTP';
const GetUrlByUserGmailId = '/api/AuthApps/GetUrlByUserGmailId';
const GRNFileUpload = '/EProcurement/UploadFile';
const GetKpiChartReport = '/PMS/GetKpiChartReport';
const GetFiscalYearDDL = '/PMS/GetFiscalYearDDL';
const PMTypeDDL = '/PMS/PMTypeDDL';
const GetSubordinateKpiSummary = '/PMS/GetSubordinateKpiSummary';
const GetSubordinateKpiDetails = '/PMS/GetSubordinateKpiDetails';
const SaveSupervisorAchievement = '/PMS/SaveSupervisorAchievement';
const GetTargetVsAchievementById = '/PMS/GetTargetVsAchievementById';
const SaveTargetVsAchievement = '/PMS/SaveTargetVsAchievement';
const MyTaskLandingApi = '/PMS/MyTaskLanding';
const GetCompetencyLandingPagination = '/PMS/GetCompetencyLandingPagination';
const GetCoreValuesLandingPagination = '/PMS/GetCoreValuesLandingPagination';
const GetCoreValuesById = '/PMS/GetCoreValuesById';
const UpdatePurchaseRequestStatus =
  '/PurchaseRequest/UpdatePurchaseRequestStatus';
const EmployeeJobDescription = '/Employee/EmployeeJobDescription';
const RFQChatFileUpload = '/EProcurement/CreateEProcurementDocument';
const GetRequestForQuotationDetail =
  '/RequestForQuotation/GetRequestForQuotationDetails';
const GetIncotermListDDL = '/EProcurement/GetIncotermListDDL';
const GetRFQAllChat = '/EProcurement/GetAllEProcurementDocument';
const GetRequestForQuotationLanding =
  '/RequestForQuotation/GetRequestForQuotationLanding';
const GetPurchaseRequestLanding = '/PurchaseRequest/PurchaseRequestLanding';
const GetRFQBiddingLanding = '/QuotationAndNegotiation/GetRFQBiddingLanding';
const GetRequestForQuotationDetailsForQAN =
  '/QuotationAndNegotiation/GetRequestForQuotationDetails';
const CreateQuotationEntry = '/QuotationAndNegotiation/CreateQuotationEntry';
const GetBiddingDetailsById = '/QuotationAndNegotiation/GetBiddingDetailsById';
const GetBiddingHistory = '/QuotationAndNegotiation/GetBiddingHistory';
const GetP2PSupplyChainTracking =
  '/RequestForQuotation/GetP2PSupplyChainTracking';
const GetOrderDeliveryLanding =
  '/QuotationAndNegotiation/GetOrderDeliveryLanding';
const GetItemsForOrderDelivery =
  '/QuotationAndNegotiation/GetItemsForOrderDelivery';
const GetDeliverySummary = '/QuotationAndNegotiation/GetDeliverySummary';
const CreateAndUpdateSupplierDelivery =
  '/QuotationAndNegotiation/CreateAndUpdateSupplierDelivery';
const GetDeliveryDetailsLanding =
  '/QuotationAndNegotiation/GetDeliveryDetailsLanding';
const CreateBillSubmit = '/QuotationAndNegotiation/CreateBillSubmit';
const GetDistributionChannelDDL =
  '/oms/DistributionChannel/GetDistributionChannelDDL';
const GetCustomerStatementOnCrLimitForSales =
  '/oms/CustomerSalesTarget/GetCustomerStatementOnCrLimitForSales';
const GetExpenseLandingPaginationApps =
  '/fino/Expense/GetExpenseLandingPaginationApps';
const GetExpenseById = '/fino/Expense/GetExpenseById';
const CreateExpenceRegisterApps = '/fino/Expense/CreateExpenceRegisterApps';
const EditExpenseRegister = '/fino/Expense/EditExpenseRegister';
const GetOrganizationalUnitUserPermission =
  '/EProcurement/GetOrganizationalUnitUserPermission';
const GetCostCenterDDL = '/costmgmt/CostCenter/GetCostCenterDDL';
const GetProfitcenterDDLByCostCenterId =
  '/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId';
const GetCostElementByCostCenter =
  '/procurement/PurchaseOrder/GetCostElementByCostCenter';
const GetCostElementByCostCenterForExpense =
  '/procurement/PurchaseOrder/GetCostElementByCostCenterForExpense';
const ComplainAppsLandingPagination =
  '/oms/Complains/getComplainAppsLandingPagination';
const CreateComplain = '/oms/Complains/CreateComplainApps';
const CheckTwoFactorApproval = '/PurchaseOrder/CheckTwoFactorApproval';
const GetPurchaseOrderLanding = '/PurchaseOrder/GetPurchaseOrderLanding';
const ComplainCategory = '/oms/CustomerPoint/ComplainCategory';
const GetItemSalesByChanneldDDL = '/item/ItemSales/GetItemSalesByChanneldDDL';
const UpdatePurchaseOrderStatus = '/PurchaseOrder/UpdatePurchaseOrderStatus';
const GetPartnerBook = '/fino/BankBranch/GetPartnerBook';
// const GetPartnerBook = '/PurchaseReceive/GetPartnerBook';
const GetInventoryReceiveReportDetails =
  '/PurchaseReceive/GetInventoryReceiveReportDetails';
const BillRegisterByPo = '/PurchaseReceive/BillRegisterByPo';
const GetSupplierInvoiceById = '/BillPayment/GetSupplierInvoiceById';
const GetAdjustmentJournalByIdForReport =
  '/PurchaseReceive/GetAdjustmentJournalByIdForReport';
const GetInventoryTransactionDetails =
  '/PurchaseReceive/GetInventoryTransactionDetails';
const GetSupplierAdvancesByBill = '/PurchaseReceive/GetSupplierAdvancesByBill';
const CreateInventoryDocumentAttachment =
  '/PurchaseReceive/CreateInventoryDocumentAttachment';
const GetToDoLanding = '/Employee/GetToDoLanding';
const GetToDoDetailsById = '/Employee/GetToDoDetailsById';
const PMSTargetEntryReport = '/PMS/PMSTargetEntryReport';
const GetbyEntryAchivement = '/PMS/GetbyEntryAchivement';
const EmployeeTargetUpdate = '/PMS/EmployeeTargetUpdate';
const TimeSheetCRUD = '/TimeSheet/TimeSheetCRUD';
const OverTimeFilter = '/Employee/OverTimeFilter';
const OverTimeApproval = '/ApprovalPipeline/OverTimeApproval';
const OverTimeLanding = '/ApprovalPipeline/OverTimeLanding';
const MovementApplicationLanding =
  '/ApprovalPipeline/MovementApplicationLanding';
const MovementApplicationApproval =
  '/ApprovalPipeline/MovementApplicationApproval';
const PeopleDeskAllLanding = '/Employee/PeopleDeskAllLanding';
const CRUDMovementApplication = '/LeaveMovement/CRUDMovementApplication';
const PeopleDeskAllDDL = '/PeopleDeskDDL/PeopleDeskAllDDL';
const PeopleDeskAllDDLMasterData = '/MasterData/PeopleDeskAllLanding';
const DeleteExpenseById = '/fino/Expense/DeleteExpenseById';
const GetTodayHealthCheckById =
  '/asset/AssetMaintanance/GetTodayHealthCheckById';
const CreateAssetHealthCheckedTransaction =
  '/asset/AssetMaintanance/CreateAssetHealthCheckedTransaction';
const EditAssetHealthCheckedTransaction =
  '/asset/AssetMaintanance/EditAssetHealthCheckedTransaction';
const GetTodayHealthCheck = '/asset/AssetMaintanance/GetTodayHealthCheck';
const GetHealthCheckedTransactionPagination =
  '/asset/AssetMaintanance/GetHealthCheckedTransactionPagination';
const WorkMachineDDL = '/asset/AssetMaintanance/WorkMachineDDL';
const ShopFloorDDL = '/mes/MSIL/GetAllMSIL';
const GetHealthCheckedTransactionById =
  '/asset/AssetMaintanance/GetHealthCheckedTransactionById';
const LeaveApplicationLanding = '/ApprovalPipeline/LeaveApplicationLanding';
const LeaveApplicationApproval = '/ApprovalPipeline/LeaveApplicationApproval';
const PendingApprovalDashboard = '/Dashboard/PendingApprovalDashboard';
const GetAllAcknowledgementType = '/Culture/GetAllAcknowledgementType';
const GetCultureAppreciationHistory = '/Culture/GetCultureAppreciationHistory';
const CreateCultureTransaction = '/Culture/CreateCultureTransaction';
const GetAppreciationSummaryDetails = '/Culture/GetAppreciationSummaryDetails';
const GetCulturePointHistory = '/Culture/GetCulturePointHistory';
const GetPointSummary = '/Culture/GetPointSummary';
const LoanCRUD = '/Employee/LoanCRUD';
const LoanApplicationLanding = '/ApprovalPipeline/LoanApplicationLanding';
const LoanApplicationApproval = '/ApprovalPipeline/LoanApplicationApproval';
const EmployeeWiseLocation = '/TimeSheet/EmployeeWiseLocation';
const CreateNUpdateEmployeeWiseLocationAssaign =
  '/TimeSheet/CreateNUpdateEmployeeWiseLocationAssaign';
const MarketAttendanceLanding = 'ApprovalPipeline/MarketAttendanceLanding';
const MarketAttendanceApproval = '/ApprovalPipeline/MarketAttendanceApproval';
const UploadFile = '/Document/UploadFile';
const GetTodayHealthCheckTranById =
  '/asset/AssetMaintanance/GetTodayHealthCheckTranById';
const GetPlantNameDDL = '/mes/MesDDL/GetPlantNameDDL';
const GetShopfloorDDL = '/mes/MesDDL/GetShopfloorDDL';
const GetWorkCenterDDL = '/mes/MesDDL/GetWorkCenterDDL';
const GetBoMNameDDL = '/mes/MesDDL/GetBoMNameDDL';
const GetProductionShiftDDL = '/mes/MesDDL/GetProductionShiftDDL';
const GetWastedItemDDL = '/mes/MesDDL/GetWastedItemDDL';
const OeeProductionWasteEntry = '/mes/OeeProductWaste/OeeProductionWasteEntry';
const GetOeeProductWastLanding =
  '/mes/OeeProductWaste/GetOeeProductWastLanding';
const GetVehicleLogLanding = '/mes/VehicleLog/GetVehicleLogLanding';
const GetOeeProductWastById = '/mes/OeeProductWaste/GetOeeProductWastById';
const GetNptCapacityconfigByItemAndBomId =
  '/mes/OeeProductWaste/GetNptCapacityconfigByItemAndBomId';
const GetNPTLossTime = '/mes/OeeProductWaste/GetNPTLossTime';
const MSILAllDDLByPartName = '/mes/MSIL/GetAllMSIL';
const GetNPTLanding = '/mes/OeeProductWaste/GetNPTLanding';
const GetNPTSubCategoryById = '/mes/OeeProductWaste/GetNPTSubCategoryById';
const CreateNPTEntry = '/mes/OeeProductWaste/CreateNPTEntry';
const GetNPTById = '/mes/OeeProductWaste/GetNPTById';
const DeleteNPTById = '/mes/OeeProductWaste/DeleteNPTById';
const EditExpenseRegisterForApps = '/fino/Expense/EditExpenseRegisterForApps';
const GetItemsLastPurchaseInformation =
  '/ComparativeStatement/GetItemsLastPurchaseInformation';
const DeleteOeeProductionId = '/mes/OeeProductWaste/DeleteOeeProductionId';
const GetItemNameForNPTDDL = 'mes/MesDDL/GetItemNameForNPTDDL';
const GetModeOfShipmentDDL = '/EProcurement/GetModeOfShipmentDDL';
const GetLoadingPortDDL = '/EProcurement/GetLoadingPortDDL';
const GetReceiveInventoryLanding =
  '/PurchaseReceive/GetReceiveInventoryLanding';
const GetVehicleList = '/mes/VehicleLog/GetVehicleList';
const GetSupplierDeliveryDDL = '/PurchaseReceive/GetSupplierDeliveryDDL';
const GetSupplierDeliveryItemsForGRN =
  '/PurchaseReceive/GetSupplierDeliveryItemsForGRN';
const CreateStuffBusBooking = '/mes/VehicleLog/CreateStuffBusBooking';
const GetStuffBusBookingLanding = '/mes/VehicleLog/GetStuffBusBookingLanding';
const GetStuffBusBookingById = '/mes/VehicleLog/GetStuffBusBookingById';
const GetDriverBasicInfoById = '/mes/VehicleLog/GetDriverBasicInfoById';
const DeleteStuffBusBookingById = '/mes/VehicleLog/DeleteStuffBusBookingById';
const DeleteComparativeStatement =
  '/ComparativeStatement/DeleteComparativeStatement';
const GetApproveListBySuppervisorId =
  '/mes/VehicleLog/GetApproveListBySuppervisorId';
const TripRequisitionApprove = '/mes/VehicleLog/TripRequisitionApprove';
const GetStuffBusBookingLandingWithFilter =
  '/mes/VehicleLog/GetStuffBusBookingLandingWithFilter';
const GetBookingListForApprovalByEnroll =
  '/mes/VehicleLog/GetBookingListForApprovalByEnroll';
const GetAvailableDriverList = '/mes/VehicleLog/GetAvailableDriverList';
const GetLastVehicleMileageId = '/mes/VehicleLog/GetLastVehicleMileageId';
const GetDriverDetailsByEnroll = '/mes/VehicleLog/GetDriverDetailsByEnroll';
const CreateVehicleLog = '/mes/VehicleLog/CreateVehicleLog';
const GetSupplierFuelStationDDL = '/mes/VehicleLog/GetSupplierFuelStationDDL';
const CreateVehicleExpenseLog = '/mes/VehicleLog/CreateVehicleExpenseLog';
const CreateVehicleCheckPointLog = '/mes/VehicleLog/CreateVehicleCheckPointLog';
const GetVehicleLogById = '/mes/VehicleLog/GetVehicleLogById';
const GetChallanStatusAnalysisReport =
  '/oms/SalesInformation/GetChallanStatusAnalysisReport';
const CalculateAmountToLiter = '/mes/VehicleLog/CalculateAmountToLiter';
const GetMarketShareSalesContributionPagination =
  '/tms/LigterLoadUnload/GetMarketShareSalesContributionPagination';
const GetMarketShareCompanyDDL =
  '/tms/LigterLoadUnload/GetMarketShareCompanyDDL';
const CreateMarketShareSalesContribution =
  '/tms/LigterLoadUnload/CreateMarketShareSalesContribution';
const GetMarketShareSalesContributionByTerritoryId =
  '/tms/LigterLoadUnload/GetMarketShareSalesContributionByTerritoryId';
const EditMarketShareSalesContribution =
  '/tms/LigterLoadUnload/EditMarketShareSalesContribution';
const GetSupplierListWithRanks =
  '/wms/InventoryTransaction/GetSupplierListWithRanks';
const GetUserWiseRegionAreaTerritoryDDL =
  '/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL';
const GetTripApprovalLanding = '/mes/VehicleLog/GetTripApprovalLanding';
const UpdateVehicleExpenseLog = '/mes/VehicleLog/UpdateVehicleExpenseLog';
const GetVehicleListByDriverId = '/mes/VehicleLog/GetVehicleListByDriverId';
const GetMarketShareByTerritoryNDate =
  '/tms/LigterLoadUnload/GetMarketShareByTerritoryNDate';
const GetMasterSectionDDL = '/asset/AssetMaintanance/GetMasterSectionDDL';
const train = '/base64/train';
const check_attendance = '/base64/check_attendance';
const MassonBillEntry = '/oms/SitePeopleInfos/MassonBillEntry';
const GetMassonBill = '/oms/SitePeopleInfos/GetMassonBill';
const GetEmployeeLoginInfoForSales =
  '/hcm/RemoteAttendance/GetEmployeeLoginInfo';
const GetEmployeeLeaveBalanceAndHistory =
  '/LeaveMovement/GetEmployeeLeaveBalanceAndHistory';
const EmployeeProfileView = '/Employee/EmployeeProfileView';
const GetIOULanding = '/Employee/GetIOULanding';
const ManualAttendanceLandingEngine =
  '/ApprovalPipeline/ManualAttendanceLandingEngine';
const RemoteAttendanceLocationNDeviceLanding =
  '/ApprovalPipeline/RemoteAttendanceLocationNDeviceLanding';
const ExpenseLandingEngine = '/ApprovalPipeline/ExpenseLandingEngine';
const IOUApplicationLanding = '/ApprovalPipeline/IOUApplicationLanding';
const ExpenseApprovalEngine = '/ApprovalPipeline/ExpenseApprovalEngine';
const GetVehicleFuelTypeDDL = '/tms/Vehicle/GetVehicleFuelTypeDDL';
const VehicleDDl = '/tms/FuelRequsition/VehicleDDl';
const CreateUpdateFuelRequsition =
  '/tms/FuelRequsition/CreateUpdateFuelRequsition';
const FuelRequsitionLanding = '/tms/FuelRequsition/FuelRequsitionLanding';
const UploadFuelRequsitionAttatchment =
  'tms/FuelRequsition/UploadFuelRequsitionAttatchment';
const GetFuelRequsitionById = '/tms/FuelRequsition/GetFuelRequsitionById';
const GetSupplierFuelStationDDLForFuelDelivery =
  '/partner/PManagementCommonDDL/GetSupplierFuelStationDDL';
const UploadFuelRequsitionQRScan =
  '/tms/FuelRequsition/UploadFuelRequsitionQRScan';
const HotDeskOfficeDDL = '/Employee/HotDeskOfficeDDL';
const HotDeskFloorDDL = '/Employee/HotDeskFloorDDL';
const HotDeskAssign = '/Employee/HotDeskAssign';
const HotDeskLanding = '/Employee/HotDeskLanding';
const HotDeskReport = '/Employee/HotDeskReport';
const EditComparativeStatement =
  '/ComparativeStatement/EditComparativeStatement';
const SendContact = '/PdfAndExcelReport/SendContact';
const GetVisitingCardDataByEmployeeId =
  '/EmployeeDocument/GetVisitingCardDataByEmployeeId';
const EmployeeVisitingCardInfo = '/Employee/EmployeeVisitingCardInfo';
const GetSupplierBillAttachment = '/BillPayment/GetSupplierBillAttachment';
const SaveSupplierBillAttachment = '/BillPayment/SaveSupplierBillAttachment';
const GetSupplierListForBillAttachment =
  '/BillPayment/GetSupplierListForBillAttachment';
const GetDeliveryToAssignSupplierPagination =
  'wms/Delivery/GetDeliveryToAssignSupplierPagination';
const GetBusinessAreaDDL = '/domain/BusinessUnitDomain/GetBusinessAreaDDL';
const GetDistributionChannelDDLBySBUId =
  'oms/SalesOrder/GetDistributionChannelDDLBySBUId';
const GetShipPointDDL = '/wms/ShipPoint/GetShipPointDDL';
const GetTerritoryBySupplierId =
  '/tms/VehicleAllocation/GetTerritoryBySupplierId';
const AssignSupplierToDelivery =
  '/tms/VehicleAllocation/AssignSupplierToDelivery';
const GetVehicleCityDDL = '/tms/TransportMgtDDL/GetVehicleCityDDL';
const GetVehicleRegistrationLetterDDL =
  '/tms/TransportMgtDDL/GetVehicleRegistrationLetterDDL';
const GetVehicleRegitrationNumberDDL =
  '/tms/TransportMgtDDL/GetVehicleRegitrationNumberDDL';
const GetVehicleCapacityDDL = '/tms/TransportMgtDDL/GetVehicleCapacityDDL';
const CreateSupplierVehicleApps = '/tms/Vehicle/CreateSupplierVehicleApps';
const GetVehicleBySupplierDDL =
  '/tms/VehicleAllocation/GetVehicleBySupplierDDL';
const GetBillRegisterLanding = '/BillPayment/GetBillRegisterLanding';
const GetBillTypeDDL = '/BillPayment/GetBillTypeDDL';
const BillApproved = '/BillPayment/BillApproved';
const GetComparativeStatementLanding =
  '/ComparativeStatement/GetComparativeStatementLanding';
const EmployeeDashboard = '/Dashboard/EmployeeDashboard';
const EmployeeDashboardApps = '/Dashboard/EmployeeDashboardApps';
const GetDistrictDDL = '/oms/TerritoryInfo/GetDistrictDDL';
const GetDivisionDDL = '/oms/TerritoryInfo/GetDivisionDDL';
const GetThanaDDL = '/oms/TerritoryInfo/GetThanaDDL';
const CustomerRegistrationLogin =
  '/identity/TokenGenerate/CustomerRegistrationLogin';
const PartnerRegistrationUpdate = '/SmartARL/PartnerRegistrationUpdate';
const PartnerRegistration = '/SmartARL/PartnerRegistration';
const PartnerRegistrationStatusCheck =
  '/SmartARL/PartnerRegistrationStatusCheck';
const PartnerRegistrationDDL = '/SmartARL/PartnerRegistrationDDL';
const CheckMyTodayArlMeal = '/Cafeteria/CheckMyTodayArlMeal';
const TakeMyTodayArlMeal = '/Cafeteria/TakeMyTodayArlMeal';
const LoginForPartnerRegistration = '/AuthApps/LoginForPartnerRegistration';
const GetBusinessUnitDDL = '/domain/BusinessUnitDomain/GetBusinessUnitDDL';
const SupplierBillAttachmentMultipleGRN =
  '/BillPayment/SupplierBillAttachmentMultipleGRN';
const EmployeeInfoToLocationSync = '/SmartARL/EmployeeInfoToLocationSync';
const EmployeeLocationSync = '/SmartARL/EmployeeLocationSync';
const CreateEmployeeVisitingCardData =
  '/EmployeeDocument/CreateEmployeeVisitingCardData';
const GetSupplierLastBidDetails =
  '/QuotationAndNegotiation/GetSupplierLastBidDetails';
const GetPRReferrenceDDL = '/EProcurement/GetPRReferrenceDDL';
const GetItemsForPRReference = '/EProcurement/GetItemsForPRReference';
const GetBUPurchaseOrganizationDDL =
  '/procurement/BUPurchaseOrganization/GetBUPurchaseOrganizationDDL';
const GetOrganizationalUnitUserPermissionPR =
  '/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission';
const GetOrganizationalUnitUserPermissionforWearhouse =
  '/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse';
const GetIndentStatement = '/procurement/PurchaseRequest/GetIndentStatement';
const GetStandardItemTypeListDDL =
  '/wms/ItemPlantWarehouse/GetStandardItemTypeListDDL';
const GetItemCategoryDDLByTypeId =
  '/item/ItemCategory/GetItemCategoryDDLByTypeId';
const GetItemPlantWarehouseForPurchaseRequestSearchDDL =
  '/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL';
const VehicleAssignAsDriver = '/tms/FuelRequsition/VehicleAssignAsDriver';
const CreateWifiRouterZoneWise = '/SmartARL/CreateWifiRouterZoneWise';
const GetItemForPurchaseRequestSearchDDL =
  '/EProcurement/GetItemForPurchaseRequestSearchDDL';
const GetWifiRouterZoneWiseLanding = '/SmartARL/GetWifiRouterZoneWiseLanding';
const GetControllingUnit = '/procurement/PurchaseOrder/GetControllingUnit';
const GetCostCenter = '/procurement/PurchaseOrder/GetCostCenter';
const GetProfitCenter = '/fino/CostSheet/ProfitCenterDetails';
const GetCostElementByCostCenterProcurement =
  '/procurement/PurchaseOrder/GetCostElementByCostCenter';
const EmployeePaySlipReport = '/Payroll/EmployeePaySlipReport';
const getSupplierConfigBySupplierId =
  '/procurement/PurchaseOrder/getSupplierConfigBySupplierId';
const GetItemTypeDDL = '/EProcurement/GetItemTypeDDL';
const GetItemCategoryByTypeIdDDL = '/EProcurement/GetItemCategoryByTypeIdDDL';
const GetBusinessTransactionsAndLedger =
  '/EProcurement/GetBusinessTransactionsAndLedger';
const IsPossiblePOAutoApproval =
  '/procurement/PurchaseOrder/IsPossiblePOAutoApproval';
const GetSupplierConfigLandingforAutoPO =
  '/procurement/PurchaseOrder/GetSupplierConfigLandingforAutoPO';
const MarkAsSeen = 'Notification/MarkAsSeen';
const GetFuelRequsitionReportDayWise =
  '/tms/FuelRequsition/GetFuelRequsitionReportDayWise';
const GetFuelRequsitionReportCarWise =
  '/tms/FuelRequsition/GetFuelRequsitionReportCarWise';
const GetAllNotificationByUser = '/Notification/GetAllNotificationByUser';
const SupplierPasswordReset = '/AuthApps/SupplierPasswordReset';

const GetDeliveryPrintInfo = '/wms/Delivery/GetDeliveryPrintInfo';
const CompletePacker = '/oms/LoadingPoint/CompletePacker';
const CreateVehicleForG2G = '/tms/LigterLoadUnload/CreateVehicleForG2G';
const ConfirmVehicleBySupplierApps =
  '/wms/Delivery/ConfirmVehicleBySupplierApps';
const GetVehicleInfoByOwnerTypeDDL =
  '/tms/LigterLoadUnload/GetVehicleInfoByOwnerTypeDDL';
const GetAssignedVehicleSupplierInfoApps =
  '/wms/Delivery/GetAssignedVehicleSupplierInfoApps';
const GetDeliveryPrintInfoByVehicleCardNumber =
  '/wms/Delivery/GetDeliveryPrintInfoByVehicleCardNumber';
const GetItemSubCategoryByCategoryIdDDL =
  '/EProcurement/GetItemSubCategoryByCategoryIdDDL';
const GETBankDDl = '/costmgmt/BankAccount/GETBankDDl';
const GETBankBranchDDl = '/costmgmt/BankAccount/GETBankBranchDDl';
const GetIHBUserForApproval = '/Approval/GetIHBUserForApproval';
const UpdateIHBUserApproval = '/oms/SitePeopleInfos/UpdateIHBUserApproval';
const GetMarketVisitingCompanyList = '/TimeSheet/GetMarketVisitingCompanyList';
const CreateOrUpdateCostComponentTransaction =
  '/ComparativeStatement/CreateOrUpdateCostComponentTransaction';
const GetByCostComponentPartner =
  '/ComparativeStatement/GetByCostComponentPartner';
const GetByCostComponentByUnit =
  '/ComparativeStatement/GetByCostComponentByUnit';
const EmployeeShareDashBoard = '/ShareExchange/EmployeeShareDashBoard';
const BusinessUnitsOfShare = '/ShareExchange/BusinessUnitsOfShare';
const SellersOfShare = '/ShareExchange/SellersOfShare';
const GetSharesToBuy = '/ShareExchange/GetSharesToBuy';
const RequestToBuyThisShare = '/ShareExchange/RequestToBuyThisShare';
const GetAllSellingShares = '/ShareExchange/GetAllSellingShares';
const GetAvailableSharesToSell = '/ShareExchange/GetAvailableSharesToSell';
const CreateAdvertise = '/ShareExchange/CreateAdvertise';
const SharesBidList = '/ShareExchange/SharesBidList';
const SoldThisShare = '/ShareExchange/SoldThisShare';
const GetListOfResources = '/Employee/GetListOfResources';
const GetDeskDetailsByFloor = '/Employee/GetDeskDetailsByFloor';
const SaveEmployeeDeskBook = '/Employee/SaveEmployeeDeskBook';
const HotDeskAssignByBooking = '/Employee/HotDeskAssignByBooking';
const GetTodayBookedStatusEmpWise = '/Employee/GetTodayBookedStatusEmpWise';
const GetUpcommingBookedStatus = '/Employee/GetUpcommingBookedStatus';
const GetDeskDetailsByFloorWithInfo = '/Employee/GetDeskDetailsByFloorWithInfo';
const GetMeetingRoomDDL = '/Employee/GetMeetingRoomDDL';
const GetBookingMeetingList = '/Meeting/GetBookingMeetingList';
const GetPurchaseOrderLandingBySupplier =
  '/PurchaseOrder/GetPurchaseOrderLandingBySupplier';
const SendOtpToRecoverPassword = '/AuthApps/SendOtpToRecoverPassword';
const VerifyOtpToRecoverPassword = '/AuthApps/VerifyOtpToRecoverPassword';
const RecoverPassword = '/AuthApps/RecoverPassword';
const GetMeetingAgendaTopBoard = '/Meeting/GetMeetingAgendaTopBoard';
const CreateComparativeStatementAttachment =
  '/ComparativeStatement/CreateComparativeStatementAttachment';
const GetAvailableStaffVehicleReport =
  '/mes/VehicleLog/GetAvailableStaffVehicleReport';
const GetProjectStatusDDL = '/wms/AssetTransection/GetLabelNValueForDDL';
const GetTransportZoneByDistrictDDL =
  '/oms/SalesQuotation/GetTransportZoneByDistrictDDL';

const GetUserWiseShipToPartnerAndZoneDDL =
  '/oms/SalesQuotation/GetUserWiseShipToPartnerAndZoneDDL';
const GetEmployeeDDLSearchByBU = '/hcm/HCMDDL/GetEmployeeDDLSearchByBU';
const GetReferraSourceDDL = '/oms/SalesQuotation/GetReferraSourceDDL';
const CreateCustomerAcquisition =
  '/oms/SalesQuotation/CreateCustomerAcquisition';
const GetItemSalesByItemTypeIdDDL =
  '/oms/SalesQuotation/GetItemSalesByItemTypeIdDDL';
const UpdateCustomerAcquisitionPipeline =
  '/oms/SalesQuotation/UpdateCustomerAcquisitionPipeline';
const GetCustomerAcquisitionPagination =
  '/oms/SalesQuotation/GetCustomerAcquisitionPagination';
const GetBugetHeadWiseBalance = '/fino/BudgetaryManage/GetBugetHeadWiseBalance';
const GetAvailableBudgetAdvanceBalance =
  '/fino/BudgetaryManage/GetAvailableBudgetAdvanceBalance';
const GetListOfAssetBook = '/Employee/GetListOfAssetBook';
const GetTodayAssetBookedStatusEmpWise =
  '/Employee/GetTodayAssetBookedStatusEmpWise';
const GetUpcommingAssetBookedStatus = '/Employee/GetUpcommingAssetBookedStatus';
const AssetAssignByBooking = '/Employee/AssetAssignByBooking';
const GetAssetDetailsByWorkPlace = '/Employee/GetAssetDetailsByWorkPlace';
const SaveEmployeeAssetBook = '/Employee/SaveEmployeeAssetBook';
const GetAssetDetailsByWorkPlaceWithInfo =
  '/Employee/GetAssetDetailsByWorkPlaceWithInfo';
const GetFollowUpActivityTypeDDL =
  '/oms/SalesQuotation/GetFollowUpActivityTypeDDL';
const CreateCustomerFollowUpActivity =
  '/oms/SalesQuotation/CreateCustomerFollowUpActivity';
const GetCustomerFollowUpActivity =
  '/oms/SalesQuotation/GetCustomerFollowUpActivity';
const MeetingConfirmation = '/Meeting/MeetingConfirmation';
const GetGetFuelCostPerKM = '/mes/VehicleLog/GetGetFuelCostPerKM';
const GetAttendanceSummary = '/Dashboard/GetAttendanceSummary';
const GetTodayInformation = '/Dashboard/GetTodayInformation';
const GetPendingApplications = '/Dashboard/GetPendingApplications';
const GetDashboardRole = '/Dashboard/GetDashboardRole';
const CreateLinkedInPost = '/Document/CreateLinkedInPost';
const GetLinkedInPosts = '/Document/GetLinkedInPosts';
//old api
// const GetPartnerBenefitPolicyDDL =
//   '/partner/PartnerBenefitPolicy/GetPartnerBenefitPolicyDDL';
const GetPartnerBenefitData =
  '/partner/PartnerBenefitPolicy/GetPartnerBenefitData';
const GetPartnerBenefitPolicyByDetails =
  '/partner/PartnerBenefitPolicy/GetPartnerBenefitPolicyByDetails';
const GetBusinessPartnerSearchDDL =
  '/oms/SalesInformation/GetBusinessPartnerSearchDDL';
const CreatePartnerBenefitPolicy =
  '/partner/PartnerBenefitPolicy/CreatePartnerBenefitPolicy';
const GetBusinessPartnerShipPoint =
  '/partner/BusinessPartnerSales/GetBusinessPartnerShipPoint';
const GetPartnerBenefitPolicyLanding =
  '/partner/PartnerBenefitPolicy/GetPartnerBenefitPolicyLanding';
const GetTerrotoryRegionAreaByChannel =
  '/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel';
const GetlSalesOfficerDDL = '/oms/SalesForceTerritory/GetlSalesOfficerDDL';
const GetLabelNValueForDDL = '/wms/AssetTransection/GetLabelNValueForDDL';
const GetShipPointByTerritoryID = '/oms/ShipPoint/GetShipPointByTerritoryID';
const GetPartnerBenefitPendingApproval =
  '/partner/PartnerBenefitPolicy/GetPartnerBenefitPendingApproval';
const SupplierInvoiceTracking = '/BillPayment/SupplierInvoiceTracking';
const ComparativeStatementAutoPO =
  '/procurement/AutoPurchase/ComparativeStatementAutoPO';
const GetPurchaseOrderInformationPDF =
  '/procurement/Report/GetPurchaseOrderInformationPDF';
const GetPendingApprovalDashboard = '/Approval/GetPendingApprovalDashboard';
const GetAllPendingApplicationsForApproval =
  '/Approval/GetAllPendingApplicationsForApproval';
const CreateAdvanceExpense = '/fino/AdvanceExpense/CreateAdvanceExpense';
const GetAdvanceExpenseLandingPasignation =
  '/fino/AdvanceExpense/GetAdvanceExpenseLandingPasignation';
const GetSBUListDDL = '/costmgmt/SBU/GetSBUListDDL';
const GetItemRateFromRateUpdateConfiguration =
  '/procurement/AutoPurchase/GetItemRateFromRateUpdateConfiguration';
const RemoteAttendanceLanding = '/ApprovalPipeline/RemoteAttendanceLanding';
const MasterLocationAssaignLandingEngine =
  '/ApprovalPipeline/MasterLocationAssaignLandingEngine';
const GetRateFromItemRateAgreement =
  '/procurement/AutoPurchase/GetRateFromItemRateAgreement';
const SendPushNotification = '/PushNotify/SendPushNotification';
const MasterLocationAssaignApprovalEngine =
  '/ApprovalPipeline/MasterLocationAssaignApprovalEngine';
const ApproveApplications = '/Approval/ApproveApplications';
const ManualAttendanceApprovalEngine =
  '/ApprovalPipeline/ManualAttendanceApprovalEngine';
const EmployeeInOutTime = '/Dashboard/EmployeeInOutTime';
const UpdateRequestForQuotationStatus =
  '/RequestForQuotation/UpdateRequestForQuotationStatus';
const GetAllContractorRegistration =
  '/oms/BrandDevelopment/GetAllContractorRegistration';
const GetSiteInfoPagination = '/oms/BrandDevelopment/GetSiteInfoPagination';
const GetSiteInfoById = '/oms/BrandDevelopment/GetSiteInfoById';
const SiteApproval = '/oms/BrandDevelopment/SiteApproval';
const UserApproval = '/oms/BrandDevelopment/UserApproval';
const WorkplaceWithRoleExtension = '/PeopleDeskDdl/WorkplaceWithRoleExtension';
const BuildingwiseWifiDDL = '/PeopleDeskDDL/BuildingwiseWifiDDL';
const GetPermissionWisePlantDDL = '/EProcurement/GetPermissionWisePlantDDL';
const GetPermissionWiseWarehouseDDL =
  '/EProcurement/GetPermissionWiseWarehouseDDL';
const GetPurchaseOrganizationDDL = '/EProcurement/GetPurchaseOrganizationDDL';
const EditSiteInfo = '/oms/BrandDevelopment/EditSiteInfo';
const GetBaseCurrencyListDDL = '/EProcurement/GetBaseCurrencyListDDL';
const GetPurchaseRequestTypeListDDL =
  '/EProcurement/GetPurchaseRequestTypeListDDL';
const AdvanceExpenseLandingForApps =
  '/fino/AdvanceExpense/AdvanceExpenseLandingForApps';
const GetAdvanceExpenseById = '/fino/AdvanceExpense/GetAdvanceExpenseById';
const EditAdvanceExpense = '/fino/AdvanceExpense/EditAdvanceExpense';
const CreateTicket = '/HRTicket/CreateTicket';
const GetTickets = '/HRTicket/GetTickets';
const GetIssueTypes = '/HRTicket/GetIssueTypes';
const GetTicketDetails = '/HRTicket/GetTicketDetails';
const EmployeeLeaveTypeDDL = '/LeaveBalance/EmployeeLeaveTypeDDL';
const CommonEmployeeDDL = '/Employee/CommonEmployeeDDL';
const Create = '/LeaveApplication/Create';
const EmployeeLeaveBalanceList = '/LeaveBalance/EmployeeLeaveBalanceList';
const GetAll = '/LeaveApplication/GetAll';
const Update = '/LeaveApplication/Update';
const Delete = '/LeaveApplication/Delete';
const CreateEmployeeNonCompliance =
  '/EmployeeNonCompliance/CreateEmployeeNonCompliance';
const GetComplianceCategoryDDL =
  '/EmployeeNonCompliance/GetComplianceCategoryDDL';
const GetNatureOfComplianceDDL =
  '/EmployeeNonCompliance/GetNatureOfComplianceDDL';
const GetEmployeeNonCompliancePagination =
  '/EmployeeNonCompliance/GetEmployeeNonCompliancePagination';
const GetEmployeeNonComplianceById =
  '/EmployeeNonCompliance/GetEmployeeNonComplianceById';
const UpdateEmployeeNonCompliance =
  '/EmployeeNonCompliance/UpdateEmployeeNonCompliance';
const CreateUserLogginInfo = '/Auth/CreateUserLogginInfo';
const GetEmployeeNearbyLocation = '/Employee/GetEmployeeNearbyLocation';
const GetOrganogramTreeWithVacancy = '/Organogram/GetOrganogramTreeWithVacancy';
const GetEmployeeSubordinateLocation =
  '/Employee/GetEmployeeSubordinateLocation';
const GetAssetHealthCheckedTransactionForMaintenacne =
  '/asset/AssetMaintanance/GetAssetHealthCheckedTransactionForMaintenacne';
const GetDamageAssetHealthCheckedTransactionById =
  '/asset/AssetMaintanance/GetDamageAssetHealthCheckedTransactionById';
const CreateHealthCheckedDamageAssetMaintenance =
  '/asset/AssetMaintanance/CreateHealthCheckedDamageAssetMaintenance';
const GetItems = '/asset/DropDown/GetItems';
const GetEmployeeInfo = '/asset/DropDown/GetEmployeeInfo';
const GetNearByPartner = '/partner/BusinessPartnerBasicInfo/GetNearByPartner';
const EmployeeOwnLocationLatLong = '/Employee/EmployeeOwnLocationLatLong';
const GetInstrumentTypeDDL = '/costmgmt/Instrument/GetInstrumentTypeDDL';
const CreateAllMachineBulkHeathCheck =
  '/asset/AssetMaintanance/CreateAllMachineBulkHeathCheck';
const GetInventoryStatement = '/asset/AssetMaintanance/GetInventoryStatement';
const SaveAuditLog = '/domain/AuditLog/AuditLogSave';
const VerifyOTP = '/fino/CommonFino/VerifyOTP';
const MillRulesApproval = '/Iot/MillRulesApproval';
const GetMillRuleWithHeaderAsync = '/Iot/GetMillRuleWithHeaderAsync';
const CoomonApprovalList = '/procurement/Approval/CoomonApprovalList';
const GetItemRequestViewById = '/wms/InventoryView/GetItemRequestViewById';
const CommonApproved = '/procurement/Approval/CommonApproved';
const BOMApprovalLanding = '/mes/BOM/BOMApprovalLanding';
const BOMApproval = '/mes/BOM/BOMApproval';
const GetPONOLcNoforLCSummeryDDL =
  '/imp/ImportCommonDDL/GetPONOLcNoforLCSummeryDDL';
const GetInfoFromPoLcDDLApprove =
  '/imp/ImportCommonDDL/GetInfoFromPoLcDDLApprove';
const ImportCostSheetReport = '/imp/ImportReport/ImportCostSheetReport';
const GetShipmentById = '/imp/Shipment/GetShipmentById';
const ApproveCommercialCoating = '/imp/ImportReport/ApproveCommercialCoating';
const GetLoanItemLanding = '/wms/InventoryLoan/GetLoanItemLanding';
const ItemInventoryLoanTransaction =
  '/wms/InventoryLoan/ItemInventoryLoanTransaction';
const GetBusinessPartnerbyIdDDL =
  '/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL';
const GetBusinessUnitByAccountDDL = '/hcm/HCMDDL/GetBusinessUnitByAccountDDL';
const GetFundTransferApprovaListForCreatePagination =
  '/fino/FundManagement/GetFundTransferApprovaListForCreatePagination';
const CreateOrEditFundTransferRequest =
  '/fino/FundManagement/CreateOrEditFundTransferRequest';
const GetPendingAdjustments = '/wms/InventoryTransaction/GetPendingAdjustments';
const GetAllVisitorRequest = '/business/VisitorManagement/GetAllVisitorRequest';
const AcceptOrRejectVisitorRequest =
  '/business/VisitorManagement/AcceptOrRejectVisitorRequest';
const GrievanceCategoryDDL = '/DisciplinaryMgmt/GrievanceCategoryDDL';
const GrievanceSubCategoryDDL = '/DisciplinaryMgmt/GrievanceSubCategoryDDL';
const GrievanceMisconductDDL = '/DisciplinaryMgmt/GrievanceMisconductDDL';
const GrievanceSegmentDDL = '/DisciplinaryMgmt/GrievanceSegmentDDL';
const CreateNUpdateGrievance = '/DisciplinaryMgmt/CreateNUpdateGrievance';
const GetMyGrievances = '/DisciplinaryMgmt/GetMyGrievances';
const CreateVisitorAppointment =
  '/business/VisitorManagement/CreateVisitorAppointment';
const GetAllMyOutgoingRequest =
  '/business/VisitorManagement/GetAllMyOutgoingRequest';
const GetPendingAdjustmentRowViewByTransId =
  '/wms/InventoryTransaction/GetPendingAdjustmentRowViewByTransId';
const AdjustmentApproval = '/wms/InventoryTransaction/AdjustmentApproval';
const PartnerRegistrationApproval =
  '/partner/BusinessPartnerBasicInfo/PartnerRegistration';
const GetVehicleNearbyLocation =
  '/tms/CheckpostVehicleInOut/GetVehicleNearbyLocation';
const ShippingLocationTracking =
  '/costmgmt/PostgreSql/ShippingLocationTracking';
const MeetingRoomDDL_v2 = '/Employee/MeetingRoomDDL_v2';
const get_meeting_room_calender = '/api/get_meeting_room_calender';
const GetValidateExpenseAttachment =
  '/fino/Expense/GetValidateExpenseAttachment';
const DeleteExpenseRegisterRow = '/fino/Expense/DeleteExpenseRegisterRow';
const get_meeting_room_calender_modified =
  '/api/get_meeting_room_calender_modified';
const list_user_task_modified = '/api/list_user_task_modified';
const create_meeting_event = '/api/create_meeting_event';
const create_user_task = '/api/create_user_task';
const GetItemMasterCategoryDDL =
  '/item/MasterCategory/GetItemMasterCategoryDDL';
const GetItemMasterSubCategoryDDL =
  '/item/MasterCategory/GetItemMasterSubCategoryDDL';
const LighterVesselLocationTracking =
  '/costmgmt/PostgreSql/LighterVesselLocationTracking';
const truck_api = '/location_api/api/execute';
const truck_api_token = '/location_api/api/token';
const GetServiceItemListByWhId = '/asset/DropDown/GetServiceItemListByWhId';
const GetAssetListForWorkOrder = '/asset/DropDown/GetAssetListForWorkOrder';
const CreateWorkOrder = '/asset/Workorder/CreateWorkOrder';
const GetCostCenterList = '/asset/DropDown/GetCostCenterList';
const GetMntWorkOrderList = '/asset/LandingView/GetMntWorkOrderList';
const GetMaintenanceWorkOrder = '/asset/DetalisView/GetMaintenanceWorkOrder';
const GetMaintenceTaskRowData = '/asset/DetalisView/GetMaintenceTaskRowData';
const EditWorkOrder = '/asset/Workorder/EditWorkOrder';
const CreateMntTask = '/asset/MntTask/CreateMntTask';
const GetMaintenaceTaskItemList =
  '/asset/LandingView/GetMaintenaceTaskItemList';
const GetPartsList = '/asset/DropDown/GetPartsList';
const GetRuningStockAndQuantityList =
  '/mes/ProductionEntry/GetRuningStockAndQuantityList';
const CreateMntItemTask = '/asset/MntItemTask/CreateMntItemTask';
const CancelMntItemTask = '/asset/MntItemTask/CancelMntItemTask';
const CreateItemRequestForAssetMaintenance =
  '/asset/MntItemTask/CreateItemRequestForAssetMaintenance';
const GetProjectDDL = '/fino/ProjectManagement/GetProjectDDL';
const GetEmployeeRegisterSummaryAllUnit =
  '/fino/BankBranch/GetEmployeeRegisterSummaryAllUnit';

const GetFuelCostByEmployee = '/mes/VehicleLog/GetFuelCostByEmployee';
const GetCustomerAssessmentDocumentType =
  '/partner/CustomerPreAssesment/GetCustomerAssessmentDocumentType';
const GetCustomerPreAssessmentValueByType =
  '/partner/CustomerPreAssesment/GetCustomerPreAssessmentValueByType';
const CreateCustomerPreAssesment =
  '/partner/CustomerPreAssesment/CreateCustomerPreAssesment';
const GetBillUpdateFuelCostByEmployee =
  '/mes/VehicleLog/GetBillUpdateFuelCostByEmployee';
const GetCustomerPreAssessmentLanding =
  '/partner/CustomerPreAssesment/GetCustomerPreAssessmentLanding';
const GetCustomerPreAssessmentApprovalInfo =
  '/partner/CustomerPreAssesment/GetCustomerPreAssessmentApprovalInfo';
const CreateCustomerPreAssessmentApproval =
  '/partner/CustomerPreAssesment/CreateCustomerPreAssessmentApproval';
const GetMaintenanceBreakdown = '/mes/OeeProductWaste/GetMaintenanceBreakdown';
const CreateSalesForceAssessment =
  '/oms/SalesForceAssessment/CreateSalesForceAssessment';
const GetSalesForceEmployeeDDL =
  '/common-ddl/DropdownList/GetSalesForceEmployeeDDL';
const GetSalesForcePreAssessmentLanding =
  '/oms/SalesForceAssessment/GetSalesForcePreAssessmentLanding';
const GetSalesForceAssessmentApprovalInfo =
  '/oms/SalesForceAssessment/GetSalesForceAssessmentApprovalInfo';
const CreateSalesForceAssessmentApproval =
  '/oms/SalesForceAssessment/CreateSalesForceAssessmentApproval';

const GetWalkieTalkieRoom = 'Task/GetWalkieTalkieRoom';
const list_user_task = '/api/list_user_task';
const CreateVoiceRecord = '/VoiceRecord/CreateVoiceRecord';
const GetVoiceRecord = '/VoiceRecord/GetVoiceRecord';
const CreateSupplierAdvanceAfterPoApproved =
  '/fino/SupplierInvoiceInfo/CreateSupplierAdvanceAfterPoApproved';
const AppLoginLinkedin = '/Auth/AppLoginLinkedin';
const chat = '/chat';
const GetDemandPlan = '/mes/ProductionPlanning/GetDemandPlan';
const SaveOrUpdateManpowerTaskPerform =
  '/mes/ProductionPlanning/SaveOrUpdateManpowerTaskPerform';
const GetEmployeeWiseProfitCenterConfig =
  '/fino/Expense/getEmployeeWiseProfitCenterConfig';
const GetCostElementByTransportDDL =
  '/fino/FinanceCommonDDL/GetCostElementByTransportDDL';
// Lead Enrollment (Lead Connect)
const GetBusinessUnitBasic = '/SaasMasterData/GetBusinessUnitBasic';
const GetAllDistrictBasic = '/MasterData/GetAllDistrictBasic';
const GetBusinessCategory = '/LeadEnrollment/GetBusinessCategory';
const GetProductTypeBasic = '/LeadEnrollment/GetProductTypeBasic';
const SaveLeadEnrollment = '/LeadEnrollment/SaveLeadEnrollment';
const GetLeadEnrollmentCount = '/LeadEnrollment/GetLeadEnrollmentCount';
const GetMyLeads = '/LeadEnrollment/GetMyLeads';
const GetEmployeeLeadSummary = '/LeadEnrollment/GetEmployeeLeadSummary';
const LeadTopContributorsAllBU = '/LeadEnrollment/LeadTopContributorsAllBU';
const SupplierBusinessUnitDDL =
  '/partner/PManagementCommonDDL/SupplierBusinessUnitDDL';
const GetBudgetRemainingAmount =
  '/costmgmt/BudgetIncomeExpense/GetBudgetRemainingAmount';
const InactiveComplainApps = '/oms/Complains/InactiveComplainApps';
const EditComplainApps = '/oms/Complains/EditComplainApps';
const UpdateComplainStatus = '/oms/Complains/UpdateComplainStatus';
const GetComplainByStatus = '/oms/Complains/GetComplainByStatus';
const AttendanceAdjustmentFilter = '/Employee/AttendanceAdjustmentFilter';

// CRM Sales Force Tour Plan
const GetTourCategoryDDL = '/oms/SalesForceTourPlan/GetTourCategoryDDL';
const GetTourPurposeDDL = '/oms/SalesForceTourPlan/GetTourPurposeDDL';
const GetSalesForceTourPlanEntryInformation =
  '/oms/SalesForceTourPlan/GetSalesForceTourPlanEntryInformation';
const CreateSalesForceTourPlanEntry =
  '/oms/SalesForceTourPlan/CreateSalesForceTourPlanEntry';
const EditSalesForceTourPlanEntry =
  '/oms/SalesForceTourPlan/EditSalesForceTourPlanEntry';
const InactiveSalesForceTourPlanEntry =
  '/oms/SalesForceTourPlan/InactiveSalesForceTourPlanEntry';
const CreateMarketVisitInfo = '/oms/SalesForceTourPlan/CreateMarketVisitInfo';
// Territory scoped partner lists a tour plan row picks from.
const GetBusinessPartnerListByTerritoryId =
  '/oms/CustomerSalesTarget/GetBusinessPartnerListByTerritoryId';
const GetShipToPartnerListByTerritoryId =
  '/oms/CustomerSalesTarget/GetShipToPartnerListByTerritoryId';

// APK Store. UploadFileUnlimited is the same multipart upload as
// /Document/UploadFile with no 30MB cap, which an .apk build needs.
const UploadFileUnlimited = '/domain/Document/UploadFileUnlimited';
const DomainDownloadFile = '/domain/Document/DownlloadFile';
const CreateApkApp = '/domain/ApkApp/CreateApkApp';
const GetApkAppLandingPagination = '/domain/ApkApp/GetApkAppLandingPagination';
const DeleteApkApp = '/domain/ApkApp/DeleteApkApp';

export {
  AssignSupplierToDelivery,
  AuthAppsGetUrlByUser,
  AuthAppsLogin,
  BillApproved,
  BillRegisterByPo,
  BusinessUnitsOfShare,
  CRUDMovementApplication,
  CalculateAmountToLiter,
  CheckMyTodayArlMeal,
  CheckTwoFactorApproval,
  ComplainCategory,
  ComplainAppsLandingPagination,
  CompletePacker,
  ConfirmVehicleBySupplierApps,
  CreateAdvertise,
  CreateAndUpdateSupplierDelivery,
  CreateAssetHealthCheckedTransaction,
  CreateBillSubmit,
  CreateComplain,
  CreateCultureTransaction,
  CreateEmployeeVisitingCardData,
  CreateExpenceRegisterApps,
  CreateInventoryDocumentAttachment,
  CreateMarketShareSalesContribution,
  CreateNPTEntry,
  CreateNUpdateEmployeeWiseLocationAssaign,
  CreateOrUpdateCostComponentTransaction,
  CreateQuotationEntry,
  CreateStuffBusBooking,
  CreateSupplierVehicleApps,
  CreateUpdateFuelRequsition,
  CreateVehicleCheckPointLog,
  CreateVehicleExpenseLog,
  CreateVehicleForG2G,
  CreateVehicleLog,
  CreateWifiRouterZoneWise,
  CustomerRegistrationLogin,
  DeleteComparativeStatement,
  DeleteExpenseById,
  DeleteNPTById,
  DeleteOeeProductionId,
  DeleteStuffBusBookingById,
  EditAssetHealthCheckedTransaction,
  EditComparativeStatement,
  EditExpenseRegister,
  EditExpenseRegisterForApps,
  EditMarketShareSalesContribution,
  EmployeeDashboard,
  EmployeeDashboardApps,
  EmployeeInfoToLocationSync,
  EmployeeJobDescription,
  EmployeeLocationSync,
  EmployeePaySlipReport,
  EmployeeProfileView,
  EmployeeShareDashBoard,
  EmployeeTargetUpdate,
  EmployeeVisitingCardInfo,
  EmployeeWiseLocation,
  ExpenseApprovalEngine,
  ExpenseLandingEngine,
  FuelRequsitionLanding,
  GETBankBranchDDl,
  GETBankDDl,
  GRNFileUpload,
  GetAdjustmentJournalByIdForReport,
  GetAllAcknowledgementType,
  GetAllNotificationByUser,
  GetAllSellingShares,
  GetAppreciationSummaryDetails,
  GetApproveListBySuppervisorId,
  GetAssignedVehicleSupplierInfoApps,
  GetAvailableDriverList,
  GetAvailableSharesToSell,
  GetBUPurchaseOrganizationDDL,
  GetBiddingDetailsById,
  GetBiddingHistory,
  GetBillRegisterLanding,
  GetBillTypeDDL,
  GetBoMNameDDL,
  GetBookingListForApprovalByEnroll,
  GetBookingMeetingList,
  GetBusinessAreaDDL,
  GetBusinessTransactionsAndLedger,
  GetBusinessUnitDDL,
  GetBusinessUnitBasic,
  GetAllDistrictBasic,
  GetBusinessCategory,
  GetProductTypeBasic,
  SaveLeadEnrollment,
  GetLeadEnrollmentCount,
  GetByCostComponentByUnit,
  GetByCostComponentPartner,
  GetChallanStatusAnalysisReport,
  GetComparativeStatementLanding,
  GetCompetencyLandingPagination,
  GetControllingUnit,
  GetCoreValuesById,
  GetCoreValuesLandingPagination,
  GetCostCenter,
  GetCostCenterDDL,
  GetCostElementByCostCenter,
  GetCostElementByCostCenterProcurement,
  GetCultureAppreciationHistory,
  GetCulturePointHistory,
  GetCustomerStatementOnCrLimitForSales,
  GetDeliveryDetailsLanding,
  GetDeliveryPrintInfo,
  GetDeliveryPrintInfoByVehicleCardNumber,
  GetDeliverySummary,
  GetDeliveryToAssignSupplierPagination,
  GetDeskDetailsByFloor,
  GetDeskDetailsByFloorWithInfo,
  GetDistributionChannelDDL,
  GetDistributionChannelDDLBySBUId,
  GetDistrictDDL,
  GetDivisionDDL,
  GetDriverBasicInfoById,
  GetDriverDetailsByEnroll,
  GetEmployeeLeaveBalanceAndHistory,
  GetEmployeeLoginInfoForSales,
  GetExpenseById,
  GetExpenseLandingPaginationApps,
  GetFiscalYearDDL,
  GetFuelRequsitionById,
  GetFuelRequsitionReportCarWise,
  GetFuelRequsitionReportDayWise,
  GetHealthCheckedTransactionById,
  GetHealthCheckedTransactionPagination,
  GetIHBUserForApproval,
  GetIOULanding,
  GetIncotermListDDL,
  GetIndentStatement,
  GetInventoryReceiveReportDetails,
  GetInventoryTransactionDetails,
  GetItemCategoryByTypeIdDDL,
  GetItemCategoryDDLByTypeId,
  GetItemForPurchaseRequestSearchDDL,
  GetItemNameForNPTDDL,
  GetItemPlantWarehouseForPurchaseRequestSearchDDL,
  GetItemSalesByChanneldDDL,
  GetItemSubCategoryByCategoryIdDDL,
  GetItemTypeDDL,
  GetItemsForOrderDelivery,
  GetItemsForPRReference,
  GetItemsLastPurchaseInformation,
  GetKpiChartReport,
  GetLastVehicleMileageId,
  GetListOfResources,
  GetLoadingPortDDL,
  GetLoginOTP,
  GetMarketShareByTerritoryNDate,
  GetMarketShareCompanyDDL,
  GetMarketShareSalesContributionByTerritoryId,
  GetMarketShareSalesContributionPagination,
  GetMarketVisitingCompanyList,
  GetMassonBill,
  GetMasterSectionDDL,
  GetMeetingAgendaTopBoard,
  GetMeetingRoomDDL,
  GetModeOfShipmentDDL,
  GetNPTById,
  GetNPTLanding,
  GetNPTLossTime,
  GetNPTSubCategoryById,
  GetNptCapacityconfigByItemAndBomId,
  GetOeeProductWastById,
  GetOeeProductWastLanding,
  GetOrderDeliveryLanding,
  GetOrganizationalUnitUserPermission,
  GetOrganizationalUnitUserPermissionPR,
  GetOrganizationalUnitUserPermissionforWearhouse,
  GetP2PSupplyChainTracking,
  GetPRReferrenceDDL,
  GetPartnerBook,
  GetPlantNameDDL,
  GetPointSummary,
  GetProductionShiftDDL,
  GetProfitCenter,
  GetProfitcenterDDLByCostCenterId,
  GetPurchaseOrderLanding,
  GetPurchaseOrderLandingBySupplier,
  GetPurchaseRequestLanding,
  GetRFQAllChat,
  GetRFQBiddingLanding,
  GetReceiveInventoryLanding,
  GetRequestForQuotationDetail,
  GetRequestForQuotationDetailsForQAN,
  GetRequestForQuotationLanding,
  GetSharesToBuy,
  GetShipPointDDL,
  GetShopfloorDDL,
  GetStandardItemTypeListDDL,
  GetStuffBusBookingById,
  GetStuffBusBookingLanding,
  GetStuffBusBookingLandingWithFilter,
  GetSupplierAdvancesByBill,
  GetSupplierBillAttachment,
  GetSupplierConfigLandingforAutoPO,
  GetSupplierDeliveryDDL,
  GetSupplierDeliveryItemsForGRN,
  GetSupplierFuelStationDDL,
  GetSupplierFuelStationDDLForFuelDelivery,
  GetSupplierInvoiceById,
  GetSupplierLastBidDetails,
  GetSupplierListForBillAttachment,
  GetSupplierListWithRanks,
  GetTargetVsAchievementById,
  GetTerritoryBySupplierId,
  GetThanaDDL,
  GetToDoDetailsById,
  GetToDoLanding,
  GetTodayBookedStatusEmpWise,
  GetTodayHealthCheck,
  GetTodayHealthCheckById,
  GetTodayHealthCheckTranById,
  GetTripApprovalLanding,
  GetUpcommingBookedStatus,
  GetUrlByUserGmailId,
  GetUserWiseRegionAreaTerritoryDDL,
  GetVehicleBySupplierDDL,
  GetVehicleCapacityDDL,
  GetVehicleCityDDL,
  GetVehicleFuelTypeDDL,
  GetVehicleInfoByOwnerTypeDDL,
  GetVehicleList,
  GetVehicleListByDriverId,
  GetVehicleLogById,
  GetVehicleLogLanding,
  GetVehicleRegistrationLetterDDL,
  GetVehicleRegitrationNumberDDL,
  GetVisitingCardDataByEmployeeId,
  GetWastedItemDDL,
  GetWifiRouterZoneWiseLanding,
  GetWorkCenterDDL,
  GetbyEntryAchivement,
  HotDeskAssign,
  HotDeskAssignByBooking,
  HotDeskFloorDDL,
  HotDeskLanding,
  HotDeskOfficeDDL,
  HotDeskReport,
  IOUApplicationLanding,
  IsPossiblePOAutoApproval,
  LeaveApplicationApproval,
  LeaveApplicationLanding,
  LoanApplicationApproval,
  LoanApplicationLanding,
  LoanCRUD,
  LoginForPartnerRegistration,
  LoginOAuth2G,
  MSILAllDDLByPartName,
  ManualAttendanceLandingEngine,
  MarkAsSeen,
  MarketAttendanceApproval,
  MarketAttendanceLanding,
  MassonBillEntry,
  MovementApplicationApproval,
  MovementApplicationLanding,
  MyTaskLandingApi,
  OeeProductionWasteEntry,
  OverTimeApproval,
  OverTimeFilter,
  OverTimeLanding,
  PMSTargetEntryReport,
  PMTypeDDL,
  GetSubordinateKpiSummary,
  GetSubordinateKpiDetails,
  SaveSupervisorAchievement,
  PartnerRegistration,
  PartnerRegistrationDDL,
  PartnerRegistrationStatusCheck,
  PartnerRegistrationUpdate,
  PendingApprovalDashboard,
  PeopleDeskAllDDL,
  PeopleDeskAllDDLMasterData,
  PeopleDeskAllLanding,
  RFQChatFileUpload,
  RecoverPassword,
  CreateComparativeStatementAttachment,
  RemoteAttendanceLocationNDeviceLanding,
  RequestToBuyThisShare,
  SaveEmployeeDeskBook,
  SaveSupplierBillAttachment,
  SaveTargetVsAchievement,
  SellersOfShare,
  SendContact,
  SendOtpToRecoverPassword,
  SharesBidList,
  ShopFloorDDL,
  SoldThisShare,
  SupplierBillAttachmentMultipleGRN,
  SupplierPasswordReset,
  TakeMyTodayArlMeal,
  TimeSheetCRUD,
  TripRequisitionApprove,
  UpdateIHBUserApproval,
  UpdatePurchaseOrderStatus,
  UpdatePurchaseRequestStatus,
  UpdateVehicleExpenseLog,
  UploadFile,
  UploadFuelRequsitionAttatchment,
  UploadFuelRequsitionQRScan,
  VehicleAssignAsDriver,
  VehicleDDl,
  VerifyOtpToRecoverPassword,
  WorkMachineDDL,
  check_attendance,
  getSupplierConfigBySupplierId,
  train,
  GetAvailableStaffVehicleReport,
  GetProjectStatusDDL,
  GetTransportZoneByDistrictDDL,
  GetEmployeeDDLSearchByBU,
  GetUserWiseShipToPartnerAndZoneDDL,
  GetReferraSourceDDL,
  UpdateCustomerAcquisitionPipeline,
  CreateCustomerAcquisition,
  GetItemSalesByItemTypeIdDDL,
  GetCustomerAcquisitionPagination,
  GetBugetHeadWiseBalance,
  GetAvailableBudgetAdvanceBalance,
  GetListOfAssetBook,
  GetTodayAssetBookedStatusEmpWise,
  GetUpcommingAssetBookedStatus,
  AssetAssignByBooking,
  GetAssetDetailsByWorkPlace,
  SaveEmployeeAssetBook,
  GetAssetDetailsByWorkPlaceWithInfo,
  GetFollowUpActivityTypeDDL,
  CreateCustomerFollowUpActivity,
  GetCustomerFollowUpActivity,
  MeetingConfirmation,
  GetGetFuelCostPerKM,
  GetAttendanceSummary,
  GetTodayInformation,
  GetPendingApplications,
  GetDashboardRole,
  CreateLinkedInPost,
  GetLinkedInPosts,
  GetPartnerBenefitPolicyByDetails,
  GetPartnerBenefitData,
  GetBusinessPartnerSearchDDL,
  CreatePartnerBenefitPolicy,
  GetBusinessPartnerShipPoint,
  GetPartnerBenefitPolicyLanding,
  GetTerrotoryRegionAreaByChannel,
  GetlSalesOfficerDDL,
  GetLabelNValueForDDL,
  GetShipPointByTerritoryID,
  GetPartnerBenefitPendingApproval,
  SupplierInvoiceTracking,
  ComparativeStatementAutoPO,
  GetPurchaseOrderInformationPDF,
  GetPendingApprovalDashboard,
  GetAllPendingApplicationsForApproval,
  CreateAdvanceExpense,
  GetAdvanceExpenseLandingPasignation,
  GetSBUListDDL,
  GetItemRateFromRateUpdateConfiguration,
  RemoteAttendanceLanding,
  MasterLocationAssaignLandingEngine,
  GetRateFromItemRateAgreement,
  SendPushNotification,
  MasterLocationAssaignApprovalEngine,
  ApproveApplications,
  ManualAttendanceApprovalEngine,
  EmployeeInOutTime,
  UpdateRequestForQuotationStatus,
  GetAllContractorRegistration,
  GetSiteInfoPagination,
  GetSiteInfoById,
  SiteApproval,
  UserApproval,
  WorkplaceWithRoleExtension,
  BuildingwiseWifiDDL,
  GetPermissionWisePlantDDL,
  GetPermissionWiseWarehouseDDL,
  GetPurchaseOrganizationDDL,
  EditSiteInfo,
  GetBaseCurrencyListDDL,
  GetPurchaseRequestTypeListDDL,
  AdvanceExpenseLandingForApps,
  GetAdvanceExpenseById,
  EditAdvanceExpense,
  CreateTicket,
  GetTickets,
  GetIssueTypes,
  GetTicketDetails,
  EmployeeLeaveTypeDDL,
  CommonEmployeeDDL,
  Create,
  EmployeeLeaveBalanceList,
  GetAll,
  Update,
  Delete,
  CreateEmployeeNonCompliance,
  GetComplianceCategoryDDL,
  GetNatureOfComplianceDDL,
  GetEmployeeNonCompliancePagination,
  GetEmployeeNonComplianceById,
  UpdateEmployeeNonCompliance,
  CreateUserLogginInfo,
  GetEmployeeNearbyLocation,
  GetOrganogramTreeWithVacancy,
  GetEmployeeSubordinateLocation,
  GetAssetHealthCheckedTransactionForMaintenacne,
  GetDamageAssetHealthCheckedTransactionById,
  CreateHealthCheckedDamageAssetMaintenance,
  GetItems,
  GetEmployeeInfo,
  GetNearByPartner,
  EmployeeOwnLocationLatLong,
  GetInstrumentTypeDDL,
  CreateAllMachineBulkHeathCheck,
  GetInventoryStatement,
  SaveAuditLog,
  VerifyOTP,
  GetCostElementByCostCenterForExpense,
  MillRulesApproval,
  GetMillRuleWithHeaderAsync,
  CoomonApprovalList,
  GetItemRequestViewById,
  CommonApproved,
  BOMApprovalLanding,
  BOMApproval,
  GetPONOLcNoforLCSummeryDDL,
  GetInfoFromPoLcDDLApprove,
  ImportCostSheetReport,
  GetShipmentById,
  ApproveCommercialCoating,
  GetLoanItemLanding,
  ItemInventoryLoanTransaction,
  GetBusinessPartnerbyIdDDL,
  GetBusinessUnitByAccountDDL,
  GetFundTransferApprovaListForCreatePagination,
  CreateOrEditFundTransferRequest,
  GetPendingAdjustments,
  GetAllVisitorRequest,
  AcceptOrRejectVisitorRequest,
  GrievanceCategoryDDL,
  GrievanceSubCategoryDDL,
  GrievanceMisconductDDL,
  GrievanceSegmentDDL,
  CreateNUpdateGrievance,
  GetMyGrievances,
  CreateVisitorAppointment,
  GetAllMyOutgoingRequest,
  AdjustmentApproval,
  PartnerRegistrationApproval,
  GetVehicleNearbyLocation,
  ShippingLocationTracking,
  MeetingRoomDDL_v2,
  get_meeting_room_calender,
  GetValidateExpenseAttachment,
  DeleteExpenseRegisterRow,
  GetPendingAdjustmentRowViewByTransId,
  create_meeting_event,
  get_meeting_room_calender_modified,
  list_user_task_modified,
  create_user_task,
  GetItemMasterCategoryDDL,
  GetItemMasterSubCategoryDDL,
  LighterVesselLocationTracking,
  truck_api,
  truck_api_token,
  GetServiceItemListByWhId,
  GetAssetListForWorkOrder,
  CreateWorkOrder,
  GetCostCenterList,
  GetMntWorkOrderList,
  GetMaintenanceWorkOrder,
  GetMaintenceTaskRowData,
  EditWorkOrder,
  CreateMntTask,
  GetMaintenaceTaskItemList,
  GetPartsList,
  GetRuningStockAndQuantityList,
  CreateMntItemTask,
  CancelMntItemTask,
  CreateItemRequestForAssetMaintenance,
  GetProjectDDL,
  GetEmployeeRegisterSummaryAllUnit,
  GetFuelCostByEmployee,
  GetCustomerAssessmentDocumentType,
  GetCustomerPreAssessmentValueByType,
  CreateCustomerPreAssesment,
  GetBillUpdateFuelCostByEmployee,
  GetCustomerPreAssessmentLanding,
  GetCustomerPreAssessmentApprovalInfo,
  CreateCustomerPreAssessmentApproval,
  GetMaintenanceBreakdown,
  CreateSalesForceAssessment,
  GetSalesForceEmployeeDDL,
  GetSalesForcePreAssessmentLanding,
  GetSalesForceAssessmentApprovalInfo,
  CreateSalesForceAssessmentApproval,
  GetWalkieTalkieRoom,
  list_user_task,
  CreateVoiceRecord,
  GetVoiceRecord,
  CreateSupplierAdvanceAfterPoApproved,
  AppLoginLinkedin,
  chat,
  GetDemandPlan,
  SaveOrUpdateManpowerTaskPerform,
  GetEmployeeWiseProfitCenterConfig,
  GetCostElementByTransportDDL,
  GetMyLeads,
  GetEmployeeLeadSummary,
  LeadTopContributorsAllBU,
  SupplierBusinessUnitDDL,
  GetBudgetRemainingAmount,
  InactiveComplainApps,
  EditComplainApps,
  UpdateComplainStatus,
  GetComplainByStatus,
  UploadFileUnlimited,
  DomainDownloadFile,
  CreateApkApp,
  GetApkAppLandingPagination,
  DeleteApkApp,
  AttendanceAdjustmentFilter,
  GetTourCategoryDDL,
  GetTourPurposeDDL,
  GetSalesForceTourPlanEntryInformation,
  CreateSalesForceTourPlanEntry,
  EditSalesForceTourPlanEntry,
  InactiveSalesForceTourPlanEntry,
  CreateMarketVisitInfo,
  GetBusinessPartnerListByTerritoryId,
  GetShipToPartnerListByTerritoryId,
};
