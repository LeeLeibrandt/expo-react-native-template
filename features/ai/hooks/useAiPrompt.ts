import { startTransition, useDeferredValue, useState } from 'react';

import { useMutation } from '@tanstack/react-query';

import { aiService } from '@/services/aiService';
import { useAuthStore } from '@/store/useAuthStore';
import type { AiPromptPayload } from '@/types/ai';

export const useAiPrompt = () => {
  const accessToken = useAuthStore((state) => state.session?.access_token);
  const [streamedText, setStreamedText] = useState('');

  const mutation = useMutation({
    mutationFn: async (payload: AiPromptPayload) => {
      setStreamedText('');

      return aiService.streamPrompt(payload, {
        accessToken,
        onChunk: (chunk) => {
          if (!chunk.delta) {
            return;
          }

          startTransition(() => {
            setStreamedText((currentValue) => currentValue + chunk.delta);
          });
        },
      });
    },
  });

  return {
    ...mutation,
    streamedText: useDeferredValue(streamedText),
  };
};
