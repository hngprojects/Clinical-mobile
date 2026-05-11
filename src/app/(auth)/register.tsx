import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

import { RegisterForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TITLE_SCALE = Math.min(Math.max(SCREEN_WIDTH / 375, 1), 1.18);
const SUCCESS_GREEN = '#22C55E';
const SUCCESS_BANNER_BACKGROUND = '#DEF6E7';
const SUCCESS_BANNER_TEXT = '#686868';

export default function RegisterScreen() {
  const { colors, spacing } = useTheme();
  const [otpSentEmail, setOtpSentEmail] = useState<string | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasNavigatedToOtpRef = useRef(false);

  const goToOtp = (email: string) => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    hasNavigatedToOtpRef.current = true;
    router.push({ pathname: '/(auth)/otp', params: { email } });
  };

  const handleOtpSent = (email: string) => {
    setOtpSentEmail(email);
    redirectTimerRef.current = setTimeout(() => {
      goToOtp(email);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (hasNavigatedToOtpRef.current) {
        hasNavigatedToOtpRef.current = false;
        setOtpSentEmail(null);
      }
    }, []),
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.root}>
        <Screen scrollable padding={false}>
          <View style={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl }}>
            <View style={styles.header}>
              <Typography variant="h1" style={styles.title}>
                Create Account
              </Typography>
              <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
                Insert your details to create your account in minutes
              </Typography>
            </View>
            <RegisterForm
              isOtpSent={Boolean(otpSentEmail)}
              onOtpSent={handleOtpSent}
              onVerifyEmailPress={() => otpSentEmail && goToOtp(otpSentEmail)}
            />
          </View>
        </Screen>

        {otpSentEmail && (
          <View pointerEvents="none" style={styles.banner}>
            <View style={styles.bannerIcon}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
            <Typography variant="body1" color={SUCCESS_BANNER_TEXT} style={styles.bannerText}>
              We have sent a one-time-password to your email address.
            </Typography>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  banner: {
    alignItems: 'center',
    backgroundColor: SUCCESS_BANNER_BACKGROUND,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 17,
    height: 82,
    left: 16,
    maxWidth: 343,
    padding: 20,
    position: 'absolute',
    right: 16,
    top: 62,
    zIndex: 10,
  },
  bannerIcon: {
    alignItems: 'center',
    backgroundColor: SUCCESS_GREEN,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  bannerText: {
    flex: 1,
    fontSize: Math.round(16 * TITLE_SCALE),
    lineHeight: Math.round(24 * TITLE_SCALE),
  },
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
