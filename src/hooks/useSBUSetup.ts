import {useEffect, useState} from 'react';

import {useRootStore} from '../stores/rootStore';
import {SBUType} from '../interfaces/ARL-Core/procurement/purchaseRequest/purchaseRequestType';
import {GetOrganizationalUnitUserPermission} from '../common/api/api';
import {httpRequest} from '../common/constant/httpRequest';

export const useSBUSetup = (
  isFocused: boolean,
  setIsSBULoading: (loading: boolean) => void,
  setValue: any,
) => {
  const {userInfo, sbu, sbuSave} = useRootStore();
  const [selectedBuUnit, setSelectedBuUnit] = useState<SBUType[]>([]);

  useEffect(() => {
    const fetchSBU = async () => {
      const api_params = {
        url: GetOrganizationalUnitUserPermission,
        data: {ERPUserId: userInfo?.intErpUserId},
      };

      const res = await httpRequest(api_params, setIsSBULoading);
      const mySbu = res?.filter(
        (item: any) =>
          item?.organizationUnitReffId === userInfo?.intBusinessUnitId,
      );

      if (!sbu?.businessUnitId && mySbu?.[0]) {
        const defaultSBU = {
          businessUnitId: mySbu?.[0]?.organizationUnitReffId,
          businessUnitName: mySbu?.[0]?.organizationUnitReffName,
          sbuId: mySbu?.[0]?.sbuId,
        };
        sbuSave(defaultSBU);
        setValue('sbu', {
          value: defaultSBU.businessUnitId,
          label: defaultSBU.businessUnitName,
          sbuId: defaultSBU.sbuId,
        });
      }

      const modifiedData = res?.map((item: SBUType) => ({
        value: item?.organizationUnitReffId,
        label: item?.organizationUnitReffName,
        sbuId: item?.sbuId,
      }));

      setSelectedBuUnit(modifiedData);
    };

    if (isFocused) fetchSBU();
  }, [isFocused]);

  return selectedBuUnit;
};
