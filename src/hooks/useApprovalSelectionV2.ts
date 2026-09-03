interface ItemType {
  isActive: boolean;
  [key: string]: any;
}

interface HandleSelectionChangeParams {
  data: ItemType[];
  mode: 'single' | 'all' | 'reset';
  index?: number; // Only for 'single'
  isSelectAll?: boolean; // Only for 'all'
}

export const handleSelectionChange = ({
  data,
  mode,
  index,
  isSelectAll = false,
}: HandleSelectionChangeParams): {
  updatedData: ItemType[];
  isShowHeader: boolean;
  isSelectAllState: boolean;
} => {
  let updatedData: ItemType[] = [];

  switch (mode) {
    case 'single':
      updatedData = [...data];
      if (index !== undefined) {
        updatedData[index].isActive = !updatedData[index].isActive;
      }
      break;

    case 'all':
      updatedData = data.map(item => ({
        ...item,
        isActive: !isSelectAll,
      }));
      break;
  }

  const activeItems = updatedData.filter(item => item.isActive);
  const inactiveItems = updatedData.filter(item => !item.isActive);

  return {
    updatedData,
    isShowHeader: activeItems.length === 0,
    isSelectAllState: inactiveItems.length === 0,
  };
};
