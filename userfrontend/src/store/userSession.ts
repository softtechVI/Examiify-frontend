// store/userSession.ts
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types/index";

interface SessionState {
  user:        User | null;
  role:        number | null;
  permissions: string[];

  setUser:       (user: User) => void;
  setSession:    (role: number, permissions: string[]) => void;
  clearUser:     () => void;
  clearSession:  () => void;
}

const useSessionStore = create<SessionState>()(
  persist(
    immer((set) => ({
      user:        null,
      role:        null,
      permissions: [],

      // ✅ User set — same as pehle
      setUser: (user) =>
        set((state) => {
          state.user = user;
        }),

      // ✅ Role + permissions set — getAccess() se call hoga
      setSession: (role, permissions) =>
        set((state) => {
          state.role        = role;
          state.permissions = permissions;
        }),

      // ✅ Sirf user clear
      clearUser: () =>
        set((state) => {
          state.user = null;
        }),

      // ✅ Sab clear — logout pe
      clearSession: () =>
        set((state) => {
          state.user        = null;
          state.role        = null;
          state.permissions = [];
        }),
    })),
    {
      name: "user-session",
      // ✅ sessionStorage — tab band = auto clear, localStorage se safer
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useSessionStore;