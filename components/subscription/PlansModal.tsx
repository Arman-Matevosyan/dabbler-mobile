import { Colors } from '@/constants/Colors';
import { usePlans } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PlanSkeleton = ({ colors }: { colors: any }) => {
  return (
    <View style={[styles.planCard, { borderColor: colors.border }]}>
      <View style={styles.planHeader}>
        <View
          style={[
            styles.skeletonText,
            { backgroundColor: colors.skeletonBackground, width: 100 },
          ]}
        />
        <View
          style={[
            styles.skeletonText,
            { backgroundColor: colors.skeletonBackground, width: 80 },
          ]}
        />
      </View>
      <View
        style={[
          styles.skeletonText,
          {
            backgroundColor: colors.skeletonBackground,
            height: 60,
            marginTop: 10,
          },
        ]}
      />
    </View>
  );
};

interface PlansModalProps {
  onClose?: () => void;
  forceShow?: boolean;
  showPlansModal?: boolean;
  setShowPlansModal?: (show: boolean) => void;
}

export default function PlansModal({
  onClose,
  forceShow = false,
  showPlansModal = false,
  setShowPlansModal = () => {},
}: PlansModalProps) {
  const { t } = useTranslation();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];

  const { data: plans = [], isLoading } = usePlans();

  const isVisible = forceShow || showPlansModal;

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setShowPlansModal(false);

    if (onClose) {
      onClose();
    }
  };

  const handleSelectPlan = (plan: any) => {
    setShowPlansModal(false);

    if (onClose) {
      onClose();
    }
    router.push(`/(features)/payments/payment?plan=${plan.id || plan.planId}`);
  };

  const handleViewAllPlans = () => {
    setShowPlansModal(false);

    if (onClose) {
      onClose();
    }

    router.push('/(features)/profile/plans');
  };

  return (
    <View style={styles.modalOverlay}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <View
            style={[
              styles.centeredView,
              { backgroundColor: 'rgba(0,0,0,0.8)' },
            ]}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => {
                e.stopPropagation();
              }}
            >
              <View
                style={[
                  styles.modalView,
                  { backgroundColor: colors.modalBackground },
                ]}
              >
                <View style={styles.header}>
                  <Text style={[styles.title, { color: colors.textPrimary }]}>
                    {t('subscription.upgradeAccount', 'Upgrade Your Account')}
                  </Text>
                  <TouchableOpacity
                    onPress={handleClose}
                    style={styles.closeButton}
                    activeOpacity={1}
                  >
                    <Ionicons
                      name="close"
                      size={24}
                      color={colors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>

                <Text
                  style={[styles.description, { color: colors.textSecondary }]}
                >
                  {t(
                    'subscription.selectPlanDescription',
                    'Choose a subscription plan to access all features.'
                  )}
                </Text>

                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator
                      size="small"
                      color={colors.accentPrimary}
                      style={styles.loader}
                    />
                    <Text
                      style={[
                        styles.loadingText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t('subscription.loadingPlans', 'Loading plans...')}
                    </Text>
                    <PlanSkeleton colors={colors} />
                    <PlanSkeleton colors={colors} />
                  </View>
                ) : (
                  <ScrollView style={styles.plansContainer}>
                    {plans && plans.length > 0 ? (
                      plans.map((plan: any, index: number) => {
                        const isPopular = index === 1;
                        return (
                          <TouchableOpacity
                            key={plan.id || plan.planId}
                            style={[
                              styles.planCard,
                              {
                                borderColor: isPopular
                                  ? colors.accentPrimary
                                  : colors.border,
                                borderWidth: isPopular ? 2 : 1,
                              },
                            ]}
                            onPress={() => handleSelectPlan(plan)}
                            activeOpacity={1}
                          >
                            {isPopular && (
                              <View
                                style={[
                                  styles.popularBadge,
                                  { backgroundColor: colors.accentPrimary },
                                ]}
                              >
                                <Text style={styles.popularText}>
                                  {t('plans.mostPopular', 'Most Popular')}
                                </Text>
                              </View>
                            )}
                            <View style={styles.planHeader}>
                              <Text
                                style={[
                                  styles.planName,
                                  { color: colors.textPrimary },
                                ]}
                              >
                                {plan.name}
                              </Text>
                              <Text
                                style={[
                                  styles.planPrice,
                                  { color: colors.accentPrimary },
                                ]}
                              >
                                {plan.currencyIsoCode} {plan.price}/mo
                              </Text>
                            </View>
                            <Text
                              style={[
                                styles.planDescription,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {plan.description ||
                                t(
                                  'plans.noDescription',
                                  'No description available'
                                )}
                            </Text>
                          </TouchableOpacity>
                        );
                      })
                    ) : (
                      <Text
                        style={[
                          styles.noPlansText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {t('plans.noPlansAvailable', 'No plans available')}
                      </Text>
                    )}
                  </ScrollView>
                )}

                <View style={styles.footer}>
                  <TouchableOpacity
                    style={[
                      styles.viewAllButton,
                      { backgroundColor: colors.accentPrimary },
                    ]}
                    onPress={handleViewAllPlans}
                    activeOpacity={1}
                  >
                    <Text style={styles.viewAllButtonText}>
                      {t('subscription.viewAllPlans', 'View All Plans')}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.skipButton}
                    onPress={handleClose}
                    activeOpacity={1}
                  >
                    <Text
                      style={[
                        styles.skipButtonText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {t('subscription.maybeLater', 'Maybe Later')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10000,
    elevation: 10000,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  loadingContainer: {
    marginBottom: 20,
  },
  loader: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  skeletonText: {
    height: 20,
    borderRadius: 4,
    marginVertical: 4,
  },
  plansContainer: {
    maxHeight: 300,
    marginBottom: 16,
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'visible',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 5,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 4,
  },
  popularText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 8,
  },
  viewAllButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 14,
  },
  noPlansText: {
    fontSize: 16,
    textAlign: 'center',
    padding: 16,
  },
});
