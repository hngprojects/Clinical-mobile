import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

interface UploadCardProps {
  onUpload?: () => void;
}

export function UploadCard({ onUpload }: UploadCardProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          marginHorizontal: spacing.md,
          padding: spacing.xl,
          borderRadius: 16,
          gap: spacing.md,
        },
      ]}
    >
      <View style={styles.textGroup}>
        <Typography variant="h2" align="center">
          Upload your result
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} align="center">
          Upload your lab report to get started
        </Typography>
      </View>

      <Pressable
        onPress={onUpload}
        style={({ pressed }) => [
          styles.uploadButton,
          {
            backgroundColor: pressed ? colors.primaryPressed : colors.primary,
            borderRadius: 12,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          },
        ]}
      >
        <Ionicons name="arrow-up-circle-outline" size={20} color="#FFFFFF" />
        <Typography variant="body1" color="#FFFFFF" style={styles.buttonLabel}>
          Upload Result
        </Typography>
      </Pressable>

      <Typography variant="label" color={colors.textSecondary} align="center">
        JPEG, PDF and PNG formats up to 10MB
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
  },
  textGroup: {
    alignItems: 'center',
    gap: 6,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
