import type { Session } from '@supabase/supabase-js';

export type AuthStatus = 'authenticated' | 'booting' | 'guest';
export type AuthFlow = 'email-verification' | 'idle' | 'password-recovery';

export type AuthRedirectType = 'invite' | 'magiclink' | 'recovery' | 'signup' | 'unknown';

export type AuthRedirectResult = {
  session: Session | null;
  type: AuthRedirectType;
};
