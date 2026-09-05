// pages/UserApp.tsx
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import useSessionStore from "../store/userSession";
import useIsLoginStore from "../store/IsLoginStore";

import ProtectedRoute  from "../components/ProtectedRoute";
import GlobalAlert     from "../components/GlobalAlert";
import GlobalLoader    from "../components/GlobalLoder";
import UserLayout      from "../Layout/Applayout";

import Login           from "./Login";
import Register        from "./register";
import NotFound        from "./NotFound";
import PlanRenew       from "./planRenew";
import HomeRoute       from "../components/HomeRedirect";

import Dashboard       from "./InsideDashBoard";
import Profile         from "./Profile";
import Contact         from "./Contact";

import ManageUsers     from "./ManageUsers";
import ManageExam      from "./ManageExam";
import ManageStudents  from "./ManageStudents";
import ManageRooms     from "./ManageRooms";
import ViewReports     from "./ViewReports";
import ManageSettings  from "./ManageSettings";
import ManageRoles     from "./ManageRoles";
import ManagePlans     from "./ManagePlans";
import ManageCoupons   from "./ManageCoupons";
import ManageAI        from "./ManageAI";
import ViewExam        from "./ViewExam";
import ViewResults     from "./ViewResults";
import AttemptExam     from "./AttemptExam";

const API_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;

const PERMS = {
  MANAGE_USERS:    "manage_users",
  MANAGE_ROLES:    "manage_roles",
  MANAGE_PROFILE:  "manage_profile",
  MANAGE_EXAMS:    "manage_exams",
  MANAGE_STUDENTS: "manage_students",
  MANAGE_ROOMS:    "manage_rooms",
  VIEW_EXAM:       "view_exam",
  ATTEMPT_EXAMS:   "attempt_exams",
  VIEW_RESULTS:    "view_results",
  VIEW_REPORTS:    "view_reports",
  MANAGE_PLANS:    "manage_plans",
  MANAGE_COUPONS:  "manage_coupons",
  MANAGE_AI:       "manage_ai",
  MANAGE_SETTINGS: "manage_settings",
};

const initApp = async () => {
  console.log("initApp called");
  const { setUser, setSession, clearSession } = useSessionStore.getState();
  const { startLoading, stopLoading }         = useIsLoginStore.getState();

  startLoading("Loading...");
  try {
    const { data: meData } = await axios.post(
      `${API_URL}/api/user/me`,
      {},                         
      { withCredentials: true }    
    );
    setUser(meData.user);

    console.log("me response:", meData);

    const { data: accessData } = await axios.get(
      `${API_URL}/api/user/access`,
      { withCredentials: true }
    );
    setSession(accessData.role, accessData.permissions);
    
    console.log("access response:", accessData);
  } catch (err: any) {
    clearSession();
      console.log("initApp catch:", err.response?.status, err.response?.data);
  } finally {
    console.log("initApp finally");
    stopLoading();
  }
};

// ─── Permission Guard ─────────────────────────────────────────────────────────
const PermRoute: React.FC<{ permId: string; children: React.ReactNode }> = ({
  permId, children,
}) => {
  const { role, permissions } = useSessionStore();
  console.log("PermRoute check — role:", role, "permId:", permId, "has perm:", permissions.includes(permId));
  if (role === 2) return <>{children}</>;
  if (!permissions.includes(permId)) return <Navigate to="/not-found" replace />;
  return <>{children}</>;
};

