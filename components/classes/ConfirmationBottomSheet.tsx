import { ClassDetailResponse } from '@/hooks/classes/useClassDetails';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

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

export const ConfirmationBottomSheet: React.FC<ConfirmationBottomSheetProps> = ({
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
    const classDate = new Date(classData.date);
    const formattedDate = classDate.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
    const formattedTime = classDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    
    classInfo = (
      <View style={styles.classInfoContainer}>
        <Text style={styles.className}>{classData.name}</Text>
        <View style={styles.classDetailsRow}>
          <Ionicons name="calendar-outline" size={16} color="#999" style={styles.classIcon} />
          <Text style={styles.classDetail}>{formattedDate}</Text>
          <Ionicons name="time-outline" size={16} color="#999" style={[styles.classIcon, {marginLeft: 16}]} />
          <Text style={styles.classDetail}>{formattedTime}</Text>
        </View>
        {classData.venue && (
          <View style={styles.classDetailsRow}>
            <Ionicons name="location-outline" size={16} color="#999" style={styles.classIcon} />
            <Text style={styles.classDetail}>{classData.venue.name}</Text>
          </View>
        )}
      </View>
    );
  }

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <BlurView intensity={10} style={StyleSheet.absoluteFill} tint="dark">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.contentContainer}>
            <View 
              style={[
                styles.sheetContainer, 
                isDestructive ? styles.destructiveContainer : {}
              ]}
            >
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
              
              <View style={styles.header}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.content}>
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
                    isLoading ? styles.disabledButton : {}
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
        </TouchableOpacity>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '80%',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  content: {
    paddingHorizontal: 20,
    maxHeight: '100%',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
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
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  destructiveButton: {
    backgroundColor: '#FF3B30',
  },
  disabledButton: {
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  classInfoContainer: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 8,
  },
  classDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  classIcon: {
    marginRight: 6,
  },
  classDetail: {
    fontSize: 14,
    color: '#CCC',
  },
}); 