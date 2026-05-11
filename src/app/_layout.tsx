import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';
import { AppProviders } from '@/providers/AppProviders';
import { useAppReady } from '@/shared/hooks/useAppReady';

import './global.css';

SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayoutNav() {
  const { isReady } = useAppReady();
  const { isLoggedIn } = useAuthSession();
  const hasCompleted = useOnboardingStore((s) => s.hasCompleted);

  // Hide splash only AFTER React has painted the navigation tree.
  // useEffect fires post-render/paint, so the correct screen is visible
  // underneath before the splash fades — no blank flash.
  useEffect(() => {
    if (!isReady) return;

    // Small defer to ensure native view controller is ready
    const timer = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 100);

    return () => clearTimeout(timer);
  }, [isReady]);

  if (!isReady) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!hasCompleted && <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />}
      {hasCompleted && !isLoggedIn && (
        <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      )}
      {isLoggedIn && <Stack.Screen name="(main)" options={{ animation: 'fade' }} />}
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
