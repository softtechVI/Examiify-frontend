import { create } from "zustand";

interface IsLoginStore {
  isLoginLoading: boolean;
  loadingMessage: string;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const useIsLoginStore = create<IsLoginStore>((set) => ({
  isLoginLoading: false,
  loadingMessage: "",

  startLoading: (message = "Loading...") =>
    set({ isLoginLoading: true, loadingMessage: message }),

  stopLoading: () => set({ isLoginLoading: false, loadingMessage: "" }),
}));

export default useIsLoginStore;

