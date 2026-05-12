import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { Button, GoogleLogo, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { useRegister } from '../hooks/useRegister';
import { RegisterFormData, registerSchema } from '../schemas/auth.schemas';

const AUTH_BLUE = '#1F6DC9';

type FieldName = keyof RegisterFormData;

interface RegisterFormProps {
  isOtpSent?: boolean;
  onOtpSent: (email: string) => void;
  onVerifyEmailPress?: () => void;
}

export function RegisterForm({
  isOtpSent = false,
  onOtpSent,
  onVerifyEmailPress,
}: RegisterFormProps) {
  const { colors, spacing } = useTheme();
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending, error } = useRegister();
  const { startGoogleAuth, isOpeningGoogleAuth } = useGoogleAuth();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');
  const showCriteria = focusedField === 'password' || password.length > 0;
  const criteria = [
    { label: 'Password must have 8 characters', met: password.length >= 8 },
    { label: 'Password must have one upper case', met: /[A-Z]/.test(password) },
    { label: 'Password must have one special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const showComingSoon = () => {
    Toast.show({
      type: 'info',
      text1: 'Coming soon',
      text2: 'ClinSight is working on this.',
      position: 'bottom',
    });
  };

  const onSubmit = (data: RegisterFormData) => {
    register(
      {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        password: data.password,
        confirmPassword: data.confirmPassword,
      },
      {
        onSuccess: () => onOtpSent(data.email.trim()),
      },
    );
  };

  return (
    <View style={styles.container}>
      <ControlledInput
        control={control}
        name="firstName"
        label="First Name"
        placeholder="Enter your first name"
        textContentType="givenName"
        autoCapitalize="words"
        isFocused={focusedField === 'firstName'}
        error={errors.firstName?.message}
        onFocus={() => setFocusedField('firstName')}
        onBlur={() => setFocusedField(null)}
      />

      <ControlledInput
        control={control}
        name="lastName"
        label="Last Name"
        placeholder="Enter your last name"
        textContentType="familyName"
        autoCapitalize="words"
        isFocused={focusedField === 'lastName'}
        error={errors.lastName?.message}
        onFocus={() => setFocusedField('lastName')}
        onBlur={() => setFocusedField(null)}
      />

      <ControlledInput
        control={control}
        name="email"
        label="Email"
        placeholder="Enter your email"
        keyboardType="email-address"
        textContentType="emailAddress"
        isFocused={focusedField === 'email'}
        error={errors.email?.message}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
      />

      <View style={styles.passwordBlock}>
        <ControlledInput
          control={control}
          name="password"
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          textContentType="newPassword"
          isFocused={focusedField === 'password'}
          error={errors.password?.message}
          rightAccessory={
            password.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((v) => !v)}
                hitSlop={10}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={22}
                  color={colors.text}
                />
              </Pressable>
            ) : null
          }
          onFocus={() => setFocusedField('password')}
          onBlur={() => setFocusedField(null)}
        />

        {showCriteria && (
          <View style={styles.criteriaList}>
            {criteria.map((item) => (
              <View key={item.label} style={styles.criteriaRow}>
                <Ionicons
                  name={item.met ? 'checkmark' : 'close'}
                  size={18}
                  color={item.met ? colors.success : colors.error}
                  style={styles.criteriaIcon}
                />
                <Typography
                  variant="body1"
                  color={item.met ? colors.success : colors.textSecondary}
                  style={styles.criteriaText}
                >
                  {item.label}
                </Typography>
              </View>
            ))}
          </View>
        )}
      </View>

      <ControlledInput
        control={control}
        name="confirmPassword"
        label="Confirm Password"
        placeholder="Retype your password"
        secureTextEntry={!showConfirmPassword}
        textContentType="newPassword"
        isFocused={focusedField === 'confirmPassword'}
        error={errors.confirmPassword?.message}
        rightAccessory={
          watch('confirmPassword').length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={
                showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
              }
              onPress={() => setShowConfirmPassword((v) => !v)}
              hitSlop={10}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color={colors.text}
              />
            </Pressable>
          ) : null
        }
        onFocus={() => setFocusedField('confirmPassword')}
        onBlur={() => setFocusedField(null)}
      />

      {error && (
        <Typography variant="body1" color={colors.error} align="center" style={styles.apiError}>
          {error.message}
        </Typography>
      )}

      <Button
        label={isOtpSent ? 'Verify Email' : 'Continue'}
        loadingLabel="Creating Account..."
        loadingIndicatorColor={AUTH_BLUE}
        isLoading={isPending}
        disabled={!isOtpSent && !isValid}
        onPress={isOtpSent ? onVerifyEmailPress : handleSubmit(onSubmit)}
        accessibilityRole="button"
        style={[
          styles.continueButton,
          {
            backgroundColor: (isValid || isOtpSent) && !isPending ? AUTH_BLUE : '#F5F5F5',
            marginTop: spacing.sm,
          },
        ]}
        textStyle={styles.primaryButtonLabel}
      />

      <View style={styles.dividerRow}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Typography variant="body1" color={colors.textSecondary} style={styles.dividerText}>
          or
        </Typography>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>

      <AuthOptionButton
        label="Google"
        loadingLabel="Opening Google"
        isLoading={isOpeningGoogleAuth}
        showGoogleLogo
        onPress={startGoogleAuth}
      />
      <AuthOptionButton label="Continue as guest" onPress={showComingSoon} />

      <View style={styles.loginRow}>
        <Typography variant="body1" color={colors.textSecondary} style={styles.loginText}>
          Already have an account?{' '}
        </Typography>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/login')}>
          <Typography variant="body1" color={AUTH_BLUE} style={[styles.loginText, styles.linkText]}>
            Login
          </Typography>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Open Terms and Conditions"
        hitSlop={10}
        onPress={() => router.push('/(auth)/terms' as never)}
        style={styles.termsBlock}
      >
        <Typography
          variant="body1"
          align="center"
          color={colors.textSecondary}
          style={styles.termsText}
        >
          {"By continuing, you have read and agreed to ClinSight's"}
        </Typography>
        <Typography
          variant="body1"
          color={AUTH_BLUE}
          align="center"
          style={[styles.termsText, styles.linkText]}
        >
          Terms and Conditions.
        </Typography>
      </Pressable>
    </View>
  );
}

