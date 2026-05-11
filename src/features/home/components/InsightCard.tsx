import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export interface Insight {
  id: string;
  title: string;
  timestamp: string;
}

interface InsightCardProps {
  insight: Insight;
  onMenuPress?: (id: string) => void;
}

export function InsightCard({ insight, onMenuPress }: InsightCardProps) {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: spacing.md,
          marginHorizontal: spacing.md,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.textGroup}>
          <Typography variant="body1" style={styles.title}>
            {insight.title}
          </Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            {insight.timestamp}
          </Typography>
        </View>
        <Pressable
          onPress={() => onMenuPress?.(insight.id)}
          hitSlop={8}
          style={styles.menuButton}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '600',
  },
  menuButton: {
    paddingLeft: 8,
  },
});
