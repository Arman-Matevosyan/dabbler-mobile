import { setupGlobalErrorHandling } from '@/api/errorInterceptor';
import '@/app/i18n'; // Import i18n configuration
import { Colors } from '@/constants/Colors';
import { TooltipProvider } from '@/contexts/TooltipContext';
import { useUserProfile } from '@/hooks/profile/useUserProfile';
import AuthProvider, { useAuth } from '@/providers/AuthProvider';
import NetworkProvider from '@/providers/NetworkProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from '@/providers/ThemeContext';
import { processSocialAuthDeepLink } from '@/services/auth/socialAuth';
import { initializeAuth } from '@/store/authStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreAllLogs(true);

setupGlobalErrorHandling();

const linking = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      Profile: 'profile',
    },
  },
};
initializeAuth().catch((error) => {
  console.error('Failed to initialize auth:', error);
});

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <CustomThemeProvider>
          <NetworkProvider>
            <AuthProvider>
              <TooltipProvider>
                <BottomSheetModalProvider>
                  <RootLayoutNav />
                </BottomSheetModalProvider>
              </TooltipProvider>
            </AuthProvider>
          </NetworkProvider>
        </CustomThemeProvider>
      </QueryProvider>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const { colorScheme } = useTheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isReady, setIsReady] = useState<boolean>(false);
  const colors = Colors[colorScheme];
  const auth = useAuth();
  const { refetch: fetchUser } = useUserProfile();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
      setIsReady(true);
    }
  }, [loaded]);

  useEffect(() => {
    const processUrl = async (url: string) => {
      // Delegate to the specialized function for social auth deep links
      await processSocialAuthDeepLink(url);
    };

    Linking.getInitialURL().then((url) => {
      if (url) processUrl(url);
    });

    const subscription = Linking.addEventListener('url', (event) => {
      processUrl(event.url);
    });

    return () => subscription.remove();
  }, []);

  if (!loaded || !isReady) return null;

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      <SafeAreaProvider>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.background }]}
            edges={['top']}
          >
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: {
                  backgroundColor: colors.background,
                },
                gestureEnabled: true,
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  animation: 'none',
                }}
              />
              <Stack.Screen
                name="(features)/profile"
                options={{
                  headerShown: false,
                  presentation: 'card',
                  animation: 'fade',
                  animationDuration: 50,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(features)/venues"
                options={{
                  headerShown: false,
                  animation: 'fade',
                  animationDuration: 50,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(features)/payments"
                options={{
                  headerShown: false,
                  animation: 'slide_from_bottom',
                  animationDuration: 50,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(auth)"
                options={{
                  presentation: 'transparentModal',
                  animation: 'fade',
                  animationDuration: 100,
                  contentStyle: {
                    backgroundColor: 'transparent',
                  },
                  gestureEnabled: true,
                  gestureDirection: 'vertical',
                }}
              />
              <Stack.Screen name="errorScreen" />
            </Stack>
          </SafeAreaView>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </View>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});
