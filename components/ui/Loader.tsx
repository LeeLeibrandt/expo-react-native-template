import { ActivityIndicator, Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type LoaderProps = {
  fullscreen?: boolean;
  label?: string;
};

export const Loader = ({ fullscreen = false, label = 'Loading...' }: LoaderProps) => {
  const { theme } = useAppTheme();

  return (
    <View
      className={
        fullscreen
          ? 'flex-1 items-center justify-center gap-3'
          : 'items-center gap-3 py-4'
      }
      style={fullscreen ? { backgroundColor: theme.colors.background } : undefined}
    >
      <ActivityIndicator color={theme.colors.primary} size="small" />
      <Text className="text-sm" style={{ color: theme.colors.muted }}>
        {label}
      </Text>
    </View>
  );
};
