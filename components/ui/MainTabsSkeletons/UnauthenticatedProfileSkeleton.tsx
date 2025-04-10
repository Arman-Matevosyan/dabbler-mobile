import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const UnauthenticatedProfileSkeleton: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    );

    shimmerAnimation.start();

    return () => {
      shimmerAnimation.stop();
    };
  }, [shimmerAnim]);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-300, 300],
  });

  const ShimmerElement = ({
    width,
    height,
    style,
  }: {
    width: number | string;
    height: number;
    style?: any;
  }) => {
    return (
      <View
        style={[{ width, height, borderRadius: 4, overflow: 'hidden' }, style]}
      >
        <View
          style={[
            styles.skeletonBase,
            { backgroundColor: colors.skeletonBackground },
          ]}
        />
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              transform: [{ translateX: shimmerTranslate }],
            },
          ]}
        >
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0.0)',
              'rgba(255, 255, 255, 0.15)',
              'rgba(255, 255, 255, 0.0)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Avatar placeholder */}
        <View style={styles.avatarContainer}>
          <ShimmerElement
            width={120}
            height={120}
            style={{ borderRadius: 60 }}
          />
        </View>

        {/* Welcome text placeholders */}
        <ShimmerElement
          width={200}
          height={24}
          style={{ alignSelf: 'center', marginTop: 20, marginBottom: 8 }}
        />
        <ShimmerElement
          width={240}
          height={16}
          style={{ alignSelf: 'center', marginBottom: 32 }}
        />

        {/* Login button placeholder */}
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.buttonInner}>
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 12, marginRight: 16 }}
            />
            <View>
              <ShimmerElement
                width={80}
                height={16}
                style={{ marginBottom: 4 }}
              />
              <ShimmerElement width={160} height={12} />
            </View>
          </View>
        </View>

        {/* Sign up button placeholder */}
        <View
          style={[
            styles.buttonContainer,
            {
              backgroundColor: colors.cardBackground,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <View style={styles.buttonInner}>
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 12, marginRight: 16 }}
            />
            <View>
              <ShimmerElement
                width={80}
                height={16}
                style={{ marginBottom: 4 }}
              />
              <ShimmerElement width={160} height={12} />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 20,
    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonBase: {
    width: '100%',
    height: '100%',
  },
});

export default UnauthenticatedProfileSkeleton;
