import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BaseToast, BaseToastProps, ToastConfig } from 'react-native-toast-message';

import { Typography } from './Typography';

function SuccessToast({ text1 }: BaseToastProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </View>
      <Typography variant="body2" style={styles.text}>
        {text1}
      </Typography>
    </View>
  );
}

export const toastConfig: ToastConfig = {
  success: (props) => <SuccessToast {...props} />,
  error: (props) => (
    <BaseToast
      {...props}
      style={styles.errorBase}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{ fontSize: 14, fontWeight: '600' }}
      text2Style={{ fontSize: 13 }}
    />
  ),
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
  errorBase: {
    borderLeftColor: '#EF4444',
    borderRadius: 12,
  },
  infoBase: {
    borderLeftColor: '#2563EB',
    borderRadius: 12,
  },
});
