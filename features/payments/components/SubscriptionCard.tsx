import { Text, View } from 'react-native';

import { Button, Card, Loader } from '@/components/ui';
import { isRevenueCatConfigured } from '@/constants/env';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import {
  useOfferingsQuery,
  usePurchasePackageMutation,
  useRestorePurchasesMutation,
  useSubscriptionStatus,
} from '@/features/payments/hooks/useSubscription';

export const SubscriptionCard = () => {
  const { theme } = useAppTheme();
  const offeringsQuery = useOfferingsQuery();
  const subscriptionStatusQuery = useSubscriptionStatus();
  const purchaseMutation = usePurchasePackageMutation();
  const restoreMutation = useRestorePurchasesMutation();

  if (!isRevenueCatConfigured) {
    return (
      <Card title="Subscriptions">
        <View
          className="rounded-xl px-4 py-3"
          style={{ backgroundColor: theme.colors.primaryLight }}
        >
          <Text className="text-[13px] leading-[18px]" style={{ color: theme.colors.primary }}>
            Set EXPO_PUBLIC_REVENUECAT_API_KEY to enable offerings, purchases, and restore flows.
          </Text>
        </View>
      </Card>
    );
  }

  const activeSubscription = subscriptionStatusQuery.data;
  const availablePackages = offeringsQuery.data?.current?.availablePackages ?? [];

  return (
    <Card title="Subscriptions">
      <View className="gap-4">
        {subscriptionStatusQuery.isLoading || offeringsQuery.isLoading ? (
          <Loader label="Syncing RevenueCat..." />
        ) : (
          <View
            className="rounded-2xl p-4"
            style={{
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
            }}
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: theme.colors.foreground }}
            >
              {activeSubscription?.isActive
                ? `Active: ${
                    activeSubscription.activeEntitlements[0] ??
                    activeSubscription.activeProducts[0] ??
                    'Subscription enabled'
                  }`
                : 'No active subscription'}
            </Text>
            <Text
              className="mt-1.5 text-[13px] leading-[18px]"
              style={{ color: theme.colors.muted }}
            >
              {availablePackages.length
                ? 'Available packages loaded from RevenueCat.'
                : 'No packages returned from the current offering.'}
            </Text>
          </View>
        )}

        {availablePackages.map((selectedPackage) => (
          <Button
            key={selectedPackage.identifier}
            loading={
              purchaseMutation.isPending &&
              purchaseMutation.variables?.identifier === selectedPackage.identifier
            }
            onPress={() => purchaseMutation.mutate(selectedPackage)}
            variant="secondary"
          >
            {`${selectedPackage.product.title} · ${selectedPackage.product.priceString}`}
          </Button>
        ))}

        <Button
          loading={restoreMutation.isPending}
          onPress={() => restoreMutation.mutate()}
          variant="ghost"
        >
          Restore purchases
        </Button>

        {purchaseMutation.error ? (
          <View
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: theme.colors.dangerLight }}
          >
            <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
              {getErrorMessage(purchaseMutation.error)}
            </Text>
          </View>
        ) : null}

        {restoreMutation.error ? (
          <View
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: theme.colors.dangerLight }}
          >
            <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
              {getErrorMessage(restoreMutation.error)}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
};
