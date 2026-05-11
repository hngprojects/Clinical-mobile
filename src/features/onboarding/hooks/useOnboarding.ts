import { useCallback, useEffect, useRef, useState } from 'react';

import { SLIDES } from '../data/slides';
import { useOnboardingStore } from '../store/onboarding.store';

export function useOnboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const currentSlideRef = useRef(currentSlide);
  const { hasCompleted, completeOnboarding } = useOnboardingStore();

  const isLastSlide = currentSlide === SLIDES.length - 1;

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  const goToNext = useCallback(() => {
    if (currentSlideRef.current === SLIDES.length - 1) {
      completeOnboarding();
    } else {
      setCurrentSlide((i) => i + 1);
    }
  }, [completeOnboarding]);

  const goToPrevious = useCallback(() => {
    setCurrentSlide((i) => Math.max(0, i - 1));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(Math.min(Math.max(index, 0), SLIDES.length - 1));
  }, []);

  const skip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  return {
    hasCompleted,
    currentSlide,
    isLastSlide,
    slides: SLIDES,
    goToNext,
    goToPrevious,
    goToSlide,
    skip,
  };
}
