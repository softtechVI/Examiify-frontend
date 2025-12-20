import axios from "axios";
import { Room, RoomPayload } from "../types";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

// Fetch all rooms
export const addRoom = async (room: RoomPayload) => {
  const res = await axios.post(`${API_URL}/api/user/add-room`, room, {
    withCredentials: true,
  });
  return res.data;
};

export const getRooms = async (): Promise<Room[]> => {
  const res = await axios.get(`${API_URL}/api/user/get-rooms`, {
    withCredentials: true,
  });
  return res.data;
};

export const deleteRoom = async (id: string) => {
  const res = await axios.delete(`${API_URL}/api/user/delete-room/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

export const updateRoom = async (id: string, room: RoomPayload): Promise<Room> => {
    const res = await axios.put(`${API_URL}/api/user/update-room/${id}`, room, {
        withCredentials: true,
    });
    return res.data;
};