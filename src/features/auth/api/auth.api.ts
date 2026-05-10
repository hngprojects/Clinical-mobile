import { ApiError } from '@/shared/api/types';

import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterOtpResponse,
  RegisterRequest,
  VerifyOtpRequest,
} from './auth.types';

const DUMMY_USER = {
  id: 'logickoder',
  email: 'jeffery@logickoder.dev',
  firstName: 'Jeffery',
  lastName: 'Orazulike',
};

const DUMMY_ACCESS = 'dummy.access.token';
const DUMMY_REFRESH = 'dummy.refresh.token';
const DUMMY_ACCESS_ROTATED = 'dummy.access.token.rotated';
const DUMMY_SIGN_UP_CODE = '842913';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function login(data: LoginRequest): Promise<AuthResponse> {
  await delay(800);
  if (data.email === 'jeffery@logickoder.dev' && data.password === 'Password1') {
    return {
      user: DUMMY_USER,
      tokens: { accessToken: DUMMY_ACCESS, refreshToken: DUMMY_REFRESH },
    };
  }
  throw new ApiError('Invalid credentials', 401);
}

async function register(data: RegisterRequest): Promise<RegisterOtpResponse> {
  await delay(1000);
  if (!data.email || !data.password) {
    throw new ApiError('Email and password are required', 400);
  }

  return {
    email: data.email,
    expiresInSeconds: 30,
  };
}

async function verifySignUpOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  await delay(900);
  if (data.code === '000000') {
    throw new ApiError(
      "We couldn't verify you right now. Please check your connection and try again.",
      503,
      'NETWORK_ERROR',
    );
  }

  if (data.code !== DUMMY_SIGN_UP_CODE) {
    throw new ApiError('The code you entered was incorrect, check again.', 400, 'INVALID_OTP');
  }

  return {
    user: {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName: '',
      lastName: '',
    },
    tokens: { accessToken: DUMMY_ACCESS, refreshToken: DUMMY_REFRESH },
  };
}

async function resendSignUpOtp(email: string): Promise<RegisterOtpResponse> {
  await delay(700);
  return {
    email,
    expiresInSeconds: 30,
  };
}

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  await delay(400);
  if (refreshToken === DUMMY_REFRESH) {
    return { accessToken: DUMMY_ACCESS_ROTATED, refreshToken: DUMMY_REFRESH };
  }
  throw new ApiError('Refresh token invalid', 401);
}

export const authApi = { login, register, verifySignUpOtp, resendSignUpOtp, refreshTokens };
