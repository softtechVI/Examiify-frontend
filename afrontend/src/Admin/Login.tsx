import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { loginAdmin } from "../API/AllApi";
import useAlertStore from "../store/useAlertStore";
import EmailOTPVerify from "../Components/OTPModel";

const { Password } = Input;

const Login: React.FC = () => {
  const showAlert = useAlertStore.getState().showAlert;

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await loginAdmin(values.email, values.password);

      if (data?.success) {
        showAlert(
          "success",
          data.message || "OTP sent successfully for admin login"
        );
        setEmailForOtp(values.email);
        setShowOtpScreen(true); // move to OTP step
      } else {
        showAlert("error", data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("error", "An unexpected error occurred");
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {!showOtpScreen ? (
        /* ---------------- LOGIN FORM ---------------- */
        <div className="bg-white shadow-lg rounded-xl p-6 sm:p-7 w-[90%] max-w-sm">
          <img src="/logo5.png" className="w-90 h-40" alt="logo" />
          <p className="text-center text-base text-gray-600 mb-3">
            Login into your account
          </p>

          <Form requiredMark={false} layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter your email!" },
              ]}
            >
              <Input type="email" placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item className="mt-6">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        /* ---------------- OTP SCREEN ---------------- */
        <EmailOTPVerify
          email={emailForOtp}
          onClose={() => setShowOtpScreen(false)}
        />
      )}
    </div>
  );
};

export default Login;
