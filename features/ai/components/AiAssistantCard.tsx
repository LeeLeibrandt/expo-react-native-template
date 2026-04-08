import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Text, View } from 'react-native';

import { Button, Card, FormInput } from '@/components/ui';
import { env } from '@/constants/env';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import { useAiPrompt } from '@/features/ai/hooks/useAiPrompt';
import { type AiPromptFormValues, aiPromptSchema } from '@/features/ai/schemas';

export const AiAssistantCard = () => {
  const { theme } = useAppTheme();
  const { control, handleSubmit, reset } = useForm<AiPromptFormValues>({
    defaultValues: {
      prompt: '',
    },
    resolver: zodResolver(aiPromptSchema),
  });
  const aiPromptMutation = useAiPrompt();

  const handlePromptSubmit = handleSubmit(async (values) => {
    await aiPromptMutation.mutateAsync({
      prompt: values.prompt,
      systemPrompt: 'You are a concise AI copilot embedded in a production Expo starter template.',
    });
    reset();
  });

  const renderedResponse =
    aiPromptMutation.streamedText || aiPromptMutation.data?.text || 'AI response will appear here.';

  return (
    <Card title="AI assistant">
      <View className="gap-4">
        {!env.apiBaseUrl ? (
          <View
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: theme.colors.primaryLight }}
          >
            <Text className="text-[13px] leading-[18px]" style={{ color: theme.colors.primary }}>
              Set EXPO_PUBLIC_API_BASE_URL and an AI proxy endpoint to activate this feature.
            </Text>
          </View>
        ) : null}

        <FormInput
          className="min-h-36 items-start"
          control={control}
          label="Prompt"
          multiline
          name="prompt"
          placeholder="Summarize the user profile module in one sentence."
          style={{ minHeight: 120, textAlignVertical: 'top' }}
        />

        <Button loading={aiPromptMutation.isPending} onPress={handlePromptSubmit}>
          Send prompt
        </Button>

        <View
          className="rounded-2xl p-4"
          style={{
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            borderWidth: 1,
          }}
        >
          <Text className="text-base leading-6" style={{ color: theme.colors.foreground }}>
            {renderedResponse}
          </Text>
        </View>

        {aiPromptMutation.error ? (
          <View
            className="rounded-xl px-4 py-3"
            style={{ backgroundColor: theme.colors.dangerLight }}
          >
            <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
              {getErrorMessage(aiPromptMutation.error)}
            </Text>
          </View>
        ) : null}
      </View>
    </Card>
  );
};
