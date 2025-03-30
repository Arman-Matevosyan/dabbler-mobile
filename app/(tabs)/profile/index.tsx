import { useUserProfile } from '@/hooks/profile/useUserProfile';
import { useAuth } from '@/providers/AuthProvider';
import { useEffect, useMemo, useState } from 'react';
import AuthenticatedProfile from './authenticated';
import UnauthenticatedProfile from './unauthenticated';

export default function ProfileScreen() {
  const { isAuthenticated } = useAuth();
  const { refetch: prefetchUserProfile } = useUserProfile();
  const [showAuthenticated, setShowAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      prefetchUserProfile();
    }
  }, [isAuthenticated, prefetchUserProfile]);

  useEffect(() => {
    setShowAuthenticated(isAuthenticated);
  }, [isAuthenticated]);

  const authenticatedProfile = useMemo(() => <AuthenticatedProfile />, []);
  const unauthenticatedProfile = useMemo(() => <UnauthenticatedProfile />, []);

  if (showAuthenticated) {
    return authenticatedProfile;
  }

  return unauthenticatedProfile;
}
