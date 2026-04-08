import { memo, useRef, type ReactNode } from 'react';

import { ActivityIndicator, Animated, Pressable, Text } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { cn } from '@/lib/utils';

import type { PressableProps, ViewStyle } from 'react-native';

type ButtonVariant = 'danger' | 'ghost' | 'primary' | 'secondary';
type ButtonSize = 'lg' | 'md' | 'sm';

export type ButtonProps = PressableProps & {
  children: ReactNode;
  fullWidth?: boolean;
  leftAdornment?: ReactNode;
  loading?: boolean;
  rightAdornment?: ReactNode;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

const sizeMap: Record<ButtonSize, string> = {
  lg: 'min-h-[56px] px-6 py-4',
  md: 'min-h-[52px] px-5 py-3.5',
  sm: 'min-h-[40px] px-4 py-2.5',
};

const ButtonComponent = ({
  children,
  className,
  disabled,
  fullWidth = true,
  leftAdornment,
  loading = false,
  onPressIn,
  onPressOut,
  rightAdornment,
  size = 'md',
  style,
  variant = 'primary',
  ...rest
}: ButtonProps) => {
  const { theme } = useAppTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const palette = {
    danger: {
      bg: theme.colors.danger,
      fg: '#FFFFFF',
    },
    ghost: {
      bg: 'transparent',
      fg: theme.colors.foreground,
    },
    primary: {
      bg: theme.colors.primary,
      fg: theme.colors.primaryForeground,
    },
    secondary: {
      bg: theme.colors.surface,
      fg: theme.colors.foreground,
    },
  }[variant];

  const isDisabled = disabled || loading;

  const handlePressIn: PressableProps['onPressIn'] = (e) => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps['onPressOut'] = (e) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressOut?.(e);
  };

  const buttonStyle: ViewStyle = {
    backgroundColor: palette.bg,
    ...(variant === 'primary' ? theme.shadow.button : {}),
    ...(variant === 'secondary'
      ? { borderColor: theme.colors.border, borderWidth: 1 }
      : {}),
    ...(typeof style === 'object' && style !== null ? (style as ViewStyle) : {}),
  };

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        fullWidth ? { width: '100%' } : undefined,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        className={cn(
          'flex-row items-center justify-center gap-2 overflow-hidden rounded-2xl',
          sizeMap[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[buttonStyle, { opacity: isDisabled ? 0.5 : 1 }]}
        {...rest}
      >
        {loading ? <ActivityIndicator color={palette.fg} size="small" /> : null}
        {!loading && leftAdornment ? leftAdornment : null}
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text
            className="text-center font-semibold"
            style={{ color: palette.fg, fontSize: 16 }}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {!loading && rightAdornment ? rightAdornment : null}
      </Pressable>
    </Animated.View>
  );
};

export const Button = memo(ButtonComponent);
