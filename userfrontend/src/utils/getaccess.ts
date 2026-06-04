// utils/getAccess.ts
import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const getAccess = async (): Promise<string | null> => {
  try {
    const response = await axios.get(`${API_URL}/api/user/access`, {
      withCredentials: true,
    });

    if (response.status === 200) {
      const { accessToken, role, permissions } = response.data;

      localStorage.setItem("userRole", String(role));
      localStorage.setItem("userPermissions", JSON.stringify(permissions)); 
      // → ["manage_users", "view_exam", "manage_profile"]

      return accessToken;
    }
    return null;
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
};

export const getUserRole = (): number | null => {
  const role = localStorage.getItem("userRole");
  return role ? Number(role) : null;
};

export const getUserPermissions = (): string[] => {  // ← string[] ab
  const raw = localStorage.getItem("userPermissions");
  return raw ? JSON.parse(raw) : [];
};