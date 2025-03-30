import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  limit: number;
  currencyIsoCode: string;
  isActive: boolean;
  venues: any[];
}

interface SubscriptionPlansProps {
  plans: Plan[];
  currentSubscription?: {
    plan: {
      planId: string;
      name: string;
      price: number;
    };
  };
  onSelectPlan: (plan: Plan) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  plans,
  currentSubscription,
  onSelectPlan,
}) => {
  const { colors } = useTheme();

  const getMostPopularPlan = () => {
    // In this case, we'll consider the middle tier as most popular
    return plans.find(plan => plan.name === 'Test M');
  };

  const mostPopularPlan = getMostPopularPlan();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.plansContainer}>
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan.planId === plan.id;
          const isMostPopular = mostPopularPlan?.id === plan.id;

          return (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isCurrentPlan ? colors.primary : colors.border,
                },
              ]}
              onPress={() => onSelectPlan(plan)}
            >
              {isMostPopular && (
                <View style={[styles.popularBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.popularText}>Most Popular</Text>
                </View>
              )}
              {isCurrentPlan && (
                <View style={[styles.activeBadge, { backgroundColor: colors.primary }]}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={colors.background} />
                  <Text style={styles.activeText}>Current Plan</Text>
                </View>
              )}
              <Text style={[styles.planName, { color: colors.text }]}>{plan.name}</Text>
              {plan.description && (
                <Text style={[styles.planDescription, { color: colors.text }]}>
                  {plan.description}
                </Text>
              )}
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: colors.text }]}>
                  {plan.currencyIsoCode} {plan.price}
                </Text>
                <Text style={[styles.period, { color: colors.text }]}>/month</Text>
              </View>
              <View style={styles.featuresContainer}>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.text }]}>
                    Up to {plan.limit} venues
                  </Text>
                </View>
                <View style={styles.featureRow}>
                  <MaterialCommunityIcons name="check" size={16} color={colors.primary} />
                  <Text style={[styles.featureText, { color: colors.text }]}>
                    All features included
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  plansContainer: {
    padding: 16,
    gap: 16,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    marginBottom: 16,
    opacity: 0.8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    fontSize: 32,
    fontWeight: '700',
  },
  period: {
    fontSize: 16,
    marginLeft: 4,
    opacity: 0.8,
  },
  featuresContainer: {
    gap: 8,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
  },
}); 