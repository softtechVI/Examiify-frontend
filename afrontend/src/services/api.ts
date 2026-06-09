import axios, { AxiosError } from "axios";
import type { RoleCatalogResponse, RoleRecord, User } from "@/types";
const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

export interface AuthMeResponse {
  user: User | null;
  success?: boolean;
  message?: string;
}

export const getCurrentUser = async (): Promise<AuthMeResponse> => {
  const { data } = await axios.post<AuthMeResponse>(
    `${API_URL}/api/auth/checkadmin`,
    {},
    {
      withCredentials: true,
    }
  );

  if (data && typeof data === "object" && "user" in data) {
    return data;
  }

  return {
    user: (data as unknown as User) ?? null,
  };
};

export const AddCoupon = async (formData: FormData) => {
  // Log each key-value pair in the FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  const response = await axios.post(`${API_URL}/api/admin/coupanadd`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    withCredentials: true,
  });

  return response.data;
};



// Add Plan Varify

export const AddPlan = async (formData: FormData) => {
        // ✅ Log each key-value pair
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/addplan`,
      formData, //  send raw FormData
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while adding the plan.");
  }
};

export const EmailOtpVerify = async (otp: number, email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/verifyemailotp`,
      { otp, email },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

        const user = response.data?.user;
        const role = user?.role;

    if (["1"].includes(String(role))) {
      return {
        success: true,
        user,
        nextRoute: "/admindashboard",
        message: "Login successful",
      };
    } else {
      return {
        success: false,
        user: null,
        nextRoute: "/",
        message: "Access denied: You are not authorized for this role.",
      };
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Axios error");  
    } else {
      throw new Error("Something went wrong during OTP verification.");
    }
  }
};

export const getRoles = async (): Promise<RoleCatalogResponse> => {
  const { data } = await axios.get<RoleCatalogResponse>(`${API_URL}/api/admin/roles`, {
    withCredentials: true,
  });
  return data;
};

export const createRole = async (payload: {
  name: string;
  key?: string;
  description?: string;
  permissions: string[];
  isActive?: boolean;
}) => {
  const { data } = await axios.post(`${API_URL}/api/admin/roles`, payload, {
    withCredentials: true,
  });
  return data as { role: RoleRecord };
};

export const updateRole = async (id: string, payload: Partial<Pick<RoleRecord, "name" | "key" | "description" | "permissions" | "isActive">>) => {
  const { data } = await axios.put(`${API_URL}/api/admin/roles/${id}`, payload, {
    withCredentials: true,
  });
  return data as { role: RoleRecord };
};

export const deleteRole = async (id: string) => {
  const { data } = await axios.delete(`${API_URL}/api/admin/roles/${id}`, {
    withCredentials: true,
  });
  return data;
};

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/login`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    if (response.status === 200) {
     return { success: true, message: response.data.message};
    }

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return {
      success: false,
      message: error.response?.data?.message || "Internal Server Error.",
    };
   } else {
      throw new Error("Something went wrong during login.");
    }
  }
};

// Delete Coupon Varify


export const DeleteCoupon = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/admin/deletecoupan/${id}`,
      {
        withCredentials: true,
      }
    );    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while deleting the coupon.");
  }
};

// Delete Plan

export const DeletePlan = async (id: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/admin/deleteplan/${id}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while deleting the plan.");
  }
};

// Get All Coupon Varify

export const GetAllCoupon = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/getallcoupon`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while fetching the coupons.");
  }
};

// Get All Plan Varify

export const GetAllPlan = async () => {
  
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/getallplan`,
      {
        withCredentials: true,
      }
    );
    // console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while adding the plan.");
  }
};

// Update Coupon Varify

export const UpdateCouponStatus = async (id: string, status: string) => {
try {
    const response = await axios.post(
        `${API_URL}/api/admin/updatecouponstatus/${id}`,
        { status },
        { withCredentials: true }
    );
        return response.data;
    } catch (error) {
    throw new Error('Failed to update coupon status');
}
};


// Update Plan Status (Activate / Deactivate)
export const UpdatePlanStatus = async (id: string, status: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/updateplanstatus/${id}`,
      { status },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while updating plan status.");
  }
};


// Update Coupon Data Varify


export const updateCouponData = async (editingCouponId: string, formData: FormData) => {
  // ✅ Log each key-value pair for debugging
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post( // use PATCH or PUT for updates
      `${API_URL}/api/admin/updatecoupondata/${editingCouponId}`, // ✅ correct your update endpoint here
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data", // ✅ ensures FormData is sent correctly
        },
      }
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while updating the coupon.");
  }
};

// ================= UPDATE PLAN DATA =================
export const updatePlanData = async (
  editingPlanId: string,
  formData: FormData
) => {
  // ✅ Debug: log FormData
  for (const [key, value] of formData.entries()) {
    console.log(`${key}:`, value);
  }

  try {
    const response = await axios.post(
      `${API_URL}/api/admin/updateplandata/${editingPlanId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || error.message
      );
    }
    throw new Error("Something went wrong while updating the plan.");
  }
};


export const GetAiPrice = async () =>{
   try {
    const response = await axios.get(
      `${API_URL}/api/admin/getaiprice`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while fetching the coupons.");
  }
}

// Modify AiPrice (no ID needed)

export const ModifyAiPrice = async (priceCents: number) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/updateAiPrice`,
      { priceCents },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while updating AI price.");
  }
};

export const ModifyAiStatus = async (id: string, status: boolean) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/updateAiStatus`,
      { id, status },
      { withCredentials: true }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message);
  }
};


export const DeleteAiPrice = async (id: string) => {
  const { data } = await axios.delete(
    `${API_URL}/api/admin/deleteAiPrice/${id}`,
    { withCredentials: true }
  );
  return data;
};

export const GetAllContacts = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/admin/getAllContactMessages`,
      {
        withCredentials: true,
      }
    );
    return response.data.data;
  } catch (error) { 
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while fetching the contacts.");
  }
};
