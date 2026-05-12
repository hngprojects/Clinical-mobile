import { TextStyle } from 'react-native';

export const typography = {
  h1: { fontSize: 24, lineHeight: 40, fontFamily: 'Inter_600SemiBold' } satisfies TextStyle,
  h2: { fontSize: 24, lineHeight: 32, fontFamily: 'Inter_600SemiBold' } satisfies TextStyle,
  h3: { fontSize: 20, lineHeight: 28, fontFamily: 'Inter_600SemiBold' } satisfies TextStyle,
  body1: { fontSize: 16, lineHeight: 24, fontFamily: 'Inter_400Regular' } satisfies TextStyle,
  body2: { fontSize: 14, lineHeight: 20, fontFamily: 'Inter_400Regular' } satisfies TextStyle,
  label: { fontSize: 12, lineHeight: 16, fontFamily: 'Inter_400Regular' } satisfies TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
