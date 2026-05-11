import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export function InsightsScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.center}>
        <Typography variant="h2" align="center">
          Insights
        </Typography>
        <Typography variant="body1" color={colors.textSecondary} align="center">
          Your lab insights will appear here.
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 24 },
});
