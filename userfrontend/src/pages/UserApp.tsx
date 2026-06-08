import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Spin } from "antd";
import { checkAuth } from "../utils/checkauth";
import { getUserRole, getUserPermissions } from "../utils/getaccess";

import ProtectedRoute   from "../components/ProtectedRoute";
import GlobalAlert      from "../components/GlobalAlert";
import GlobalLoader     from "../components/GlobalLoder";
import UserLayout       from "../Layout/Applayout";

import Login            from "./Login";
import Register         from "./register";
import NotFound         from "./NotFound";
import PlanRenew        from "./planRenew";
import HomeRoute        from "../components/HomeRedirect";

import Dashboard        from "./InsideDashBoard";
import Profile          from "./Profile";
import Contact          from "./Contact";

import ManageUsers      from "./ManageUsers";
import ManageExam       from "./ManageExam";
import ManageStudents   from "./ManageStudents";
import ManageRooms      from "./ManageRooms";
import ViewReports      from "./ViewReports";
import ManageSettings   from "./ManageSettings";

import ManageRoles      from "./ManageRoles";
import ManagePlans      from "./ManagePlans";
import ManageCoupons    from "./ManageCoupons";
import ManageAI         from "./ManageAI";

import ViewExam         from "./ViewExam";
import ViewResults      from "./ViewResults";
import AttemptExam      from "./AttemptExam";


// ─── ✅ Backend ke exact strings se match karo ────────────────────────────────
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

