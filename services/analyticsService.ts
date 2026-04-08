import { PostHog } from 'posthog-react-native';

import { env, isAnalyticsConfigured } from '@/constants/env';
import { loggerService } from '@/services/loggerService';

class AnalyticsService {
  private client: PostHog | null = null;
  private initialized = false;

  identifyUser(userId: string, properties?: Record<string, string | number | boolean | null>) {
    this.init();
    this.client?.identify(userId, properties as Parameters<PostHog['identify']>[1]);
  }

  init() {
    if (this.initialized || !isAnalyticsConfigured) {
      return;
    }

    try {
      this.client = new PostHog(env.posthogKey, {
        captureAppLifecycleEvents: true,
        host: env.posthogHost,
      });
      this.initialized = true;
    } catch (error) {
      loggerService.captureError(error, { service: 'analytics.init' });
    }
  }

  reset() {
    this.client?.reset();
  }

  trackEvent(eventName: string, properties?: Record<string, string | number | boolean | null>) {
    this.init();
    this.client?.capture(eventName, properties as Parameters<PostHog['capture']>[1]);
  }
}

export const analyticsService = new AnalyticsService();
