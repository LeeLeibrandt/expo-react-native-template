import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { create } from 'zustand';

import type { AuthFlow, AuthStatus } from '@/types/auth';

type AuthStoreState = {
  authFlow: AuthFlow;
  lastEvent: AuthChangeEvent | 'BOOTSTRAP' | null;
  session: Session | null;
  status: AuthStatus;
  user: User | null;
  clear: () => void;
  initialize: (session: Session | null) => void;
  setAuthFlow: (authFlow: AuthFlow) => void;
  setSession: (event: AuthChangeEvent, session: Session | null) => void;
};

const getAuthStatus = (session: Session | null): AuthStatus =>
  session ? 'authenticated' : 'guest';

export const useAuthStore = create<AuthStoreState>((set) => ({
  authFlow: 'idle',
  lastEvent: null,
  session: null,
  status: 'booting',
  user: null,
  clear: () =>
    set({
      authFlow: 'idle',
      lastEvent: 'SIGNED_OUT',
      session: null,
      status: 'guest',
      user: null,
    }),
  initialize: (session) =>
    set({
      lastEvent: 'BOOTSTRAP',
      session,
      status: getAuthStatus(session),
      user: session?.user ?? null,
    }),
  setAuthFlow: (authFlow) => set({ authFlow }),
  setSession: (event, session) =>
    set({
      lastEvent: event,
      session,
      status: getAuthStatus(session),
      user: session?.user ?? null,
    }),
}));
