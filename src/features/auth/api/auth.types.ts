export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterOtpResponse {
  email: string;
  expiresInSeconds: number;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}
