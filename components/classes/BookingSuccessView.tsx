import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface BookingSuccessViewProps {
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    successColor: string;
  };
}

export const BookingSuccessView = ({ colors }: BookingSuccessViewProps) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: colors.successColor }]}
      >
        <Ionicons name="checkmark" size={40} color="white" />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('classes.bookingConfirmed', 'Booking confirmed')}
      </Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {t(
          'classes.bookingSuccessMessage',
          'You have successfully booked this class. We look forward to seeing you there!'
        )}
      </Text>

      <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
        {t(
          'classes.bookingReminder',
          "Please check the venue or class details to ensure you're fully prepared for the session."
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
