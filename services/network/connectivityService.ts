import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

// Cache keys
const CLASS_CACHE_KEY = 'cached_classes_data';
const CACHE_TIMESTAMP_KEY = 'classes_cache_timestamp';
const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if the device is currently connected to the internet
 */
export const checkConnectivity = async (): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    return state.isConnected === true && state.isInternetReachable === true;
  } catch (error) {
    console.error('Error checking connectivity:', error);
    return false;
  }
};

/**
 * Cache data for offline use
 */
export const cacheData = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    await AsyncStorage.setItem(`${key}_timestamp`, Date.now().toString());
  } catch (error) {
    console.error(`Error caching data for ${key}:`, error);
  }
};

/**
 * Get cached data
 */
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(key);
    const timestampStr = await AsyncStorage.getItem(`${key}_timestamp`);
    
    if (!cachedData || !timestampStr) {
      return null;
    }
    
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    
    // Check if cache is expired
    if (now - timestamp > CACHE_EXPIRY) {
      // Expired cache, clear it
      await AsyncStorage.removeItem(key);
      await AsyncStorage.removeItem(`${key}_timestamp`);
      return null;
    }
    
    return JSON.parse(cachedData) as T;
  } catch (error) {
    console.error(`Error retrieving cached data for ${key}:`, error);
    return null;
  }
};

/**
 * Specific function for caching classes data
 */
export const cacheClassesData = async (data: any): Promise<void> => {
  await cacheData(CLASS_CACHE_KEY, data);
};

/**
 * Specific function for retrieving cached classes data
 */
export const getCachedClassesData = async (): Promise<any | null> => {
  return getCachedData(CLASS_CACHE_KEY);
}; 