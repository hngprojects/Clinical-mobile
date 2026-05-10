import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { NotificationData, NotificationItem } from './NotificationItem';

const emptyBell = require('../../../../assets/images/empty-bell.png');

const INITIAL_NOTIFICATIONS: NotificationData[] = [
  {
    id: '1',
    title: 'AI Analysis Complete',
    message: 'Your lab results have been simplified and are ready to view.',
    timestamp: '2m ago',
    isRead: false,
    actionLabel: 'View result',
  },
  {
    id: '2',
    title: 'Processing Your Report',
    message: 'AI is currently analyzing your lab results.',
    timestamp: '12m ago',
    isRead: true,
  },
  {
    id: '3',
    title: 'Report Uploaded',
    message: 'Your lab report has been uploaded successfully.',
    timestamp: '12m ago',
    isRead: true,
  },
];

export function NotificationsScreen() {
  const { colors, spacing } = useTheme();
  const [notifications, setNotifications] = useState<NotificationData[]>(INITIAL_NOTIFICATIONS);

  const hasUnread = notifications.some((n) => !n.isRead);
  const isEmpty = notifications.length === 0;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    Toast.show({
      type: 'success',
      text1: 'Your notifications is now up to date. All previous alerts have been marked as read.',
      visibilityTime: 4000,
      topOffset: 60,
    });
  };

  if (isEmpty) {
    return (
      <SafeAreaView style={[styles.fill, { backgroundColor: colors.surface }]} edges={['bottom']}>
        <View style={styles.center}>
          <Image source={emptyBell} style={styles.image} resizeMode="contain" />
          <View style={styles.textGroup}>
            <Typography variant="h2" align="center">
              No Notifications Yet!
            </Typography>
            <Typography variant="body1" color={colors.textSecondary} align="center">
              We'll notify you when there's something new to review.
            </Typography>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.surface }]} edges={['bottom']}>
      <ScrollView
        style={styles.fill}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.sectionHeader, { paddingHorizontal: spacing.md, paddingVertical: spacing.md }]}>
          <Typography variant="body1" style={styles.sectionLabel}>
            Today
          </Typography>
          <Pressable onPress={hasUnread ? markAllAsRead : undefined} hitSlop={8}>
            <Typography
              variant="body2"
              color={hasUnread ? colors.primary : colors.textSecondary}
              style={hasUnread ? styles.markRead : undefined}
            >
              Mark as read
            </Typography>
          </Pressable>
        </View>

        <View style={{ gap: spacing.lg }}>
          {notifications.map((item) => (
            <NotificationItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLabel: {
    fontWeight: '600',
  },
  markRead: {
    fontWeight: '500',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 24,
  },
  image: {
    width: 220,
    height: 200,
  },
  textGroup: {
    alignItems: 'center',
    gap: 8,
  },
});
