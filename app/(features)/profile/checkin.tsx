import { useCheckin } from '@/hooks';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileCheckInScreen() {
  const { checkIn } = useCheckin()
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Check-In Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18 },
});
