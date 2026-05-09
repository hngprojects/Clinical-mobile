import { ImageSourcePropType } from 'react-native';

export interface OnboardingSlideData {
  id: string;
  title: string;
  subtitle: string;
  accentColor: string;
  artwork: {
    source: ImageSourcePropType;
    variant: 'cards' | 'beforeAfter' | 'doctorOrbit';
  };
}

export const SLIDES: OnboardingSlideData[] = [
  {
    id: 'understand-results',
    title: 'Understand your lab results',
    subtitle: 'Upload your lab report and get a clear, simple explanation in seconds',
    accentColor: '#0D6DDB',
    artwork: {
      source: require('../../../../assets/images/onboarding/result-cards.png'),
      variant: 'cards',
    },
  },
  {
    id: 'no-more-guessing',
    title: 'No more guessing your results',
    subtitle: "Get clear explanations for every value and understand what's happening in your body",
    accentColor: '#0D6DDB',
    artwork: {
      source: require('../../../../assets/images/onboarding/before-after.png'),
      variant: 'beforeAfter',
    },
  },
  {
    id: 'doctor-second-opinion',
    title: "Get a doctor's second opinion",
    subtitle: 'You can request a verified doctor to review your results for an additional fee.',
    accentColor: '#0D6DDB',
    artwork: {
      source: require('../../../../assets/images/onboarding/doctor-orbit.png'),
      variant: 'doctorOrbit',
    },
  },
];
