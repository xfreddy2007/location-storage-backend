export interface APIErrorType extends Error {
  status: number;
  code: number;
  name: string;
  message: string;
}
