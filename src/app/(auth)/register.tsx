import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RegisterForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export default function RegisterScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scrollable padding={false}>
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
          <View style={styles.header}>
            <Typography variant="h1" style={styles.title}>
              Create Account
            </Typography>
            <Typography variant="body1" style={styles.subtitle}>
              Insert your details to create your account in minutes
            </Typography>
          </View>
          <RegisterForm />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 46,
    marginTop: 78,
  },
  title: {
    color: '#1B1B1B',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 31.2,
    letterSpacing: -0.48,
  },
  subtitle: {
    color: '#5E5E5E',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    letterSpacing: -0.12,
    marginTop: 8,
  },
});
