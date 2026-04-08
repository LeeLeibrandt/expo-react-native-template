import { z } from 'zod';

import { env, resolveApiUrl } from '@/constants/env';
import { defaultFeatureFlags } from '@/constants/feature-flags';
import type { ApiError, FeatureFlags } from '@/types/api';

const featureFlagsSchema = z.object({
  flags: z
    .object({
      aiAssistant: z.boolean().optional(),
      biometrics: z.boolean().optional(),
      pushNotifications: z.boolean().optional(),
      subscriptions: z.boolean().optional(),
    })
    .partial()
    .optional(),
});

const createApiError = async (response: Response, fallbackMessage: string) => {
  const error = new Error((await response.text()) || fallbackMessage) as ApiError;
  error.status = response.status;
  return error;
};

export const appService = {
  async getFeatureFlags(accessToken?: string): Promise<FeatureFlags> {
    if (!env.apiBaseUrl) {
      return defaultFeatureFlags;
    }

    const response = await fetch(resolveApiUrl(env.featureFlagsPath), {
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      throw await createApiError(response, 'Unable to load feature flags.');
    }

    const parsed = featureFlagsSchema.parse(await response.json());

    return {
      ...defaultFeatureFlags,
      ...parsed.flags,
    };
  },
};
