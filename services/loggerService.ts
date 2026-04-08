import { env } from '@/constants/env';
import { getErrorMessage } from '@/lib/utils';

class LoggerService {
  captureError(error: unknown, context?: Record<string, unknown>) {
    const normalizedError = error instanceof Error ? error : new Error(getErrorMessage(error));

    console.error('[app:error]', normalizedError, context);

    if (env.sentryDsn) {
      // Hook Sentry.captureException here once @sentry/react-native is installed.
    }

    return normalizedError;
  }

  info(message: string, context?: Record<string, unknown>) {
    if (__DEV__) {
      console.info('[app:info]', message, context);
    }
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn('[app:warn]', message, context);
  }
}

export const loggerService = new LoggerService();
