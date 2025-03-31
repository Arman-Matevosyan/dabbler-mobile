import axiosClient from '@/api/axiosClient';
import { getBaseURL } from '@/constants/constants';
import { AuthResponse } from '@/services/api';
import { invalidateAuthDependentQueries } from '@/services/query/queryClient';
import { useAuthStore } from '@/store/authStore';
import axios from 'axios';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

/**
 * Extract token from URL parameters
 */
const extractTokenFromUrl = (url: string) => {
  try {
    // First check for query parameters
    const urlParts = url.split('?');
    if (urlParts.length <= 1) return null;
    
    const params = new URLSearchParams(urlParts[1]);
    const token = params.get('token') || params.get('refresh');
    const type = params.get('type');
    
    return { token, type };
  } catch (error) {
    console.error('Error extracting token from URL:', error);
    return null;
  }
};

/**
 * Hook for handling social authentication flow
 */
export const useSocialAuth = () => {
  const handleSocialLogin = useAuthStore((state) => state.handleSocialLogin);
  const setSocialLoading = useAuthStore((state) => state.setSocialLoading);
  const setTokens = useAuthStore((state) => state.setTokens);
  const fetchUser = useAuthStore((state) => state.fetchUser);

  const startSocialLogin = async (type: 'google' | 'facebook') => {
    try {
      // Set loading state
      setSocialLoading(type);
      
      const result = await handleSocialLogin(type);
      if (!result || !('authUrl' in result)) {
        setSocialLoading(null);
        return false;
      }
      
      // Open browser for authentication
      const browserResult = await WebBrowser.openAuthSessionAsync(
        result.authUrl,
        result.callbackUrl,
        { preferEphemeralSession: true }
      );

      // Check if we have a successful redirect
      if (browserResult.type !== 'success' || !browserResult.url) {
        setSocialLoading(null);
        return false;
      }
      
      console.log('Redirect URL:', browserResult.url);
      
      // Extract token from the URL
      const tokenData = extractTokenFromUrl(browserResult.url);
      if (!tokenData?.token) {
        setSocialLoading(null);
        return false;
      }
      
      // Process the token based on whether we have a type or not
      if (tokenData.type) {
        // Use standard social login flow
        const authResponse = await handleSocialLogin(
          tokenData.type as 'google' | 'facebook',
          tokenData.token
        );
        
        if (authResponse && 'accessToken' in authResponse) {
          // Update axios default headers with the new token
          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${(authResponse as AuthResponse).accessToken}`;
          
          // Invalidate user-dependent queries to refresh data
          invalidateAuthDependentQueries();
          
          // Navigate to the authenticated section
          router.replace('/(tabs)/profile/authenticated');
          setSocialLoading(null);
          return true;
        }
      } else {
        // Direct token exchange flow
        try {
          const response = await axios.post(
            `${getBaseURL()}/auth/refresh`,
            { refreshToken: tokenData.token },
            { headers: { 'Content-Type': 'application/json' } }
          );
          
          if (response.data.accessToken) {
            // Store the tokens
            await setTokens(response.data.accessToken, response.data.refreshToken || tokenData.token);
            
            // Update user data
            await fetchUser();
            
            // Refresh queries
            invalidateAuthDependentQueries();
            
            // Navigate to authenticated profile
            router.replace('/(tabs)/profile/authenticated');
            setSocialLoading(null);
            return true;
          }
        } catch (error) {
          console.error('Error exchanging social token:', error);
        }
      }
      
      // Clear loading state
      setSocialLoading(null);
      return false;
    } catch (error) {
      console.error('Social login error:', error);
      setSocialLoading(null);
      return false;
    }
  };

  return { startSocialLogin };
};

/**
 * Handle deep linking for social authentication
 * @param url The URL to process
 */
export const processSocialAuthDeepLink = async (url: string) => {
  try {
    const tokenData = extractTokenFromUrl(url);
    if (!tokenData?.token) return null;
    
    return { 
      refreshToken: tokenData.token, 
      loginType: tokenData.type as 'google' | 'facebook' | 'unknown' | undefined 
    };
  } catch (error) {
    console.error('Social auth deep link processing failed:', error);
    return null;
  }
}; 