interface ControlledInputProps {
  control: ReturnType<typeof useForm<RegisterFormData>>['control'];
  name: FieldName;
  label: string;
  placeholder: string;
  isFocused: boolean;
  error?: string;
  rightAccessory?: React.ReactNode;
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
  textContentType?: 'emailAddress' | 'newPassword' | 'givenName' | 'familyName';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  onFocus: () => void;
  onBlur: () => void;
}

function ControlledInput({
  control,
  name,
  label,
  placeholder,
  isFocused,
  error,
  rightAccessory,
  keyboardType,
  secureTextEntry,
  textContentType,
  autoCapitalize,
  onFocus,
  onBlur,
}: ControlledInputProps) {
  const { colors } = useTheme();
  const showError = !!error && name !== 'password';

  return (
    <View style={styles.field}>
      <Typography variant="body1" color={colors.text} style={styles.label}>
        {label}
      </Typography>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur: handleBlur } }) => (
          <View
            style={[
              styles.inputShell,
              { backgroundColor: colors.inputBackground },
              isFocused && styles.inputShellActive,
              showError && { borderColor: colors.error },
            ]}
          >
            <TextInput
              value={value}
              onChangeText={onChange}
              onFocus={onFocus}
              onBlur={() => {
                handleBlur();
                onBlur();
              }}
              placeholder={placeholder}
              placeholderTextColor={colors.textSecondary}
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              textContentType={textContentType}
              autoCapitalize={autoCapitalize ?? 'none'}
              autoCorrect={false}
              style={[styles.textInput, { color: colors.text }]}
            />
            {rightAccessory}
          </View>
        )}
      />
      {showError && (
        <Typography variant="body1" color={colors.error} style={styles.fieldError}>
          {error}
        </Typography>
      )}
    </View>
  );
}

function AuthOptionButton({
  isLoading,
  label,
  loadingLabel,
  showGoogleLogo,
  onPress,
}: {
  isLoading?: boolean;
  label: string;
  loadingLabel?: string;
  showGoogleLogo?: boolean;
  onPress: () => void;
}) {
  const { colors, spacing } = useTheme();
  return (
    <Button
      label={label}
      loadingLabel={loadingLabel}
      isLoading={isLoading}
      loadingIndicatorColor={AUTH_BLUE}
      leftElement={showGoogleLogo ? <GoogleLogo size={20} /> : undefined}
      onPress={onPress}
      style={[
        styles.optionButton,
        {
          backgroundColor: '#FFFFFF',
          borderColor: '#D0D0D0',
          borderRadius: spacing.sm,
          paddingVertical: spacing.sm + 4,
        },
      ]}
      textColor={colors.textSecondary}
      textStyle={styles.optionLabel}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    width: '100%',
  },
  field: {
    gap: 3,
  },
  inputShell: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D0D0D0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 52,
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
  passwordBlock: {
    gap: 12,
  },
  criteriaList: {
    gap: 8,
  },
  criteriaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  criteriaIcon: {
    width: 18,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
  criteriaText: {
    fontSize: 14,
    lineHeight: 20,
  },
  fieldError: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -4,
  },
  apiError: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: -6,
  },
  dividerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginVertical: 2,
    paddingHorizontal: 32,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  primaryButtonLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  continueButton: {
    minHeight: 45,
  },
  optionButton: {
    borderWidth: 1.5,
    minHeight: 45,
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    lineHeight: 20,
  },
  termsBlock: {
    alignItems: 'center',
    marginTop: 18,
  },
  termsText: {
    fontSize: 12,
    lineHeight: 18,
  },
});
