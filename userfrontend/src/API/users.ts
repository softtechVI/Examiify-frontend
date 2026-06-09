import axios, { AxiosError } from "axios";
import { message } from "antd";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export interface User {
    _id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: string;
}

export const getUsers = async (): Promise<User[]> => {
    try {
        const response = await axios.get<User[]>(`${API_URL}/api/user/get-users`, { withCredentials: true });
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching users:", error);
        throw error;
    }   
};

export const deleteUser = async (userId: string): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/api/user/delete-user/${userId}`, { withCredentials: true });
    } catch (error: unknown) {
        console.error(`Error deleting user ${userId}:`, error);
        throw error;
    }
};