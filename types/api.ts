export type FeatureFlags = {
  aiAssistant: boolean;
  biometrics: boolean;
  pushNotifications: boolean;
  subscriptions: boolean;
};

export type ApiError = Error & {
  code?: string;
  status?: number;
};
