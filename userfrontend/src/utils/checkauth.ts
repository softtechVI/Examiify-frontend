// utils/auth.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
  `${API_URL}/api/auth/check`,
  {}, // request body (empty in your case)
  { withCredentials: true } // config for axios
);


    return response.status === 200;
  } catch (error) {
    console.error("Auth check failed:", error);
    return false;
  }
};

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
