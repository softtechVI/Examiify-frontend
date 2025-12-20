import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import useIsLoginStore from "../../store/IsLoginStore"; // your global loader store

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

interface User {
  role: string;
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

  // Zustand global loader
  const { startLoading, stopLoading } = useIsLoginStore();

  useEffect(() => {
    const verifyUser = async () => {
      startLoading(); // show global loader
      try {
        const response = await axios.post<ResponseData>(
          `${API_URL}/api/user/me`,
          {},
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        if (response.data.user) {
          setIsAuthenticated(true);
          setUserRole(Number(response.data.user.role));
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        setIsAuthenticated(false);
      } finally {
        stopLoading(); // hide global loader
      }
    };

    verifyUser();
  }, [startLoading, stopLoading]);

  // If authentication not determined yet → loader will show automatically
  if (isAuthenticated === null) {
    return null; // Let GlobalLoader handle the UI
  }

  // Not logged in
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Wrong role
  if (userRole !== expectedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  //  Allowed → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
