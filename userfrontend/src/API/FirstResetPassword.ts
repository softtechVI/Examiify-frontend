import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export const FirstPasswordReset = async (email: string, token: string, newPassword: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/first-reset-password`,
      {
        email,
        token,
        newPassword,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while resetting the password.");
  }
};
