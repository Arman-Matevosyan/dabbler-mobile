import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 3 }) => {
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];

  const pulseAnim = useAnimatedStyle(() => ({
    opacity: withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1000 }),
        withTiming(0.7, { duration: 1000 })
      ),
      -1,
      true
    ),
  }));

  const renderSkeleton = () => (
    <Animated.View
      style={[styles.card, { backgroundColor: colors.background }, pulseAnim]}
    >
      <View style={styles.imageContainer}>
        <View style={[styles.image, { backgroundColor: colors.border }]} />
      </View>
      <View style={styles.content}>
        <View style={[styles.title, { backgroundColor: colors.border }]} />
        <View style={[styles.time, { backgroundColor: colors.border }]} />
        <View style={styles.details}>
          <View style={[styles.detail, { backgroundColor: colors.border }]} />
          <View style={[styles.detail, { backgroundColor: colors.border }]} />
          <View style={[styles.detail, { backgroundColor: colors.border }]} />
        </View>
      </View>
    </Animated.View>
  );

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} style={styles.container}>
          {renderSkeleton()}
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 8,
    flexDirection: 'row',
    padding: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  title: {
    height: 20,
    width: '60%',
    borderRadius: 4,
  },
  time: {
    height: 16,
    width: '40%',
    borderRadius: 4,
  },
  details: {
    gap: 6,
    marginTop: 4,
  },
  detail: {
    height: 14,
    borderRadius: 4,
  },
});
