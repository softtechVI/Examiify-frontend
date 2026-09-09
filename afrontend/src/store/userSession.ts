import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { User } from "../types/index";
import { getCurrentUser } from "../services/api";

interface SessionState {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  restoreSession: () => Promise<User | null>;
}

const useSessionStore = create<SessionState>()(
  immer((set) => ({
    user: null,
    setUser: (user) =>
      set((state) => {
          console.log("Setting user in store:", user);
        state.user = user;
      }),
    clearUser: () =>
      set((state) => {
        state.user = null;
      }),
    restoreSession: async () => {
      try {
        const data = await getCurrentUser();
        const user = data.user ?? null;

        set((state) => {
          state.user = user;
        });

        return user;
      } catch {
        set((state) => {
          state.user = null;
        });

        return null;
      }
    },
  }))
);

export default useSessionStore;
