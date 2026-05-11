import React, { forwardRef } from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/shared/theme';

import { Typography } from './Typography';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const TextInput = forwardRef<RNTextInput, AppTextInputProps>(
  ({ label, error, style, rightElement, containerStyle, ...props }, ref) => {
    const { colors, spacing, typography } = useTheme();

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <Typography variant="label" style={styles.label}>
            {label}
          </Typography>
        )}
        <View>
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              typography.body1,
              {
                color: colors.text,
                backgroundColor: colors.inputBackground,
                borderColor: error ? colors.error : colors.border,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm + 4,
                borderRadius: spacing.sm,
                paddingRight: rightElement ? 44 : spacing.md,
              },
              style,
            ]}
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
          />
          {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
        </View>
        {error && (
          <Typography variant="label" color={colors.error} style={styles.error}>
            {error}
          </Typography>
        )}
      </View>
    );
  },
);

TextInput.displayName = 'TextInput';

const styles = StyleSheet.create({
  container: { gap: 4 },
  label: { marginBottom: 2 },
  input: { borderWidth: 1.5 },
  error: { marginTop: 2 },
  rightElement: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
});