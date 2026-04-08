import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Button, Card, FormInput } from '@/components/ui';
import { routePaths } from '@/constants/routes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from '@/features/auth/hooks/useAuthMutations';
import {
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/features/auth/schemas';
import { useAuthStore } from '@/store/useAuthStore';

export default function ForgotPasswordScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const authFlow = useAuthStore((state) => state.authFlow);
  const setAuthFlow = useAuthStore((state) => state.setAuthFlow);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const forgotPasswordMutation = useForgotPasswordMutation();
  const resetPasswordMutation = useResetPasswordMutation();
  const requestResetForm = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const updatePasswordForm = useForm<ResetPasswordFormValues>({
    defaultValues: {
      confirmPassword: '',
      password: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  });

  const isRecoveryMode = authFlow === 'password-recovery' || mode === 'recovery';

  return (
    <Screen
      subtitle={
        isRecoveryMode
          ? 'Choose a new password for your account.'
          : 'Enter your email to receive a password reset link.'
      }
      title={isRecoveryMode ? 'Set a new password' : 'Reset password'}
    >
      <Card>
        <View className="gap-5">
          {isRecoveryMode ? (
            <>
              <FormInput
                autoCapitalize="none"
                autoComplete="password-new"
                control={updatePasswordForm.control}
                label="New password"
                name="password"
                placeholder="Create a new password"
                secureTextEntry
                textContentType="newPassword"
              />
              <FormInput
                autoCapitalize="none"
                autoComplete="password-new"
                control={updatePasswordForm.control}
                label="Confirm password"
                name="confirmPassword"
                placeholder="Repeat the new password"
                secureTextEntry
                textContentType="newPassword"
              />
              <View className="pt-1">
                <Button
                  loading={resetPasswordMutation.isPending}
                  onPress={updatePasswordForm.handleSubmit(async ({ password }) => {
                    await resetPasswordMutation.mutateAsync({ password });
                    setAuthFlow('idle');
                    router.replace(routePaths.home);
                  })}
                  size="lg"
                >
                  Update password
                </Button>
              </View>
            </>
          ) : (
            <>
              <FormInput
                autoCapitalize="none"
                autoComplete="email"
                control={requestResetForm.control}
                keyboardType="email-address"
                label="Email address"
                name="email"
                placeholder="jane@example.com"
                textContentType="emailAddress"
              />
              <View className="pt-1">
                <Button
                  loading={forgotPasswordMutation.isPending}
                  onPress={requestResetForm.handleSubmit(async (values) => {
                    await forgotPasswordMutation.mutateAsync(values);
                    setInfoMessage(
                      'Password reset email sent. Check your inbox for the recovery link.',
                    );
                  })}
                  size="lg"
                >
                  Send reset email
                </Button>
              </View>
            </>
          )}

          {infoMessage ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.successLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.success }}>
                {infoMessage}
              </Text>
            </View>
          ) : null}

          {forgotPasswordMutation.error ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.dangerLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
                {getErrorMessage(forgotPasswordMutation.error)}
              </Text>
            </View>
          ) : null}

          {resetPasswordMutation.error ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.dangerLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
                {getErrorMessage(resetPasswordMutation.error)}
              </Text>
            </View>
          ) : null}
        </View>
      </Card>
    </Screen>
  );
}
