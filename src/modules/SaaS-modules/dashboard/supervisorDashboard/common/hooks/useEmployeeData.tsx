import {useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {commonURL} from '../../../../../../../App';
import useAsyncEffect from '../../../../../../common/packages/useAsyncEffect/useAsyncEffect';
import {EmployeeAttandanceListViewModelsEntity} from '../../../../../../interfaces/dashboard/supervisorDashboard';
import {getSupervisorDashboardData} from '../../../../../../services/SaaS-modules/dashboard/supervisorDashboard';
import {useRootStore} from '../../../../../../stores/rootStore';

interface UseEmployeeDataProps {
  limitToFive?: boolean;
}

export const useEmployeeData = ({
  limitToFive = false,
}: UseEmployeeDataProps = {}) => {
  const isFocused = useIsFocused();
  const {userInfo} = useRootStore();
  const [isLoading, setIsLoading] = useState(false);
  const [empList, setEmpList] =
    useState<EmployeeAttandanceListViewModelsEntity[]>();
  const [filteredEmpList, setFilteredEmpList] =
    useState<EmployeeAttandanceListViewModelsEntity[]>();
  const [searchTerm, setSearchTerm] = useState('');

  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return null;
      }
      const res = await getSupervisorDashboardData(
        userInfo?.intEmployeeId,
        userInfo?.intAccountId,
        setIsLoading,
        userInfo,
      );

      const empListData =
        userInfo?.strUrl === commonURL
          ? res?.midLevelDashboardViewModel.employeeAttandanceListViewModels
              ?.data
          : res?.midLevelDashboardViewModel.employeeAttandanceListViewModels;

      let processedData = empListData?.map(
        (item: EmployeeAttandanceListViewModelsEntity) => ({
          ...item,
          isClicked: false,
        }),
      );

      if (limitToFive && processedData?.length > 5) {
        processedData = processedData.slice(0, 5);
      }

      setEmpList(processedData);
    },
    [isFocused],
  );

  // Search functionality
  useAsyncEffect(
    async isMounted => {
      if (!isMounted()) {
        return;
      }
      if (empList && searchTerm) {
        const regex = new RegExp(searchTerm.toLowerCase());
        const filtered = empList.filter(item =>
          regex.test(item?.employeeName?.toLowerCase()),
        );
        setFilteredEmpList(filtered);
      } else {
        setFilteredEmpList(undefined);
      }
    },
    [searchTerm, empList],
  );

  const toggleEmployeeExpansion = (index: number) => {
    const currentList = filteredEmpList || empList;
    if (currentList) {
      const updatedList = currentList.map((item, idx) => ({
        ...item,
        isClicked: idx === index && !item.isClicked,
      }));

      if (filteredEmpList) {
        setFilteredEmpList(updatedList);
      } else {
        setEmpList(updatedList);
      }
    }
  };

  return {
    empList: filteredEmpList || empList,
    isLoading,
    searchTerm,
    setSearchTerm,
    toggleEmployeeExpansion,
  };
};
