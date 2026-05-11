import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { useHome } from '../hooks/useHome';
import { HomeHeader } from './HomeHeader';
import { RecentInsightsSection } from './RecentInsightsSection';
import { UploadCard } from './UploadCard';

const MOCK_INSIGHTS = [
  { id: '1', title: 'Hormone Health Discussion', timestamp: '2 mins ago' },
  { id: '2', title: 'Hormone Health Discussion', timestamp: '2 mins ago' },
  { id: '3', title: 'Hormone Health Discussion', timestamp: '2 mins ago' },
];

export function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { user } = useHome();

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]} edges={['top']}>
      <HomeHeader name={user?.firstName ?? 'User'} />
      <ScrollView
        style={styles.fill}
        contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <UploadCard />
        <RecentInsightsSection insights={MOCK_INSIGHTS} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
