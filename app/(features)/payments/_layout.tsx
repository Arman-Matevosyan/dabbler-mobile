import { Stack } from 'expo-router/stack';

export default function PaymentsFeatureLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom',
        animationDuration: 50,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        fullScreenGestureEnabled: true,
      }}
    >
      <Stack.Screen name="payment" />
      <Stack.Screen name="success" />
    </Stack>
  );
}
