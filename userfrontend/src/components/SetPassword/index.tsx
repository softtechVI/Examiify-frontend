import React, { useState } from 'react'; // Import useState
import { Form, Input, Button, message, Spin } from 'antd'; // Import Spin

interface PasswordModalProps {
  onSetPassword: (password: string) => void;
  onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onSetPassword, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false); // New loading state

  const handleFinish = async (values: { password: string; confirm: string }) => {
    setLoading(true); // Start loading
    try {
      // Pass the new password back to the parent component (Register.tsx)
      await onSetPassword(values.password); // Await this call if it's asynchronous in the parent
      onClose(); // Close the password modal after successful submission
    } catch (error) {
      message.error("Failed to set password. Please try again.");
      console.error("Password set error:", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="p-4">
      <Spin spinning={loading} size="large" tip="Setting password..."> {/* Spin component */}
        <h3 className="text-xl font-semibold mb-6 text-center">Set Your Password</h3>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: "Please enter your password!" },
              { min: 6, message: "Password must be at least 6 characters long!" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirm"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm new password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !bg-[#049F99] !border-none hover:!bg-[#337774]"
              loading={loading} // Add loading prop to the button
            >
              Set Password & Register
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default PasswordModal;