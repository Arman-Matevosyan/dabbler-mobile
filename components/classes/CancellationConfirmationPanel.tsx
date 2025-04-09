import { axiosClient } from '@/api';
import { ClassQueryKeys } from '@/constants/QueryKeys';
import type { ClassDetailResponse } from '@/hooks/content/useClasses';
import { queryClient } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { ConfirmationBottomSheet } from './ConfirmationBottomSheet';

const useClassCancel = () => {
  const cancelClass = async (params: {
    classId: string;
    venueId: string;
    startDate: string;
  }): Promise<any> => {
    try {
      const response = await axiosClient.post(`activity/schedules/me/cancel`, {
        ...params,
      });
      queryClient.invalidateQueries({
        queryKey: [ClassQueryKeys.schedules],
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
> = ({ visible, onClose, classData, onCancellationSuccess, colors }) => {
  const { t } = useTranslation();
  const { cancelMutationFn, isLoading } = useClassCancel();
  
  const handleConfirmCancellation = async () => {
    try {
      await cancelMutationFn.mutateAsync({
        classId: classData.id,
        venueId: classData.venue?.id || '',
        startDate: classData.date || '',
      });

      queryClient.invalidateQueries({
        queryKey: [ClassQueryKeys.classDetails, classData.id],
      });

      // Skip showing our own success view and directly trigger parent success callback
      if (onCancellationSuccess) {
        onCancellationSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Error cancelling class:', error);
    }
  };

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
