import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../API/AllapiVerify";
import { Eye, EyeOff } from "lucide-react";

// Import the Zustand store
import useIsLoginStore from "../store/IsLoginStore";
import ResetPasswordFlow from "../components/ForgotPassword";
import { Modal } from "antd";
import logo from "../assets/logo5.png";
import homeimg from "../assets/homeimage-login.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
   const [ forgotPassword, setForgotPassword ] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  // Zustand store
  const { isLoginLoading, startLoading, stopLoading } = useIsLoginStore();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!formData.email) newErrors.email = "Please enter your email";
    if (!formData.password) newErrors.password = "Please enter your password";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      // Show global spinner with dynamic tip
      startLoading("Logging you in...");

      try {
        const result = await loginUser(formData.email, formData.password);

        if (!result.success || !result.nextRoute) return;

        if (result.nextRoute === "/plan-renew" && result.extra) {
          const encodedEmail = encodeURIComponent(result.extra.email);
          const encodedToken = encodeURIComponent(result.extra.id);
          const encodedType = encodeURIComponent(result.extra.institutionType);
          navigate(`/plan-renew?email=${encodedEmail}&id=${encodedToken}&type=${encodedType}`);
        } else {
          navigate(result.nextRoute);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message || "Something went wrong.");
        } else {
          alert("Something went wrong.");
        }
      } finally {
        stopLoading();
      }
    },
    [formData, navigate, startLoading, stopLoading]
  );

  return (
    <div className="flex min-h-screen bg-teal-500">
      {/* Left Side - Brand Image (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-white">
        <img
          src={homeimg}
          alt="Brand"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-6">
       <button
      className="absolute top-4 right-4 bg-white text-teal-500 py-1 px-3 rounded-md shadow hover:bg-gray-100"
      onClick={() => navigate("/")}
    >
      Dashboard
    </button>
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img src={logo} alt="Logo" className="w-40 h-auto" />
          </div>

          <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your email"
                disabled={isLoginLoading}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block font-medium mb-1">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
                disabled={isLoginLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-9 right-3 text-gray-600"
                disabled={isLoginLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
          <div onClick={() => setForgotPassword(true)} className="text-right text-sm text-gray-600 hover:underline cursor-pointer">
              Forgot password?
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-teal-500 text-white font-semibold py-2 rounded-md transition duration-300
                          ${isLoginLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-teal-600"}`}
              disabled={isLoginLoading}
            >
              {isLoginLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

    <Modal
  open={forgotPassword}
  onCancel={() => setForgotPassword(false)}
  footer={null}
  centered
  destroyOnClose
>
   <ResetPasswordFlow setForgotPassword={setForgotPassword} />
</Modal>
    </div>
  );
};

export default Login;
