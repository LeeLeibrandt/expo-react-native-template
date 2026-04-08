import { useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Button, Card } from '@/components/ui';
import { routePaths } from '@/constants/routes';
import { useAppTheme } from '@/hooks/useAppTheme';
import { AiAssistantCard } from '@/features/ai/components/AiAssistantCard';
import { SubscriptionCard } from '@/features/payments/components/SubscriptionCard';
import { useUserProfileQuery } from '@/features/user/hooks/useUserProfile';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useAppTheme();
  const currentUser = useAuthStore((state) => state.user);
  const featureFlags = useAppStore((state) => state.featureFlags);
  const profileQuery = useUserProfileQuery();

  const displayName =
    profileQuery.data?.full_name ||
    currentUser?.user_metadata?.full_name ||
    currentUser?.email?.split('@')[0] ||
    'builder';

  return (
    <Screen rightAction={<ThemeToggle />} title={`Hi, ${displayName}`}>
      <Card>
        <View className="gap-4">
          <Text
            className="text-lg font-bold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            Your app is ready
          </Text>
          <Text className="text-base leading-6" style={{ color: theme.colors.muted }}>
            Expo Router, Supabase auth, NativeWind, React Query, and Zustand are wired and ready to
            build on.
          </Text>
          <Button onPress={() => router.push(routePaths.profile)} variant="secondary">
            Open profile
          </Button>
        </View>
      </Card>

      {(featureFlags.aiAssistant || featureFlags.subscriptions) && (
        <>
          <SectionHeader
            subtitle="Example modules included in the starter"
            title="Feature examples"
          />

          {featureFlags.aiAssistant ? <AiAssistantCard /> : null}
          {featureFlags.subscriptions ? <SubscriptionCard /> : null}
        </>
      )}
    </Screen>
  );
}
