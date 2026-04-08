import * as LocalAuthentication from 'expo-local-authentication';

import { env } from '@/constants/env';

export const biometricService = {
  async authenticate(promptMessage = 'Unlock secure content') {
    return LocalAuthentication.authenticateAsync({
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
      fallbackLabel: 'Use device passcode',
      promptMessage,
    });
  },

  async isAvailable() {
    if (!env.enableBiometrics) {
      return false;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    return hasHardware && isEnrolled;
  },
};
