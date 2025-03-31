import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';

interface BookingStatusViewProps {
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    successColor: string;
    buttonColor?: string;
  };
  type: 'success' | 'cancelled';
  classData?: {
    name?: string;
    date?: string;
    venue?: {
      name?: string;
    };
  };
  onAddToCalendar?: () => void;
}

const { height } = Dimensions.get('window');

export const BookingStatusView = ({
  colors,
  type,
  classData,
  onAddToCalendar,
}: BookingStatusViewProps) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    if (!classData) return;

    try {
      await Share.share({
        message: `Join me for ${classData.name || 'a class'} at ${
          classData.venue?.name || ''
        } on ${classData.date || ''}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.successColor },
          ]}
        >
          <Ionicons name="checkmark" size={40} color="white" />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {type === 'success'
            ? t('classes.bookingConfirmed', 'Booking confirmed')
            : t('classes.bookingCancelled', 'Booking cancelled')}
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {type === 'success'
            ? t(
                'classes.bookingSuccessMessage',
                "We can't wait to see you! Keep track of your complete schedule on the profile screen."
              )
            : t(
                'classes.cancellationSuccessMessage',
                "Confirmation: You've successfully canceled this class."
              )}
        </Text>

        {type === 'success' && (
          <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
            {t(
              'classes.calendarMessage',
              "Don't forget to add this booking to your calendar app for perfect organization. See you soon!"
            )}
          </Text>
        )}

        {type === 'cancelled' && (
          <Text style={[styles.subMessage, { color: colors.textSecondary }]}>
            {t(
              'classes.classReinstatementMessage',
              "The good news: We've reinstated one of your check-ins! We look forward to welcoming you to another exciting session soon!"
            )}
          </Text>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        {type === 'success' && (
          <>
            <Pressable
              style={[
                styles.primaryButton,
                { backgroundColor: colors.buttonColor || '#3B82F6' },
              ]}
              android_ripple={{ color: 'transparent' }}
              onPress={onAddToCalendar}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
              <Text style={styles.primaryButtonText}>
                {t('classes.addToCalendar', 'Add to Calendar')}
              </Text>
            </Pressable>

            <Pressable
              style={styles.secondaryButton}
              android_ripple={{ color: 'transparent' }}
              onPress={handleShare}
            >
              <Text
                style={[
                  styles.secondaryButtonText,
                  { color: colors.buttonColor || '#3B82F6' },
                ]}
              >
                {t('classes.shareWithFriends', 'Share with Friends')}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    height: height * 0.7,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  subMessage: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  buttonsContainer: {
    padding: 24,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.3)',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
