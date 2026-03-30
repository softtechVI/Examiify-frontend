// import React, { useState } from "react";
// import { TextField, Button, Box } from "@mui/material";
// import { loginAdmin } from "../services/api"
// import useAlertStore from "../store/useAlertStore";
// import EmailOTPVerify from "../components/OTPModel";
// import { EmailOtpVerify } from "../services/api";
// import useSessionStore from "../store/userSession";
// import useIsLoginStore from "../store/IsLoginStore";
// import { useNavigate } from "react-router-dom";


// const { Password } = Input;

// const Login: React.FC = () => {
//   const showAlert = useAlertStore.getState().showAlert;

//   const [showOtpScreen, setShowOtpScreen] = useState(false);
//   const [emailForOtp, setEmailForOtp] = useState("");
//   const navigate = useNavigate();
// const setUser = useSessionStore.getState().setUser;
// const { startLoading, stopLoading } = useIsLoginStore();

// const handleVerifyEmailOtp = async (otp: string) => {
//   startLoading("Verifying Email OTP...");
//   try {
//     const data = await EmailOtpVerify(Number(otp), emailForOtp);

//     if (data.success) {
//       setUser(data.user);
//       showAlert("success", data.message);
//       navigate(data.nextRoute);
//       setShowOtpScreen(false);
//     } else {
//       showAlert("error", data.message);
//       throw new Error(data.message);
//     }
//   } finally {
//     stopLoading();
//   }
// };


//   const handleLogin = async (values: { email: string; password: string }) => {
//     try {
//       const data = await loginAdmin(values.email, values.password);

//       if (data?.success) {
//         showAlert(
//           "success",
//           data.message || "OTP sent successfully for admin login"
//         );
//         setEmailForOtp(values.email);
//         setShowOtpScreen(true); // move to OTP step
//       } else {
//         showAlert("error", data?.message || "Login failed");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       showAlert("error", "An unexpected error occurred");
//     }
//   };


//   return (
//   <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">

//     {/* -------- LOGIN FORM -------- */}
//     <div
//       className={`bg-white shadow-lg rounded-xl p-6 sm:p-7 w-[90%] max-w-sm
//         ${showOtpScreen ? "pointer-events-none blur-[1px]" : ""}
//       `}
//     >
//       <img src="/logo5.png" className="w-90 h-40" alt="logo" />
//       <p className="text-center text-base text-gray-600 mb-3">
//         Login into your account
//       </p>

//       <Form requiredMark={false} layout="vertical" onFinish={handleLogin}>
//         <Form.Item label="Email" name="email" rules={[{ required: true }]}>
//           <Input type="email" placeholder="Enter your email" />
//         </Form.Item>

//         <Form.Item label="Password" name="password" rules={[{ required: true }]}>
//           <Password placeholder="Enter your password" />
//         </Form.Item>

//         <Form.Item className="mt-6">
//           <Button
//             type="primary"
//             htmlType="submit"
//             disabled={showOtpScreen}
//             className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]"
//           >
//             Login
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>

//     {/* -------- OVERLAY -------- */}
//     {showOtpScreen && (
//       <div className="fixed inset-0 bg-black/40 z-40" />
//     )}

//     {/* -------- OTP MODAL -------- */}
//     {showOtpScreen && (
//       <EmailOTPVerify
//   label="OTP sent to admin mail id's"
//   onVerifyOtp={handleVerifyEmailOtp}
//   onClose={() => setShowOtpScreen(false)}
// />

//     )}
//   </div>
// );

// };

// export default Login;



import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { loginAdmin } from "../services/api"
import useAlertStore from "../store/useAlertStore";
import EmailOTPVerify from "../components/OTPModel";
import { EmailOtpVerify } from "../services/api";
import useSessionStore from "../store/userSession";
import useIsLoginStore from "../store/IsLoginStore";
import { useNavigate } from "react-router-dom";


const Login: React.FC = () => {
  const showAlert = useAlertStore.getState().showAlert;

  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const navigate = useNavigate();
  const setUser = useSessionStore.getState().setUser;
  const { startLoading, stopLoading } = useIsLoginStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleVerifyEmailOtp = async (otp: string) => {
    startLoading("Verifying Email OTP...");
    try {
      const data = await EmailOtpVerify(Number(otp), emailForOtp);

      if (data.success) {
        setUser(data.user);
        showAlert("success", data.message);
        navigate(data.nextRoute);
        setShowOtpScreen(false);
      } else {
        showAlert("error", data.message);
        throw new Error(data.message);
      }
    } finally {
      stopLoading();
    }
  };

  const handleLogin = async () => {
    try {
      const data = await loginAdmin(formData.email, formData.password);

      if (data?.success) {
        showAlert(
          "success",
          data.message || "OTP sent successfully for admin login"
        );
        setEmailForOtp(formData.email);
        setShowOtpScreen(true);
      } else {
        showAlert("error", data?.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      showAlert("error", "An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">

      {/* -------- LOGIN FORM -------- */}
      <div
        className={`bg-white shadow-lg rounded-xl p-6 sm:p-7 w-[90%] max-w-sm
          ${showOtpScreen ? "pointer-events-none blur-[1px]" : ""}
        `}
      >
        <img src="/logo5.png" className="w-90 h-40" alt="logo" />
        <p className="text-center text-base text-gray-600 mb-3">
          Login into your account
        </p>

        <Box component="form">
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <Box className="mt-6">
            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={showOtpScreen}
              className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]"
            >
              Login
            </Button>
          </Box>
        </Box>
      </div>

      {/* -------- OVERLAY -------- */}
      {showOtpScreen && (
        <div className="fixed inset-0 bg-black/40 z-40" />
      )}

      {/* -------- OTP MODAL -------- */}
      {showOtpScreen && (
        <EmailOTPVerify
          label="OTP sent to admin mail id's"
          onVerifyOtp={handleVerifyEmailOtp}
          onClose={() => setShowOtpScreen(false)}
        />
      )}
    </div>
  );
};

export default Login;