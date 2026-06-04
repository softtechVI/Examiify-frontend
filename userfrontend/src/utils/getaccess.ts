// utils/getaccess.ts
import axios from "axios";
import useSessionStore from "../store/userSession";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const getAccess = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/user/access`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const { accessToken, role, permissions } = response.data;

      // ✅ Zustand store me set karo — localStorage nahi
      useSessionStore.getState().setSession(role, permissions);

      return accessToken;
    }

    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
};

// ✅ Store se lo
export const getUserRole = (): number | null => {
  return useSessionStore.getState().role;
};

export const getUserPermissions = (): string[] => {
  return useSessionStore.getState().permissions;
};