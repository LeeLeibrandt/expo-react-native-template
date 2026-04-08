import { useColorScheme } from 'react-native';

import { darkTheme, lightTheme, type AppTheme, type ResolvedThemeMode } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export const useAppTheme = (): {
  resolvedTheme: ResolvedThemeMode;
  theme: AppTheme;
  themeMode: 'dark' | 'light' | 'system';
} => {
  const themeMode = useAppStore((state) => state.themeMode);
  const systemScheme = useColorScheme();
  const resolvedTheme =
    themeMode === 'system' ? ((systemScheme ?? 'light') as ResolvedThemeMode) : themeMode;

  return {
    resolvedTheme,
    theme: resolvedTheme === 'dark' ? darkTheme : lightTheme,
    themeMode,
  };
};
