import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useLabResultsStore } from '../store/lab-results.store';

export function FileUploadPreview() {
  const { colors, spacing } = useTheme();
  const { uploadStatus, selectedFile, progress, setUploadStatus, setProcessingStatus, reset } = useLabResultsStore();

  const isFailed = uploadStatus === 'failed' || uploadStatus === 'size_error';
  const isSuccess = uploadStatus === 'success';

  return (
    <View style={[styles.container, { backgroundColor: colors.background, padding: spacing.xl }]}>
      <View style={styles.header}>
        <Typography variant="h2">Preview Upload</Typography>
      </View>

      <View style={[styles.previewCard, { backgroundColor: colors.surface, padding: spacing.md }]}>
        {selectedFile && (
          <View style={styles.fileInfo}>
            <View style={[styles.fileIcon, { backgroundColor: colors.primarySubtle }]}>
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
            </View>
            <View>
              <Typography variant="body1" numberOfLines={1}>{selectedFile.name}</Typography>
              <Typography variant="body2" color={colors.textSecondary}>
                {selectedFile.type.toUpperCase()} • {selectedFile.size}
              </Typography>
            </View>
          </View>
        )}

        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: selectedFile?.uri || 'https://via.placeholder.com/300' }} 
            style={styles.image} 
            resizeMode="cover"
          />
          {uploadStatus === 'uploading' && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: colors.primary }]} />
            </View>
          )}
        </View>

        {isFailed && (
          <View style={styles.errorContainer}>
            <View style={[styles.errorIcon, { backgroundColor: '#FEE2E2' }]}>
              <Ionicons name="alert-circle" size={32} color={colors.error} />
            </View>
            <Typography variant="body2" color={colors.error} align="center">
              {uploadStatus === 'size_error' 
                ? "There was a problem uploading your lab result. File size must be less than 10MB."
                : "There was a problem uploading your lab result. Please select a different file or try again."
              }
            </Typography>
          </View>
        )}

        {isSuccess && (
          <View style={styles.successBadge}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Typography variant="label" color={colors.success}>Upload successful</Typography>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {isFailed ? (
          <Button label="Retry" onPress={() => setUploadStatus('uploading')} />
        ) : isSuccess ? (
          <>
            <Button label="Get AI Review" onPress={() => setProcessingStatus('extracting')} />
            <Button label="Upload Another" variant="secondary" onPress={reset} />
          </>
        ) : (
          <Button label="Cancel" variant="secondary" onPress={reset} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 24,
  },
  header: {
    paddingTop: 20,
  },
  previewCard: {
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
  },
  errorContainer: {
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDF4',
    paddingVertical: 8,
    borderRadius: 8,
  },
  footer: {
    marginTop: 'auto',
    gap: 12,
    paddingBottom: 20,
  },
});
