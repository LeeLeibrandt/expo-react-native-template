import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { env } from '@/constants/env';
import { STORAGE_KEYS } from '@/constants/storage';
import { secureStorage } from '@/lib/secure-storage';
import type { Database } from '@/types/database';

const supabaseUrl = env.supabaseUrl || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
    persistSession: true,
    storage: {
      getItem: secureStorage.getItem,
      removeItem: secureStorage.removeItem,
      setItem: secureStorage.setItem,
    },
    storageKey: STORAGE_KEYS.supabaseSession,
  },
  global: {
    headers: {
      'X-Client-Info': 'expo-react-native-starter',
    },
  },
});
