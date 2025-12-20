import axios from "axios";
import { message } from "antd";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

    export interface StudentData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    course: string;
    year: string;
    status: number;
    enrolledExams: number
    }

    // ➕ Add a new student
    export const addNewStudent = async (studentData: StudentData): Promise<StudentData> => {
    try {
        const response = await axios.post<{ data: StudentData }>(
        `${API_URL}/api/user/add-student`,
        studentData,
        { withCredentials: true }
        );

        return response.data.data;
    } catch (error: unknown) {
        console.error("Error adding student:", error);

        if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || "Failed to add student");
        } else {
        message.error("Unexpected error while adding student");
        }

        throw error;
    }
    };

    // 📄 Get all students
    export const getStudent = async (): Promise<StudentData[]> => {
    try {
        const response = await axios.get<StudentData[]>(
        `${API_URL}/api/user/get-student`,
        { withCredentials: true }
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Error fetching students:", error);
        message.error("Failed to fetch students");
        throw error;
    }
    };

    // ✏️ Update student
    export const updateStudent = async (studentId: string, studentData: StudentData): Promise<StudentData> => {
    try {
        const response = await axios.put<{ data: StudentData }>(
        `${API_URL}/api/user/update-student/${studentId}`,
        studentData,
        { withCredentials: true }
        );

        return response.data.data;
    } catch (error: unknown) {
        console.error(`Error updating student ${studentId}:`, error);

        if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || "Failed to update student");
        } else {
        message.error("Unexpected error while updating student");
        }

        throw error;
    }
    };

    //  Delete student
    export const deleteStudent = async (studentId: string): Promise<void> => {
    try {
        const response = await axios.delete(
        `${API_URL}/api/user/delete-student/${studentId}`,
        { withCredentials: true }
        );

    } catch (error: unknown) {
        console.error(`Error deleting student ${studentId}:`, error);

        if (axios.isAxiosError(error) && error.response) {
        message.error(error.response.data.message || "Failed to delete student");
        } else {
        message.error("Unexpected error while deleting student");
        }

        throw error;
    }
    };
