import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { useHome } from '@/features/home';

export function ProfileScreen() {
  const { colors, spacing } = useTheme();
  const { user, logout } = useHome();

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : 'U';

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={[styles.center, { gap: spacing.lg }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Typography variant="h2" color="#FFFFFF">
            {initials}
          </Typography>
        </View>

        {user && (
          <View style={{ alignItems: 'center', gap: 4 }}>
            <Typography variant="h3">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color={colors.textSecondary}>
              {user.email}
            </Typography>
          </View>
        )}

        <Button label="Sign Out" variant="outline" onPress={logout} style={{ alignSelf: 'stretch', marginHorizontal: spacing.xl }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
