export type AiPromptPayload = {
  conversationId?: string;
  metadata?: Record<string, string | number | boolean | null>;
  prompt: string;
  systemPrompt?: string;
};

export type AiPromptResponse = {
  id: string;
  model: string;
  text: string;
  usage?: {
    completionTokens?: number;
    promptTokens?: number;
    totalTokens?: number;
  };
};

export type AiStreamChunk = {
  delta: string;
  done?: boolean;
  model?: string;
};
