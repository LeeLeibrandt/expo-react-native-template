import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';

export const mediaService = {
  async pickImageFromLibrary() {
    const permission = await mediaService.requestMediaLibraryPermission();

    if (permission !== 'granted') {
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      mediaTypes: ['images'],
      quality: 0.9,
      selectionLimit: 1,
    });

    return result.canceled ? null : result.assets[0];
  },

  async requestCameraPermission() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status;
  },

  async requestMediaLibraryPermission() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status;
  },

  async saveToLibrary(fileUri: string) {
    const permission = await mediaService.requestMediaLibraryPermission();

    if (permission !== 'granted') {
      return null;
    }

    return MediaLibrary.saveToLibraryAsync(fileUri);
  },
};
