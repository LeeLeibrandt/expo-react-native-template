import { useCallback, useEffect, useRef } from 'react';

import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import type { NotificationResponse } from 'expo-notifications';

import { analyticsService } from '@/services/analyticsService';
import { loggerService } from '@/services/loggerService';
import { notificationService } from '@/services/notificationService';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export const usePushNotifications = () => {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.session?.access_token);
  const pushNotificationsEnabled = useAppStore((state) => state.featureFlags.pushNotifications);
  const setLastNotificationUrl = useAppStore((state) => state.setLastNotificationUrl);
  const setPushToken = useAppStore((state) => state.setPushToken);

  const routerRef = useRef(router);
  const setLastNotificationUrlRef = useRef(setLastNotificationUrl);
  useEffect(() => {
    routerRef.current = router;
    setLastNotificationUrlRef.current = setLastNotificationUrl;
  });

  const handleResponse = useCallback(async (response: NotificationResponse) => {
    const deepLink = notificationService.extractDeepLink(
      response.notification.request.content.data,
    );

    if (!deepLink) {
      return;
    }

    setLastNotificationUrlRef.current(deepLink);
    analyticsService.trackEvent('notification_opened', { deepLink });
    routerRef.current.push(deepLink as Href);
  }, []);

  useEffect(() => {
    if (!pushNotificationsEnabled) {
      return;
    }

    let isMounted = true;

    const bootstrapNotifications = async () => {
      try {
        await notificationService.registerBackgroundTask();

        const lastResponse = await notificationService.getLastNotificationResponse();

        if (lastResponse) {
          await handleResponse(lastResponse);
        }

        if (!accessToken) {
          return;
        }

        const token = await notificationService.registerForPushNotificationsAsync();

        if (!isMounted || !token) {
          return;
        }

        setPushToken(token);
        await notificationService.syncPushToken(token, accessToken);
      } catch (error) {
        loggerService.captureError(error, { service: 'notifications.bootstrap' });
      }
    };

    void bootstrapNotifications();

    const removeListeners = notificationService.addListeners({
      onResponse: (response) => {
        void handleResponse(response);
      },
    });

    return () => {
      isMounted = false;
      removeListeners();
    };
  }, [accessToken, handleResponse, pushNotificationsEnabled, setPushToken]);
};
