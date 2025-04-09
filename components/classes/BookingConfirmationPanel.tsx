import { ClassQueryKeys } from '@/constants/QueryKeys';
import { useClassBook } from '@/hooks/content';
import type { ClassDetailResponse } from '@/hooks/content/useClasses';
import { queryClient } from '@/lib/queryClient';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BookingSuccessView } from './BookingSuccessView';
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet';

interface BookingConfirmationPanelProps {
  visible: boolean;
  onClose: () => void;
  classData: ClassDetailResponse;
  classDetail: any;
  colors: Record<string, string>;
  onBookingSuccess?: () => void;
}

export const BookingConfirmationPanel: React.FC<
  BookingConfirmationPanelProps
> = ({
  visible,
  onClose,
  classData,
  classDetail,
  colors,
  onBookingSuccess,
}) => {
  const { t } = useTranslation();
  const { bookMutationFn, isLoading } = useClassBook();
  const [showSuccessView, setShowSuccessView] = useState(false);

  const handleConfirmBooking = async () => {
    try {
      await bookMutationFn.mutateAsync({
        classId: classData.id,
        startDate: classData.date,
      });

      queryClient.invalidateQueries({
        queryKey: [ClassQueryKeys.schedules],
      });

      queryClient.invalidateQueries({
        queryKey: [ClassQueryKeys.classDetails, classData.id],
      });

      setShowSuccessView(true);
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error) {
      console.error('Error booking class:', error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessView(false);
    onClose();
  };

  if (showSuccessView) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalContainer}>
          <View style={styles.successModalContent}>
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity
                onPress={handleCloseSuccess}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>
            <BookingSuccessView
              colors={{
                background: colors.background || '#1A1A1A',
                textPrimary: colors.textPrimary || '#FFFFFF',
                textSecondary: colors.textSecondary || '#CCCCCC',
                successColor: '#4CAF50',
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <ConfirmationBottomSheet
      visible={visible}
      onClose={onClose}
      onConfirm={handleConfirmBooking}
      title={t('classes.confirmBooking', 'Confirm Booking')}
      message={t(
        'classes.bookingConfirmationMessage',
        'Please confirm that you want to book this class. You will be able to cancel it later if needed.'
      )}
      confirmText={t('classes.bookClass', 'Book Class')}
      cancelText={t('common.cancel', 'Cancel')}
      isLoading={isLoading}
      isDestructive={false}
      classData={classData}
    />
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
});
