import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { ForgotPasswordVerifyOTP,ForgotPasswordOtp, PasswordReset } from "../../API/AllapiVerify";


interface ResetPasswordFlowProps {
  setForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
}


const ResetPasswordFlow = ({ setForgotPassword }: ResetPasswordFlowProps) => {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Step 1: Send OTP
  const handleSendOTP = async () => {
    if (!email) {
      setError("Please enter your email.");
      return;
    }
    setError("");
    try {
      const data = await ForgotPasswordOtp(email);
      setMessage(data.message || "OTP sent to your email!");
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send OTP.");
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async () => {
    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }
    setError("");
    try {
      const data = await ForgotPasswordVerifyOTP(otp, email);
      setMessage(data.data.message || "OTP verified!");
      setStep(3);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "OTP verification failed.");
    }
  };

  // Step 3: Reset Password
const handleResetPassword = async () => {
  if (!newPassword || !confirmPassword) {
    setError("Please fill in both password fields.");
    return;
  }
  if (newPassword !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }
  setError("");
  try {
    const data = await PasswordReset(email,otp, newPassword);
    setMessage(data.message || "Password reset successfully!");
    alert(data.message || "Password reset successfully!");
    
    // Close the modal
    setForgotPassword(false); // <-- Add this line

    // Optionally, navigate to login page
    navigate("/login"); // if you want to redirect
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Failed to reset password.");
  }
};


  return (
    <div className="flex justify-center items-center ">
      <div className=" p-8 rounded-xl shadow-lg w-[90%] max-w-md">
        <div className="flex justify-center mb-4">
          <img src="/logo5.png" alt="Logo" className="w-50 h-30" />
        </div>

        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold text-center mb-4">Enter Email</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              required
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleSendOTP}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold text-center mb-4">Enter OTP</h2>
            <p className="text-sm text-gray-500 text-center mb-4">OTP sent to {email}</p>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
              required
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button
              onClick={handleVerifyOTP}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold text-center mb-4">Reset Password</h2>

            <div className="relative mb-4">
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative mb-4">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            {message && <p className="text-green-600 text-sm mb-2">{message}</p>}

            <button
              onClick={handleResetPassword}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md transition duration-300"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordFlow;
