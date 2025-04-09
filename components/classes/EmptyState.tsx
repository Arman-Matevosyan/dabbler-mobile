import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: any;
  isOffline?: boolean;
  isNetworkError?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Data Found',
  message = 'No items match your search criteria.',
  icon = 'information-outline',
  isOffline = false,
  isNetworkError = false,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  // Adjust display based on connectivity state
  let displayTitle = title;
  let displayMessage = message;
  let displayIcon = icon;

  if (isOffline) {
    displayTitle = t('classes.youAreOffline');
    displayMessage = t('classes.connectToInternet');
    displayIcon = 'wifi-off';
  } else if (isNetworkError) {
    displayTitle = t('classes.connectionIssue');
    displayMessage = t('classes.couldntConnectToServers');
    displayIcon = 'server-network-off';
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name={displayIcon}
        size={60}
        color={colors.textSecondary}
      />
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        {displayTitle}
      </Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        {displayMessage}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    marginTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
});
