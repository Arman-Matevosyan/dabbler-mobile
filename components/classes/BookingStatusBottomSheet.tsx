import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

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

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[
              styles.backdrop,
              { backgroundColor: colors.backdropColor || 'rgba(0,0,0,0.5)' },
            ]}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(200)}
          style={[styles.bottomSheet, { backgroundColor: colors.background }]}
        >
          <View style={styles.handle} />

          <View style={styles.contentContainer}>
            <View style={styles.successSection}>
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
                <Text
                  style={[styles.subMessage, { color: colors.textSecondary }]}
                >
                  {t(
                    'classes.calendarMessage',
                    "Don't forget to add this booking to your calendar app for perfect organization. See you soon!"
                  )}
                </Text>
              )}

              {type === 'cancelled' && (
                <Text
                  style={[styles.subMessage, { color: colors.textSecondary }]}
                >
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
        </Animated.View>
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
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1001,
  },
  bottomSheet: {
    height: 380,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    zIndex: 1002,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(150, 150, 150, 0.3)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  successSection: {
    alignItems: 'center',
    paddingTop: 16,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    marginTop: 20,
    paddingBottom: 16,
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
