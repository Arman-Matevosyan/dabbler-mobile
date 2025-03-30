import { axiosClient } from '@/api';
import { QueryKeys } from '@/constants/QueryKeys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';

export function useAvatarUpload() {
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({
      uri,
      mimeType,
    }: {
      uri: string;
      mimeType: string;
    }) => {
      const formData = new FormData();

      const file = {
        uri,
        type: mimeType || 'image/jpeg',
        name: 'avatar.jpg',
      };

      formData.append('file', file);

      return await axiosClient.post('/users/me/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QueryKeys.userQueryKey],
      });
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
      return null;
    }
  }, [uploadMutation]);

  return {
    pickImage,
    isUploading: uploadMutation.isPending,
    error: uploadMutation.error,
  };
}

export default useAvatarUpload;
