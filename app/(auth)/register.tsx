import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Button, Card, FormInput } from '@/components/ui';
import { routePaths } from '@/constants/routes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import { useRegisterMutation } from '@/features/auth/hooks/useAuthMutations';
import { type RegisterFormValues, registerSchema } from '@/features/auth/schemas';

export default function RegisterScreen() {
  const { theme } = useAppTheme();
  const [verificationNotice, setVerificationNotice] = useState<string | null>(null);
  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  });
  const registerMutation = useRegisterMutation();

  return (
    <Screen subtitle="Create your account to get started." title="Create account">
      <Card>
        <View className="gap-5">
          <FormInput
            control={form.control}
            label="Full name"
            name="fullName"
            placeholder="Jane Doe"
          />
          <FormInput
            autoCapitalize="none"
            autoComplete="email"
            control={form.control}
            keyboardType="email-address"
            label="Email address"
            name="email"
            placeholder="jane@example.com"
            textContentType="emailAddress"
          />
          <FormInput
            autoCapitalize="none"
            autoComplete="password-new"
            control={form.control}
            label="Password"
            name="password"
            placeholder="Create a strong password"
            secureTextEntry
            textContentType="newPassword"
          />

          <View className="pt-1">
            <Button
              loading={registerMutation.isPending}
              onPress={form.handleSubmit(async (values) => {
                const result = await registerMutation.mutateAsync(values);

                if (result.requiresEmailVerification) {
                  setVerificationNotice(
                    'Account created! Check your email to verify your address.',
                  );
                }
              })}
              size="lg"
            >
              Create account
            </Button>
          </View>

          {verificationNotice ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.successLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.success }}>
                {verificationNotice}
              </Text>
            </View>
          ) : null}

          {registerMutation.error ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.dangerLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
                {getErrorMessage(registerMutation.error)}
              </Text>
            </View>
          ) : null}
        </View>
      </Card>

      <View className="items-center pt-2">
        <Text className="text-base" style={{ color: theme.colors.muted }}>
          Already registered?{' '}
          <Link href={routePaths.login} style={{ color: theme.colors.primary, fontWeight: '700' }}>
            Go to login
          </Link>
        </Text>
      </View>
    </Screen>
  );
}
