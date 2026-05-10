import React, { useCallback, useEffect, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { OnboardingSlideData } from '../data/slides';
import { useOnboardingLayout } from '../hooks/useOnboardingLayout';
import { OnboardingDots } from './OnboardingDots';
import { OnboardingSlide } from './OnboardingSlide';

const AUTO_ADVANCE_MS = 5000;
const SUBTITLE_TO_DOTS_GAP = 20;
const DOTS_TO_PRIMARY_GAP = 20;
const BUTTON_GAP = 20;
const SECONDARY_TO_LOGIN_GAP = 16;
const FOOTER_BOTTOM_PADDING = 18;

interface OnboardingPagerProps {
  slides: OnboardingSlideData[];
  currentSlide: number;
  onGetStarted: () => void;
  onContinueAsGuest: () => void;
  onLogin: () => void;
  onSlideChange: (index: number) => void;
}

export function OnboardingPager({
  slides,
  currentSlide,
  onGetStarted,
  onContinueAsGuest,
  onLogin,
  onSlideChange,
}: OnboardingPagerProps) {
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const { brand } = useTheme();
  const { width, layoutScale, pagerContentWidth, textScale, topBalanceOffset } =
    useOnboardingLayout();

  const goToSlide = useCallback(
    (index: number, animated = true) => {
      scrollRef.current?.scrollTo({ x: index * width, animated });
      onSlideChange(index);
    },
    [onSlideChange, width],
  );

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setTimeout(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [currentSlide, goToSlide, slides.length]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: currentSlide * width, animated: false });
    });

    return () => cancelAnimationFrame(frame);
  }, [currentSlide, width]);

  const syncSlideFromOffset = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) onSlideChange(index);
  };

  const accentColor = slides[currentSlide]?.accentColor;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: brand.colors.onboardingBackground,
          paddingTop: insets.top + topBalanceOffset,
        },
      ]}
    >
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={syncSlideFromOffset}
        onScrollEndDrag={syncSlideFromOffset}
        scrollEventThrottle={16}
        style={styles.slides}
      >
        {slides.map((slide) => (
          <OnboardingSlide key={slide.id} slide={slide} />
        ))}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            width: pagerContentWidth,
            marginTop: SUBTITLE_TO_DOTS_GAP,
            paddingBottom: insets.bottom + FOOTER_BOTTOM_PADDING * layoutScale,
          },
        ]}
      >
        <OnboardingDots total={slides.length} current={currentSlide} accentColor={accentColor} />

        <Button
          label="Get started"
          onPress={onGetStarted}
          style={[
            styles.primaryButton,
            {
              marginTop: DOTS_TO_PRIMARY_GAP,
              backgroundColor: brand.colors.onboardingPrimaryCta,
            },
          ]}
          textColor={brand.colors.white}
          textStyle={[
            styles.primaryButtonText,
            {
              fontFamily: brand.fonts.interSemiBold,
              fontSize: 14 * textScale,
              lineHeight: 21 * textScale,
            },
          ]}
        />

        <Button
          label="Continue as guest"
          onPress={onContinueAsGuest}
          style={[
            styles.secondaryButton,
            {
              marginTop: BUTTON_GAP * layoutScale,
              borderColor: brand.colors.onboardingSecondaryBorder,
              backgroundColor: brand.colors.white,
            },
          ]}
          textColor={brand.colors.onboardingSecondaryText}
          textStyle={[
            styles.secondaryButtonText,
            {
              fontFamily: brand.fonts.interSemiBold,
              fontSize: 14 * textScale,
              lineHeight: 21 * textScale,
            },
          ]}
        />

        <View style={[styles.loginRow, { marginTop: SECONDARY_TO_LOGIN_GAP }]}>
          <Text
            style={[
              styles.loginText,
              {
                color: brand.colors.onboardingSecondaryText,
                fontFamily: brand.fonts.interSemiBold,
                fontSize: 14 * textScale,
                lineHeight: 21 * textScale,
                letterSpacing: -0.14 * textScale,
              },
            ]}
          >
            Already have an account?{' '}
          </Text>
          <Pressable onPress={onLogin} hitSlop={8}>
            <Text
              style={[
                styles.loginLink,
                {
                  color: brand.colors.onboardingLink,
                  fontFamily: brand.fonts.interSemiBold,
                  fontSize: 14 * textScale,
                  lineHeight: 21 * textScale,
                  letterSpacing: -0.14 * textScale,
                },
              ]}
            >
              Login
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slides: {
    flexGrow: 0,
  },
  footer: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    minHeight: 45,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  primaryButtonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    minHeight: 45,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: -0.14,
  },
  loginLink: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: -0.14,
    textDecorationLine: 'underline',
  },
});
