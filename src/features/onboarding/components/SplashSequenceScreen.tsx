import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useTheme } from '@/shared/theme';

const SPLASH_SCREEN_NINE_DELAY_MS = 3000;
const SMART_ANIMATE_DURATION_MS = 300;
const SPLASH_SCREEN_NINE_HOLD_MS = 900;
const LOGO_SIZE = 96;
const WORDMARK_WIDTH = 240;
const WORDMARK_HEIGHT = 58;
const LOGO_WORDMARK_GAP = 22;
const FIGMA_FRAME_WIDTH = 375;
const FIGMA_FRAME_HEIGHT = 812;
const BACKGROUND_PATTERN_OPACITY = 0.03;
const logo = require('../../../../assets/images/splash-icon.png');
const patternTile = require('../../../../assets/images/splash-logo-pattern-tile.png');

export function SplashSequenceScreen() {
  const wordmarkOpacity = useRef(new Animated.Value(0)).current;
  const { brand } = useTheme();
  const { width, height } = useWindowDimensions();
  const scale = Math.min(width / FIGMA_FRAME_WIDTH, height / FIGMA_FRAME_HEIGHT);
  const scaledLogoSize = LOGO_SIZE * scale;
  const scaledWordmarkWidth = WORDMARK_WIDTH * scale;
  const scaledWordmarkHeight = WORDMARK_HEIGHT * scale;
  const scaledWordmarkFontSize = 50 * scale;

  useEffect(() => {
    const splashTransition = Animated.sequence([
      Animated.delay(SPLASH_SCREEN_NINE_DELAY_MS),
      Animated.timing(wordmarkOpacity, {
        toValue: 1,
        duration: SMART_ANIMATE_DURATION_MS,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]);

    const exitTimer = setTimeout(
      () => {
        router.replace('/(onboarding)/slides');
      },
      SPLASH_SCREEN_NINE_DELAY_MS + SMART_ANIMATE_DURATION_MS + SPLASH_SCREEN_NINE_HOLD_MS,
    );

    splashTransition.start();

    return () => {
      clearTimeout(exitTimer);
      splashTransition.stop();
      wordmarkOpacity.stopAnimation();
    };
  }, [wordmarkOpacity]);

  return (
    <View style={[styles.container, { backgroundColor: brand.colors.onboardingSplashBackground }]}>
      <StatusBar hidden />
      <View pointerEvents="none" style={styles.pattern}>
        <ImageBackground
          source={patternTile}
          style={StyleSheet.absoluteFill}
          imageStyle={styles.patternImage}
          resizeMode="repeat"
        />
      </View>
      <View style={[styles.brand, { top: height / 2 - scaledLogoSize / 2 }]}>
        <Image
          source={logo}
          style={[styles.logo, { width: scaledLogoSize, height: scaledLogoSize }]}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            styles.wordmarkFrame,
            {
              width: scaledWordmarkWidth,
              height: scaledWordmarkHeight,
              marginTop: LOGO_WORDMARK_GAP * scale,
              opacity: wordmarkOpacity,
            },
          ]}
        >
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.wordmark,
              {
                width: scaledWordmarkWidth,
                height: scaledWordmarkHeight,
                fontSize: scaledWordmarkFontSize,
                letterSpacing: -1 * scale,
                lineHeight: scaledWordmarkFontSize,
                color: brand.colors.onboardingWordmark,
                fontFamily: brand.fonts.playfairMedium,
              },
            ]}
          >
            Clinsight
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  pattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: BACKGROUND_PATTERN_OPACITY,
  },
  patternImage: {
    opacity: 1,
  },
  brand: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  wordmarkFrame: {
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  wordmark: {
    width: WORDMARK_WIDTH,
    height: WORDMARK_HEIGHT,
    fontSize: 50,
    letterSpacing: -1,
    lineHeight: 50,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
