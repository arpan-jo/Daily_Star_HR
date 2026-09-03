export interface SmarARLMenuType {
  id: number;
  icon?: null;
  label: string;
  to?: null;
  isFirstLabel: boolean;
  isSecondLabel?: null;
  isThirdLabel?: null;
  thirdLabelSl?: null;
  isBookmarked?: boolean;
  parentId: number;
  childList?: (ChildListEntity | null)[] | null;
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
  childList?: (ChildListEntity1 | null)[] | null;
  isBookmarked?: boolean;
}
export interface ChildListEntity1 {
  id: number;
  icon?: null;
  label: string;
  to?: null;
  isFirstLabel: boolean;
  isSecondLabel?: null;
  isThirdLabel?: null;
  thirdLabelSl?: null;
  parentId: number;
  childList?: null;
}
