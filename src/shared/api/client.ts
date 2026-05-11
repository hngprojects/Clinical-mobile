import { create, isAxiosError } from 'axios';

import { env } from '@/shared/constants/env';

import { ApiError } from './types';

export const client = create({
  baseURL: env.API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Lazily imported to avoid circular deps at module load time
type AuthStateAccessor = () => {
  accessToken: string | null;

  clearSession: () => void;
};

let getAuthState: AuthStateAccessor | null = null;

export function registerAuthStore(store: AuthStateAccessor) {
  getAuthState = store;
}

client.interceptors.request.use((config) => {
  const token = getAuthState?.().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401 && getAuthState) {
      getAuthState().clearSession();
    }

    return Promise.reject(toApiError(error));
  },
);

function toApiError(error: unknown): ApiError {
  if (isAxiosError(error)) {
    const data = error.response?.data as
      | {
          code?: string;
          error?: string;
          message?: string;
          detail?: string | { msg?: string; message?: string }[];
        }
      | undefined;
    const detail = Array.isArray(data?.detail)
      ? (data.detail[0]?.msg ?? data.detail[0]?.message)
      : data?.detail;
    const msg = data?.message ?? detail ?? data?.error ?? error.message;
    return new ApiError(msg, error.response?.status ?? 0, data?.code ?? data?.error);
  }
  return new ApiError('Unknown error', 0);
}
