import React from 'react';
import { Image, ImageStyle, StyleSheet, useWindowDimensions, View } from 'react-native';

import { Typography } from '@/shared/components';

import { OnboardingSlideData } from '../data/slides';

const SLIDE_HORIZONTAL_PADDING = 16;
const BASE_FRAME_WIDTH = 375;
const BASE_FRAME_HEIGHT = 812;
const MAX_CONTENT_WIDTH = 390;
const ARTWORK_WRAP_BASE_HEIGHT = 320;
const SHORT_SCREEN_HEIGHT = 700;
const ARTWORK_RATIOS = {
  cards: 956 / 1372,
  beforeAfter: 1486 / 1120,
  doctorOrbit: 1,
} as const;

interface OnboardingSlideProps {
  slide: OnboardingSlideData;
}

export function OnboardingSlide({ slide }: OnboardingSlideProps) {
  const { width, height } = useWindowDimensions();
  const layoutScale = Math.min(
    Math.max(Math.min(width / BASE_FRAME_WIDTH, height / BASE_FRAME_HEIGHT), 0.7),
    1.15,
  );
  const contentWidth = Math.min(width - SLIDE_HORIZONTAL_PADDING * 2, MAX_CONTENT_WIDTH);
  const artworkHeightRatio = height < SHORT_SCREEN_HEIGHT ? 0.35 : 0.41;
  const textScale =
    height < SHORT_SCREEN_HEIGHT ? 1.1 : Math.min(Math.max(width / BASE_FRAME_WIDTH, 1.25), 1.32);
  const artworkWrapHeight = Math.min(
    ARTWORK_WRAP_BASE_HEIGHT * layoutScale,
    height * artworkHeightRatio,
  );

  return (
    <View style={[styles.container, { width, paddingHorizontal: SLIDE_HORIZONTAL_PADDING }]}>
      <View style={[styles.artworkWrap, { height: artworkWrapHeight }]}>
        <SlideArtwork
          slide={slide}
          contentWidth={contentWidth}
          artworkWrapHeight={artworkWrapHeight}
          layoutScale={layoutScale}
        />
      </View>

      <View style={[styles.copy, { width: contentWidth, marginTop: 24 * layoutScale }]}>
        <Typography
          variant="h1"
          align="center"
          style={[
            styles.title,
            {
              fontSize: 24 * textScale,
              lineHeight: 31 * textScale,
              letterSpacing: -0.48 * textScale,
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
  const maxArtworkWidth = Math.min(contentWidth, MAX_CONTENT_WIDTH);

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
    color: '#1F1F1F',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 24,
    lineHeight: 31,
    fontWeight: '600',
    letterSpacing: -0.48,
  },
  subtitle: {
    color: '#5F5F5F',
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.12,
  },
});
