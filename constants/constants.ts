import Constants from 'expo-constants';

export const getBaseURL = () => {
  const isProduction = Constants.expoConfig?.extra?.isProduction === 'true';
  return isProduction
    ? 'https://api.dabblerclub.com'
    : 'https://dev-api.dabblerclub.com';
};

export const baseURL = getBaseURL();
