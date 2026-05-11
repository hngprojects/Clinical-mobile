import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useLabResultsStore } from '../store/lab-results.store';

const STEPS = [
  { status: 'extracting', label: 'Extracting data from your file...' },
  { status: 'interpreting', label: 'Interpreting lab values...' },
  { status: 'finalizing', label: 'Preparing your results...' },
] as const;

export function AIProcessing() {
  const { colors, spacing } = useTheme();
  const { processingStatus, setProcessingStatus } = useLabResultsStore();

  useEffect(() => {
    // Simulated processing sequence for demo
    const timer1 = setTimeout(() => setProcessingStatus('interpreting'), 3000);
    const timer2 = setTimeout(() => setProcessingStatus('finalizing'), 6000);
    const timer3 = setTimeout(() => setProcessingStatus('done'), 9000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [setProcessingStatus]);

  const currentStep = STEPS.find((s) => s.status === processingStatus) || STEPS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Typography variant="body1" align="center" style={styles.text}>
          {currentStep.label}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  text: {
    fontWeight: '600',
    fontSize: 18,
  },
});
