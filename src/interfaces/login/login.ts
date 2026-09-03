export interface LoginPayloadType {
  strLoginId: string;
  strPassword: string;
  intUrlId: number;
  strUrl: string;
  intAccountId: number;
}
export interface OTPType {
  message: string;
  statusCode: number;
  autoId?: null;
}
