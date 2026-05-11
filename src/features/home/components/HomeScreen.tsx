import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/shared/theme';

import { useHome } from '../hooks/useHome';
import { HomeHeader } from './HomeHeader';
import { RecentInsightsSection } from './RecentInsightsSection';
import { UploadCard } from './UploadCard';

import * as ImagePicker from 'expo-image-picker';
import { UploadBottomSheet, FileUploadPreview, AIProcessing, useLabResultsStore } from '@/features/lab-results';

const MOCK_INSIGHTS = [
  { id: '1', title: 'Hormone Health Discussion', timestamp: '2 mins ago' },
  { id: '2', title: 'Pregnancy Test Update', timestamp: '1 hour ago' },
  { id: '3', title: 'Menstrual Cycle Complications', timestamp: 'Yesterday' },
];

export function HomeScreen() {
  const { colors, spacing } = useTheme();
  const { user } = useHome();
  const [isSheetVisible, setIsSheetVisible] = React.useState(false);
  
  const { 
    uploadStatus, 
    processingStatus, 
    setUploadStatus, 
    setSelectedFile, 
    setProgress 
  } = useLabResultsStore();

  const handleUploadClick = () => {
    setIsSheetVisible(true);
  };

  const handleFileSelect = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      
      setSelectedFile({
        name: asset.fileName || `IMG_${Date.now()}.jpg`,
        size: asset.fileSize ? `${(asset.fileSize / (1024 * 1024)).toFixed(1)}MB` : '0.8MB',
        type: 'jpg',
        uri: asset.uri,
      });

      // Check for size error (simulating the failed upload 2 page)
      if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
        setUploadStatus('size_error');
        return;
      }

      setUploadStatus('uploading');
      
      // Simulated upload progress
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        setProgress(p);
        if (p >= 100) {
          clearInterval(interval);
          setUploadStatus('success');
        }
      }, 300);
    }
  };

  if (uploadStatus !== 'idle' && processingStatus !== 'done') {
    if (processingStatus !== 'extracting' || (uploadStatus === 'success' || uploadStatus === 'uploading' || uploadStatus.includes('error'))) {
       if (uploadStatus === 'success' && processingStatus !== 'extracting') {
         // show nothing here, will be handled by logic below
       }
    }
  }

  // Determine what to show
  if (processingStatus !== 'extracting' || (uploadStatus === 'success' && processingStatus !== 'extracting')) {
     // this is a bit complex for a single if, let's use a cleaner approach below
  }

  const isInFlow = uploadStatus !== 'idle' && processingStatus !== 'done';

  return (
    <SafeAreaView style={[styles.fill, { backgroundColor: colors.background }]} edges={['top']}>
      {isInFlow ? (
        uploadStatus === 'success' && (processingStatus === 'extracting' || processingStatus === 'interpreting' || processingStatus === 'finalizing') ? (
          <AIProcessing />
        ) : (
          <FileUploadPreview />
        )
      ) : (
        <>
          <HomeHeader name={user?.firstName ?? 'User'} />
          <ScrollView
            style={styles.fill}
            contentContainerStyle={{ gap: spacing.lg, paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          >
            <UploadCard onUpload={handleUploadClick} />
            <RecentInsightsSection insights={MOCK_INSIGHTS} />
          </ScrollView>
          <UploadBottomSheet 
            isVisible={isSheetVisible} 
            onClose={() => setIsSheetVisible(false)} 
            onUpload={handleFileSelect} 
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});
