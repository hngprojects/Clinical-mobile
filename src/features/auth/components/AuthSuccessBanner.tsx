import { Ionicons } from '@expo/vector-icons';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { Typography } from '@/shared/components';
const SUCCESS_GREEN = '#22C55E';
const SUCCESS_BANNER_BACKGROUND = '#DEF6E7';
const SUCCESS_BANNER_TEXT = '#686868';

interface AuthSuccessBannerProps {
  message: string;
  style?: StyleProp<ViewStyle>;
}

export function AuthSuccessBanner({ message, style }: AuthSuccessBannerProps) {
  return (
    <View pointerEvents="none" style={[styles.banner, style]}>
      <View style={styles.bannerIcon}>
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </View>
      <Typography variant="body1" color={SUCCESS_BANNER_TEXT} style={styles.bannerText}>
        {message}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    alignItems: 'flex-start',
    backgroundColor: SUCCESS_BANNER_BACKGROUND,
    borderRadius: 20,
    flexDirection: 'row',
    gap: 17,
    left: 16,
    maxWidth: 343,
    minHeight: 82,
    padding: 20,
    position: 'absolute',
    right: 16,
    top: 62,
    zIndex: 10,
  },
  bannerIcon: {
    alignItems: 'center',
    backgroundColor: SUCCESS_GREEN,
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    marginTop: 1,
    width: 24,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
