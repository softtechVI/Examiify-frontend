// utils/auth.ts
import { getCurrentUser } from "@/services/api";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await getCurrentUser();

    return Boolean(response.user);
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

// logout function
export const logout = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_URL}/api/auth/logout`,
      {},
      {
        withCredentials: true, 
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};
