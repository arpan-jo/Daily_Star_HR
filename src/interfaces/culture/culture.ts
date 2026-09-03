export interface AppreciationDataType {
  transactionId: number;
  transactionDateTime: string;
  transactionPoints: number;
  acknowledgmentTypeId: number;
  acknowledgmentType: string;
  message: string;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  designation: string;
  department: string;
  totalSharedPoints: number;
  lastSharedDateTime: string;
  employeeImageId: number;
}

export interface AppreSumDetailsType {
  totalSentPoints: number;
  totalNumberOfTimes: number;
  allAcknowledgement?: AllAcknowledgementEntity[] | null;
  allAppreciations?: AllAppreciationsEntity[] | null;
}
export interface AllAcknowledgementEntity {
  acknowledgmentTypeId: number;
  acknowledgmentType: string;
  totalSharedPoints: number;
  totalSharedTimes: number;
}
export interface AllAppreciationsEntity {
  transactionId: number;
  transactionDateTime: string;
  transactionPoints: number;
  acknowledgmentTypeId: number;
  acknowledgmentType: string;
  message: string;
  employeeName: string;
  senderSignature: string;
}

export interface PointHistoryType {
  totalRecognitionPoints: number;
  yearlyPoints?: YearlyPointsEntity[] | null;
}
export interface YearlyPointsEntity {
  year: number;
  monthlyPoints?: MonthlyPointsEntity[] | null;
}
export interface MonthlyPointsEntity {
  monthId: number;
  monthName: string;
  totalPoints: number;
}
