import { useEffect, type ReactNode } from 'react';

import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useColorScheme } from 'nativewind';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppLockOverlay } from '@/components/shared/AppLockOverlay';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { useAppTheme } from '@/hooks/useAppTheme';
import { useBiometricUnlock } from '@/hooks/useBiometricUnlock';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { useOtaUpdates } from '@/hooks/useOtaUpdates';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { queryClient } from '@/lib/query-client';
import { analyticsService } from '@/services/analyticsService';
import { useAuthStore } from '@/store/useAuthStore';

type AppProvidersProps = {
  children: ReactNode;
};

const AppBootstrap = ({ children }: AppProvidersProps) => {
  const { resolvedTheme, theme } = useAppTheme();
  const { setColorScheme } = useColorScheme();
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const { biometricsEnabled, biometricsUnlocked, promptBiometricUnlock } = useBiometricUnlock();

  useFeatureFlags();
  useOtaUpdates();
  usePushNotifications();

  useEffect(() => {
    setColorScheme(resolvedTheme);
  }, [resolvedTheme, setColorScheme]);

  useEffect(() => {
    analyticsService.init();
    void SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme.colors.background]);

  const navigationTheme = {
    ...(resolvedTheme === 'dark' ? DarkTheme : DefaultTheme),
    colors: {
      ...(resolvedTheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
      background: theme.colors.background,
      border: theme.colors.border,
      card: theme.colors.card,
      notification: theme.colors.primary,
      primary: theme.colors.primary,
      text: theme.colors.foreground,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      {children}
      <AppLockOverlay
        onUnlock={() => {
          void promptBiometricUnlock();
        }}
        visible={isAuthenticated && biometricsEnabled && !biometricsUnlocked}
      />
    </ThemeProvider>
  );
};

export const AppProviders = ({ children }: AppProvidersProps) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppBootstrap>{children}</AppBootstrap>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  </GestureHandlerRootView>
);
