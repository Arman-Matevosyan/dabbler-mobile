import Avatar from '@/components/profile/Avatar';
import { ThemedText } from '@/components/ui/ThemedText';
import { useProfileTabStyles } from '@/styles/ProfileTabStyles';
import { UserProfile } from '@/types/user';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface UserInfoCardProps {
  user: UserProfile | null;
  handleAvatarUpload: () => Promise<void>;
  isAvatarUploadLoading: boolean;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({
  user,
  handleAvatarUpload,
  isAvatarUploadLoading,
}) => {
  const { styles } = useProfileTabStyles();

  return (
    <View style={styles.avatarContainer}>
      <Avatar
        imageUri={user?.image}
        size={120}
        onPress={handleAvatarUpload}
        isUploading={isAvatarUploadLoading}
      />

      <ThemedText
        style={{
          fontSize: 18,
          fontWeight: '600',
          textAlign: 'center',
          marginTop: 8,
        }}
      >
        {user?.firstName || ''} {user?.lastName || ''}
      </ThemedText>
    </View>
  );
};

const localStyles = StyleSheet.create({
  premiumBadgeContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  premiumText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    justifyContent: 'center',
  },
  idText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginRight: 8,
  },
});

export default UserInfoCard;
