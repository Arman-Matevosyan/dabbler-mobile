import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { ThemedText } from '@/components/ui/ThemedText';
import { useAuth } from '@/providers/AuthProvider';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const { styles, colors } = useProfileTabStyles();
  const { logout, isLoading } = useAuth();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await logout();
  };

  const settingsOptions = [
    {
      title: t('profile.account'),
      items: [
        {
          label: t('profile.accountDetails'),
          description: t('profile.managePersonalInfo'),
          icon: 'account' as const,
          onPress: () => router.push('/(features)/profile/details'),
        },
      ],
    },
    {
      title: t('profile.myMembership'),
      items: [
        {
          label: t('profile.membershipDetails'),
          description: t('profile.viewManageSubscription'),
          icon: 'card-account-details' as const,
          onPress: () => router.push('/(features)/profile/membership'),
        },
      ],
    },
    {
      title: t('profile.payments'),
      items: [
        {
          label: t('profile.paymentMethods'),
          description: t('profile.managePaymentOptions'),
          icon: 'credit-card' as const,
          onPress: () => router.push('/(features)/profile/payment'),
        },
      ],
    },
    {
      title: t('profile.preferences'),
      items: [
        {
          label: t('common.language'),
          description: t('profile.changeLanguage'),
          icon: 'translate' as const,
          onPress: () => router.push('/(features)/profile/language'),
        },
        {
          label: t('profile.displaySettings'),
          description: t('profile.customizeAppearance'),
          icon: 'theme-light-dark' as const,
          onPress: () => router.push('/(features)/profile/display'),
        },
      ],
    },
  ];

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfilePageSkeleton type="settings" itemCount={6} />
      </SkeletonScreen>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <ScrollView style={{ flex: 1 }}>
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
            <ThemedText style={styles.backButtonText}>
              {t('common.settings')}
            </ThemedText>
          </TouchableOpacity>

          <ThemedText style={styles.screenTitle}>
            {t('common.settings')}
          </ThemedText>
          <ThemedText style={styles.screenDescription}>
            {t('profile.manageAccountSettings')}
          </ThemedText>

          {settingsOptions.map((section, index) => (
            <View key={index} style={styles.settingsSection}>
              <ThemedText style={styles.settingsSectionTitle}>
                {section.title}
              </ThemedText>
              <View style={{ gap: 16, marginTop: 8 }}>
                {section.items.map((item, itemIndex) => (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[
                      styles.detailItem,
                      {
                        backgroundColor: 'transparent',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                    onPress={item.onPress}
                    activeOpacity={1}
                  >
                    <View style={styles.detailItemLeft}>
                      <MaterialCommunityIcons
                        name={item.icon}
                        size={24}
                        color={colors.textPrimary}
                      />
                      <View>
                        <ThemedText style={styles.detailLabel}>
                          {item.label}
                        </ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {item.description}
                        </ThemedText>
                      </View>
                    </View>
                    <View style={{ justifyContent: 'center' }}>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={20}
                        color={colors.textSecondary}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <View>
            <TouchableOpacity
              style={[
                styles.detailItem,
                {
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
              onPress={handleLogout}
              activeOpacity={1}
            >
              <View style={styles.detailItemLeft}>
                <MaterialCommunityIcons
                  name="logout"
                  size={24}
                  color={colors.errorText}
                />
                <View>
                  <ThemedText
                    style={[styles.detailLabel, { color: colors.errorText }]}
                  >
                    {t('profile.logout')}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {t('profile.signOutAccount')}
                  </ThemedText>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
