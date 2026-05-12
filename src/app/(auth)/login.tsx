import { Stack } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { LoginForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TITLE_SCALE = Math.min(Math.max(SCREEN_WIDTH / 375, 1), 1.18);

export default function LoginScreen() {
  const { colors, spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <Screen scrollable padding={false} keyboardAvoiding>
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
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
  title: {
    fontSize: Math.round(32 * TITLE_SCALE),
    lineHeight: Math.round(40 * TITLE_SCALE),
  },
  subtitle: {
    fontSize: Math.round(17 * TITLE_SCALE),
    lineHeight: Math.round(26 * TITLE_SCALE),
    marginTop: 8,
  },
});
