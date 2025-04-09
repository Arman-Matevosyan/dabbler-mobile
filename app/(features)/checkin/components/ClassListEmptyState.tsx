import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

interface ClassListEmptyStateProps {
  type: 'free' | 'scheduled';
}

export const ClassListEmptyState: React.FC<ClassListEmptyStateProps> = ({
  type,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  const getMessage = () => {
    if (type === 'free') {
      return {
        title: t('classes.noAvailableClasses'),
        description: t('checkin.noAvailableClassesDescription'),
      };
    } else {
      return {
        title: t('classes.noScheduledClasses'),
        description: t('checkin.noScheduledClassesDescription'),
      };
    }
  };

  const { title, description } = getMessage();

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={
          type === 'free' ? 'calendar-text-outline' : 'calendar-check-outline'
        }
        size={80}
        color={colors.textSecondary}
      />
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={[styles.description, { color: colors.textSecondary }]}>
        {description}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
