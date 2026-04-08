import { Text, View } from 'react-native';

import { Button, Card } from '@/components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';

type AppLockOverlayProps = {
  onUnlock: () => void;
  visible: boolean;
};

export const AppLockOverlay = ({ onUnlock, visible }: AppLockOverlayProps) => {
  const { theme } = useAppTheme();

  if (!visible) {
    return null;
  }

  return (
    <View
      className="absolute inset-0 z-50 items-center justify-center px-6"
      style={{ backgroundColor: theme.colors.overlay }}
    >
      <Card className="w-full max-w-md gap-5">
        <View className="gap-2">
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            Session locked
          </Text>
          <Text className="text-base leading-6" style={{ color: theme.colors.muted }}>
            Biometric protection is enabled. Authenticate to continue.
          </Text>
        </View>
        <Button onPress={onUnlock}>Unlock</Button>
      </Card>
    </View>
  );
};
