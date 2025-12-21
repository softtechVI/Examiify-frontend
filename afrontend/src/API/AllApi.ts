// Add Coupon varify


import axios, { AxiosError } from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

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

// Admin Coupon Varify


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

    const user = response.data?.user;
    const role = user?.role;

    if (String(role) === "1") {
      return {
        success: true,
        user,
        nextRoute: "/admindashboard",
        message: "Login successful",
      };
    }

    return {
      success: false,
      message: "Access denied: You are not authorized for this role.",
    };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Axios error");
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

