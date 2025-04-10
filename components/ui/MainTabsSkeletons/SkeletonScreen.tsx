import { Colors } from '@/constants/Colors';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';

interface SkeletonScreenProps {
  children: React.ReactNode;
  fullScreen?: boolean;
}

const SkeletonScreen: React.FC<SkeletonScreenProps> = ({
  children,
  fullScreen = true,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  const statusBarHeight = useStatusBarHeight();

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
        fullScreen && { paddingTop: statusBarHeight },
      ]}
    >
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default SkeletonScreen;
