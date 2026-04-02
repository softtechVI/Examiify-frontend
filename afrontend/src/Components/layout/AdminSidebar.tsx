import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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
  GraduationCap,
  Contact,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/utils/checkauth";
import useIsLoginStore from "@/store/IsLoginStore";
import { Box, Button } from "@mui/material";

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
  { icon: Settings, label: "Settings", path: "/settings" },
  { icon: Contact, label: "Contact info", path: "/Contact-info" },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useIsLoginStore();

  const handleLogout = async () => {
    startLoading("Logging out...");
    try {
      const success = await logout();
      if (success) {
        sessionStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      stopLoading();
    }
  };

  return (
    <Box className="w-64 max-h-[100vh] bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <Box className="p-6 border-b border-sidebar-border">
        <Box className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">
            Exami<span className="text-primary">fy</span>
          </span>
        </Box>
      </Box>

      {/* Admin Info */}
      <Box className="p-4 border-b border-sidebar-border">
        <p className="text-sm font-medium text-sidebar-foreground">Admin Shubham</p>
      </Box>

      {/* Navigation */}
      <Box component="nav" className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </Box>

      {/* Logout */}
      <Box className="p-2 border-t border-sidebar-border">
        <Button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </Box>
    </Box>
  );
};