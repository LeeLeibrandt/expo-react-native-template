import Purchases, { LOG_LEVEL } from 'react-native-purchases';

import { env, isRevenueCatConfigured } from '@/constants/env';

let isConfigured = false;
let configuredUserId: string | null = null;

export const configureRevenueCat = async (appUserId?: string | null) => {
  if (!isRevenueCatConfigured) {
    return false;
  }

  Purchases.setLogLevel(__DEV__ ? LOG_LEVEL.DEBUG : LOG_LEVEL.WARN);

  if (!isConfigured) {
    Purchases.configure({
      apiKey: env.revenueCatApiKey,
      appUserID: appUserId ?? undefined,
    });

    isConfigured = true;
    configuredUserId = appUserId ?? null;
    return true;
  }

  if (appUserId && configuredUserId !== appUserId) {
    await Purchases.logIn(appUserId);
    configuredUserId = appUserId;
  }

  if (!appUserId && configuredUserId) {
    await Purchases.logOut();
    configuredUserId = null;
  }

  return true;
};
