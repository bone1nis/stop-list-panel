import { create } from "zustand";

interface Toast {
  id: string;
  message: string;
}

interface StopListUiState {
  selectedId: string | null;
  pendingIds: string[];
  toasts: Toast[];
  openPanel: (id: string) => void;
  closePanel: () => void;
  addPending: (id: string) => void;
  removePending: (id: string) => void;
  pushToast: (message: string) => void;
  dismissToast: (id: string) => void;
}

export const useStopListUi = create<StopListUiState>((set) => ({
  selectedId: null,
  pendingIds: [],
  toasts: [],
  openPanel: (id) => set({ selectedId: id }),
  closePanel: () => set({ selectedId: null }),
  addPending: (id) =>
    set((state) => ({
      pendingIds: state.pendingIds.includes(id)
        ? state.pendingIds
        : [...state.pendingIds, id],
    })),
  removePending: (id) =>
    set((state) => ({
      pendingIds: state.pendingIds.filter((value) => value !== id),
    })),
  pushToast: (message) =>
    set((state) => ({
      toasts: [...state.toasts, { id: crypto.randomUUID(), message }],
    })),
  dismissToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
