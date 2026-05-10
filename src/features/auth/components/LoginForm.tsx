import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { Button, Typography } from '@/shared/components';
import { TextInput } from '@/shared/components/TextInput';
import { useTheme } from '@/shared/theme';

import { useLogin } from '../hooks/useLogin';
import { LoginFormData, loginSchema } from '../schemas/auth.schemas';
import { PASSWORD_RULES } from '../constants/passwordRules';

const googleSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.8055 8.0415H19V8H10V12H15.6515C14.827 14.3285 12.6115 16 10 16C6.6865 16 4 13.3135 4 10C4 6.6865 6.6865 4 10 4C11.5295 4 12.921 4.577 13.9805 5.5195L16.809 2.691C15.023 1.0265 12.634 0 10 0C4.4775 0 0 4.4775 0 10C0 15.5225 4.4775 20 10 20C15.5225 20 20 15.5225 20 10C20 9.3295 19.931 8.675 19.8055 8.0415Z" fill="#FFC107"/>
<path d="M1.15332 5.3455L4.43882 7.755C5.32782 5.554 7.48082 4 10.0003 4C11.5298 4 12.9213 4.577 13.9808 5.5195L16.8093 2.691C15.0233 1.0265 12.6343 0 10.0003 0C6.15932 0 2.82832 2.1685 1.15332 5.3455Z" fill="#FF3D00"/>
<path d="M10.0002 20.0003C12.5832 20.0003 14.9302 19.0118 16.7047 17.4043L13.6097 14.7853C12.5721 15.5749 11.3039 16.0017 10.0002 16.0003C7.39916 16.0003 5.19066 14.3418 4.35866 12.0273L1.09766 14.5398C2.75266 17.7783 6.11366 20.0003 10.0002 20.0003Z" fill="#4CAF50"/>
<path d="M19.8055 8.0415H19V8H10V12H15.6515C15.2571 13.1082 14.5467 14.0766 13.608 14.7855L13.6095 14.7845L16.7045 17.4035C16.4855 17.6025 20 15 20 10C20 9.3295 19.931 8.675 19.8055 8.0415Z" fill="#1976D2"/>
</svg>`;

const eyeSlashSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.1995 12.8671C16.97 12.1023 17.5649 11.3422 17.9537 10.7971C18.207 10.4419 18.3337 10.2642 18.3337 10.0013C18.3337 9.73839 18.207 9.56072 17.9537 9.20547C16.8152 7.60917 13.908 4.16797 10.0003 4.16797C9.24383 4.16797 8.52483 4.29694 7.84888 4.51653M5.62318 5.62415C3.94298 6.7573 2.70212 8.28685 2.04703 9.20547C1.79367 9.56072 1.66699 9.73839 1.66699 10.0013C1.66699 10.2642 1.79367 10.4419 2.04703 10.7971C3.18541 12.3935 6.09264 15.8346 10.0003 15.8346C11.6593 15.8346 13.1379 15.2144 14.3775 14.3785" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.21488 8.33203C7.77319 8.7737 7.5 9.38395 7.5 10.0579C7.5 11.4059 8.59275 12.4987 9.94075 12.4987C10.6147 12.4987 11.225 12.2255 11.6667 11.7838" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"/>
<path d="M2.5 2.5L17.5 17.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const eyeSvg = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.04703 9.20547C1.79367 9.56072 1.66699 9.73839 1.66699 10.0013C1.66699 10.2642 1.79367 10.4419 2.04703 10.7971C3.18541 12.3935 6.09264 15.8346 10.0003 15.8346C13.908 15.8346 16.8152 12.3935 17.9537 10.7971C18.207 10.4419 18.3337 10.2642 18.3337 10.0013C18.3337 9.73839 18.207 9.56072 17.9537 9.20547C16.8152 7.60917 13.908 4.16797 10.0003 4.16797C6.09264 4.16797 3.18541 7.60917 2.04703 9.20547Z" stroke="#6B7280" stroke-width="1.5"/>
<path d="M12.5003 10.0013C12.5003 11.382 11.381 12.5013 10.0003 12.5013C8.61961 12.5013 7.50033 11.382 7.50033 10.0013C7.50033 8.62061 8.61961 7.50133 10.0003 7.50133C11.381 7.50133 12.5003 8.62061 12.5003 10.0013Z" stroke="#6B7280" stroke-width="1.5"/>
</svg>`;

