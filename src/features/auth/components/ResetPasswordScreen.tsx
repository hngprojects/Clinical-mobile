import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, Screen, Typography } from '@/shared/components';
import { TextInput } from '@/shared/components/TextInput';
import { useTheme } from '@/shared/theme';

import { PASSWORD_RULES } from '../constants/passwordRules';
import { useResetPassword } from '../hooks/useResetPassword';
import { ResetPasswordFormData, resetPasswordSchema } from '../schemas/auth.schemas';
import { AuthHeader } from './AuthHeader';

const BLUE = '#1F6DC9';

export function ResetPasswordScreen() {
  const { colors, spacing } = useTheme();
  const { token: rawToken } = useLocalSearchParams<{ token?: string | string[] }>();
  const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
  const [isComplete, setIsComplete] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const { control, handleSubmit, formState, watch, setValue } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? '',
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    setValue('token', token ?? '', { shouldValidate: true });
  }, [setValue, token]);

  const password = watch('newPassword');
  const hasValidToken = typeof token === 'string' && token.length >= 16;

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      { token: data.token, newPassword: data.newPassword },
      {
        onSuccess: () => setIsComplete(true),
        onError: (err) => {
          Toast.show({
            type: 'error',
            text1: err.message || 'Unable to reset password.',
            position: 'bottom',
          });
        },
      },
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Reset Password', headerShown: false }} />
      <Screen scrollable padding={false} keyboardAvoiding>
        <AuthHeader
          title="Reset Password"
          onBack={() => router.replace('/(auth)/login' as never)}
          tintColor={colors.text}
        />

        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.xxl }}>
          {!hasValidToken ? (
            <View style={styles.centeredState}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF1F1' }]}>
                <Ionicons name="alert-circle-outline" size={38} color={colors.error} />
              </View>
              <Typography variant="h1" align="center" style={styles.title}>
                Invalid Reset Link
              </Typography>
              <Typography
                variant="body1"
                color={colors.textSecondary}
                align="center"
                style={styles.subtitle}
              >
                This password reset link is missing, invalid, or expired. Request a new link to
                continue.
              </Typography>
              <Button
                label="Request New Link"
                onPress={() => router.replace('/(auth)/forgot-password' as never)}
                style={styles.primaryButton}
              />
            </View>
          ) : isComplete ? (
            <View style={styles.centeredState}>
              <View style={[styles.iconCircle, { backgroundColor: '#ECFDF3' }]}>
                <Ionicons name="checkmark" size={38} color={colors.success} />
              </View>
              <Typography variant="h1" align="center" style={styles.title}>
                Password Reset
              </Typography>
              <Typography
                variant="body1"
                color={colors.textSecondary}
                align="center"
                style={styles.subtitle}
              >
                Your password has been updated. You can now log in with your new password.
              </Typography>
              <Button
                label="Back to Login"
                onPress={() => router.replace('/(auth)/login' as never)}
                style={styles.primaryButton}
              />
            </View>
          ) : (
            <View style={styles.content}>
              <View>
                <Typography variant="h1" style={styles.title}>
                  Create New Password
                </Typography>
                <Typography variant="body1" color={colors.textSecondary} style={styles.subtitle}>
                  Choose a new password for your ClinSight account.
                </Typography>
              </View>

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <TextInput
                    label="New Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    secureTextEntry={!showPassword}
                    textContentType="newPassword"
                    placeholder="Enter new password"
                    rightElement={
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        onPress={() => setShowPassword((value) => !value)}
                      >
                        <Ionicons
                          name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={22}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    }
                  />
                )}
              />

              {password ? (
                <View style={styles.rulesList}>
                  {PASSWORD_RULES.map((rule) => {
                    const isPassing = rule.test(password);
                    return (
                      <View key={rule.label} style={styles.ruleRow}>
                        <Ionicons
                          name={isPassing ? 'checkmark' : 'close'}
                          size={18}
                          color={isPassing ? colors.success : colors.error}
                          style={styles.ruleIcon}
                        />
                        <Typography
                          variant="body1"
                          color={isPassing ? colors.success : colors.textSecondary}
                          style={styles.ruleText}
                        >
                          {rule.label}
                        </Typography>
                      </View>
                    );
                  })}
                </View>
              ) : null}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                  <TextInput
                    label="Confirm Password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={error?.message}
                    secureTextEntry={!showConfirmPassword}
                    textContentType="newPassword"
                    placeholder="Retype new password"
                    rightElement={
                      <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel={
                          showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                        }
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        onPress={() => setShowConfirmPassword((value) => !value)}
                      >
                        <Ionicons
                          name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                          size={22}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    }
                  />
                )}
              />

              <Button
                label="Reset Password"
                loadingLabel="Resetting"
                isLoading={isPending}
                loadingIndicatorColor={BLUE}
                disabled={!formState.isValid}
                onPress={handleSubmit(onSubmit)}
                style={styles.primaryButton}
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
          )}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  centeredState: {
    alignItems: 'center',
    gap: 22,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginTop: 10,
  },
  primaryButton: {
    minHeight: 45,
    width: '100%',
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
  iconCircle: {
    alignItems: 'center',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  rulesList: {
    gap: 8,
    marginTop: -8,
  },
  ruleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ruleIcon: {
    width: 18,
  },
  ruleText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
