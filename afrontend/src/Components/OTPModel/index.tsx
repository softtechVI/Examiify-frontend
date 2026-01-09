import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { EmailOtpVerify } from "../../API/AllApi";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import useIsLoginStore from "../../store/IsLoginStore";
import useAlertStore from "../../store/useAlertStore";
import useSessionStore from "../../store/userSession";

interface OTPModelProps {
  email: string;
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
    } else if (value === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1]?.focus();
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
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => { inputs.current[index] = el; }}
            disabled={disabled}
            className="w-10 h-10 mx-1 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
};

const EmailOTPVerify: React.FC<OTPModelProps> = ({
  email,
  onClose,
}) => {
  const setUser = useSessionStore.getState().setUser;
  const showAlert = useAlertStore.getState().showAlert;
  const navigate = useNavigate();
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);

  const { startLoading, stopLoading } = useIsLoginStore();

  const handleOtpComplete = (otp: string) => {
    setEmailOtp(otp);
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) {
      message.error("Please enter the Email OTP");
      return;
    }
    startLoading("Verifying Email OTP...");
    try {
     const data = await EmailOtpVerify(Number(emailOtp), email);
      if (data.success) {
        const user = data.user;
        setUser(user);
        showAlert("success", data.message);
        navigate(data.nextRoute);
        onClose();
      } else {
        message.error(data.message);
      }
      setEmailOtpVerified(true);
    } catch (error) {
      showAlert("error", (error as Error).message);
      console.error(error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex justify-center bg-gray-50 px-4 py-6 rounded-lg">
      <div
        className="absolute top-4 right-4 text-gray-500 cursor-pointer"
        onClick={onClose}
      >
        &#10005;
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <h3 className="text-xl font-semibold mb-6">Verify Email OTP</h3>

        <OTPInput
          label={`OTP sent to admin mail id's`}
          onComplete={handleOtpComplete}
          disabled={emailOtpVerified}
        />

        {!emailOtpVerified ? (
          <button
            onClick={verifyEmailOtp}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Verify OTP & Login
          </button>
        ) : (
          <p className="text-green-600 font-medium mb-6">
            Email OTP Verified ✔
          </p>
        )}
      </div>
    </div>
  );
};

export default EmailOTPVerify;
