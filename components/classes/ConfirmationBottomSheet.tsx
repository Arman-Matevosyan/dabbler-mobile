import type { ClassDetailResponse } from '@/hooks/content/useClasses';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export interface ConfirmationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  isLoading?: boolean;
  isDestructive?: boolean;
  classData?: ClassDetailResponse;
}

export const ConfirmationBottomSheet: React.FC<
  ConfirmationBottomSheetProps
> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  isDestructive = false,
  classData,
}) => {
  const { t } = useTranslation();

  // Format class info if provided
  let classInfo = null;
  if (classData && classData.date) {
    try {
      const classDate = new Date(classData.date);
      const formattedDate = format(classDate, 'EEE, dd MMM');
      const formattedTime = format(classDate, 'HH:mm');

      let endTime = '';
      if (classData.duration) {
        const endDateTime = new Date(
          classDate.getTime() + classData.duration * 60000
        );
        endTime = format(endDateTime, 'HH:mm');
      }

      const timeDisplay = endTime
        ? `${formattedTime} - ${endTime}`
        : formattedTime;

      classInfo = (
        <View style={styles.classInfoContainer}>
          <Text style={styles.className}>{classData.name}</Text>
          <View style={styles.classDetailsRow}>
            <MaterialCommunityIcons
              name="calendar-clock"
              size={18}
              color="#CCC"
              style={styles.classIcon}
            />
            <Text style={styles.classDetail}>
              {formattedDate} • {timeDisplay}
            </Text>
          </View>
          {classData.venue && (
            <View style={styles.classDetailsRow}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#CCC"
                style={styles.classIcon}
              />
              <Text style={styles.classDetail}>{classData.venue.name}</Text>
            </View>
          )}

          <View style={styles.classPriceContainer}>
            <Text
              style={[
                styles.priceLabel,
                isDestructive ? styles.destructiveText : {},
              ]}
            >
              {isDestructive
                ? t('classes.cancellationFee', 'Cancellation Fee:')
                : t('classes.price', 'Price:')}
            </Text>
            <Text
              style={[
                styles.priceValue,
                isDestructive ? styles.destructiveText : {},
              ]}
            >
              {
                (classData as any).price
                  ? `$${(classData as any).price}`
                  : t('classes.free', 'Free') // Translates to "Անվճար" in Armenian
              }
            </Text>
          </View>
        </View>
      );
    } catch (error) {
      console.error('Error formatting date:', error);
    }
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.contentContainer}>
          <View
            style={[
              styles.sheetContainer,
              isDestructive ? styles.destructiveContainer : {},
            ]}
          >
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Ionicons name="close" size={24} color="#999" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
            >
              {classInfo}
              <Text style={styles.message}>{message}</Text>
            </ScrollView>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.button,
                  styles.confirmButton,
                  isDestructive ? styles.destructiveButton : {},
                  isLoading ? styles.disabledButton : {},
                ]}
                onPress={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>{confirmText}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  destructiveContainer: {
    borderTopColor: '#FF3B30',
    borderTopWidth: 4,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    paddingHorizontal: 20,
    maxHeight: '100%',
  },
  message: {
    fontSize: 15,
    lineHeight: 24,
    color: '#CCC',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 10,
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    marginLeft: 10,
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  classInfoContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  className: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 12,
  },
  classDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  classIcon: {
    marginRight: 8,
  },
  classDetail: {
    fontSize: 15,
    color: '#CCC',
    flex: 1,
  },
  classPriceContainer: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  priceLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#CCC',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },
  destructiveText: {
    color: '#FF3B30',
  },
});
