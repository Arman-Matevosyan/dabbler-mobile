import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface ClassListSkeletonProps {
  count?: number;
}

export const ClassListSkeleton: React.FC<ClassListSkeletonProps> = ({ count = 4 }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const animatedOpacity = React.useRef(new Animated.Value(0.3)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedOpacity, {
          toValue: 0.7,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animatedOpacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [animatedOpacity]);

  const skeletonColor = colorScheme === 'dark' ? '#333' : '#E0E0E0';

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <Animated.View
          key={index}
          style={[
            styles.skeletonCard,
            {
              backgroundColor: colors.cardBackground,
              opacity: animatedOpacity,
              borderColor: colorScheme === 'dark' ? '#2a2a2a' : '#f0f0f0',
              marginTop: index === 0 ? 16 : 12,
            },
          ]}
        >
          <View style={styles.cardContent}>
            <View style={styles.imageContainer}>
              <View
                style={[styles.skeletonImage, { backgroundColor: skeletonColor }]}
              />
            </View>
            <View style={styles.textContainer}>
              <View
                style={[
                  styles.skeletonTitle,
                  { backgroundColor: skeletonColor },
                ]}
              />
              <View
                style={[
                  styles.skeletonDate,
                  { backgroundColor: skeletonColor },
                ]}
              />
              <View
                style={[
                  styles.skeletonInfo,
                  { backgroundColor: skeletonColor },
                ]}
              />
              <View style={styles.tagsRow}>
                <View
                  style={[
                    styles.skeletonTag,
                    { backgroundColor: skeletonColor },
                  ]}
                />
                <View
                  style={[
                    styles.skeletonTag,
                    { backgroundColor: skeletonColor, width: 60 },
                  ]}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  skeletonCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 4,
  },
  imageContainer: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  skeletonTitle: {
    height: 20,
    width: '80%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonDate: {
    height: 16,
    width: '65%',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonInfo: {
    height: 14,
    width: '70%',
    borderRadius: 4,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  skeletonTag: {
    height: 20,
    width: 80,
    borderRadius: 10,
    marginRight: 8,
  },
}); 