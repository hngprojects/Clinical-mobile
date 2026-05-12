import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/theme';
import { TypographyVariant } from '@/shared/theme/typography';

import { Typography } from './Typography';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  leftElement?: React.ReactNode;
  loadingLabel?: string;
  loadingIndicatorColor?: string;
  variant?: ButtonVariant;
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  textColor?: string;
  labelVariant?: TypographyVariant;
}

export function Button({
  label,
  leftElement,
  loadingLabel,
  loadingIndicatorColor,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  contentStyle,
  textStyle,
  textColor: textColorOverride,
  labelVariant = 'body1',
  ...props
}: ButtonProps) {
  const { colors, spacing } = useTheme();
  const isDisabled = disabled || isLoading;

  const containerStyle = [
    styles.base,
    {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      opacity: isDisabled && variant !== 'primary' ? 0.6 : 1,
    },
    variant === 'primary' && {
      backgroundColor: isDisabled ? '#F5F5F5' : colors.primary,
    },
    variant === 'outline' && {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: colors.primary,
    },
    variant === 'ghost' && { backgroundColor: 'transparent' },
    style,
  ];

  const textColor =
    textColorOverride ??
    (variant === 'primary' ? (isDisabled ? colors.textSecondary : '#FFFFFF') : colors.primary);

  return (
    <Pressable
      style={({ pressed }) => [styles.pressable, pressed && !isDisabled && styles.pressed]}
      disabled={isDisabled}
      android_ripple={{ color: colors.primaryPressed }}
      {...props}
    >
      <View style={containerStyle}>
        <View style={[styles.content, contentStyle]}>
          {isLoading ? (
            <>
              <ActivityIndicator color={loadingIndicatorColor ?? textColor} size="small" />
              {loadingLabel ? (
                <Typography
                  variant={labelVariant}
                  color={textColor}
                  style={[styles.label, textStyle]}
                >
                  {loadingLabel}
                </Typography>
              ) : null}
            </>
          ) : (
            <>
              {leftElement}
              <Typography
                variant={labelVariant}
                color={textColor}
                style={[styles.label, textStyle]}
              >
                {label}
              </Typography>
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Inter_600SemiBold',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }],
  },
});
