import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const BASE_FRAME_WIDTH = 375;
const BASE_FRAME_HEIGHT = 812;
const MAX_CONTENT_WIDTH = 390;
const SHORT_SCREEN_HEIGHT = 700;
const TALL_SCREEN_HEIGHT = 830;
const SLIDE_HORIZONTAL_PADDING = 16;

export function useOnboardingLayout() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    // Scale responsively between 70% and 115% while respecting the base frame ratio.
    const layoutScale = Math.min(
      Math.max(Math.min(width / BASE_FRAME_WIDTH, height / BASE_FRAME_HEIGHT), 0.7),
      1.15,
    );
    const pagerContentWidth = Math.min(width - 32, MAX_CONTENT_WIDTH);
    const slideContentWidth = Math.min(width - SLIDE_HORIZONTAL_PADDING * 2, MAX_CONTENT_WIDTH);
    const textScale =
      height < SHORT_SCREEN_HEIGHT ? 1.1 : Math.min(Math.max(width / BASE_FRAME_WIDTH, 1.25), 1.32);
    const topBalanceOffset = height >= TALL_SCREEN_HEIGHT ? Math.min(height * 0.045, 44) : 0;

    return {
      width,
      height,
      layoutScale,
      pagerContentWidth,
      slideContentWidth,
      textScale,
      topBalanceOffset,
    };
  }, [height, width]);
}

export const ONBOARDING_LAYOUT = {
  maxContentWidth: MAX_CONTENT_WIDTH,
  shortScreenHeight: SHORT_SCREEN_HEIGHT,
  slideHorizontalPadding: SLIDE_HORIZONTAL_PADDING,
} as const;
