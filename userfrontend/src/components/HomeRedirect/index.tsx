
// routes/HomeRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import useSessionStore from "../../store/userSession";
import UserHome from "../../pages/UserHome";

const HomeRoute: React.FC = () => {
  const { user } = useSessionStore();

  return user ? <Navigate to="/dashboard" replace /> : <UserHome />;
};

export default HomeRoute;