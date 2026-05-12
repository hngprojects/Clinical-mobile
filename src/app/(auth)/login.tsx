import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function LoginScreen() {
  const { colors, spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Screen scrollable padding={false} keyboardAvoiding>
        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>
              Welcome Back
            </Typography>
            <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
              Sign in to continue to ClinSight
            </Typography>
          </View>

          <LoginForm />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 34,
    marginTop: 32,
  },
  title: {},
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
});
