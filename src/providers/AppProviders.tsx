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
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
        <Toast config={toastConfig} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
