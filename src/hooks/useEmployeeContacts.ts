import {useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useRootStore} from '../stores/rootStore';
import {useToast} from '../common/components/CustomToast';
import {EmployeeContactType} from '../interfaces/contact/contact';

export function useEmployeeContacts() {
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState<EmployeeContactType[]>();
  const [contactData2, setContactData2] = useState<EmployeeContactType[]>();
  const [isSearch, setIsSearch] = useState(true);
  const [employeeName, setEmployeeName] = useState('');
  const isFocused = useIsFocused();
  const [isLoad, setIsLoad] = useState(false);
  const [empId, setEmpId] = useState<number | undefined>(undefined);
  const toaster = useToast();
  const busId = userInfo?.intBusinessUnitId;
  const [switchBoardData, setSwitchBoardData] = useState<any>();

  return {
    isLoading,
    setIsLoading,
    contactData,
    setContactData,
    contactData2,
    setContactData2,
    isSearch,
    setIsSearch,
    employeeName,
    setEmployeeName,
    isFocused,
    isLoad,
    setIsLoad,
    empId,
    setEmpId,
    toaster,
    busId,
    switchBoardData,
    setSwitchBoardData,
  };
}
