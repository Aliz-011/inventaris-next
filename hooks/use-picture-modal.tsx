import { create } from 'zustand';

interface usePcitureModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const usePictureModal = create<usePcitureModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
