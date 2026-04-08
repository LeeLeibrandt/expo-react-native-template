import { env } from '@/constants/env';
import type { FeatureFlags } from '@/types/api';

export const defaultFeatureFlags: FeatureFlags = {
  aiAssistant: true,
  biometrics: env.enableBiometrics,
  pushNotifications: true,
  subscriptions: true,
};
