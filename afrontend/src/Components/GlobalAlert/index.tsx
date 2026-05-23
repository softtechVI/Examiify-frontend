import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { forwardRef } from "react";

import useAlertStore from "../../store/useAlertStore";

// MUI docs ke mutabiq, Alert ko forwardRef mein wrap karna zaroori hai
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const GlobalAlert = () => {
  const { type, message, clearAlert } = useAlertStore();
  const [open, setOpen] = useState(false);

  // Jab bhi naya message aaye, Snackbar open karo
  useEffect(() => {
    if (message && type) {
      setOpen(true);
    }
  }, [message, type]);

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return; // Clickaway pe close nahi hoga
    setOpen(false);
    clearAlert();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        severity={type ?? "info"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalAlert;