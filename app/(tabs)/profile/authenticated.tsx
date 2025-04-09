import { MembershipStatus } from '@/components/profile/MembershipStatus';
import { MySchedules } from '@/components/profile/MySchedules';
import ProfileActions from '@/components/profile/ProfileActions';
import UserInfoCard from '@/components/profile/UserInfoCard';
import ProfileSkeleton from '@/components/ui/MainTabsSkeletons/ProfileSkeleton';
import SkeletonScreen from '@/components/ui/MainTabsSkeletons/SkeletonScreen';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/hooks';
import { useStatusBarHeight } from '@/hooks/useStatusBarHeight';
import { useTheme } from '@/providers/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  settingsButton: {
    padding: 8,
  },
});

const AuthenticatedProfile: React.FC = () => {
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const statusBarHeight = useStatusBarHeight();
  const {
    user,
    isLoading,
    refetch,
    uploadAvatar: { pickImage, isUploading: isAvatarUploadLoading },
  } = useUser();

  const [showPlansModal, setShowPlansModal] = useState(false);

  const handleAvatarUpload = async () => {
    try {
      await pickImage();
      await refetch();
    } catch (error) {
      console.error('Avatar upload error:', error);
    }
  };

  const handleNavigateToProfile = (path: string) => {
    router.push(`/(features)/profile/${path}` as any);
  };

  const openPlansModal = () => {
    setShowPlansModal(true);
  };

  const closePlansModal = () => {
    setShowPlansModal(false);
  };

  const userInfoCard = useMemo(
    () => (
      <UserInfoCard
        user={user as any}
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

  if (isLoading) {
    return (
      <SkeletonScreen>
        <ProfileSkeleton />
      </SkeletonScreen>
    );
  }

  if (!user) {
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
          activeOpacity={1}
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
