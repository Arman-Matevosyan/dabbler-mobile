import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { usePaymentSubsccribe, useVerifyPayment } from '@/hooks/payments';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function SuccessScreen() {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const fadeAnim = useRef(new Animated.Value(0.9)).current;
  const fadeTextAnim = useRef(new Animated.Value(0.9)).current;
  const translateAnim = useRef(new Animated.Value(0)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0.9)).current;

  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const { nonce, plan } = useLocalSearchParams<{
    nonce: string;
    plan: string;
  }>();
  const { t } = useTranslation();

  const {
    isLoading,
    data: paymentData,
    isSuccess: isVerifyPaymentSuccess,
  } = useVerifyPayment({
    paymentMethodNonce: nonce,
  });

  const {
    data,
    isLoading: isSubscribeLoading,
    isSuccess,
  } = usePaymentSubsccribe({ paymentMethodId: paymentData?.id, planId: plan });

  useEffect(() => {
    if (isSuccess && isVerifyPaymentSuccess) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),

        Animated.stagger(200, [
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.parallel([
            Animated.timing(fadeTextAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(translateAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
              easing: Easing.out(Easing.quad),
            }),
          ]),
          // Finally show the button
          Animated.timing(buttonFadeAnim, {
            toValue: 1,
            duration: 400,
            delay: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [isSuccess, isVerifyPaymentSuccess]);

  const goToHome = () => {
    router.replace('/(tabs)' as any);
  };

  const renderLoadingState = () => (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={colors.buttonBackground} />
          <ThemedText style={[styles.loadingText, { marginTop: 24 }]}>
            {t('payment.preparingPayment')}
          </ThemedText>
          <ThemedText style={[styles.loadingSubText]}>
            {t('payment.verifyingPayment')}
          </ThemedText>
        </View>
      </View>
    </SafeAreaView>
  );

  const renderSuccessState = () => (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: scaleAnim }],
                backgroundColor: colors.buttonBackground + '20',
              },
            ]}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={80}
              color={colors.buttonBackground}
            />
          </Animated.View>

          <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
            <ThemedText style={styles.title}>
              {t('payment.paymentSuccessful')}
            </ThemedText>

            <Animated.View
              style={[
                {
                  opacity: fadeTextAnim,
                  transform: [{ translateY: translateAnim }],
                },
              ]}
            >
              <ThemedText style={styles.subtitle}>
                {t('payment.thankYou')}
              </ThemedText>
            </Animated.View>
          </Animated.View>

          <Animated.View
            style={[styles.buttonContainer, { opacity: buttonFadeAnim }]}
          >
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.buttonBackground },
              ]}
              onPress={goToHome}
              activeOpacity={0.8}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color="#fff"
                style={styles.buttonIcon}
              />
              <ThemedText
                style={styles.buttonText}
                lightColor="#fff"
                darkColor="#fff"
              >
                {t('common.done')}
              </ThemedText>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );

  if (isLoading || isSubscribeLoading) {
    return renderLoadingState();
  }

  return renderSuccessState();
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20, // Add padding to ensure content isn't cut off
  },
  contentContainer: {
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingContent: {
    alignItems: 'center',
    padding: 30,
    width: '80%',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
