import { Platform } from 'react-native';

export type ThemeMode = 'dark' | 'light' | 'system';
export type ResolvedThemeMode = 'dark' | 'light';

const spacing = {
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  lg: 16,
  md: 12,
  sm: 8,
  xl: 20,
  xs: 4,
} as const;

const radii = {
  full: 999,
  lg: 20,
  md: 16,
  pill: 999,
  sm: 12,
  xl: 24,
} as const;

const typography = {
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
  subheadline: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.2,
  },
} as const;

const shadow = {
  none: Platform.select({
    ios: {},
    android: { elevation: 0 },
    default: {},
  }),
  sm: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: { elevation: 2 },
    default: {},
  }),
  md: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
    default: {},
  }),
  lg: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: { elevation: 8 },
    default: {},
  }),
  button: Platform.select({
    ios: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: { elevation: 4 },
    default: {},
  }),
} as const;

export const lightTheme = {
  colors: {
    background: '#F5F7FA',
    border: '#E2E8F0',
    card: '#FFFFFF',
    danger: '#DC2626',
    dangerLight: '#FEF2F2',
    foreground: '#0F172A',
    muted: '#64748B',
    overlay: 'rgba(15, 23, 42, 0.5)',
    primary: '#2563EB',
    primaryForeground: '#FFFFFF',
    primaryLight: '#EFF6FF',
    ring: '#93C5FD',
    success: '#16A34A',
    successLight: '#F0FDF4',
    surface: '#F1F5F9',
    surfaceStrong: '#E2E8F0',
  },
  radii,
  shadow,
  spacing,
  typography,
};

export const darkTheme = {
  colors: {
    background: '#020617',
    border: '#1E293B',
    card: '#0F172A',
    danger: '#F87171',
    dangerLight: '#1C1017',
    foreground: '#F8FAFC',
    muted: '#94A3B8',
    overlay: 'rgba(0, 0, 0, 0.72)',
    primary: '#3B82F6',
    primaryForeground: '#FFFFFF',
    primaryLight: '#172554',
    ring: '#1D4ED8',
    success: '#4ADE80',
    successLight: '#0A1F0D',
    surface: '#111827',
    surfaceStrong: '#1E293B',
  },
  radii,
  shadow: {
    ...shadow,
    button: Platform.select({
      ios: {
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
      default: {},
    }),
  },
  spacing,
  typography,
};

export type AppTheme = typeof lightTheme;
