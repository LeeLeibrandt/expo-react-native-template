import { useCallback, useEffect, useRef } from 'react';

import { AppState } from 'react-native';

import { biometricService } from '@/services/biometricService';
import { loggerService } from '@/services/loggerService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export const useBiometricUnlock = () => {
  const isAuthenticated = useAuthStore((state) => state.status === 'authenticated');
  const biometricsEnabled = useAppStore((state) => state.biometricsEnabled);
  const biometricsUnlocked = useAppStore((state) => state.biometricsUnlocked);
  const setBiometricsUnlocked = useAppStore((state) => state.setBiometricsUnlocked);

  const isPromptingRef = useRef(false);
  const previousAppStateRef = useRef(AppState.currentState);

  const promptBiometricUnlock = useCallback(async (promptMessage = 'Unlock your session') => {
    const currentlyAuthenticated = useAuthStore.getState().status === 'authenticated';
    const currentlyEnabled = useAppStore.getState().biometricsEnabled;

    if (!currentlyAuthenticated || !currentlyEnabled) {
      return true;
    }

    if (isPromptingRef.current) {
      return false;
    }

    const canAuthenticate = await biometricService.isAvailable();

    if (!canAuthenticate) {
      useAppStore.getState().setBiometricsUnlocked(true);
      return true;
    }

    isPromptingRef.current = true;

    try {
      const result = await biometricService.authenticate(promptMessage);
      useAppStore.getState().setBiometricsUnlocked(result.success);
      return result.success;
    } catch (error) {
      loggerService.captureError(error, { service: 'biometrics.authenticate' });
      useAppStore.getState().setBiometricsUnlocked(false);
      return false;
    } finally {
      isPromptingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !biometricsEnabled) {
      return;
    }

    void promptBiometricUnlock();

    const appStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      const prev = previousAppStateRef.current;
      previousAppStateRef.current = nextAppState;

      // Don't reset or re-prompt while the biometric dialog is showing.
      // The native dialog causes inactive→active transitions that would loop.
      if (isPromptingRef.current) {
        return;
      }

      // Only lock when genuinely going to background (not just inactive from a dialog)
      if (prev === 'active' && nextAppState === 'background') {
        useAppStore.getState().setBiometricsUnlocked(false);
      }

      // Only re-prompt when returning from a real background state
      if (prev === 'background' && nextAppState === 'active') {
        void promptBiometricUnlock();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [biometricsEnabled, isAuthenticated, promptBiometricUnlock]);

  return {
    biometricsEnabled,
    biometricsUnlocked,
    promptBiometricUnlock,
  };
};
