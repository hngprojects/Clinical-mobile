import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button, FormField, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useRegister } from '../hooks/useRegister';
import { RegisterFormData, registerSchema } from '../schemas/auth.schemas';

export function RegisterForm() {
  const { spacing, colors } = useTheme();
  const { mutate: register, isPending, error } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterFormData) => register(data);

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { gap: spacing.md, paddingBottom: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.row, { gap: spacing.sm }]}>
          <View style={styles.flex}>
            <FormField control={control} name="firstName" label="First name" placeholder="John" />
          </View>

          <View style={styles.flex}>
            <FormField control={control} name="lastName" label="Last name" placeholder="Doe" />
          </View>
        </View>

        <FormField
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          textContentType="emailAddress"
          placeholder="john@example.com"
        />

        <FormField
          control={control}
          name="password"
          label="Password"
          secureTextEntry
          textContentType="newPassword"
          placeholder="••••••••"
        />

        <FormField
          control={control}
          name="confirmPassword"
          label="Confirm password"
          secureTextEntry
          textContentType="newPassword"
          placeholder="••••••••"
        />

        {error && (
          <Typography variant="body2" color="red" align="center">
            {error.message}
          </Typography>
        )}

        <Button
          label="Create Account"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={{ marginTop: spacing.xs }}
        />

        <View style={[styles.row, { justifyContent: 'center' }]}>
          <Typography variant="body2" className="text-gray-500">
            Already have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Typography variant="body2" color={colors.primary} style={{ fontWeight: '600' }}>
              Sign In
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
  },
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  flex: {
    flex: 1,
  },
});
