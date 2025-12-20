import React from "react";
import { useNavigate } from "react-router";
import { Form, Input, Button } from "antd";
import { loginAdmin } from "../API/AllApi"; // Adjust the import path as necessary

const { Password } = Input;

const Login: React.FC = () => {
	
	const navigate = useNavigate();
	
 const handleLogin = async (values: { email: string; password: string }) => {
    try {
      const data = await loginAdmin(values.email, values.password);
      console.log("Login response:", data);

      if (data.success) {
        alert(data.message);
        navigate(data.nextRoute || "/");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert((err as Error).message || "An unexpected error occurred");
    }
  };


	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white shadow-lg rounded-xl p-6 sm:p-7 w-[90%] max-w-sm">
				<img src="/logo5.png" className="w-90 h-40" alt="logo" />
				<p className="text-center text-base text-gray-600 mb-3">
					Login into your account
				</p>

				<Form requiredMark={false} layout="vertical" onFinish={handleLogin}>
					<Form.Item
						label="Email"
						name="email"
						rules={[{ required: true, message: "Please enter your email!" }]}
					>
						<Input type="email" placeholder="Enter your email" />
					</Form.Item>

					<Form.Item
						label="Password"
						name="password"
						rules={[{ required: true, message: "Please enter your password!" }]}
					>
						<Password placeholder="Enter your password" />
					</Form.Item>

					<Form.Item className="mt-6">
                    <Button
                      type="primary"
                      htmlType="submit"
                     className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]" >
                     Login
                    </Button>
                    </Form.Item>
				</Form>
			</div>
		</div>
	);
};

export default Login;
