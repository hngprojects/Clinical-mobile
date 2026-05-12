import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

const emptyInsights = require('../../../../assets/images/empty-insights.png');

interface InsightsEmptyStateProps {
  onUpload?: () => void;
}

export function InsightsEmptyState({ onUpload }: InsightsEmptyStateProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <Image source={emptyInsights} style={styles.image} resizeMode="contain" />

      <View style={styles.textGroup}>
        <Typography variant="h2" align="center" style={styles.title}>
          No insights yet
        </Typography>
        <Typography variant="body1" color={colors.textSecondary} align="center">
          Upload your first lab report to get started
        </Typography>
      </View>

      <TouchableOpacity onPress={onUpload} activeOpacity={0.8} style={styles.uploadButton}>
        <Ionicons name="arrow-up-circle-outline" size={20} color="#FFFFFF" />
        <Typography variant="body1" color="#FFFFFF" style={styles.buttonLabel}>
          Upload Result
        </Typography>
      </TouchableOpacity>

      <Typography variant="label" color={colors.textSecondary} align="center">
        JPEG, PDF and PNG formats up to 10MB
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  image: {
    width: 220,
    height: 200,
    alignSelf: 'center',
  },
  textGroup: {
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontWeight: '700',
  },
  uploadButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonLabel: {
    fontWeight: '600',
  },
});
