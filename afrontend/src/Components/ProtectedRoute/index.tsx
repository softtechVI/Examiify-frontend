import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import useSessionStore from "@/store/userSession";

interface User {
  role: string | number;
}

interface ProtectedRouteProps {
  expectedRoles: number[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ expectedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      setIsAuthenticated(false);
      setUserRole(null);
      return;
    }

    setIsAuthenticated(true);
    setUserRole(Number(user.role));
  }, [user]);

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

  if (userRole === null || !expectedRoles.includes(userRole)) return <Navigate to="/unauthorized" />;

  return <Outlet />;
};

export default ProtectedRoute;