export const brand = {
  colors: {
    onboardingBackground: '#FFFFFF',
    onboardingSplashBackground: '#F3F7FC',
    onboardingPrimaryCta: '#11519A',
    onboardingSecondaryBorder: '#D0D0D0',
    onboardingSecondaryText: '#6A6A6A',
    onboardingTitle: '#1F1F1F',
    onboardingSubtitle: '#5F5F5F',
    onboardingLink: '#0D6DDB',
    onboardingWordmark: '#0D6DDB',
    onboardingAccent: '#0D6DDB',
    white: '#FFFFFF',
  },
  fonts: {
    interRegular: 'Inter_400Regular',
    interSemiBold: 'Inter_600SemiBold',
    playfairMedium: 'PlayfairDisplay_500Medium',
  },
} as const;

export type Brand = typeof brand;
