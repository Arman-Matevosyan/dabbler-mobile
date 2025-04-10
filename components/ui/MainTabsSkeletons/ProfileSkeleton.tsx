import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

export const ProfileSkeleton: React.FC = () => {
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
      <View style={styles.headerContainer}>
        <ShimmerElement
          width={24}
          height={24}
          style={{ borderRadius: 12, position: 'absolute', right: 16, top: 16 }}
        />
      </View>

      <View style={styles.headerSection}>
        <View style={styles.avatarContainer}>
          <ShimmerElement
            width={120}
            height={120}
            style={{ borderRadius: 60 }}
          />
        </View>

        <ShimmerElement
          width={180}
          height={24}
          style={{ alignSelf: 'center', marginBottom: 8 }}
        />

        <ShimmerElement
          width={220}
          height={16}
          style={{ alignSelf: 'center', marginBottom: 16 }}
        />

        <View
          style={[
            styles.planContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <ShimmerElement width={100} height={22} style={{ marginBottom: 8 }} />

          <ShimmerElement width={180} height={16} />
        </View>
      </View>

      <View style={styles.actionButtonsContainer}>
        <View style={styles.actionButtonsRow}>
          <View
            style={[
              styles.actionButton,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 12, marginBottom: 8 }}
            />
            <ShimmerElement width={60} height={14} />
          </View>

          <View
            style={[
              styles.actionButton,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 12, marginBottom: 8 }}
            />
            <ShimmerElement width={60} height={14} />
          </View>

          <View
            style={[
              styles.actionButton,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 12, marginBottom: 8 }}
            />
            <ShimmerElement width={60} height={14} />
          </View>
        </View>
      </View>

      <View
        style={[
          styles.sectionContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <ShimmerElement width={150} height={18} style={{ marginBottom: 16 }} />

        <View style={styles.scheduleItem}>
          <ShimmerElement
            width={80}
            height={80}
            style={{ borderRadius: 8, marginRight: 12 }}
          />
          <View style={styles.scheduleDetails}>
            <ShimmerElement
              width="80%"
              height={16}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement
              width="70%"
              height={14}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement
              width="60%"
              height={14}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement width="50%" height={14} />
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.scheduleItem}>
          <ShimmerElement
            width={80}
            height={80}
            style={{ borderRadius: 8, marginRight: 12 }}
          />
          <View style={styles.scheduleDetails}>
            <ShimmerElement
              width="75%"
              height={16}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement
              width="65%"
              height={14}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement
              width="55%"
              height={14}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement width="45%" height={14} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    height: 56,
    width: '100%',
    position: 'relative',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    marginBottom: 16,
  },
  planContainer: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 12,
    width: '90%',
    alignItems: 'center',
  },
  actionButtonsContainer: {
    marginBottom: 24,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '31%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  sectionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  scheduleDetails: {
    flex: 1,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 16,
  },
  skeletonBase: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileSkeleton;
