import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface BottomSheetProps {
  /**
   * Content to render in the bottom sheet
   */
  children: ReactNode;
  /**
   * Title of the bottom sheet, displayed in the header
   */
  title?: string;
  /**
   * Callback function when the bottom sheet is closed
   */
  onClose?: () => void;
  /**
   * Initial height of the bottom sheet as a percentage of screen height (0-1)
   */
  initialHeight?: number;
  /**
   * Maximum height of the bottom sheet as a percentage of screen height (0-1)
   */
  maxHeight?: number;
  /**
   * Should the bottom sheet be draggable
   */
  draggable?: boolean;
}

export interface BottomSheetRefProps {
  open: () => void;
  close: () => void;
}

const CustomBottomSheet = forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children, title, onClose, initialHeight = 0.6, maxHeight = 0.8, draggable = true }, ref) => {
    const { colorScheme } = useTheme() || { colorScheme: 'dark' };
    const colors = Colors[colorScheme || 'dark'];
    
    const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const panY = useRef(new Animated.Value(0)).current;
    const initialHeightPixels = SCREEN_HEIGHT * initialHeight;
    
    const open = () => {
      Animated.spring(translateY, {
        toValue: SCREEN_HEIGHT - initialHeightPixels,
        useNativeDriver: true,
        tension: 60,
        friction: 12,
      }).start();
    };
    
    const close = () => {
      Animated.timing(translateY, {
        toValue: SCREEN_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        if (onClose) onClose();
      });
    };
    
    useImperativeHandle(ref, () => ({
      open,
      close,
    }));

    return (
      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <View
          style={[
            styles.background,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.handleContainer}>
            <View style={[styles.handle, { backgroundColor: colors.border }]} />
          </View>
          
          {title && (
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {title}
              </Text>
              <TouchableOpacity onPress={close} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          )}
          
          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  background: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    minHeight: 200,
    maxHeight: SCREEN_HEIGHT * 0.8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
});

export default CustomBottomSheet; 