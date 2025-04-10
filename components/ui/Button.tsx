import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Feather } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
export type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  // Animation shared values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Get the right styles for the variant
  const getButtonBackground = (variant: ButtonVariant) => {
    switch (variant) {
      case 'primary': return colors.accentPrimary;
      case 'secondary': return colors.accentSecondary;
      case 'outline': return 'transparent';
      case 'danger': return '#FF453A';
      case 'success': return '#34C759';
      default: return colors.accentPrimary;
    }
  };
  
  const getTextColor = (variant: ButtonVariant) => {
    switch (variant) {
      case 'outline': return colors.accentPrimary;
      default: return '#FFFFFF';
    }
  };
  
  // Size styles
  const getSizeStyles = (size: ButtonSize): ViewStyle => {
    switch (size) {
      case 'small': return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'medium': return { paddingVertical: 10, paddingHorizontal: 16 };
      case 'large': return { paddingVertical: 14, paddingHorizontal: 20 };
      default: return { paddingVertical: 10, paddingHorizontal: 16 };
    }
  };
  
  const getTextSizeStyles = (size: ButtonSize): TextStyle => {
    switch (size) {
      case 'small': return { fontSize: 14 };
      case 'medium': return { fontSize: 16 };
      case 'large': return { fontSize: 18 };
      default: return { fontSize: 16 };
    }
  };
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.6 : opacity.value,
    };
  });
  
  // Touch handlers
  const handlePressIn = () => {
    scale.value = withTiming(0.96, { duration: 100, easing: Easing.inOut(Easing.ease) });
    opacity.value = withTiming(0.9, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 150 });
  };
  
  // Button styles
  const buttonStyles = [
    styles.button,
    { backgroundColor: getButtonBackground(variant) },
    variant === 'outline' && { 
      borderWidth: 1.5, 
      borderColor: colors.accentPrimary 
    },
    getSizeStyles(size),
    fullWidth && styles.fullWidth,
    style,
  ];
  
  const textStyles = [
    styles.buttonText,
    { color: getTextColor(variant) },
    getTextSizeStyles(size),
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
    >
      <Animated.View style={[buttonStyles, animatedStyle]}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={getTextColor(variant)} 
          />
        ) : (
          <>
            {icon && (
              <Feather 
                name={icon} 
                size={size === 'small' ? 14 : size === 'medium' ? 16 : 18} 
                color={getTextColor(variant)} 
                style={styles.icon} 
              />
            )}
            {typeof children === 'string' ? (
              <Text style={textStyles}>{children}</Text>
            ) : (
              children
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  icon: {
    marginRight: 8,
  },
}); 