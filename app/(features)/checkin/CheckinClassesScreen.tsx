import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { CheckinTabs } from './components/CheckinTabs';
import { FreeClassesList } from './components/FreeClassesList';
import { ScheduledClassesList } from './components/ScheduledClassesList';

const HeaderBackButton = ({ onPress }: { onPress: () => void }) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  return (
    <Pressable 
      style={styles.backButton}
      onPress={onPress}
      android_ripple={{color: 'transparent'}}
    >
      <MaterialIcons 
        name="arrow-back" 
        size={24} 
        color={colors.textPrimary} 
      />
    </Pressable>
  );
};

interface Class {
  id: string;
  name: string;
  instructorInfo: string;
  duration: number;
  scheduled: boolean;
  date: string | null;
  scheduledSpots: number;
  totalSpots: number;
  covers: any[];
  venue: any;
  categories: string[];
}

interface CheckinClassesScreenProps {
  data: {
    freeClasses: Class[];
    scheduledClasses: Class[];
  };
  isLoading?: boolean;
  onBackPress?: () => void;
}

export const CheckinClassesScreen: React.FC<CheckinClassesScreenProps> = ({ 
  data, 
  isLoading = false,
  onBackPress
}) => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'free' | 'scheduled'>('free');

  useLayoutEffect(() => {
    StatusBar.setBarStyle(colorScheme === 'dark' ? 'light-content' : 'dark-content');
    return () => {
      StatusBar.setBarStyle('default');
    };
  }, [colorScheme]);

  const handleGoBack = useCallback(() => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  }, [onBackPress]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <HeaderBackButton onPress={handleGoBack} />
        <ThemedText style={styles.headerTitle}>{t('checkin.checkins')}</ThemedText>
        <View style={styles.headerRight} />
      </View>

      <CheckinTabs 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        freeClassesCount={data.freeClasses?.length || 0}
        scheduledClassesCount={data.scheduledClasses?.length || 0}
      />

      <View style={styles.content}>
        {activeTab === 'free' ? (
          <FreeClassesList 
            classes={data.freeClasses || []} 
            isLoading={isLoading}
          />
        ) : (
          <ScheduledClassesList 
            classes={data.scheduledClasses || []} 
            isLoading={isLoading}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
  },
}); 