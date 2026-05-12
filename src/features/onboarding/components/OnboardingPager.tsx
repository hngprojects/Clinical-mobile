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
  const currentSlideRef = useRef(currentSlide);
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
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ x: currentSlideRef.current * width, animated: false });
    });

    return () => cancelAnimationFrame(frame);
  }, [width]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setTimeout(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [currentSlide, goToSlide, slides.length]);

  const syncSlideFromOffset = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    const clampedIndex = Math.min(Math.max(index, 0), slides.length - 1);
    if (clampedIndex !== currentSlide) onSlideChange(clampedIndex);
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
            marginTop: SUBTITLE_TO_DOTS_GAP,
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + FOOTER_BOTTOM_PADDING * layoutScale,
          },
        ]}
      >
        <OnboardingDots total={slides.length} current={currentSlide} accentColor={accentColor} />

        <Button
          label="Get started"
          onPress={onGetStarted}
          style={{ marginTop: DOTS_TO_PRIMARY_GAP, backgroundColor: brand.colors.onboardingPrimaryCta }}
          textColor={brand.colors.white}
        />

        <Button
          label="Continue as guest"
          variant="outline"
          onPress={onContinueAsGuest}
          style={{
            marginTop: 16,
            borderColor: brand.colors.onboardingSecondaryBorder,
            backgroundColor: brand.colors.white,
          }}
          textColor={brand.colors.onboardingSecondaryText}
        />

        <View style={[styles.loginRow, { marginTop: SECONDARY_TO_LOGIN_GAP }]}>
          <Text style={[styles.loginText, { color: brand.colors.onboardingSecondaryText }]}>
            Already have an account?{' '}
          </Text>
          <Pressable onPress={onLogin} hitSlop={8}>
            <Text style={[styles.loginLink, { color: brand.colors.onboardingLink }]}>
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
    alignSelf: 'stretch',
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  loginText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
  },
  loginLink: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Inter_600SemiBold',
    textDecorationLine: 'underline',
  },
});
