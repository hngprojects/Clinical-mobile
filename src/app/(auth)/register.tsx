import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { RegisterForm } from '@/features/auth';
import { Screen, Typography } from '@/shared/components';

export default function RegisterScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen scrollable padding>
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Create Account
          </Typography>
          <Typography variant="body1" color="#686868" style={styles.subtitle}>
            Insert your details to create your account in minutes
          </Typography>
        </View>
        <RegisterForm />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 46,
    marginTop: 78,
  },
  title: {
    color: '#202124',
    fontSize: 34,
    lineHeight: 42,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    marginTop: 8,
  },
});
