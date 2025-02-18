export interface IError {
  statusCode: number;
  message: string;
  status: string;
  stack?: string;
}
