import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { EmailOtpVerify } from "../../services/api";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useIsLoginStore from "../../store/IsLoginStore";
import useAlertStore from "../../store/useAlertStore";
import useSessionStore from "../../store/userSession";

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

  // ✅ HANDLE FULL OTP PASTE
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

    // focus last filled input
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
    <div className="mb-6">
      <h4 className="text-md font-semibold mb-2">{label}</h4>
      <div className="flex justify-center">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste} // ✅ IMPORTANT
            ref={(el) => (inputs.current[index] = el)}
            disabled={disabled}
            className="w-10 h-10 mx-1 text-center text-lg border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        ))}
      </div>
    </div>
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
      const errorMessage = err instanceof Error ? err.message : "OTP verification failed";
      showAlert("error", errorMessage);
    }
  };

  return (
    <div className="fixed top-10 left-1/2 z-50 -translate-x-1/2 px-4">
      <div className="relative bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center border">
        <div
          className="absolute top-3 right-3 text-gray-500 cursor-pointer"
          onClick={onClose}
        >
          ✕
        </div>

        <h3 className="text-xl font-semibold mb-4">Verify OTP</h3>

        <OTPInput
          label={label}
          onComplete={handleOtpComplete}
          disabled={emailOtpVerified}
        />

        <button
          onClick={verifyOtp}
          disabled={otp.length !== OTP_LENGTH}
          className={`mt-2 px-4 py-2 rounded-md w-full text-white
    ${
      otp.length !== OTP_LENGTH
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }
  `}
        >
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default EmailOTPVerify;
