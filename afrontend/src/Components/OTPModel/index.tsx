import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { EmailOtpVerify } from "../../services/api";
import { useNavigate } from "react-router-dom";
import useIsLoginStore from "../../store/IsLoginStore";
import useAlertStore from "../../store/useAlertStore";
import useSessionStore from "../../store/userSession";
import { Box, Button, TextField, Typography } from "@mui/material";
import { pageWrapperSx } from "@/theme";

const OTP_LENGTH = 6;

interface OTPModelProps {
  label?: string;
  onVerifyOtp: (otp: string) => Promise<void>;
  onClose: () => void;
}

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  label: string;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  label,
  disabled,
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      }

      if (newOtp.every((d) => d !== "") && onComplete) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;

    const newOtp = Array(length).fill("");
    pasted.split("").forEach((digit, i) => {
      newOtp[i] = digit;
    });

    setOtp(newOtp);
    inputs.current[pasted.length - 1]?.focus();

    if (pasted.length === length && onComplete) {
      onComplete(pasted);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <Box sx={pageWrapperSx}>
      <Typography >{label}</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {otp.map((digit, index) => (
          <TextField
            key={index}
            type="text"
            inputProps={{
              maxLength: 1,
              inputMode: "numeric",
              style: { textAlign: "center" },
            }}
            value={digit}
            onChange={(e) => handleChange(e as any, index)}
            onKeyDown={(e) => handleKeyDown(e as any, index)}
            onPaste={handlePaste}
            inputRef={(el) => (inputs.current[index] = el)}
            disabled={disabled}
            className="w-10 h-10 mx-1"
          />
        ))}
      </Box>
    </Box>
  );
};

const EmailOTPVerify: React.FC<OTPModelProps> = ({
  onVerifyOtp,
  onClose,
  label = "OTP sent to admin mail id's",
}) => {
  const [otp, setOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const showAlert = useAlertStore.getState().showAlert;

  const handleOtpComplete = (otp: string) => {
    setOtp(otp);
  };

  const verifyOtp = async () => {
    if (otp.length !== OTP_LENGTH) {
      showAlert("error", "Please enter complete 6-digit OTP");
      return;
    }

    try {
      await onVerifyOtp(otp);
      setEmailOtpVerified(true);
      onClose();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      showAlert("error", errorMessage);
    }
  };

  return (
    <Box
  sx={{
    position: "fixed",
    top: 80,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1300,
    px: 2,
    width: "100%",
    maxWidth: "500px",
  }}
>
  <Box
    sx={{
      position: "relative",
      backgroundColor: "#fff",
      p: 3,
      borderRadius: 2,
      boxShadow: 5,
      textAlign: "center",
      border: "1px solid #e5e7eb",
    }}
  >
    <Box
      onClick={onClose}
      sx={{
        position: "absolute",
        top: 12,
        right: 12,
        color: "#6b7280",
        cursor: "pointer",
        fontSize: "18px",
      }}
    >
      ✕
    </Box>

    <Typography
      sx={{
        fontSize: "20px",
        fontWeight: 600,
        mb: 2,
      }}
    >
      Verify OTP
    </Typography>

    <OTPInput
      label={label}
      onComplete={handleOtpComplete}
      disabled={emailOtpVerified}
    />

    <Button
      onClick={verifyOtp}
      disabled={otp.length !== OTP_LENGTH}
      variant="contained"
      sx={{
        mt: 2,
        width: "100%",
        color: "#fff",
        cursor: otp.length !== OTP_LENGTH ? "not-allowed" : "pointer",
      }}
    >
      Verify OTP
    </Button>
  </Box>
</Box>
  );
};

export default EmailOTPVerify;