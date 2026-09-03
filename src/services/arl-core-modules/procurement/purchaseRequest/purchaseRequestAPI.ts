import axios from 'axios';

export const getPurchaseRequestTypeDDL = async () => {
  try {
    const response = await axios.get(
      '/EProcurement/GetPurchaseRequestTypeListDDL',
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getPurchaseOrganizationDDL = async (
  businessUnitId: number | null | undefined,
) => {
  try {
    const response = await axios.get(
      `/EProcurement/GetPurchaseOrganizationDDL?businessUnitId=${businessUnitId}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getPlantDDL = async (
  userId: number | null | undefined,
  businessUnitId: number | null | undefined,
) => {
  try {
    // orgUnitTypeId= 7  will be static for plant id
    const response = await axios.get(
      `/EProcurement/GetPermissionWisePlantDDL?userId=${userId}&businessUnitId=${businessUnitId}&orgUnitTypeId=7`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getWarehouseDDL = async (
  userId: number | null | undefined,
  businessUnitId: number | null | undefined,
  plantId: number | null | undefined,
  search: string | null | undefined = '',
) => {
  try {
    // orgUnitTypeId= 7  will be static for warehouse id
    const searchTxt = search ? `&search=${search}` : '';

    const response = await axios.get(
      `/EProcurement/GetPermissionWiseWarehouseDDL?userId=${userId}&businessUnitId=${businessUnitId}&plantId=${plantId}&orgUnitTypeId=8${searchTxt}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getPRDetailsData = async (
  businessUnitId: number | null | undefined,
  prId: number | null | undefined,
  setIsloading: any,
) => {
  try {
    setIsloading(true);
    const response = await axios.get(
      `/PurchaseRequest/PurchaseRequestDetailsById?businessUnitId=${businessUnitId}&purchaseRequestId=${prId}`,
    );

    setIsloading(false);
    return response?.data;
  } catch (_error) {
    setIsloading(false);
  }
};

export const getRfqCurrencyDDL = async () => {
  try {
    const response = await axios.get('/EProcurement/GetBaseCurrencyListDDL');
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getPaymentTermsDDL = async () => {
  try {
    const response = await axios.get('/EProcurement/GetPaymentTermsListDDL');
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const getSupplierListDDL = async (
  businessUnitId: number | null | undefined,
  searchTxt: string | null | undefined = 'bengal',
) => {
  try {
    const response = await axios.get(
      `/EProcurement/GetSupplierListDDL?businessUnitId=${businessUnitId}&search=${searchTxt}`,
    );
    return response?.data;
  } catch (_error) {
    return [];
  }
};

export const updatePurchaseRequestStatus = async (
  purchaseRequestid: number | null | undefined,
  type: string,
  actionBy: number | null | undefined,
) => {
  try {
    const response = await axios.post(
      `/PurchaseRequest/UpdatePurchaseRequestStatus?purchaseRequestId=${purchaseRequestid}&type=${type}&actionBy=${actionBy}`,
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
//  https://erp.ibos.io/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLandingPagingSearch?accountId=1&businessUnitId=4&PartnertypeId=2&ChannleId=0&status=true&viewOrder=desc&pageNo=0&pageSize=15&approveType=1

export const getPartnerList = async (
  accId: any,
  buId: number | null | undefined,
  partnerTypeId: number | null | undefined,
  pageNo: number | null | undefined = 0,
  pageSize: number | null | undefined = 15,
  search: string | null | undefined = '',
  setIsLoading: any = () => {},
) => {
  try {
    setIsLoading(true);
    //  need axios instance created for base url
    const instance = axios.create({
      baseURL: 'https://erp.ibos.io',
    });
    const searchTerm = search ? `&searchTerm=${search}` : '';

    const response = await instance.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerLandingPagingSearch?accountId=${accId}&businessUnitId=${buId}&PartnertypeId=${partnerTypeId}&ChannleId=0&status=true&viewOrder=desc&pageNo=${pageNo}&pageSize=${pageSize}&approveType=1${searchTerm}`,
    );
    setIsLoading(false);
    // console.log('response', response?.data?.data);
    return response?.data?.data;
  } catch (_error) {
    setIsLoading(false);
    return [];
  }
};
