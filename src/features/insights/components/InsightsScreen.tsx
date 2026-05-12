import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { Insight, InsightCard } from '@/features/home/components/InsightCard';
import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { InsightsEmptyState } from './InsightsEmptyState';

const emptyInsights = require('../../../../assets/images/empty-insights.png');

const MOCK_INSIGHTS: Insight[] = [
  { id: '1', title: 'Hormone Health Discussion', timestamp: '2 mins ago' },
  { id: '2', title: 'Thyroid Function Report', timestamp: '1 hour ago' },
  { id: '3', title: 'Vitamin D Deficiency Analysis', timestamp: '3 hours ago' },
  { id: '4', title: 'Blood Sugar Level Review', timestamp: 'Yesterday' },
  { id: '5', title: 'Iron Level Assessment', timestamp: '2 days ago' },
];

export function InsightsScreen() {
  const { colors, spacing } = useTheme();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [insights, setInsights] = useState<Insight[]>(MOCK_INSIGHTS);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (query.trim()) {
      setIsSearching(true);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        setDebouncedQuery(query);
        setIsSearching(false);
      }, 500);
    } else {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      setIsSearching(false);
      setDebouncedQuery('');
    }
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  const filtered = debouncedQuery.trim()
    ? insights.filter((i) => i.title.toLowerCase().includes(debouncedQuery.toLowerCase()))
    : insights;

  const handleRename = (id: string, newTitle: string) => {
    try {
      setInsights((prev) => prev.map((i) => (i.id === id ? { ...i, title: newTitle } : i)));
      Toast.show({
        type: 'success',
        text1: `You have successfully renamed your Insight to ${newTitle}`,
        topOffset: 60,
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: "Sorry! We've encountered a problem renaming your Insight. Kindly try again.",
        topOffset: 60,
      });
    }
  };

  const handleDelete = (id: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== id));
    Toast.show({
      type: 'success',
      text1: 'Your Insight message has been successfully deleted',
      topOffset: 60,
    });
  };

  const clearSearch = () => {
    setQuery('');
    setDebouncedQuery('');
    setIsSearching(false);
  };

  const listData = isSearching || (debouncedQuery.trim() && filtered.length === 0) ? [] : filtered;

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.surface }]} edges={['top']}>
      {insights.length === 0 && !query ? (
        <View style={[styles.fill, { paddingHorizontal: spacing.md, paddingTop: spacing.md }]}>
          <Typography variant="h1" style={styles.title}>
            Insights
          </Typography>
          <InsightsEmptyState />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: spacing.xl, gap: spacing.sm }}
          ListHeaderComponent={
            <View
              style={{
                gap: spacing.md,
                paddingHorizontal: spacing.md,
                paddingTop: spacing.md,
                paddingBottom: spacing.sm,
              }}
            >
              <Typography variant="h1" style={styles.title}>
                Insights
              </Typography>
              <View
                style={[
                  styles.searchBar,
                  {
                    backgroundColor: colors.surface,
                    borderColor: focused ? colors.primary : colors.border,
                    paddingHorizontal: spacing.md,
                  },
                ]}
              >
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <TextInput
                  value={query}
                  onChangeText={setQuery}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search Insights"
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.searchInput, { color: colors.text }]}
                  returnKeyType="search"
                />
                {query.length > 0 && (
                  <Pressable onPress={clearSearch} hitSlop={8}>
                    <Ionicons name="close" size={18} color={colors.textSecondary} />
                  </Pressable>
                )}
              </View>
            </View>
          }
          ListEmptyComponent={
            isSearching ? (
              <View style={styles.centeredState}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Typography variant="body1" color={colors.textSecondary}>
                  Searching...
                </Typography>
              </View>
            ) : debouncedQuery.trim() && filtered.length === 0 ? (
              <View style={styles.centeredState}>
                <Image source={emptyInsights} style={styles.emptyImage} resizeMode="contain" />
                <Typography variant="h2" style={styles.title} align="center">
                  No matching insights
                </Typography>
                <Typography variant="body1" color={colors.textSecondary} align="center">
                  Try another keyword or upload a new result.
                </Typography>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <InsightCard insight={item} onRename={handleRename} onDelete={handleDelete} />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  title: { fontWeight: '700' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    height: 52,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  centeredState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
    gap: 12,
  },
  emptyImage: {
    width: 200,
    height: 180,
  },
});
