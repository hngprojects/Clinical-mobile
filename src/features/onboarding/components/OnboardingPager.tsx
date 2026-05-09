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

import { OnboardingSlideData } from '../data/slides';
import { OnboardingDots } from './OnboardingDots';
import { OnboardingSlide } from './OnboardingSlide';

const BASE_FRAME_WIDTH = 375;
const BASE_FRAME_HEIGHT = 812;
const MAX_CONTENT_WIDTH = 390;
const AUTO_ADVANCE_MS = 5000;

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
  const layoutScale = Math.min(
    Math.max(Math.min(width / BASE_FRAME_WIDTH, height / BASE_FRAME_HEIGHT), 0.7),
    1.15,
  );
  const contentWidth = Math.min(width - 32, MAX_CONTENT_WIDTH);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSlide = (currentSlide + 1) % slides.length;
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
      onSlideChange(nextSlide);
    }, AUTO_ADVANCE_MS);

    return () => clearTimeout(timer);
  }, [currentSlide, onSlideChange, slides.length, width]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: currentSlide * width, animated: false });
  }, [currentSlide, width]);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== currentSlide) onSlideChange(index);
  };

  const accentColor = slides[currentSlide]?.accentColor;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
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
            paddingBottom: 34 * layoutScale,
            gap: 20 * layoutScale,
          },
        ]}
      >
        <OnboardingDots total={slides.length} current={currentSlide} accentColor={accentColor} />

        <Pressable style={styles.primaryButton} onPress={onGetStarted}>
          <Text style={styles.primaryButtonText}>Get started</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={onContinueAsGuest}>
          <Text style={styles.secondaryButtonText}>Continue as guest</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <Pressable onPress={onLogin} hitSlop={8}>
            <Text style={styles.loginLink}>Login</Text>
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
    height: 45,
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
    height: 45,
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
    paddingTop: 4,
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
