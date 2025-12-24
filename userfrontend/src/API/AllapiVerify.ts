// Email Otp Varify

import axios, { AxiosError } from "axios";
import { message } from "antd";
import useSessionStore  from "../store/userSession";
import useAlertStore from "../store/useAlertStore";
import type { User } from "@/types/index";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
const Razorpay_key = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
const showAlert = useAlertStore.getState().showAlert;

export const EmailOtpVerify = async (otp: number, email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/verify-email-otp`,
      { email, otp },
      { withCredentials: true } // important for cookie/session
    );
    // If the response is successful, return the data
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong during login.");
  }
};

// First Reset Password API

export const PasswordReset = async (
  email: string,
  otp : string,
  newPassword: string
) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/reset-password`,
      {
        email,
        otp,
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

// Get All Coupon Varify

export const GetAllCooupn = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/getallcoupon`, {
      withCredentials: true,
    });
    // console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while adding the plan.");
  }
};

// Get All Plans Varify

export const GetAllPlan = async (instituteType: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/user/getallplan`, {
      withCredentials: true,
       instituteType ,
    });
    // console.log("Response Data:", response.data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong while adding the plan.");
  }
};

// Login Varify
export const loginUser = async (email: string, password: string) => {
  const setUser = useSessionStore.getState().setUser;

  try {
    const response = await axios.post(
      `${API_URL}/api/user/login`,
      { email, password },
      { withCredentials: true }
    );

    const user = response.data.user;

    setUser(user);
    // console.log("User in store after login:", useSessionStore.getState().user);
    showAlert("success", "Login successful!");

    const needsReset = user.status;

    return {
      success: true,
      user,
      nextRoute: needsReset ? "/dashboard" : "/plan-renew",
      extra: needsReset ? null : { email: user.email, id: user.id, institutionType: user.institutionType },
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const msg =
        error.response?.data?.message || error.message || "Login failed";

      if (status === 403) {
        showAlert("error", "User Not Found.");
      } else {
        showAlert("error", msg);
      }

      return { success: false, nextRoute: null };
    }

    showAlert("error", "Something went wrong during login.");
    return { success: false, nextRoute: null };
  }
};
// Phone Otp Varify

export const PhoneOtpVerify = async (otp: string, phone: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/verify-phone-otp`,
      { otp, phone },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong during login.");
  }
};


declare global {
  interface Window {
    Razorpay: unknown;
  }
}

export const RegisterUser = async (userData: {
  name: string;
  institutionType: string;
  phoneNumber: string;
  institute: string;
  email: string;
  address: string;
  state: string;
  city: string;
  fullPhoneNumber?: string;
  password: string; // <--- Added password field
}) => {
  try {
    // 1. Register user on your backend
    const registerRes = await axios.post(`${API_URL}/api/user/register`, userData, {
      withCredentials: true,
    });
    console.log(registerRes.data.user);
    return registerRes.data.user;
  } catch (error) {
    if (error instanceof AxiosError) {
      message.error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong during registration.");
  }
};

// Register Otp Send Varify

export const OtpRequest = async (email: string, phone: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/otp-request`,
      { email, phone },
      { withCredentials: true } // important for cookie/session
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Internal Server Error"
      );
    }
  }
};

// Fatch The data on to Add Exam Data

export const getExamData = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/user/exams`, {
      withCredentials: true, // if your API requires cookies/session
    });
    return response.data; // return data directly
  } catch (error) {
    if (error instanceof AxiosError) {
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Internal Server Error"
      );
    } else {
      message.error(
        (error as Error).message || "Something went wrong while fetching exams."
      );
    }
  }
};

export const CheckValidCoupon = async (
  codeId: string,
  planId: string,
  couponInput: string
) => {
  //console.log("Checking coupon code:", code, "for plan ID:", planId);
  try {
    const response = await axios.post(
      `${API_URL}/api/user/check-coupon`,
      { codeId, planId, couponInput },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      message.error(
        error.response?.data?.message ||
          error.message ||
          "Internal Server Error"
      );
    } else {
      message.error(
        (error as Error).message ||
          "Something went wrong while checking coupon."
      );
    }
  }
};


export const createOrder = async (
  planId: string,
  couponInput: string,
  codeId: string,
  finalPrice: number,
  discount: number,
  userId: string
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post(
      `${API_URL}/api/user/create-payment`,
      { planId, couponInput, codeId, finalPrice, discount, userId },
      { withCredentials: true }
    );

    const order = response.data;

    return new Promise((resolve, reject) => {
      const options = {
        key: Razorpay_key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        handler: async function (res: any) {
          try {
            const verifyRes = await axios.post(
              `${API_URL}/api/user/verify-payment`,
              {
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                planId,
                couponInput,
                codeId,
                finalPrice,
                userId
              },
              { withCredentials: true }
            );
            resolve(verifyRes.data);
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ondismiss: function () {
            resolve({
              data: {
                status: "0", // match PaymentStatus "failed"
              },
            });
          },
        },
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    });
  } catch (error) {
    throw error;
  }
};

export const ForgotPasswordOtp = async (email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/forgot-password-otp`,
      { email },
      { withCredentials: true } // important for cookie/session
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong during login.");
  }
};
export const ForgotPasswordVerifyOTP = async (otp: string, email: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/user/verify-forgot-password-otp`,
      { otp, email },
      { withCredentials: true }
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error("Something went wrong during login.");
  }
};