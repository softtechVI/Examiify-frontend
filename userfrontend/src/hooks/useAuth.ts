// hooks/useAuth.ts
import { useCallback } from "react";
import axios from "axios";
import useSessionStore from "@/store/userSession";
import useAlertStore from "@/store/useAlertStore";

const showAlert = useAlertStore.getState().showAlert;
const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const useAuth = () => {
  const { user, role, permissions } = useSessionStore();
  const { setUser, setSession, clearSession } = useSessionStore.getState();

  const fetchAccess = useCallback(async () => {
    const { data } = await axios.get(
      `${API_URL}/api/user/access`,
      { withCredentials: true }
    );
    setSession(data.role, data.permissions);
  }, []);

  const hydrate = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/me`,
        {},                          // ✅ empty body
        { withCredentials: true }    // ✅ config
      );
      setUser(data.user);
      await fetchAccess();
    } catch {
      clearSession();
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/user/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(data.user);
      await fetchAccess();
      showAlert("success", "Login successful!");
      return {
        success:   true,
        nextRoute: data.user.status ? "/dashboard" : "/plan-renew",
        extra:     data.user.status
          ? null
          : { email: data.user.email, id: data.user.id, institutionType: data.user.institutionType },
      };
    } catch (error: any) {
      const status = error?.response?.status;
      const msg    = error?.response?.data?.message || "Login failed";
      showAlert("error", status === 403 ? "User Not Found." : msg);
      return { success: false, nextRoute: null };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(
        `${API_URL}/api/user/logout`,
        {},
        { withCredentials: true }
      );
    } finally {
      clearSession();
    }
  }, []);

  return { user, role, permissions, login, logout, hydrate };
};