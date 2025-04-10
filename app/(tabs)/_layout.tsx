import { useAuthStore } from '@/store/authStore';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Redirect, Tabs, usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useSubscriptions } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';

const CustomTabBarButtonWithLabel = ({ children, style, onPress }: any) => (
  <TouchableOpacity
    style={[styles.tabBarButtonContainer, style]}
    onPress={onPress}
    activeOpacity={1}
  >
    <View style={styles.tabBarContentContainer}>{children}</View>
  </TouchableOpacity>
);

export default function TabLayout() {
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);

  const { data: subscription } = useSubscriptions();
  const hasActivePlan = subscription && subscription.plan?.planId;

  const protectedPaths = [
    '/(tabs)/profile/authenticated',
    '/(tabs)/classes',
    '/(tabs)/checkin',
  ];

  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtectedPath && !isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  const renderVenuesIcon = ({ color }: { color: string }) => (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="map-marker" size={24} color={color} />
    </View>
  );

  const renderClassesIcon = ({ color }: { color: string }) => (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="dumbbell" size={24} color={color} />
    </View>
  );

  const renderCheckinIcon = ({ color }: { color: string }) => (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="qrcode-scan" size={24} color={color} />
    </View>
  );

  const renderProfileIcon = ({ color }: { color: string }) => (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name="account-circle" size={24} color={color} />
      {isAuthenticated && !hasActivePlan && (
        <View style={styles.notificationBadge} />
      )}
    </View>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'relative',
            height: 70 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: Colors[colorScheme].background,
            borderTopWidth: 0.2,
            borderTopColor: '#ffffff',
          },
          default: {
            height: 70,
            backgroundColor: Colors[colorScheme].background,
            borderTopWidth: 0.2,
            borderTopColor: '#ffffff',
          },
        }),
        tabBarActiveTintColor: Colors[colorScheme].accentPrimary,
        tabBarInactiveTintColor:
          colorScheme === 'dark'
            ? '#ffffff'
            : Colors[colorScheme].textSecondary,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
        tabBarButton: (props: any) => (
          <CustomTabBarButtonWithLabel {...props} />
        ),
        animation: 'none',
        lazy: true,
      }}
    >
      <Tabs.Screen
        name="venues"
        options={{
          title: t('tabs.venues'),
          tabBarIcon: renderVenuesIcon,
        }}
      />
      <Tabs.Screen
        name="classes"
        options={{
          title: t('tabs.classes'),
          tabBarIcon: renderClassesIcon,
        }}
      />
      <Tabs.Screen
        name="checkin"
        options={{
          title: t('tabs.checkin'),
          tabBarIcon: renderCheckinIcon,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: renderProfileIcon,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarButtonContainer: {
    flex: 1,
    height: '100%',
  },
  tabBarContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    height: 24,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  tabBarIcon: {
    marginBottom: 0,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
    borderWidth: 1,
    borderColor: 'white',
  },
});
