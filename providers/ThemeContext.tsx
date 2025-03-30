import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Appearance,
  useColorScheme as useDeviceColorScheme,
} from 'react-native';

type ThemeType = 'light' | 'dark' | 'system';
type ThemeContextType = {
  theme: ThemeType;
  colorScheme: 'light' | 'dark';
  toggleTheme: () => void;
  setThemeType: (theme: ThemeType) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  colorScheme: 'light',
  toggleTheme: () => {},
  setThemeType: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceColorScheme = useDeviceColorScheme() || 'light';
  const [theme, setTheme] = useState<ThemeType>('system');
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    deviceColorScheme as 'light' | 'dark'
  );

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as ThemeType);
          if (savedTheme !== 'system') {
            setColorScheme(savedTheme as 'light' | 'dark');
          }
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme: newColorScheme }) => {
        if (theme === 'system' && newColorScheme) {
          setColorScheme(newColorScheme as 'light' | 'dark');
        }
      }
    );

    return () => subscription.remove();
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(deviceColorScheme as 'light' | 'dark');
    } else {
      setColorScheme(theme as 'light' | 'dark');
    }
  }, [deviceColorScheme, theme]);

  const toggleTheme = () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
  };

  const setThemeType = async (newTheme: ThemeType) => {
    setTheme(newTheme);

    if (newTheme !== 'system') {
      setColorScheme(newTheme);
    } else {
      setColorScheme(deviceColorScheme as 'light' | 'dark');
    }

    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme preference', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        toggleTheme,
        setThemeType,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
