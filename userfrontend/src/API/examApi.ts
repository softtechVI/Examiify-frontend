import axios, { AxiosError } from "axios";
import { message } from "antd";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export interface ExamData {
  examName: string;
  examDate: string;
  examTime: string;
  shifts: string;
  duration: number;
  semesterAndClass: string;
  studentCount: number;
  notes?: string;
}

export const addNewExam = async (examData: ExamData): Promise<ExamData> => {
  try {
    const response = await axios.post<ExamData>(
      `${API_URL}/api/user/add-exam`,
      examData,
      { withCredentials: true } // ✅ this is required for cookie to be sent
    );

    return response.data;
  } catch (error:unknown) {
    console.error("Error adding exam:", error);
    throw error;
  }
};

export const getExam = async (): Promise<ExamData[]> => {
  try {
    const response = await axios.get<ExamData[]>(
      `${API_URL}/api/user/get-exam`,
      { withCredentials: true }
    );

    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching exams:", error);
    throw error;
  }
};


export const updateExam = async (examId: string, examData: ExamData): Promise<ExamData> => {
  try {
    const response = await axios.put<{ data: ExamData }>(
      `${API_URL}/api/user/update-exam/${examId}`,
      examData,
      { withCredentials: true }
    );
    return response.data.data; // ✅ This is typed as ExamData
  } catch (error: unknown) {
    console.error(`Error updating exam ${examId}:`, error);

    if (axios.isAxiosError(error) && error.response) {
      message.error(`Update failed: ${error.response.data.message || "Server error"}`);
    } else {
      message.error("An unexpected error occurred during update.");
    }

    throw error;
  }
};

export const deleteExam = async (examId: string): Promise<void> => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/user/delete-exam/${examId}`,
      { withCredentials: true }
    );
  } catch (error:unknown) {
    console.error(`Error deleting exam ${examId}:`, error);

    if (axios.isAxiosError(error) && error.response) {
      message.error(`Delete failed: ${error.response.data.message || "Server error"}`);
    } else {
      message.error("An unexpected error occurred during delete.");
    }

    throw error;
  }
};
