import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Animated,
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface CollapsiblePanelProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const CollapsiblePanel = ({
  title,
  icon,
  children,
  defaultExpanded = true,
}: CollapsiblePanelProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const rotateAnim = useRef(
    new Animated.Value(defaultExpanded ? 1 : 0)
  ).current;

  const toggleExpand = () => {
    LayoutAnimation.configureNext({
      duration: 300,
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    });

    const toValue = !isExpanded ? 1 : 0;
    Animated.timing(rotateAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setIsExpanded(!isExpanded);
  };

  const arrowRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
    >
      <Pressable
        onPress={toggleExpand}
        style={({ pressed }) => [
          styles.header,
          { borderBottomColor: colors.border },
          pressed && { opacity: 0.8 },
        ]}
      >
        <View style={styles.titleContainer}>
          <Ionicons
            name={icon}
            size={24}
            color={colors.accentPrimary}
            style={styles.titleIcon}
          />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Ionicons
            name="chevron-down"
            size={24}
            color={colors.textSecondary}
          />
        </Animated.View>
      </Pressable>
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
    marginBottom: 16,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
