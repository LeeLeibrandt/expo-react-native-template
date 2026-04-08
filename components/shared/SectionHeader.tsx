import type { ReactNode } from 'react';

import { Text, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type SectionHeaderProps = {
  action?: ReactNode;
  subtitle?: string;
  title: string;
};

export const SectionHeader = ({ action, subtitle, title }: SectionHeaderProps) => {
  const { theme } = useAppTheme();

  return (
    <View className="flex-row items-end justify-between gap-4">
      <View className="flex-1 gap-1">
        <Text
          className="text-lg font-bold tracking-tight"
          style={{ color: theme.colors.foreground }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-[13px] leading-[18px]" style={{ color: theme.colors.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
};
