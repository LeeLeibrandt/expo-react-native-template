import type { ReactNode } from 'react';

import { Text, View, type ViewProps } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { cn } from '@/lib/utils';

export type CardProps = ViewProps & {
  children: ReactNode;
  subtitle?: string;
  title?: string;
};

export const Card = ({ children, className, style, subtitle, title, ...rest }: CardProps) => {
  const { theme } = useAppTheme();

  return (
    <View
      className={cn('rounded-3xl p-5', className)}
      style={[
        {
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.border,
          borderWidth: 1,
          ...theme.shadow.sm,
        },
        style,
      ]}
      {...rest}
    >
      {title ? (
        <View className="mb-4 gap-1">
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text className="text-sm leading-5" style={{ color: theme.colors.muted }}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
};
