import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import React from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';

import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TITLE_SCALE = Math.min(Math.max(SCREEN_WIDTH / 375, 1), 1.18);

export default function ForgotPassword() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Forgot Password', headerShown: false }} />
      <Screen scrollable padding={false} keyboardAvoiding>
        <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
          <View style={styles.headerRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => router.back()}
              style={[styles.backButton, { marginLeft: -spacing.lg }]}
            >
              <Ionicons name="chevron-back" size={28} color="#111827" />
            </Pressable>

            <Typography variant="h2" align="center" style={styles.headerTitle}>
              Forgot Password
            </Typography>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.headerBlock}>
            <Typography variant="h1" style={styles.title}>
              Forgot Password?
            </Typography>
            <Typography
              variant="body2"
              color={useTheme().colors.textSecondary}
              style={styles.subtitle}
            >
              Enter your email address and we&apos;ll send a link to reset your password.
            </Typography>
          </View>

          <ForgotPasswordForm />
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 64,
    paddingHorizontal: 2,
    marginTop: 8,
  },
  backButton: {
    width: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  headerSpacer: {
    width: 44,
  },
  heroSpacing: {
    height: 8,
  },

  headerBlock: {
    marginBottom: 40,
    marginTop: 12,
  },
  title: {
    fontSize: Math.round(32 * TITLE_SCALE),
    lineHeight: Math.round(40 * TITLE_SCALE),
    marginTop: 8,
    marginBottom: 8,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: Math.round(17 * TITLE_SCALE),
    lineHeight: Math.round(26 * TITLE_SCALE),
    marginTop: 8,
  },
});
