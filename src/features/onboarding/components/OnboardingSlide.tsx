import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';

import { useTheme } from '@/shared/theme';
import { OnboardingSlideData } from '../data/slides';
import { ONBOARDING_LAYOUT, useOnboardingLayout } from '../hooks/useOnboardingLayout';

const ARTWORK_WRAP_BASE_HEIGHT = 320;
const ARTWORK_RATIOS = {
  cards: 956 / 1372,
  beforeAfter: 1486 / 1120,
  doctorOrbit: 1,
} as const;

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { brand } = useTheme();
  const { width, height, layoutScale, slideContentWidth, textScale } = useOnboardingLayout();
  const artworkHeightRatio = height < ONBOARDING_LAYOUT.shortScreenHeight ? 0.35 : 0.41;
  const artworkWrapHeight = Math.min(
    ARTWORK_WRAP_BASE_HEIGHT * layoutScale,
    height * artworkHeightRatio,
  );

  return (
    <View
      style={[
        styles.container,
        { width, paddingHorizontal: ONBOARDING_LAYOUT.slideHorizontalPadding },
      ]}
    >
      <View style={[styles.artworkWrap, { height: artworkWrapHeight }]}>
        <SlideArtwork
          slide={slide}
          contentWidth={slideContentWidth}
          artworkWrapHeight={artworkWrapHeight}
          layoutScale={layoutScale}
        />
      </View>

      <View style={[styles.copy, { width: slideContentWidth, marginTop: 24 * layoutScale }]}>
        <Typography
          variant="h1"
          align="center"
          style={[
            styles.title,
            {
              color: brand.colors.onboardingTitle,
              fontFamily: brand.fonts.interSemiBold,
              fontSize: 24,
              lineHeight: 31,
              letterSpacing: -0.48,
            },
          ]}
        >
          {slide.title}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          style={[
            styles.subtitle,
            {
              color: brand.colors.onboardingSubtitle,
              fontFamily: brand.fonts.interRegular,
              fontSize: 12 * textScale,
              lineHeight: 18 * textScale,
              letterSpacing: -0.12 * textScale,
            },
          ]}
        >
          {slide.subtitle}
        </Typography>
      </View>
    </View>
  );
}

interface SlideArtworkProps extends OnboardingSlideProps {
  contentWidth: number;
  artworkWrapHeight: number;
  layoutScale: number;
}

function SlideArtwork({ slide, contentWidth, artworkWrapHeight, layoutScale }: SlideArtworkProps) {
  const maxArtworkWidth = Math.min(contentWidth, ONBOARDING_LAYOUT.maxContentWidth);

  if (slide.artwork.variant === 'beforeAfter') {
    const ratio = ARTWORK_RATIOS.beforeAfter;
    const width = Math.min(maxArtworkWidth, 280 * layoutScale, artworkWrapHeight / ratio);

    return (
      <Image
        source={slide.artwork.source}
        resizeMode="contain"
        style={[styles.artwork, { width, height: width * ratio }]}
      />
    );
  }

  const imageStyle: ImageStyle =
    slide.artwork.variant === 'doctorOrbit'
      ? {
          width: Math.min(maxArtworkWidth, 335 * layoutScale, artworkWrapHeight),
          height: Math.min(maxArtworkWidth, 335 * layoutScale, artworkWrapHeight),
        }
      : {
          width: Math.min(maxArtworkWidth, 343 * layoutScale),
          height: Math.min(maxArtworkWidth, 343 * layoutScale) * ARTWORK_RATIOS.cards,
        };

  return (
    <Image
      source={slide.artwork.source}
      resizeMode="contain"
      style={[styles.artwork, imageStyle]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  artworkWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  artwork: {
    maxWidth: '100%',
  },
  copy: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '600',
    letterSpacing: -0.48,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.12,
  },
});
