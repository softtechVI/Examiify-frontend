import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface User {
  role: "1" | "2" | string;
}

interface ResponseData {
  user?: User;
}

interface ProtectedRouteProps {
  expectedRole: number;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ expectedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axios.post<ResponseData>(
          `${API_URL}/api/auth/checkadmin`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.data.user) {
          setIsAuthenticated(true);
          setUserRole(Number(response.data.user.role));
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    verifyUser();
  }, []);

  if (isAuthenticated === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <CircularProgress size={60} />
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (userRole !== expectedRole) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;