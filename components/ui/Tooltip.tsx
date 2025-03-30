import { useThemeColor } from '@/hooks/useThemeColor';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StatusBar,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export type TooltipProps = {
  message: string;
  visible: boolean;
  type?: 'error' | 'warning' | 'success' | 'info';
  duration?: number;
  position?: 'top' | 'bottom';
  style?: StyleProp<ViewStyle>;
  onClose?: () => void;
};

export function Tooltip({
  message,
  visible,
  type = 'error',
  duration = 3000,
  position = 'top',
  style,
  onClose,
}: TooltipProps) {
  // Animation values
  const translateY = useRef(
    new Animated.Value(position === 'top' ? -100 : 100)
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;

  // State to track visibility
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Get theme colors for styling
  const background = useThemeColor({}, 'background');
  const secondary = useThemeColor({}, 'secondary');
  const textPrimary = useThemeColor({}, 'textPrimary');
  const primary = useThemeColor({}, 'primary');
  const accentPrimary = useThemeColor({}, 'accentPrimary');
  const accentSecondary = useThemeColor({}, 'accentSecondary');
  const orange = useThemeColor({}, 'orange');
  const blue = useThemeColor({}, 'blue');
  const purple = useThemeColor({}, 'purple');
  const border = useThemeColor({}, 'border');

  const getTypeInfo = () => {
    switch (type) {
      case 'error':
        return {
          color: accentSecondary || '#FF453A',
          icon: '!',
        };
      case 'warning':
        return {
          color: orange || '#FF9F0A',
          icon: '⚠️',
        };
      case 'success':
        return {
          color: purple || '#30D158',
          icon: '✓',
        };
      case 'info':
        return {
          color: blue || '#0A84FF',
          icon: 'ℹ️',
        };
      default:
        return {
          color: accentSecondary || '#FF453A',
          icon: '!',
        };
    }
  };

  const typeInfo = getTypeInfo();

  useEffect(() => {
    if (visible) {
      showTooltip();

      if (duration > 0) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          hideTooltip();
        }, duration);
      }
    } else if (isVisible) {
      hideTooltip();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, duration]);

  const showTooltip = () => {
    setIsVisible(true);

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.7)),
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideTooltip = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === 'top' ? -100 : 100,
        duration: 250,
        useNativeDriver: true,
        easing: Easing.in(Easing.cubic),
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onClose && !visible) onClose();
    });
  };

  if (!isVisible && !visible) return null;

  const tooltipBgColor = isDark ? secondary : background;

  return (
    <Animated.View
      style={[
        styles.container,
        position === 'top' ? styles.topPosition : styles.bottomPosition,
        {
          opacity,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      <ThemedView
        style={[
          styles.tooltip,
          {
            borderColor: typeInfo.color,
            backgroundColor: tooltipBgColor,
          },
        ]}
      >
        <View style={styles.content}>
          <View style={[styles.iconContainer, { borderColor: typeInfo.color }]}>
            <ThemedText style={[styles.icon, { color: typeInfo.color }]}>
              {typeInfo.icon}
            </ThemedText>
          </View>

          <ThemedText style={styles.message}>{message}</ThemedText>
        </View>
      </ThemedView>
    </Animated.View>
  );
}

const STATUS_BAR_HEIGHT =
  Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 24;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    padding: 16,
    width: SCREEN_WIDTH,
  },
  topPosition: {
    top: STATUS_BAR_HEIGHT,
  },
  bottomPosition: {
    bottom: 16,
  },
  tooltip: {
    width: '92%',
    borderRadius: 8,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: 'hidden',
  },
  content: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
});