const successCheckSvg = `<svg width="88" height="88" viewBox="0 0 88 88" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="87.981" height="87.981" fill="url(#pattern0_5729_42841)"/>
<defs>
<pattern id="pattern0_5729_42841" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_5729_42841" transform="scale(0.00195312)"/>
</pattern>
<image id="image0_5729_42841" width="512" height="512" preserveAspectRatio="none" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAX3AAAF9wBGQRXVgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAACgHSURBVHja7d17kFaFnefhCMiqIJfuVtkaxpJhLNfd2uDqupsqHQctZ2JNzRrXSLkpV8UMKKJIc5eLCAjNTTFEg0SXNbKjZAzgbNhJiRmNZdV6GWKWGY1l1EQpVpDJqGFcQIHu3t/RYwJJA315L+fy/PFUTWUShfO+7/l+ut/3PecL7e3tXwCy7dTvLDoxDA0jwiVhVBgXZocV4ZGwPmwKm8Oz4YXwcng1vBm2hffCh2FPOJjak/5n76X/nTfT/83L6T/j2fSfuSn9dzyS/jtnp3+GUemfaUT6ZzzRYwbZ5yBAfYe9bxgeLg1jwqLwaHg6bA3bw97QnjN70z/71vTv8mj6dxuT/l2Tv3NfzwEQAFDUge8Vzggjww1hflgbnksHsjWH414tekxeC49JvPTYzQyPWa9PIdAAEAexr4p/VX4xLAmbMnpT+9Z+i3ClvRYTkyPbZPnGggAqOev7ZP3u68Ny8OTYYfBrpkd6TFfnj4GI7ydAAIAqjH4yfvV14UHwyvhgBHOnAPpY/Ng+lgN99wFAQBdGfs+4fzQnH7ifadxza2d6WPYnD6mfTzHQQDA54M/IHw5LAjPpF+JM57FtCd9jBekj/kArwEEAJTrU/lfSj9x/lLJP4Vfdq3pc2B++pzwrQMEABRs9IeE68O68L7h4wjeT58jyXNliNcOAgDy+T7+RaEl/CS0GTe6qC197rSkzyWfH0AAQEZHf2D6k9uGsNuAUWG70+dW8hwb6DWHAKD6o38yuMbde4ANKS3gAAAABJRU5ErkJggg=="/>
</defs>
</svg>`;

interface PasswordRulesProps {
  value: string;
}

function PasswordRules({ value }: PasswordRulesProps) {
  const { colors } = useTheme();

  if (!value) return null;

  const failingRules = PASSWORD_RULES.filter((r) => !r.test(value));
  if (failingRules.length === 0) return null;

  return (
    <View style={styles.rulesContainer}>
      {failingRules.map((rule, i) => (
        <View key={i} style={styles.ruleRow}>
          <Typography variant="body2" color={colors.error} style={styles.ruleCross}>
            ✕
          </Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            {rule.label}
          </Typography>
        </View>
      ))}
    </View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return (
    <View style={styles.dividerRow}>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
      <Typography variant="body2" color={colors.textSecondary} style={styles.dividerText}>
        or
      </Typography>
      <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
    </View>
  );
}

interface GoogleButtonProps {
  onPress: () => void;
}

function GoogleButton({ onPress }: GoogleButtonProps) {
  const { colors, spacing } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.socialButton,
        {
          borderColor: colors.border,
          borderRadius: spacing.sm,
          paddingVertical: spacing.sm + 4,
        },
      ]}
      android_ripple={{ color: colors.border }}
    >
      <SvgXml xml={googleSvg} width={20} height={20} />
      <Typography variant="body1" style={{ marginLeft: 8, fontWeight: '500' }}>
        Google
      </Typography>
    </Pressable>
  );
}

interface SuccessModalProps {
  visible: boolean;
  onGoHome: () => void;
  onSignUp: () => void;
}

