import { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import Box from "@mui/material/Box";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <Box className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <Box component="main" className="flex-1 h-screen overflow-y-scroll">
        {children}
      </Box>
    </Box>
  );
};