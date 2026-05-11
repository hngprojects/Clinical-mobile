import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

interface UploadBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onUpload: () => void;
}

export function UploadBottomSheet({ isVisible, onClose, onUpload }: UploadBottomSheetProps) {
  const { colors, spacing } = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.content, { backgroundColor: colors.surface, padding: spacing.xl }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          
          <View style={styles.header}>
            <View style={[styles.iconContainer, { backgroundColor: colors.primarySubtle }]}>
              <Ionicons name="cloud-upload-outline" size={24} color={colors.primary} />
            </View>
            <Typography variant="h2" style={styles.title}>
              Upload lab results
            </Typography>
            <Typography variant="body2" color={colors.textSecondary} align="center">
              To get a detailed interpretation of your lab results, please upload a clear image or PDF of the results.
            </Typography>
          </View>

          <View style={styles.actions}>
            <Button 
              label="Upload Result" 
              onPress={() => {
                onClose();
                onUpload();
              }} 
            />
            <Button 
              label="Cancel" 
              variant="secondary" 
              onPress={onClose} 
            />
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 24,
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
});
