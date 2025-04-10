import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface CustomRefreshControlProps {
  refreshing: boolean;
  onRefresh?: () => void;
  refreshingOffset?: number;
}

const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
  refreshing,
  refreshingOffset = 60,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    if (refreshing) {
      // Start rotation animation when refreshing
      rotation.value = withRepeat(
        withTiming(360, { duration: 1000, easing: Easing.linear }),
        -1, // Infinite repetition
        false
      );
      
      // Bounce animation
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 300, easing: Easing.out(Easing.ease) }),
          withTiming(0.95, { duration: 300, easing: Easing.in(Easing.ease) }),
          withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      
      // Fade in
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      // Stop animations and fade out
      cancelAnimation(rotation);
      cancelAnimation(scale);
      opacity.value = withTiming(0, { duration: 300 });
    }
    
    return () => {
      cancelAnimation(rotation);
      cancelAnimation(scale);
      cancelAnimation(opacity);
    };
  }, [refreshing, rotation, scale, opacity]);
  
  const spinnerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { top: refreshingOffset / 3 },
        spinnerStyle,
      ]}
    >
      {refreshing ? (
        <View style={styles.refreshContainer}>
          <MaterialCommunityIcons 
            name="refresh" 
            size={24} 
            color={colors.accentPrimary} 
          />
        </View>
      ) : (
        <ActivityIndicator size="small" color={colors.accentPrimary} />
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
  refreshContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default CustomRefreshControl; 