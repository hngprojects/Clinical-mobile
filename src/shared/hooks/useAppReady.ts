import { useEffect, useState } from 'react';

import { secureStorage } from '@/shared/storage/secureStorage';

export function useAppReady() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const { authApi } = await import('@/features/auth/api/auth.api');
        const { useAuthStore } = await import('@/features/auth/store/auth.store');
        const { useOnboardingStore } = await import('@/features/onboarding/store/onboarding.store');

        const [tokens] = await Promise.all([
          secureStorage.getTokens(),
          useOnboardingStore.getState().loadFromStorage(),
        ]);

        if (tokens) {
          useAuthStore.getState().setTokens(tokens);
          try {
            const user = await authApi.me();
            useAuthStore.getState().setSession(tokens, user);
          } catch {
            useAuthStore.getState().clearSession();
          }
        }
      } catch (e) {
        console.warn('App init error:', e);
      } finally {
        setIsReady(true);
      }
    }

    init();
  }, []);

  return { isReady };
}
