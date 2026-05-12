import { useState } from 'react';
import * as ExpoLinking from 'expo-linking';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import Toast from 'react-native-toast-message';

import { env } from '@/shared/constants/env';

const GOOGLE_AUTH_URL = `${env.API_BASE_URL}/api/v1/auth/google`;
const GOOGLE_CALLBACK_PATH = 'auth/google/callback';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth() {
  const [isOpeningGoogleAuth, setIsOpeningGoogleAuth] = useState(false);

  const startGoogleAuth = async () => {
    setIsOpeningGoogleAuth(true);
    try {
      const callbackUrl = ExpoLinking.createURL(GOOGLE_CALLBACK_PATH);
      const authUrl = `${GOOGLE_AUTH_URL}?redirect_uri=${encodeURIComponent(callbackUrl)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, callbackUrl);

      if (result.type === 'success') {
        const parsed = ExpoLinking.parse(result.url);
        router.replace({
          pathname: `/${GOOGLE_CALLBACK_PATH}` as never,
          params: parsed.queryParams ?? {},
        });
        return;
      }

      if (result.type === 'cancel' || result.type === 'dismiss') {
        Toast.show({
          type: 'info',
          text1: 'Google sign in was cancelled.',
          position: 'bottom',
        });
        return;
      }

      Toast.show({
        type: 'error',
        text1: 'Google sign in could not be completed.',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: getGoogleAuthErrorMessage(error),
        position: 'bottom',
      });
    } finally {
      setIsOpeningGoogleAuth(false);
    }
  };

  return { startGoogleAuth, isOpeningGoogleAuth };
}

function getGoogleAuthErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Unable to open Google sign in.';
}
