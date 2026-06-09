import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Plus,
  Ticket,
  Brain,
  Building2,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Sliders,
  Shield,
  GraduationCap,
  Contact,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/utils/checkauth";
import useIsLoginStore from "@/store/IsLoginStore";
import useSessionStore from "@/store/userSession";
import { Box, Button, IconButton } from "@mui/material";
import { brandColors } from "@/theme";

const BRAND   = brandColors.primary;      // #049F99
const HOVER   = brandColors.hoverBg;      // rgba(4,159,153,0.08)
const LIGHT   = brandColors.lightBg;      // rgba(4,159,153,0.1)
const BORDER  = "#e5e7eb";
const SIDEBAR_BG = "#ffffff";
const TEXT    = "#1a1a1a";
const TEXT_MUTED = "#6b7280";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admindashboard" },
  { icon: Plus, label: "Add Plan", path: "/add-plan" },
  { icon: Ticket, label: "Add Coupon", path: "/add-coupon" },
  { icon: Brain, label: "AI Pricing", path: "/ai-pricing" },
  { icon: Building2, label: "Check Institutes", path: "/institutes" },
  { icon: FileText, label: "Manage Exams", path: "/exams" },
  { icon: Users, label: "Manage Users", path: "/users" },
  { icon: BarChart3, label: "Reports", path: "/reports" },
  { icon: Sliders, label: "Feature Control", path: "/feature-control" },
  { icon: Shield, label: "Roles", path: "/roles" },
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: LogOut, label: "Contact info", path: "/Contact-info" },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useIsLoginStore();
  const clearUser = useSessionStore((state) => state.clearUser);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close on route change
  useEffect(() => { setIsMobileOpen(false); }, [location.pathname]);

  // Lock body scroll on mobile open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  const handleLogout = async () => {
    startLoading("Logging out...");
    try {
      const success = await logout();
      if (success) {
        clearUser();
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      stopLoading();
    }
  };

  const SidebarContent = ({ showClose = false }: { showClose?: boolean }) => (
    <Box
      sx={{
        width:           256,
        height:          "100%",
        backgroundColor: SIDEBAR_BG,
        borderRight:     `1px solid ${BORDER}`,
        display:         "flex",
        flexDirection:   "column",
        boxShadow:       showClose ? "2px 0 12px rgba(0,0,0,0.1)" : "none",
      }}
    >
      {/* ── Logo ── */}
      <Box
        sx={{
          px:             3,
          py:             2.5,
          borderBottom:   `1px solid ${BORDER}`,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <GraduationCap style={{ width: 30, height: 30, color: BRAND }} />
          <span style={{ fontSize: "1.375rem", fontWeight: 700, color: TEXT }}>
            Exami<span style={{ color: BRAND }}>fy</span>
          </span>
        </Box>

        {showClose && (
          <IconButton onClick={() => setIsMobileOpen(false)} size="small">
            <X style={{ width: 18, height: 18, color: TEXT_MUTED }} />
          </IconButton>
        )}
      </Box>

      {/* ── Admin Info ── */}
      <Box sx={{ px: 3, py: 1.5, borderBottom: `1px solid ${BORDER}` }}>
        <span style={{ fontSize: "0.8125rem", fontWeight: 500, color: TEXT_MUTED }}>
          Admin Shubham
        </span>
      </Box>

      {/* ── Navigation ── */}
      <Box
        component="nav"
        sx={{ flex: 1, p: 1.5, overflowY: "auto", display: "flex", flexDirection: "column", gap: 0.5 }}
      >
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display:         "flex",
                alignItems:      "center",
                gap:             10,
                padding:         "10px 14px",
                borderRadius:    8,
                fontSize:        "0.875rem",
                fontWeight:      500,
                textDecoration:  "none",
                transition:      "all 0.18s ease",
                backgroundColor: isActive ? BRAND       : "transparent",
                color:           isActive ? "#ffffff"   : TEXT,
                boxShadow:       isActive ? "0 2px 8px rgba(4,159,153,0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = LIGHT;
                  (e.currentTarget as HTMLElement).style.color = BRAND;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                  (e.currentTarget as HTMLElement).style.color = TEXT;
                }
              }}
            >
              <item.icon style={{ width: 18, height: 18, flexShrink: 0 }} />
              {item.label}
            </Link>
          );
        })}
      </Box>

      {/* ── Logout ── */}
      <Box sx={{ p: 1.5, borderTop: `1px solid ${BORDER}` }}>
        <Button
          onClick={handleLogout}
          fullWidth
          startIcon={<LogOut style={{ width: 18, height: 18 }} />}
          sx={{
            justifyContent:  "flex-start",
            textTransform:   "none",
            fontWeight:      500,
            fontSize:        "0.875rem",
            color:           "#f60f0f",
            borderRadius:    "8px",
            px:              1.75,
            py:              1.25,
            "&:hover":       { backgroundColor: "rgba(153, 148, 148, 0.08)" },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* ── Hamburger — top-left, only when sidebar is closed ── */}
      {!isDesktop && !isMobileOpen && (
        <IconButton
          onClick={() => setIsMobileOpen(true)}
          size="medium"
          sx={{
            position:        "fixed",
            top:             12,
            left:            12,
            zIndex:          1300,
            backgroundColor: SIDEBAR_BG,
            border:          `1px solid ${BORDER}`,
            "&:hover":       { backgroundColor: LIGHT },
          }}
        >
          <Menu style={{ width: 20, height: 20, color: TEXT }} />
        </IconButton>
      )}

      {/* ── Desktop sidebar — always visible ── */}
      {isDesktop && (
        <Box sx={{ maxHeight: "100vh", position: "sticky", top: 0, display: "flex" }}>
          <SidebarContent />
        </Box>
      )}

      {/* ── Mobile backdrop ── */}
      {!isDesktop && isMobileOpen && (
        <Box
          onClick={() => setIsMobileOpen(false)}
          sx={{
            position:        "fixed",
            inset:           0,
            zIndex:          1200,
            backgroundColor: "rgba(0,0,0,0.45)",
          }}
        />
      )}

      {/* ── Mobile drawer ── */}
      {!isDesktop && (
        <Box
          sx={{
            position:   "fixed",
            top:        0,
            left:       0,
            zIndex:     1250,
            height:     "100%",
            transform:  isMobileOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
          }}
        >
          <SidebarContent showClose />
        </Box>
      )}
    </>
  );
};
