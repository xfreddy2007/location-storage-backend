export interface CustomErrorType extends Error {
  status: number;
  code: number;
  name: string;
  message: string;
}
