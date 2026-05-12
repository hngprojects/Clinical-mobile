import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Toast from 'react-native-toast-message';

import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Button, Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import type { AuthTokens } from '../api/auth.types';

type CallbackParams = {
  access_token?: string | string[];
  accessToken?: string | string[];
  code?: string | string[];
  error?: string | string[];
  error_description?: string | string[];
  message?: string | string[];
  refresh_token?: string | string[];
  refreshToken?: string | string[];
};

function firstParam(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function getCallbackErrorMessage(params: CallbackParams) {
  return (
    firstParam(params.message) ?? firstParam(params.error_description) ?? firstParam(params.error)
  );
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Google sign in failed.';
}

export function GoogleAuthCallbackScreen() {
  const { colors, spacing } = useTheme();
  const params = useLocalSearchParams<CallbackParams>();
  const hasHandled = useRef(false);
  const [failed, setFailed] = useState(false);
  const [failureMessage, setFailureMessage] = useState(
    'We could not complete Google sign in. Please try again from the login screen.',
  );

  useEffect(() => {
    if (hasHandled.current) return;
    hasHandled.current = true;

    const finishGoogleAuth = async () => {
      try {
        const errorMessage = getCallbackErrorMessage(params);
        if (errorMessage) throw new Error(errorMessage);

        const code = firstParam(params.code);
        const accessToken = firstParam(params.access_token) ?? firstParam(params.accessToken);
        const refreshToken = firstParam(params.refresh_token) ?? firstParam(params.refreshToken);

        if (code) {
          const session = await authApi.googleCallback(code);
          useAuthStore.getState().setSession(session.tokens, session.user);
          router.replace('/(main)' as never);
          return;
        }

        if (accessToken) {
          const tokens: AuthTokens = { accessToken, refreshToken };
          useAuthStore.getState().setTokens(tokens);
          const user = await authApi.me();
          useAuthStore.getState().setSession(tokens, user);
          router.replace('/(main)' as never);
          return;
        }

        throw new Error('Google did not return a login token.');
      } catch (error) {
        const message = getErrorMessage(error);
        setFailed(true);
        setFailureMessage(message);
        Toast.show({
          type: 'error',
          text1: message,
          position: 'bottom',
        });
      }
    };

    finishGoogleAuth();
  }, [params]);

  return (
    <>
      <Stack.Screen options={{ title: 'Google Sign In', headerShown: false }} />
      <Screen padding={false}>
        <View style={[styles.content, { gap: spacing.lg, paddingHorizontal: spacing.lg }]}>
          {failed ? (
            <>
              <View style={[styles.iconCircle, { backgroundColor: '#FFF1F1' }]}>
                <Ionicons name="alert-circle-outline" size={38} color={colors.error} />
              </View>
              <Typography variant="h1" align="center" style={styles.title}>
                Google Sign In Failed
              </Typography>
              <Typography
                variant="body1"
                color={colors.textSecondary}
                align="center"
                style={styles.subtitle}
              >
                {failureMessage}
              </Typography>
              <Button
                label="Back to Login"
                onPress={() => router.replace('/(auth)/login' as never)}
                style={styles.button}
              />
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color={colors.primary} />
              <Typography variant="h1" align="center" style={styles.title}>
                Signing You In
              </Typography>
              <Typography
                variant="body1"
                color={colors.textSecondary}
                align="center"
                style={styles.subtitle}
              >
                Please wait while we complete your Google sign in.
              </Typography>
            </>
          )}
        </View>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 26,
  },
  button: {
    minHeight: 45,
    width: '100%',
  },
});
