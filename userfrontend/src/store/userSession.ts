// store/userSession.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { User } from "@/types/index";

interface SessionState {
  user:        User | null;
  role:        number | null;
  permissions: string[];

  setUser:      (user: User) => void;
  setSession:   (role: number, permissions: string[]) => void;
  clearSession: () => void;
}

const useSessionStore = create<SessionState>()(
  immer((set) => ({
    user:        null,
    role:        null,
    permissions: [],       

    setUser: (user) =>
      set((state) => { state.user = user; }),

    setSession: (role, permissions) =>
      set((state) => {
        state.role        = Number(role);
        state.permissions = permissions;
      }),


    clearSession: () =>
      set((state) => {
        state.user        = null;
        state.role        = null;
        state.permissions = [];
      }),
  }))
);

export default useSessionStore;