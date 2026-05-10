import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Screen, Typography } from '@/shared/components';
import { useApiMutation } from '@/shared/api/hooks';

import { authApi } from '../api/auth.api';
import { AuthResponse } from '../api/auth.types';
import { useAuthStore } from '../store/auth.store';

const BLUE = '#1F6DC9';
const TEXT = '#202124';
const MUTED = '#686868';
const BORDER = '#D5D5D5';
const DISABLED = '#F4F4F4';
const ERROR = '#FF4247';
const SUCCESS = '#1FA586';

export function OtpVerificationScreen() {
  const { email: rawEmail } = useLocalSearchParams<{ email?: string }>();
  const email = typeof rawEmail === 'string' ? rawEmail : 'chiomaokafor@gmail.com';
  const inputRef = useRef<TextInput>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState<string | null>(null);
  const [verifiedSession, setVerifiedSession] = useState<AuthResponse | null>(null);
  const setSession = useAuthStore((state) => state.setSession);

  const digits = useMemo(() => Array.from({ length: 6 }, (_, index) => code[index] ?? ''), [code]);

  const verifyOtp = useApiMutation(authApi.verifySignUpOtp, {
    onSuccess: (session) => {
      setCodeError(null);
      setBannerError(null);
      setVerifiedSession(session);
    },
    onError: (error) => {
      if (error.code === 'INVALID_OTP') {
        setCodeError(error.message);
        setBannerError(null);
        return;
      }

      setCode('');
      setCodeError(null);
      setBannerError(error.message);
    },
  });

  const resendOtp = useApiMutation(authApi.resendSignUpOtp, {
    onSuccess: ({ expiresInSeconds }) => {
      setCode('');
      setCodeError(null);
      setBannerError(null);
      setTimeLeft(expiresInSeconds);
      inputRef.current?.focus();
    },
  });

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((value) => Math.max(0, value - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6));
    setCodeError(null);
  };

  const handleVerify = () => {
    if (code.length !== 6) return;
    verifyOtp.mutate({ email, code });
  };

  const handleGoHome = () => {
    if (!verifiedSession) return;
    setSession(verifiedSession.tokens, verifiedSession.user);
    router.replace('/(main)');
  };

  const isReady = code.length === 6;
  const isLoading = verifyOtp.isPending;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen padding={false}>
        {bannerError ? (
          <View style={styles.banner}>
            <Typography variant="body1" color={MUTED} align="center" style={styles.bannerText}>
              {bannerError}
            </Typography>
          </View>
        ) : (
          <View style={styles.header}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              hitSlop={12}
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>
            <Typography variant="h2" align="center" style={styles.headerTitle}>
              OTP Verification
            </Typography>
            <View style={styles.headerSpacer} />
          </View>
        )}

        <View style={styles.content}>
          <Typography variant="h1" style={styles.title}>
            Verify Your Email
          </Typography>
          <Typography variant="body1" color={MUTED} style={styles.subtitle}>
            Enter the 6 digit code we sent to{' '}
            <Typography variant="body1" style={styles.emailText}>
              {email}
            </Typography>
          </Typography>

          <View style={styles.otpSection}>
            <Typography variant="body1" color="#A0A0A0" style={styles.otpLabel}>
              OTP
            </Typography>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Enter OTP code"
              onPress={() => inputRef.current?.focus()}
              style={styles.otpRow}
            >
              {digits.map((digit, index) => {
                const isActive = code.length === index && !codeError;
                return (
                  <View
                    key={`${index}-${digit}`}
                    style={[
                      styles.otpBox,
                      (digit || isActive) && styles.otpBoxActive,
                      codeError && styles.otpBoxError,
                    ]}
                  >
                    <Typography variant="h1" align="center" style={styles.otpDigit}>
                      {digit}
                    </Typography>
                  </View>
                );
              })}
            </Pressable>
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              maxLength={6}
              autoFocus
              style={styles.hiddenInput}
            />
            {codeError && (
              <Typography variant="body1" color={ERROR} style={styles.codeError}>
                {codeError}
              </Typography>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={!isReady || isLoading}
            onPress={handleVerify}
            style={[styles.verifyButton, (!isReady || isLoading) && styles.verifyDisabled]}
          >
            {isLoading ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator color={BLUE} />
                <Typography variant="body1" color="#808080" style={styles.verifyText}>
                  Verifying Email
                </Typography>
              </View>
            ) : (
              <Typography
                variant="body1"
                color={isReady ? '#FFFFFF' : '#808080'}
                style={styles.verifyText}
              >
                Verify Email
              </Typography>
            )}
          </Pressable>

          {timeLeft > 0 ? (
            <View style={styles.timerRow}>
              <Typography variant="body1" color={MUTED} style={styles.timerText}>
                Code expires in{' '}
              </Typography>
              <Typography variant="body1" color="#000000" style={styles.timerValue}>
                00:{String(timeLeft).padStart(2, '0')}
              </Typography>
            </View>
          ) : (
            <View style={styles.resendRow}>
              <Typography variant="body1" style={styles.resendText}>
                {"Didn't receive the code? "}
              </Typography>
              <Pressable
                accessibilityRole="button"
                disabled={resendOtp.isPending}
                onPress={() => resendOtp.mutate(email)}
              >
                <Typography variant="body1" color={BLUE} style={styles.resendLink}>
                  Resend Code
                </Typography>
              </Pressable>
            </View>
          )}
        </View>
      </Screen>

      <Modal transparent visible={Boolean(verifiedSession)} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successCheck}>✓</Text>
              <View style={styles.successShadow} />
            </View>
            <Typography variant="h1" align="center" style={styles.successTitle}>
              Sign-up successful
            </Typography>
            <Typography variant="body1" color={MUTED} align="center" style={styles.successCopy}>
              Your account has been created.{'\n'}You can now proceed to uploading{'\n'}your lab
              results.
            </Typography>
            <Pressable accessibilityRole="button" onPress={handleGoHome} style={styles.homeButton}>
              <Typography variant="body1" color="#FFFFFF" style={styles.homeButtonText}>
                Go to Home Page
              </Typography>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 96,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
  },
  backText: {
    color: '#111827',
    fontSize: 44,
    lineHeight: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
  },
  headerSpacer: {
    width: 44,
  },
  banner: {
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    minHeight: 72,
    paddingHorizontal: 32,
  },
  bannerText: {
    fontSize: 18,
    lineHeight: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 36,
  },
  title: {
    color: TEXT,
    fontSize: 34,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
    marginTop: 14,
  },
  emailText: {
    color: TEXT,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 26,
  },
  otpSection: {
    marginTop: 62,
  },
  otpLabel: {
    fontSize: 18,
    marginBottom: 16,
  },
  otpRow: {
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'space-between',
  },
  otpBox: {
    alignItems: 'center',
    borderColor: BORDER,
    borderRadius: 10,
    borderWidth: 1.5,
    flex: 1,
    height: 60,
    justifyContent: 'center',
    maxWidth: 56,
  },
  otpBoxActive: {
    borderColor: BLUE,
  },
  otpBoxError: {
    borderColor: ERROR,
  },
  otpDigit: {
    color: '#000000',
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 38,
  },
  hiddenInput: {
    height: 1,
    opacity: 0,
    position: 'absolute',
    width: 1,
  },
  codeError: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 14,
  },
  verifyButton: {
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 14,
    height: 58,
    justifyContent: 'center',
    marginTop: 60,
  },
  verifyDisabled: {
    backgroundColor: DISABLED,
  },
  loadingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  verifyText: {
    fontSize: 20,
    fontWeight: '700',
  },
  timerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  timerText: {
    fontSize: 20,
  },
  timerValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  resendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 28,
  },
  resendText: {
    color: '#000000',
    fontSize: 20,
  },
  resendLink: {
    fontSize: 20,
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  successCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 26,
    width: '100%',
  },
  successIcon: {
    alignItems: 'center',
    backgroundColor: SUCCESS,
    borderRadius: 56,
    height: 112,
    justifyContent: 'center',
    marginBottom: 24,
    overflow: 'hidden',
    width: 112,
  },
  successCheck: {
    color: '#FFFFFF',
    fontSize: 66,
    fontWeight: '800',
    zIndex: 1,
  },
  successShadow: {
    backgroundColor: 'rgba(0, 0, 0, 0.22)',
    height: 90,
    position: 'absolute',
    right: -24,
    top: 48,
    transform: [{ rotate: '45deg' }],
    width: 90,
  },
  successTitle: {
    fontSize: 32,
    lineHeight: 40,
  },
  successCopy: {
    fontSize: 18,
    lineHeight: 28,
    marginTop: 20,
  },
  homeButton: {
    alignItems: 'center',
    backgroundColor: BLUE,
    borderRadius: 14,
    height: 58,
    justifyContent: 'center',
    marginTop: 28,
    width: '100%',
  },
  homeButtonText: {
    fontSize: 19,
    fontWeight: '700',
  },
});
