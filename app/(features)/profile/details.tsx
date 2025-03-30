import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { ThemedText } from '@/components/ui/ThemedText';
import { useUserProfile } from '@/hooks/profile/useUserProfile';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

export default function AccountDetailsScreen() {
  const { styles, colors } = useProfileTabStyles();
  const { user, isLoading } = useUserProfile();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfilePageSkeleton type="details" itemCount={4} />
      </SkeletonScreen>
    );
  }

  const accountDetails = [
    {
      label: t('profile.name'),
      value: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'N/A',
      icon: 'account' as const,
    },
    {
      label: t('auth.email'),
      value: user?.email || 'N/A',
      icon: 'email' as const,
    },
    {
      label: t('profile.verificationStatus'),
      value: user?.isVerified
        ? t('profile.verified')
        : t('profile.notVerified'),
      icon: user?.isVerified
        ? ('check-circle' as const)
        : ('alert-circle' as const),
    },
    {
      label: t('auth.password'),
      value: '••••••••',
      icon: 'lock' as const,
    },
  ];

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
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
            {t('profile.account')}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.screenTitle}>
          {t('profile.accountDetails')}
        </ThemedText>

        <View style={{ gap: 16, marginTop: 24 }}>
          {accountDetails.map((detail, index) => (
            <View
              key={index}
              style={[
                styles.detailItem,
                {
                  backgroundColor: 'transparent',
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              <View style={styles.detailItemLeft}>
                <MaterialCommunityIcons
                  name={detail.icon}
                  size={24}
                  color={colors.textPrimary}
                />
                <View>
                  <ThemedText style={styles.detailLabel}>
                    {detail.label}
                  </ThemedText>
                  <ThemedText style={styles.detailValue}>
                    {detail.value}
                  </ThemedText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}
