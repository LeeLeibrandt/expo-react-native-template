import Purchases, { type PurchasesPackage } from 'react-native-purchases';

import { isRevenueCatConfigured } from '@/constants/env';
import { configureRevenueCat } from '@/lib/revenuecat';
import type { SubscriptionSnapshot } from '@/types/payments';

const emptySnapshot: SubscriptionSnapshot = {
  activeEntitlements: [],
  activeProducts: [],
  expirationDate: null,
  isActive: false,
};

const toSubscriptionSnapshot = (
  customerInfo: Awaited<ReturnType<typeof Purchases.getCustomerInfo>>,
): SubscriptionSnapshot => {
  const activeEntitlements = Object.keys(customerInfo.entitlements.active);
  const activeProducts = customerInfo.activeSubscriptions;

  return {
    activeEntitlements,
    activeProducts,
    expirationDate: customerInfo.latestExpirationDate ?? null,
    isActive: activeEntitlements.length > 0 || activeProducts.length > 0,
  };
};

export const paymentService = {
  async configure(userId?: string | null) {
    return configureRevenueCat(userId);
  },

  async getCustomerInfo(userId?: string | null) {
    if (!isRevenueCatConfigured) {
      return emptySnapshot;
    }

    await paymentService.configure(userId);
    const customerInfo = await Purchases.getCustomerInfo();
    return toSubscriptionSnapshot(customerInfo);
  },

  async getOfferings(userId?: string | null) {
    if (!isRevenueCatConfigured) {
      return null;
    }

    await paymentService.configure(userId);
    return Purchases.getOfferings();
  },

  async purchasePackage(selectedPackage: PurchasesPackage, userId?: string | null) {
    await paymentService.configure(userId);
    const { customerInfo } = await Purchases.purchasePackage(selectedPackage);
    return toSubscriptionSnapshot(customerInfo);
  },

  async restorePurchases(userId?: string | null) {
    await paymentService.configure(userId);
    const customerInfo = await Purchases.restorePurchases();
    return toSubscriptionSnapshot(customerInfo);
  },
};
