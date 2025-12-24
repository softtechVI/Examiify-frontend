import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/index";

interface SessionState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useSessionStore = create<SessionState>()(
  persist(
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
    })),
    {
      name: "user-session",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useSessionStore;
