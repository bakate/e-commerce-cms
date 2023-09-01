import { create } from "zustand";

type UseStoreModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useStoreModal = create<UseStoreModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
