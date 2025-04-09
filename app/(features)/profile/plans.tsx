import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { Colors } from '@/constants/Colors';
import { usePlans } from '@/hooks/payment/usePayment';
import { useSubscriptions } from '@/hooks/payment/useSubscriptions';
import { useTheme } from '@/providers/ThemeContext';
import { IPlan, ISubscription } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PlansProfileScreen() {
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme];
  const { data: plans, isLoading } = usePlans();
  const { data: subscriptionData } = useSubscriptions();
  const { t } = useTranslation();
  const [showAllPlans, setShowAllPlans] = useState(false);

  const subscription = subscriptionData as ISubscription | undefined;

  const hasActivePlan = Boolean(subscription?.plan?.planId);

  useEffect(() => {
    setShowAllPlans(false);
  }, [subscription]);

  const plansToDisplay = useMemo(() => {
    if (!plans || !Array.isArray(plans)) return [];

    if (!hasActivePlan || showAllPlans) {
      return plans;
    }

    if (subscription?.plan?.planId) {
      return plans.filter(
        (plan) =>
          plan.id === subscription.plan?.planId ||
          plan.planId === subscription.plan?.planId
      );
    }

    return [];
  }, [plans, subscription, hasActivePlan, showAllPlans]);

  const renderPlanCard = (plan: IPlan, index: number) => {
    const planId = plan.id || plan.planId;
    const isPopular = index === 1;
    const isActive = subscription?.plan?.planId === planId;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 200)}
        style={[styles.cardContainer, isPopular && styles.popularCard]}
        key={planId}
      >
        <View style={styles.badgesContainer}>
          {isPopular && (
            <View
              style={[
                styles.popularBadge,
                { backgroundColor: theme.accentPrimary },
              ]}
            >
              <Text style={styles.popularText}>{t('plans.mostPopular')}</Text>
            </View>
          )}
          {isActive && (
            <View
              style={[
                styles.activeBadge,
                { backgroundColor: theme.accentSecondary },
              ]}
            >
              <Text style={styles.activeText}>{t('plans.activePlan')}</Text>
            </View>
          )}
        </View>

        <LinearGradient
          colors={[theme.cardBackground, theme.cardBackground]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.card,
            isPopular
              ? { borderWidth: 2, borderColor: theme.accentPrimary }
              : { borderWidth: 1, borderColor: theme.border },
            isActive && { borderColor: theme.accentSecondary },
          ]}
        >
          <Text style={[styles.planName, { color: theme.textPrimary }]}>
            {plan.name}
          </Text>
          <Text
            style={[styles.planDescription, { color: theme.textSecondary }]}
          >
            {plan.description || t('plans.noDescription')}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={[styles.currency, { color: theme.textPrimary }]}>
              {plan.currencyIsoCode}
            </Text>
            <Text style={[styles.price, { color: theme.textPrimary }]}>
              {plan.price}
            </Text>
            <Text style={[styles.period, { color: theme.textSecondary }]}>
              {t('plans.perMonth')}
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {[
              t('plans.upToVenues', { limit: plan.limit }),
              t('plans.analyticsDashboard'),
              t('plans.emailSupport'),
              t('plans.apiAccess'),
            ].map((feature, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={theme.accentPrimary}
                />
                <Text
                  style={[styles.featureText, { color: theme.textPrimary }]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              isActive ? styles.activeButton : styles.regularButton,
              {
                borderColor: isActive
                  ? theme.accentSecondary
                  : theme.accentPrimary,
              },
              isActive && styles.disabledButton,
            ]}
            onPress={() =>
              !isActive &&
              router.push(`/(features)/payments/payment?plan=${planId}`)
            }
            activeOpacity={1}
            disabled={isActive}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color: isActive ? theme.accentSecondary : theme.accentPrimary,
                },
                isActive && styles.disabledButtonText,
              ]}
            >
              {isActive ? t('plans.currentPlan') : t('plans.choosePlan')}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfilePageSkeleton type="plans" />
      </SkeletonScreen>
    );
  }

  if (!plans?.length) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <Text style={[styles.loadingText, { color: theme.textPrimary }]}>
          {t('plans.loadingPlans')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {hasActivePlan && !showAllPlans
            ? t('plans.yourCurrentPlan')
            : t('plans.chooseYourPlan')}
        </Text>

        {hasActivePlan && !showAllPlans && (
          <TouchableOpacity
            style={[
              styles.upgradeButton,
              { backgroundColor: theme.accentPrimary },
            ]}
            onPress={() => setShowAllPlans(true)}
          >
            <Text style={styles.upgradeButtonText}>
              {t('plans.upgradePlan')}
            </Text>
          </TouchableOpacity>
        )}

        {hasActivePlan && showAllPlans && (
          <TouchableOpacity
            style={[styles.textButton]}
            onPress={() => setShowAllPlans(false)}
          >
            <Text
              style={[styles.textButtonText, { color: theme.accentPrimary }]}
            >
              {t('plans.showOnlyMyPlan')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.cardsContainer}>
        {plansToDisplay.map((plan, index) =>
          renderPlanCard(plan as IPlan, index)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  upgradeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  upgradeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  textButton: {
    marginBottom: 16,
  },
  textButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: Colors.dark.cardBackground,
  },
  popularCard: {
    transform: [{ scale: 1.02 }],
  },
  card: {
    borderRadius: 16,
    padding: 24,
    backgroundColor: Colors.dark.cardBackground,
  },
  badgesContainer: {
    position: 'absolute',
    top: -12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1,
  },
  popularBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  activeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  popularText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  currency: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 4,
  },
  price: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
    marginBottom: 6,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  regularButton: {
    backgroundColor: 'transparent',
  },
  activeButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
  disabledButtonText: {
    opacity: 0.7,
  },
});
