export interface KPI {
  isParent: boolean;
  parentName: string;
  numberOfChild: number;
  label: string | null;
  flatIndex: number;
  arrowText: string | null;
  progress: number | null;
  score: number;
  intBSCPerspectiveId: number;
  heading: string | null;
  intStrategicParticularsID: number;
  objective: string | null;
  strTargetFrequency: string | null;
  strAggregationType: string | null;
  kpiId: number;
  strKPIFormat: string | null;
  kpi: string | null;
  numTarget: number | null;
  numAchivement: number | null;
  chart_type: string | null;
  chart_type_label: string | null;
  isShown: boolean;
  strMaxMin: string | null;
  intMaxMin: number | null;
  intFrequency: number;
  strFrequency: string | null;
  numWeight: number | null;
  numLastYearTgt: number | null;
  numLastYearAch: number | null;
  strDataSource: string | null;
  strYearName: string | null;
  intYearId: number | null;
  strURL: string | null;
  benchmark: number | null;
  previousYearTarget: number | null;
  previousYearAchivement: number | null;
  remarks: string | null;
  isTargetAssigned: boolean;
  targetAutoIdList: string | null;
  kpiForId: number;
}

export interface BSC {
  bsc: string;
  dynamicList: KPI[];
}

export interface KPIReport {
  kpiExtraInformation: string;
  infoList: BSC[];
}
