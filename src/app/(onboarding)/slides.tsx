import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import React, { useEffect } from 'react';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';
import { Screen } from '@/shared/components';

export default function OnboardingSlidesScreen() {
  const { slides, currentSlide, skip, goToSlide } = useOnboarding();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync('#FFFFFF');
  }, []);

  const goToLogin = async () => {
    await skip();
    router.replace('/(auth)/login');
  };

  return (
    <Screen padding={false} edges={[]} style={{ backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <OnboardingPager
        slides={slides}
        currentSlide={currentSlide}
        onGetStarted={skip}
        onContinueAsGuest={skip}
        onLogin={goToLogin}
        onSlideChange={goToSlide}
      />
    </Screen>
  );
}
