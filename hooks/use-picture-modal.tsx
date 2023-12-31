import { create } from 'zustand';

interface usePictureModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePictureModal = create<usePictureModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
