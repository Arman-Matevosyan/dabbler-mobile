import { Stack } from 'expo-router/stack';

export default function VenuesFeatureLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="details" options={{ title: 'Venue Details' }} />
    </Stack>
  );
}
