type CostCenter = {
  code: string;
  controllingUnitId: number;
  controllingUnitName: string | null;
  label: string;
  value: number;
};

type CostElement = {
  code: string;
  glId: number;
  subGlId: number;
  label: string;
  value: number;
};

type ProfitCenter = {
  code: string;
  controllingUnitId: number;
  controllingUnitName: string | null;
  label: string;
  value: number;
};

type ExpenseGroup = {
  label: string;
  value: number;
};

export type AdvanceExpenseFormDataTs = {
  reqAmount: string;
  dueDate: string;
  costCenter: CostCenter;
  costElement: CostElement;
  profitCenter: ProfitCenter;
  expenseGroup: ExpenseGroup;
  comments?: string;
  instrumentName: {
    label: string;
    value: number;
  };
};
