export type SubscriptionSnapshot = {
  activeEntitlements: string[];
  activeProducts: string[];
  expirationDate?: string | null;
  isActive: boolean;
};
