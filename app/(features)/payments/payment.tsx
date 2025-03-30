import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { usePlans } from '@/hooks';
import { useClientToken } from '@/hooks/payments';
import { useTheme } from '@/providers/ThemeContext';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Linking, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PaymentScreen() {
  const { data, isLoading } = useClientToken();
  const token = data?.token ?? '';
  const merchantId = data?.merchantId ?? '';
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { plan } = useLocalSearchParams<{ plan: string }>();
  const { plans } = usePlans();
  const { t } = useTranslation();
  const currentPlan = plans.find((item) => item.id === plan);
  const handleMessage = (event) => {
    try {
      const receivedData = JSON.parse(event.nativeEvent.data);
      const nonce = receivedData?.payload?.nonce;
      if (receivedData.action === 'paymentSuccess') {
        router.replace(
          `/(features)/payments/success?nonce=${nonce}&plan=${plan}`
        );
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText style={[styles.loadingText, { marginTop: 20 }]}>
          {t('payment.preparingPayment')}
        </ThemedText>
      </View>
    );
  }

  return (
    <WebView
      source={{
        uri: `https://dev-site.dabblerclub.com/payment?clientToken=${token}&merchantId=${merchantId}&planName=${currentPlan?.name}&currency=${currentPlan?.currencyIsoCode}&theme=${colorScheme}&countryCode=${currentPlan?.countryCode}&price=${currentPlan?.price}`,
      }}
      onMessage={handleMessage}
      onShouldStartLoadWithRequest={(request) => {
        if (request.url.startsWith('dabbler://')) {
          Linking.openURL(request.url);
          return false;
        }
        return true;
      }}
      style={styles.flex}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});
