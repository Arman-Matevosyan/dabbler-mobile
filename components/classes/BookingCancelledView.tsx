import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface BookingCancelledViewProps {
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    successColor: string;
  };
}

export const BookingCancelledView = ({ colors }: BookingCancelledViewProps) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={[styles.iconContainer, { backgroundColor: colors.successColor }]}
      >
        <Ionicons name="checkmark" size={40} color="white" />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {t('classes.bookingCancelled', 'Booking cancelled')}
      </Text>

      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {t(
          'classes.cancellationSuccessMessage',
          "Confirmation: You've successfully canceled this class."
        )}
      </Text>

      <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
        {t(
          'classes.classReinstatementMessage',
          "The good news: We've reinstated one of your check-ins! We look forward to welcoming you to another exciting session soon!"
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
