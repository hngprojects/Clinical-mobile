import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dimensions, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

import { Button, Typography } from '@/shared/components';
import { TextInput } from '@/shared/components/TextInput';
import { useTheme } from '@/shared/theme';

import { useForgotPassword } from '../hooks/useForgotPassword';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const { spacing, colors } = useTheme();
  const { mutate: sendLink, isPending, error } = useForgotPassword();
  const [sent, setSent] = useState(false);

  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const TEXT_SCALE = Math.min(Math.max(SCREEN_WIDTH / 375, 1), 1.12);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    sendLink(
      { email: data.email },
      {
        onSuccess: () => {
          setSent(true);
          Toast.show({
            type: 'success',
            text1: 'Check your email',
            text2: 'We sent a reset link to your inbox.',
          });
        },
        onError: (err: Error) => {
          const msg = err?.message ?? 'Failed to send reset link. Please try again.';
          Toast.show({ type: 'error', text1: msg });
        },
      },
    );
  };

  if (sent) {
    return (
      <View style={[styles.container, { gap: spacing.md }]}>
        <Typography variant="h3" style={{ textAlign: 'left' }}>
          Check your email
        </Typography>
        <Typography variant="body2" color={colors.textSecondary}>
          We’ve sent a link to reset your password. Tap the link in the email to open the app and
          continue.
        </Typography>

        <Button
          label="Back to Login"
          onPress={() => router.push('/(auth)/login')}
          style={{ marginTop: spacing.md }}
        />
      </View>
    );
  }

  const isDisabled = isPending || !isValid;

  return (
    <View style={[styles.container, { gap: spacing.lg }]}>
      <Controller
        control={control}
        name="email"
        render={({ field: { value, onChange, onBlur } }) => (
          <View>
            <Typography
              variant="body1"
              style={{
                fontSize: Math.round(16 * TEXT_SCALE),
                lineHeight: Math.round(24 * TEXT_SCALE),
                marginBottom: 6,
              }}
            >
              Email Address
            </Typography>
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="you@example.com"
              autoCapitalize="none"
              style={{
                fontSize: Math.round(17 * TEXT_SCALE),
                lineHeight: Math.round(25 * TEXT_SCALE),
              }}
            />
          </View>
        )}
      />

      {error && (
        <Typography variant="body2" color={colors.error}>
          {error.message}
        </Typography>
      )}

      <Button
        label="Send reset link"
        loadingLabel="Sending..."
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        disabled={isDisabled}
        contentStyle={styles.buttonContent}
        style={{ marginTop: spacing.md }}
        textStyle={{ color: isDisabled ? colors.textSecondary : undefined }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  buttonContent: {
    justifyContent: 'center',
    width: '100%',
  },
});
