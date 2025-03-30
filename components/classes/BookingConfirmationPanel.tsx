import { QueryKeys } from '@/constants/QueryKeys';
import { useTooltip } from '@/hooks';
import { useClassBook } from '@/hooks/classes/useClassBook';
import { ClassDetailResponse } from '@/hooks/classes/useClassDetails';
import { queryClient } from '@/lib/queryClient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { addMinutes, format } from 'date-fns';
import { useEffect } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface BookingConfirmationPanelProps {
  visible: boolean;
  onClose: () => void;
  classData: ClassDetailResponse;
  classDetail: ClassDetailResponse & {
    cancellationPeriodInMinutes?: number;
  };
  colors: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    tint: string;
  };
}

export const BookingConfirmationPanel = ({
  visible,
  onClose,
  classData,
  classDetail,
  colors,
}: BookingConfirmationPanelProps) => {
  const { showError, showSuccess } = useTooltip();
  const {
    bookMutationFn,
    classBookingData,
    isLoading: bookingLoading,
    error: bookingError,
    isSuccess,
  } = useClassBook();

  if (!classData || !classDetail || !classData.venue?.address) return null;

  const date = new Date(classDetail.date || '');
  const endTime = addMinutes(date, classDetail.duration || 0);
  const weekDay = format(date, 'EEE');
  const monthDay = format(date, 'dd MMM');
  const startTimeStr = format(date, 'HH:mm');
  const endTimeStr = format(endTime, 'HH:mm');

  const cancelMinutes = 24 * 60;
  const cancelDate = new Date(date.getTime() - cancelMinutes * 60000);
  const cancelDateStr = format(cancelDate, 'EEE, dd MMM HH:mm');

  const handleConfirmBooking = async () => {
    if (!classData?.date || !classData?.venue?.id || !classData?.id) {
      showError('Missing Information', 'Required class information is missing');
      return;
    }

    try {
      bookMutationFn.mutate({
        startDate: classData.date,
        venueId: classData.venue.id,
        classId: classData.id,
      });
    } finally {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.schedulesDataQuerykey],
      });
    }
  };

  useEffect(() => {
    if (bookingError) {
      showError(
        'Booking Failed',
        bookingError.message || 'Failed to book the class'
      );
    }
  }, [bookingError]);

  useEffect(() => {
    if (isSuccess) {
      showSuccess('Booking successful! Your spot has been reserved.');
      onClose();
    }
  }, [isSuccess, onClose, showSuccess]);

  useEffect(() => {
    if (classBookingData) {
      onClose();
    }
  }, [classBookingData]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.modalContent, { backgroundColor: colors.background }]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              {classData.name}
            </Text>
          </View>

          <ScrollView
            style={styles.modalBody}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalBodyContent}>
              <View style={styles.locationSection}>
                <MaterialIcons
                  name="location-on"
                  size={24}
                  color={colors.tint}
                />
                <View style={styles.locationInfo}>
                  <Text
                    style={[styles.venueName, { color: colors.textPrimary }]}
                  >
                    {classData.venue.name}
                  </Text>
                  <Text
                    style={[
                      styles.venueAddress,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {`${classData.venue.address.street || ''}`}
                  </Text>
                  <Text
                    style={[styles.venueCity, { color: colors.textSecondary }]}
                  >
                    {`${classData.venue.address.city || ''}, ${
                      classData.venue.address.country || ''
                    }`}
                  </Text>
                </View>
              </View>

              <View style={styles.dateTimeSection}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={colors.tint}
                />
                <View style={styles.dateTimeInfo}>
                  <Text
                    style={[styles.dateText, { color: colors.textPrimary }]}
                  >
                    {`${weekDay}, ${monthDay}`}
                  </Text>
                  <Text
                    style={[styles.timeText, { color: colors.textSecondary }]}
                  >
                    {`${startTimeStr} - ${endTimeStr}`}
                  </Text>
                </View>
              </View>

              <View style={styles.trainerSection}>
                <Ionicons name="person-outline" size={24} color={colors.tint} />
                <Text
                  style={[styles.trainerName, { color: colors.textPrimary }]}
                >
                  {classDetail.instructorName || 'Instructor'}
                </Text>
              </View>

              <View style={styles.cancellationSection}>
                <MaterialIcons
                  name="access-time"
                  size={24}
                  color={colors.tint}
                />
                <Text
                  style={[
                    styles.cancellationText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {`Cancel before ${cancelDateStr} to avoid fees.`}
                </Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              {
                backgroundColor: colors.tint,
                opacity: bookingLoading ? 0.7 : 1,
              },
            ]}
            onPress={handleConfirmBooking}
            disabled={bookingLoading}
          >
            {bookingLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm Booking</Text>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '45%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalBody: {
    flex: 1,
  },
  modalBodyContent: {
    gap: 20,
    paddingBottom: 20,
  },
  locationSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationInfo: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  venueAddress: {
    fontSize: 14,
    marginBottom: 2,
  },
  venueCity: {
    fontSize: 14,
  },
  dateTimeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateTimeInfo: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    marginTop: 4,
  },
  trainerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  cancellationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancellationText: {
    fontSize: 14,
    flex: 1,
  },
  confirmButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    height: 52,
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
