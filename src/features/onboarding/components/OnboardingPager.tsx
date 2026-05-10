import React, { useEffect, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingDots } from './OnboardingDots';
import { OnboardingSlide } from './OnboardingSlide';

const BASE_FRAME_WIDTH = 375;
const BASE_FRAME_HEIGHT = 812;
const MAX_CONTENT_WIDTH = 390;
const AUTO_ADVANCE_MS = 5000;
const SHORT_SCREEN_HEIGHT = 700;
const SUBTITLE_TO_DOTS_GAP = 20;
const DOTS_TO_PRIMARY_GAP = 20;
const BUTTON_GAP = 20;
const SECONDARY_TO_LOGIN_GAP = 16;
const TALL_SCREEN_HEIGHT = 830;
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
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const layoutScale = Math.min(
    Math.max(Math.min(width / BASE_FRAME_WIDTH, height / BASE_FRAME_HEIGHT), 0.7),
    1.15,
  );
  const contentWidth = Math.min(width - 32, MAX_CONTENT_WIDTH);
  const textScale =
    height < SHORT_SCREEN_HEIGHT ? 1.1 : Math.min(Math.max(width / BASE_FRAME_WIDTH, 1.25), 1.32);
  const topBalanceOffset = height >= TALL_SCREEN_HEIGHT ? Math.min(height * 0.045, 44) : 0;
  const currentSlideRef = useRef(currentSlide);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    let slideStateTimer: ReturnType<typeof setTimeout> | undefined;

    const timer = setTimeout(() => {
      const nextSlide = (currentSlideRef.current + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      slideStateTimer = setTimeout(() => {
        onSlideChange(nextSlide);
      }, 350);
    }, AUTO_ADVANCE_MS);

    return () => {
      clearTimeout(timer);
      if (slideStateTimer) clearTimeout(slideStateTimer);
    };
  }, [currentSlide, onSlideChange, slides.length, width]);

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
    <View style={[styles.container, { paddingTop: insets.top + topBalanceOffset }]}>
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
            width: contentWidth,
            marginTop: SUBTITLE_TO_DOTS_GAP,
            paddingBottom: insets.bottom + FOOTER_BOTTOM_PADDING * layoutScale,
          },
        ]}
      >
        <OnboardingDots total={slides.length} current={currentSlide} accentColor={accentColor} />

        <Pressable
          style={[styles.primaryButton, { marginTop: DOTS_TO_PRIMARY_GAP }]}
          onPress={onGetStarted}
        >
          <Text
            style={[
              styles.primaryButtonText,
              { fontSize: 14 * textScale, lineHeight: 21 * textScale },
            ]}
          >
            Get started
          </Text>
        </Pressable>

        <Pressable
          style={[styles.secondaryButton, { marginTop: BUTTON_GAP * layoutScale }]}
          onPress={onContinueAsGuest}
        >
          <Text
            style={[
              styles.secondaryButtonText,
              { fontSize: 14 * textScale, lineHeight: 21 * textScale },
            ]}
          >
            Continue as guest
          </Text>
        </Pressable>

        <View style={[styles.loginRow, { marginTop: SECONDARY_TO_LOGIN_GAP }]}>
          <Text
            style={[
              styles.loginText,
              {
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
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#11519A',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    minHeight: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#6A6A6A',
    fontFamily: 'Inter_600SemiBold',
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
    color: '#6A6A6A',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: -0.14,
  },
  loginLink: {
    color: '#0D6DDB',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '600',
    letterSpacing: -0.14,
    textDecorationLine: 'underline',
  },
});
