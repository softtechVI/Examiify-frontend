import axios from "axios";
import { message } from "antd";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  message: string;
}

export const sendContactMessage = async (
  formData: ContactFormData
): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/api/user/sendMessage`,
      formData,
      { withCredentials: true }
    );

    message.success("Message sent successfully!");
  } catch (error: unknown) {
    console.error("Contact form error:", error);
    message.error("Failed to send message. Try again.");
    throw error;
  }
};
