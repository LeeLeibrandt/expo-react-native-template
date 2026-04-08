import '../global.css';

import { useEffect } from 'react';

import * as SplashScreen from 'expo-splash-screen';
import { Stack, useRouter, useSegments, type ErrorBoundaryProps } from 'expo-router';

import { AppErrorFallback } from '@/components/shared/AppErrorFallback';
import { AppProviders } from '@/components/shared/AppProviders';
import { routePaths } from '@/constants/routes';
import { loggerService } from '@/services/loggerService';
import { useAuthStore } from '@/store/useAuthStore';

SplashScreen.preventAutoHideAsync().catch(() => undefined);

const RootNavigator = () => {
  const router = useRouter();
  const segments = useSegments();
  const authFlow = useAuthStore((state) => state.authFlow);
  const authStatus = useAuthStore((state) => state.status);

  useEffect(() => {
    if (authStatus === 'booting') {
      return;
    }

    void SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    const onForgotPasswordScreen = segments[segments.length - 1] === 'forgot-password';
    const allowRecoveryRoute = authFlow === 'password-recovery' && onForgotPasswordScreen;

    if (authStatus === 'guest' && !inAuthGroup) {
      router.replace(routePaths.login);
    }

    if (authStatus === 'authenticated' && inAuthGroup && !allowRecoveryRoute) {
      router.replace(routePaths.home);
    }
  }, [authFlow, authStatus, router, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
};

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  loggerService.captureError(error, { route: 'root-layout' });

  return (
    <AppProviders>
      <AppErrorFallback error={error} retry={retry} />
    </AppProviders>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  );
}
