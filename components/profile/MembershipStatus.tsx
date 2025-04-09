import Skeleton from '@/components/ui/Skeleton';
import { Colors } from '@/constants/Colors';
import { useSubscriptions } from '@/hooks/payment/useSubscriptions';
import { useTheme } from '@/providers/ThemeContext';
import { ISubscription } from '@/types';
import { router } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const MembershipStatus: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { data: subscription, isLoading } = useSubscriptions();
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Skeleton width={120} height={24} />
      </View>
    );
  }

  const handlePress = () => {
    router.push('/(features)/profile/plans');
  };

  const typedSubscription = subscription as ISubscription | undefined;

  const isActive = typedSubscription && typedSubscription.plan?.planId;

  const planName =
    isActive && typedSubscription?.plan
      ? typedSubscription.plan.name
      : t('profile.inactive');

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.premiumBadgeContainer,
          {
            borderColor: isActive
              ? 'rgba(255, 255, 255, 0.3)'
              : 'rgba(255, 255, 255, 0.2)',
          },
        ]}
        onPress={handlePress}
        activeOpacity={1}
      >
        <Text
          style={[
            styles.premiumText,
            {
              color: isActive ? colors.text : 'rgba(255, 255, 255, 0.6)',
            },
          ]}
        >
          {planName}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  premiumBadgeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 20,
  },
  premiumText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
