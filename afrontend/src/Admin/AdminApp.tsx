import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd"; // 👈 import Ant Design loader
import ProtectedRoute from "../Components/ProtectedRoute";
import AdminDashboard from "../Admin/dashboard";
import AddPlan from "../Admin/AddPlan";
import AddCoupon from "../Admin/Addcoupon";
import NotFound from "./NotFount";
import Login from "./Login";
import AiPricing from "./AiPricing";

import { checkAuth } from "../utils/checkauth"; // API call to backend

const LoginRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const authenticated = await checkAuth();
      setIsLoggedIn(authenticated);
      setLoading(false);
    };
    verify();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Checking session..." />
      </div>
    );
  }

  return isLoggedIn ? <Navigate to="/admindashboard" replace /> : <Login />;
};

const AdminApp: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route path="/login" element={<LoginRoute />} />

        {/* Public Route */}
        <Route path="/not-found" element={<NotFound />} />

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute expectedRole={1} />}>
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/add-plan" element={<AddPlan />} />
          <Route path="/add-coupon" element={<AddCoupon />} />
          <Route path="/aiPricing" element={<AiPricing />} />
        </Route>

        {/* Catch-all */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </Router>
  );
};

export default AdminApp;
