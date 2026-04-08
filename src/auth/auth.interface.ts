export interface IUser {
  id: number;
  username: string;
  password: string;
}

export interface IJwtPayload {
  sub: number;
  username: string;
}

export interface ILoginResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
  userDetails: {
    userName: string;
    email: string;
    role: string;
  };
}

export interface IRefreshResponse {
  accessToken: string;
}

/**
 * Common API Response structure
 */
export interface ICommonResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}
