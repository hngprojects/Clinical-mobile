import { ScrollView, Text } from 'react-native';
import { Stack } from 'expo-router';

const forgotPassword = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Login', headerShown: false }} />
      <ScrollView style={{ flex: 1 }}>
        <Text>forgotPassword</Text>
      </ScrollView>
    </>
  );
};

export default forgotPassword;
