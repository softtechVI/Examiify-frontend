import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { loginAdmin } from "../services/api"
import useAlertStore from "../store/useAlertStore";
import EmailOTPVerify from "../Components/OTPModel/index";
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
        setUser(data.user ?? null);
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
      if (data.otpRequired === false && data.user) {
        setUser(data.user);
        showAlert("success", data.message || "Login successful");
        navigate("/admindashboard");
      } else {
        showAlert(
          "success",
          data.message || "OTP sent successfully for admin login"
        );
        setEmailForOtp(formData.email);
        setShowOtpScreen(true);
      }
    } else {
      showAlert("error", data?.message || "Login failed");
    }
  } catch (err) {
    console.error("Login error:", err);
    showAlert("error", "An unexpected error occurred");
  }
};

  return (
    <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    position: "relative",
  }}
>
  {/* -------- LOGIN FORM -------- */}
  <Box
    sx={{
      backgroundColor: "#fff",
      boxShadow: 5,
      borderRadius: 3,
      p: { xs: 3, sm: 4 },
      width: "90%",
      maxWidth: "400px",
      pointerEvents: showOtpScreen ? "none" : "auto",
      filter: showOtpScreen ? "blur(1px)" : "none",
    }}
  >
    <Box
      component="img"
      src="/logo5.png"
      alt="logo"
      sx={{
        width: "100%",
        height: 160,
        objectFit: "contain",
        mb: 1,
      }}
    />

    <Typography
      sx={{
        textAlign: "center",
        fontSize: "16px",
        color: "#6b7280",
        mb: 2,
      }}
    >
      Login into your account
    </Typography>

    <Box component="form">
      <TextField
        label="Email"
        type="email"
        margin="normal"
        fullWidth
        value={formData.email}
        onChange={(e) =>
          setFormData({ ...formData, email: e.target.value })
        }
      />

      <TextField
        label="Password"
        type="password"
        margin="normal"
        fullWidth
        value={formData.password}
        onChange={(e) =>
          setFormData({ ...formData, password: e.target.value })
        }
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={showOtpScreen}
          sx={{
            width: "100%",
            backgroundColor: "#049F99",
            border: "none",
            "&:hover": {
              backgroundColor: "#337774",
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Box>
  </Box>

  {/* -------- OVERLAY -------- */}
  {showOtpScreen && (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        zIndex: 40,
      }}
    />
  )}

  {/* -------- OTP MODAL -------- */}
  {showOtpScreen && (
    <EmailOTPVerify
      label="OTP sent to admin mail id's"
      onVerifyOtp={handleVerifyEmailOtp}
      onClose={() => setShowOtpScreen(false)}
    />
  )}
</Box>
  );
};

export default Login;
