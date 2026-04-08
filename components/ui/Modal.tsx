import type { ReactNode } from 'react';

import { Modal as ReactNativeModal, Pressable, View } from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';

type AppModalProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string;
  visible: boolean;
};

export const AppModal = ({ children, onClose, visible }: AppModalProps) => {
  const { theme } = useAppTheme();

  return (
    <ReactNativeModal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: theme.colors.overlay }}
      >
        <Pressable className="absolute inset-0" onPress={onClose} />
        <View
          className="w-full max-w-md rounded-3xl p-6"
          style={{
            backgroundColor: theme.colors.card,
            ...theme.shadow.lg,
          }}
        >
          {children}
        </View>
      </View>
    </ReactNativeModal>
  );
};
