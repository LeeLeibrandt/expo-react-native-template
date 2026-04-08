import type { Database } from '@/types/database';

export type UserProfile = Database['public']['Tables']['profiles']['Row'];

export type UpsertProfileInput = Database['public']['Tables']['profiles']['Update'] & {
  id: string;
};
