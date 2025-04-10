import { Colors } from '@/constants/Colors';
import NetInfo from '@react-native-community/netinfo';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { useTheme } from './ThemeContext';

interface NetworkContextType {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: null,
  isInternetReachable: null,
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);
  const [bannerVisible, setBannerVisible] = useState(false);
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  
  const bannerPosition = new Animated.Value(-50);
  
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
      
      const shouldShowBanner = !(state.isConnected && state.isInternetReachable);
      setBannerVisible(shouldShowBanner);
    });
    
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    Animated.timing(bannerPosition, {
      toValue: bannerVisible ? 0 : -50,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [bannerVisible, bannerPosition]);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
      }}
    >
      <Animated.View
        style={[
          styles.banner,
          { 
            backgroundColor: colors.errorBackground || '#ff3b30',
            transform: [{ translateY: bannerPosition }],
          },
        ]}
      >
        <Text style={styles.bannerText}>
          No internet connection
        </Text>
      </Animated.View>

      {children}
    </NetworkContext.Provider>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  bannerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default NetworkProvider; 