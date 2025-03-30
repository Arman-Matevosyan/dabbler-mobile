import { Stack } from 'expo-router/stack';

export default function ClassesRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="details" />
    </Stack>
  );
}
