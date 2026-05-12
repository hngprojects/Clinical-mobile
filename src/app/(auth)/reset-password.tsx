import { Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';

import { Typography } from '@/shared/components';
import { Screen } from '@/shared/components/Screen';
import { useTheme } from '@/shared/theme';

import { ResetPasswordForm } from '@/features/auth';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { spacing } = useTheme();

  if (!token) {
    return (
      <>
        <Stack.Screen options={{ title: 'Reset Password', headerShown: false }} />
        <Screen>
          <Typography variant="h2">Invalid Reset Link</Typography>
          <Typography variant="body1" style={{ marginTop: spacing.md }}>
            The reset link is invalid or has expired. Please request a new password reset.
          </Typography>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Reset Password', headerShown: false }} />
      <Screen scrollable padding>
        <Typography variant="h2" style={{ marginBottom: spacing.xs }}>
          Reset Password
        </Typography>
        <Typography variant="body1" style={{ marginBottom: spacing.lg }}>
          Enter your new password below.
        </Typography>

        <ResetPasswordForm token={token} />
      </Screen>
    </>
  );
}
