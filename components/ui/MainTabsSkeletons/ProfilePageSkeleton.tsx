import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ProfilePageSkeletonProps {
  type?: 'details' | 'settings' | 'plans' | 'membership' | 'payment';
  itemCount?: number;
}

export const ProfilePageSkeleton: React.FC<ProfilePageSkeletonProps> = ({
  type = 'details',
  itemCount = 4,
}) => {
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

  const renderHeader = () => (
    <View>
      <View style={styles.backButtonContainer}>
        <ShimmerElement width={24} height={24} style={{ borderRadius: 12 }} />
        <ShimmerElement width={80} height={18} style={{ marginLeft: 8 }} />
      </View>

      <ShimmerElement
        width={180}
        height={28}
        style={{ marginTop: 16, marginBottom: 24 }}
      />
    </View>
  );

  const renderDetailItems = () => {
    return Array(itemCount)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[
            styles.detailItemContainer,
            {
              borderBottomColor: colors.border,
              borderBottomWidth: 1,
              paddingBottom: 16,
            },
          ]}
        >
          <View style={styles.detailItemRow}>
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 4 }}
            />
            <View style={{ marginLeft: 12 }}>
              <ShimmerElement
                width={80}
                height={16}
                style={{ marginBottom: 8 }}
              />
              <ShimmerElement width={120} height={14} />
            </View>
          </View>
        </View>
      ));
  };

  const renderPlanItems = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[
            styles.planItemContainer,
            { backgroundColor: colors.cardBackground, marginBottom: 16 },
          ]}
        >
          <View style={styles.planHeaderRow}>
            <ShimmerElement width={100} height={20} />
            <ShimmerElement
              width={80}
              height={20}
              style={{ borderRadius: 10 }}
            />
          </View>

          <View style={{ marginTop: 12 }}>
            <ShimmerElement
              width="90%"
              height={14}
              style={{ marginBottom: 8 }}
            />
            <ShimmerElement
              width="80%"
              height={14}
              style={{ marginBottom: 8 }}
            />
          </View>

          <View style={{ marginTop: 16, alignItems: 'center' }}>
            <ShimmerElement
              width={120}
              height={40}
              style={{ borderRadius: 20 }}
            />
          </View>
        </View>
      ));
  };

  const renderSettingsItems = () => {
    return Array(itemCount)
      .fill(0)
      .map((_, index) => (
        <View
          key={index}
          style={[
            styles.settingItemContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.settingItemRow}>
            <ShimmerElement
              width={24}
              height={24}
              style={{ borderRadius: 4 }}
            />
            <ShimmerElement
              width={150}
              height={16}
              style={{ marginLeft: 12 }}
            />
          </View>
          <ShimmerElement width={20} height={20} style={{ borderRadius: 10 }} />
        </View>
      ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}

      {type === 'details' && renderDetailItems()}
      {type === 'settings' && renderSettingsItems()}
      {(type === 'plans' || type === 'membership') && renderPlanItems()}
      {type === 'payment' && (
        <View
          style={[
            styles.paymentContainer,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <ShimmerElement
            width="60%"
            height={20}
            style={{ marginBottom: 24 }}
          />
          <ShimmerElement
            width="100%"
            height={50}
            style={{ marginBottom: 16, borderRadius: 8 }}
          />
          <ShimmerElement
            width="100%"
            height={50}
            style={{ marginBottom: 16, borderRadius: 8 }}
          />
          <ShimmerElement
            width="100%"
            height={50}
            style={{ borderRadius: 8 }}
          />

          <View style={{ marginTop: 32, alignItems: 'center' }}>
            <ShimmerElement
              width={180}
              height={46}
              style={{ borderRadius: 23 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  skeletonBase: {
    width: '100%',
    height: '100%',
  },
  backButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  detailItemContainer: {
    marginBottom: 16,
  },
  detailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planItemContainer: {
    padding: 16,
    borderRadius: 12,
  },
  planHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentContainer: {
    padding: 16,
    borderRadius: 12,
  },
});

export default ProfilePageSkeleton;
