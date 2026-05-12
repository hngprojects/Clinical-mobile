import { router, Stack, useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthSuccessBanner, RegisterForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

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
          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}>
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
          <AuthSuccessBanner message="We have sent a one-time-password to your email address." />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
