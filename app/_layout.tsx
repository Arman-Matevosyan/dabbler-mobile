import { setupGlobalErrorHandling } from '@/api/errorInterceptor';
import '@/app/i18n';
import SplashScreen from '@/components/ui/SplashScreen';
import { Colors } from '@/constants/Colors';
import { TooltipProvider } from '@/contexts/TooltipContext';
import { NetworkProvider } from '@/providers/NetworkProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import {
  ThemeProvider as CustomThemeProvider,
  useTheme,
} from '@/providers/ThemeContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox, Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

LogBox.ignoreAllLogs(true);

setupGlobalErrorHandling();

ExpoSplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryProvider>
        <CustomThemeProvider>
          <NetworkProvider>
            <TooltipProvider>
              <BottomSheetModalProvider>
                <RootLayoutNav />
              </BottomSheetModalProvider>
            </TooltipProvider>
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
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const colors = Colors[colorScheme];

  useEffect(() => {
    async function prepare() {
      try {
        await ExpoSplashScreen.preventAutoHideAsync();

        setIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (loaded && isReady) {
      ExpoSplashScreen.hideAsync().catch(console.warn);
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) return null;

  return (
    <View
      style={[styles.rootContainer, { backgroundColor: colors.background }]}
    >
      {showSplash && (
        <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
      )}
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
                  animation:
                    Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
                  animationDuration: 200,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(features)/venues"
                options={{
                  headerShown: false,
                  animation:
                    Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
                  animationDuration: 200,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }}
              />
              <Stack.Screen
                name="(features)/payments"
                options={{
                  headerShown: false,
                  animation:
                    Platform.OS === 'ios'
                      ? 'slide_from_bottom'
                      : 'slide_from_bottom',
                  animationDuration: 200,
                  gestureEnabled: true,
                  gestureDirection: 'vertical',
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
