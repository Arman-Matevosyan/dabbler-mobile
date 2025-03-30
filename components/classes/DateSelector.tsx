import { Colors } from '@/constants/Colors';
import { useTheme } from '@/providers/ThemeContext';
import { format } from 'date-fns';
import { enUS, hy, ru } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface DateSelectorProps {
  dates: Date[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onDateSelect,
}) => {
  const { colorScheme } = useTheme() || { colorScheme: 'dark' };
  const colors = Colors[colorScheme || 'dark'];
  const { t, i18n } = useTranslation();

  // Get locale based on current language
  const getLocale = () => {
    switch (i18n.language) {
      case 'ru':
        return ru;
      case 'hy':
        return hy;
      default:
        return enUS;
    }
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const locale = getLocale();
    
    if (isToday) {
      return {
        display: t('classes.today'),
        isToday
      };
    }
    
    return {
      display: `${format(date, 'EEE', { locale })} ${format(date, 'd')}`,
      isToday
    };
  };

  return (
    <View style={[styles.dateSelectionContainer, { borderBottomColor: colors.border }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dateScrollContent}
      >
        {dates.map((date, index) => {
          const formatted = formatDate(date);
          const isSelected = date.toDateString() === selectedDate.toDateString();

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              style={[
                styles.dateItem,
                formatted.isToday && { 
                  borderRightColor: 'rgba(255,255,255,0.1)', 
                  borderRightWidth: 1,
                  height: '90%',
                  alignSelf: 'center'
                }
              ]}
              onPress={() => onDateSelect(date)}
            >
              <Text style={[
                styles.dateText,
                { color: isSelected ? colors.accentPrimary : colors.textSecondary }
              ]}>
                {formatted.display}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dateSelectionContainer: {
    borderBottomWidth: 1,
    height: 48,
  },
  dateScrollContent: {
    paddingHorizontal: 16,
    height: '100%',
  },
  dateItem: {
    paddingHorizontal: 12,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    minWidth: 80,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 