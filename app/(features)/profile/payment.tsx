import ProfilePageSkeleton from '@/components/ui/MainTabsSkeletons/ProfilePageSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { ThemedText } from '@/components/ui/ThemedText';
import { usePaymentMethods } from '@/hooks';
import { useTheme } from '@/providers/ThemeContext';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { PaymentMethod } from '@/types/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

export default function PaymentScreen() {
  const { styles, colors } = useProfileTabStyles();
  const { paymentMethods, isLoading } = usePaymentMethods();
  const { colorScheme } = useTheme();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfilePageSkeleton type="payment" />
      </SkeletonScreen>
    );
  }

  // Check if there are any payment methods
  const hasPaymentMethods = paymentMethods && paymentMethods.length > 0;

  if (!hasPaymentMethods) {
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
              {t('profile.payments')}
            </ThemedText>
          </TouchableOpacity>

          <View style={{ marginTop: 40, padding: 20, alignItems: 'center' }}>
            <MaterialCommunityIcons
              name="credit-card-outline"
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
              {t('payment.noPaymentMethods')}
            </Text>

            <Text
              style={{
                color: '#CCCCCC',
                fontSize: 16,
                textAlign: 'center',
              }}
            >
              {t('payment.noPaymentMethodsAdded')}
            </Text>
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
            {t('profile.payments')}
          </ThemedText>
        </TouchableOpacity>

        <ThemedText style={styles.screenTitle}>
          {t('profile.paymentMethods')}
        </ThemedText>

        <View style={{ gap: 16, marginTop: 24 }}>
          {paymentMethods.map((method: PaymentMethod, index) => (
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
              <View style={styles.paymentMethodContainer}>
                <Image
                  source={{ uri: method.details?.imageUrl }}
                  style={styles.paymentMethodImage}
                />
                <View style={styles.paymentMethodDetails}>
                  <ThemedText style={styles.paymentMethodLabel}>
                    {method.details?.cardType} {t('payment.endingIn')}{' '}
                    {method.details?.last4}
                  </ThemedText>
                  <ThemedText style={styles.paymentMethodValue}>
                    {t('membership.expires')} {method.details?.expirationMonth}/
                    {method.details?.expirationYear}
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
    color: 'white',
  },
});
