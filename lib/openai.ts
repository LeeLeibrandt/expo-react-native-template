import { env, resolveApiUrl } from '@/constants/env';
import type { AiPromptPayload } from '@/types/ai';

export const OPENAI_SECURITY_NOTE =
  'OpenAI requests should be proxied through your backend or edge function. Do not ship secret API keys in the client.';

export const buildAiProxyPayload = (payload: AiPromptPayload) => ({
  ...payload,
  prompt: payload.prompt.trim(),
  systemPrompt: payload.systemPrompt?.trim(),
});

export const getAiProxyUrl = () => {
  if (!env.apiBaseUrl) {
    throw new Error(OPENAI_SECURITY_NOTE);
  }

  return resolveApiUrl(env.aiProxyPath);
};
