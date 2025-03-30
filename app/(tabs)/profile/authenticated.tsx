import { MembershipStatus } from '@/components/profile/MembershipStatus';
import { MySchedules } from '@/components/profile/MySchedules';
import ProfileActions from '@/components/profile/ProfileActions';
import UserInfoCard from '@/components/profile/UserInfoCard';
import ProfileSkeleton from '@/components/ui/MainTabsSkeletons/ProfileSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { useAvatarUpload } from '@/hooks/profile/useAvatarUpload';
import { useUserProfile } from '@/hooks/profile/useUserProfile';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import { useAuth } from '@/providers/AuthProvider';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';

const AuthenticatedProfile: React.FC = () => {
  const statusBarHeight = useStatusBarHeight();
  const { styles, colors } = useProfileTabStyles();
  const { isLoading: isAuthLoading } = useAuth();
  const {
    user,
    isLoading: isUserLoading,
    refetch: fetchUser,
  } = useUserProfile();
  const { pickImage, isUploading: isAvatarUploadLoading } = useAvatarUpload();

  const handleAvatarUpload = async () => {
    try {
      await pickImage();
      await fetchUser();
    } catch (error) {
      console.error('Avatar upload error:', error);
    }
  };

  const handleNavigateToProfile = (path: string) => {
    router.push(`/(features)/profile/${path}` as any);
  };

  const userInfoCard = useMemo(
    () => (
      <UserInfoCard
        user={user}
        handleAvatarUpload={handleAvatarUpload}
        isAvatarUploadLoading={isAvatarUploadLoading}
      />
    ),
    [user, handleAvatarUpload, isAvatarUploadLoading]
  );

  const profileActions = useMemo(
    () => (
      <ProfileActions
        colors={{
          accentPrimary: colors.accentPrimary,
          textPrimary: colors.textPrimary,
          cardBackground: colors.cardBackground,
        }}
      />
    ),
    [colors]
  );

  const isLoading = isAuthLoading || isUserLoading;

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfileSkeleton />
      </SkeletonScreen>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          paddingTop: statusBarHeight,
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => handleNavigateToProfile('settings')}
        >
          <MaterialCommunityIcons
            name="cog"
            size={24}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {userInfoCard}
      <MembershipStatus />
      {profileActions}
      <MySchedules />
    </SafeAreaView>
  );
};

export default AuthenticatedProfile;
