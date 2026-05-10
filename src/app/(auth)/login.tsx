import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { LoginForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function LoginScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Screen scrollable padding>
        {/* Header */}
        <View style={{ marginBottom: spacing.xl }}>
          <Typography variant="h2" style={{ marginBottom: spacing.xs }}>
            Welcome Back
          </Typography>
          <Typography variant="body2">
            Sign in to continue to{' '}
            <Typography variant="body2" style={{ fontWeight: '600' }}>
              Google
            </Typography>
          </Typography>
        </View>

        {/* Form */}
        <LoginForm />
      </Screen>
    </>
  );
}