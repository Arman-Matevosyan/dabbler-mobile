import { UserAPI } from '@/services/api';
import {
    createQueryKeys,
    invalidateAuthDependentQueries,
} from '@/services/query/queryClient';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

interface FormDataFile {
  uri: string;
  name: string;
  type: string;
}

declare global {
  interface FormData {
    append(
      name: string,
      value: FormDataFile | string | Blob,
      fileName?: string
    ): void;
  }
}

interface AvatarUploadParams {
  uri: string;
  mimeType: string;
}

export const useUser = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: createQueryKeys.user.data(),
    queryFn: async () => {
      const userData = await UserAPI.getCurrentUser();
      if (!userData) {
        throw new Error('Failed to fetch user data');
      }
      return userData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ uri, mimeType }: AvatarUploadParams) => {
      const formData = new FormData();

      const fileInfo: FormDataFile = {
        uri,
        type: mimeType || 'image/jpeg',
        name: 'avatar.jpg',
      };

      formData.append('file', fileInfo);

      return await UserAPI.uploadAvatar(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createQueryKeys.user.data(),
        refetchType: 'all',
      });

      queryClient.invalidateQueries({
        queryKey: createQueryKeys.auth.userAvatar(),
        refetchType: 'all',
      });

      invalidateAuthDependentQueries();
    },
  });

  const pickImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        const uriParts = asset.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];

        const mimeType =
          fileType === 'jpg' || fileType === 'jpeg'
            ? 'image/jpeg'
            : `image/${fileType}`;

        uploadMutation.mutate({
          uri: asset.uri,
          mimeType,
        });

        return asset.uri;
      }

      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      return null;
    }
  }, [uploadMutation]);

  const verifyEmailMutation = useMutation({
    mutationFn: () => UserAPI.verifyEmail(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: createQueryKeys.user.data(),
      });
    },
  });

  return {
    user,
    isLoading,
    error,
    refetch,
    isAuthenticated: !!user,
    uploadAvatar: {
      pickImage,
      isUploading: uploadMutation.isPending,
      error: uploadMutation.error,
    },
    verifyEmail: {
      sendVerification: verifyEmailMutation.mutate,
      isVerifying: verifyEmailMutation.isPending,
      error: verifyEmailMutation.error,
    },
  };
};

export default useUser;
