import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/Components/ui/tooltip";
import { Toaster } from "@/Components/ui/toaster";
import { Toaster as Sonner } from "@/Components/ui/sonner";

import ProtectedRoute from "./Components/ProtectedRoute";
import GlobalAlert from "./Components/GlobalAlert";

import Dashboard from "./pages/Dashboard";
import AddPlan from "./pages/AddPlan";
import AddCoupon from "./pages/AddCoupon";
import AiPricing from "./pages/AiPricing";
import FeatureControl from "./pages/FeatureControl";
import Login from "./pages/Login"
import NotFound from "./pages/NotFound";
import ContactMessages from "./pages/ContactMessage";
import Roles from "./pages/Roles";
import RoleEdit from "./pages/RoleEdit";
import Unauthorized from "./pages/Unauthorized";

import useSessionStore from "./store/userSession";

const queryClient = new QueryClient();

/* ---------------- LOGIN ROUTE (FROM CODE 1) ---------------- */

const LoginRoute: React.FC = () => {
  const user = useSessionStore((state) => state.user);

  return user ? (
    <Navigate to="/admindashboard" replace />
  ) : (
    <Login />
  );
};

/* ---------------- MAIN APP ---------------- */

const App: React.FC = () => {
  const restoreSession = useSessionStore((state) => state.restoreSession);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const bootstrapSession = async () => {
      try {
        await restoreSession();
      } finally {
        if (!cancelled) {
          setBootstrapping(false);
        }
      }
    };

    bootstrapSession();

    return () => {
      cancelled = true;
    };
  }, [restoreSession]);

  if (bootstrapping) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
          <CircularProgress size={60} />
          <Typography>Restoring session...</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalAlert />

          <Routes>
            {/* Login */}
            <Route path="/login" element={<LoginRoute />} />

            {/* Not Found */}
            <Route path="/not-found" element={<NotFound />} />

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute expectedRoles={[1]} />}>
              <Route path="/admindashboard" element={<Dashboard />} />
              <Route path="/add-plan" element={<AddPlan />} />
              <Route path="/add-coupon" element={<AddCoupon />} />
              <Route path="/ai-pricing" element={<AiPricing />} />
              <Route path="/feature-control" element={<FeatureControl />} />
              <Route path="/contact-info" element={<ContactMessages />} />
              <Route path="/roles" element={<Roles />} />
              <Route path="/roles/:roleId" element={<RoleEdit />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Default & Catch-all */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
