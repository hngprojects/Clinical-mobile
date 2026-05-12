import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput as RNTextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useForgotPassword } from '../hooks/useForgotPassword';
import { ForgotPasswordFormData, forgotPasswordSchema } from '../schemas/auth.schemas';
import { AuthHeader } from './AuthHeader';
import { AuthSuccessBanner } from './AuthSuccessBanner';

const BLUE = '#1F6DC9';
const SUCCESS_BANNER_DURATION = 5000;

export function ForgotPasswordScreen() {
  const { colors, spacing } = useTheme();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  const { control, handleSubmit, formState } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    const email = data.email.trim();
    forgotPassword(
      { email },
      {
        onSuccess: () => setSubmittedEmail(email),
        onError: (err) => {
          Toast.show({
            type: 'error',
            text1: err.message || 'Unable to send reset link.',
            position: 'bottom',
          });
        },
      },
    );
  };

  useEffect(() => {
    if (!submittedEmail) return;

    const timeout = setTimeout(() => {
      setSubmittedEmail(null);
    }, SUCCESS_BANNER_DURATION);

    return () => clearTimeout(timeout);
  }, [submittedEmail]);

  return (
    <>
      <Stack.Screen options={{ title: 'Forgot Password', headerShown: false }} />
      <View style={styles.root}>
        <Screen scrollable padding={false} keyboardAvoiding>
          <AuthHeader
            title="Forgot Password"
            onBack={() => router.back()}
            tintColor={colors.text}
          />

          <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}>
            <View style={styles.content}>
              <View>
                <Typography variant="h1" style={styles.title}>
                  Forgot Password
                </Typography>
                <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
                  Enter the email linked to your account and we will send you a reset link.
                </Typography>
              </View>

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <View>
                    <Typography variant="body1" color={colors.text} style={styles.label}>
                      Email
                    </Typography>
                    <View
                      style={[
                        styles.inputShell,
                        { backgroundColor: colors.inputBackground },
                        isEmailFocused && styles.inputShellActive,
                        error && { borderColor: colors.error },
                      ]}
                    >
                      <RNTextInput
                        value={value}
                        onChangeText={onChange}
                        onFocus={() => setIsEmailFocused(true)}
                        onBlur={() => {
                          onBlur();
                          setIsEmailFocused(false);
                        }}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        placeholder="Enter your email"
                        placeholderTextColor={colors.textSecondary}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={[styles.textInput, { color: colors.text }]}
                      />
                    </View>
                    {error?.message && (
                      <Typography variant="body1" color={colors.error} style={styles.fieldError}>
                        {error.message}
                      </Typography>
                    )}
                  </View>
                )}
              />

              <Button
                label="Send reset link"
                loadingLabel="Sending"
                isLoading={isPending}
                loadingIndicatorColor={BLUE}
                disabled={!formState.isValid}
                onPress={handleSubmit(onSubmit)}
                style={styles.primaryButton}
                textStyle={styles.primaryButtonLabel}
              />

              <Pressable
                accessibilityRole="button"
                onPress={() => router.replace('/(auth)/login' as never)}
                style={styles.centerAction}
              >
                <Typography variant="body1" color={BLUE} style={styles.linkText}>
                  Back to Login
                </Typography>
              </Pressable>
            </View>
          </View>
        </Screen>

        {submittedEmail && (
          <AuthSuccessBanner
            message="We have sent a password reset link to your email address. Check spam or promotions if it is not in your inbox."
            style={styles.successBanner}
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    gap: 24,
  },
  successBanner: {
    top: 104,
  },
  title: {},
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  inputShell: {
    alignItems: 'center',
    borderColor: '#D0D0D0',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 52,
    justifyContent: 'space-between',
    marginTop: 3,
    paddingHorizontal: 20,
  },
  inputShellActive: {
    borderColor: '#1565C0',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    padding: 0,
  },
  fieldError: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  primaryButton: {
    minHeight: 45,
    width: '100%',
  },
  primaryButtonLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  centerAction: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
});
