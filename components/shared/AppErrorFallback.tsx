import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppErrorFallbackProps = {
  error: Error;
  retry: () => void;
};

export const AppErrorFallback = ({ error, retry }: AppErrorFallbackProps) => {
  const { theme } = useAppTheme();

  return (
    <View
      className="flex-1 items-center justify-center px-6"
      style={{ backgroundColor: theme.colors.background }}
    >
      <Card className="w-full max-w-lg gap-5">
        <View className="gap-2">
          <Text
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            Something broke
          </Text>
          <Text className="text-base leading-6" style={{ color: theme.colors.muted }}>
            {error.message || 'An unexpected error occurred.'}
          </Text>
        </View>
        <Button onPress={retry}>Try again</Button>
      </Card>
    </View>
  );
};
