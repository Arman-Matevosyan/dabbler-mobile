import ProfileSkeleton from '@/components/ui/MainTabsSkeletons/ProfileSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import UnauthenticatedProfileSkeleton from '@/components/ui/MainTabsSkeletons/UnauthenticatedProfileSkeleton';
import { useUser } from '@/hooks';
import { useAuth } from '@/hooks/auth/useAuth';
import { useEffect, useState } from 'react';
import AuthenticatedProfile from './authenticated';
import UnauthenticatedProfile from './unauthenticated';

export default function ProfileScreen() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refetch: prefetchUserProfile, isLoading: userLoading } = useUser();
  const [showAuthenticated, setShowAuthenticated] = useState(isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      prefetchUserProfile();
    }
  }, [isAuthenticated, prefetchUserProfile]);

  if (userLoading || authLoading) {
    return (
      <SkeletonScreen>
        {showAuthenticated ? (
          <ProfileSkeleton />
        ) : (
          <UnauthenticatedProfileSkeleton />
        )}
      </SkeletonScreen>
    );
  }

  if (showAuthenticated) {
    return <AuthenticatedProfile />;
  }

  return <UnauthenticatedProfile />;
}
