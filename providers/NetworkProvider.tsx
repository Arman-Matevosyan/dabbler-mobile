import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';

// Define the context type
interface NetworkContextType {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
  refreshNetworkStatus: () => Promise<void>;
}

// Create the context with a default value
const NetworkContext = createContext<NetworkContextType>({
  isConnected: null,
  isInternetReachable: null,
  refreshNetworkStatus: async () => {},
});

// Custom hook to use the network context
export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: React.ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
  const [networkState, setNetworkState] = useState<{
    isConnected: boolean | null;
    isInternetReachable: boolean | null;
  }>({
    isConnected: null,
    isInternetReachable: null,
  });

  // Function to refresh network status manually
  const refreshNetworkStatus = async () => {
    try {
      const state = await NetInfo.fetch();
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    } catch (error) {
      console.error('Error fetching network state:', error);
    }
  };

  useEffect(() => {
    // Set up the initial network state
    refreshNetworkStatus();

    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkState({
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
      
      // Log network status changes
      console.log('Network status changed:', {
        isConnected: state.isConnected,
        isInternetReachable: state.isInternetReachable,
      });
    });

    // Clean up the subscription
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        ...networkState,
        refreshNetworkStatus,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkProvider; 