// ─── Permission Guard ─────────────────────────────────────────────────────────
const PermRoute: React.FC<{ permId: string; children: React.ReactNode }> = ({
  permId,
  children,
}) => {
  const role        = getUserRole();
  const permissions = getUserPermissions();
  if (role === 2) return <>{children}</>;

  // Permission check — agar list mein nahi toh not-found
  if (!permissions.includes(permId)) {
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
};

// ─── Login Route ──────────────────────────────────────────────────────────────
const LoginRoute: React.FC = () => {
  const [loading,    setLoading]    = useState(true);
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

  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login />;
};

// ─── Main App ─────────────────────────────────────────────────────────────────
const UserApp: React.FC = () => {

  // ✅ State mein rakho — login ke baad re-render hoga
  const [role, setRole]       = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await checkAuth();               // getAccess() call → localStorage SET hoga
      setRole(getUserRole());          // ab role read karo
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <GlobalAlert />
      <GlobalLoader />

      <Routes>

        {/* ── Public Routes ──────────────────────────────────── */}
        <Route path="/"           element={<HomeRoute />} />
        <Route path="/login"      element={<LoginRoute />} />
        <Route path="/register"   element={<Register />} />
        <Route path="/not-found"  element={<NotFound />} />
        <Route path="/plan-renew" element={<PlanRenew />} />

        {/* ── Role 1: Super Admin ────────────────────────────── */}
        {role === 1 && (
          <Route element={<ProtectedRoute expectedRole={1} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard"       element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Dashboard />     </PermRoute>} />
              <Route path="/manage-users"    element={<PermRoute permId={PERMS.MANAGE_USERS}>   <ManageUsers />   </PermRoute>} />
              <Route path="/manage-roles"    element={<PermRoute permId={PERMS.MANAGE_ROLES}>   <ManageRoles />   </PermRoute>} />
              <Route path="/manage-plans"    element={<PermRoute permId={PERMS.MANAGE_PLANS}>   <ManagePlans />   </PermRoute>} />
              <Route path="/manage-coupons"  element={<PermRoute permId={PERMS.MANAGE_COUPONS}> <ManageCoupons /> </PermRoute>} />
              <Route path="/manage-ai"       element={<PermRoute permId={PERMS.MANAGE_AI}>      <ManageAI />      </PermRoute>} />
              <Route path="/manage-settings" element={<PermRoute permId={PERMS.MANAGE_SETTINGS}><ManageSettings /></PermRoute>} />
              <Route path="/profile"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Profile />       </PermRoute>} />
              <Route path="/contact"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Contact />       </PermRoute>} />
            </Route>
          </Route>
        )}

        {/* ── Role 2: Admin ──────────────────────────────────── */}
        {role === 2 && (
          <Route element={<ProtectedRoute expectedRole={2} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard"       element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Dashboard />       </PermRoute>} />
              <Route path="/manage-users"    element={<PermRoute permId={PERMS.MANAGE_USERS}>   <ManageUsers />     </PermRoute>} />
              <Route path="/manage-exam"     element={<PermRoute permId={PERMS.MANAGE_EXAMS}>   <ManageExam />      </PermRoute>} />
              <Route path="/manage-students" element={<PermRoute permId={PERMS.MANAGE_STUDENTS}><ManageStudents />  </PermRoute>} />
              <Route path="/manage-rooms"    element={<PermRoute permId={PERMS.MANAGE_ROOMS}>   <ManageRooms />     </PermRoute>} />
              <Route path="/view-exam"       element={<PermRoute permId={PERMS.VIEW_EXAM}>      <ViewExam />        </PermRoute>} />
              <Route path="/view-results"    element={<PermRoute permId={PERMS.VIEW_RESULTS}>   <ViewResults />     </PermRoute>} />
              <Route path="/view-reports"    element={<PermRoute permId={PERMS.VIEW_REPORTS}>   <ViewReports />     </PermRoute>} />
              <Route path="/manage-settings" element={<PermRoute permId={PERMS.MANAGE_SETTINGS}><ManageSettings />  </PermRoute>} />
              <Route path="/profile"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Profile />         </PermRoute>} />
              <Route path="/contact"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Contact />         </PermRoute>} />
            </Route>
          </Route>
        )}

        {/* ── Role 3: Faculty ────────────────────────────────── */}
        {role === 3 && (
          <Route element={<ProtectedRoute expectedRole={3} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard"       element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Dashboard />      </PermRoute>} />
              <Route path="/manage-exam"     element={<PermRoute permId={PERMS.MANAGE_EXAMS}>   <ManageExam />     </PermRoute>} />
              <Route path="/manage-students" element={<PermRoute permId={PERMS.MANAGE_STUDENTS}><ManageStudents /> </PermRoute>} />
              <Route path="/manage-rooms"    element={<PermRoute permId={PERMS.MANAGE_ROOMS}>   <ManageRooms />    </PermRoute>} />
              <Route path="/view-exam"       element={<PermRoute permId={PERMS.VIEW_EXAM}>      <ViewExam />       </PermRoute>} />
              <Route path="/view-results"    element={<PermRoute permId={PERMS.VIEW_RESULTS}>   <ViewResults />    </PermRoute>} />
              <Route path="/view-reports"    element={<PermRoute permId={PERMS.VIEW_REPORTS}>   <ViewReports />    </PermRoute>} />
              <Route path="/profile"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Profile />        </PermRoute>} />
              <Route path="/contact"         element={<PermRoute permId={PERMS.MANAGE_PROFILE}> <Contact />        </PermRoute>} />
            </Route>
          </Route>
        )}

        {/* ── Role 4: Student ────────────────────────────────── */}
        {role === 4 && (
          <Route element={<ProtectedRoute expectedRole={4} />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard"    element={<PermRoute permId={PERMS.MANAGE_PROFILE}><Dashboard />   </PermRoute>} />
              <Route path="/view-exam"    element={<PermRoute permId={PERMS.VIEW_EXAM}>     <ViewExam />     </PermRoute>} />
              <Route path="/attempt-exam" element={<PermRoute permId={PERMS.ATTEMPT_EXAMS}> <AttemptExam />  </PermRoute>} />
              <Route path="/view-results" element={<PermRoute permId={PERMS.VIEW_RESULTS}>  <ViewResults />  </PermRoute>} />
              <Route path="/profile"      element={<PermRoute permId={PERMS.MANAGE_PROFILE}><Profile />      </PermRoute>} />
              <Route path="/contact"      element={<PermRoute permId={PERMS.MANAGE_PROFILE}><Contact />      </PermRoute>} />
            </Route>
          </Route>
        )}

        {/* ── Catch-all ──────────────────────────────────────── */}
        <Route path="*" element={<Navigate to="/not-found" replace />} />

      </Routes>
    </BrowserRouter>
  );
};

export default UserApp;