import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    LinearTransition,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

interface SkeletonCardProps {
  count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3 }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const shimmerValue = useSharedValue(0);
  
  useEffect(() => {
    shimmerValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 750, easing: Easing.ease }),
        withTiming(0, { duration: 750, easing: Easing.ease })
      ),
      -1 // Infinite repetition
    );
  }, []);
  
  const shimmerStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.7 + shimmerValue.value * 0.3,
      transform: [{ scale: 1 + shimmerValue.value * 0.01 }],
    };
  });
  
  const renderSkeletonCards = () => {
    const cards = [];
    for (let i = 0; i < count; i++) {
      cards.push(
        <Animated.View 
          key={i} 
          style={[
            styles.card, 
            { backgroundColor: colors.secondary },
            shimmerStyle
          ]}
          layout={LinearTransition.springify()}
        >
          <View style={styles.cardContent}>
            <View 
              style={[
                styles.image, 
                { backgroundColor: colors.border }
              ]} 
            />
            <View style={styles.details}>
              <View 
                style={[
                  styles.title, 
                  { backgroundColor: colors.border }
                ]} 
              />
              <View 
                style={[
                  styles.subtitle, 
                  { backgroundColor: colors.border }
                ]} 
              />
              <View 
                style={[
                  styles.info, 
                  { backgroundColor: colors.border }
                ]} 
              />
            </View>
          </View>
        </Animated.View>
      );
    }
    return cards;
  };
  
  return <View style={styles.container}>{renderSkeletonCards()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  title: {
    height: 16,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitle: {
    height: 12,
    width: '60%',
    borderRadius: 4,
    marginBottom: 8,
  },
  info: {
    height: 12,
    width: '40%',
    borderRadius: 4,
  },
});

export default SkeletonCard;
