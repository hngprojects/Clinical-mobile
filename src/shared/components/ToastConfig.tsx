import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseToast, BaseToastProps, ToastConfig } from 'react-native-toast-message';

import { useTheme } from '@/shared/theme';
import { Typography } from './Typography';

function SuccessToast({ text1, text2 }: BaseToastProps) {
  const { colors } = useTheme();
  const isDark = colors.surface === '#1F2937' || colors.surface === '#000000';

  return (
    <View
      style={[
        styles.fullWidthContainer,
        {
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(240, 253, 250, 0.92)',
          borderColor: '#10B981',
        },
      ]}
    >
      <View
        style={[
          styles.toastContainer,
          {
            borderLeftColor: '#10B981',
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: '#10B981' }]}>
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          {text1 && (
            <Typography
              variant="body2"
              style={[styles.title, { color: isDark ? '#10B981' : '#059669' }]}
            >
              {text1}
            </Typography>
          )}
          {text2 && (
            <Typography
              variant="body2"
              style={[styles.description, { color: isDark ? '#D1D5DB' : '#374151' }]}
            >
              {text2}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

function ErrorToast({ text1, text2 }: BaseToastProps) {
  const { colors } = useTheme();
  const isDark = colors.surface === '#1F2937' || colors.surface === '#000000';

  return (
    <View
      style={[
        styles.fullWidthContainer,
        {
          backgroundColor: isDark ? 'rgba(28, 25, 23, 0.85)' : 'rgba(254, 242, 242, 0.92)',
          borderColor: '#EF4444',
        },
      ]}
    >
      <View
        style={[
          styles.toastContainer,
          {
            borderLeftColor: '#EF4444',
          },
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: '#EF4444' }]}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          {text1 && (
            <Typography
              variant="body2"
              style={[styles.title, { color: isDark ? '#FCA5A5' : '#DC2626' }]}
            >
              {text1}
            </Typography>
          )}
          {text2 && (
            <Typography
              variant="body2"
              style={[styles.description, { color: isDark ? '#D1D5DB' : '#374151' }]}
            >
              {text2}
            </Typography>
          )}
        </View>
      </View>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => <ErrorToast {...props} />,
  info: (props) => (
    <BaseToast
      {...props}
      style={styles.infoBase}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{ fontSize: 14, fontWeight: '600' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
};

const styles = StyleSheet.create({
  fullWidthContainer: {
    width: '90%',
    marginVertical: 8,
    overflow: 'hidden',
    borderRadius: 50,
    borderWidth: 1,
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 2,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  text: {
    flex: 1,
    color: '#166534',
    lineHeight: 20,
  },
  blurContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 999,
    overflow: 'hidden',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  errorIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(185, 28, 28, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  errorText: {
    flex: 1,
    color: '#FFFFFF',
    lineHeight: 20,
    fontWeight: '500',
  },
  errorBase: {
    borderLeftColor: '#EF4444',
    borderRadius: 12,
  },
  infoBase: {
    borderLeftColor: '#2563EB',
    borderRadius: 12,
  },
});
