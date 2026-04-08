import { z } from 'zod';

export const aiPromptSchema = z.object({
  prompt: z.string().trim().min(4, 'Enter a more specific prompt.'),
});

export type AiPromptFormValues = z.infer<typeof aiPromptSchema>;
