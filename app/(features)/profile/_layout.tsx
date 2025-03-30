import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProfileLayout() {
  const { colors } = useProfileTabStyles();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'fade',
          animationDuration: 50,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="settings"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="details"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="membership"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="plans"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="payment"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="language"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="display"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="favorites"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
        <Stack.Screen
          name="checkin"
          options={{
            animation: 'fade',
            animationDuration: 50,
          }}
        />
      </Stack>
    </View>
  );
}
