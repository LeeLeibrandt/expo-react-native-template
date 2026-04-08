import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name.'),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
