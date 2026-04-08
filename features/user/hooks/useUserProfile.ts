import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';

export const useUserProfileQuery = () => {
  const userId = useAuthStore((state) => state.user?.id);

  return useQuery({
    enabled: Boolean(userId),
    queryFn: () => userService.getProfile(userId as string),
    queryKey: queryKeys.profile(userId),
  });
};

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (payload: { full_name: string }) =>
      userService.upsertProfile({
        full_name: payload.full_name,
        id: userId as string,
      }),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile(userId), profile);
    },
  });
};

export const useUploadAvatarMutation = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore((state) => state.user?.id);

  return useMutation({
    mutationFn: (fileUri: string) => userService.uploadAvatar(userId as string, fileUri),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile(userId) });
    },
  });
};
