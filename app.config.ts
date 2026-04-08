import type { ConfigContext, ExpoConfig } from 'expo/config';

const stringOrUndefined = (value?: string) => value?.trim() || undefined;

const booleanFromEnv = (value: string | undefined, fallback: boolean) => {
  if (!value) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const appName = process.env.EXPO_PUBLIC_APP_NAME?.trim() || 'StarterX';
  const appSlug = process.env.EXPO_PUBLIC_APP_SLUG?.trim() || 'starterx';
  const appScheme = process.env.EXPO_PUBLIC_APP_SCHEME?.trim() || 'starterx';
  const appEnv = process.env.APP_ENV?.trim() || 'development';
  const defaultTheme = process.env.EXPO_PUBLIC_DEFAULT_THEME?.trim() || 'system';

  return {
    ...config,
    name: appName,
    slug: appSlug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: appScheme,
    userInterfaceStyle: 'automatic',
    runtimeVersion: {
      policy: 'appVersion',
    },
    updates: {
      enabled: true,
      fallbackToCacheTimeout: 0,
      checkAutomatically: 'ON_LOAD',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: stringOrUndefined(process.env.IOS_BUNDLE_IDENTIFIER),
      icon: './assets/expo.icon',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      package: stringOrUndefined(process.env.ANDROID_PACKAGE),
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      predictiveBackGestureEnabled: true,
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-secure-store',
      [
        'expo-splash-screen',
        {
          backgroundColor: '#0B1220',
          image: './assets/images/splash-icon.png',
          imageWidth: 96,
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/images/android-icon-monochrome.png',
          color: '#0F6EFD',
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to unlock protected app content with Face ID.',
        },
      ],
      [
        'expo-camera',
        {
          cameraPermission:
            'Allow $(PRODUCT_NAME) to use your camera for profile photos and content capture.',
          microphonePermission:
            'Allow $(PRODUCT_NAME) to use your microphone when recording video content.',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) to access your media library so users can upload content.',
          savePhotosPermission:
            'Allow $(PRODUCT_NAME) to save generated or captured photos to your library.',
        },
      ],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Allow $(PRODUCT_NAME) to access your media library so users can choose images.',
          cameraPermission: 'Allow $(PRODUCT_NAME) to take photos inside the app.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      appEnv,
      defaultTheme,
      eas: {
        projectId: stringOrUndefined(process.env.EAS_PROJECT_ID),
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() || '',
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() || '',
      supabaseStorageBucket: process.env.EXPO_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() || 'avatars',
      apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL?.trim() || '',
      aiProxyPath: process.env.EXPO_PUBLIC_AI_PROXY_PATH?.trim() || '/api/ai/prompt',
      featureFlagsPath: process.env.EXPO_PUBLIC_FEATURE_FLAGS_PATH?.trim() || '/api/feature-flags',
      notificationRegistrationPath:
        process.env.EXPO_PUBLIC_NOTIFICATION_REGISTRATION_PATH?.trim() ||
        '/api/notifications/register',
      revenueCatApiKey: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY?.trim() || '',
      posthogKey: process.env.EXPO_PUBLIC_POSTHOG_KEY?.trim() || '',
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST?.trim() || 'https://us.i.posthog.com',
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() || '',
      enableAnalytics: booleanFromEnv(process.env.EXPO_PUBLIC_ENABLE_ANALYTICS, true),
      enableBiometrics: booleanFromEnv(process.env.EXPO_PUBLIC_ENABLE_BIOMETRICS, false),
      enableOtaUpdates: booleanFromEnv(process.env.EXPO_PUBLIC_ENABLE_OTA_UPDATES, true),
    },
  };
};
