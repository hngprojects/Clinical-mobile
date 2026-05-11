import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { STORAGE_KEYS } from '@/shared/constants/keys';
import { asyncStorage } from '@/shared/storage/asyncStorage';

import { brand } from './brand';
import { Colors, lightColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: Colors;
  brand: typeof brand;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'light' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    asyncStorage.getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE).then((saved) => {
      if (saved) setModeState(saved);
    });
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    await asyncStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
  }, []);

  const isDark = false;
  const colors = lightColors;

  const value = useMemo(
    () => ({ mode, setMode, colors, brand, typography, spacing, isDark }),
    [mode, setMode, colors, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
