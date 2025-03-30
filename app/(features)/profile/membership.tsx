import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { ThemedText } from '@/components/ui/ThemedText';
import useSubscriptions from '@/hooks/profile/useSubscriptions';
import { useTheme } from '@/providers/ThemeContext';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function MembershipScreen() {
  const { styles, colors } = useProfileTabStyles();
  const { subscription, isLoading } = useSubscriptions();
  const { colorScheme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfilePageSkeleton type="membership" />
      </SkeletonScreen>
    );
  }

  // Check if subscription data exists and has valid plan
  const hasSubscriptionData =
    subscription &&
    subscription.plan &&
    subscription.plan.name &&
    subscription.status;

  if (!hasSubscriptionData) {
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
              {t('profile.membership')}
            </ThemedText>
          </TouchableOpacity>

          <View style={{ marginTop: 40, padding: 20, alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="calendar-star"
              size={90}
              color="#3B82F6"
              style={{ marginBottom: 20 }}
            />

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              {t('membership.noMembershipFound')}
            </Text>

            <Text
              style={{
                color: '#CCCCCC',
                fontSize: 16,
                textAlign: 'center',
                marginBottom: 30,
              }}
            >
              {t('membership.noActivePlan')}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: '#3B82F6',
                paddingVertical: 12,
                paddingHorizontal: 24,
                borderRadius: 25,
                alignSelf: 'center',
              }}
              onPress={() => router.push('/(features)/profile/plans' as any)}
            >
              <Text
                style={{
                  color: '#FFFFFF',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {t('membership.viewPlans')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
            {t('profile.membership')}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.screenTitle}>
          {t('profile.membershipDetails')}
        </ThemedText>

        <View style={{ gap: 16, marginTop: 24 }}>
          <View
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
                name="star"
                size={24}
                color={colors.textPrimary}
              />
              <View>
                <ThemedText style={styles.detailLabel}>
                  {t('membership.plan')}
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscription?.plan?.name || ''}
                </ThemedText>
                {subscription?.plan?.description && (
                  <ThemedText
                    style={[styles.detailValue, { fontSize: 14, opacity: 0.7 }]}
                  >
                    {subscription.plan.description}
                  </ThemedText>
                )}
              </View>
            </View>
          </View>

          <View
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
                name="credit-card"
                size={24}
                color={colors.textPrimary}
              />
              <View>
                <ThemedText style={styles.detailLabel}>
                  {t('membership.paymentMethod')}
                </ThemedText>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  {subscription?.paymentMethod?.details?.imageUrl && (
                    <Image
                      source={{
                        uri: subscription.paymentMethod.details.imageUrl,
                      }}
                      style={{ width: 24, height: 16 }}
                    />
                  )}
                  <ThemedText style={styles.detailValue}>
                    {subscription?.paymentMethod?.details?.last4
                      ? `•••• ${subscription.paymentMethod.details.last4}`
                      : ''}
                  </ThemedText>
                </View>
                {subscription?.paymentMethod?.details?.expirationMonth &&
                  subscription?.paymentMethod?.details?.expirationYear && (
                    <ThemedText
                      style={[
                        styles.detailValue,
                        { fontSize: 14, opacity: 0.7 },
                      ]}
                    >
                      {t('membership.expires')}{' '}
                      {subscription.paymentMethod.details.expirationMonth}/
                      {subscription.paymentMethod.details.expirationYear}
                    </ThemedText>
                  )}
              </View>
            </View>
          </View>

          <View
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
                name="calendar"
                size={24}
                color={colors.textPrimary}
              />
              <View>
                <ThemedText style={styles.detailLabel}>
                  {t('membership.billingPeriod')}
                </ThemedText>
                {subscription?.billingPeriodStartDate &&
                subscription?.billingPeriodEndDate ? (
                  <ThemedText style={styles.detailValue}>
                    {format(
                      new Date(subscription.billingPeriodStartDate),
                      'MMM dd'
                    )}{' '}
                    -{' '}
                    {format(
                      new Date(subscription.billingPeriodEndDate),
                      'MMM dd, yyyy'
                    )}
                  </ThemedText>
                ) : (
                  <ThemedText style={styles.detailValue}>-</ThemedText>
                )}
              </View>
            </View>
          </View>

          <View
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
                name="cash"
                size={24}
                color={colors.textPrimary}
              />
              <View>
                <ThemedText style={styles.detailLabel}>Price</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscription?.plan?.price
                    ? `$${subscription.plan.price}/month`
                    : ''}
                </ThemedText>
              </View>
            </View>
          </View>

          <View
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
                name="check-circle"
                size={24}
                color={colors.textPrimary}
              />
              <View>
                <ThemedText style={styles.detailLabel}>Status</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {subscription?.status || ''}
                </ThemedText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const emptyStyles = StyleSheet.create({
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  iconContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    opacity: 0.8,
    paddingHorizontal: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
