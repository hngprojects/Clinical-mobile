import { Inter_400Regular, Inter_600SemiBold, useFonts } from '@expo-google-fonts/inter';
import { PlayfairDisplay_500Medium } from '@expo-google-fonts/playfair-display';
import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import Toast from 'react-native-toast-message';

import { queryClient } from '@/shared/api/queryClient';
import { toastConfig } from '@/shared/components/ToastConfig';
import { ThemeProvider } from '@/shared/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    PlayfairDisplay_500Medium,
  });

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toast config={toastConfig} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
