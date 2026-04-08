import { Switch, Text, View } from 'react-native';

import { Screen } from '@/components/shared/Screen';
import { Button, Card, Loader } from '@/components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';
import { getErrorMessage } from '@/lib/utils';
import { useLogoutMutation } from '@/features/auth/hooks/useAuthMutations';
import { AvatarPicker } from '@/features/user/components/AvatarPicker';
import { ProfileForm } from '@/features/user/components/ProfileForm';
import {
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useUserProfileQuery,
} from '@/features/user/hooks/useUserProfile';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppStore } from '@/store/useAppStore';

export default function ProfileScreen() {
  const { theme } = useAppTheme();
  const authUser = useAuthStore((state) => state.user);
  const biometricsEnabled = useAppStore((state) => state.biometricsEnabled);
  const lastNotificationUrl = useAppStore((state) => state.lastNotificationUrl);
  const pushToken = useAppStore((state) => state.pushToken);
  const setBiometricsEnabled = useAppStore((state) => state.setBiometricsEnabled);

  const profileQuery = useUserProfileQuery();
  const updateProfileMutation = useUpdateProfileMutation();
  const uploadAvatarMutation = useUploadAvatarMutation();
  const logoutMutation = useLogoutMutation();

  if (!authUser) {
    return <Loader fullscreen label="Loading profile..." />;
  }

  return (
    <Screen title="Profile">
      {profileQuery.isLoading ? <Loader label="Syncing profile..." /> : null}

      <AvatarPicker
        imageUrl={profileQuery.data?.avatar_url}
        onImageSelected={async (fileUri) => {
          await uploadAvatarMutation.mutateAsync(fileUri);
        }}
        uploading={uploadAvatarMutation.isPending}
        userName={profileQuery.data?.full_name || authUser.email || 'User'}
      />

      <ProfileForm
        email={profileQuery.data?.email || authUser.email || ''}
        fullName={profileQuery.data?.full_name || authUser.user_metadata?.full_name || ''}
        isPending={updateProfileMutation.isPending}
        onSubmit={(values) => {
          updateProfileMutation.mutate({ full_name: values.fullName });
        }}
      />

      <Card title="Security">
        <View className="gap-5">
          <View className="flex-row items-center justify-between gap-4">
            <View className="flex-1 gap-1">
              <Text
                className="text-sm font-semibold"
                style={{ color: theme.colors.foreground }}
              >
                Biometric unlock
              </Text>
              <Text className="text-[13px] leading-[18px]" style={{ color: theme.colors.muted }}>
                Require Face ID or Touch ID when the app becomes active.
              </Text>
            </View>
            <Switch
              onValueChange={setBiometricsEnabled}
              thumbColor={biometricsEnabled ? theme.colors.primary : '#F8FAFC'}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.ring,
              }}
              value={biometricsEnabled}
            />
          </View>
          <Button
            loading={logoutMutation.isPending}
            onPress={() => logoutMutation.mutate()}
            variant="danger"
          >
            Log out
          </Button>
        </View>
      </Card>

      <Card title="Diagnostics">
        <View className="gap-3">
          <View className="gap-1">
            <Text className="text-[13px] font-semibold" style={{ color: theme.colors.muted }}>
              Push token
            </Text>
            <Text
              className="text-sm"
              numberOfLines={1}
              style={{ color: theme.colors.foreground }}
            >
              {pushToken || 'Not registered yet'}
            </Text>
          </View>
          <View className="gap-1">
            <Text className="text-[13px] font-semibold" style={{ color: theme.colors.muted }}>
              Last notification deep link
            </Text>
            <Text
              className="text-sm"
              numberOfLines={1}
              style={{ color: theme.colors.foreground }}
            >
              {lastNotificationUrl || 'None'}
            </Text>
          </View>
        </View>
      </Card>

      {updateProfileMutation.error ? (
        <View
          className="rounded-xl px-4 py-3"
          style={{ backgroundColor: theme.colors.dangerLight }}
        >
          <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
            {getErrorMessage(updateProfileMutation.error)}
          </Text>
        </View>
      ) : null}

      {uploadAvatarMutation.error ? (
        <View
          className="rounded-xl px-4 py-3"
          style={{ backgroundColor: theme.colors.dangerLight }}
        >
          <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
            {getErrorMessage(uploadAvatarMutation.error)}
          </Text>
        </View>
      ) : null}
    </Screen>
  );
}
