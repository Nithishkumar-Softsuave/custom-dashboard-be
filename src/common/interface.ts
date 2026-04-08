export interface IErrorResponse {
  error: {
    type: string;
    message: string;
    code: number;
  };
}

export interface ISuccessResponse<T = any> {
  message: string;
  data: T;
  code: number;
}
