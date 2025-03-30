import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface SkeletonProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: object;
}

const Skeleton: React.FC<SkeletonProps> = ({
  width = 100,
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];

  return (
    <View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.skeletonBackground,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    opacity: 0.4,
  },
});

export default Skeleton; 