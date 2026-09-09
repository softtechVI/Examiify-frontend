import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

interface Feature {
  featureId: string;
  enabled: boolean;
  [key: string]: unknown;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message
    );
  }

  return "Something went wrong.";
};

export const getFeatures = async (): Promise<Feature[]> => {
  try {
    const response = await api.get("/api/admin/features");

    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message
      );
    }

    throw new Error(
      "Something went wrong while fetching the features."
    );
  }
};

export const updateFeaturesBulk = async (
  updates: { featureId: string; enabled: boolean }[]
): Promise<void> => {
  try {
    await api.put("/api/admin/features/bulk", {
      updates,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message
      );
    }

    throw new Error("Something went wrong while updating features.");
  }
};

export const resetFeatures = async (): Promise<void> => {
  try {
    await api.post("/api/admin/features/reset");
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(
        error.response?.data?.message || error.message
      );
    }

    throw new Error("Something went wrong while resetting features.");
  }
};