import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';

interface AuthHeaderProps {
  title: string;
  onBack: () => void;
  tintColor?: string;
}

export function AuthHeader({ title, onBack, tintColor = '#111827' }: AuthHeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        hitSlop={12}
        onPress={onBack}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={28} color={tintColor} />
      </Pressable>
      <Typography variant="h2" align="center" style={styles.headerTitle}>
        {title}
      </Typography>
      <View style={styles.headerSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 96,
    paddingHorizontal: 24,
  },
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 32,
  },
  headerSpacer: {
    width: 44,
  },
});
