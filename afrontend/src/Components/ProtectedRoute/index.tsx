import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Spin } from 'antd';




const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;;

interface User {
  role: '1' | '2' | string; // Adjust according to your roles
}

interface ResponseData {
  user?: User;
}

interface ProtectedRouteProps {
  expectedRole: number;
}

const contentStyle: React.CSSProperties = {
    padding: 50,
    background: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 4,
  };
const content = <div style={contentStyle} />;
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ expectedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<number | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
 const response = await axios.post<ResponseData>(
  `${API_URL}/api/auth/checkadmin`,
  {}, // request body (empty)
  {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // correct location
  }
);

        if (response.data.user) {
          setIsAuthenticated(true);
          setUserRole(Number(response.data.user.role)); // Set user role from response
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    verifyUser();
  }, []);

  // If the authentication status is not determined yet
  if (isAuthenticated === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin tip="Loading" size="large">
        {content}
      </Spin>
      </div>
    );
  }

  // Check if user is authenticated and has the correct role
if (!isAuthenticated) {
  return <Navigate to="/login" />;
}
console.log("userRole", userRole);
if (userRole !== expectedRole) {
  return <Navigate to="/unauthorized" />; // Or render a component
}


  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute;
