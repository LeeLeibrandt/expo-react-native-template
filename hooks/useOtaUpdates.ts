import { useCallback, useEffect } from 'react';

import * as Updates from 'expo-updates';
import { AppState } from 'react-native';

import { env } from '@/constants/env';
import { loggerService } from '@/services/loggerService';

export const useOtaUpdates = () => {
  const checkForUpdates = useCallback(async () => {
    if (__DEV__ || !env.enableOtaUpdates) {
      return;
    }

    try {
      const update = await Updates.checkForUpdateAsync();

      if (!update.isAvailable) {
        return;
      }

      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      loggerService.captureError(error, { service: 'ota.check' });
    }
  }, []);

  useEffect(() => {
    void checkForUpdates();

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        void checkForUpdates();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [checkForUpdates]);
};
