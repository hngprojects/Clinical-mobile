import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Typography } from '@/shared/components';

import { useRegister } from '../hooks/useRegister';
import { RegisterFormData, registerSchema } from '../schemas/auth.schemas';

const BLUE = '#1F6DC9';
const TEXT = '#202124';
const MUTED = '#686868';
const BORDER = '#D5D5D5';
const DISABLED = '#F4F4F4';
const ERROR = '#FF4247';
const SUCCESS = '#16833B';

type FieldName = keyof RegisterFormData;

export function RegisterForm() {
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { mutate: register, isPending, error } = useRegister();

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const password = watch('password');
  const showCriteria = focusedField === 'password' || password.length > 0;
  const criteria = useMemo(
    () => [
      {
        label: 'Password must have 8characters',
        met: password.length >= 8,
      },
      {
        label: 'Password must one upper case',
        met: /[A-Z]/.test(password),
      },
      {
        label: 'Password must one special character',
        met: /[^A-Za-z0-9]/.test(password),
      },
    ],
    [password],
  );

  const onSubmit = (data: RegisterFormData) => {
    register(
      { email: data.email.trim(), password: data.password },
      {
        onSuccess: () => {
          router.push({
            pathname: '/(auth)/otp',
            params: { email: data.email.trim() },
          });
        },
      },
    );
  };

  return (
    <View style={styles.container}>
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
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={10}
              >
                <Text style={styles.inputAction}>{showPassword ? 'Hide' : 'Show'}</Text>
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
                <Typography
                  variant="body1"
                  color={item.met ? SUCCESS : MUTED}
                  style={styles.criteriaText}
                >
                  {item.met ? '✓' : '×'} {item.label}
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
              onPress={() => setShowConfirmPassword((value) => !value)}
              hitSlop={10}
            >
              <Text style={styles.inputAction}>{showConfirmPassword ? 'Hide' : 'Show'}</Text>
            </Pressable>
          ) : null
        }
        onFocus={() => setFocusedField('confirmPassword')}
        onBlur={() => setFocusedField(null)}
      />

      {error && (
        <Typography variant="body2" color={ERROR} align="center" style={styles.apiError}>
          {error.message}
        </Typography>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={!isValid || isPending}
        onPress={handleSubmit(onSubmit)}
        style={[styles.primaryButton, (!isValid || isPending) && styles.disabledButton]}
      >
        {isPending ? (
          <View style={styles.loadingContent}>
            <ActivityIndicator color={BLUE} />
            <Typography variant="body1" color="#808080" style={styles.buttonText}>
              Creating Account...
            </Typography>
          </View>
        ) : (
          <Typography
            variant="body1"
            color={isValid ? '#FFFFFF' : '#808080'}
            style={styles.buttonText}
          >
            Continue
          </Typography>
        )}
      </Pressable>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Typography variant="body1" color={MUTED} style={styles.dividerText}>
          or
        </Typography>
        <View style={styles.divider} />
      </View>

      <AuthOptionButton label="Google" icon="G" />
      <AuthOptionButton label="Continue as guest" />

      <View style={styles.loginRow}>
        <Typography variant="body1" color={MUTED} style={styles.loginText}>
          Already have an account?{' '}
        </Typography>
        <Pressable accessibilityRole="button" onPress={() => router.push('/(auth)/login')}>
          <Typography variant="body1" color={BLUE} style={styles.linkText}>
            Login
          </Typography>
        </Pressable>
      </View>

      <View style={styles.termsBlock}>
        <Typography variant="body1" align="center" style={styles.termsText}>
          {"By continuing, you have read and agreed to ClinSight's"}
        </Typography>
        <Pressable accessibilityRole="link">
          <Typography variant="body1" color={BLUE} align="center" style={styles.linkText}>
            Terms and Conditions.
          </Typography>
        </Pressable>
      </View>
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
  textContentType?: 'emailAddress' | 'newPassword';
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
  onFocus,
  onBlur,
}: ControlledInputProps) {
  return (
    <View style={styles.field}>
      <Typography variant="body1" style={styles.label}>
        {label}
      </Typography>
      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur: handleBlur } }) => (
          <View
            style={[
              styles.inputShell,
              isFocused && styles.focusedInput,
              error && name === 'confirmPassword' && styles.errorInput,
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
              placeholderTextColor="#8C8C8C"
              keyboardType={keyboardType}
              secureTextEntry={secureTextEntry}
              textContentType={textContentType}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.textInput}
            />
            {rightAccessory}
          </View>
        )}
      />
      {error && name === 'confirmPassword' && (
        <Typography variant="body1" color={ERROR} style={styles.fieldError}>
          {error}
        </Typography>
      )}
    </View>
  );
}

function AuthOptionButton({ label, icon }: { label: string; icon?: string }) {
  return (
    <Pressable accessibilityRole="button" style={styles.optionButton}>
      <View style={styles.optionContent}>
        {icon && <Text style={styles.googleIcon}>{icon}</Text>}
        <Typography variant="body1" color={MUTED} style={styles.optionLabel}>
          {label}
        </Typography>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    width: '100%',
  },
  field: {
    gap: 10,
  },
  label: {
    color: TEXT,
    fontSize: 20,
    lineHeight: 28,
  },
  inputShell: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 18,
    borderWidth: 1.5,
    flexDirection: 'row',
    height: 58,
    paddingHorizontal: 22,
  },
  focusedInput: {
    borderColor: BLUE,
  },
  errorInput: {
    borderColor: ERROR,
  },
  textInput: {
    color: TEXT,
    flex: 1,
    fontSize: 18,
    lineHeight: 24,
    padding: 0,
  },
  inputAction: {
    color: TEXT,
    fontSize: 14,
    fontWeight: '700',
  },
  passwordBlock: {
    gap: 12,
  },
  criteriaList: {
    gap: 8,
  },
  criteriaRow: {
    flexDirection: 'row',
  },
  criteriaText: {
    fontSize: 16,
    lineHeight: 24,
  },
  fieldError: {
    marginTop: -4,
  },
  apiError: {
    marginTop: -6,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 18,
    height: 58,
    justifyContent: 'center',
    marginTop: 12,
  },
  disabledButton: {
    backgroundColor: DISABLED,
  },
  loadingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
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
    backgroundColor: '#E8E8E8',
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 18,
  },
  optionButton: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 58,
    justifyContent: 'center',
  },
  optionContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  googleIcon: {
    color: '#4285F4',
    fontSize: 28,
    fontWeight: '800',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  loginRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginText: {
    fontSize: 17,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 17,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  termsBlock: {
    alignItems: 'center',
    marginTop: 18,
  },
  termsText: {
    color: TEXT,
    fontSize: 16,
    lineHeight: 24,
  },
});
