import { useEffect } from "react";
import { Alert } from "antd";
import useAlertStore from "../../store/useAlertStore";

const GlobalAlert = () => {
  const { type, message, clearAlert } = useAlertStore();

  useEffect(() => {
    if (message && type) {
      const timer = setTimeout(() => {
        clearAlert();
      }, 3000); // auto close after 3s

      return () => clearTimeout(timer);
    }
  }, [message, type, clearAlert]);

  return (
    <div className="flex justify-center fixed top-5 left-1/2 -translate-x-1/2 z-50 w-full ">
      {message && type && (
        <Alert
          message={message}
          type={type}
          showIcon
          className="mb-4 w-auto"
          closable
          onClose={clearAlert}
        />
      )}
    </div>
  );
};

export default GlobalAlert;
