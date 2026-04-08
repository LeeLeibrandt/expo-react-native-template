import type { ReactNode } from 'react';

import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from '@/hooks/useAppTheme';

type ScreenProps = {
  children: ReactNode;
  rightAction?: ReactNode;
  scroll?: boolean;
  subtitle?: string;
  title?: string;
};

export const Screen = ({ children, rightAction, scroll = true, subtitle, title }: ScreenProps) => {
  const { theme } = useAppTheme();

  const header = title ? (
    <View className="mb-8 mt-4 flex-row items-start justify-between gap-4">
      <View className="flex-1 gap-2">
        <Text
          className="text-[30px] font-extrabold tracking-tight"
          style={{ color: theme.colors.foreground }}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text className="text-base leading-6" style={{ color: theme.colors.muted }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {rightAction}
    </View>
  ) : null;

  const content = (
    <>
      {header}
      <View className="gap-6">{children}</View>
    </>
  );

  if (scroll) {
    return (
      <SafeAreaView
        className="flex-1"
        edges={['top', 'left', 'right']}
        style={{ backgroundColor: theme.colors.background }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="flex-1"
        >
          <ScrollView
            className="flex-1 px-5"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {content}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 px-5"
      edges={['top', 'left', 'right']}
      style={{ backgroundColor: theme.colors.background }}
    >
      {content}
    </SafeAreaView>
  );
};
