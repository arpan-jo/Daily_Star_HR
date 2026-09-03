export interface LeaveMenuType {
  id: number;
  icon?: null;
  label: string;
  to?: null;
  isFirstLabel: boolean;
  isSecondLabel?: null;
  isThirdLabel?: null;
  thirdLabelSl?: null;
  parentId: number;
  childList?: ChildListEntity[] | null;
}
export interface ChildListEntity {
  id: number;
  icon?: null;
  label: string;
  to?: null;
  isFirstLabel: boolean;
  isSecondLabel?: null;
  isThirdLabel?: null;
  thirdLabelSl?: null;
  parentId: number;
  childList?: null[] | null;
}
export interface MenuType {
  id: number;
  icon?: null;
  label: string;
  to?: null;
  isFirstLabel: boolean;
  isSecondLabel?: null;
  isThirdLabel?: null;
  thirdLabelSl?: null;
  parentId: number;
  childList?: null[] | null;
}
