export const queryKeys = {
  customerInfo: (userId?: string) => ['payments', 'customer-info', userId ?? 'guest'] as const,
  featureFlags: ['app', 'feature-flags'] as const,
  offerings: ['payments', 'offerings'] as const,
  profile: (userId?: string) => ['user', 'profile', userId ?? 'guest'] as const,
  session: ['auth', 'session'] as const,
};
