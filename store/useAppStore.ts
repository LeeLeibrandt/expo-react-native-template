import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { env } from '@/constants/env';
import { defaultFeatureFlags } from '@/constants/feature-flags';
import { STORAGE_KEYS } from '@/constants/storage';
import type { ThemeMode } from '@/constants/theme';
import { secureStorage } from '@/lib/secure-storage';
import type { FeatureFlags } from '@/types/api';

type AppStoreState = {
  biometricsEnabled: boolean;
  biometricsUnlocked: boolean;
  featureFlags: FeatureFlags;
  lastNotificationUrl: string | null;
  pushToken: string | null;
  themeMode: ThemeMode;
  mergeFeatureFlags: (featureFlags: Partial<FeatureFlags>) => void;
  resetEphemeralState: () => void;
  setBiometricsEnabled: (enabled: boolean) => void;
  setBiometricsUnlocked: (unlocked: boolean) => void;
  setFeatureFlags: (featureFlags: FeatureFlags) => void;
  setLastNotificationUrl: (url: string | null) => void;
  setPushToken: (pushToken: string | null) => void;
  setThemeMode: (themeMode: ThemeMode) => void;
};

const isThemeMode = (value: string): value is ThemeMode =>
  value === 'system' || value === 'light' || value === 'dark';

const initialThemeMode = isThemeMode(env.defaultTheme) ? env.defaultTheme : 'system';

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      biometricsEnabled: env.enableBiometrics,
      biometricsUnlocked: false,
      featureFlags: defaultFeatureFlags,
      lastNotificationUrl: null,
      mergeFeatureFlags: (featureFlags) =>
        set((state) => ({
          featureFlags: {
            ...state.featureFlags,
            ...featureFlags,
          },
        })),
      pushToken: null,
      resetEphemeralState: () =>
        set({
          biometricsUnlocked: false,
          lastNotificationUrl: null,
        }),
      setBiometricsEnabled: (enabled) => set({ biometricsEnabled: enabled }),
      setBiometricsUnlocked: (unlocked) => set({ biometricsUnlocked: unlocked }),
      setFeatureFlags: (featureFlags) => set({ featureFlags }),
      setLastNotificationUrl: (url) => set({ lastNotificationUrl: url }),
      setPushToken: (pushToken) => set({ pushToken }),
      setThemeMode: (themeMode) => set({ themeMode }),
      themeMode: initialThemeMode,
    }),
    {
      name: STORAGE_KEYS.app,
      partialize: (state) => ({
        biometricsEnabled: state.biometricsEnabled,
        featureFlags: state.featureFlags,
        pushToken: state.pushToken,
        themeMode: state.themeMode,
      }),
      storage: createJSONStorage(() => ({
        getItem: secureStorage.getItem,
        removeItem: secureStorage.removeItem,
        setItem: secureStorage.setItem,
      })),
    },
  ),
);
