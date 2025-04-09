import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, View } from 'react-native';

interface CheckinTabsProps {
  activeTab: 'free' | 'scheduled';
  onChangeTab: (tab: 'free' | 'scheduled') => void;
  freeClassesCount: number;
  scheduledClassesCount: number;
}

const CheckinTabs: React.FC<CheckinTabsProps> = ({
  activeTab,
  onChangeTab,
  freeClassesCount,
  scheduledClassesCount,
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.tabsContainer}>
        <Pressable
          style={styles.tab}
          onPress={() => onChangeTab('free')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'free' ? colors.tint : colors.textSecondary,
              },
            ]}
          >
            {t('classes.availableClasses')}{' '}
            {freeClassesCount > 0 && `(${freeClassesCount})`}
          </ThemedText>
          {activeTab === 'free' && (
            <View
              style={[styles.indicator, { backgroundColor: colors.tint }]}
            />
          )}
        </Pressable>

        <Pressable
          style={styles.tab}
          onPress={() => onChangeTab('scheduled')}
          android_ripple={{ color: 'transparent' }}
          pressRetentionOffset={{ top: 10, left: 10, bottom: 10, right: 10 }}
        >
          <ThemedText
            style={[
              styles.tabText,
              {
                color:
                  activeTab === 'scheduled'
                    ? colors.tint
                    : colors.textSecondary,
              },
            ]}
          >
            {t('schedule.mySchedules')}{' '}
            {scheduledClassesCount > 0 && `(${scheduledClassesCount})`}
          </ThemedText>
          {activeTab === 'scheduled' && (
            <View
              style={[styles.indicator, { backgroundColor: colors.tint }]}
            />
          )}
        </Pressable>
      </View>
      <View
        style={[
          styles.bottomLine,
          { backgroundColor: colorScheme === 'dark' ? '#333' : '#eee' },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    position: 'relative',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: 60,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

export default CheckinTabs;