function SuccessModal({ visible, onGoHome, onSignUp }: SuccessModalProps) {
  const { colors, spacing } = useTheme();
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalCard,
            { backgroundColor: colors.surface, borderRadius: 16, padding: spacing.xl, gap: 20 },
          ]}
        >
          <SvgXml xml={successCheckSvg} width={88} height={88} />
          <Typography variant="h3" style={[{ textAlign: 'center' }, styles.fontHeadingSmall]}>
            Welcome back
          </Typography>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            style={[{ textAlign: 'center', maxWidth: 200 }, styles.fontXSmall]}
          >
            You&apos;ve successfully logged in. Ready to continue your journey?
          </Typography>
          <Button label="Go to Home Page" onPress={onGoHome} style={{ width: '100%' }} />
          <TouchableOpacity onPress={onSignUp} style={{ marginTop: spacing.md }}>
            <Typography
              variant="body2"
              color={colors.textSecondary}
              style={{ textAlign: 'center' }}
            >
              Don&apos;t have an account?{' '}
              <Typography variant="body2" color={colors.primary} style={{ fontWeight: '600' }}>
                Sign Up
              </Typography>
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function LoginForm() {
  const { spacing, colors } = useTheme();
  const { mutate: login, isPending, error } = useLogin();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const { control, handleSubmit, watch } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  });

  const passwordValue = watch('password');

  const onSubmit = (data: LoginFormData) => {
    setServerErrors([]);
    login(data, {
      onSuccess: () => setShowSuccess(true),
      onError: (err: Error) => {
        const msg = err?.message ?? 'Something went wrong. Please try again.';
        setServerErrors(msg.split('\n').filter(Boolean));
      },
    });
  };

  return (
    <>
      <View style={[styles.container, { gap: spacing.md }]}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur }, fieldState: { error: fe } }) => (
            <TextInput
              label="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={fe?.message}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="e.g johndoe@gmail.com"
              autoCapitalize="none"
            />
          )}
        />

        <View style={{ gap: 6 }}>
          <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                label="Password"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry={!showPassword}
                textContentType="password"
                placeholder="Enter your password"
                rightElement={
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <SvgXml xml={showPassword ? eyeSvg : eyeSlashSvg} width={20} height={20} />
                  </TouchableOpacity>
                }
              />
            )}
          />

          <PasswordRules value={passwordValue} />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={{ alignSelf: 'flex-end' }}
          >
            <Typography variant="label" color={colors.primary}>
              Forgot Password?
            </Typography>
          </TouchableOpacity>
        </View>

        {serverErrors.length > 0 && (
          <View style={styles.rulesContainer}>
            {serverErrors.map((e, i) => (
              <View key={i} style={styles.ruleRow}>
                <Typography variant="body2" color={colors.error} style={styles.ruleCross}>
                  ✕
                </Typography>
                <Typography variant="body2" color={colors.textSecondary}>
                  {e}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {error && !serverErrors.length && (
          <Typography variant="body2" color={colors.error} align="center">
            {error.message}
          </Typography>
        )}

        <Button
          label="Login"
          onPress={handleSubmit(onSubmit)}
          isLoading={isPending}
          style={{ marginTop: spacing.xs }}
        />

        <Divider />

        <GoogleButton onPress={() => {}} />

        <Button
          label="Continue as guest"
          variant="ghost"
          style={[
            styles.socialButton,
            {
              borderColor: colors.border,
              borderRadius: spacing.sm,
              paddingVertical: spacing.sm + 4,
            },
          ]}
          onPress={() => router.replace('/(main)')}
        />

        <View style={styles.signupRow}>
          <Typography variant="body2" color={colors.textSecondary}>
            Don&apos;t have an account?{' '}
          </Typography>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Typography variant="body2" color={colors.primary} style={{ fontWeight: '600' }}>
              Sign Up
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      <SuccessModal
        visible={showSuccess}
        onGoHome={() => {
          setShowSuccess(false);
          router.replace('/(main)');
        }}
        onSignUp={() => {
          setShowSuccess(false);
          router.push('/(auth)/register');
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },

  rulesContainer: { gap: 8 },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ruleCross: { width: 14 },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { paddingHorizontal: 4 },

  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fontHeadingSmall: {
    fontSize: 24,
    fontWeight: '600',
  },

  fontXSmall: {
    fontSize: 12,
    fontWeight: '400',
  }
});
