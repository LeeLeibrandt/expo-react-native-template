export const routePaths = {
  forgotPassword: '/(auth)/forgot-password',
  home: '/(app)',
  login: '/(auth)/login',
  profile: '/(app)/profile',
  register: '/(auth)/register',
} as const;

export const deepLinkPaths = {
  forgotPassword: '/forgot-password',
  home: '/',
  login: '/login',
  profile: '/profile',
  register: '/register',
} as const;
