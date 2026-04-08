import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/constants/queryKeys';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

export const useLoginMutation = () =>
  useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authService.signIn(email, password),
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (params: { email: string; fullName: string; password: string }) =>
      authService.signUp(params),
  });

export const useForgotPasswordMutation = () =>
  useMutation({
    mutationFn: ({ email }: { email: string }) => authService.requestPasswordReset(email),
  });

export const useResetPasswordMutation = () =>
  useMutation({
    mutationFn: ({ password }: { password: string }) => authService.updatePassword(password),
  });

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      useAuthStore.getState().setAuthFlow('idle');
      queryClient.removeQueries({ queryKey: queryKeys.session });
    },
  });
};
