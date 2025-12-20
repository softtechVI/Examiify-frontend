import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Spin } from "antd";
import ProtectedRoute from "../components/ProtectedRoute";
import Login from "./Login";
import Register from "./register";
import Dashboard from "./InsideDashBoard";
import HomeRoute from "../components/HomeRedirect";
import NotFound from "./NotFound";
import PlanRenew from "./planRenew";
import GlobalAlert from "../components/GlobalAlert";
import GlobalLoader from "../components/GlobalLoder";
import { checkAuth } from "../utils/checkauth";

import ViewExam from "./ViewExam";
import ManageRooms from "./ManageRooms";
import ManageStudents from "./ManageStudents";
import Contact from "./Contact";
import Profile from "./Profile";
import AddclassAndDegre from "./AddclassAndDegre";

//  Import your layout here
import UserLayout from "../Layout/Applayout"; 

//  Wrapper for login
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Checking session..." />
      </div>
    );
  }

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />;
};

const UserApp: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <GlobalAlert />
        <GlobalLoader />

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<Register />} />
          <Route path="/not-found" element={<NotFound />} />
          <Route path="/plan-renew" element={<PlanRenew />} />
          <Route path="/" element={<HomeRoute />} />

          {/*  Protected User Routes with Layout */}
          <Route element={<ProtectedRoute expectedRole={2} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/view-exam" element={<ViewExam />} />
              <Route path="/manage-rooms" element={<ManageRooms />} />
              <Route path="/manage-students" element={<ManageStudents />} />
              <Route path="/addclass-degree" element={<AddclassAndDegre />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default UserApp;

