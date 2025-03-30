import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ActivityChipProps {
  title: string;
  style?: any;
}

const ActivityChip = ({ title, style }: ActivityChipProps) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme || 'dark'];
  
  return (
    <View style={[styles.activityChip, { backgroundColor: colors.secondary }, style]}>
      <Text style={[styles.activityChipText, { color: colors.textPrimary }]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  activityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  activityChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ActivityChip; 