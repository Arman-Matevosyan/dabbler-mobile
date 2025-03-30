import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const ThemeToggle: React.FC = () => {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === 'dark';

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: isDark ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isDark]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <TouchableWithoutFeedback onPress={toggleTheme}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.toggle,
            {
              backgroundColor: isDark
                ? colors.secondary
                : colors.cardBackground,
              transform: [{ scale: scaleAnim }, { rotate: rotation }],
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={24}
              color={isDark ? colors.accentPrimary : '#FFB800'}
            />
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  toggle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemeToggle;
