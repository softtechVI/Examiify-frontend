// routes/HomeRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { checkAuth } from "../../utils/checkauth"; // make sure this path is correct
import UserHome from "../../pages/UserHome"; // adjust path if needed
import GlobalLoader from "../../components/GlobalLoder";

const HomeRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const verifyAuth = async () => {
      const auth = await checkAuth();
      setIsAuthenticated(auth);
    };
    verifyAuth();
  }, []);

  if (isAuthenticated === null) {
    return <GlobalLoader />; // Or use a Spinner component
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <UserHome />;
};

export default HomeRoute;
