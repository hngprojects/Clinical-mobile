import { client } from '@/shared/api/client';
import { ApiError } from '@/shared/api/types';

import type {
  AuthResponse,
  LoginRequest,
  RegisterOtpResponse,
  RegisterRequest,
  ResendOtpRequest,
  UserProfile,
  VerifyOtpRequest,
} from './auth.types';

interface ApiSuccess<T> {
  status?: string;
  message?: string;
  data?: T | null;
}

interface BackendUser {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  firstName?: string;
  lastName?: string;
  role?: 'patient' | 'admin';
  is_email_verified?: boolean;
  is_active?: boolean;
  created_at?: string;
  last_login_at?: string | null;
}

interface TokenResponse {
  access_token?: string;
  refresh_token?: string;
  accessToken?: string;
  refreshToken?: string;
  token_type?: string;
  expires_in?: number;
  user: BackendUser;
}

interface BackendOtpDispatchResponse {
  email: string;
  expires_in_seconds?: number;
  expiresInSeconds?: number;
}

function requireData<T>(response: ApiSuccess<T>): T {
  if (!response.data) {
    throw new ApiError(response.message || 'The server returned an empty response.', 0);
  }
  return response.data;
}

function mapUser(user: BackendUser): UserProfile {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name ?? user.firstName ?? '',
    lastName: user.last_name ?? user.lastName ?? '',
    role: user.role,
    isEmailVerified: user.is_email_verified,
    isActive: user.is_active,
    createdAt: user.created_at,
    lastLoginAt: user.last_login_at,
  };
}

function mapAuthResponse(data: TokenResponse): AuthResponse {
  const accessToken = data.access_token ?? data.accessToken;
  const refreshToken = data.refresh_token ?? data.refreshToken;

  if (!accessToken) {
    throw new ApiError('The server did not return an access token.', 0);
  }

  return {
    user: mapUser(data.user),
    tokens: { accessToken, refreshToken },
  };
}

function mapOtpResponse(data: BackendOtpDispatchResponse): RegisterOtpResponse {
  return {
    email: data.email,
    expiresInSeconds: data.expires_in_seconds ?? data.expiresInSeconds ?? 30,
  };
}

async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await client.post<ApiSuccess<TokenResponse>>('/api/v1/auth/login', {
    email: data.email.trim(),
    password: data.password,
  });

  return mapAuthResponse(requireData(response.data));
}

async function register(data: RegisterRequest): Promise<RegisterOtpResponse> {
  const response = await client.post<ApiSuccess<BackendOtpDispatchResponse>>(
    '/api/v1/auth/signup',
    {
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email: data.email.trim(),
      password: data.password,
      confirm_password: data.confirmPassword,
    },
  );

  return mapOtpResponse(requireData(response.data));
}

async function verifySignUpOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  try {
    const response = await client.post<ApiSuccess<TokenResponse>>('/api/v1/auth/verify-otp', {
      email: data.email.trim(),
      code: data.code,
    });

    return mapAuthResponse(requireData(response.data));
  } catch (error) {
    if (error instanceof ApiError && [400, 422].includes(error.status)) {
      throw new ApiError(error.message, error.status, error.code ?? 'INVALID_OTP');
    }
    throw error;
  }
}

async function resendSignUpOtp(
  emailOrData: string | ResendOtpRequest,
): Promise<RegisterOtpResponse> {
  const email = typeof emailOrData === 'string' ? emailOrData : emailOrData.email;
  const response = await client.post<ApiSuccess<BackendOtpDispatchResponse>>(
    '/api/v1/auth/resend-otp',
    { email: email.trim() },
  );

  return mapOtpResponse(requireData(response.data));
}

async function me(): Promise<UserProfile> {
  const response = await client.get<ApiSuccess<BackendUser>>('/api/v1/auth/me');
  return mapUser(requireData(response.data));
}

export const authApi = { login, register, verifySignUpOtp, resendSignUpOtp, me };
