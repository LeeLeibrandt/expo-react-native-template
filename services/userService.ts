import type { User } from '@supabase/supabase-js';

import { env, isSupabaseConfigured } from '@/constants/env';
import { supabase } from '@/lib/supabase';
import { sanitizeText, toArrayBufferFromUri } from '@/lib/utils';
import type { UpsertProfileInput, UserProfile } from '@/types/user';

const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
};

const getImageContentType = (fileUri: string) => {
  if (fileUri.toLowerCase().endsWith('.png')) {
    return 'image/png';
  }

  if (fileUri.toLowerCase().endsWith('.webp')) {
    return 'image/webp';
  }

  return 'image/jpeg';
};

export const userService = {
  async bootstrapProfile(user: User) {
    assertSupabaseConfigured();
    return userService.upsertProfile({
      email: user.email ?? null,
      full_name: sanitizeText(
        String(user.user_metadata?.full_name ?? user.user_metadata?.name ?? ''),
      ),
      id: user.id,
      updated_at: new Date().toISOString(),
    });
  },

  async getProfile(userId: string): Promise<UserProfile | null> {
    assertSupabaseConfigured();
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  },

  async upsertProfile(profile: UpsertProfileInput): Promise<UserProfile> {
    assertSupabaseConfigured();
    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        {
          ...profile,
          updated_at: profile.updated_at ?? new Date().toISOString(),
        },
        {
          onConflict: 'id',
        },
      )
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data;
  },

  async uploadAvatar(userId: string, fileUri: string) {
    assertSupabaseConfigured();
    const extension = fileUri.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `${userId}/${Date.now()}.${extension}`;
    const fileBuffer = await toArrayBufferFromUri(fileUri);
    const contentType = getImageContentType(fileUri);

    const { error: uploadError } = await supabase.storage
      .from(env.supabaseStorageBucket)
      .upload(filePath, fileBuffer, {
        cacheControl: '3600',
        contentType,
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(env.supabaseStorageBucket).getPublicUrl(filePath);

    await userService.upsertProfile({
      avatar_url: publicUrl,
      id: userId,
    });

    return publicUrl;
  },
};
