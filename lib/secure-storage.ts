import * as SecureStore from 'expo-secure-store';

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const secureStorage = {
  deleteItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key, secureStoreOptions);
  },
  getItem: async (key: string) => SecureStore.getItemAsync(key, secureStoreOptions),
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key, secureStoreOptions);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value, secureStoreOptions);
  },
};