// ─── Login Route ──────────────────────────────────────────────────────────────
const LoginRoute: React.FC = () => {
  const { user } = useSessionStore();
  return user ? <Navigate to="/dashboard" replace /> : <Login />;
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const UserApp: React.FC = () => {
  const { role }          = useSessionStore();
  const { user }          = useSessionStore();
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    initApp().finally(() => setReady(true));
  }, []);

  if (ready && !user) {
    return (
      <BrowserRouter>
        <GlobalAlert />
        <Routes>
          <Route path="/login"      element={<Login />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/not-found"  element={<NotFound />} />
          <Route path="/plan-renew" element={<PlanRenew />} />
          <Route path="*"           element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    );
  }

  return (
    <BrowserRouter>
      <GlobalAlert />

      {!ready && (
        <GlobalLoader />
      )}

      {ready && (
        <Routes>
          <Route path="/"           element={<HomeRoute />} />
          <Route path="/login"      element={<LoginRoute />} />
          <Route path="/register"   element={<Register />} />
          <Route path="/not-found"  element={<NotFound />} />
          <Route path="/plan-renew" element={<PlanRenew />} />

          {role === 1 && (
            <Route element={<ProtectedRoute expectedRole={1} />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard"       element={<Dashboard />} />
                <Route path="/profile"         element={<Profile />} />
                <Route path="/contact"         element={<Contact />} />
                <Route path="/manage-users"    element={<PermRoute permId={PERMS.MANAGE_USERS}>   <ManageUsers />   </PermRoute>} />
                <Route path="/manage-roles"    element={<PermRoute permId={PERMS.MANAGE_ROLES}>   <ManageRoles />   </PermRoute>} />
                <Route path="/manage-plans"    element={<PermRoute permId={PERMS.MANAGE_PLANS}>   <ManagePlans />   </PermRoute>} />
                <Route path="/manage-coupons"  element={<PermRoute permId={PERMS.MANAGE_COUPONS}> <ManageCoupons /> </PermRoute>} />
                <Route path="/manage-ai"       element={<PermRoute permId={PERMS.MANAGE_AI}>      <ManageAI />      </PermRoute>} />
                <Route path="/manage-settings" element={<PermRoute permId={PERMS.MANAGE_SETTINGS}><ManageSettings /></PermRoute>} />
              </Route>
            </Route>
          )}

          {role === 2 && (
            <Route element={<ProtectedRoute expectedRole={2} />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard"       element={<Dashboard />} />
                <Route path="/profile"         element={<Profile />} />
                <Route path="/contact"         element={<Contact />} />
                <Route path="/manage-users"    element={<PermRoute permId={PERMS.MANAGE_USERS}>   <ManageUsers />   </PermRoute>} />
                <Route path="/manage-exam"     element={<PermRoute permId={PERMS.MANAGE_EXAMS}>   <ManageExam />    </PermRoute>} />
                <Route path="/manage-students" element={<PermRoute permId={PERMS.MANAGE_STUDENTS}><ManageStudents /></PermRoute>} />
                <Route path="/manage-rooms"    element={<PermRoute permId={PERMS.MANAGE_ROOMS}>   <ManageRooms />   </PermRoute>} />
                <Route path="/view-exam"       element={<PermRoute permId={PERMS.VIEW_EXAM}>      <ViewExam />      </PermRoute>} />
                <Route path="/view-results"    element={<PermRoute permId={PERMS.VIEW_RESULTS}>   <ViewResults />   </PermRoute>} />
                <Route path="/view-reports"    element={<PermRoute permId={PERMS.VIEW_REPORTS}>   <ViewReports />   </PermRoute>} />
                <Route path="/manage-settings" element={<PermRoute permId={PERMS.MANAGE_SETTINGS}><ManageSettings /></PermRoute>} />
              </Route>
            </Route>
          )}

          {role === 3 && (
            <Route element={<ProtectedRoute expectedRole={3} />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard"       element={<Dashboard />} />
                <Route path="/profile"         element={<Profile />} />
                <Route path="/contact"         element={<Contact />} />
                <Route path="/manage-exam"     element={<PermRoute permId={PERMS.MANAGE_EXAMS}>   <ManageExam />    </PermRoute>} />
                <Route path="/manage-students" element={<PermRoute permId={PERMS.MANAGE_STUDENTS}><ManageStudents /></PermRoute>} />
                <Route path="/manage-rooms"    element={<PermRoute permId={PERMS.MANAGE_ROOMS}>   <ManageRooms />   </PermRoute>} />
                <Route path="/view-exam"       element={<PermRoute permId={PERMS.VIEW_EXAM}>      <ViewExam />      </PermRoute>} />
                <Route path="/view-results"    element={<PermRoute permId={PERMS.VIEW_RESULTS}>   <ViewResults />   </PermRoute>} />
                <Route path="/view-reports"    element={<PermRoute permId={PERMS.VIEW_REPORTS}>   <ViewReports />   </PermRoute>} />
              </Route>
            </Route>
          )}

          {role === 4 && (
            <Route element={<ProtectedRoute expectedRole={4} />}>
              <Route element={<UserLayout />}>
                <Route path="/dashboard"    element={<Dashboard />} />
                <Route path="/profile"      element={<Profile />} />
                <Route path="/contact"      element={<Contact />} />
                <Route path="/view-exam"    element={<PermRoute permId={PERMS.VIEW_EXAM}>    <ViewExam />    </PermRoute>} />
                <Route path="/attempt-exam" element={<PermRoute permId={PERMS.ATTEMPT_EXAMS}><AttemptExam /> </PermRoute>} />
                <Route path="/view-results" element={<PermRoute permId={PERMS.VIEW_RESULTS}> <ViewResults /> </PermRoute>} />
              </Route>
            </Route>
          )}

          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default UserApp;