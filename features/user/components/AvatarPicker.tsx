import { useRef, useState } from 'react';

import { CameraView } from 'expo-camera';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';

import { AppModal, Button, Card, Loader } from '@/components/ui';
import { useAppTheme } from '@/hooks/useAppTheme';
import { mediaService } from '@/services/mediaService';

type AvatarPickerProps = {
  imageUrl?: string | null;
  onImageSelected: (fileUri: string) => Promise<void> | void;
  uploading?: boolean;
  userName: string;
};

const getInitials = (value: string) =>
  value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

export const AvatarPicker = ({
  imageUrl,
  onImageSelected,
  uploading = false,
  userName,
}: AvatarPickerProps) => {
  const { theme } = useAppTheme();
  const cameraRef = useRef<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleLibraryPick = async () => {
    setIsBusy(true);
    setErrorMessage(null);

    try {
      const asset = await mediaService.pickImageFromLibrary();

      if (!asset?.uri) {
        return;
      }

      setIsMenuVisible(false);
      await onImageSelected(asset.uri);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Unable to access your photo library.',
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleOpenCamera = async () => {
    setErrorMessage(null);
    const status = await mediaService.requestCameraPermission();

    if (status !== 'granted') {
      setErrorMessage('Camera permission is required before capturing an avatar.');
      return;
    }

    setIsMenuVisible(false);
    setIsCameraVisible(true);
  };

  const handleCapturePhoto = async () => {
    if (!cameraRef.current) {
      return;
    }

    setIsBusy(true);
    setErrorMessage(null);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        skipProcessing: true,
      });

      if (!photo?.uri) {
        return;
      }

      await mediaService.saveToLibrary(photo.uri).catch(() => null);
      setIsCameraVisible(false);
      await onImageSelected(photo.uri);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to capture a photo.');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card title="Avatar">
      <View className="items-center gap-4">
        <View
          className="items-center justify-center overflow-hidden rounded-full"
          style={{
            backgroundColor: theme.colors.primaryLight,
            height: 108,
            width: 108,
          }}
        >
          {imageUrl ? (
            <Image
              contentFit="cover"
              source={{ uri: imageUrl }}
              style={{ height: 108, width: 108 }}
            />
          ) : (
            <Text style={{ color: theme.colors.primary, fontSize: 32, fontWeight: '700' }}>
              {getInitials(userName) || 'U'}
            </Text>
          )}
          {uploading ? (
            <View
              className="absolute inset-0 items-center justify-center"
              style={{ backgroundColor: theme.colors.overlay }}
            >
              <Loader label="Uploading..." />
            </View>
          ) : null}
        </View>

        <Button onPress={() => setIsMenuVisible(true)} size="sm" variant="secondary">
          Change avatar
        </Button>

        {errorMessage ? (
          <View
            className="w-full rounded-xl px-4 py-3"
            style={{ backgroundColor: theme.colors.dangerLight }}
          >
            <Text className="text-[13px] font-medium" style={{ color: theme.colors.danger }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}
      </View>

      <AppModal onClose={() => setIsMenuVisible(false)} visible={isMenuVisible}>
        <View className="gap-4">
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            Update avatar
          </Text>
          <Button loading={isBusy} onPress={() => void handleLibraryPick()}>
            Choose from library
          </Button>
          <Button onPress={() => void handleOpenCamera()} variant="secondary">
            Use camera
          </Button>
        </View>
      </AppModal>

      <AppModal onClose={() => setIsCameraVisible(false)} visible={isCameraVisible}>
        <View className="gap-4">
          <Text
            className="text-xl font-bold tracking-tight"
            style={{ color: theme.colors.foreground }}
          >
            Capture avatar
          </Text>
          <View
            className="overflow-hidden rounded-3xl"
            style={{ backgroundColor: theme.colors.surface, height: 320 }}
          >
            <CameraView facing="front" ref={cameraRef} style={{ flex: 1 }} />
          </View>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Button onPress={() => setIsCameraVisible(false)} variant="secondary">
                Cancel
              </Button>
            </View>
            <View className="flex-1">
              <Button loading={isBusy} onPress={() => void handleCapturePhoto()}>
                Capture
              </Button>
            </View>
          </View>
        </View>
      </AppModal>
    </Card>
  );
};
