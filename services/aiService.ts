import { z } from 'zod';

import { getAiProxyUrl, OPENAI_SECURITY_NOTE, buildAiProxyPayload } from '@/lib/openai';
import type { AiPromptPayload, AiPromptResponse, AiStreamChunk } from '@/types/ai';
import type { ApiError } from '@/types/api';

const aiResponseSchema = z.object({
  id: z.string(),
  model: z.string().default('proxy'),
  text: z.string(),
  usage: z
    .object({
      completionTokens: z.number().optional(),
      promptTokens: z.number().optional(),
      totalTokens: z.number().optional(),
    })
    .partial()
    .optional(),
});

const aiStreamChunkSchema = z.object({
  delta: z.string().default(''),
  done: z.boolean().optional(),
  model: z.string().optional(),
});

const createApiError = async (response: Response, fallbackMessage: string) => {
  const error = new Error((await response.text()) || fallbackMessage) as ApiError;
  error.status = response.status;
  return error;
};

const parseLine = (line: string): AiStreamChunk | null => {
  const normalizedLine = line.startsWith('data:') ? line.slice(5).trim() : line.trim();

  if (!normalizedLine) {
    return null;
  }

  if (normalizedLine === '[DONE]') {
    return {
      delta: '',
      done: true,
    };
  }

  try {
    return aiStreamChunkSchema.parse(JSON.parse(normalizedLine));
  } catch {
    return {
      delta: normalizedLine,
    };
  }
};

export const aiService = {
  async sendPrompt(payload: AiPromptPayload, accessToken?: string): Promise<AiPromptResponse> {
    const response = await fetch(getAiProxyUrl(), {
      body: JSON.stringify(buildAiProxyPayload(payload)),
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw await createApiError(response, OPENAI_SECURITY_NOTE);
    }

    return aiResponseSchema.parse(await response.json());
  },

  async streamPrompt(
    payload: AiPromptPayload,
    options: {
      accessToken?: string;
      onChunk?: (chunk: AiStreamChunk) => void;
    } = {},
  ): Promise<AiPromptResponse> {
    const response = await fetch(getAiProxyUrl(), {
      body: JSON.stringify({
        ...buildAiProxyPayload(payload),
        stream: true,
      }),
      headers: {
        ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw await createApiError(response, OPENAI_SECURITY_NOTE);
    }

    if (!response.body || !('getReader' in response.body)) {
      const fallback = await aiService.sendPrompt(payload, options.accessToken);
      options.onChunk?.({
        delta: fallback.text,
        done: true,
        model: fallback.model,
      });
      return fallback;
    }

    const decoder = new TextDecoder();
    const reader = response.body.getReader();
    let bufferedText = '';
    let completeText = '';
    let model = 'proxy-stream';

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      bufferedText += decoder.decode(value, { stream: true });
      const lines = bufferedText.split('\n');
      bufferedText = lines.pop() ?? '';

      for (const line of lines) {
        const chunk = parseLine(line);

        if (!chunk) {
          continue;
        }

        if (chunk.model) {
          model = chunk.model;
        }

        completeText += chunk.delta;
        options.onChunk?.(chunk);
      }
    }

    if (bufferedText.trim()) {
      const finalChunk = parseLine(bufferedText.trim());

      if (finalChunk) {
        if (finalChunk.model) {
          model = finalChunk.model;
        }

        completeText += finalChunk.delta;
        options.onChunk?.(finalChunk);
      }
    }

    return {
      id: `stream-${Date.now()}`,
      model,
      text: completeText,
    };
  },
};
