import { forwardRef, useState, type ReactNode } from 'react';

import { Text, TextInput, View, type TextInputProps } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { cn } from '@/lib/utils';

export type InputProps = TextInputProps & {
  error?: string;
  hint?: string;
  label?: string;
  leftAdornment?: ReactNode;
  rightAdornment?: ReactNode;
};

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      className,
      editable = true,
      error,
      hint,
      label,
      leftAdornment,
      onBlur,
      onFocus,
      rightAdornment,
      style,
      ...rest
    },
    forwardedRef,
  ) => {
    const { theme } = useAppTheme();
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = error
      ? theme.colors.danger
      : isFocused
        ? theme.colors.primary
        : theme.colors.border;

    return (
      <View className="w-full gap-1.5">
        {label ? (
          <Text className="mb-0.5 text-sm font-semibold" style={{ color: theme.colors.foreground }}>
            {label}
          </Text>
        ) : null}
        <View
          className={cn(
            'min-h-[52px] flex-row items-center gap-3 rounded-2xl px-4',
            !editable && 'opacity-60',
            className,
          )}
          style={{
            backgroundColor: theme.colors.card,
            borderColor,
            borderWidth: isFocused ? 1.5 : 1,
          }}
        >
          {leftAdornment}
          <TextInput
            className="flex-1 text-base"
            editable={editable}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            placeholderTextColor={theme.colors.muted}
            ref={forwardedRef}
            selectionColor={theme.colors.primary}
            style={[{ color: theme.colors.foreground, paddingVertical: 14 }, style]}
            {...rest}
          />
          {rightAdornment}
        </View>
        {error ? (
          <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
            {error}
          </Text>
        ) : hint ? (
          <Text className="text-[13px] font-medium" style={{ color: theme.colors.muted }}>
            {hint}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';
