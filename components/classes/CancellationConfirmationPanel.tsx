import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { ClassDetailResponse } from '@/hooks/classes/useClassDetails';
import { queryClient } from '@/lib/queryClient';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BookingCancelledView } from './BookingCancelledView';
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet';

const useClassCancel = () => {
  const cancelClass = async (params: { classId: string }): Promise<any> => {
    try {
      const response = await axiosClient.delete(
        `/activity/schedules/me/${params.classId}`
      );
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.schedulesDataQuerykey],
      });
      return response.data;
    } catch (error) {
      console.error('Error cancelling class:', error);
      throw error;
    }
  };

  const cancelMutationFn = useMutation({
    mutationFn: cancelClass,
  });

  return {
    cancelMutationFn,
    isLoading: cancelMutationFn.isPending,
    error: cancelMutationFn.error,
    isSuccess: cancelMutationFn.isSuccess,
  };
};

interface CancellationConfirmationPanelProps {
  visible: boolean;
  onClose: () => void;
  classData: ClassDetailResponse;
  classDetail: any;
  onCancellationSuccess?: () => void;
  colors: Record<string, string>;
}

export const CancellationConfirmationPanel: React.FC<
  CancellationConfirmationPanelProps
> = ({
  visible,
  onClose,
  classData,
  classDetail,
  onCancellationSuccess,
  colors,
}) => {
  const { t } = useTranslation();
  const { cancelMutationFn, isLoading } = useClassCancel();
  const [showSuccessView, setShowSuccessView] = useState(false);

  const handleConfirmCancellation = async () => {
    try {
      await cancelMutationFn.mutateAsync({
        classId: classData.id,
      });

      queryClient.invalidateQueries({
        queryKey: [QueryKeys.classDetailsQueryKey, classData.id],
      });

      setShowSuccessView(true);
    } catch (error) {
      console.error('Error cancelling class:', error);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessView(false);
    if (onCancellationSuccess) {
      onCancellationSuccess();
    }
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
            <BookingCancelledView
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
      onConfirm={handleConfirmCancellation}
      title={t('classes.cancelBooking', 'Cancel Booking')}
      message={t(
        'classes.cancellationFeeWarning',
        'Please cancel at least 12 hours prior to the class to avoid late cancellation or no-show fees.'
      )}
      confirmText={t('classes.cancelBooking', 'Cancel Booking')}
      cancelText={t('common.goBack', 'Go Back')}
      isLoading={isLoading}
      isDestructive={true}
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
