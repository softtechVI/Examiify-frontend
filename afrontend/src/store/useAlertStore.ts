import { create } from "zustand";

export type AlertType = "success" | "error" | "info" | "warning" | null;

interface AlertState {
  type: AlertType;
  message: string | null;
  showAlert: (type: AlertType, message: string) => void;
  clearAlert: () => void;
}

const useAlertStore = create<AlertState>((set) => ({
  type: null,
  message: null,
  showAlert: (type, message) => set({ type, message }),
  clearAlert: () => set({ type: null, message: null }),
}));

export default useAlertStore;
