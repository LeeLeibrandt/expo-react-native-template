import { Pressable, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { useAppStore } from '@/store/useAppStore';
import type { ThemeMode } from '@/constants/theme';

const themeOptions: ThemeMode[] = ['system', 'light', 'dark'];

export const ThemeToggle = () => {
  const { theme, themeMode } = useAppTheme();
  const setThemeMode = useAppStore((state) => state.setThemeMode);

  return (
    <View
      className="flex-row rounded-full p-1"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        borderWidth: 1,
      }}
    >
      {themeOptions.map((option) => {
        const active = option === themeMode;

        return (
          <Pressable
            className="rounded-full px-3 py-1.5"
            key={option}
            onPress={() => setThemeMode(option)}
            style={{
              backgroundColor: active ? theme.colors.primary : 'transparent',
            }}
          >
            <Text
              className="text-xs font-semibold capitalize"
              style={{
                color: active ? theme.colors.primaryForeground : theme.colors.muted,
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
