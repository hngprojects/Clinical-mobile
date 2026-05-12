import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { z } from 'zod';

import { Button, Typography } from '@/shared/components';
import { TextInput } from '@/shared/components/TextInput';
import { useTheme } from '@/shared/theme';

import { useResetPassword } from '../hooks/useResetPassword';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const { spacing, colors } = useTheme();
  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPassword(
      { token, new_password: data.newPassword },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => {
            router.replace('/(auth)/login');
          }, 2000);
        },
      },
    );
  };

  if (success) {
    return (
      <View style={[styles.container, { gap: spacing.md }]}>
        <Typography variant="h3" align="center" style={{ color: colors.success }}>
          ✓ Password reset successful!
        </Typography>
        <Typography variant="body2" align="center" color={colors.textSecondary}>
          Your password has been updated. Redirecting to login...
        </Typography>
      </View>
    );
  }

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            label="New Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.newPassword?.message}
            secureTextEntry={!showPassword}
            textContentType="newPassword"
            placeholder="Enter new password"
            rightElement={
              <Button
                variant="ghost"
                label={showPassword ? '👁' : '👁‍🗨'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmPassword?.message}
            secureTextEntry={!showConfirmPassword}
            textContentType="password"
            placeholder="Confirm your password"
            rightElement={
              <Button
                variant="ghost"
                label={showConfirmPassword ? '👁' : '👁‍🗨'}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        )}
      />

      {error && (
        <Typography variant="body2" color={colors.error} align="center">
          {error.message}
        </Typography>
      )}

      <Button
        label="Reset Password"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        style={{ marginTop: spacing.md }}
      />

      <Button label="Back to Login" variant="ghost" onPress={() => router.push('/(auth)/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
