import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen, Typography } from '@/shared/components';

const BLUE = '#1F6DC9';
const TEXT = '#111111';
const MUTED = '#686868';

type TermSection = {
  title: string;
  body: string[];
  bullets?: string[];
};

const TERMS: TermSection[] = [
  {
    title: '1. Introduction',
    body: [
      'These Terms and Conditions govern your access to and use of our platform. By using our services, you agree to comply with these terms.',
    ],
  },
  {
    title: '2. Use of the Services',
    body: [
      'Our platform provides AI-assisted interpretation of lab results and access to doctor consultations for second opinion.',
      'You agree to:',
    ],
    bullets: [
      'Provide accurate information',
      'Use the platform only for lawful purposes',
      'Not misuse or attempt to disrupt the system',
    ],
  },
  {
    title: '3. Medical Disclaimer',
    body: [
      'Our platform provides AI-assisted guidance only and is not a substitute for professional medical diagnosis or treatment.',
    ],
    bullets: [
      'The AI results are for informational purposes',
      'Doctors provide guidance based on available information',
      'Always seek in-person medical care for emergencies',
    ],
  },
  {
    title: '4. User Responsibilities',
    body: ['You are responsible for'],
    bullets: [
      'Ensuring the accuracy of the information you provide',
      'Using the platform responsibly',
    ],
  },
  {
    title: '5. Payments',
    body: ['Some features (e.g., doctor consultations) require payment.'],
    bullets: [
      'Payments are processed through secure third-party providers',
      'Fees are clearly displayed before payment',
      'Refund policies (if any) will be communicated within the platform',
    ],
  },
  {
    title: '6. Limitation of Liability',
    body: ['We are not liable for:'],
    bullets: [
      'Outcomes of doctor consultations',
      'Decisions made based on AI interpretations',
      'Refund policies (if any) will be communicated within the platform',
    ],
  },
  {
    title: '7. Termination',
    body: ['We reserve the right to suspend or terminate access if:'],
    bullets: ['You violate these terms', 'You misuse the platform'],
  },
  {
    title: '8. Changes to Terms',
    body: [
      'We may update these Terms of Use from time to time.',
      'Continued use of the platform means you accept any updates',
    ],
  },
  {
    title: '9. Contact Us',
    body: ['If you have any questions or concerns about these Terms, you can reach us at:'],
    bullets: ['Email: support@clinsight.com'],
  },
];

export default function TermsScreen() {
  const [openSections, setOpenSections] = useState<Set<number>>(() => new Set([0]));

  const toggleSection = (index: number) => {
    setOpenSections((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scrollable padding={false}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={12}
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#111827" />
          </Pressable>
          <Typography variant="h2" align="center" style={styles.headerTitle}>
            Terms
          </Typography>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.hero}>
          <View style={[styles.heroShape, styles.heroShapeOne]} />
          <View style={[styles.heroShape, styles.heroShapeTwo]} />
          <Typography variant="h1" color="#FFFFFF" align="center" style={styles.heroTitle}>
            Terms and Conditions
          </Typography>
          <Typography variant="body1" color="#FFFFFF" align="center" style={styles.heroSubtitle}>
            Last Updated, May 2026
          </Typography>
        </View>

        <View style={styles.sections}>
          {TERMS.map((section, index) => {
            const isOpen = openSections.has(index);
            return (
              <View key={section.title} style={styles.section}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${isOpen ? 'Collapse' : 'Expand'} ${section.title}`}
                  onPress={() => toggleSection(index)}
                  style={styles.sectionHeader}
                >
                  <Typography variant="h2" style={styles.sectionTitle}>
                    {section.title}
                  </Typography>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={30}
                    color="#111827"
                  />
                </Pressable>

                {isOpen && (
                  <View style={styles.sectionContent}>
                    {section.body.map((paragraph) => (
                      <Typography
                        key={paragraph}
                        variant="body1"
                        color={MUTED}
                        style={styles.bodyText}
                      >
                        {paragraph}
                      </Typography>
                    ))}
                    {section.bullets?.map((bullet) => (
                      <View key={bullet} style={styles.bulletRow}>
                        <Typography variant="body1" color={MUTED} style={styles.bulletMark}>
                          {'\u2022'}
                        </Typography>
                        <Typography variant="body1" color={MUTED} style={styles.bulletText}>
                          {bullet}
                        </Typography>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </Screen>
    </>
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
    width: 44,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  headerSpacer: {
    width: 44,
  },
  hero: {
    alignItems: 'center',
    backgroundColor: BLUE,
    height: 135,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroShape: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    height: 180,
    position: 'absolute',
    top: -24,
    transform: [{ rotate: '-14deg' }],
    width: 120,
  },
  heroShapeOne: {
    left: 225,
  },
  heroShapeTwo: {
    left: 330,
  },
  heroTitle: {
    fontSize: 32,
    lineHeight: 40,
  },
  heroSubtitle: {
    fontSize: 18,
    lineHeight: 28,
    marginTop: 10,
  },
  sections: {
    paddingBottom: 48,
    paddingHorizontal: 36,
    paddingTop: 34,
  },
  section: {
    marginBottom: 44,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: TEXT,
    flex: 1,
    fontSize: 25,
    fontWeight: '600',
    lineHeight: 34,
  },
  sectionContent: {
    marginTop: 42,
  },
  bodyText: {
    fontSize: 22,
    lineHeight: 32,
    marginBottom: 18,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
    paddingLeft: 8,
  },
  bulletMark: {
    fontSize: 20,
    lineHeight: 30,
  },
  bulletText: {
    flex: 1,
    fontSize: 20,
    lineHeight: 30,
  },
});
