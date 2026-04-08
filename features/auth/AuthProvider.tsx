import { useCallback, useEffect, useRef, type ReactNode } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';

import { isSupabaseConfigured } from '@/constants/env';
import { supabase } from '@/lib/supabase';
import { analyticsService } from '@/services/analyticsService';
import { authService } from '@/services/authService';
import { loggerService } from '@/services/loggerService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const initialize = useAuthStore((state) => state.initialize);
  const setAuthFlow = useAuthStore((state) => state.setAuthFlow);
  const setSession = useAuthStore((state) => state.setSession);
  const queryClient = useQueryClient();

  const setSessionRef = useRef(setSession);
  const setAuthFlowRef = useRef(setAuthFlow);
  const queryClientRef = useRef(queryClient);
  useEffect(() => {
    setSessionRef.current = setSession;
    setAuthFlowRef.current = setAuthFlow;
    queryClientRef.current = queryClient;
  });

  const syncSession = useCallback(
    async (
      event: Parameters<typeof supabase.auth.onAuthStateChange>[0] extends (
        ...args: infer T
      ) => void
        ? T[0]
        : never,
      session: Parameters<typeof supabase.auth.onAuthStateChange>[0] extends (
        ...args: infer T
      ) => void
        ? T[1]
        : never,
    ) => {
      setSessionRef.current(event, session);

      if (!session) {
        analyticsService.reset();
        useAppStore.getState().resetEphemeralState();
        queryClientRef.current.clear();
        return;
      }

      analyticsService.identifyUser(session.user.id, {
        email: session.user.email ?? '',
      });

      try {
        await userService.bootstrapProfile(session.user);
      } catch (error) {
        loggerService.captureError(error, { service: 'auth.bootstrap-profile' });
      }
    },
    [],
  );

  const handleAuthUrl = useCallback(async (url: string) => {
    try {
      const result = await authService.handleAuthRedirect(url);

      if (!result) {
        return;
      }

      if (result.type === 'recovery') {
        setAuthFlowRef.current('password-recovery');
      } else if (result.type === 'signup') {
        setAuthFlowRef.current('email-verification');
      }
    } catch (error) {
      loggerService.captureError(error, { service: 'auth.handle-url' });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      try {
        if (!isSupabaseConfigured) {
          initialize(null);
          return;
        }

        const initialUrl = await Linking.getInitialURL();

        if (initialUrl) {
          await handleAuthUrl(initialUrl);
        }

        const { data } = await authService.getSession();

        if (isMounted) {
          initialize(data.session);
        }

        if (data.session?.user) {
          analyticsService.identifyUser(data.session.user.id, {
            email: data.session.user.email ?? '',
          });

          try {
            await userService.bootstrapProfile(data.session.user);
          } catch (error) {
            loggerService.captureError(error, { service: 'auth.bootstrap-profile-initial' });
          }
        }
      } catch (error) {
        loggerService.captureError(error, { service: 'auth.bootstrap' });

        if (isMounted) {
          initialize(null);
        }
      }
    };

    void bootstrapAuth();

    const {
      data: { subscription: authSubscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      void syncSession(event, session);
    });

    const urlSubscription = Linking.addEventListener('url', ({ url }) => {
      void handleAuthUrl(url);
    });

    return () => {
      isMounted = false;
      authSubscription.unsubscribe();
      urlSubscription.remove();
    };
  }, [handleAuthUrl, initialize, syncSession]);

  return children;
};
