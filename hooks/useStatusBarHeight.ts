import { useEffect, useState } from 'react';
import { Dimensions, StatusBar } from 'react-native';

export const useStatusBarHeight = () => {
  const [statusBarHeight, setStatusBarHeight] = useState(
    StatusBar.currentHeight
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', () => {
      setStatusBarHeight(StatusBar.currentHeight);
    });

    return () => subscription.remove();
  }, []);

  return statusBarHeight;
};
