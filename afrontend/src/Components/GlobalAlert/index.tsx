import { useEffect } from "react";
import Alert from '@mui/material/Alert';

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
  <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] w-full flex justify-center">
    {message && type && (
      <Alert
          severity={type}   // ✅ yaha change
          onClose={clearAlert}
          className="mb-4 w-auto"
        >
          {message}        {/* ✅ yaha change */}
        </Alert>
    )}
  </div>
);

};

export default GlobalAlert;
