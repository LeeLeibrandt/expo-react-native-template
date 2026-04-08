import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

import { env, resolveApiUrl } from '@/constants/env';
import { loggerService } from '@/services/loggerService';
import type { ApiError } from '@/types/api';

const BACKGROUND_NOTIFICATION_TASK = 'starter-background-notification-task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

if (!TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK)) {
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }) => {
    if (error) {
      loggerService.captureError(error, { service: 'notifications.background-task' });
      return;
    }

    loggerService.info('Background notification task executed.', {
      data: (data ?? {}) as Record<string, unknown>,
    });
  });
}

const createApiError = async (response: Response, fallbackMessage: string) => {
  const error = new Error((await response.text()) || fallbackMessage) as ApiError;
  error.status = response.status;
  return error;
};

const getProjectId = () =>
  env.eas.projectId ??
  Constants.expoConfig?.extra?.eas?.projectId ??
  Constants.easConfig?.projectId;

export const notificationService = {
  addListeners(params: {
    onNotification?: (notification: Notifications.Notification) => void;
    onResponse?: (response: Notifications.NotificationResponse) => void;
  }) {
    const notificationSubscription = Notifications.addNotificationReceivedListener((notification) =>
      params.onNotification?.(notification),
    );
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) =>
      params.onResponse?.(response),
    );

    return () => {
      notificationSubscription.remove();
      responseSubscription.remove();
    };
  },

  extractDeepLink(data?: Record<string, unknown>) {
    if (typeof data?.url === 'string') {
      return data.url;
    }

    if (typeof data?.route === 'string') {
      return data.route;
    }

    return null;
  },

  getLastNotificationResponse() {
    return Notifications.getLastNotificationResponseAsync();
  },

  async registerBackgroundTask() {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    } catch (error) {
      loggerService.captureError(error, { service: 'notifications.register-task' });
    }
  },

  async registerForPushNotificationsAsync() {
    if (Platform.OS === 'web' || !Device.isDevice) {
      return null;
    }

    const permissionsStatus = await notificationService.requestPermissionAsync();

    if (permissionsStatus !== 'granted') {
      return null;
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync(
      getProjectId() ? { projectId: getProjectId() } : undefined,
    );

    return tokenResponse.data;
  },

  async requestPermissionAsync() {
    const existing = await Notifications.getPermissionsAsync();

    if (existing.status === 'granted') {
      return existing.status;
    }

    const requested = await Notifications.requestPermissionsAsync();
    return requested.status;
  },

  async syncPushToken(token: string, accessToken?: string) {
    if (!env.apiBaseUrl) {
      return;
    }

    const response = await fetch(resolveApiUrl(env.notificationRegistrationPath), {
      body: JSON.stringify({
        platform: Platform.OS,
        token,
      }),
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });

    if (!response.ok) {
      throw await createApiError(response, 'Unable to register push token.');
    }
  },
};
