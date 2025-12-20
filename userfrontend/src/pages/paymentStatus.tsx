import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import successImg from "../assets/succefully3.png";
import pendingImg from "../assets/pending3.png";
import rejectedImg from "../assets/rejected2.png";
import { loginUser } from "../API/AllapiVerify";


interface PaymentStatusProps {
  status: "1" | "2" | "0";
}

const PaymentStatus: React.FC<PaymentStatusProps> = ({ status }) => {
  const navigate = useNavigate();
 const query = new URLSearchParams(window.location.search);
  const email = query.get("email") || "";
  const [password, setPassword] = useState("");


  const handleLogin = async () => {
    if (!email) {
      alert("No email found in session. Please log in again.");
      navigate("/login");
      return;
    }
    if (!password) {
      message.warning("Please enter your password.");
      return;
    }

    try {
      const res = await loginUser(email, password);
      if (res?.success) {
        alert("Login successful!");
        navigate("/dashboard");
      } else {
        alert("Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 md:px-12 lg:px-20 py-10 bg-white">
      {/* LEFT SIDE (Text) */}
      <div className="flex-1 w-full text-center md:text-left space-y-6">
        {status === "1" && (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Payment Successful 🎉
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Your payment has been completed successfully. You can now continue
              to access your dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Input.Password
                placeholder="Enter Password For Login"
                className="sm:w-60 h-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="primary"
                className="bg-teal-500 hover:bg-teal-600 text-white font-semibold"
                onClick={handleLogin}
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {status === "2" && (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Payment Pending ⏳
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Your payment is still being processed. Please wait a moment.
            </p>
            <Link
              to="/dashboard"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Please Wait
            </Link>
          </>
        )}

        {status === "0" && (
          <>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
              Payment Failed ❌
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Unfortunately, your payment was not successful. Please try again.
              To retry, you will need to log in again. If you have any
              questions, please email us at <b>info@gmail.com</b>.
            </p>
            <Link
              to="/login"
              className="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Retry Payment & Login
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE (Image) */}
      <div className="flex-1 w-full flex justify-center mt-8 md:mt-0">
        {status === "1" && (
          <img
            src={successImg}
            alt="success"
            className="w-64 sm:w-80 md:w-[26rem] lg:w-[32rem] object-contain"
          />
        )}
        {status === "2" && (
          <img
            src={pendingImg}
            alt="pending"
            className="w-64 sm:w-80 md:w-[26rem] lg:w-[32rem] object-contain"
          />
        )}
        {status === "0" && (
          <img
            src={rejectedImg}
            alt="rejected"
            className="w-64 sm:w-80 md:w-[26rem] lg:w-[32rem] object-contain"
          />
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
