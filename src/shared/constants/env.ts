import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

export const env = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? extra?.apiBaseUrl ?? 'https://api.example.com',
  DEV_RESET_ONBOARDING: process.env.EXPO_PUBLIC_DEV_RESET_ONBOARDING === 'true',
} as const;
