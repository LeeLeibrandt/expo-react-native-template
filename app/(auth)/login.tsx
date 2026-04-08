import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Button, Card, FormInput } from '@/components/ui';
import { isSupabaseConfigured } from '@/constants/env';
import { routePaths } from '@/constants/routes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import { useLoginMutation } from '@/features/auth/hooks/useAuthMutations';
import { type LoginFormValues, loginSchema } from '@/features/auth/schemas';

export default function LoginScreen() {
  const { theme } = useAppTheme();
  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  });
  const loginMutation = useLoginMutation();

  return (
    <Screen subtitle="Sign in to continue to your account." title="Welcome back">
      {!isSupabaseConfigured ? (
        <View
          className="rounded-2xl px-4 py-3"
          style={{ backgroundColor: theme.colors.primaryLight }}
        >
          <Text className="text-[13px] leading-[18px]" style={{ color: theme.colors.primary }}>
            Add Supabase environment variables to activate email/password auth and session
            persistence.
          </Text>
        </View>
      ) : null}

      <Card>
        <View className="gap-5">
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
            autoComplete="password"
            control={form.control}
            label="Password"
            name="password"
            placeholder="Enter your password"
            secureTextEntry
            textContentType="password"
          />

          <View className="pt-1">
            <Button
              loading={loginMutation.isPending}
              onPress={form.handleSubmit((values) => loginMutation.mutate(values))}
              size="lg"
            >
              Log in
            </Button>
          </View>

          {loginMutation.error ? (
            <View
              className="rounded-xl px-4 py-3"
              style={{ backgroundColor: theme.colors.dangerLight }}
            >
              <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
                {getErrorMessage(loginMutation.error)}
              </Text>
            </View>
          ) : null}

          <Link
            href={routePaths.forgotPassword}
            style={{ color: theme.colors.primary, fontWeight: '600', fontSize: 14 }}
          >
            Forgot password?
          </Link>
        </View>
      </Card>

      <View className="items-center pt-2">
        <Text className="text-base" style={{ color: theme.colors.muted }}>
          Need an account?{' '}
          <Link
            href={routePaths.register}
            style={{ color: theme.colors.primary, fontWeight: '700' }}
          >
            Register here
          </Link>
        </Text>
      </View>
    </Screen>
  );
}
