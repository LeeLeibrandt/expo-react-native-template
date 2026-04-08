import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { FormInput, Button, Card, Input } from '@/components/ui';
import { type ProfileFormValues, profileSchema } from '@/features/user/schemas';

type ProfileFormProps = {
  email: string;
  fullName: string;
  isPending?: boolean;
  onSubmit: (values: ProfileFormValues) => void;
};

export const ProfileForm = ({ email, fullName, isPending, onSubmit }: ProfileFormProps) => {
  const { control, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName,
    },
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    reset({ fullName });
  }, [fullName, reset]);

  return (
    <Card title="Profile details">
      <View className="gap-5">
        <Input editable={false} label="Email address" value={email} />
        <FormInput control={control} label="Full name" name="fullName" placeholder="Jane Doe" />
        <Button loading={isPending} onPress={handleSubmit(onSubmit)}>
          Save profile
        </Button>
      </View>
    </Card>
  );
};
