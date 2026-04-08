import * as Linking from 'expo-linking';

import { isSupabaseConfigured } from '@/constants/env';
import { deepLinkPaths } from '@/constants/routes';
import { supabase } from '@/lib/supabase';
import { sanitizeText } from '@/lib/utils';
import type { AuthRedirectResult, AuthRedirectType } from '@/types/auth';

const assertSupabaseConfigured = () => {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.',
    );
  }
};

const normalizeEmail = (value: string) => sanitizeText(value).toLowerCase();

const getStringValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const getRedirectUrl = (path: string) => Linking.createURL(path);

const getRedirectType = (value?: string): AuthRedirectType => {
  if (value === 'invite' || value === 'magiclink' || value === 'recovery' || value === 'signup') {
    return value;
  }

  return 'unknown';
};

export const authService = {
  buildEmailVerificationRedirect: () => getRedirectUrl(`${deepLinkPaths.login}?verified=true`),
  buildPasswordResetRedirect: () => getRedirectUrl(`${deepLinkPaths.forgotPassword}?mode=recovery`),

  async getSession() {
    assertSupabaseConfigured();
    return supabase.auth.getSession();
  },

  async handleAuthRedirect(url: string): Promise<AuthRedirectResult | null> {
    assertSupabaseConfigured();
    const normalizedUrl = url.includes('#') ? url.replace('#', '?') : url;
    const parsed = Linking.parse(normalizedUrl);
    const queryParams = parsed.queryParams ?? {};

    const accessToken = getStringValue(queryParams.access_token as string | string[] | undefined);
    const refreshToken = getStringValue(queryParams.refresh_token as string | string[] | undefined);
    const authorizationCode = getStringValue(queryParams.code as string | string[] | undefined);
    const redirectType = getRedirectType(
      getStringValue(queryParams.type as string | string[] | undefined),
    );

    if (accessToken && refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        throw error;
      }

      return {
        session: data.session,
        type: redirectType,
      };
    }

    if (authorizationCode) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(authorizationCode);

      if (error) {
        throw error;
      }

      return {
        session: data.session,
        type: redirectType,
      };
    }

    return null;
  },

  async requestPasswordReset(email: string) {
    assertSupabaseConfigured();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: authService.buildPasswordResetRedirect(),
    });

    if (error) {
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signOut() {
    assertSupabaseConfigured();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  },

  async signUp(params: { email: string; fullName: string; password: string }) {
    assertSupabaseConfigured();
    const { email, fullName, password } = params;

    const { data, error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      options: {
        data: {
          full_name: sanitizeText(fullName),
        },
        emailRedirectTo: authService.buildEmailVerificationRedirect(),
      },
      password,
    });

    if (error) {
      throw error;
    }

    return {
      ...data,
      requiresEmailVerification: !data.session,
    };
  },

  async updatePassword(password: string) {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  },
};
