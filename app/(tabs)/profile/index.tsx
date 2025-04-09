import { useUser } from '@/hooks';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEffect, useMemo, useState } from 'react';
import AuthenticatedProfile from './authenticated';
import UnauthenticatedProfile from './unauthenticated';

export default function ProfileScreen() {
  const { isAuthenticated } = useAuth();
  const { refetch: prefetchUserProfile } = useUser();
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
