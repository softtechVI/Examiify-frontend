import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { EmailOtpVerify, PhoneOtpVerify } from "../../API/AllapiVerify";
import { message } from "antd";
import useIsLoginStore from "../../store/IsLoginStore"; // ✅ import zustand loader

interface OTPModelProps {
  email: string;
  phone: number | string;
  onVerifiedSubmit: () => void;
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
    const { value } = e.target;

    if (/^\d$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      }

      if (newOtp.every((digit) => digit !== "") && onComplete) {
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
      <div className="flex justify-center mb-2">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => {
              inputs.current[index] = el;
            }}
            disabled={disabled}
            className="w-10 h-10 mx-1 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        ))}
      </div>
    </div>
  );
};

const DualOTPVerify: React.FC<OTPModelProps> = ({
  email,
  phone,
  onVerifiedSubmit,
  onClose,
}) => {
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [mobileOtpVerified, setMobileOtpVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  // ✅ use Zustand loader
  const { startLoading, stopLoading } = useIsLoginStore();

  const handleEmailOtpComplete = (otp: string) => {
    setEmailOtp(otp);
  };

  const handleMobileOtpComplete = (otp: string) => {
    setMobileOtp(otp);
  };

  const verifyEmailOtp = async () => {
    if (!emailOtp) {
      message.error("Please enter the Email OTP");
      return;
    }
    startLoading("Verifying Email OTP..."); //  show loader
    try {
      await EmailOtpVerify(Number(emailOtp), email);
      setEmailOtpVerified(true);
      message.success("Email OTP verified successfully!");
    } catch (error) {
      message.error("Invalid Email OTP");
      console.error("Email OTP verification error:", error);
    } finally {
      stopLoading(); // ✅ hide loader
    }
  };

  const verifyMobileOtp = async () => {
    if (!mobileOtp) {
      message.error("Please enter the Mobile OTP");
      return;
    }
    startLoading("Verifying Mobile OTP...");
    try {
      await PhoneOtpVerify(mobileOtp, String(phone));
      setMobileOtpVerified(true);
      message.success("Mobile OTP verified successfully!");
    } catch (error) {
      message.error("Invalid Mobile OTP");
      console.error("Mobile OTP verification error:", error);
    } finally {
      stopLoading();
    }
  };

  const handleFinalSubmit = async () => {
    if (emailOtpVerified && mobileOtpVerified) {
      startLoading("Submitting registration...");
      try {
        await onVerifiedSubmit();
        onClose();
      } catch (error) {
        message.error("An error occurred during final submission.");
        console.error("Final submission error:", error);
      } finally {
        stopLoading();
      }
    } else {
      message.warning("Please verify both OTPs before submitting.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-6 rounded-lg">
      <div className="text-center bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h3 className="text-xl font-semibold mb-6">Verify Your OTPs</h3>

        <OTPInput
          label={`Email OTP sent to ${email}`}
          onComplete={handleEmailOtpComplete}
          disabled={emailOtpVerified}
        />
        {!emailOtpVerified && (
          <button
            onClick={verifyEmailOtp}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Verify Email OTP
          </button>
        )}
        {emailOtpVerified && (
          <p className="text-green-600 font-medium mb-4">Email OTP Verified!</p>
        )}

        <OTPInput
          label={`Mobile OTP sent to ${phone}`}
          onComplete={handleMobileOtpComplete}
          disabled={mobileOtpVerified}
        />
        {!mobileOtpVerified && (
          <button
            onClick={verifyMobileOtp}
            className="mb-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Verify Mobile OTP
          </button>
        )}
        {mobileOtpVerified && (
          <p className="text-green-600 font-medium mb-6">
            Mobile OTP Verified!
          </p>
        )}

        <br />
        <button
          onClick={handleFinalSubmit}
          className={`px-6 py-2 rounded-md text-white transition ${
            emailOtpVerified && mobileOtpVerified
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          disabled={!(emailOtpVerified && mobileOtpVerified)}
        >
          Submit & Register
        </button>
      </div>
    </div>
  );
};

export default DualOTPVerify;
