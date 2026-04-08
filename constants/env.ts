import Constants from 'expo-constants';
import { z } from 'zod';

const booleanish = z.union([z.boolean(), z.string()]).transform((value) => {
  if (typeof value === 'boolean') {
    return value;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
});

const runtimeEnvSchema = z.object({
  appEnv: z.string().default('development'),
  defaultTheme: z.enum(['system', 'light', 'dark']).catch('system'),
  eas: z
    .object({
      projectId: z.string().optional(),
    })
    .default({}),
  supabaseUrl: z.string().default(''),
  supabaseAnonKey: z.string().default(''),
  supabaseStorageBucket: z.string().default('avatars'),
  apiBaseUrl: z.string().default(''),
  aiProxyPath: z.string().default('/api/ai/prompt'),
  featureFlagsPath: z.string().default('/api/feature-flags'),
  notificationRegistrationPath: z.string().default('/api/notifications/register'),
  revenueCatApiKey: z.string().default(''),
  posthogKey: z.string().default(''),
  posthogHost: z.string().default('https://us.i.posthog.com'),
  sentryDsn: z.string().default(''),
  enableAnalytics: booleanish.default(true),
  enableBiometrics: booleanish.default(false),
  enableOtaUpdates: booleanish.default(true),
});

const rawExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;

export const env = runtimeEnvSchema.parse(rawExtra);

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
export const isAiConfigured = Boolean(env.apiBaseUrl);
export const isRevenueCatConfigured = Boolean(env.revenueCatApiKey);
export const isAnalyticsConfigured = Boolean(env.enableAnalytics && env.posthogKey);

export const resolveApiUrl = (path: string) => {
  if (!env.apiBaseUrl) {
    throw new Error('EXPO_PUBLIC_API_BASE_URL is not configured.');
  }

  return new URL(path, env.apiBaseUrl).toString();
};
