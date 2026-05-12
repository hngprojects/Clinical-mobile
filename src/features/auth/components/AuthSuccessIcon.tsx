import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

export function AuthSuccessIcon() {
  return (
    <View style={styles.icon}>
      <Ionicons name="checkmark" size={58} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    alignItems: 'center',
    backgroundColor: '#18A883',
    borderRadius: 44,
    height: 88,
    justifyContent: 'center',
    width: 88,
  },
});
