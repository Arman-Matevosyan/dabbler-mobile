import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BookingStatusBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    successColor: string;
    buttonColor?: string;
    backdropColor?: string;
    errorColor?: string;
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

const { height, width } = Dimensions.get('window');

export const BookingStatusBottomSheet = ({
  visible,
  onClose,
  colors,
  type,
  classData,
  onAddToCalendar,
}: BookingStatusBottomSheetProps) => {
  const { t } = useTranslation();

  const handleShare = async () => {
    if (!classData) return;

    // Format date nicely if available
    let formattedDate = classData.date || '';
    try {
      if (classData.date) {
        const dateObj = new Date(classData.date);
        formattedDate = format(dateObj, 'EEE, dd MMM yyyy, HH:mm');
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }

    try {
      await Share.share({
        message: `Join me for ${classData.name || 'a class'} at ${
          classData.venue?.name || ''
        } on ${formattedDate}!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity onPress={onClose} style={StyleSheet.absoluteFill} />

        <View
          style={[styles.bottomSheet, { backgroundColor: colors.background }]}
        >
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          <View style={styles.contentContainer}>
            {/* Icon and status */}
            <View style={styles.successSection}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor:
                      type === 'success'
                        ? colors.successColor
                        : colors.errorColor || '#FF3B30',
                  },
                ]}
              >
                {type === 'success' ? (
                  <Ionicons name="checkmark" size={20} color="white" />
                ) : (
                  <FontAwesome5 name="calendar-times" size={16} color="white" />
                )}
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
                      "See you soon! Please check the venue or class details to ensure you're fully prepared for the session."
                    )
                  : t(
                      'classes.cancellationSuccessMessage',
                      'Your booking has been successfully cancelled.'
                    )}
              </Text>
            </View>

            <View style={styles.buttonsContainer}>
              {type === 'success' && (
                <Pressable
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.buttonColor || '#3B82F6' },
                  ]}
                  onPress={onAddToCalendar}
                >
                  <Text style={styles.primaryButtonText}>
                    {t('classes.addToCalendar', 'Add to Calendar')}
                  </Text>
                </Pressable>
              )}

              {type === 'cancelled' && (
                <Pressable
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.buttonColor || '#3B82F6' },
                  ]}
                  onPress={onClose}
                >
                  <Text style={styles.primaryButtonText}>
                    {t('common.close', 'Close')}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  bottomSheet: {
    height: 270,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
    zIndex: 1002,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 8,
    width: '100%',
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  successSection: {
    alignItems: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  subMessage: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    opacity: 0.8,
  },
  buttonsContainer: {
    paddingBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
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
    fontWeight: '500',
  },
});
