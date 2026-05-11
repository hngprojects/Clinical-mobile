import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
}

interface NotificationItemProps {
  item: NotificationData;
  onAction?: (id: string) => void;
}

export function NotificationItem({ item, onAction }: NotificationItemProps) {
  const { colors, spacing } = useTheme();

  if (!item.isRead) {
    return (
      <View
        style={[
          styles.unreadCard,
          {
            backgroundColor: colors.cardBackground,
            borderRadius: 12,
            marginHorizontal: spacing.md,
          },
        ]}
      >
        <View style={[styles.unreadContent, { padding: spacing.md }]}>
          <View style={styles.titleRow}>
            <Typography variant="body1" style={styles.title}>
              {item.title}
            </Typography>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          </View>
          <Typography variant="body2" color={colors.textSecondary} style={styles.message}>
            {item.message}
          </Typography>
          <Typography variant="label" color={colors.textSecondary}>
            {item.timestamp}
          </Typography>
        </View>

        {item.actionLabel && (
          <>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Pressable
              onPress={() => onAction?.(item.id)}
              style={[styles.action, { paddingHorizontal: spacing.md, paddingVertical: 12 }]}
            >
              <Typography variant="body2" color={colors.primary} style={styles.actionLabel}>
                {item.actionLabel}
              </Typography>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={[styles.readItem, { paddingHorizontal: spacing.md, gap: 4 }]}>
      <Typography variant="body1" style={styles.title}>
        {item.title}
      </Typography>
      <Typography variant="body2" color={colors.textSecondary} style={styles.message}>
        {item.message}
      </Typography>
      <Typography variant="label" color={colors.textSecondary}>
        {item.timestamp}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  unreadCard: {
    overflow: 'hidden',
  },
  unreadContent: {
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionLabel: {
    fontWeight: '500',
  },
  readItem: {
    paddingVertical: 4,
  },
  title: {
    fontWeight: '700',
  },
  message: {
    lineHeight: 20,
  },
});
