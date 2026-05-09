import React from 'react';
import { router } from 'expo-router';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';
import { Screen } from '@/shared/components';

export default function OnboardingSlidesScreen() {
  const { slides, currentSlide, skip, goToSlide } = useOnboarding();

  const goToLogin = async () => {
    await skip();
    router.replace('/(auth)/login');
  };

  return (
    <Screen padding={false} edges={['top', 'bottom']} style={{ backgroundColor: '#FFFFFF' }}>
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
