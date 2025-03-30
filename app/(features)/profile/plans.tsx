import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { Colors } from '@/constants/Colors';
import { usePlans, useSubscriptions } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currencyIsoCode: string;
  limit: number;
  venues: any[];
}

interface Subscription {
  plan: {
    planId: string;
    name: string;
    description: string;
    price: number;
  };
  status: string;
}

export default function PlansProfileScreen() {
  const { plans, isLoading } = usePlans();
  const { colorScheme } = useTheme();
  const theme = Colors[colorScheme];
  const { subscription } = useSubscriptions();
  const { t } = useTranslation();

  const renderPlanCard = (plan: Plan, index: number) => {
    const isPopular = index === 1;
    const isActive = subscription?.plan?.planId === plan.id;

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 200)}
        style={[styles.cardContainer, isPopular && styles.popularCard]}
        key={plan.id}
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
              router.push(`/(features)/payments/payment?plan=${plan.id}`)
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
          {t('plans.chooseYourPlan')}
        </Text>
      </View>
      <View style={styles.cardsContainer}>
        {(plans as Plan[]).map((plan: Plan, index: number) =>
          renderPlanCard(plan, index)
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
    marginBottom: 8,
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
